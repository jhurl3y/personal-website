# Personal Website Modernization + Atlantic Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `jameshurley.ie` from a 2-year-stale Next 14 / React 18 / MUI 5 Pages Router app to Next 16 / React 19 / MUI 9 in TypeScript, fix 12 identified bugs, and reskin it in the "Atlantic" design direction.

**Architecture:** Ten sequential tasks on `feat/modernize-2026`, each an independently reviewable commit. Order is forced by two hard constraints: the `@mui/styles` JSS layer must die before MUI can move, and MUI must reach 5.18 before React 19 installs. Stack-independent bug fixes land early on the old stack so they are reviewable in isolation; fixes that need the new image architecture land late by necessity.

**Tech Stack:** Next.js 16.3.0 (Pages Router), React 19.2.8, MUI 9.3.1 + Emotion, TypeScript 6.0.3, ESLint 10 flat config, Prettier 3.

**Source of truth:** `docs/modernization-spec.md`. Where this plan and the spec disagree, the spec wins — but report the disagreement rather than silently picking one.

## Global Constraints

- Node runtime **22**; `.nvmrc` = `22`; `engines.node` = `>=22 <23`. Never `>=20.9.0`.
- **No emoji in production UI.** `utils/strings.js` currently has 6; they go.
- Every dependency version is **pinned exactly** — no `latest`, no bare `9.x`.
- **No `any`** in committed code. Use `unknown` plus narrowing.
- Every text/background colour pairing must meet **WCAG AA** (4.5:1 body, 3:1 large) and must be **computed, not estimated**.
- All motion respects `prefers-reduced-motion` — reveals, hero sequence, anchor scrolling, and carousel transition.
- Use **`preload`**, never `priority`, on `next/image` (deprecated in Next 16).
- There is **no test runner and none is being added** (declined). Verification is the manual matrix in spec §14. Every task states its own manual check.
- Work only on `feat/modernize-2026`. Never commit to `main`.
- Run `npm run lint` and `npm run format:check` before every commit from Task 1 onward; `npm run typecheck` from Task 7 onward.

---

## File Structure

**Created:**
- `eslint.config.mjs` — flat ESLint config
- `.prettierrc`, `.prettierignore` — formatting
- `tsconfig.json` — strict TypeScript
- `src/types/theme.d.ts` — MUI theme module augmentation
- `docs/lighthouse-before.json`, `docs/lighthouse-after.json` — perf baseline and result
- `docs/pr-body.md` — PR description assembled during Task 10
- `utils/array.ts` — local `chunk`/`shuffle`, replacing two lodash packages

**Deleted:**
- `styles/global.css`, `styles/Home.module.css` — imported by nothing
- `public/static/assets/images/first_image.jpg`, `about.png` — unreferenced, ~1 MB
- All 12 `components/**/styles.js` — absorbed into their components as `styled`/`sx`

**Heavily modified:**
- `pages/_app.js` → `.tsx`, `pages/_document.js` → `.tsx` — provider and SSR rewiring
- `components/Home/index.js` → `.tsx` — carousel, the largest single rewrite
- `utils/constants.js` → `.tsx` — gains the `HERO_IMAGES` manifest

---

## Task 1: Tooling foundation

**Files:**
- Create: `eslint.config.mjs`, `.prettierrc`, `.prettierignore`, `tsconfig.json`
- Modify: `package.json`, `.nvmrc`, `next.config.js`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:check`, `npm run typecheck`

**Critical:** Next 14 runs ESLint during `next build`. Installing ESLint 10 + flat config + `eslint-config-next` 16 into a still-Next-14 repo **breaks the build**. `eslint.ignoreDuringBuilds: true` is mandatory here and is removed in Task 5.

- [ ] **Step 1: Install dev dependencies at exact versions**

```bash
npm install -D --save-exact \
  typescript@6.0.3 \
  eslint@10.8.0 \
  eslint-config-next@16.3.0 \
  typescript-eslint@8.66.0 \
  eslint-config-prettier@10.1.8 \
  prettier@3.9.6 \
  @types/react@19.2.18 \
  @types/react-dom@19.2.4 \
  @types/node@22.20.1
```

TypeScript is **6.0.3, not 7.x** — `typescript-eslint@8.66.0` declares `typescript: ">=4.8.4 <6.1.0"` and 7.x is a hard peer conflict.

- [ ] **Step 2: Create `eslint.config.mjs`**

```js
import nextVitals from "eslint-config-next/core-web-vitals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier/flat";

export default tseslint.config(
  { ignores: [".next/**", "node_modules/**", "out/**"] },
  ...nextVitals,
  ...tseslint.configs.recommended,
  prettier,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  }
);
```

- [ ] **Step 3: Create `.prettierrc` and `.prettierignore`**

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "printWidth": 80
}
```

`.prettierignore`:
```
.next
node_modules
out
package-lock.json
```

- [ ] **Step 4: Create `tsconfig.json` in strict mode**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

`allowJs: true` is required — the repo is still all JavaScript until Task 7.

- [ ] **Step 5: Add scripts and bump engines in `package.json`**

```json
"scripts": {
  "build": "next build",
  "dev": "next dev",
  "start": "next start",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "typecheck": "tsc --noEmit"
},
"engines": { "node": ">=22 <23" }
```

- [ ] **Step 6: Set `.nvmrc` to `22`**

```
22
```

- [ ] **Step 7: Disable build-time linting in `next.config.js`**

```js
module.exports = {
  eslint: { ignoreDuringBuilds: true },
};
```

Also **remove `compiler.styledComponents`** — spec bug 7.4. The project uses Emotion; that transform is the wrong knob and has never done anything useful here.

- [ ] **Step 8: Format the entire repo in one mechanical pass**

```bash
npm run format
```

Keep this separate from logic changes so later diffs stay readable.

- [ ] **Step 9: Capture the Lighthouse baseline — before anything changes**

This must happen **now**, while the working tree still contains the old implementation. By Task 10 it is nine commits gone.

Pin Lighthouse exactly — an unversioned `npx lighthouse` can resolve to different releases for the two runs, making the scores incomparable. Wait for readiness and always clean up the server:

