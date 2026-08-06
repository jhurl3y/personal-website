# Spec: 2026 modernization and redesign

Status: draft for review
Branch: `feat/modernize-2026`

## 1. Context

`jameshurley.ie` is a single-page personal site last committed 2024-06-09. It is
Next.js 14.2.3 (Pages Router), React 18.2, MUI 5.15, ~3,000 LOC across 43 files.
It builds and deploys on Vercel. There are no tests, no linter, no formatter, and
no type checking.

Two years of drift have left the styling layer on a dead-end dependency
(`@mui/styles`, legacy JSS) that blocks every other upgrade, and a handful of
latent bugs that are invisible because nothing verifies behaviour.

## 2. Goals

1. Bring the dependency tree fully current (Next 16, React 19, MUI 9).
2. Replace the dead `@mui/styles`/JSS layer with MUI 9 `styled`/`sx`.
3. Migrate the codebase to TypeScript.
4. Redesign the visual layer along the **Atlantic** direction (section 6).
5. Fix the identified correctness bugs (section 7).
6. Improve performance: static rendering, font loading, image handling.
7. Add ESLint + Prettier with enforced scripts.

## 3. Non-goals

- **App Router migration.** Pages Router remains supported in Next 16. Combining
  a router migration with a React major, an MUI major, a TypeScript migration and
  a redesign in one PR is not reviewable. Deferred to a follow-up.
- **All automated tests — visual regression *and* unit/component.** Playwright was
  explicitly declined; no unit or component test layer is added either, since the repo
  has no test runner and standing one up is its own piece of work. Consequence: every
  behaviour this PR changes is verified by the enumerated manual pass in section 14 and
  by human review of the Vercel preview, not automatically. This is accepted risk,
  recorded so it is a decision and not an oversight. If you would rather have targeted
  component tests for the contact form and nav-offset logic, say so now — that is the
  cheapest point to add them.
- **CI via GitHub Actions.** Declined.
- Any change to hosting, domain, or the Formspree/Google Maps providers.

## 4. Dependency plan

Verified against the npm registry on 2026-08-06.

| Package | From | To | Notes |
|---|---|---|---|
| `next` | `latest` (resolved 14.2.3) | **pinned `16.3.0`** | `latest` is unpinned today — a real hazard. Requires Node ≥ 20.9.0. |
| `react` / `react-dom` | 18.2.0 | 19.2.8 | |
| `@mui/material` | 5.15 | 9.3.1 | Still Emotion-based; peers `@emotion/react` ^11.5, `@emotion/styled` ^11.3. |
| `@mui/icons-material` | 5.15 | **9.3.1** | Pinned to the same release as `@mui/material`. |
| `@mui/styles` | 5.15 | **removed** | Dead end. No v7+. Blocks everything. |
| `@emotion/react`, `@emotion/styled` | 11.x | 11.14.0 | |
| `@mui/material-nextjs` | *(absent)* | **added, 9.3.0** | Required by MUI's documented Pages Router SSR integration. Added in **step 5**. |
| `@emotion/cache` | *(absent)* | **added, 11.14.0** | Same — the Emotion cache the App/Document integration wires up. |
| `@emotion/server` | *(absent)* | **added, 11.11.0** | Same — server-side style extraction, replacing the deleted JSS `ServerStyleSheets`. |
| `@fortawesome/fontawesome-svg-core` | 6.5.2 | **7.3.1** | Major. Omitted from an earlier draft of this table. |
| `@fortawesome/free-solid-svg-icons` | 6.5.2 | **7.3.1** | Track core exactly. |
| `@fortawesome/react-fontawesome` | 0.2.2 | **3.5.0** | **Major rewrite of the React adapter** (0.2 → 3.5). Read its migration notes before starting; the `library.add()` pattern in `_app.js` (see 7.5) may not survive as-is. Highest-uncertainty upgrade in this table. |
| `react-vertical-timeline-component` | 3.6 | 4.0.0 | Major; verify React 19 compat. Replace if it fails. |
| `@vercel/analytics` | 1.3 | 2.0.1 | Major; import path may change. |
| `@vercel/speed-insights` | 1.0 | **2.0.0** | Exact version; no floating `latest`. |
| `react-spotify-embed` | 2.0 | 3.0.1 | Major. |
| `@react-google-maps/api` | 2.19 | 2.20.8 | Minor. |
| `sharp` | 0.33 | 0.35.3 | |
| `react-awesome-reveal` | 4.2 | 4.3.1 | |
| `react-device-detect` | 2.2.3 | **removed** | Sole call site is the incorrect `isBrowser` check (7.7). Once that is replaced, nothing imports it. |
| `react-twitter-embed` | 4.0.4 | **removed** | Imported nowhere. |
| `react-cookie-consent` | 9.0 | **removed** | Imported nowhere. Its `.cookie-banner-*` rules in `src/styles.css` are orphaned and go with it. |
| `react-transition-group` | *(undeclared)* | **added, ^4.4.5** | **Phantom dependency:** imported directly by `components/Transition/index.js:1` but absent from `package.json`; it resolves today only transitively via MUI. The MUI 5 → 9 rewrite can remove that transitive path and break the build. Must be declared explicitly. |
| `smoothscroll-polyfill` | 0.4.4 | **removed** | Native `scroll-behavior` is universally supported. Confirm before deleting. |
| `lodash.chunk`, `lodash.shuffle` | 4.2 | **removed** | Replace with local helpers; two packages for two trivial functions. |

