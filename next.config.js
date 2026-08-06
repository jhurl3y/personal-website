// next.config.js
module.exports = {
  // Next 14 runs ESLint during `next build`. This repo now uses ESLint 10 with
  // flat config and eslint-config-next 16, which the still-Next-14 build cannot
  // consume. Lint runs via `npm run lint` instead. Removed in Task 5, when
  // Next 16 (which no longer lints at build time) lands.
  eslint: { ignoreDuringBuilds: true },
};
