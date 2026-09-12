# Copilot instructions for mostlyanimals

This repo is a Next.js photo gallery for a static website. The app is driven mostly by the photo catalog in `content.json`, with page rendering in `pages/` and shared client/server helpers in `src/` and `server/`.

## Build, test, and lint

Use the repo scripts from the project root:

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

Important notes:
- There is no `npm test` script and no formal automated test suite in this repo.
- The main validation commands are `npm run lint` and `npm run build`.
- For targeted validation on a single file, prefer file-scoped ESLint or TypeScript checks, for example:

```bash
npx eslint path/to/file.tsx
npx tsc --noEmit
```

## High-level architecture

- `pages/`: Next.js route files. The homepage in `pages/index.tsx` uses `getStaticProps()` to load photo metadata and renders the gallery.
- `src/`: UI and data-processing code. This includes the photo type model (`src/types.ts`), feature grouping logic (`src/feature-group-service.ts`), keyword generation (`src/view-data-service.ts`), and front-end gallery components.
- `server/photos/`: data layer for photo metadata. `server/photos/list/index.ts` reads `content.json` directly, so the JSON file acts as the app's source of truth for gallery data.
- `photo-management/`: operational scripts for image upload and deletion. These scripts resize images, upload to S3, and keep `content.json` synchronized with the cloud asset metadata.
- `content.json`: canonical photo catalog. Each entry contains `key`, `name`, `title`, `description`, `location`, `tags`, and generated `resize` metadata. Array order defines the gallery display order.
- `public/` and asset URLs: the site references generated image variants and favicon assets that are served as part of the static site.

## Key conventions

- Treat `content.json` as the source of truth for metadata and display order. New uploads are intentionally prepended to the array; reordering entries changes the site order.
- Keep the `key` field stable for each photo. Delete and replace flows depend on those keys and the related resize metadata.
- Preserve the existing `resize` structure (`thumb`, `xsmall`, `small`, `medium`, `large`, `xlarge`) whenever editing a photo entry; these names are used throughout the front-end rendering code.
- Most gallery metadata is stringly typed in the JSON: `location` is a human-readable string, `tags` is an array of lowercase-ish values, and keyword generation derives from location, title, and tags.
- `src/types.ts` defines the app's photo contracts (`RawPhoto`, `DetailPagePhoto`, `CollagePhoto`, etc.). If you add or rename fields, keep those TypeScript shapes aligned with the JSON and rendering code.
- The repo's ESLint config ignores `.next/*` and `photo-management/*`; those are operational/generated paths, not app code to edit in normal feature work.

## Repo-specific docs to consult

- `README.md` is the primary consumer-facing documentation for upload/edit/delete workflows.
- `package.json` is the source of truth for the available scripts and dependencies.

## MCP servers

If you want to extend this project in a way that benefits from an MCP server, ask whether the user wants to configure one relevant to the workflow (for example, Playwright for browser testing on the site).
