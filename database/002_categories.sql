create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "Users can read their categories" on public.categories;
drop policy if exists "Users can insert their categories" on public.categories;
drop policy if exists "Users can update their categories" on public.categories;
drop policy if exists "Users can delete their categories" on public.categories;

create policy "Users can read their categories"
on public.categories for select
to authenticated
using (user_id = auth.uid());

create policy "Users can insert their categories"
on public.categories for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update their categories"
on public.categories for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can delete their categories"
on public.categories for delete
to authenticated
using (user_id = auth.uid());

create index if not exists categories_user_id_type_idx on public.categories(user_id, type);

create unique index if not exists categories_user_type_name_unique
on public.categories(user_id, type, lower(name));