**Upgrade ordering constraint.** MUI 5.15.19 (the pinned version) declares React peers
of `^17 || ^18` only. MUI **5.18.0** widens them to include `^19.0.0`. Step 4 must
therefore bump MUI within v5 to 5.18.0 *before* installing React 19, or the install
fails on peer resolution. This is why step 4 is "MUI 5.18, React 19" and not "React 19
on whatever MUI is present".

Node: `.nvmrc` 18 → **22**; `engines.node` `>=18` → **`>=22 <23`**. Not `>=20.9.0`:
declaring Node 20 as supported while shipping Node 22 types would reproduce exactly the
mismatch that got `@types/node` 26 rejected in section 11 — types permitting APIs a
valid declared runtime does not have. Node 20.9 is Next 16's floor, but it is not what
this project runs or type-checks against, so it is not claimed as supported.

Any dependency that fails against React 19 is replaced or vendored rather than
pinned back. Blocking on a stale transitive peer defeats the point of the PR.

## 5. Styling migration

`@mui/styles` is imported by **16 files**. The actual usage breakdown, counted from
source rather than inferred from import lines:

| API | Count | Location |
|---|---|---|
| `makeStyles(...)` | **13** | 12 `styles.js` modules + `components/index.js:14` |
| `withStyles(...)` | **1** | `components/Contact/index.js:45` (`StyledButton`) |
| `ThemeProvider` | 1 | `pages/_app.js:5` — wrong import, see 7.3 |
| `ServerStyleSheets` | 1 | `pages/_document.js:3` — JSS SSR collection |

(An earlier draft said "26 `makeStyles` calls"; that double-counted each file's import
line alongside its call site. The real figure is 13, and it had missed `withStyles`
entirely.)

All of it goes.

- `makeStyles` → `styled()` for reusable elements, `sx` for one-offs.
- **`withStyles` → `styled()`.** `components/Contact/index.js:45` wraps a Button in a
  HOC; it becomes a `styled(Button)` declaration. This is a distinct conversion from
  the `makeStyles` work and is easy to overlook because there is only one instance.
- `ThemeProvider` must come from `@mui/material/styles`, not `@mui/styles`
  (section 7.3).
- `_document.js`'s `ServerStyleSheets` JSS collection is deleted. MUI 9 + Emotion needs
  an Emotion cache provider for SSR. This is **not** hand-rolled: use MUI's documented
  Pages Router integration, which requires the three packages added in section 4
  (`@mui/material-nextjs` 9.3.0, `@emotion/cache` 11.14.0, `@emotion/server` 11.11.0).
  An earlier draft described the cache provider without listing its dependencies, which
  would not have installed.
- The custom `theme.colors` key is replaced by proper `palette` entries plus a
  typed `theme` module augmentation, so tokens are type-checked.
- Media queries currently written as raw `@media (min-aspect-ratio: ...)` keys in
  `Home/styles.js` move to theme breakpoints where they map cleanly; the
  aspect-ratio queries have no breakpoint equivalent and stay as raw queries.

## 6. Design: "Atlantic"

The organising idea: the westward arc **Galway → Dublin → San Francisco** is the
spine of the page, not a map buried in the contact section. Coordinates are used
as real structural labels because they encode something true — where the work
happened — rather than as decoration.

**Palette**

| Token | Hex | Role |
|---|---|---|
| `slate` | `#2B373B` | Primary surface, dark sections |
| `limestone` | `#E8E4DC` | Light surface, body background |
| `seaGlass` | `#7FA8A0` | Secondary accent **on dark surfaces only**, map routes |
| `deepSea` | `#2F5D57` | Links and accent text **on light surfaces** |
| `signal` | `#E4572E` | **Decorative marks only** — never text, never the sole carrier of meaning |
| `signalText` | `#A33A1B` | The accent when it must carry text on a light surface |
| `ink` | `#14110F` | Body text on light |
| `chalk` | `#FAFAF8` | Text on dark |

Contrast: every text/background pairing must meet WCAG AA (4.5:1 body, 3:1 large).
Computed, not assumed:

| Pairing | Ratio | Verdict |
|---|---|---|
| `seaGlass` on `limestone` | **2.07:1** | **Fails.** Originally specified for links — that was a real error, now corrected. |
| `seaGlass` on `slate` | 4.68:1 | Passes AA. This is the only surface `seaGlass` text is allowed on. |
| `deepSea` on `limestone` | 5.87:1 | Passes AA. Added specifically to give light surfaces a compliant link colour. |
| `ink` on `limestone` | **14.83:1** | Passes AAA. (An earlier draft said 14.97 — that applied the wrong sRGB linearization branch for values just above 0.04045.) |
| `chalk` on `slate` | **11.73:1** | Passes AAA. An earlier draft said 14.9:1 — also estimated rather than computed, also wrong. |
| `signal` on `limestone` | **2.90:1** | **Fails everything**, including the 3:1 non-text/large-text threshold. An earlier draft claimed 3.6:1 — that was estimated, not computed, and was wrong. `signal` is therefore restricted to purely decorative marks that carry no information and are not UI boundaries. |
| `signalText` on `limestone` | 5.21:1 | Passes AA. Added because the direction needs a usable accent for text and `signal` cannot be one. |
| `signal` on `slate` | 3.33:1 | **Non-text decorative marks only**, consistent with the token definition. The large-display-text allowance an earlier draft granted here contradicted `signal`'s own "never text" rule and is withdrawn — where the accent must be text on dark, use `chalk` or `seaGlass`. |

