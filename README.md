# server-aiera-ums

A lightweight TypeScript + Express + Mongoose backend for an UMS-style project (Final Year Project).

## Overview

This repository provides the API server for a university management system. It includes modules for authentication, users, students, academic faculties, and academic semesters, plus middleware for validation, error handling and request lifecycle.

## Features

- RESTful controllers and services organized by domain module
- TypeScript with strong types for models and interfaces
- Validation middleware (Joi/Zod used in validations)
- Auth using JWT
- Seed script to create an initial admin user

## Tech stack

- Node.js + TypeScript
- Express
- Mongoose (MongoDB)
- JWT + bcrypt for auth
- ESLint + Prettier for linting/formatting

## 📁 Project Structure

```
src/
├── app.ts                    # Express app bootstrap
├── server.ts                 # Server entry (listen)
├── app/
│   ├── config/               # Configuration loaders (env, db)
│   │   └── index.ts
│   ├── middlewares/          # Global and route middlewares
│   │   ├── auth.ts
│   │   ├── globalErrorHandler.ts
│   │   ├── notFound.ts
│   │   └── validateRequest.ts
│   ├── modules/              # Domain modules (MVC per feature)
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.route.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.model.ts
│   │   │   ├── user.interface.ts
│   │   │   └── user.validation.ts
│   │   ├── student/
│   │   │   ├── student.controller.ts
│   │   │   ├── student.route.ts
│   │   │   ├── student.service.ts
│   │   │   └── student.model.ts
│   │   ├── academicFaculty/
│   │   │   ├── academicFaculty.controller.ts
│   │   │   ├── academicFaculty.service.ts
│   │   │   └── academicFaculty.model.ts
│   │   └── academicSemester/
│   │       ├── academicSemester.controller.ts
│   │       ├── academicSemester.service.ts
│   │       └── academicSemester.model.ts
│   ├── routes/               # Route aggregator
│   │   └── index.ts
│   └── utils/                # Helpers and response utilities
│       ├── catchAsynce.ts
│       └── sendResponse.ts
├── seed/                     # Seed scripts (create admin, etc.)
│   └── createAdmin.ts
└── types/                    # Global TypeScript types (if any)
```

## Environment

Create a `.env` (or set env) with at least:

- `PORT` (e.g. 5000)
- `MONGO_URI` (MongoDB connection string)
- `JWT_SECRET` (secret for signing tokens)
- `NODE_ENV` (development/production)

Check `src/app/config` for any additional configuration keys.

## Scripts

Available npm scripts (from `package.json`):

- `npm run start:dev` — start in development with `ts-node-dev` (watch)
- `npm run build` — compile TypeScript to `dist/`
- `npm run start:prod` — run compiled `dist/server.js`
- `npm run seed:admin` — seed an initial admin user (`src/seed/createAdmin.ts`)
- `npm run lint` / `npm run lint:fix` — ESLint checks and autofix
- `npm run prettier` — run Prettier formatting

Run locally:

```bash
npm install
npm run start:dev
```

Build + run production:

```bash
npm run build
npm run start:prod
```

Seed admin user:

```bash
npm run seed:admin
```

## Development notes

- Validation middlewares live under `src/app/middlewares` and each module has a `*.validation.ts` file.
- Controllers handle request/response, services contain business logic, and models define Mongoose schemas.
- Error handling is centralized in `globalErrorHandler.ts` and not-found handling in `notFound.ts`.

## Contribution

- Open an issue to propose changes or report bugs.
- Send a pull request with a clear description and tests where applicable.

## License

This repository does not include a license file. Add a `LICENSE` if you intend to publish or share this project publicly.

---

If you'd like, I can also add a short `CONTRIBUTING.md`, or update the README with exact environment keys found in the config files.
