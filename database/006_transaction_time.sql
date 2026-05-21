alter table public.transactions
add column if not exists time time not null default current_time;

drop index if exists transactions_user_id_date_idx;
create index if not exists transactions_user_id_date_idx
on public.transactions(user_id, date desc, time desc);