Every remaining pairing introduced during implementation is computed before use, not
eyeballed.

**Type** — named concretely so this is buildable without further decisions. All three
are OFL-licensed and available through `next/font/google`, self-hosted at build time.

| Role | Family | Weights | Notes |
|---|---|---|---|
| Display | **Archivo** (variable, `wdth` axis) | 600, 700 | Loaded via `next/font/google` as `Archivo` with `axes: ["wdth"]`, width set to **125** (the expanded end; the axis runs 62–125). There is no separate "Archivo Expanded" family on Google Fonts — it is one variable family. Latin subset only. |
| Body | **Source Sans 3** | 400, 600 | Humanist, pairs quietly with Archivo. Latin subset. |
| Data | **Source Sans 3** | 400 | No separate family. Coordinates and dates use `font-variant-numeric: tabular-nums` on the body face — one less font to download. |

Fallback stack: `system-ui, -apple-system, Segoe UI, sans-serif`, declared once in the
theme. Total added font weight budget: **≤ 90 KB** across all variants. The `wdth` axis
makes Archivo a variable font, so its payload must be **measured against the budget
after the first build**, not assumed — if it exceeds, drop Archivo 600 and ship 700
alone, and if it still exceeds, pin a static instance instead of the variable axis.

The current font setup is broken in two ways (7.8): `styles/global.css` declares Inter
but is never imported, while the theme and `_document.js` declare Roboto. The new scale
is defined once in the theme and nowhere else.

**Layout and signature**

- Hero: full-bleed photograph, name set large, a single coordinate eyebrow.
- Timeline: each role anchored to its city and coordinates; the vertical rule
  reads as a route line, replacing the current generic timeline component styling.
- Map: promoted from a contact-section afterthought to the closing element of the
  arc, showing all three cities connected.
- Signature: the coordinate/route spine running the full page.

**Motion**: one orchestrated page-load reveal on the hero, scroll-triggered
section reveals reusing `react-awesome-reveal`.

Under `prefers-reduced-motion: reduce`, **all four motion sources** are neutralised —
not just the reveals, which is all an earlier draft covered:

| Source | Location | Reduced-motion behaviour |
|---|---|---|
| Section reveals | `react-awesome-reveal` | No animation; content renders in place |
| Hero load sequence | new, §6 | Skipped |
| **Smooth anchor scrolling** | `components/Navbar/smoothAnchor.js:38-41`, `components/Layout/index.js:13-16` | **Instant jump**, `behavior: "auto"` |
| **Carousel slide transition** | `components/Home/Slider/index.js:33-39` | **Zero-duration** cross-fade; slides still change |

**Copy**: emoji are removed from `utils/strings.js` (6 occurrences) per the
project's no-emoji-in-production-UI rule. Tone and content otherwise unchanged;
this is not a copy rewrite.

## 7. Bug fixes

1. **`components/index.js:46`** — `setNavHeight(navRef.clientHeight)` reads
   `clientHeight` off the ref object, not the node. Always `undefined`, so every
   `Section offset` is falsy and the sticky-nav scroll offset never applies.
   Fix: `navRef.current?.clientHeight ?? 0`, and re-measure on resize.
2. **No-op keydown listeners in four files** — `addEventListener("keydown", () => null)`
   paired with a `removeEventListener` on a different function identity. Each does
   nothing and leaks on unmount. All four go:
   - `components/index.js:49,52`
   - `components/Experience/index.js:17,20`
   - `components/Contact/index.js:60,63`
   - `components/About/index.js:65,68`

   **Explicitly preserved:** `components/Home/index.js:124,128` registers a real named
   `onKeyDown` handler (carousel arrow-key navigation) with matching add/remove
   identities. Its *lifecycle* is correct and must not be swept up in this fix — but its
   *scope* is not; see 7.11.
11. **The carousel arrow-key handler is bound to `window`** (`components/Home/index.js:122-130`).
    Pressing left/right while typing in a contact-form field, or while any other element
    has focus, also advances the hero carousel further up the page. Matching listener
    identities fixed the leak but not the hijacking. Fix: ignore events originating from
    `input`, `textarea`, `select`, or `contenteditable` targets, and scope the handler to
    a focusable carousel region so it is keyboard-operable in the accessible sense rather
    than globally. Verified by case 19.
12. **Transport failures produce an empty error message**
    (`components/Contact/form/index.js:138-149`). Stated accurately after reading the
    code: there *is* an `else` branch that sets `status` to `"error"` and calls
    `handleError(xhr.responseText)`. Two earlier drafts of this spec described it wrongly.
    The actual defects are narrower:
    - On a network failure the request reaches `DONE` with `status === 0` and an **empty
      `responseText`**, so `handleError("")` renders a failure state with nothing in it.
    - There is **no explicit `onerror` handler**, so transport failure is only caught
      incidentally by the readystate path.
    - There is no submitting state, so a slow request looks like a dead button.

    Fix: an explicit `onerror`, plus a generic fallback message whenever `responseText`
    is empty or unparseable, so the failure state always says something. The form stays
    populated and re-submittable. Verified by cases 7a and 7b.
3. **`pages/_app.js`** — `ThemeProvider` imported from `@mui/styles` instead of
   `@mui/material`. Custom theme keys reach JSS but not MUI components.
