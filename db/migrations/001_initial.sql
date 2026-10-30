-- AKL application schema blueprint. Not executed by the handoff package.
-- Review against the target application's migration strategy before applying.
-- Never modify managed neon_auth tables from this schema.
CREATE SCHEMA IF NOT EXISTS akl;

CREATE TABLE IF NOT EXISTS akl.admin_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id text NOT NULL UNIQUE,
  email text NOT NULL,
  display_name text NOT NULL DEFAULT '',
  role text NOT NULL CHECK (role IN ('super_admin','admin')),
  active boolean NOT NULL DEFAULT true,
  access_version integer NOT NULL DEFAULT 1 CHECK (access_version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS akl.admin_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  intended_role text NOT NULL CHECK (intended_role IN ('super_admin','admin')),
  token_hash text NOT NULL UNIQUE,
  state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','accepted','revoked')),
  expires_at timestamptz NOT NULL,
  invited_by uuid NOT NULL REFERENCES akl.admin_memberships(id),
  accepted_auth_user_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz
);
CREATE INDEX IF NOT EXISTS invitations_email_state ON akl.admin_invitations(lower(email),state);

CREATE TABLE IF NOT EXISTS akl.content_drafts (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  updated_by uuid REFERENCES akl.admin_memberships(id),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS akl.content_releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manifest jsonb NOT NULL,
  message text NOT NULL DEFAULT '',
  published_by uuid NOT NULL REFERENCES akl.admin_memberships(id),
  source_release_id uuid REFERENCES akl.content_releases(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS akl.site_state (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  active_release_id uuid REFERENCES akl.content_releases(id),
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO akl.site_state(singleton) VALUES (true) ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS akl.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_key text NOT NULL UNIQUE,
  original_filename text NOT NULL,
  content_type text NOT NULL,
  byte_size bigint NOT NULL CHECK (byte_size > 0),
  state text NOT NULL DEFAULT 'staging' CHECK (state IN ('staging','processing','ready','failed','archived')),
  source_type text NOT NULL DEFAULT 'stock' CHECK (source_type IN ('stock','destination','company','document')),
  alt_text text NOT NULL DEFAULT '',
  credit text NOT NULL DEFAULT '',
  source_url text NOT NULL DEFAULT '',
  license text NOT NULL DEFAULT '',
  focal_points jsonb NOT NULL DEFAULT '{"desktop":{"x":0.5,"y":0.5},"mobile":{"x":0.5,"y":0.5}}',
  variants jsonb NOT NULL DEFAULT '{}',
  width integer,
  height integer,
  sha256 text,
  uploaded_by uuid NOT NULL REFERENCES akl.admin_memberships(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS akl.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key text NOT NULL UNIQUE,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_review','contacted','qualified','closed','spam')),
  assigned_to uuid REFERENCES akl.admin_memberships(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS inquiries_status_date ON akl.inquiries(status,created_at DESC);
CREATE TABLE IF NOT EXISTS akl.inquiry_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  inquiry_id uuid NOT NULL REFERENCES akl.inquiries(id),
  actor_id uuid REFERENCES akl.admin_memberships(id),
  event_type text NOT NULL,
  detail jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS akl.knowledge_entries (
  id text PRIMARY KEY,
  topic text NOT NULL,
  locale text NOT NULL CHECK (locale IN ('en','si','ta')),
  question text NOT NULL DEFAULT '',
  answer text NOT NULL,
  aliases jsonb NOT NULL DEFAULT '[]',
  source_refs jsonb NOT NULL,
  actions jsonb NOT NULL DEFAULT '[]',
  state text NOT NULL DEFAULT 'draft' CHECK (state IN ('draft','in_review','approved','published','archived')),
  version integer NOT NULL DEFAULT 1,
  reviewed_by uuid REFERENCES akl.admin_memberships(id),
  reviewed_at timestamptz,
  valid_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS akl.audit_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id uuid REFERENCES akl.admin_memberships(id),
  action text NOT NULL,
  resource_id text NOT NULL,
  detail jsonb NOT NULL DEFAULT '{}',
  request_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_date ON akl.audit_events(created_at DESC);

CREATE TABLE IF NOT EXISTS akl.rate_limits (
  key text PRIMARY KEY,
  hits integer NOT NULL DEFAULT 1,
  reset_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS akl.chat_cache (
  key text PRIMARY KEY,
  payload jsonb NOT NULL,
  expires_at timestamptz NOT NULL
);

-- Role mutations must acquire a shared lock before reading owner count, e.g.:
-- BEGIN;
-- SELECT pg_advisory_xact_lock(6031980);
-- Re-read actor's active membership, validate capability/recent auth.
-- Lock target; count remaining active super_admin rows.
-- Block removal/demotion/suspension if it would leave zero owners.
-- Write + increment access_version + audit, then COMMIT.
-- Bootstrap/invitations/imports must use a compatible invariant strategy.
-- App DB credentials stay server-only; no anonymous writes to this schema.
