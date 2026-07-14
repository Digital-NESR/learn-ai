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
