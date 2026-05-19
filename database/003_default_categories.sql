-- Ejecuta este script despues de iniciar sesion al menos una vez en la app.
-- Inserta las categorias por defecto para todos los usuarios existentes.

with default_categories(name, type) as (
  values
    ('Sueldo', 'income'),
    ('Venta', 'income'),
    ('Prestamo recibido', 'income'),
    ('Regalo', 'income'),
    ('Otro ingreso', 'income'),
    ('Comida', 'expense'),
    ('Transporte', 'expense'),
    ('Servicios basicos', 'expense'),
    ('Luz', 'expense'),
    ('Agua', 'expense'),
    ('Internet', 'expense'),
    ('Telefono', 'expense'),
    ('Arriendo', 'expense'),
    ('Deudas', 'expense'),
    ('Salud', 'expense'),
    ('Educacion', 'expense'),
    ('Compras', 'expense'),
    ('Entretenimiento', 'expense'),
    ('Otro gasto', 'expense')
)
insert into public.categories (user_id, name, type)
select auth.users.id, default_categories.name, default_categories.type
from auth.users
cross join default_categories
on conflict do nothing;
