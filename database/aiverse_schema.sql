-- NESR AI Verse — aiverse_db schema
-- Per-person progress, grand certificate, and hackathon team entry.

create table if not exists users (
  email text primary key,
  name text not null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists module_progress (
  user_email text not null references users(email) on delete cascade,
  module_id text not null,
  score int not null,
  total int not null,
  completed_at timestamptz not null,
  updated_at timestamptz not null default now(),
  primary key (user_email, module_id)
);

-- One grand certificate per person, issued once every track/module is complete.
create table if not exists certificates (
  user_email text primary key references users(email) on delete cascade,
  recipient_name text not null,
  issued_at timestamptz not null default now()
);

create table if not exists hackathon_teams (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_by_email text not null references users(email) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists hackathon_team_members (
  team_id uuid not null references hackathon_teams(id) on delete cascade,
  email text not null,
  display_name text not null,
  department text,
  job_title text,
  joined_at timestamptz not null default now(),
  primary key (team_id, email)
);

-- One team per person.
create unique index if not exists hackathon_team_members_one_per_person
  on hackathon_team_members(email);

-- Admin-authored edits/creations/deletions layered over the static modules in
-- src/app/content.ts at render time (see src/lib/content-resolver.ts). Vercel's
-- filesystem is read-only in production, so admin edits can't touch content.ts
-- directly — this table is the actual source of truth for anything an admin
-- has touched, static content.ts remains the fallback/default for everything else.
create table if not exists module_overrides (
  id text primary key,
  track_id text not null,
  part int not null,
  part_label text not null,
  title text not null,
  tagline text not null,
  minutes int not null,
  sections jsonb not null default '[]'::jsonb,
  quiz jsonb not null default '[]'::jsonb,
  is_deleted boolean not null default false,
  updated_at timestamptz not null default now()
);
-- 'required' | 'half' | 'optional' — how the module counts toward the
-- certificate (see src/lib/certificate.ts). Added after the table already
-- shipped, so it's a separate ALTER rather than part of the CREATE above.
alter table module_overrides add column if not exists requirement text not null default 'required';

-- A row here means the whole track (and everything in it) is hidden from the
-- site. Presence of a row = deleted; there's nothing else to store.
create table if not exists track_overrides (
  id text primary key,
  deleted_at timestamptz not null default now()
);

-- Undo log for /admin. previous_row is the exact prior row for (table_name,
-- row_id) before the action ran — null means no row existed yet, so undoing
-- means deleting the row rather than restoring one. Trimmed to the last 20
-- rows per actor in saveModule/deleteModule/deleteTrack.
create table if not exists admin_actions (
  id uuid primary key default gen_random_uuid(),
  actor_email text not null,
  table_name text not null,
  row_id text not null,
  description text not null,
  previous_row jsonb,
  created_at timestamptz not null default now()
);

-- 'active' | 'disqualified', app-validated (see src/app/actions/admin-hackathon.ts).
alter table hackathon_teams add column if not exists status text not null default 'active';

-- Singleton row (id is always 1) holding the hackathon admin's event settings —
-- registration window, key dates, venue, team-size limits, announcement copy.
-- Read by the public hackathon page and enforced by createTeam/addTeamMember.
create table if not exists hackathon_settings (
  id int primary key default 1,
  status text not null default 'draft', -- draft | open | closed
  registration_opens_at timestamptz,
  registration_closes_at timestamptz,
  event_start_at timestamptz,
  submission_deadline_at timestamptz,
  presentation_at timestamptz,
  venue text,
  meeting_link text,
  min_team_size int not null default 2,
  max_team_size int not null default 5,
  contact_email text,
  eligibility text,
  announcement text,
  updated_at timestamptz not null default now(),
  check (id = 1)
);
insert into hackathon_settings (id) values (1) on conflict (id) do nothing;

-- One submission per team, holding project metadata; the actual file(s) live in
-- hackathon_submission_files below (a submission can have multiple files).
create table if not exists hackathon_submissions (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null unique references hackathon_teams(id) on delete cascade,
  title text not null,
  description text,
  video_link text, -- Google Drive link, for mp4/video submissions instead of a file upload.
  submitted_by_email text not null references users(email) on delete cascade,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_late boolean not null default false,
  answers jsonb not null default '{}'::jsonb,
  is_final boolean not null default false,
  final_submitted_at timestamptz
);
-- Kept for databases created before these columns existed (CREATE TABLE above
-- only applies its column list on first creation).
alter table hackathon_submissions add column if not exists is_late boolean not null default false;
alter table hackathon_submissions add column if not exists video_link text;
-- Answers to the fixed deliverables questionnaire (see src/app/hackathon-deliverables.ts),
-- keyed by question id. Editable any time (draft-friendly) until the event wraps up.
alter table hackathon_submissions add column if not exists answers jsonb not null default '{}'::jsonb;
-- Once a team clicks "Submit" (as opposed to "Save draft"), is_final locks the submission —
-- server actions refuse further edits until an admin reopens it (see reopenSubmissionAdmin).
alter table hackathon_submissions add column if not exists is_final boolean not null default false;
alter table hackathon_submissions add column if not exists final_submitted_at timestamptz;

-- Multiple files per submission. file_data holds the raw bytes directly — fine
-- at pdf/pptx sizes, no external storage needed. Validated to .pdf/.pptx and
-- size-capped in the server action.
create table if not exists hackathon_submission_files (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references hackathon_submissions(id) on delete cascade,
  file_name text not null,
  file_type text not null, -- 'pdf' | 'pptx'
  file_size int not null,
  file_data bytea not null,
  uploaded_at timestamptz not null default now()
);

-- One-time migration for databases created before submissions supported
-- multiple files: move the old single file into the new child table, then
-- drop the now-redundant columns. Only runs once, while they still exist.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'hackathon_submissions' and column_name = 'file_data'
  ) then
    insert into hackathon_submission_files (submission_id, file_name, file_type, file_size, file_data, uploaded_at)
    select id, file_name, file_type, file_size, file_data, submitted_at from hackathon_submissions;
    alter table hackathon_submissions drop column file_name;
    alter table hackathon_submissions drop column file_type;
    alter table hackathon_submissions drop column file_size;
    alter table hackathon_submissions drop column file_data;
  end if;
end $$;

-- A request to join an existing team, requiring the team's creator to approve
-- it before the requester actually becomes a member (see requestToJoinTeam /
-- approveJoinRequest / rejectJoinRequest in src/app/actions/hackathon.ts).
-- The partial unique index below enforces one outstanding request per person.
create table if not exists hackathon_join_requests (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references hackathon_teams(id) on delete cascade,
  requester_email text not null references users(email) on delete cascade,
  requester_display_name text not null,
  requester_department text,
  requester_job_title text,
  status text not null default 'pending', -- pending | approved | rejected
  requested_at timestamptz not null default now(),
  resolved_at timestamptz
);
create unique index if not exists hackathon_join_requests_one_pending_per_person
  on hackathon_join_requests(requester_email) where status = 'pending';
