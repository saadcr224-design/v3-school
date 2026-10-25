# V3school

C++ learning app with 186 English/Urdu guides, a practice portal, and Gemini chat.

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsaadcr224-design%2Fv3-school&env=GEMINI_API_KEY&project-name=v3-school&repository-name=v3-school-vercel)

Click the button, sign in with GitHub, select your account, enter a new `GEMINI_API_KEY` in Vercel's environment-variable form, and deploy. The template flow copies this repository to your GitHub account. To deploy the existing repository instead, import `saadcr224-design/v3-school` from your Vercel dashboard.

The repository includes `vercel.json`: framework **Other**, no dependency installation, and build command `node scripts/build-vercel.mjs`. Leave the output directory at its default; the build generates Vercel Build Output API files automatically. Use the repository root as Root Directory. If you already imported the app as Next.js, switch its framework preset to Other and clear old build/output overrides before redeploying.

The original Cloudflare build remains available. Vercel uses a separate, dependency-free build that serves the existing frontend and packages `/api/chat` as a Node.js function. The key stays in the server environment; never place it in frontend code. `GEMINI_MODEL` is optional and defaults to `gemini-flash-latest`. Missing or invalid credentials do not prevent lessons from loading, but chat needs a working key and quota.

Verify the Vercel package locally:

```sh
node scripts/build-vercel.mjs
node tests/vercel.mjs
```

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
For the original Cloudflare deployment, this is a full-stack Cloudflare Worker app. Its build produces `dist/server/wrangler.json` and `dist/client/`. Deploy the Worker together with its assets using a Cloudflare-compatible deployment flow. Configure `GEMINI_API_KEY` as a server-side secret and optionally `GEMINI_MODEL` as a runtime variable on the new host. Secrets from the original hosting service are not included in this repository and do not transfer automatically.

GitHub stores the source code; uploading this repository does not publish a working website. GitHub Pages alone cannot run `/api/chat`. The frontend also uses root-relative URLs, so deploying under a GitHub Pages repository subpath requires path and service-worker changes.

The `.openai/hosting.json` file identifies the original ChatGPT Sites project. Do not use that identity to create a different Site. The included build integration is retained from the working source.

## Limits
Gemini and compiling/running C++ require internet. Gemini can make mistakes; output tests do not prove every input correct. The API rate guard is per worker instance, not a global spending limit; configure provider quotas separately. Progress is local to the browser and AI chat history is kept in tab memory.

## Validation at export
Production build completed. All 186 lesson render checks passed. The 16 reference exercise solutions passed 46 local C++ test cases. Gemini request validation, error handling and quota behavior passed simulated tests. Live Gemini answers were not successfully verified; the original host recorded a provider request timeout.