```bash
npm install -D --save-exact lighthouse@12.8.2

npm run build
npm run start & SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null' EXIT

# Wait for readiness, bounded. Launching Lighthouse immediately races the server
# start; an unbounded wait hangs forever if the server dies or never binds.
for i in $(seq 1 60); do
  kill -0 $SERVER_PID 2>/dev/null || { echo "server exited"; exit 1; }
  curl -sf http://localhost:3000 >/dev/null && break
  [ "$i" = 60 ] && { echo "server not ready after 60s"; exit 1; }
  sleep 1
done

npx --no-install lighthouse http://localhost:3000 \
  --preset=desktop \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless" \
  --output=json --output-path=./docs/lighthouse-before.json

kill $SERVER_PID; trap - EXIT
```

Verify the pinned version resolves before relying on it; if 12.8.2 is unavailable, pin whatever `npm view lighthouse version` reports and record it. Task 10 must re-run with **identical** version, preset, viewport, throttling, and run count. Commit the JSON so the baseline survives the nine intervening commits.

- [ ] **Step 10: Verify build and lint**

```bash
npm run build && npm run lint && npm run format:check
```
Expected: both succeed. `typecheck` is **not** a gate yet — it cannot pass until Task 7.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: add TypeScript, ESLint, Prettier tooling"
```

**Manual check:** `npm run dev`, load the page, confirm it renders exactly as before. This task must have zero visible effect.

---

## Task 2: Dead code and dependency pruning

**Files:**
- Delete: `styles/global.css`, `styles/Home.module.css`, `public/static/assets/images/first_image.jpg`, `public/static/assets/images/about.png`
- Create: `utils/array.ts`
- Modify: `utils/helpers.js`, `utils/constants.js`, `utils/strings.js`, `components/Home/index.js`, `components/Navbar/smoothAnchor.js`, `components/About/styles.js`, `src/styles.css`, `package.json`

**Interfaces:**
- Consumes: Task 1's tooling
- Produces: `chunk<T>(arr: T[], size: number): T[][]`, `shuffle<T>(arr: T[]): T[]` from `utils/array.ts`

**Critical:** `lodash.chunk`, `lodash.shuffle` and `smoothscroll-polyfill` have **live call sites**. Their replacements must land in this same commit or the build breaks.

- [ ] **Step 1: Create `utils/array.ts`**

```ts
/** Split an array into consecutive chunks of at most `size`. */
export const chunk = <T>(arr: T[], size: number): T[][] => {
  if (size < 1) throw new Error("chunk size must be >= 1");
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

/** Fisher-Yates shuffle. Returns a new array; does not mutate the input. */
export const shuffle = <T>(arr: T[]): T[] => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};
```

- [ ] **Step 2: Repoint the three call sites**

- `utils/helpers.js:3` — `import shuffle from "lodash.shuffle"` → `import { shuffle } from "./array"`
- `components/Home/index.js:16` — `import chunk from "lodash.chunk"` → `import { chunk } from "../../utils/array"`
- `components/Navbar/smoothAnchor.js:3` — delete the `smoothscroll-polyfill` import and its `SmoothScroll.polyfill()` call. Native `scroll-behavior` is universally supported.

- [ ] **Step 3: Remove the complete Garmin surface**

Verified dead by repo-wide grep — confirm each with `grep -rn` before deleting:
- `utils/helpers.js` — `fetchGarmin()`, `filterObject()`
- `utils/constants.js` — `GARMIN_API_DEV`, `GARMIN_API_PROD`, `MAP_ZOOM_GARMIN`, Garmin chart/allowlist constants
- `utils/strings.js` — the ~20 Garmin keys in `aboutStrings`
- `components/About/styles.js` — the `garminContent` rule

- [ ] **Step 4: Remove dead CSS and files**

- `src/styles.css` — delete `.twitter-timeline`, `.react-reveal`, and all `.cookie-banner-*` rules
- `components/About/styles.js:30` — delete the `"& > .react-reveal"` selector
- Delete `styles/global.css` and `styles/Home.module.css` (imported by nothing)
- Delete `public/static/assets/images/first_image.jpg` and `about.png` (unreferenced, ~1 MB)

- [ ] **Step 5: Remove emoji from `utils/strings.js`**

Six occurrences. Rewrite the affected strings so they read naturally without the emoji — do not just delete the character and leave a double space. `heartRate: "Heart Rate ❤️"` → `heartRate: "Heart Rate"`, and so on.

- [ ] **Step 6: Update dependencies**

```bash
npm uninstall lodash.chunk lodash.shuffle smoothscroll-polyfill \
  react-twitter-embed react-cookie-consent
npm install --save-exact react-transition-group@4.4.5
```

`react-transition-group` is a **phantom dependency** — `components/Transition/index.js:1` imports it directly but it is absent from `package.json`, resolving only transitively through MUI. The MUI rewrite in Task 6 can sever that path.

- [ ] **Step 7: Verify nothing references the removed symbols**

```bash
grep -rn "lodash\.\|smoothscroll\|twitter-embed\|CookieConsent\|fetchGarmin\|filterObject\|MAP_ZOOM_GARMIN\|react-reveal" --include="*.js" --include="*.css" . | grep -v node_modules
```
Expected: no output.

- [ ] **Step 8: Build and commit**

```bash
npm run build && npm run lint && npm run format:check
git add -A
git commit -m "chore: remove dead code, prune and correct dependencies"
```

**Manual check:** all four sections still render; nav anchor links still scroll; the About Spotify embed still loads.

---

## Task 3: Stack-independent bug fixes

**Files:**
- Modify: `components/index.js`, `components/About/index.js`, `components/Experience/index.js`, `components/Contact/index.js`, `components/Home/index.js`, `utils/helpers.js`, `components/Contact/form/index.js`, `components/Map/index.js`

**Interfaces:**
- Consumes: Task 2's `utils/array.ts`
- Produces: `getFormspreeUrl(): string | null`, `getGoogleMapsKey(): string | null` — both now nullable, which Task 7 turns into typed union states

Spec fixes **7.1, 7.2, 7.3, 7.4, 7.6, 7.11, 7.12** and the behavioural half of **7.10**. Fix 7.5 is deliberately excluded — it belongs to Task 5 with the FontAwesome rewrite.

- [ ] **Step 1: Fix the nav-height ref bug (7.1)**

`components/index.js:46` reads `clientHeight` off the ref object, not the node, so it is always `undefined` and the sticky-nav offset never applies.

```js
useEffect(() => {
  const measure = () => setNavHeight(navRef.current?.clientHeight ?? 0);
  measure();
  window.addEventListener("resize", measure);
  return () => window.removeEventListener("resize", measure);
}, []);
```

- [ ] **Step 2: Delete the four no-op keydown listeners (7.2)**

`addEventListener("keydown", () => null)` paired with a `removeEventListener` on a *different* function identity — does nothing, never cleans up. Remove from:
- `components/index.js:49,52`
- `components/Experience/index.js:17,20`
- `components/Contact/index.js:60,63`
- `components/About/index.js:65,68`

**Do not touch `components/Home/index.js:124,128`** — that is a real named `onKeyDown` handler for carousel navigation. It is fixed differently in Step 3.

- [ ] **Step 3: Scope the carousel key handler to a focusable region (7.11)**

Bound to `window` today, so arrow keys anywhere on the page — including while typing in the contact form — advance the hero carousel. **Filtering out form fields is not sufficient**; the spec requires the handler scoped to the carousel itself, so arrows do nothing when focus is elsewhere.

Remove the `window` listener entirely and bind to a focusable container:

```jsx
<div
  role="region"
  aria-roledescription="carousel"
  aria-label="Travel photographs"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === LEFT_KEY) { e.preventDefault(); previous(); }
    else if (e.key === RIGHT_KEY) { e.preventDefault(); next(); }
  }}
