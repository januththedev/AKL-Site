export type Role = 'super_admin' | 'admin';
export type Member = { id: string; auth_user_id: string; email: string; display_name: string; role: Role; active: boolean; access_version: number };
export type PageCopy = { eyebrow: string; heading: string; accent: string; intro: string; image: string };
export type Industry = { slug: string; title: string; description: string; image: string; roles: string[] };
export type Destination = { slug: string; title: string; region: string; description: string; image: string };
export type KnowledgeEntry = { id: string; topic: string; locale: 'en' | 'si' | 'ta'; question: string; answer: string; aliases: string[]; source_refs: { sourceId: string; page?: number | null }[]; actions: string[]; state: string; version: number; valid_until?: string | null };
export type SiteContent = {
  home: PageCopy; employers: PageCopy; about: PageCopy;
  settings: { brand: string; phone: string; email: string; address: string; careersUrl: string; facebookUrl: string; profileUrl: string };
  industries: Industry[]; destinations: Destination[];
  story: { heading: string; body: string; closing: string };
};
export type Inquiry = { id: string; payload: Record<string, string | number>; status: string; created_at: string; assigned_to: string | null };
export type Release = { id: string; message: string; created_at: string; published_by: string; manifest: { content: SiteContent; knowledge: KnowledgeEntry[] } };
