-- Allow admins to update artisan_profiles under RLS
-- Safe-guarded to avoid duplicate policy creation

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'artisan_profiles'
      and policyname = 'admin_update_artisan_profiles'
  ) then
    create policy admin_update_artisan_profiles
      on public.artisan_profiles
      for update
      using (
        exists (
          select 1 from public.profiles p
          where p.id = auth.uid() and p.role = 'admin'
        )
      )
      with check (true);
  end if;
end$$;
