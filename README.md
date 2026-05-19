# MoneyControl

App web pequena para controlar cuentas personales, ingresos, egresos, transferencias y reportes basicos.

## Stack

- Next.js App Router
- Supabase Auth con Google
- Supabase PostgreSQL con RLS
- Vercel para produccion

## Configuracion local

1. Instala dependencias:

```bash
npm install
```

2. Crea `.env.local` basado en `.env.example`:

```txt
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

3. En Supabase, abre SQL Editor y ejecuta `database/schema.sql`.

Si ya habias creado la base antes de agregar categorias, ejecuta solo:

```txt
database/002_categories.sql
```

Para insertar categorias por defecto, ejecuta despues:

```txt
database/003_default_categories.sql
```

4. En Supabase, activa Google Auth:

- Authentication > Providers > Google
- Configura el Client ID y Client Secret de Google Cloud
- Agrega esta URL de callback en Google Cloud:

```txt
https://TU_PROYECTO.supabase.co/auth/v1/callback
```

5. En Supabase, agrega Redirect URLs:

```txt
http://localhost:3000/auth/callback
https://TU_DOMINIO_DE_VERCEL.vercel.app/auth/callback
```

6. Ejecuta el proyecto:

```bash
npm run dev
```

## Deploy rapido en Vercel

1. Sube el proyecto a GitHub.
2. Importa el repositorio en Vercel.
3. Agrega las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Despliega.
5. Copia la URL final de Vercel y agregala en Supabase Redirect URLs.

## Uso

1. Inicia sesion con Google.
2. Crea tus cuentas con saldo inicial.
3. Registra ingresos, egresos y transferencias.
4. Revisa dashboard y reportes para detectar en que se va tu dinero.
