@AGENTS.md
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

## Cómo listar tablas de Supabase
Cuando necesites listar tablas, ejecuta siempre este SQL via MCP:

SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

Las tablas del proyecto son:
AuditLog, Company, CompanyUser, DocumentType,
InventoryMovement, Invoice, InvoiceNotification, MetricEvent,
Order, OrderAddress, OrderCustomer, OrderItem,
Payment, PaymentMethod, Permission, Product,
ProductImage, ProductVariant, ReportSnapshot, Role,
RolePermission, Tax, User, UserRole

## REGLAS CRÍTICAS
- NUNCA busques tablas en el código fuente
- NUNCA uses schema.prisma
- SIEMPRE usa el MCP de Supabase con SQL directo