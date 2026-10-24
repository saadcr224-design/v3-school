# V3school

C++ learning app with 186 English/Urdu guides, a practice portal, and Gemini chat.

## Features
- Topic definitions, step-by-step explanations, examples and expected output.
- 16 guided practice exercises with 46 test cases, lesson practice and free coding.
- Online C++ execution through Compiler Explorer.
- Gemini answers with recent conversation context and English/Urdu support.
- Installable PWA; downloaded lessons, search, drafts and progress work offline.
- Each browser keeps its own learning progress; export/import moves it between devices.

## Project structure
- `public/`: complete frontend, lesson data, icons, manifest and offline service worker.
- `worker/index.ts`: server entry point, including `/api/chat`.
- `worker/gemini.mjs`: server-side Gemini integration and request validation.
- `app/`, `vite.config.ts`, `scripts/`: Vinext/Cloudflare build integration.
- `tests/gemini.mjs`: API handling tests with simulated provider responses.
- Python scripts and JSON source data: curriculum/exercise generation.

## Local development
Use Node.js 22.13 or newer and the pnpm version declared in `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

For local Gemini calls, create an ignored `.dev.vars` file containing `GEMINI_API_KEY` and optionally `GEMINI_MODEL=gemini-flash-latest`. Supply your own key privately. Never commit it.

```sh
node tests/gemini.mjs
pnpm build
```

## Publishing
This is a full-stack Cloudflare Worker app. Its build produces `dist/server/wrangler.json` and `dist/client/`. Deploy the Worker together with its assets using a Cloudflare-compatible deployment flow. Configure `GEMINI_API_KEY` as a server-side secret and optionally `GEMINI_MODEL` as a runtime variable on the new host. Secrets from the original hosting service are not included in this repository and do not transfer automatically.

GitHub stores the source code; uploading this repository does not publish a working website. GitHub Pages alone cannot run `/api/chat`. The frontend also uses root-relative URLs, so deploying under a GitHub Pages repository subpath requires path and service-worker changes.

The `.openai/hosting.json` file identifies the original ChatGPT Sites project. Do not use that identity to create a different Site. The included build integration is retained from the working source.

## Limits
Gemini and compiling/running C++ require internet. Gemini can make mistakes; output tests do not prove every input correct. The API rate guard is per worker instance, not a global spending limit; configure provider quotas separately. Progress is local to the browser and AI chat history is kept in tab memory.

## Validation at export
Production build completed. All 186 lesson render checks passed. The 16 reference exercise solutions passed 46 local C++ test cases. Gemini request validation, error handling and quota behavior passed simulated tests. Live Gemini answers were not successfully verified; the original host recorded a provider request timeout.
