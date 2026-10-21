# Theory Trainer — team handbook

Read this first. It applies to every agent working in this repo. Expo-specific rules are in `AGENTS.md`; follow both.

## What we are building

A mobile app (Android first, iOS later) that prepares learners for the German theory driving test,
class B (car), through short, game-like daily lessons: a learning path, 3–5 minute lessons, streaks,
XP, spaced repetition, and an exam simulator with the official scoring rules.

The product owner is the repository owner. They approve every pull request and every external action.

## Non-negotiables

1. **No official content in the repo until the licence exists.** The official questions, images,
   videos and translations belong to TÜV | DEKRA arge tp 21. We use our own question bank in
   `src/content/bank/` (written in our own words, covering the class B syllabus). Never copy
   questions or media from other apps, websites or PDFs. Every new or changed question gets an
   independent fact-check against StVO / FeV / StVZO before it ships.
2. **Our own brand.** We follow Duolingo's design *principles* (vibrant colour, chunky rounded
   shapes, one clear path, characters that react, tactile buttons, sound and haptics) but never copy
   its name, mascot, colours, fonts, sounds or screens. Our palette comes from German road signage
   (`src/ui/theme.ts`); the type is Nunito; the mascot is our traffic light. The design direction is
   written up in the team brief (section "Design direction v2").
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
  content/    Learning path (one district per topic) and the question bank (`bank/`, one file per
              topic, written with the helpers in `bank/build.ts`; signs and junction diagrams
              are data, drawn by `ui/traffic-graphics.tsx`).
  state/      App state (React context + reducer), persisted on device; session + sync.
  lib/        Supabase client and sync.
  ui/         Design tokens, i18n strings, shared components, sound/haptic feedback.
  ui/city3d/  The 3D learning map (three.js via react-three-fiber + expo-gl): world layout
              (pure, tested), models, scene, camera rig, time-of-day lighting. Text and buttons
              are a native layer pinned to 3D positions, never drawn inside WebGL.
supabase/     SQL migrations (schema + RLS).
docs/         Product and data documentation.
.claude/agents/  The team: one brief per role.
```

Data flow: screen → `useAppState()` → reducer → domain functions → persisted state → (signed in) sync snapshot to Supabase.

## Readiness programme

Onboarding (exam date, daily goal) → entry test (20 questions, all topics) → daily plan to the exam
date → lessons, with the 4th stop of each unit a unit test (80 % to pass) → mock exams with the
official scoring → readiness score 0–100 (`domain/readiness.ts`). "Ready" requires all five
criteria: 95 % coverage, 85 % mastery, 90 % on 5-point questions, no topic below 70 %, and the
last 3 mock exams passed with at most 6 error points. Change targets only with a test.

## Commands

```bash
npm install
npx expo start          # dev server; open in Expo Go or a development build
npm run typecheck       # tsc --noEmit
npm run lint            # expo lint
npm test                # jest (domain tests)
```

Use `npx expo install <pkg>` for every dependency so versions match the Expo SDK.

## 3D rules

- Import react-three-fiber only through `src/ui/city3d/r3f(.native).ts` (web vs. expo-gl entry).
- Keep models low-poly and rounded (`shapes.ts`); share geometry, instance anything repeated.
- Anything mutable and imperative (camera, gestures) lives outside React (see `camera-rig.ts`);
  React reads snapshots via `useSyncExternalStore`. The React Compiler is on.
- Every animation must stop when "reduce motion" is on.
- Check performance on a real mid-range Android phone before shipping 3D changes.

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
