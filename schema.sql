-- ============================================================
-- AI Crop Dashboard — Supabase Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Farmer Data Table
create table if not exists public.farmer_data (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references auth.users(id) on delete cascade,
  farmer_name   text not null,
  state         text,
  district      text,
  village       text,
  crop_type     text,
  land_area     numeric,
  soil_type     text,
  irrigation    text,
  season        text,
  sowing_date   text,
  harvest_date  text,
  remarks       text,
  created_at    timestamptz default now()
);

-- 3. User Profiles Table (stores name from sign-up)
create table if not exists public.profiles (
  id         uuid references auth.users(id) on delete cascade primary key,
  full_name  text,
  email      text,
  created_at timestamptz default now()
);

-- 4. Enable Row Level Security
alter table public.farmer_data enable row level security;
alter table public.profiles    enable row level security;

-- 5. RLS Policies — farmer_data
-- Clean up existing policies to allow re-running script safely
drop policy if exists "Authenticated users can read all data" on public.farmer_data;
drop policy if exists "Users can insert own records" on public.farmer_data;
drop policy if exists "Users can delete own records" on public.farmer_data;

-- All logged-in users can READ all records (shared dashboard)
create policy "Authenticated users can read all data"
  on public.farmer_data for select
  using (auth.role() = 'authenticated');

-- Only the record owner can INSERT
create policy "Users can insert own records"
  on public.farmer_data for insert
  with check (auth.uid() = user_id);

-- Only the record owner can DELETE
create policy "Users can delete own records"
  on public.farmer_data for delete
  using (auth.uid() = user_id);

-- 6. RLS Policies — profiles
-- Clean up existing policies to allow re-running script safely
drop policy if exists "Users can read all profiles" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can read all profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 7. Auto-create profile on sign-up (trigger)
-- Clean up existing trigger to allow re-running script safely
drop trigger if exists on_auth_user_created on auth.users;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 8. Sample verification queries
-- select * from public.farmer_data limit 5;
-- select * from public.profiles;