>
  {/* slides */}
</div>
```

The container needs a visible focus ring (verification case 4).

- [ ] **Step 4: Fix the ThemeProvider import (7.3)**

`pages/_app.js:5` — `import { ThemeProvider } from "@mui/styles"` → `from "@mui/material/styles"`. The JSS provider does not feed MUI components.

- [ ] **Step 5: Guard the env readers (7.6, 7.10 behavioural half)**

```js
export const getFormspreeUrl = () => {
  const tokens = process.env.FORMSPREE_TOKENS;
  if (!tokens) return null;
  const list = tokens.split(",").filter(Boolean);
  if (list.length === 0) return null;
  return `${FORMSPREE_URL}/${shuffle(list)[0]}`;
};

export const getGoogleMapsKey = () => process.env.GOOGLE_MAPS_API_KEY || null;
```

Today `tokens.split(",")` on an unset var **throws inside data fetching and 500s the whole page**.

- [ ] **Step 6: Make the form and map degrade independently (7.10)**

- `components/Contact/form/index.js` — when `formspree` is `null`, render the form disabled with a short line explaining the form is unavailable, and **make no network request**.
- `components/Map/index.js` — when `maps` is `null`, do not mount the loader; render a static list of the three cities. **No request to Google.**

They must degrade **independently**: one missing variable must not disable the other integration.

- [ ] **Step 7: Surface form submission failures (7.12)**

The existing `onreadystatechange` *does* have an `else` branch setting `"error"` — the defect is narrower. On transport failure the request reaches `DONE` with `status === 0` and an **empty `responseText`**, so `handleError("")` renders a blank failure box. There is also no explicit `onerror` and no submitting state.

**`handleError` cannot render a generic message.** Read `components/Contact/form/index.js:38` — it only branches on `errorMessage.includes("empty")` and `.includes("email")`, mapping to per-field errors. Passing it a generic string matches neither branch and **renders nothing at all**. A new piece of state is required; reusing `handleError` does not work.

```js
const FALLBACK_ERROR =
  "Something went wrong sending your message. Please try again.";

const [submitError, setSubmitError] = useState(null);
const [isSubmitting, setIsSubmitting] = useState(false);

const finish = (message) => {
  setIsSubmitting(false);
  if (message) { setStatus("error"); setSubmitError(message); }
};

setIsSubmitting(true);
setSubmitError(null);

xhr.onerror = () => finish(FALLBACK_ERROR);

xhr.onreadystatechange = () => {
  if (xhr.readyState !== XMLHttpRequest.DONE) return;
  if (xhr.status === 200) {
    form.reset();
    setStatus("success");
    setIsSubmitting(false);
  } else {
    // handleError only recognises "empty" and "email". A 500 HTML body or any
    // unfamiliar JSON matches neither, so it must report whether it actually
    // produced a field error — otherwise nothing renders at all (case 7a).
    const matched = xhr.responseText ? handleError(xhr.responseText) : false;
    finish(matched ? null : FALLBACK_ERROR);
    setStatus("error");
  }
};
```

Change `handleError` to `return true` in each recognised branch and `return false` at the end. Without that return value, an unrecognised non-2xx body leaves **both** the field errors and `submitError` empty — a silent failure, which is the exact defect this task exists to remove.

Render `submitError` in an accessible live region — the JSX has **no general error output today**, so one must be added:

```jsx
{submitError && (
  <p role="alert" aria-live="polite">{submitError}</p>
)}
```

Disable the submit button while `isSubmitting` to prevent duplicate sends, and clear pending state on **every** completion path. The form stays populated and re-submittable on failure.

- [ ] **Step 8: Build and commit**

```bash
npm run build && npm run lint && npm run format:check
git add -A
git commit -m "fix: nav offset, listener leaks, key scoping, env guards, form errors"
```

**Manual check (spec §14 cases 1, 2, 5, 6, 7a, 7b, 11, 12, 13, 13a, 13b, 19):** nav links land below the sticky bar; resize and re-check; arrow keys while focused in a form field do **not** move the carousel; run once with both env vars unset (page must not 500, both integrations degrade, no network requests) and once with each unset individually.

---

## Task 4: MUI 5.18 bump

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: Task 3's fixes
- Produces: an MUI version whose React peer range admits React 19

MUI 5.15.19 declares React peers of `^17 || ^18` only. **5.18.0 widens them to include `^19.0.0`.** Installing React 19 first is a hard peer-resolution failure. This task exists solely to unblock Task 5 and is deliberately tiny.

- [ ] **Step 1: Bump MUI within v5**

```bash
npm install --save-exact \
  @mui/material@5.18.0 \
  @mui/icons-material@5.18.0 \
  @mui/styles@5.18.0
