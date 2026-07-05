-- GymBuddy Member Portal tables
-- Run this in the Supabase SQL Editor for the same project used by .env.local.
-- RLS stays disabled for MVP testing unless you explicitly enable it later.

create table if not exists public.member_profiles (
  id bigint generated always as identity primary key,
  gym_id uuid not null references public.gyms(id) on delete cascade,
  member_id bigint not null references public.members(id) on delete cascade,
  full_name text,
  phone text,
  email text,
  height numeric,
  current_weight numeric,
  fitness_goal text,
  medical_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  unique (gym_id, member_id)
);

create index if not exists member_profiles_gym_member_idx
  on public.member_profiles (gym_id, member_id);

create table if not exists public.member_workouts (
  id bigint generated always as identity primary key,
  gym_id uuid not null references public.gyms(id) on delete cascade,
  member_id bigint not null references public.members(id) on delete cascade,
  workout_date date not null,
  workout_type text,
  exercise_name text not null,
  sets integer,
  reps integer,
  weight numeric,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists member_workouts_gym_member_idx
  on public.member_workouts (gym_id, member_id, workout_date desc);

create table if not exists public.member_meals (
  id bigint generated always as identity primary key,
  gym_id uuid not null references public.gyms(id) on delete cascade,
  member_id bigint not null references public.members(id) on delete cascade,
  meal_date date not null,
  meal_time time,
  meal_type text not null,
  food_name text not null,
  quantity text,
  calories numeric,
  protein numeric,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists member_meals_gym_member_idx
  on public.member_meals (gym_id, member_id, meal_date desc);

create table if not exists public.member_progress (
  id bigint generated always as identity primary key,
  gym_id uuid not null references public.gyms(id) on delete cascade,
  member_id bigint not null references public.members(id) on delete cascade,
  progress_date date not null,
  weight numeric,
  body_fat numeric,
  waist numeric,
  chest numeric,
  arms numeric,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists member_progress_gym_member_idx
  on public.member_progress (gym_id, member_id, progress_date desc);

create table if not exists public.member_photos (
  id bigint generated always as identity primary key,
  gym_id uuid not null references public.gyms(id) on delete cascade,
  member_id bigint not null references public.members(id) on delete cascade,
  photo_type text not null,
  photo_url text not null,
  photo_date date not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists member_photos_gym_member_idx
  on public.member_photos (gym_id, member_id, photo_date desc);

create table if not exists public.member_support_messages (
  id bigint generated always as identity primary key,
  gym_id uuid not null references public.gyms(id) on delete cascade,
  member_id bigint not null references public.members(id) on delete cascade,
  subject text not null,
  message text not null,
  status text not null default 'Open',
  created_at timestamptz not null default now()
);

create index if not exists member_support_messages_gym_member_idx
  on public.member_support_messages (gym_id, member_id, created_at desc);
