import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getAge,
  getHeroSlides,
  getFormspreeUrl,
  getGoogleMapsKey,
} from "./helpers";
import { HERO_IMAGES, NUMBER_OF_IMAGES } from "./constants";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.useRealTimers();
});

describe("getAge", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-06T12:00:00Z"));
  });

  it("counts full years elapsed", () => {
    expect(getAge("1994/07/14")).toBe(32);
  });

  // The birthday-not-yet-reached branch is the one that silently goes wrong.
  it("does not count the current year before the birthday", () => {
    expect(getAge("1994/12/25")).toBe(31);
  });

  it("counts the year on the birthday itself", () => {
    expect(getAge("1994/08/06")).toBe(32);
  });
});

describe("getFormspreeUrl", () => {
  it("returns null when the env var is absent", () => {
    delete process.env.FORMSPREE_TOKENS;
    expect(getFormspreeUrl()).toBeNull();
  });

  // Bug 7.6: this used to call .split on undefined and 500 the whole page.
  it("returns null rather than throwing on an empty value", () => {
    process.env.FORMSPREE_TOKENS = "";
    expect(() => getFormspreeUrl()).not.toThrow();
    expect(getFormspreeUrl()).toBeNull();
  });

  it("returns null when the value is only separators", () => {
    process.env.FORMSPREE_TOKENS = ",,,";
    expect(getFormspreeUrl()).toBeNull();
  });

  it("builds a url from one of the configured tokens", () => {
    process.env.FORMSPREE_TOKENS = "abc,def";
    const url = getFormspreeUrl();
    expect(url).toMatch(/^https:\/\/formspree\.io\/(abc|def)$/);
  });
});

describe("getGoogleMapsKey", () => {
  it("returns null when absent, never an empty string", () => {
    delete process.env.GOOGLE_MAPS_API_KEY;
    expect(getGoogleMapsKey()).toBeNull();
  });

  it("returns null for an empty value so the map falls back", () => {
    process.env.GOOGLE_MAPS_API_KEY = "";
    expect(getGoogleMapsKey()).toBeNull();
  });
});

describe("getHeroSlides", () => {
  it("always leads with the local slide", () => {
    for (let i = 0; i < 20; i++) {
      expect(getHeroSlides()[0].id).toBe(HERO_IMAGES[0].id);
    }
  });

  it("returns the local slide plus NUMBER_OF_IMAGES others", () => {
    expect(getHeroSlides()).toHaveLength(NUMBER_OF_IMAGES + 1);
  });

  it("never repeats a slide", () => {
    const ids = getHeroSlides().map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // Every slide is rendered, so a missing description is a real gap rather
  // than a cosmetic one. This is what stops one being added without alt text.
  it("gives every slide non-empty alt text, a location and coordinates", () => {
    for (const slide of HERO_IMAGES) {
      expect(slide.alt.length).toBeGreaterThan(20);
      expect(slide.location).toBeTruthy();
      expect(slide.coords).toMatch(/\d+\.\d+°[NS]\s+\d+\.\d+°[EW]/);
    }
  });
});
