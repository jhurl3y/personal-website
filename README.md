# James Hurley — Personal Website

[![CI](https://github.com/jhurl3y/personal-website/actions/workflows/ci.yml/badge.svg)](https://github.com/jhurl3y/personal-website/actions/workflows/ci.yml)

The source for [jameshurley.ie](https://jameshurley.ie/), my personal portfolio and a record of my work, skills, and travels.

The site is a responsive, single-page Next.js application built around four sections: a travel photography hero, an introduction, an experience timeline, and a contact area connecting Galway, Dublin, and San Francisco.

## Highlights

- Responsive image carousel with keyboard controls and reduced-motion support
- Professional experience timeline and skills grid
- Interactive Google Map with a static fallback when no API key is configured
- Validated Formspree contact form with graceful error and unavailable states
- Server-rendered metadata, Open Graph cards, sitemap, and analytics
- Automated linting, formatting, type checking, tests, and production builds in CI

## Built with

- [Next.js](https://nextjs.org/) App Router, React, and TypeScript
- [Material UI](https://mui.com/) and Emotion
- [Vitest](https://vitest.dev/) and Testing Library
- Google Maps, Formspree, Vercel Analytics, and Speed Insights
- [Vercel](https://vercel.com/) for deployment

## Getting started

### Prerequisites

- Node.js 22 (the exact major version is recorded in `.nvmrc`)
- npm

If you use `nvm`, select the correct runtime first:

```bash
nvm use
```

Install the locked dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

The application runs without external credentials: the map switches to a static fallback and the contact form is disabled. To enable both integrations locally, create `.env.local`:

```dotenv
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
FORMSPREE_TOKENS="your-formspree-form-id"
```

| Variable              | Purpose                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| `GOOGLE_MAPS_API_KEY` | Enables the interactive map in the contact section.                                                |
| `FORMSPREE_TOKENS`    | One or more Formspree form IDs. Separate multiple IDs with commas; one is selected for each build. |

These values are read on the server at build time and are not exposed as environment-variable source in the client bundle. Restart the development server after changing them.

## Available commands

| Command                | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Start the local development server.                 |
| `npm run build`        | Create a production build.                          |
| `npm start`            | Serve the production build.                         |
| `npm run lint`         | Check the code with ESLint.                         |
| `npm run format:check` | Check formatting with Prettier.                     |
| `npm run typecheck`    | Run the TypeScript compiler without emitting files. |
| `npm test`             | Run the Vitest test suite once.                     |
| `npm run test:watch`   | Run tests in watch mode.                            |

To run the same checks used by CI:

```bash
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
```

## Project structure

```text
app/          App Router entry points, metadata, and providers
components/   Page sections and reusable UI components
public/       Images, icons, résumé, and site metadata
src/          Global styles, fonts, and theme configuration
utils/        Content, constants, shared helpers, and types
```

Pushes to `main` run the complete verification workflow and deploy through Vercel.
