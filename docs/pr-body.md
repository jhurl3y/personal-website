Completes the modernization plan: Tasks 7, 8 and 9, plus the two visual issues from the merged preview.

Branched off `main` at `f7fb535` (the squash merge of #2), pulled fresh.

## Lighthouse

Same pinned Lighthouse 12.8.2, desktop preset, identical flags. Baseline is the pre-modernization site.

|                | before #2 | now     |         |
| -------------- | --------- | ------- | ------- |
| performance    | 99        | **100** | +1      |
| accessibility  | 95        | **98**  | +3      |
| best practices | 74        | **96**  | **+22** |
| SEO            | 100       | 100     | —       |

LCP **0.7s**, FCP **0.2s**. Best practices moved on the deprecated-API and console-error audits.

## Task 9 — performance

The page is now **prerendered as static HTML**. It was server-rendered on every request purely to read two env vars.

Four values weren't actually static, and each is handled rather than frozen:

- **Spotify playlist** is no longer a prop. The server renders a fixed-height skeleton and the iframe mounts **exactly once**, after the playlist is picked client-side. Rendering one and swapping it would have loaded two Spotify iframes per visit.
- **Age and copyright year** compute during render behind a new `useIsClient()` built on `useSyncExternalStore` — no extra render, no hydration mismatch when a date rolls over.
- **Formspree token** is build-time, accepted. Rotating client-side would ship every token to the browser.

Replaces the two bare id arrays with a `HERO_IMAGES` manifest carrying alt text, a location and coordinates per slide — the carousel finally has real alternative text, **7 slides with 7 unique descriptions**.

Fixes two spec bugs: `getBackgroundUrls` branched on `react-device-detect`'s `isBrowser`, which reports _server vs browser_, not _desktop vs mobile_, so the image set was chosen by render environment; and `getBackground()` handed back `URL.createObjectURL` blobs that were never revoked. Both gone, `react-device-detect` uninstalled.

Hero re-encoded 4032×2268 / 609 KB → 2560×1440 / 354 KB. Served responses are AVIF: **1920px = 102 KB**, inside the 150 KB budget. Removed the deprecated `priority` prop from all 18 sites; only the LCP hero preloads.

**One bug found in the browser:** slides 1–6 never loaded at all. Native `loading="lazy"` only re-evaluates on scroll and resize, not on transform changes, so a `translateX` carousel never triggers it. (The blob-fetch removed above was incidentally what used to pull them in.)

## Task 7 — TypeScript

All 42 files are `.ts`/`.tsx`, `tsc --noEmit` is clean, `typecheck` is a gate. **No `any`, no `@ts-ignore`.** `react-vertical-timeline-component` ships no types, so it gets a local declaration covering only the props used here.

Absent env values are typed `string | null` rather than `""`, so the degraded state is compiler-enforced rather than a convention.

**It found four defects that the build, runtime, linter and Lighthouse all passed:**

1. **`styles.button` has never existed.** Contact references it for the Galway / San Francisco links; it isn't in `Contact/styles` and never was (it was `classes.button` before, equally undefined). Those links have been rendering unstyled.
2. **Those links were 2.84:1** — `seaGlass` on `deepSea`, below AA. Now `chalk` at 7.12:1.
3. **MUI 9 removed `direction="column"` from `Grid`** (it subdivides columns by design; the docs point at `Stack`). The About right rail's vertical layout was silently a no-op.
4. **Footer icons passed `width="40px"`** to `next/image`, which wants a number.

That's now three MUI 9 breaking changes the upgrade swallowed silently — system props on `Box` (in #2), the legacy `Grid` API, and `Grid direction`. Each surfaced only under type checking.

## Task 8 — Atlantic design direction

**Type:** Archivo for display, Source Sans 3 for body, self-hosted via `next/font`. Coordinates and dates sit on tabular figures from the body face rather than a third family.

The direction called for Archivo at the expanded end of its `wdth` axis. The variable font costs **87 KB against 14 KB** for the static 700 — 116 KB served vs 42 KB, over the 90 KB budget. **Took the budget:** 74 KB is a real cost and the width difference is subtle at display sizes. `font-stretch` would be inert on a static instance, so it's removed rather than left as a misleading no-op.

**Hero (the signature):** the name set large with the coordinates of wherever the current photograph was taken sitting above it, changing as you move through the carousel — so it reads as somewhere actually been, not a caption. Positioned in the lower third: these photographs all put subject and horizon near the middle, so centred type lands on both, and low means the copy falls on darker ground where it's legible without a scrim.

**Route line:** the timeline's rule is a 1px `seaGlass` hairline carrying the hero's eyebrow rule down the page. Icons keep their employer brand colours — those encode information the palette shouldn't flatten.

**Reduced motion** now covers all four sources, not just the reveals: `react-awesome-reveal`, the hero, carousel transitions, and programmatic smooth scrolling. `window.scroll({behavior:"smooth"})` ignores the CSS `scroll-behavior` override, so `smoothAnchor` checks the media query itself.

## The two issues from the merged preview

- **Timeline blue** was a hardcoded `COLORS.lightBlue` (`#2194f3`), not the library CSS as first reported. The Task 6 conversion only rewrote `theme.colors.*` inside style modules, so three direct `COLORS.*` imports survived. Cards are now limestone on ink.
- **Spotify was the narrow 300px player.** Two compounding causes: v3 computes `width = wide ? "100%" : 300` so it needs `wide`, _and_ its Grid container sat in a `display:flex` parent so it shrank to content width. Fixing either alone wouldn't have worked.

## Verification

`build` ✅ · `lint` ✅ (0 errors, 2 pre-existing `exhaustive-deps` warnings) · `format:check` ✅ · `typecheck` ✅

Every stage verified in Chrome against a production build, not just SSR — that's what missed the client-only crashes in #2. Confirmed: 7/7 hero slides load, age renders "32 year old", copyright shows the current year, 5 timeline cards, Spotify 640×450, contact map 527px, city links `chalk`, route line 1px `seaGlass`, no console errors, no hydration mismatches.

**Still worth your eyes:** keyboard focus order and the 375/768 breakpoints. I checked reduced-motion CSS ships but did not emulate the preference end to end.

Spec: `docs/modernization-spec.md` · Plan: `docs/superpowers/plans/2026-08-06-modernization.md`
