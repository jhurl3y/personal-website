import App from "../components";
import { getFormspreeUrl, getGoogleMapsKey } from "../utils/helpers";

/**
 * A server component, so the env vars are read at build time and never reach
 * the client bundle as source. This is what getStaticProps used to do; there
 * is no data-fetching hook to declare because reading process.env is all it
 * ever did.
 *
 * `spotify` is deliberately absent: the playlist is randomised and picking it
 * here would pin it to the deployment. It is chosen after mount instead.
 *
 * The Formspree token IS frozen per deploy, and that is accepted - rotating it
 * client-side would mean shipping every token to the browser.
 */
export default function Page() {
  return <App formspree={getFormspreeUrl()} maps={getGoogleMapsKey()} />;
}
