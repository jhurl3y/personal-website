Brings a site last touched in June 2024 onto a current stack, fixes 14 bugs, and clears the dependency that was blocking everything else.

**This PR is Tasks 1–6 of a 10-task plan. Tasks 7–9 (TypeScript, redesign, performance) are not included** — see _What is not here_ below.

## What changed

|                            | Before            | After                                |
| -------------------------- | ----------------- | ------------------------------------ |
| next                       | `latest` → 14.2.3 | **pinned 16.3.0**                    |
| react / react-dom          | 18.2.0            | 19.2.8                               |
| @mui/material              | 5.15.19           | 9.3.1                                |
| @mui/styles                | 5.15.19           | **removed**                          |
| FontAwesome core / adapter | 6.5.2 / 0.2.2     | 7.3.1 / 3.5.0                        |
| Node                       | `>=18` (EOL)      | `>=22 <23`                           |
| Tooling                    | none              | ESLint 10 flat, Prettier 3, tsconfig |

`"next": "latest"` was unpinned — any `npm install` could have jumped majors silently.

**`@mui/styles` is gone.** It was legacy JSS, dead past MUI 6, and imported by 16 files. Emotion SSR now uses MUI's documented Pages Router integration on both sides; 88 style tags are inlined at SSR, so there's no flash of unstyled content. All 13 `makeStyles` modules and the one `withStyles` HOC became `sx`/`styled`, and all 14 legacy `<Grid item xs>` sites moved to `<Grid size={{...}}>` (MUI 9 removed the legacy Grid).

**Dead code:** the entire Garmin integration (never called), the unimported `styles/` directory, ~1 MB of unreferenced images, dead CSS, and five unused dependencies. First Load JS 250 kB → 244 kB before the MUI major.

## Bugs fixed — 18

Nine were found reading the code; nine only by tooling and review added here.

1. **Sticky-nav offset never applied** — read `clientHeight` off the ref object, not the node, so it was always `undefined`. Now also re-measures on resize.
2. **Four leaking no-op keydown listeners** — `removeEventListener` used a different function identity, so they never detached.
3. **`ThemeProvider` imported from `@mui/styles`** — custom theme keys never reached MUI components.
4. **styled-components SWC transform** enabled on an Emotion project.
5. **`library.add()` inside the component body** — re-registered every icon on every render.
6. **Unset `FORMSPREE_TOKENS` 500'd the whole page** — `.split()` on `undefined` inside data fetching.
7. **Carousel arrow keys bound to `window`** — typing in the contact form advanced the hero. Now scoped to a focusable `role="region"`.
8. **Form failures rendered a blank box** — `handleError` only matched `"empty"`/`"email"`, so a 500 body or a status-0 transport failure showed nothing. Added a generic fallback in an `aria-live` region, an explicit `onerror`, and a submitting state.
9. **Form and map didn't degrade independently** — either missing key could disable both.
10. **Every slide shared one ref object** — `new Array(n).fill(React.createRef())` puts the _same_ ref in every slot, so `slideWidth()` never measured the slide it thought it did. _(Found by the new linter.)_
11. **`Box` system props silently dead** — MUI 9 removed shorthand props, so `<Box display="flex" mb={2}>` rendered with none of those styles. _(Found only by `tsc`; build and runtime both passed.)_
12. **Duplicate breakpoint key** — `About/styles.js` declared `[theme.breakpoints.down("sm")]` twice, so the second overwrote the first and a mobile rule never applied.
13. **Stray backtick** rendering after the charSet meta tag in `Layout`.
14. **`#888888` caption text at 2.9:1** — failed WCAG AA. Replaced with a computed 5.82:1 token.

Four more were regressions this migration introduced, caught by Codex review of the branch diff before push. In each, an `sx` callback reached a prop expecting a class-name string, so React serialized the _function_ into the `class` attribute and the styles vanished:

15. **Navbar layout, colours and sticky background** — the `Container`, the raw `<nav>`, the blog link, `PrettyLink` and the `MobileMenu` icon.
16. **The map collapsed to zero height** — `styles.map` travelled through a `mapClasses` prop onto a raw `div`, so the `40vh`/`50vh` rule never generated.
17. **All four contact inputs lost their background and text colour** — passed via `InputProps.className`.
18. **CV link used `ink` on `slate`** — a pairing the theme itself documents as invalid.

