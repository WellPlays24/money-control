alter table public.accounts
add column if not exists include_in_balance boolean not null default true;

create index if not exists accounts_user_id_include_in_balance_idx
on public.accounts(user_id, include_in_balance);
