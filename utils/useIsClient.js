import { useSyncExternalStore } from "react";

// Never resubscribes - the value flips once at hydration and never changes.
const subscribe = () => () => {};

/**
 * True once hydrated, false during SSR and the first client render.
 *
 * Lets a component compute a client-only value *during render* instead of
 * setting state in a mount effect, which avoids both the extra render and the
 * React Compiler's cascading-render warning. Use it for deterministic values
 * (dates, viewport reads). Values that must stay stable across re-renders -
 * anything randomised - still need state, since recomputing on every render
 * would change them.
 */
export const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