```

**`@mui/styles` must be bumped too, even though it dies in Task 6.** The installed 5.15.19 declares `react: "^17.0.0"` — React 17 *only*, so it is already violating peers against the current React 18. Leaving it pinned there means Task 5's React 19 install can resolve incorrectly or pull a second React instance. 5.18.0 widens it to `^17 || ^18 || ^19`. Task 6 uninstalls it.

- [ ] **Step 2: Verify and commit**

```bash
npm run build && npm run lint && npm run format:check
git add -A
git commit -m "chore: bump MUI to 5.18 for React 19 peer compatibility"
```

**Manual check:** site renders unchanged. A visible change here means an MUI 5 minor regression and should be investigated before proceeding.

---

## Task 5: Next 16 + React 19, and FontAwesome

**Files:**
- Modify: `package.json`, `next.config.js`, `pages/_app.js`

**Interfaces:**
- Consumes: Task 4's MUI 5.18
- Produces: the Next 16 / React 19 runtime everything after depends on

**Three slices, three commits.** Bundling the highest-risk upgrade with the framework bump makes a bisect useless. Each slice runs **install → fix its breakage → verify → stage → commit** and is finished before the next slice's install. Do **not** read ahead and batch the installs.

### Slice A — Next 16 + React 19

- [ ] **A1: Install**

```bash
npm install --save-exact next@16.3.0 react@19.2.8 react-dom@19.2.8
```

`"next": "latest"` was **unpinned** — any `npm install` could silently jump majors. Now pinned.

- [ ] **A2: Remove the build-time lint escape hatch**

Next 16 no longer lints during `next build`, so `eslint.ignoreDuringBuilds` from Task 1 is obsolete. Delete it from `next.config.js`, leaving the file effectively empty until Task 9 adds `images`.

- [ ] **A3: Resolve React 19 breakage**

Expect `ReactDOM.render` removals, ref-as-prop changes, stricter `useEffect`. `components/index.js` uses `forwardRef` — React 19 still supports it, but verify `Section` still receives refs and the Task 3 nav offset still measures.

- [ ] **A4: Verify and commit**

```bash
npm run build && npm run lint && npm run format:check
git add -A
git commit -m "feat: upgrade to Next 16 and React 19"
```

### Slice B — FontAwesome

- [ ] **B1: Install**

```bash
npm install --save-exact \
  @fortawesome/fontawesome-svg-core@7.3.1 \
  @fortawesome/free-solid-svg-icons@7.3.1 \
  @fortawesome/react-fontawesome@3.5.0
```

**Highest-uncertainty upgrade in the plan** — the React adapter goes 0.2.2 → 3.5.0, a major rewrite. Read its migration notes before running this.

- [ ] **B2: Move `library.add` to module scope (7.5)**

It currently re-runs on every render:

```js
library.add(faCode, faHeartbeat, faTrain, faUsers, faEnvelope, faPhone, faArrowLeft, faArrowRight);

export default function MyApp({ Component, pageProps }) {
  // ...
}
```

If the 3.x adapter replaces this API entirely, follow its documented pattern instead and note the deviation in the commit message.

- [ ] **B3: Verify and commit**

```bash
npm run build && npm run lint && npm run format:check
git add -A
git commit -m "feat: upgrade FontAwesome to v7 and adapter v3"
```

**Check every icon renders** — contact details, skills grid, carousel arrows.

### Slice C — remaining dependencies

- [ ] **C1: Install**

```bash
npm install --save-exact \
  @vercel/analytics@2.0.1 \
  @vercel/speed-insights@2.0.0 \
  react-spotify-embed@3.0.1 \
  @react-google-maps/api@2.20.8 \
  sharp@0.35.3 \
  react-awesome-reveal@4.3.1 \
  react-vertical-timeline-component@4.0.0
```

These land **before** the redesign, not after: Task 8 restyles the timeline, so upgrading it afterwards could invalidate that work.

- [ ] **C2: Resolve the timeline decision**

`react-vertical-timeline-component` 3.6 → 4.0 carries real risk. If it fails against React 19, **hand-roll the timeline now** — the Atlantic direction restyles it heavily anyway. **Record which path was taken; Task 8 Step 6 depends on knowing.**

If replaced, this slice also modifies `components/Experience/timeline/index.js` and `components/Experience/styles.js`, and removes the `react-vertical-timeline-component/style.min.css` import from `pages/_app.js` — files not otherwise in this task's list.

- [ ] **C3: Verify and commit**

```bash
npm run build && npm run lint && npm run format:check
git add -A
git commit -m "chore: upgrade remaining dependencies"
```

There is **no fourth combined commit** — A, B and C are the complete set.

**Manual check:** every section renders; all FontAwesome icons still appear (contact details, skills, carousel arrows); no console errors or hydration warnings. Run this after each slice, not only at the end — it is how you attribute a regression to the right upgrade.

---

## Task 6: Kill `@mui/styles`, migrate to MUI 9

**Files:**
- Delete: all 12 `components/**/styles.js`
- Modify: `src/theme.js` (palette — see Step 3c), `pages/_app.js`, `pages/_document.js`, `components/index.js`, `components/Contact/index.js`, `components/Contact/form/index.js`, `components/About/index.js`, `components/About/rightRail/index.js`, `components/Experience/skills/index.js` (the last four for the Grid migration), and all 12 components that consumed a `styles.js`

**Interfaces:**
- Consumes: Task 5's React 19 runtime
- Produces: `theme.palette.*` Atlantic tokens (Step 3c) consumed by every later task; the current Grid API across the four files in Step 3b

**This is the largest task.** `@mui/styles` is imported by 16 files: **13 `makeStyles` calls** (12 `styles.js` modules + `components/index.js:14`), **1 `withStyles`** (`components/Contact/index.js:45`), plus the `ThemeProvider` and `ServerStyleSheets` uses. All of it goes.

- [ ] **Step 1: Install MUI 9 and the Pages Router integration**

```bash
npm install --save-exact \
  @mui/material@9.3.1 \
  @mui/icons-material@9.3.1 \
  @mui/material-nextjs@9.3.0 \
  @emotion/react@11.14.0 \
  @emotion/styled@11.14.0 \
  @emotion/cache@11.14.0 \
  @emotion/server@11.11.0
