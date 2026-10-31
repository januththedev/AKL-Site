-- Private, personalised employer portfolio links (/for/<slug>).
-- Additive only: one new table plus one nullable column on akl.inquiries.
-- Existing inquiry inserts that do not mention portfolio_link_id keep working unchanged.
CREATE SCHEMA IF NOT EXISTS akl;

CREATE TABLE IF NOT EXISTS akl.portfolio_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*-[a-z0-9]{10}$' AND char_length(slug) <= 80),
  company_name text NOT NULL CHECK (char_length(company_name) BETWEEN 1 AND 160),
  contact_name text NOT NULL DEFAULT '' CHECK (char_length(contact_name) <= 120),
  country text NOT NULL DEFAULT '' CHECK (char_length(country) <= 100),
  sectors text[] NOT NULL DEFAULT '{}',
  roles text[] NOT NULL DEFAULT '{}',
  intro_message text NOT NULL DEFAULT '' CHECK (char_length(intro_message) <= 1200),
  show_clients boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  view_count integer NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  last_viewed_at timestamptz,
  created_by uuid REFERENCES akl.admin_memberships(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
-- slug is UNIQUE (which already creates an index); the explicit name documents the public lookup path.
CREATE INDEX IF NOT EXISTS portfolio_links_slug ON akl.portfolio_links(slug);
CREATE INDEX IF NOT EXISTS portfolio_links_created ON akl.portfolio_links(created_at DESC);

-- Trace an inquiry back to the private link it came from. The link may later be deleted;
-- the inquiry is kept and simply loses the reference.
ALTER TABLE akl.inquiries ADD COLUMN IF NOT EXISTS portfolio_link_id uuid REFERENCES akl.portfolio_links(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS inquiries_portfolio_link ON akl.inquiries(portfolio_link_id) WHERE portfolio_link_id IS NOT NULL;
