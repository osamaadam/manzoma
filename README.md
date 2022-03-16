# Manzoma

> Still in very early development.

Management system for military training centers. Aims to help the organization and management department individuals to manage the influx of new initiates, and keeping track of who is where.

The database is seeded through an access file which is not included in the repository for obvious reasons.

## Development

1. Edit the `.env.example` file in the server directory to point to the access file.
2. Install dependencies by running `npm install` in the root directory.
3. Run `npm run dev`.

## Building

> TODO

## Troubleshooting

- Server cannot find `@generated/*` directory.

  - Navigate to the server directory, and run the prisma generate command `npx prisma db generate`.

- App loads but the tables are empty.
  - Navigate to the server directory, and run the prisma seed command `npx prisma db seed`.
