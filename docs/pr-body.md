Two of the three items deferred in the modernization spec — CI and automated tests — plus mobile fixes found while checking the result on a narrow viewport.

**App Router migration is not here.** It restructures every entry point, and it lands better on top of these two than beside them. It continues on a separate branch based on this one.

## CI

Runs `lint`, `format:check`, `typecheck`, `test` and `build` on every PR and on pushes to `main`.

- Node comes from `.nvmrc`, so CI and local can't drift apart.
- Steps use `if: !cancelled()`, so one push reports **every** failure rather than one per run.
- `npm ci`, not `npm install` — it fails if `package.json` and the lockfile disagree, which is the point of running it on a PR.
- Build runs last, with `FORMSPREE_TOKENS` and `GOOGLE_MAPS_API_KEY` **deliberately empty**: the site has to build and degrade without them.
- Nothing interpolates untrusted input into a `run:` step.

This closes a real gap — Vercel only builds. Nothing was running lint or typecheck on a PR, so a regression in either would have landed silently.

## Tests — 45 across 6 files

Aimed at the code that has actually broken, not at coverage for its own sake.

**Contact form (11).** Disabled with no token and posting nowhere; validation blocking submission; a malformed email; success; an unrecognised 500 body; a status-0 transport failure; `onerror`; still re-submittable after a failure. Several of these map to bugs that shipped — the 500 and status-0 paths both rendered an empty error box in production.

**smoothAnchor (9).** The scroll arithmetic, including an explicit regression guard for the 40px overshoot, the function-offset form, and the reduced-motion branch — `window.scroll({behavior:"smooth"})` ignores the CSS `scroll-behavior` override, so it has to be checked in JS.

**Map (3).** The no-key fallback, asserting the Google loader is _never mounted_ rather than merely hidden.

**useIsClient (2).** The server snapshot must be `false`, or the age and copyright year render at build time and go stale.

**Helpers and array (20).** Env absence returning `null` rather than `""`, `getAge`'s birthday-not-yet-reached branch, hero slide selection, and a Fisher-Yates check that the last element can actually move.

Two things worth knowing for future test work: a stubbed `XMLHttpRequest` missing the `DONE` constant makes the component's readystate guard return **silently** every time, and `@testing-library/dom` is a required peer of `jest-dom` that doesn't install on its own.

## Mobile

The hero was unusable below ~900px. The root cause was structural: `content` stacked a 93px navbar on top of a `height: 100%` hero, so it overflowed the viewport by exactly the navbar height and the role line landed on the carousel dots. It's a column flex now, with the hero taking the remaining space.

|                                |                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------- |
| Nav collapsed only below 600px | Five links crowded the logo at 600–900px. Switches at `md`.                     |
| Arrows took 64px a side        | Squeezed the name on narrow viewports. They scale down below `md`.              |
| Name clamp floor 3.5rem        | Wide enough to overflow at 390px once the arrows took their share. Now 2.75rem. |

Also removes a hidden `h1` carrying the page title. The hero name is a real visible `h1` now, so the page had **two** — and the title is already in `<title>` and the meta description.

## Verification

`build` ✅ · `lint` ✅ (0 errors, 2 pre-existing `exhaustive-deps` warnings) · `format:check` ✅ · `typecheck` ✅ · `test` ✅ 45/45

Checked in Chrome at narrow and desktop widths: no horizontal overflow at either, hamburger appears below `md` and not above, role line clears the dots by 6px narrow and 38px wide, one `h1`.

**Caveat:** Chrome won't resize below ~606px on macOS, so narrow verification was at 606, not 390. The clamp and breakpoints should hold, but a real device check is worth doing.

**Still unverified:** keyboard focus order, and reduced-motion end to end.
