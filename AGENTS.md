<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
# Instrucciones del Agente

## Base de datos
- **TODO** el backend usa exclusivamente **Supabase**.
- La conexión a la base de datos se realiza únicamente a través del **MCP de Supabase** configurado en `.mcp.json`.
- **PROHIBIDO** usar Prisma, TypeORM, Sequelize, o cualquier otro ORM.
- **PROHIBIDO** ejecutar `prisma db pull`, `prisma generate`, `prisma migrate` o cualquier comando de Prisma.
- **PROHIBIDO** instalar `prisma` o `@prisma/client`.

## Cómo interactuar con la base de datos
- Usar el cliente de Supabase: `@supabase/supabase-js`
- Para queries directas usar el MCP tool de Supabase disponible en el agente.
- Las variables de entorno correctas son:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (solo en servidor)

## Stack permitido
- Frontend: [tu framework]
- Backend: Supabase (Auth, Database, Storage, Edge Functions)
- ORM: NINGUNO — usar Supabase client directamente