npm uninstall @mui/styles
```

The last three are **required by MUI's documented Pages Router SSR setup** and are easy to miss — without them the integration will not install. `@emotion/cache` and `@emotion/server` are needed by `@mui/material-nextjs` itself, not by any cache of ours (Step 2).

- [ ] **Step 2: Use MUI's default cache — do not hand-roll one**

An earlier draft created `src/emotion-cache.ts` with a custom `key: "css"` cache. That is **removed**, for two reasons: the `_document` snippet called `createEmotionCache()` without importing it, and a custom cache must be configured **identically on both the server and browser providers** or the cache keys diverge and server-rendered styles are discarded on hydration.

`@mui/material-nextjs` ships a correct default for both sides. This project has no requirement that needs custom cache behaviour, so use it. **No `src/emotion-cache.ts` is created.**

If a custom cache is ever genuinely needed, the same configured instance must be passed to `AppCacheProvider` *and* `documentGetInitialProps` — configuring only one side is the failure mode this step exists to avoid.

- [ ] **Step 3: Wire Emotion SSR on BOTH sides**

The integration needs `_app` **and** `_document`. Wiring only `_document` leaves the cache unused and server style collection unreliable.

`pages/_document.js`:

```jsx
import { DocumentHeadTags, documentGetInitialProps } from "@mui/material-nextjs/v15-pagesRouter";

export default function MyDocument(props) {
  return (
    <Html lang="en">
      <Head><DocumentHeadTags {...props} /></Head>
      <body><Main /><NextScript /></body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx) => await documentGetInitialProps(ctx);
```

No `emotionCache` argument — the package's default is used on both sides (Step 2).

`pages/_app.js`:

```jsx
import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";

export default function MyApp(props) {
  return (
    <AppCacheProvider {...props}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* ... */}
      </ThemeProvider>
    </AppCacheProvider>
  );
}
```

Delete the entire `ServerStyleSheets` JSS block and the old `getInitialProps` override. Also delete the render-blocking Google Fonts `<link>` — Task 8 replaces it with `next/font`.

- [ ] **Step 3b: Migrate the legacy Grid API — 14 usages**

**MUI removed the legacy Grid in v9** (renamed `GridLegacy` in v7, gone in v9). The repo uses the old `item` / `xs` / `sm` / `md` API in **14 places across 4 files** — verified by `grep -rn "<Grid item"`:

- `components/Experience/skills/index.js:15` — 1
- `components/Contact/form/index.js:172, 189, 206, 223` — 4
- `components/About/index.js:81, 94, 108` — 3 (the last carries `className={classes.musicItem}`)
- `components/About/rightRail/index.js:16, 22, 26, 30, 38, 42` — 6

Convert each to the current Grid API — `item` is gone and breakpoints move into a `size` prop:

```jsx
// before
<Grid item xs={12} sm={6} md={3}>

// after
<Grid size={{ xs: 12, sm: 6, md: 3 }}>
```

Run MUI's codemod first, then hand-check every site — the codemod does not catch Grids that also carry a `className`, which several of these do.

**Also audit the other MUI majors' breaking changes** (v6, v7, v8, v9 guides). This migration crosses four majors; Grid is the one confirmed present, but it is unlikely to be the only one.

- [ ] **Step 3c: Introduce the Atlantic palette now, not in Task 8**

The `makeStyles` modules reference `theme.colors.black` etc. — a **custom non-standard key** that only ever worked through the JSS provider. Converting them requires real `theme.palette` tokens to convert *to*, so the palette must exist here. Waiting until Task 8 would mean writing every `styled` call twice.

In `src/theme.js`, replace the `colors` block with the Atlantic palette (full token table and computed contrast ratios in Task 8 Step 1 — copy the hex values from there):

```js
palette: {
  slate: "#2B373B",
  limestone: "#E8E4DC",
  ink: "#14110F",
  chalk: "#FAFAF8",
  seaGlass: "#7FA8A0",
  deepSea: "#2F5D57",
  signal: "#E4572E",
  signalText: "#A33A1B",
},
```

Map the old names as you convert: `colors.black` → `palette.slate`, `colors.white` → `palette.chalk`, and so on. **Task 6 changes colours, so its visual checkpoint is "matches the new palette", not "identical to production."** Task 8 then owns type, layout, and motion — not colour.

**This is a deliberate deviation from the spec**, which places all palette work in the redesign stage (§13 step 7). Moving it here is forced: `theme.colors.*` has no MUI equivalent, so the `styled` conversions need real tokens to target, and leaving it to Task 8 means writing every `styled` call twice. Lifecycle across the three tasks:

| Task | File | Action |
|---|---|---|
| 6 | `src/theme.js` | Palette tokens replace the `colors` block |
| 7 | `src/theme.js` → `src/theme.ts` | Renamed with everything else; augmentation added |
| 8 | `src/theme.ts` | **Modified**, not created — typography, spacing, motion. **Does not redefine the palette.** |

Note the deviation in the Task 6 commit message so the spec and plan do not silently disagree.

- [ ] **Step 4: Convert each `makeStyles` module**

For all 12 `components/**/styles.js`, convert to `styled()` for reusable elements and `sx` for one-offs, colocated in the component file. Delete the `styles.js`. Example:

```js
// before — components/Footer/styles.js
export default makeStyles((theme) => ({
  root: { backgroundColor: theme.colors.black, padding: theme.spacing(6) },
}));

