# Theory Trainer

A game-style mobile app for the German theory driving test (class B): a few minutes a day on a
learning path, streaks and XP, spaced repetition, and an exam simulator with the official scoring rules.

Built with Expo (React Native + TypeScript) and Supabase.

> The questions in this repo are placeholders written by our team. The official catalog will be
> added once the licence from TÜV | DEKRA arge tp 21 is in place.

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with the Expo Go app on your phone. Without Supabase keys the app runs in
guest mode and keeps progress on the device.

To enable accounts and sync, copy `.env.example` to `.env.local`, add your Supabase URL and
publishable key, and apply `supabase/migrations/` to your project.

## Check it

```bash
npm run typecheck
npm run lint
npm test
```

## Project

- `CLAUDE.md` — team handbook: architecture, rules, definition of done
- `.claude/agents/` — the AI development team, one brief per role
- `docs/catalog-format.md` — question data format and import pipeline
- `docs/launch-checklist.md` — what is left before the Play Store
