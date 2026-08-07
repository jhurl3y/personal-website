import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../src/theme";
import ContactForm from "./index";

/**
 * These cover the behaviour that kept breaking silently: the form posting with
 * no destination, and failures rendering an empty box. Every one of them maps
 * to a bug that shipped.
 */

type XhrStub = {
  open: ReturnType<typeof vi.fn>;
  send: ReturnType<typeof vi.fn>;
  setRequestHeader: ReturnType<typeof vi.fn>;
  readyState: number;
  status: number;
  responseText: string;
  onreadystatechange: (() => void) | null;
  onerror: (() => void) | null;
};

let xhr: XhrStub;

const renderForm = (formspree: string | null) =>
  render(
    <ThemeProvider theme={theme}>
      <ContactForm formspree={formspree} />
    </ThemeProvider>
  );

/** Fill every field with values that pass validation. */
const fillValidly = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/first name/i), "James");
  await user.type(screen.getByLabelText(/last name/i), "Hurley");
  await user.type(screen.getByLabelText(/email/i), "james@example.com");
  await user.type(
    screen.getByLabelText(/question/i),
    "This message is comfortably longer than twenty characters."
  );
};

/**
 * Drive the stubbed request to completion with a given status and body.
 * Wrapped in act(): the handler sets state from outside React's event system,
 * so without it the re-render never flushes and the assertions see stale DOM.
 */
const respond = async (status: number, responseText = "") => {
  await act(async () => {
    xhr.status = status;
    xhr.responseText = responseText;
    xhr.readyState = 4;
    xhr.onreadystatechange?.();
  });
};

beforeEach(() => {
  xhr = {
    open: vi.fn(),
    send: vi.fn(),
    setRequestHeader: vi.fn(),
    readyState: 0,
    status: 0,
    responseText: "",
    onreadystatechange: null,
    onerror: null,
  };
  // A plain arrow cannot be called with `new`, so this has to be a function.
  // The readystate constants matter: the component guards on
  // `readyState !== XMLHttpRequest.DONE`, and without DONE on the stub that
  // comparison is against undefined and the handler returns every time.
  function XMLHttpRequestStub(this: unknown) {
    return xhr;
  }
  XMLHttpRequestStub.UNSENT = 0;
  XMLHttpRequestStub.OPENED = 1;
  XMLHttpRequestStub.HEADERS_RECEIVED = 2;
  XMLHttpRequestStub.LOADING = 3;
  XMLHttpRequestStub.DONE = 4;

  vi.stubGlobal(
    "XMLHttpRequest",
    XMLHttpRequestStub as unknown as typeof XMLHttpRequest
  );
});

afterEach(() => vi.unstubAllGlobals());

describe("when Formspree is unavailable", () => {
  // Bug 7.10: a missing token used to leave a live form posting to "".
  it("explains why and disables submission", () => {
    renderForm(null);
    expect(
      screen.getByText(/contact form is unavailable/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
  });

  it("makes no request even if a submit is forced", async () => {
    const { container } = renderForm(null);
    const form = container.querySelector("form");
    if (form?.requestSubmit) {
      form.requestSubmit();
    } else {
      form?.dispatchEvent(new Event("submit"));
    }
    await waitFor(() => expect(xhr.send).not.toHaveBeenCalled());
  });
});

describe("when Formspree is configured", () => {
  it("enables submission and shows no unavailable notice", () => {
    renderForm("https://formspree.io/abc");
    expect(
      screen.queryByText(/contact form is unavailable/i)
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled();
  });

  it("does not send while fields are invalid", async () => {
    const user = userEvent.setup();
    renderForm("https://formspree.io/abc");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() =>
      expect(screen.getAllByText(/can't be empty/i).length).toBeGreaterThan(0)
    );
    expect(xhr.send).not.toHaveBeenCalled();
  });

  it("rejects a malformed email", async () => {
    const user = userEvent.setup();
    renderForm("https://formspree.io/abc");
    await fillValidly(user);
    await user.clear(screen.getByLabelText(/email/i));
    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() =>
      expect(screen.getByText(/email is not valid/i)).toBeInTheDocument()
    );
    expect(xhr.send).not.toHaveBeenCalled();
  });

  it("sends once every field is valid", async () => {
    const user = userEvent.setup();
    renderForm("https://formspree.io/abc");
    await fillValidly(user);
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => expect(xhr.send).toHaveBeenCalledTimes(1));
  });

  it("thanks the sender on success", async () => {
    const user = userEvent.setup();
    renderForm("https://formspree.io/abc");
    await fillValidly(user);
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => expect(xhr.send).toHaveBeenCalled());
    await respond(200);
    await waitFor(() => expect(screen.getByText(/thank/i)).toBeInTheDocument());
  });

  // Bug 7.12, the exact shape of it: handleError only ever recognised "empty"
  // and "email", so a 500 body matched neither branch and the user saw nothing.
  it("surfaces a message for an unrecognised server error", async () => {
    const user = userEvent.setup();
    renderForm("https://formspree.io/abc");
    await fillValidly(user);
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => expect(xhr.send).toHaveBeenCalled());
    await respond(500, "<html>Internal Server Error</html>");
    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert.textContent?.trim().length ?? 0).toBeGreaterThan(0);
    });
  });

  // A transport failure reaches DONE with status 0 and an empty body, which is
  // what used to render a blank error box.
  it("surfaces a message when the request never reaches the server", async () => {
    const user = userEvent.setup();
    renderForm("https://formspree.io/abc");
    await fillValidly(user);
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => expect(xhr.send).toHaveBeenCalled());
    await respond(0, "");
    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert.textContent).toMatch(/went wrong/i);
    });
  });

  it("surfaces a message when onerror fires", async () => {
    const user = userEvent.setup();
    renderForm("https://formspree.io/abc");
    await fillValidly(user);
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => expect(xhr.send).toHaveBeenCalled());
    await act(async () => {
      xhr.onerror?.();
    });
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toMatch(/went wrong/i)
    );
  });

  it("leaves the form re-submittable after a failure", async () => {
    const user = userEvent.setup();
    renderForm("https://formspree.io/abc");
    await fillValidly(user);
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => expect(xhr.send).toHaveBeenCalled());
    await respond(500, "boom");
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled();
  });
});