// after — inside components/Footer/index.js
const Root = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.slate,
  padding: theme.spacing(6),
}));
```

Note `theme.colors.*` becomes `theme.palette.*` — Task 7 adds the typing that makes this safe.

- [ ] **Step 5: Convert the one `withStyles` call**

`components/Contact/index.js:45` wraps a Button in a HOC. Easy to miss because it is the only instance:

```js
const StyledButton = styled(Button)(({ theme }) => ({
  // ...the rules previously passed to withStyles
}));
```

- [ ] **Step 6: Port the aspect-ratio media queries**

`components/Home/styles.js` uses six raw `@media (min-aspect-ratio: ...)` keys. These have **no theme-breakpoint equivalent** and stay as raw queries inside the `styled` call. Do not try to force them into `theme.breakpoints`.

- [ ] **Step 7: Verify `@mui/styles` is gone**

```bash
grep -rn "@mui/styles\|makeStyles\|withStyles\|ServerStyleSheets" --include="*.js" --include="*.tsx" . | grep -v node_modules
```
Expected: no output.

- [ ] **Step 8: Verify and commit**

```bash
npm run build && npm run lint && npm run format:check
git add -A
git commit -m "refactor: replace @mui/styles JSS layer with MUI 9 styled/sx"
```

**Manual check:** the highest-risk step in the plan. Every section at 375 / 768 / 1440 px. Layout must be **structurally unchanged** — colours will differ (Step 3c) but nothing should move, overlap, or collapse. Check specifically for **flash-of-unstyled-content on first paint**, which means the Emotion SSR cache is misconfigured, and for Grid regressions from Step 3b (the skills grid and contact form are the dense ones).

---

## Task 7: TypeScript migration

**Files:**
- Rename: every `.js` under `pages/`, `components/`, `utils/`, `src/` → `.ts`/`.tsx`
- Create: `src/types/theme.d.ts`

**Interfaces:**
- Consumes: Task 6's MUI 9 layer
- Produces: `FormspreeUrl = string | null`, `MapsKey = string | null`, `HeroImage` (defined in Task 8)

Completes the **typed half of 7.10** — absent env values become explicit union states rather than empty strings.

- [ ] **Step 1: Rename files**

Use `git mv` so history is preserved. Components with JSX get `.tsx`; pure modules get `.ts`.

**`utils/constants.js` must become `utils/constants.tsx`, not `.ts`.** It contains **12 JSX elements** — the skill definitions embed `icon: <Image priority src={...} />` (`utils/constants.js:171` onward). A `.ts` rename fails to parse at the first typecheck. Check any other "pure-looking" module for JSX before renaming:

```bash
grep -ln "<[A-Z]" utils/*.js src/*.js
```

- [ ] **Step 2: Create the theme augmentation**

```ts
import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    slate: string;
    limestone: string;
    seaGlass: string;
    deepSea: string;
    signal: string;
    signalText: string;
    ink: string;
    chalk: string;
  }
  interface PaletteOptions {
    slate?: string;
    limestone?: string;
    seaGlass?: string;
    deepSea?: string;
    signal?: string;
    signalText?: string;
    ink?: string;
    chalk?: string;
  }
}
```

This is what makes `theme.palette.slate` type-check. Without it every token access is an error.

- [ ] **Step 3: Type the data flow**

```ts
export type FormspreeUrl = string | null;
export type MapsKey = string | null;

export type PageProps = {
  formspree: FormspreeUrl;
  spotify: string;
  maps: MapsKey;
};
```

Thread `PageProps` from `pages/index.tsx` through `components/index.tsx` to `Contact` and `Map`. The `null` case is now unavoidable at compile time.

- [ ] **Step 4: Resolve errors without `any`**

Use `unknown` plus narrowing. For third-party gaps write a local `.d.ts`, never a blanket `@ts-ignore`. If a genuine typing gap has no clean answer, add `@ts-expect-error` with a one-line reason so it fails loudly when the dependency is fixed.

- [ ] **Step 5: Make typecheck a gate from here on**

```bash
npm run typecheck
```
Expected: clean. From this task forward it runs before every commit.

- [ ] **Step 6: Verify and commit**

```bash
npm run build && npm run lint && npm run format:check && npm run typecheck
git add -A
git commit -m "refactor: migrate to TypeScript in strict mode"
```

**Manual check:** full pass over all four sections — a mechanical migration this broad can silently drop a prop.

---

## Task 8: Atlantic redesign

**Files:**
- Modify: `src/theme.ts` (**exists already** — created in Task 6, renamed in Task 7; this task adds typography, spacing and motion and must **not** redefine the palette), `utils/constants.tsx`, `pages/_app.tsx`, all section components

**Interfaces:**
- Consumes: Task 7's typed theme augmentation
- Produces: `HERO_IMAGES: HeroImage[]`

Resolves **7.8** — the font inconsistency, since the new scale replaces both broken declarations (`styles/global.css` declared Inter but was never imported; theme and `_document` declared Roboto).

- [ ] **Step 1: Confirm the palette — defined in Task 6, not redefined here**

The tokens already exist in `src/theme.ts` from Task 6 Step 3c. This step is a **verification** that they match the table below, not a re-definition. Every ratio is **computed, not estimated** — two earlier drafts of the spec got these wrong.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `slate` | `#2B373B` | Dark surface | — |
| `limestone` | `#E8E4DC` | Light surface | — |
| `ink` | `#14110F` | Text on light | 14.83:1 ✓ AAA |
| `chalk` | `#FAFAF8` | Text on dark | 11.73:1 ✓ AAA |
| `seaGlass` | `#7FA8A0` | Accent **on dark only** | 4.68:1 on slate ✓ AA |
| `deepSea` | `#2F5D57` | Links **on light** | 5.87:1 on limestone ✓ AA |
| `signal` | `#E4572E` | **Decorative marks only** | 2.90:1 ✗ — never text |
| `signalText` | `#A33A1B` | Accent text on light | 5.21:1 ✓ AA |

**`seaGlass` must never carry text on `limestone`** (2.07:1) and **`signal` must never be text anywhere** (2.90:1, failing even the 3:1 non-text threshold). Use `deepSea` and `signalText` respectively.

- [ ] **Step 2: Load fonts via `next/font`**

```ts
import { Archivo, Source_Sans_3 } from "next/font/google";

export const display = Archivo({
  subsets: ["latin"],
  weight: ["600", "700"],
  axes: ["wdth"],
  display: "swap",
});

export const body = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-body",
});
```

There is **no "Archivo Expanded" family** — Archivo is one variable family with a `wdth` axis (62–125).

**Loading a font object applies nothing on its own.** Three further wiring steps are required:

1. Add `variable: "--font-display"` to the Archivo loader (shown above for body) and apply both at the app root:

```jsx
<div className={`${display.variable} ${body.variable}`}>
```

2. Reference the variables in the MUI theme so components inherit them:

```js
typography: {
  fontFamily: "var(--font-body), system-ui, -apple-system, 'Segoe UI', sans-serif",
  h1: { fontFamily: "var(--font-display), system-ui, sans-serif", fontStretch: "125%" },
  h2: { fontFamily: "var(--font-display), system-ui, sans-serif", fontStretch: "125%" },
},
```

3. `axes: ["wdth"]` only *loads* the axis — **`font-stretch: 125%` is what actually applies the expanded width.** Without it the display face renders at default width and the direction's whole typographic character is lost.

Coordinates use `font-variant-numeric: tabular-nums` on the body face rather than a third font.

- [ ] **Step 3: Measure the font payload**

```bash
npm run build
```
Budget: **≤ 90 KB total**. This is a gate, not an estimate. If exceeded: drop Archivo 600 and ship 700 alone; if still over, pin a static instance instead of the variable axis.

- [ ] **Step 4: Add the `HERO_IMAGES` manifest to `utils/constants.tsx`**

```ts
export type HeroImage = {
  id: string;
  alt: string;        // required, non-empty
  location: string;   // required — all 8 are known
  desktopSrc: string;
  mobileSrc?: string; // absent only for the local slide 0
};
```

`alt` and `location` are **not optional**. The decorative fallback that made them optional has been withdrawn from the spec — every slide is described.

Populate all 8 entries from spec §7a — the alt text and locations are already written there (Table Mountain, Cape Peninsula, Washington DC, Nashville, Universal Studios ×2, Golden Gate Bridge, Machu Picchu). Copy them verbatim; do not invent new descriptions.

- [ ] **Step 5: Build the hero**

- Full-bleed photograph, name set large in Archivo, per-slide coordinate eyebrow using each entry's `location`.
- **Selection draws only from mobile-capable entries on every viewport** — a desktop visitor who rotates into the mobile breakpoint would otherwise hold slides with no permitted mobile source.
- Slide 0 is the local Table Mountain image, pinned on both viewports, exempt from the `mobileSrc` filter.
- Shuffle the remaining six **after mount**, hold in state for the visit. **No `Math.random()` during SSR or hydration.**

- [ ] **Step 6: Restyle timeline and map**

Timeline: each role anchored to its city with coordinates, the vertical rule reading as a route line. Map: promoted to the closing element of the arc, showing all three cities connected.

The photographs are *global* travel while the CV is the Galway → Dublin → SF arc — two complementary uses of geography, not a contradiction.

- [ ] **Step 7: Neutralise all four motion sources under reduced motion**

```css
@media (prefers-reduced-motion: reduce) {
  /* reveals off, hero sequence skipped */
}
```

| Source | Behaviour |
|---|---|
| `react-awesome-reveal` reveals | No animation, content in place |
| Hero load sequence | Skipped |
| Smooth anchor scroll (`smoothAnchor.tsx`, `Layout/index.tsx`) | `behavior: "auto"` — instant |
| Carousel transition (`Home/Slider/index.tsx`) | Zero duration; slides still change |

- [ ] **Step 8: Verify and commit**

```bash
npm run build && npm run lint && npm run format:check && npm run typecheck
git add -A
git commit -m "feat: Atlantic design direction"
```

**Manual check (spec §14 cases 3, 4, 8, 9, 10, 17):** keyboard focus visible throughout; all four motion sources neutralised with reduced motion on; 375 / 768 / 1440 px with no horizontal overflow; font payload within budget.

---

## Task 9: Performance

**Files:**
- Modify: `pages/index.tsx`, `next.config.js`, `components/Home/index.tsx`, `components/About/*`, `components/Footer/index.tsx`
- Re-encode: `public/static/assets/images/first_image.webp`

**Interfaces:**
- Consumes: Task 8's `HERO_IMAGES`
- Produces: a statically generated page

Resolves **7.7** (the broken desktop/mobile branch) and **7.9** (the object-URL leak).

- [ ] **Step 1: Convert to `getStaticProps`**

`getServerSideProps` exists solely to read two env vars, forcing SSR on every request for static content and defeating CDN caching.

```ts
export const getStaticProps = (async () => ({
  props: {
    formspree: getFormspreeUrl(),
    maps: getGoogleMapsKey(),
  },
})) satisfies GetStaticProps<PageProps>;
```

**`spotify` is deliberately absent.** Passing it here would pin the playlist to the deployment, contradicting Step 2's client-side selection. Remove it from `PageProps` too (Task 7) — the playlist never travels through props.

- [ ] **Step 2: Handle all four non-static values**

| Value | Fix |
|---|---|
| Spotify playlist | Not a prop at all. Server renders a **fixed-height skeleton**; `useEffect` picks the playlist after mount into local state; `<Spotify>` renders **only once that state is set**, so the iframe mounts exactly once. Rendering a first playlist then swapping would load two Spotify iframes per visit. |
| Age (`getAge("1994/07/14")`, hardcoded at `About/rightRail/index.tsx:19`) | Move the literal into `constants.tsx`; compute **client-side only** |
| Copyright year (`Footer`) | **Client-side.** A build-time year goes stale on 1 January |
| Formspree token | **Build-time selection, accepted.** Rotating client-side would ship every token to the browser |

- [ ] **Step 3: Configure remote images**

`next.config.js` has no `images.remotePatterns` — `next/image` against the S3 bucket **fails without it**:

```js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hurley-site-images.s3-eu-west-1.amazonaws.com",
        pathname: "/minified_new/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};
```

- [ ] **Step 4: Replace the broken device branch (7.7) and the blob leak (7.9)**

`getBackgroundUrls()` branches on `react-device-detect`'s `isBrowser`, which reports **server vs browser, not desktop vs mobile** — so image sets are chosen by render environment. Replace with `<picture>`/`next/image` explicit sources; the two buckets are differently cropped, so this is **art direction, not responsive sizing**.

Delete `getBackground()` — it creates object URLs that are never revoked and bypasses image optimization.

```bash
npm uninstall react-device-detect
```
Its only call site is now gone.

- [ ] **Step 5: Repo-wide `priority` → `preload` audit — 18 occurrences**

Not just the hero. `grep -rn "priority" --include="*.tsx" .` returns **18** hits, including `utils/constants.js:171` (skills icons), `components/Footer/index.js:22`, and `components/Navbar/index.js:118`.

Two problems, not one: `priority` is **deprecated in Next 16**, and most of these images are **below the fold**, so preloading them competes with the LCP hero for bandwidth.

- Keep **`preload` on the local hero slide only** — it is the LCP element.
- Remove the prop entirely from footer, navbar, and skill icons; let them lazy-load.

```bash
grep -rn "priority" --include="*.tsx" --include="*.ts" . | grep -v node_modules
```
Expected after this step: **no output.** The hero uses `preload`, so `priority` should not survive anywhere.

- [ ] **Step 6: Re-encode the hero image**

`first_image.webp` is **624 KB at 4032×2268** — far larger than any viewport needs. Re-encode to responsive widths 640 / 1280 / 1920 in both AVIF and WebP.

Budget: **≤ 150 KB for the worst-case served response** (the 1920px WebP transform, measured in the network tab on a production build) — not the source file, not the smaller AVIF variant.

Also note the S3 mobile images are ~300 KB each at 1440×2560, which is oversized for mobile. Out of scope (external bucket), but record it in the PR.

- [ ] **Step 7: Verify and commit**

```bash
npm run build && npm run lint && npm run format:check && npm run typecheck
git add -A
git commit -m "perf: static generation, next/font, responsive images"
```

**Manual check (spec §14 cases 15, 16, 18):** age and year current with no hydration warning; **exactly one** Spotify iframe request per visit; hero response ≤ 150 KB. Plus case 14 — block the S3 host in devtools and confirm the hero degrades to a background colour with the overlay still legible, not a zero-height collapse.

---

## Task 10: Pre-merge

**Files:**
- Create: `docs/lighthouse-after.json` (committed alongside the Task 1 baseline, so the comparison is reproducible from the repo)
- Create: `docs/pr-body.md` (Step 4b — `gh pr create --body-file` requires it to exist)

**Ordering matters here.** Both artifacts are *created* in this task, so they must be written, then gated, then committed, and only then reviewed and pushed — otherwise the final commit is neither gated nor covered by the branch review.

- [ ] **Step 1: Preliminary gate run**

```bash
npm run build && npm run lint && npm run format:check && npm run typecheck
```
All four must pass. **Report failures plainly with output — never push past them.**

- [ ] **Step 2: Walk the complete manual matrix**

Every case in spec §14. All 8 hero descriptions exist, so cases 3 and 19 are live and there is no fallback branch to consider — it was withdrawn from the spec.

- [ ] **Step 3: Lighthouse after — same settings as the Task 1 baseline**

The "before" run was captured in Task 1 Step 9 as `docs/lighthouse-before.json`. Re-run with **identical** preset, viewport, throttling, and run count:

```bash
npm run build
npm run start & SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null' EXIT

# Wait for readiness, bounded. Launching Lighthouse immediately races the server
# start; an unbounded wait hangs forever if the server dies or never binds.
for i in $(seq 1 60); do
  kill -0 $SERVER_PID 2>/dev/null || { echo "server exited"; exit 1; }
  curl -sf http://localhost:3000 >/dev/null && break
  [ "$i" = 60 ] && { echo "server not ready after 60s"; exit 1; }
  sleep 1
done

npx --no-install lighthouse http://localhost:3000 \
  --preset=desktop \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless" \
  --output=json --output-path=./docs/lighthouse-after.json

kill $SERVER_PID; trap - EXIT
```

Report both sets of scores in the PR. If anything drifted from the baseline settings, say so rather than presenting an invalid comparison.

- [ ] **Step 4: Write `docs/pr-body.md`**

Written **before** the gates and the review, so the commit containing it is both gated and reviewed. Assemble it with:

- Every manual matrix case from spec §14, marked pass or fail. **Failures are reported, not omitted.**
- Lighthouse before/after scores, plus the pinned Lighthouse version and the exact flags used for both runs.
- Measured font payload vs the 90 KB budget; measured worst-case hero response vs the 150 KB budget.
- The 12 bug fixes, each with its spec reference.
- Whether `react-vertical-timeline-component` was upgraded or hand-rolled (decided in Task 5 slice C).
- The Task 6 deviation from the spec: the Atlantic palette moved from step 7 to Task 6.
- An explicit statement that **no automated tests exist**, so review rests on the manual matrix and the Vercel preview.
- Known follow-ups: mobile crops for images `eight`–`fourteen`; the oversized ~300 KB S3 mobile images.

- [ ] **Step 5: Re-run the gates, then commit both artifacts**

The gates from Step 1 ran before these two files existed. Re-run them so the final commit is not an ungated one:

```bash
npm run build && npm run lint && npm run format:check && npm run typecheck
git add docs/lighthouse-after.json docs/pr-body.md
git commit -m "docs: add post-modernization Lighthouse report and PR body"
```

- [ ] **Step 6: Codex review of the full branch diff**

Now that every commit exists, review covers the whole branch including the artifacts:

```bash
codex review --base main
```

`codex-review diff` is the *skill* name, not a CLI command — it does not exist as an executable.

- [ ] **Step 7: Push and open the PR**

`git push` alone does not open a PR:

```bash
git push -u origin feat/modernize-2026

gh pr create --base main --head feat/modernize-2026 \
  --title "Modernize stack and redesign (Atlantic)" \
  --body-file docs/pr-body.md
```

Body contents are specified in Step 4.

**Do not merge.** Pre-merge is a checkpoint; James approves.

---

## Self-Review

**Spec coverage:** §4 deps → Tasks 1, 2, 4, 5, 6, 9. §5 styling → Task 6. §6 design → Task 8. §7 bugs 7.1–7.4, 7.6, 7.10a, 7.11, 7.12 → Task 3; 7.5 → Task 5; 7.10b → Task 7; 7.7, 7.9 → Task 9; 7.8 → Task 8. §7a hero → Tasks 8, 9. §8 perf → Task 9. §9 dead code → Task 2. §10 TypeScript → Task 7. §11 tooling → Task 1. §13 sequencing → task order. §14 verification → per-task manual checks + Task 10. **No gaps.**

**Placeholder scan:** none. Every code step carries real code; every version is exact.

**Type consistency:** `HeroImage` (Task 8) is referenced only after definition. `FormspreeUrl`/`MapsKey` are introduced in Task 3 as runtime `null` and typed in Task 7 — intentional, since TypeScript does not exist until Task 7. `chunk`/`shuffle` are defined in Task 2 before their Task 2 call sites. The Atlantic palette is defined in Task 6 Step 3c and only *verified* in Task 8 Step 1 — it is never defined twice.

**Known risk:** Task 6 is much larger than the others. It is not split because the `@mui/styles` removal is atomic — a half-migrated styling layer does not build.
