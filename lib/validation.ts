import { z } from 'zod';
import { safeMediaPath, safePublicUrl } from './policy';

const text = (max = 2000) => z.string().trim().min(1).max(max);
const image = z.string().max(500).refine(safeMediaPath, 'Choose an approved local or uploaded image.');
const page = z.object({ eyebrow: text(120), heading: text(150), accent: text(150), intro: text(1500), image });
export const contentSchema = z.object({
  home: page, employers: page, about: page,
  settings: z.object({ brand: text(100), phone: text(60), email: z.email(), address: text(400), careersUrl: z.string().refine(safePublicUrl), facebookUrl: z.string().refine(safePublicUrl), profileUrl: z.string().max(500).refine(v => /^\/documents\/[a-z0-9-]+\.pdf$/.test(v) || safePublicUrl(v)) }),
  story: z.object({ heading: text(200), body: text(3000), closing: text(600) }),
  industries: z.array(z.object({ slug: z.string().regex(/^[a-z0-9-]+$/), title: text(100), description: text(1500), image, roles: z.array(text(100)).max(10) })).min(1).max(12),
  destinations: z.array(z.object({ slug: z.string().regex(/^[a-z0-9-]+$/), title: text(100), region: text(100), description: text(1500), image })).min(1).max(10),
}).strict();
export const inquirySchema = z.object({
  company: text(160), country: text(100), industry: text(100), roles: text(500), headcount: z.coerce.number().int().min(1).max(50000), timing: z.string().max(120).default(''),
  name: text(120), email: z.email().max(240), phone: z.string().max(60).default(''), message: z.string().max(3000).default(''), consent: z.literal(true), idempotencyKey: z.uuid(), website: z.string().max(200).default(''),
}).strict();
export const knowledgeSchema = z.object({ id: z.string().regex(/^[a-zA-Z0-9-]+$/).max(100), topic: text(100), locale: z.enum(['en','si','ta']), question: text(400), answer: text(3000), aliases: z.array(text(250)).max(20), source_refs: z.array(z.object({ sourceId: text(200), page: z.number().int().min(1).nullable().optional() })).min(1).max(10), actions: z.array(z.enum(['careers','contact','employers','services','about','industries','process','phone','email','directions','application_status','profile_download','image_credits','employer_inquiry','home'])).max(5), version: z.number().int().min(0), valid_until: z.iso.datetime().nullable().optional() }).strict();
