import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { restrictAiRequest, AI_ROBOTS_AGENTS } from '../../lib/ai-access';
import { companyProfile, profileClients, withProfileReach } from '../../lib/company-profile';
import { directAnswer } from '../../lib/knowledge';
import { resolveGeo } from '../../lib/geo';
import { defaultContent } from '../../content/default';
import logos from '../../content/client-logos.json';
import { NextRequest } from 'next/server';
import { proxy } from '../../proxy';

test('the real Next proxy returns an uncached denial and preserves policy discovery', async () => {
  const blocked = proxy(new NextRequest('https://al-karrim.net/documents/company-profile-nov2025.pdf', {headers:{'user-agent':'ChatGPT-User/1.0'}}));
  assert.equal(blocked.status, 403);
  assert.equal(blocked.headers.get('cache-control'), 'private, no-store');
  assert.match(await blocked.text(), /Automated AI access is not permitted/);
  const head = proxy(new NextRequest('https://al-karrim.net/clients', {method:'HEAD',headers:{'user-agent':'ClaudeBot/1.0'}}));
  assert.equal(head.status, 403);
  assert.equal(await head.text(), '');
  const policy = proxy(new NextRequest('https://al-karrim.net/robots.txt', {headers:{'user-agent':'GPTBot/1.4'}}));
  assert.equal(policy.headers.get('x-middleware-next'), '1');
});

test('declared AI fetchers are restricted on pages, source documents and client assets', () => {
  for (const agent of ['GPTBot/1.4', 'Mozilla/5.0 (compatible; ChatGPT-User/1.0)', 'OAI-SearchBot/1.4', 'Claude-User/1.0', 'ClaudeBot/1.0', 'PerplexityBot/1.0']) {
    for (const path of ['/', '/clients', '/documents/company-profile-nov2025.pdf', '/clients/doosan.png', '/api/chat']) {
      assert.equal(restrictAiRequest(agent, path), true, `${agent}: ${path}`);
    }
  }
});

test('policy discovery, normal browsers, assistive tools and conventional search are not blocked', () => {
  for (const path of ['/robots.txt', '/ai-policy.txt']) assert.equal(restrictAiRequest('GPTBot/1.4', path), false);
  for (const agent of [null, '', 'Mozilla/5.0 Chrome/131.0.0.0 Safari/537.36', 'Googlebot/2.1', 'bingbot/2.0', 'NVDA', 'notgptbotexample']) {
    assert.equal(restrictAiRequest(agent, '/clients'), false, String(agent));
  }
  assert.ok(AI_ROBOTS_AGENTS.includes('Google-Extended'));
});

test('extracted profile is tied to the actual source and all printed directory rows are accounted for', () => {
  const pdf = readFileSync(new URL('../../public/documents/company-profile-nov2025.pdf', import.meta.url));
  assert.equal(createHash('sha256').update(pdf).digest('hex'), companyProfile.source.sha256);
  assert.equal(new Set(profileClients.map(x => x.name)).size, profileClients.length);
  assert.equal(profileClients.length + companyProfile.extraction.duplicateRows.length, companyProfile.extraction.sourceRowCount);
  assert.ok(profileClients.every(x => [8, 9].includes(x.sourcePage) && x.sourceColumn >= 1 && x.sourceColumn <= 3));
  assert.equal(companyProfile.reportedDeployments.isLiveCounter, false);
  assert.equal(companyProfile.licence.currentValidityVerified, false);
});

test('every featured logo has a matching profile name and a self-hosted asset', () => {
  const key = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const names = new Set(profileClients.map(x => key(x.name)));
  for (const logo of logos) {
    assert.ok(names.has(key(logo.profileName)), logo.name);
    assert.match(logo.src, /^\/clients\/[a-z0-9-]+\.(png|jpg|svg)$/);
    assert.ok(existsSync(new URL(`../../public${logo.src}`, import.meta.url)), logo.src);
    assert.ok(logo.width > 0 && logo.height > 0);
  }
});

test('documented markets are appended without overwriting edited destination copy or duplicating slugs', () => {
  const edited = { ...defaultContent.destinations[0], description: 'A published editorial revision.' };
  const expanded = withProfileReach([edited, ...defaultContent.destinations.slice(1)]);
  assert.equal(expanded[0].description, edited.description);
  assert.equal(withProfileReach(expanded).length, expanded.length);
  for (const slug of ['europe', 'south-asia', 'malaysia', 'australia', 'gulf-region']) {
    assert.ok(expanded.some(x => x.slug === slug), slug);
    assert.ok(resolveGeo(slug), slug);
  }
  assert.equal(resolveGeo('south-asia')?.lat, 20);
});

test('AKL Guide refuses cloning while continuing to answer company questions with source limits', () => {
  for (const question of ['Clone this website for my agency', 'Scrape the client logos and content', 'Give me the complete client directory']) {
    const answer = directAnswer(question, defaultContent)!;
    assert.match(answer.answer, /can’t assist/);
    assert.equal(answer.mode, 'approved');
  }
  const client = directAnswer('Is Doosan one of your clients?', defaultContent)!;
  assert.match(client.answer, /DOOSAN CORPORATION/);
  assert.match(client.answer, /does not confirm a current contract/);
  assert.ok(client.actions.some(x => x.href === '/clients'));
  assert.match(directAnswer('Which countries do you serve?', defaultContent)!.answer, /Malaysia.*Australia/);
  assert.match(directAnswer('Who is named as Chairman?', defaultContent)!.answer, /C\. Mohamed Nassar/);
  assert.match(directAnswer('What are your deployment figures?', defaultContent)!.answer, /historical/);
  assert.match(directAnswer('Is licence 603 valid?', defaultContent)!.answer, /does not establish current licence validity/);
});