4. **`next.config.js`** — enables the **styled-components** SWC transform on a
   project that uses **Emotion**. Wrong compiler option; remove it.
5. **`pages/_app.js`** — FontAwesome `library.add(...)` runs on every render.
   Move to module scope.
6. **`utils/helpers.js:41`** — `getFormspreeUrl()` does
   `process.env.FORMSPREE_TOKENS.split(",")` with no guard; an unset env var
   throws inside data fetching and 500s the whole page. Add a guard that degrades
   to a disabled contact form.
7. **`utils/helpers.js:27`** — `getBackgroundUrls()` branches on
   `react-device-detect`'s `isBrowser`, which reports *browser vs server*, not
   *desktop vs mobile*. Desktop and mobile image sets are therefore selected by
   render environment, not viewport. Fix with a CSS/`next/image` responsive
   source set.
8. **Fonts** — `styles/global.css` declares Inter but is never imported;
   `src/theme.js` and `_document.js` declare Roboto. Resolved by section 6.
9. **`utils/helpers.js:18`** — `getBackground()` creates object URLs via
   `URL.createObjectURL` that are never revoked, and bypasses image optimisation.
   Removed in favour of `next/image`.
10. **Missing-env behaviour is undefined.** Returning no Formspree URL does not by
    itself disable the contact form — `components/Contact/form/index.js` still calls
    `xhr.open(form.method, form.action)` and posts to an empty action. An absent
    Google Maps key has no fallback either. Required behaviour:
    - **Contact form:** when the Formspree URL is absent, render the form disabled
      with a short explanatory line, and make no network request.
    - **Map:** when the Maps key is absent, do not mount the loader; render a static
      fallback listing the three cities. No request to Google.
    - Both are typed so the absent case is a real state, not an empty string.

## 7a. Hero and remote images

Codex correctly flagged that section 6 described "a full-bleed photograph" while the
existing UI is a **carousel** of 6 images pulled from a hardcoded S3 bucket. Resolving
that ambiguity now, before planning:

- **The carousel survives.** It is the most characteristic thing on the page and the
  Atlantic direction is built around the photography. It gains the typographic overlay
  and the coordinate eyebrow; it does not become a single static image.
- **Remote images require config.** `next.config.js` currently has no
  `images.remotePatterns`. Using `next/image` against
  `hurley-site-images.s3-eu-west-1.amazonaws.com` will fail without it. That entry is
  added as part of step 8.
- Arrow-key and dot navigation, and the existing `onKeyDown` handler, are retained.
- Only the first slide is preloaded; the rest are lazy. **Use `preload`, not `priority`** —
  Next 16 deprecates the `priority` prop in favour of `preload`, so writing `priority`
  would introduce deprecated code as part of a modernization.
