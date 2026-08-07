The last of the three items deferred in the modernization spec. Pages Router still worked in Next 16, so this was never urgent — it lands now that CI and a test layer (#4) are in place to catch what it might break.

Rebased onto `main` at `d2b8046`, so this is a single commit with no #4 history replayed.

## What moved

**`app/layout.tsx`** replaces `_app` and `_document`. The hand-written `<Head>` block becomes a `metadata` export, so the title, description, canonical, icons and both the `og:` and `twitter:` sets derive from one place instead of being written twice and drifting apart. `viewport` is its own export — leaving it inside `metadata` is deprecated and silently ignored.

**`app/providers.tsx`** exists out of necessity, not preference. The theme carries functions (`breakpoints.up`, `spacing`), and a server component cannot pass a function to a client component — the build fails outright with `Functions cannot be passed directly to Client Components`. The theme has to be _imported_ on the client side of the boundary rather than passed across it.

**`app/page.tsx`** is a server component reading the env vars directly. That is all `getStaticProps` ever did here.

**The client boundary sits at `components/index.tsx`.** State, effects, event handlers and MUI's `sx` all require it, so the whole tree below is client. A finer-grained split would be churn for no gain on a single-page site where everything is interactive.

**`Layout`** loses `next/head` — no such thing in the App Router — and its `styled-jsx` global block, which would need a client component plus an SSR registry for two rules that were always global. They live in `src/styles.css` now.

## A correction to #3

I reported best practices as **74 → 96** in #3. That was wrong, and it is in the merged PR body.

Re-running it gives 74 consistently. I then built the pre-migration branch and measured it the same way: **also 74, with identical failing audits**. The 96 was a single run where the Spotify iframe had not finished mounting, so no third-party cookies were set.

The honest figure is **74 both before and after**. The failures are Spotify's third-party cookies and `/_vercel/insights` 404ing on localhost — neither ours to fix, and the second is a local-only artefact.

|                | before | after   |
| -------------- | ------ | ------- |
| performance    | 100    | **100** |
| accessibility  | 98     | **98**  |
| best practices | 74     | 74      |
| SEO            | 100    | 100     |

LCP 0.7s, FCP 0.2s. The route is still fully static — `Route (app) ○ /`.

## Verification

`build` ✅ · `lint` ✅ (0 errors, 2 pre-existing `exhaustive-deps` warnings) · `format:check` ✅ · `typecheck` ✅ · `test` ✅ 45/45

Checked in Chrome against a production build: one `h1`, 7/7 hero slides loaded, 5 timeline cards, Spotify iframe present, fonts and the full Atlantic palette resolving across 522 CSS rules, canonical and `og:image` correct, no console errors and no hydration mismatches.

## Worth a look on the preview

Emotion SSR style tags dropped from 104 to 4, because `AppRouterCacheProvider` streams styles rather than inlining them all in `<head>`. Every computed style I checked resolves correctly, so this reads as a strategy change rather than lost styles — but **flash-of-unstyled-content would not show up in any check I ran**, and it is the one thing a router migration plausibly breaks. Worth watching the first paint on the preview deploy.

Still unverified from earlier PRs: keyboard focus order, reduced-motion end to end, and a real sub-606px device.
