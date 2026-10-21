# Theory Trainer — team handbook

Read this first. It applies to every agent working in this repo. Expo-specific rules are in `AGENTS.md`; follow both.

## What we are building

A mobile app (Android first, iOS later) that prepares learners for the German theory driving test,
class B (car), through short, game-like daily lessons: a learning path, 3–5 minute lessons, streaks,
XP, spaced repetition, and an exam simulator with the official scoring rules.

The product owner is the repository owner. They approve every pull request and every external action.

## Non-negotiables

1. **No official content in the repo until the licence exists.** The official questions, images,
   videos and translations belong to TÜV | DEKRA arge tp 21. Until the licence is signed we use
   `src/content/placeholder-catalog.ts`, written by us. Never copy questions or media from other
   apps, websites or PDFs.
2. **Our own brand.** The app may feel playful like the best language-learning apps, but it never
   copies another product's name, mascot, colours, sounds or screens. The look comes from German
   road signage (see `src/ui/theme.ts`).
3. **Exam rules are pinned by tests.** `src/domain/exam.ts` implements FeV Anlage 7: 30 questions
   (20 basic + 10 class), at most 10 error points, two wrong 5-point questions fail. Change these
   only with a cited source and an updated test.
4. **Privacy.** EU data region, publishable key only in the app, row-level security on every table,
   in-app account deletion. No analytics without consent.
5. **Secrets never enter git.** `.env.local` and EAS environment variables only.

## Architecture

```
src/
  app/        Screens (Expo Router). Every file is a route. No business logic here.
  domain/     Pure TypeScript: exam rules, spaced repetition, lessons, streaks, catalog validation.
              No React, no platform APIs. Everything here has unit tests.
  content/    Learning path (units, topics) and the placeholder catalog.
  state/      App state (React context + reducer), persisted on device; session + sync.
  lib/        Supabase client and sync.
  ui/         Design tokens, i18n strings, shared components.
supabase/     SQL migrations (schema + RLS).
docs/         Product and data documentation.
.claude/agents/  The team: one brief per role.
```

Data flow: screen → `useAppState()` → reducer → domain functions → persisted state → (signed in) sync snapshot to Supabase.

## Commands

```bash
npm install
npx expo start          # dev server; open in Expo Go or a development build
npm run typecheck       # tsc --noEmit
npm run lint            # expo lint
npm test                # jest (domain tests)
```

Use `npx expo install <pkg>` for every dependency so versions match the Expo SDK.

## Definition of done

A change is done when:

- typecheck, lint and tests pass locally and in CI;
- new domain logic has unit tests, including edge cases;
- user-facing text exists in German and English (`src/ui/i18n.ts`), German first;
- screens work at 360 px width, respect safe areas, and have accessibility labels on icon-only controls;
- the PR description says what changed, why, and how it was tested, with screenshots for UI changes;
- the reviewer agent has reviewed it and the product owner has approved it.

## Conventions

- TypeScript strict. No `any`. Prefer small pure functions in `domain/`.
- File names in kebab-case; components in PascalCase.
- Copy: sentence case, plain verbs, the learner is "du" in German UI and "Sie" inside exam questions
  (as in the official catalog).
- Branches: `feature/<short-name>`, `fix/<short-name>`. One topic per PR.
- Commits: imperative mood ("Add exam result screen").

## Working as a team

The lead (architect) breaks work into issues and assigns them to a role from `.claude/agents/`.
Each role works on its own branch, opens a PR, and hands it to the reviewer. Nothing merges without
the product owner. When a task needs a decision that belongs to the product owner (money, accounts,
legal, brand, anything irreversible), stop and ask.

## Open dependencies

- Licence for the official catalog (TÜV | DEKRA arge tp 21) — blocks real content.
- Supabase project (EU) — blocks accounts and sync; the app runs in guest mode without it.
- Google Play developer account and Expo account — block store builds.
- Final app name, package id (`com.theorytrainer.app` is a placeholder) and mascot.