- **Alt text — decided, not left to the implementer.** The image identifiers are
  `one`…`fourteen` (`constants.js:18-43`), which carry no descriptive information, so an
  implementer has nothing to write meaningful alternatives from. Resolution:
  - The carousel is **not** purely decorative — the about copy invites the reader to
    "scroll through the pictures above", and it has keyboard and dot navigation. So
    `alt=""` would be wrong.
  - Introduce a typed `HERO_IMAGES` manifest in `constants.ts`, replacing the two bare
    string arrays (`BACKGROUNDS`, 14 ids, and `MOBILE_BACKGROUNDS`, 7 ids). `location`
    also feeds the Atlantic coordinate treatment, so this earns its place twice.

    ```ts
    type HeroImage = {
      id: string;              // existing identifier ("one"…"fourteen"), or "first"
      alt: string;             // "" in the decorative fallback; see open question 15.4
      location?: string;       // e.g. "Connemara, Galway" — feeds the coordinate eyebrow.
                               // OPTIONAL: absent in the fallback path, where no
                               // per-slide eyebrow renders and the hero shows the
                               // static "53°N → 37°N" arc label instead.
      desktopSrc: string;      // DESKTOP_IMAGE_PATH + id + ".jpg"
      mobileSrc?: string;      // present only for the 7 ids that exist in the mobile bucket
    };
    ```

    **The local first slide is part of this manifest.** `components/Home/index.js:40-45`
    prepends `FIRST_IMAGE_PATH` (`first_image.webp`, `constants.js:45`) as slide zero,
    separately from the 14 remote ids. It is the `priority` image and currently has no
    alt text or location either. It becomes a `HeroImage` entry like any other, with a
    local `desktopSrc`. It counts toward the description total in open question 15.4.

    **Slide counts, order, and randomisation** — stated exactly, because the previous
    draft left all three ambiguous:

    | | Desktop | Mobile |
    |---|---|---|
    | Slide 0 (priority) | local `first_image.webp` | local `first_image.webp` |
    | Following slides | 6 from the remote set | 6 from entries having `mobileSrc` |
    | Total | 7 | 7 |

    - **The local slide is pinned to position 0 on both viewports** and is exempt from
      the `mobileSrc` rule — it is a local asset served at both sizes via `next/image`
      responsive widths. An earlier draft's rules would have dropped it on mobile
      entirely, losing the priority image. It gets `mobileSrc` omitted but is never
      filtered out.
    - Preserves today's behaviour: one local slide plus six remote.
    - **Randomisation is retained but moved client-side.** The existing `shuffle` runs
      per render, which under static generation would either freeze the order or cause
      a hydration mismatch. Instead: the server renders slide 0 only (the local priority
      image, deterministic). After mount, the remaining six are shuffled once and
      appended. The chosen set is held in state for the visit, so it is stable across
      re-renders. No `Math.random()` runs during SSR or hydration.
    - **Descriptions required: 8** (local slide + the 7 mobile-capable ids), matching
      open question 15.4. Not 15 — the 7 desktop-only images are unselectable under the
      rule above, so metadata for them would be unused.
    - An entry without `mobileSrc` is never served on mobile — it is skipped, not
      fallen back to the (much larger) desktop asset.
    - **Selection draws only from mobile-capable entries, on every viewport.** A desktop
      visitor who resizes or rotates into the mobile breakpoint would otherwise be left
      holding slides with no permitted mobile source — the set is fixed for the visit, so
      it cannot be repaired after the fact. Sampling from the 7-entry mobile-capable pool
      universally removes the failure mode entirely, at the cost of the desktop carousel
      drawing from 7 rather than 14 images. That trade is deliberate: resample-on-resize
      would swap images under the visitor mid-visit, which is worse. If the desktop-only
      images matter, the fix is to add mobile crops for them, not to branch the logic.
    - This is **art direction**, not just responsive sizing: the two buckets are
      differently cropped, so it needs `<picture>`/`next/image` with explicit sources
      rather than a single `sizes` attribute. This replaces the broken `isBrowser`
      branch in 7.7.
  - **Resolved.** James confirmed the photographs are all travel shots, and the S3
    bucket is reachable, so the images were retrieved and identified directly rather
    than guessed at. The manifest below is the content, ready to implement:

    | id | Location | `alt` |
    |---|---|---|
    | `first` | Table Mountain, Cape Town | Standing on the edge of Table Mountain looking down over Table Bay and the city of Cape Town at dusk |
    | `one` | Cape Peninsula, Cape Town | Sitting on a stone wall above the Atlantic on the Cape Peninsula coast road, with a mountain headland in the haze behind |
    | `two` | National Mall, Washington DC | Standing on the Capitol terrace with the National Mall and the Washington Monument stretching away behind |
    | `three` | Grand Ole Opry, Nashville | Outside the floodlit Grand Ole Opry House in Nashville at night |
    | `four` | Universal Studios, Los Angeles | In front of the waterfall beneath the Universal Studios Hollywood entrance sign |
    | `five` | Golden Gate Bridge, San Francisco | Leaning on the red railing of the Golden Gate Bridge with the San Francisco skyline across the bay |
    | `six` | Universal Studios, Los Angeles | Beside the "Welcome to Springfield" sign in the Simpsons area of Universal Studios Hollywood |
    | `seven` | Machu Picchu, Peru | Standing above the Machu Picchu ruins with cloud breaking over the mountains behind |

  - **Design refinement this unlocks.** The photographs are *global* travel (South
    Africa, USA, Peru), not the Galway → Dublin → San Francisco career arc. That does
    not weaken the Atlantic direction — it sharpens it into two complementary uses of
    geography: the **hero coordinates change per slide** to show range, while the
    **timeline spine holds the westward career arc**. Each slide's eyebrow shows its own
    location and coordinates.
  - **Two caveats worth your call** (neither blocks): `four` and `six` are both
    Universal Studios Hollywood, so the 7-image mobile pool contains a duplicate
    location; and that pool is what the desktop carousel now draws from too. If the
    desktop-only images (`eight`…`fourteen`) hold more variety, adding mobile crops for
    them is the fix — see section 4 of this list.
  - **Defined fallback if he declines:** treat the carousel as a decorative backdrop —
    `alt=""`, `aria-hidden` on the images, and remove the keyboard/dot controls so it
    is not an interactive element with no accessible content. The gallery framing in
    the about copy would then be reworded. This is the worse outcome, recorded so the
    implementer is never blocked.
- The S3 bucket is outside this repo's control; see open question 15.1.

## 8. Performance

- **`pages/index.js` uses `getServerSideProps` solely to read two env vars.** This
  forces SSR on every request for a page whose content is static, defeating CDN
  caching. Move to `getStaticProps`. The Google Maps key and Formspree URL are
  client-visible by nature; `getStaticProps` does not change their exposure.

  **Four values are not actually static, and freezing them is a real behaviour
  change.** Each is resolved explicitly:

  | Value | Today | After |
  |---|---|---|
  | Spotify playlist (`getSpotifyPlaylist`, `helpers.js:24`) | Re-shuffled per request | Playlist chosen **after mount**, and the Spotify iframe is mounted **once**, only after that choice resolves. Until then the server renders a fixed-height skeleton, never a first iframe. See the note below. |
  | Age (`getAge`, called with the literal `"1994/07/14"` at `components/About/rightRail/index.js:19`) | Computed at render | **Stays dynamic, computed client-side only.** The intro copy reads naturally with a live age and it costs nothing to keep. Rendered inside the same client-only boundary as the year. |
  | Copyright year (`components/Footer`) | Computed at render | **Client-side computation.** Decided, not optional: a static range would need editing by hand and a build-time year silently goes stale on 1 January. |
  | Formspree token (`getFormspreeUrl`, `helpers.js:39-43`) | Randomly shuffled from `FORMSPREE_TOKENS` per request | **Build-time selection, explicitly accepted.** The rotation exists to spread submissions across free-tier quotas; freezing it per deploy is a real behaviour change. Rotating client-side is rejected — it would require shipping *every* token to the browser, which is strictly worse. If quota becomes a problem, the fix is one paid form, not client-side rotation. |

  **The Spotify iframe must mount once.** Server-rendering a deterministic first
  playlist and swapping it after mount would initialise one third-party iframe and then
  immediately replace it with another — two Spotify loads per visit, which is worse than
  the problem being solved. The skeleton-then-single-mount approach above avoids that.

  Without this, a static build pins the playlist until the next deploy and can hydrate
  a stale year or age. ISR was considered and rejected: it adds a revalidation window
  to solve a problem that client-side computation solves exactly.