Verified after the fix: zero serialized functions in `class` attributes, and Emotion SSR style tags rose **88 → 104**, which is precisely the dropped styling now applying.

## Design

The Atlantic palette landed early, because `theme.colors` has no MUI equivalent and the `styled` conversions needed real tokens. Every pairing is **computed, not estimated** — three earlier estimates were wrong:

| Pairing              | Ratio   |                             |
| -------------------- | ------- | --------------------------- |
| ink / limestone      | 14.83:1 | AAA                         |
| chalk / slate        | 11.73:1 | AAA                         |
| deepSea / limestone  | 5.87:1  | AA — links on light         |
| mist / limestone     | 5.82:1  | AA — muted text             |
| seaGlass / slate     | 4.68:1  | AA — accent on dark only    |
| seaGlass / limestone | 2.07:1  | **fails — never use**       |
| signal / limestone   | 2.90:1  | **fails — decorative only** |

The full Atlantic layout, type scale and motion work is Task 8 and is not in this PR.

## Verification

No automated tests exist and none were added — an explicitly accepted decision, recorded in the spec. Verification is manual.

**Gates:** `build` ✅ · `lint` ✅ (0 errors, 3 pre-existing `exhaustive-deps` warnings) · `format:check` ✅ · `typecheck` — not a gate, see below.

**Lighthouse** (pinned 12.8.2, desktop preset, identical flags both runs):

|                | before | after  |        |
| -------------- | ------ | ------ | ------ |
| performance    | 99     | 98     | −1     |
| accessibility  | 95     | **98** | **+3** |
| best-practices | 74     | 74     | 0      |
| SEO            | 100    | 100    | 0      |

The −1 on performance is noise on an already-99 desktop score, and **the performance work is Task 9, which is not in this PR**. Accessibility is up from the carousel region, the aria-live error region, and the contrast fixes. Best-practices is unchanged at 74; the failing audits are third-party cookies and console errors from the Spotify/Maps embeds.

**Env degradation, verified by request:**

| Case                 | Result                                        |
| -------------------- | --------------------------------------------- |
| Both vars unset      | HTTP 200 (was a 500)                          |
| Both unset — form    | Disabled with explanation, no network request |
| Both unset — map     | Static city fallback, no request to Google    |
| Only Formspree unset | Form disabled, **map still works**            |
| Only Maps key unset  | Map falls back, **form still works**          |

**Codex review** of the full branch diff: converged to `NO_FINDINGS` after one round that caught four real regressions (15–18 above).

**Not verified:** the full manual matrix from spec §14 — keyboard focus order, reduced-motion, and the 375/768/1440 breakpoints — needs a human on the preview deploy. **The MUI 9 styling rewrite is the highest-risk change here.** Four of its regressions were invisible to the build, the runtime and Lighthouse, and only turned up in review; please give the rendered pages a real look rather than trusting the green gates.

## What is not here

- **Task 7 — TypeScript.** Started and deliberately reverted. The renames produced **202 type errors**, 133 of them implicit-`any` props needing interfaces across ~26 components. Landing a half-migrated tree with a failing `typecheck` gate would have been worse than not starting. The attempt paid for itself by surfacing bug 11 above.
- **Task 8 — the Atlantic redesign** (layout, type scale, hero coordinates, motion). Only the palette landed.
- **Task 9 — performance**: `getStaticProps`, `next/font`, responsive images, the 624 KB hero re-encode, and the `priority` → `preload` migration across 18 images.

Suggested order: **9, then 7, then 8** — 9 is smallest with the most user-visible gain, and 8 reviews far better against a typed codebase.

## Also worth knowing

- The hero images live in an S3 bucket this repo doesn't control. If it disappears, the hero breaks.
- Those mobile images are ~300 KB each at 1440×2560 — oversized for phones. Out of scope (external bucket).
- The carousel draws from 7 mobile-capable images, two of which are the same location. Restoring the other seven means adding mobile crops.
- All 8 hero images now have written alt text and locations (Cape Town ×2, Washington DC, Nashville, Los Angeles ×2, San Francisco, Machu Picchu), ready for Task 8.

Spec: `docs/modernization-spec.md` · Plan: `docs/superpowers/plans/2026-08-06-modernization.md`
