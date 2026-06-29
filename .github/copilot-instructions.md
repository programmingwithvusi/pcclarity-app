## PCClarity — Copilot instructions for contributors

These notes capture the essential knowledge an AI coding agent needs to be productive in this repository.

- Purpose: React + TypeScript frontend for a PC health SaaS. Frontend proxies API calls to a C# backend during development.

Quick dev commands
- Install: `npm install`
- Dev server: `npm run dev` (Vite serves on http://localhost:3000)
- Build (typecheck + bundle): `npm run build` (runs `tsc` then `vite build`)
- Preview build: `npm run preview`

Important config & environment
- Vite proxy (see `vite.config.ts`): all `/api` requests are proxied to `https://localhost:5001` and `secure: false` is set to allow self-signed certs. Keep this in mind when running the backend locally.
- Env: `VITE_STRIPE_PRICE_ID` is required for the subscription checkout flow. It's read in `src/hooks/useSubscription.ts`.

High-level architecture & data flows
- Routing: `src/App.tsx` — routes are `/dashboard` and `/pricing` (default redirect to `/dashboard`).
- API surface: `src/api/client.ts` centralizes all HTTP calls. The frontend calls paths like `/api/pchealth/scan` and Vite forwards them to the backend.
- Types: `src/types/index.ts` mirrors the C# models (PcHealthReport, SubscriptionStatus, RateLimitError) — use these types for new API work.
- React Query: the app uses `@tanstack/react-query` for server state (see `src/App.tsx` QueryClient and `src/hooks/*` hooks). Query keys are important (e.g. `['scan', userId]`, `['subscription', userId]`).

Patterns & project-specific conventions
- Single API wrapper: use the `request<T>(path, options)` helper in `src/api/client.ts` for all fetches so error handling and JSON parsing are consistent. It throws an Error with `status` and `body` properties when non-OK.
- Rate-limit handling: server 429 responses are shaped as `RateLimitError` (see `src/types/index.ts`) and the client exposes `isRateLimitError(err)` to detect them.
- React Query usage:
  - Scans are on-demand: `useScan` sets `enabled: false` and exposes `runScan()` which calls `queryClient.fetchQuery` (staleTime and retry policy are important here).
  - Subscription status is cached for 5 minutes (`staleTime: 1000 * 60 * 5`).
- Local user identity: `useUser` stores a generated ID in localStorage under key `pccclarity_user_id` — don't replace with a server identity without updating hooks and API expectations.

Integration & external dependencies
- Stripe checkout: `useSubscription.upgrade()` calls `createCheckout` and then sets `window.location.href` to the returned `checkoutUrl`. The `priceId` comes from `VITE_STRIPE_PRICE_ID`.
- Anthropic (AI assistant): `src/components/AiAssistant.tsx` calls `https://api.anthropic.com/v1/messages` directly and expects `data.content` entries where a `type === 'text'` has the assistant text. Be careful editing this — there is no API key handling in this file; adding keys or changing response parsing will affect the chat UI.

Files to inspect first (most-valuable):
- `src/api/client.ts` — central request wrapper, helpers `isRateLimitError`, `formatBytes`.
- `src/hooks/useScan.ts` — scan lifecycle, runScan, and rate-limit UI interaction.
- `src/hooks/useSubscription.ts` — checkout flow, `VITE_STRIPE_PRICE_ID` usage.
- `src/components/AiAssistant.tsx` — chat UI, free-limit logic, and external AI call shape.
- `src/types/index.ts` — canonical types shared with backend.
- `vite.config.ts` & `README.md` — dev proxy and setup notes.

Examples (copy/paste friendly)
- API call pattern: use `request<T>` in `src/api/client.ts` rather than calling fetch directly so errors are normalized.
- React Query key example: `['scan', userId]` — keep key shapes stable when invalidating or refetching.

Gotchas & quick checks
- `tsc` is run during build for type checking but `tsconfig.json` has `noEmit: true` — type errors will fail the build step even though no files are emitted.
- Vite proxy uses `secure: false` — if you change proxy targets, be conscious of certificate handling.
- The AI assistant currently sends a literal `system` prompt and expects a specific response shape; if replacing the model or provider, update both request shape and the parsing logic.

When updating API shapes
- Update `src/types/index.ts` first, then the client and any hooks/components that consume the types. Run `npm run build` locally to catch type regressions.

If you need more context
- The C# backend endpoints are referenced by path in `src/api/client.ts` (e.g. `/pchealth/scan`, `/subscription/checkout`) — consult backend repo for exact contract if available.

If anything above is unclear or missing, tell me which area to expand (examples, hooks, or API shapes) and I'll iterate.
