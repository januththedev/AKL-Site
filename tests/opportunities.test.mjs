import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';

// Exercise the actual TypeScript implementation without adding a test dependency.
const moduleText = ts.transpileModule(readFileSync(new URL('../src/lib/opportunities.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { colomboDate, isClosed, filterOpportunities, formatClosingDate } = await import(`data:text/javascript;base64,${Buffer.from(moduleText).toString('base64')}`);
const items = [
  { id: 'driver', title: 'Heavy Duty Driver', country: 'Oman', sector: 'Transport', closesOn: '2026-10-31', summary: 'Trailer driving' },
  { id: 'mechanic', title: 'Diesel Mechanic', country: 'Qatar', sector: 'Technical', closesOn: '2026-10-30', summary: 'Equipment maintenance' },
];
const filters = { query: '', country: '', sector: '', includeClosed: false };
test('closing date changes at midnight in Sri Lanka, not UTC', () => {
  assert.equal(colomboDate(new Date('2026-10-30T18:29:59Z')), '2026-10-30');
  assert.equal(colomboDate(new Date('2026-10-30T18:30:00Z')), '2026-10-31');
});
test('a notice remains visible on its closing day and is archived the next day', () => {
  assert.equal(isClosed(items[1], '2026-10-30'), false);
  assert.equal(isClosed(items[1], '2026-10-31'), true);
  assert.deepEqual(filterOpportunities(items, filters, '2026-10-31').map(x => x.id), ['driver']);
  assert.equal(filterOpportunities(items, {...filters, includeClosed: true}, '2026-11-01').length, 2);
  assert.equal(filterOpportunities(items, filters, '2026-11-01').length, 0);
});
test('search trims whitespace and combines destination and industry filters', () => {
  assert.equal(filterOpportunities(items, {...filters, query: '  DRIVER ', country: 'Oman', sector: 'Transport'}, '2026-10-30').length, 1);
  assert.equal(filterOpportunities(items, {...filters, query: 'driver', country: 'Qatar'}, '2026-10-30').length, 0);
  assert.equal(filterOpportunities(items, {...filters, query: 'maintenance'}, '2026-10-30')[0].id, 'mechanic');
});
test('displayed closing date remains stable across time zones', () => {
  assert.equal(formatClosingDate('2026-10-31'), '31 Oct 2026');
});