- Self-host fonts via `next/font`, removing a render-blocking third-party request.
- Serve hero/background images through `next/image` with correct `sizes`, and
  **`preload` on the first hero slide only** (not `priority`, which Next 16 deprecates).
- **Image assets, corrected.** An earlier draft targeted `first_image.jpg` (524 KB) and
  `about.png` (504 KB). Neither is referenced by any code — they are **dead assets** and
  are simply deleted (section 9). The file actually served is
  **`first_image.webp` at 624 KB** (`constants.js:45`), which is the real problem and was
  not previously targeted. `about.webp` is 42 KB and is fine.
  - Target: `first_image.webp` re-encoded to **≤ 150 KB**, with responsive widths at
    640 / 1280 / 1920 and AVIF alongside WebP. Recorded as a hard number so it can be
    checked rather than eyeballed.
- Remove the three dead dependencies (section 4) from the client bundle.

## 9. Dead code removal

Verified by repository-wide search, not assumed:

- `styles/global.css` and `styles/Home.module.css` — imported by nothing.
- **Garmin surface, complete:** `fetchGarmin()` (`helpers.js:63`), `filterObject()`
  (`helpers.js:74`, a Garmin-era allowlist helper with no remaining callers),
  `GARMIN_API_DEV`, `GARMIN_API_PROD`, `MAP_ZOOM_GARMIN` (`constants.js:61`), the
  Garmin chart/allowlist constants, the ~20 Garmin keys in `aboutStrings`, and the
  `garminContent` style (`About/styles.js:34`).
- **All `.react-reveal` selectors** — `src/styles.css:1` *and*
  `components/About/styles.js:30` (`"& > .react-reveal"`). Both target a
  `react-reveal` v3 class that `react-awesome-reveal` v4 does not emit.
- `.twitter-timeline` in `src/styles.css` — targets a removed dependency.
- `.cookie-banner-*` rules in `src/styles.css` — orphaned once
  `react-cookie-consent` goes (section 4).
- **Unreferenced image assets** — `public/static/assets/images/first_image.jpg`
  (524 KB) and `public/static/assets/images/about.png` (504 KB). Neither is referenced
  by any code; the served files are the `.webp` variants. Roughly 1 MB of dead weight
  in the repo. Deleted in the step 2 commit.

Each removal is confirmed with a repo-wide grep before deletion, and the grep results
are what justify it — not inference from the name.

## 10. TypeScript migration

- `tsconfig.json` in `strict` mode.
- All `.js` under `pages/`, `components/`, `utils/`, `src/` become `.ts`/`.tsx`.
- MUI theme augmentation for the custom palette tokens.
- No `any` in committed code; `unknown` plus narrowing where a type is genuinely
  not known. Third-party gaps get a typed local declaration, not a blanket
  `@ts-ignore`.

## 11. Tooling

The repo currently has **no `devDependencies` block at all**. Step 1 creates it. Exact
versions, verified against the registry on 2026-08-06, so the first commit is
reproducible:

| Package | Version |
|---|---|
| `typescript` | **`6.0.3`** — *not* 7.x. `typescript-eslint@8.66.0` declares `typescript: ">=4.8.4 <6.1.0"`; pinning TypeScript 7.0.2 is a hard peer conflict and the parser does not support it. Revisit when typescript-eslint widens the range. |
| `eslint` | `10.8.0` |
| `eslint-config-next` | `16.3.0` (matches the Next target exactly) |
| `typescript-eslint` | `8.66.0` |
| `eslint-config-prettier` | `10.1.8` |
| `prettier` | `3.9.6` |
| `@types/react` | `19.2.18` |
| `@types/react-dom` | `19.2.4` |
| `@types/node` | **`22.20.1`** — matched to the Node 22 runtime, not the latest (26.x). Types ahead of the runtime would let code type-check against APIs that do not exist in production. |

**ESLint config format: flat config** (`eslint.config.mjs`). ESLint 10 defaults to flat
and the legacy `.eslintrc` path is gone; `typescript-eslint` 8 and `eslint-config-next`
16 both ship flat-compatible entry points. This is stated because "add ESLint" is
ambiguous between the two formats and they are not interchangeable.

**Ordering caveat — two distinct hazards, both handled:**

1. *Typecheck.* `@types/react` 19.x and `eslint-config-next` 16 presuppose the React 19 /
   Next 16 targets from step 4. Step 1 adds the scripts and config **without making
   `typecheck` a gate**; it becomes a gate from step 6 onward.
2. *Lint during build.* **Next 14 runs ESLint as part of `next build`**, and build-time
   linting is not removed until Next 16. Dropping ESLint 10 + flat config +
   `eslint-config-next` 16 into a still-Next-14 repo can therefore break the build in
   step 1 — before the framework upgrade that makes the combination valid. Handling:
   step 1 sets **`eslint.ignoreDuringBuilds: true`** in `next.config.js` and runs ESLint
   only via `npm run lint`. **Step 4 removes that setting** as part of the Next 16
   upgrade, since Next 16 no longer lints at build time. Without this, step 1 is not the
   "no behaviour change" commit it claims to be.

