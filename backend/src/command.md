- npx prisma generate
  - Prisma reads your schema and creates a client that knows:
    "There is a model called User

- Whenever you change schema.prisma, run a migration:
  - npx prisma migrate dev --name init (--name (add course)):
    - Compares your schema.prisma with the current database.
    - Generates an SQL migration file in prisma/migrations.
    - Applies that migration to PostgreSQL.
    - Regenerates the Prisma Client.

- nest g resource courses
