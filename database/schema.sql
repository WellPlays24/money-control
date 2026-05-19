create extension if not exists "pgcrypto";

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('bank', 'cooperative', 'cash', 'other')),
  initial_balance numeric(12, 2) not null default 0 check (initial_balance >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('income', 'expense', 'transfer')),
  account_id uuid not null references public.accounts(id) on delete cascade,
  destination_account_id uuid references public.accounts(id) on delete cascade,
  category text not null,
  amount numeric(12, 2) not null check (amount > 0),
  description text,
  date date not null default current_date,
  created_at timestamptz not null default now(),
  constraint transfer_destination_required check (
    (type = 'transfer' and destination_account_id is not null and destination_account_id <> account_id)
    or (type <> 'transfer' and destination_account_id is null)
  )
);

alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

create policy "Users can read their accounts"
on public.accounts for select
to authenticated
using (user_id = auth.uid());

create policy "Users can insert their accounts"
on public.accounts for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update their accounts"
on public.accounts for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can delete their accounts"
on public.accounts for delete
to authenticated
using (user_id = auth.uid());

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

create policy "Users can read their transactions"
on public.transactions for select
to authenticated
using (user_id = auth.uid());

create policy "Users can insert their transactions"
on public.transactions for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.accounts
    where accounts.id = transactions.account_id
    and accounts.user_id = auth.uid()
  )
  and (
    destination_account_id is null
    or exists (
      select 1 from public.accounts
      where accounts.id = transactions.destination_account_id
      and accounts.user_id = auth.uid()
    )
  )
);

create policy "Users can update their transactions"
on public.transactions for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can delete their transactions"
on public.transactions for delete
to authenticated
using (user_id = auth.uid());

create index if not exists accounts_user_id_idx on public.accounts(user_id);
create index if not exists categories_user_id_type_idx on public.categories(user_id, type);
create unique index if not exists categories_user_type_name_unique
on public.categories(user_id, type, lower(name));
create index if not exists transactions_user_id_date_idx on public.transactions(user_id, date desc);
create index if not exists transactions_account_id_idx on public.transactions(account_id);
