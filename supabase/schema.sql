-- CS DELAS: esquema inicial.
-- Execute no SQL Editor do projeto Supabase.
-- Antes de publicar, revise a política de privacidade e o prazo de retenção dos dados.

create extension if not exists pgcrypto;

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 3 and 160),
  birth_date date not null,
  email text not null,
  phone text not null,
  privacy_acknowledged boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);

-- Apenas maiores de 18 anos podem solicitar participação.
alter table public.applications
  drop constraint if exists applications_adult_only;
alter table public.applications
  add constraint applications_adult_only
  check (birth_date <= (current_date - interval '18 years')::date);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'participant' check (role in ('participant', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 180),
  body text not null check (char_length(body) between 1 and 10000),
  category text not null check (category in ('questions', 'sharing', 'achievements', 'networking')),
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  resource_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  registration_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  application_url text not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- Cria perfil básico para contas autenticadas. A administradora receberá
-- role=admin manualmente após a criação da conta dela.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', 'Participante'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

alter table public.applications enable row level security;
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.materials enable row level security;
alter table public.events enable row level security;
alter table public.opportunities enable row level security;

-- Solicitação pública: pode inserir, mas não pode ler nem alterar cadastros.
drop policy if exists "Public can submit applications" on public.applications;
create policy "Public can submit applications"
on public.applications for insert to anon, authenticated
with check (
  privacy_acknowledged = true
  and status = 'pending'
  and reviewed_at is null
  and reviewed_by is null
);

drop policy if exists "Admins manage applications" on public.applications;
create policy "Admins manage applications"
on public.applications for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Perfis: participante vê o próprio perfil; administradora vê todos.
drop policy if exists "Read own or admin profiles" on public.profiles;
create policy "Read own or admin profiles"
on public.profiles for select to authenticated
using (id = (select auth.uid()) or public.is_admin());

drop policy if exists "Admins update profiles" on public.profiles;
create policy "Admins update profiles"
on public.profiles for update to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Conteúdo da comunidade: apenas contas aprovadas/ativas (perfil criado após convite).
drop policy if exists "Authenticated members read posts" on public.posts;
create policy "Authenticated members read posts"
on public.posts for select to authenticated
using (true);

drop policy if exists "Members create own posts" on public.posts;
create policy "Members create own posts"
on public.posts for insert to authenticated
with check (author_id = (select auth.uid()));

drop policy if exists "Authors or admins update posts" on public.posts;
create policy "Authors or admins update posts"
on public.posts for update to authenticated
using (author_id = (select auth.uid()) or public.is_admin())
with check (author_id = (select auth.uid()) or public.is_admin());

drop policy if exists "Authors or admins delete posts" on public.posts;
create policy "Authors or admins delete posts"
on public.posts for delete to authenticated
using (author_id = (select auth.uid()) or public.is_admin());

drop policy if exists "Members read comments" on public.comments;
create policy "Members read comments"
on public.comments for select to authenticated using (true);

drop policy if exists "Members create own comments" on public.comments;
create policy "Members create own comments"
on public.comments for insert to authenticated
with check (author_id = (select auth.uid()));

drop policy if exists "Authors or admins delete comments" on public.comments;
create policy "Authors or admins delete comments"
on public.comments for delete to authenticated
using (author_id = (select auth.uid()) or public.is_admin());

-- Conteúdo público publicado; gestão exclusiva da administradora.
drop policy if exists "Read published materials" on public.materials;
create policy "Read published materials"
on public.materials for select to anon, authenticated
using (published = true or public.is_admin());

drop policy if exists "Admins manage materials" on public.materials;
create policy "Admins manage materials"
on public.materials for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Read published events" on public.events;
create policy "Read published events"
on public.events for select to anon, authenticated
using (published = true or public.is_admin());

drop policy if exists "Admins manage events" on public.events;
create policy "Admins manage events"
on public.events for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Read published opportunities" on public.opportunities;
create policy "Read published opportunities"
on public.opportunities for select to anon, authenticated
using (published = true or public.is_admin());

drop policy if exists "Admins manage opportunities" on public.opportunities;
create policy "Admins manage opportunities"
on public.opportunities for all to authenticated
using (public.is_admin()) with check (public.is_admin());

-- Importante: não exponha a service_role key no navegador.
