/**
 * Catalog validation, shared by the app and the import pipeline (scripts/import-catalog.ts).
 * The licensed TÜV | DEKRA arge tp 21 data is converted into our Catalog format first;
 * this function checks the result before anything is published.
 */
import type { Catalog, Question } from './types';

export type CatalogIssue = { questionId: string | null; message: string };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function validateCatalog(catalog: Catalog): CatalogIssue[] {
  const issues: CatalogIssue[] = [];
  const add = (questionId: string | null, message: string) => issues.push({ questionId, message });

  if (!catalog.version) add(null, 'Catalog has no version.');
  if (!ISO_DATE.test(catalog.validFrom)) add(null, 'validFrom must be YYYY-MM-DD.');
  if (catalog.validUntil && !ISO_DATE.test(catalog.validUntil)) {
    add(null, 'validUntil must be YYYY-MM-DD.');
  }

  const ids = new Set<string>();
  for (const q of catalog.questions) {
    if (ids.has(q.id)) add(q.id, 'Duplicate question id.');
    ids.add(q.id);
    for (const message of validateQuestion(q, catalog.version)) add(q.id, message);
  }

  for (const q of catalog.questions) {
    if (q.variantOf && !ids.has(q.variantOf)) {
      add(q.id, `variantOf points to unknown question "${q.variantOf}".`);
    }
  }
  return issues;
}

function validateQuestion(q: Question, version: string): string[] {
  const problems: string[] = [];
  if (q.catalogVersion !== version) problems.push('catalogVersion does not match the catalog.');
  if (![2, 3, 4, 5].includes(q.points)) problems.push('points must be 2, 3, 4 or 5.');
  if (q.classes.length === 0) problems.push('Question is not assigned to any licence class.');
  if (!q.prompt.de?.trim()) problems.push('German prompt is missing.');

  if (q.kind === 'multiple-choice') {
    const options = q.options ?? [];
    if (options.length < 2) problems.push('Multiple-choice question needs at least 2 options.');
    if (!options.some((o) => o.correct)) problems.push('No correct option.');
    if (options.some((o) => !o.text.de?.trim())) problems.push('An option has no German text.');
    if (new Set(options.map((o) => o.id)).size !== options.length) {
      problems.push('Option ids must be unique.');
    }
  } else if (q.kind === 'number') {
    if (!q.numberAnswer || !Number.isFinite(q.numberAnswer.value)) {
      problems.push('Number question has no valid answer.');
    }
  }
  return problems;
}
