import { describe, it, expect } from "vitest";
import { findIconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { IconName } from "@fortawesome/fontawesome-svg-core";

// Importing providers for its side effect is the whole point of this file.
import "./providers";

// The icons are looked up by string at render time (`icon="arrow-left"`), so
// they only resolve if something registered them in the same module graph as
// the components doing the rendering - which is the client one. This lived in
// layout.tsx for one release, and because layout.tsx is a server component the
// registration never reached the browser: every icon on the site silently
// rendered nothing. Moving it back there would pass a typecheck and a build,
// so this test is the thing standing in the way.
describe("FontAwesome registration", () => {
  const registered: IconName[] = [
    "code",
    "heartbeat",
    "train",
    "users",
    "envelope",
    "phone",
    "arrow-left",
    "arrow-right",
  ];

  it.each(registered)("registers %s in the client bundle", (name) => {
    expect(findIconDefinition({ prefix: "fas", iconName: name })).toBeDefined();
  });
});
