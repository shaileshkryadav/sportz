# sportz

JavaScript Express server with Neon Postgres and Drizzle ORM using `pg`.

## Setup

1. Run `npm install`.
2. Copy `.env.example` to `.env` if `.env` does not exist.
3. Set `DATABASE_URL` in `.env` to the connection string from Neon Console → Connect.
   Keep the SSL parameters from Neon. Never commit credentials.
4. Generate and apply the schema, then run the demo:

   ```sh
   npm run db:generate
   npm run db:migrate
   npm run db:demo
   ```

The demo creates, reads, updates, and deletes a unique row in `demo_users`.
It runs in a transaction, rolls back on failure, and closes its connection pool.
Migrations create the `demo_users` table in the database specified by `DATABASE_URL`.

## Commands

- `npm run dev`: run the Express server with automatic restarts.
- `npm start`: run the Express server on port 8000.
- `npm run db:generate`: generate SQL migrations from `src/schema.js`.
- `npm run db:migrate`: apply generated migrations.
- `npm run db:demo`: verify the CRUD lifecycle.

Database code lives in `src/db.js`; import its `db` export when adding database
queries to the server. The existing greeting route does not query the database.
All project source and configuration files use JavaScript ES modules.