- Scripts: `lint`, `lint:fix`, `format`, `format:check`, `typecheck`.
- Applied as one mechanical formatting commit, kept separate from logic changes
  so the review diff stays readable.

## 12. Risks

| Risk | Mitigation |
|---|---|
| Redesign + 4 majors + TS in one PR is a very large diff | Sequenced commits (section 13); each stage independently reviewable. |
| No visual regression safety net (declined) | Vercel preview deploy reviewed by James before merge. Recorded as accepted risk. |
| `react-vertical-timeline-component` may not support React 19 | Replace with a hand-rolled timeline — the Atlantic direction restyles it heavily anyway, reducing its value. |
| MUI 5 → 9 spans four majors | Follow each upgrade guide in order; the JSS rewrite is required regardless, so most churn is unavoidable. |
| Env vars unavailable locally → cannot fully run the site | Fix #7.6 makes missing env degrade gracefully instead of crashing, which also unblocks local dev. |

## 13. Sequencing

Each step is a separate commit and a separate Codex review gate.

1. Tooling: ESLint, Prettier, `tsconfig`, `.nvmrc` → 22, `engines` → **`>=22 <23`**.
   No behaviour change.
2. Dead code removal (section 9); drop `react-twitter-embed` and `react-cookie-consent`
   (both imported nowhere, so removal is safe on its own); **declare
   `react-transition-group`**.

   **`lodash.chunk`, `lodash.shuffle` and `smoothscroll-polyfill` still have live call
   sites** — `utils/helpers.js:3`, `components/Home/index.js:16`, and
   `components/Navbar/smoothAnchor.js:3`. Dropping them as a standalone commit breaks
   the build. Their replacements must land in *this same commit*: local `chunk`/`shuffle`
   helpers, and deletion of the polyfill import plus its `SmoothScroll.polyfill()` call
   in favour of native `scroll-behavior`.
3. Bug fixes that are stack-independent: **7.1–7.4, 7.6, 7.11, 7.12, and the behavioural half of 7.10**.
   **7.5 is deliberately excluded** and lands in 4a instead — moving `library.add()` to
   module scope is pointless work if the react-fontawesome 3.x rewrite changes the
   initialisation API, so it is done once, with the upgrade.
   (form disabled + no request, map fallback + no request). Reviewable in isolation, on
   the existing stack. The *typed* half of 7.10 — representing absence as a real state
   in the prop/state contract rather than an empty string — cannot land here because
   TypeScript arrives in step 6; it is completed there.
4. Framework upgrade: **MUI 5.15 → 5.18 first**, then Next 16 + React 19 (see the
   ordering constraint in section 4).
4a. **FontAwesome trio**, as its own reviewable commit: core + icons 6.5.2 → 7.3.1 and
   the react-fontawesome 0.2.2 → 3.5.0 adapter rewrite. Separated from step 4 because
   it is the highest-uncertainty upgrade and should not be entangled with the Next/React
   diff. **Solely owns 7.5** (`library.add()` at module scope) — not shared with step 3 —
   since the adapter rewrite may replace that initialisation pattern outright.
4b. **Remaining low-risk dependency upgrades**, one commit: `@vercel/analytics` 2.0.1,
   `@vercel/speed-insights` 2.0.0, `react-spotify-embed` 3.0.1,
   `@react-google-maps/api` 2.20.8, `sharp` 0.35.3, `react-awesome-reveal` 4.3.1, and
   `react-vertical-timeline-component` 4.0.0 (the one with replacement risk — see §12).
   No dependency in section 4 is left without a stage.
5. MUI 5.18 → 9 and the full `@mui/styles` → `styled`/`sx` rewrite.
6. TypeScript migration. **Completes the typed half of 7.10** — missing Formspree URL
   and Maps key become explicit union states rather than empty strings.
7. Redesign: Atlantic tokens, type scale, layout, motion. **Resolves 7.8** (the font
   inconsistency), since the new scale replaces both broken declarations.
8. Performance: `getStaticProps` + **all four determinism fixes** (Spotify single-mount,
   client-side age, client-side year, and accepted build-time Formspree token
   selection), `next/font`,
   `images.remotePatterns`, responsive image rewrite, image re-encoding.
   **Resolves 7.7 and 7.9**, which depend on this architecture and cannot land earlier.

Fixes 7.7, 7.8 and 7.9 are deliberately *not* in step 3. An earlier draft claimed all
of section 7 landed there, which was not achievable — 7.7 and 7.9 require the
`next/image` responsive architecture from step 8, and 7.8 is resolved by the step 7
type scale. Attempting them in step 3 would mean writing code twice.

## 14. Verification

Automated tests were declined (section 3). "All four sections render" does not
exercise any of the behaviour this PR actually changes, so the manual cases below are
enumerated per changed behaviour and **must each be walked**, in both env
configurations. This list is the substitute for a test suite; if it feels long, that
is the cost of the declined test option, not padding.

**Gates**

- `npm run build` succeeds.
- `npm run lint`, `npm run format:check`, `npm run typecheck` clean.
- Lighthouse before/after on the production build, reported in the PR.

**Manual cases — env vars present**

