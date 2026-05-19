alter table public.accounts
add column if not exists archived boolean not null default false;

alter table public.transactions
drop constraint if exists transactions_account_id_fkey;

alter table public.transactions
drop constraint if exists transactions_destination_account_id_fkey;

alter table public.transactions
add constraint transactions_account_id_fkey
foreign key (account_id)
references public.accounts(id)
on delete restrict;

alter table public.transactions
add constraint transactions_destination_account_id_fkey
foreign key (destination_account_id)
references public.accounts(id)
on delete restrict;

drop policy if exists "Users can update their transactions" on public.transactions;

create policy "Users can update their transactions"
on public.transactions for update
to authenticated
using (user_id = auth.uid())
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

create index if not exists accounts_user_id_archived_idx on public.accounts(user_id, archived);
