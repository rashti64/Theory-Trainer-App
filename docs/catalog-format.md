# Question catalog format

The app reads questions in one format, defined in `src/domain/types.ts` (`Catalog`, `Question`).
Today the data comes from `src/content/placeholder-catalog.ts` (our own sample questions).
Once the licence from TÜV | DEKRA arge tp 21 is signed, their delivery is converted into this
format by the import pipeline and stored in Supabase (`catalog_versions`, `questions`).

## Catalog

| Field | Meaning |
| --- | --- |
| `version` | Catalog version, e.g. `2025-04` for the catalog valid from 1 April 2025 |
| `validFrom` / `validUntil` | Dates (YYYY-MM-DD) the catalog is used in real exams |
| `isPlaceholder` | `true` for our sample data, `false` for licensed data |
| `questions` | All questions of this version |

## Question

| Field | Meaning |
| --- | --- |
| `id` | Official question number (e.g. `1.1.02-001`); placeholder ids start with `demo-` |
| `topicId` | Topic on our learning path (`src/content/path.ts`) |
| `section` | `basic` (Grundstoff) or `class` (Zusatzstoff) |
| `classes` | Licence classes examined on this question (`B`, `A`, …) |
| `points` | Error points if wrong: 2, 3, 4 or 5 |
| `kind` | `multiple-choice` (one or more correct options) or `number` |
| `prompt` | Question text per language; `de` required |
| `options` | For multiple choice: id, text per language, `correct` |
| `numberAnswer` | For number questions: value and unit |
| `media` | Image or video in Supabase Storage |
| `explanation` | Our own short explanation (not part of the official catalog) |
| `variantOf` | Mother question id when this question is a variant |

## Import pipeline (to build when the licence is in place)

1. Receive the licensed delivery (format agreed with arge tp 21).
2. Convert it to `Catalog`, mapping official topic numbers to our `topicId`s.
3. Run `validateCatalog` (`src/domain/catalog.ts`); stop on any issue.
4. Upload images and videos to Supabase Storage.
5. Insert the version with `published_at = null`, spot-check a sample, then publish.

Learners pick their exam date; the app uses the catalog version valid on that date.