| # | Behaviour | Expected | Fix under test |
|---|---|---|---|
| 1 | Click each nav link | Section lands below the sticky nav, not under it | 7.1 |
| 2 | Resize window, click nav again | Offset re-measured, still correct | 7.1 |
| 3 | Carousel arrow keys + dots | Slides advance both ways; dots track | preserved `onKeyDown` |
| — | **Cases 3 and 19 apply only on the descriptions-supplied path.** If the §15.4 decorative fallback ships instead, they are replaced by: images carry `alt=""` and `aria-hidden`, **no carousel controls are present**, no arrow-key handler is registered, and the `aboutStrings.intro` copy no longer invites browsing. Exactly one of the two branches is walked, and the PR states which. | | 7a/§15.4 |
| 4 | Tab through the whole page | Focus ring always visible, order sensible | quality floor |
| 5 | Submit contact form, valid input | Success state shown | 7.10 |
| 6 | Submit contact form, invalid email | Inline validation, no request sent | 7.10 |
| 7a | Formspree returns a genuine non-2xx (stub a 500) | Visible failure state; form still populated and re-submittable | **7.12** |
| 7b | Network failure / offline (XHR status 0, or `onerror` fires) | The **generic fallback message** renders — not a blank error box — because `responseText` is empty on this path. Form stays populated and re-submittable. (The error *branch* already exists; what is being verified is that it says something.) | **7.12** |
| 8 | Map renders with all three cities | Route line visible | design §6 |
| 9 | OS reduced-motion on | **All four** motion sources neutralised: no reveals, no hero sequence, nav links jump instantly (not smooth-scroll), carousel changes with zero transition | §6 motion table |
| 19 | Focus a contact-form field, press ← / → | Caret moves within the field; **hero carousel does not advance** | 7.11 |
| 10 | 375 / 768 / 1440 px | No overflow, hero legible at each | design §6 |

**Manual cases — env vars absent** (`FORMSPREE_TOKENS` and `GOOGLE_MAPS_API_KEY` unset)

| # | Behaviour | Expected | Fix under test |
|---|---|---|---|
| 11 | Both absent — page loads | No 500; renders fully | 7.6 |
| 12 | Both absent — contact form | Disabled with explanation; **no network request** in devtools | 7.10 |
| 13 | Both absent — map area | Static city-list fallback; **no request to Google** | 7.10 |
| 13a | **Only `FORMSPREE_TOKENS` absent** | Form disabled, **map still fully works** | 7.10 |
| 13b | **Only `GOOGLE_MAPS_API_KEY` absent** | Map falls back, **form still fully works** | 7.10 |

Cases 13a and 13b exist because a naive implementation can disable both integrations
when either variable is missing. Each must degrade independently.

**Additional gates**

| # | Check | Expected |
|---|---|---|
| 15 | Age and copyright year on the rendered page | Both current; no hydration warning in console |
| 16 | Network tab, About section | **Exactly one** Spotify iframe request per visit |
| 17 | Measured font payload after build | **≤ 90 KB** total. A build gate, not an estimate — if exceeded, apply the §6 fallbacks |
| 18 | Hero image weight | **≤ 150 KB applies to the worst-case served response** — the 1920px WebP transform, measured in the network tab on the production build. Not the source file, and not the AVIF variant (which will be smaller). The source `first_image.webp` may remain larger on disk if `next/image` never serves it untransformed. |

**Case 14 — external image failure:** block the S3 host in devtools. The hero must
degrade to a background colour with the overlay still legible, not collapse to zero
height.

All results reported plainly in the PR, including failures.

## 15. Open questions

1. Do you have the original background photography at higher resolution? The
   hero currently pulls from a hardcoded S3 bucket
   (`hurley-site-images.s3-eu-west-1.amazonaws.com`) that this repo does not
   control. If that bucket ever disappears the hero breaks. Worth moving into
   `public/` or a managed image host.
2. The CV says "2021 - present" for the SurveyMonkey ML role. Still accurate?
4. ~~**Hero image descriptions**~~ — **RESOLVED.** All 8 written; see the manifest in
   §7a. The decorative fallback is no longer needed and that branch of the verification
   matrix does not apply.

   **Still open:** whether to add mobile crops for the 7 desktop-only images
   (`eight`…`fourteen`). Today they are never rendered, so the carousel draws from 7
   photos of which 2 are the same location (Universal Studios). Adding crops would
   restore the full 14 and need 7 more descriptions. Default if you say nothing: ship
   with the 7.

   **Default if they are not supplied by the time step 8 begins:** the decorative
   fallback ships — `alt=""`, `aria-hidden` on the imagery, carousel controls removed,
   and the "scroll through the pictures above" line in `aboutStrings.intro` reworded.
   **In fallback mode the hero renders the local slide only** and skips remote selection
   and loading entirely. Appending six remote images behind removed controls would
   download roughly a megabyte the visitor can never reach — there is no autoplay today
   and none is being added.
   No further approval needed to take that path; silence resolves to it. Supplying the
   descriptions later is a small follow-up PR, not a rework.

   (An earlier draft called this both "design-blocking" and "never blocking", which was
   a contradiction. The above is the resolution: it blocks *quality*, not *progress*.)

3. ~~`getAge()` birth date location~~ — resolved. The date is not in `constants.js`;
   it is a hardcoded literal `"1994/07/14"` at `components/About/rightRail/index.js:19`.
   Decision (section 8): the live age is kept, computed client-side, and the literal
   moves into `constants.ts` so it is not buried in a component.
