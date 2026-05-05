# Ride Hailing Mobile API

A scalable, modular backend for a ride-hailing mobile application built with [NestJS](https://nestjs.com/), [GraphQL](https://graphql.org/), [MongoDB](https://www.mongodb.com/) (Mongoose), and [JWT](https://jwt.io/) authentication. The project is organized as a NestJS monorepo with three independent API gateways serving different user personas — **Passengers**, **Admins**, and **Drivers**.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Applications](#applications)
- [Shared Libraries](#shared-libraries)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Apps](#running-the-apps)
- [GraphQL Playground](#graphql-playground)
- [Authentication Flow](#authentication-flow)
- [Testing](#testing)
- [Scripts Reference](#scripts-reference)
- [License](#license)

---

## Architecture Overview

The codebase follows a **monorepo** architecture managed by the NestJS CLI. It separates concerns into:

- **`apps/`** – Three standalone NestJS applications (`api`, `admin-api`, `driver-api`).
- **`libs/`** – Shared domain logic, data-access layers, services, guards, utilities, and configuration that any app can import via TypeScript path aliases.

Each application exposes a **GraphQL API** over HTTP using Apollo Server with an auto-generated schema (`schema.gql`). All apps connect to a single MongoDB instance and share core business logic through the `libs/` layer.

---

## Project Structure

```
ride-hailing-mobile-api/
├── apps/
│   ├── api/                 # Passenger / Customer API (port 3000)
│   │   ├── main.ts
│   │   ├── src/
│   │   │   ├── app.module.ts
│   │   │   └── modules/
│   │   │       ├── auth/
│   │   │       │   └── resolver/auth.resolver.ts
│   │   │       └── user/
│   │   │           └── resolver/user.resolver.ts
│   │   ├── .env
│   │   └── .env.example
│   ├── admin-api/           # Admin panel API (port 3001)
│   │   ├── main.ts
│   │   ├── src/
│   │   │   └── app.module.ts
│   │   ├── .env
│   │   └── .env.example
│   └── driver-api/          # Driver app API (port 3002)
│       ├── main.ts
│       ├── src/
│       │   └── app.module.ts
│       ├── .env
│       └── .env.example
├── libs/
│   ├── common/              # Utilities, decorators, helpers, health checks, env service
│   ├── data-access/         # Mongoose entities, repositories, DTOs, enums, interfaces
│   ├── guards/              # AuthGuard, LangGuard, RoleGuard
│   ├── localization/        # Multi-language message bundles (EN / NP)
│   ├── s3/                  # AWS S3 upload & presigned-URL service
│   └── services/
│       ├── auth/            # Core authentication service
│       ├── mail/            # Email service (Nodemailer + Handlebars templates)
│       └── user/            # User & profile management service
├── nest-cli.json            # NestJS monorepo configuration
├── tsconfig.json            # Root TypeScript configuration with path aliases
└── package.json
```

---

## Applications

| App | Description | Default Port | Entry File |
|-----|-------------|--------------|------------|
| `api` | Passenger-facing GraphQL API — authentication, user profile, password reset, device management | `3000` | `apps/api/main.ts` |
| `admin-api` | Back-office / admin GraphQL API (ready for admin-specific modules) | `3001` | `apps/admin-api/main.ts` |
| `driver-api` | Driver-facing GraphQL API (ready for driver-specific modules) | `3002` | `apps/driver-api/main.ts` |

All apps enable **CORS** and expose a `/graphql` endpoint with the Apollo Sandbox / landing page enabled for development.

---

## Shared Libraries

### `@libs/common`
- `EnvService` — type-safe wrapper around `ConfigService` for env variables.
- `HealthResolver` — simple `health` GraphQL query for liveness checks.
- Utilities — bcrypt hashing, JWT generation/verification, ID generators, date-time helpers.
- Decorators — `@CurrentUser()`, `@CurrentLang()`.
- Global exception filter (`ErrorException`).

### `@libs/data-access`
- **Entities** — `User`, `UserDetails`, `UserVerification`, `Device` (Mongoose schemas decorated with `@nestjs/graphql` for automatic schema generation).
- **Repositories** — Extends a generic `BaseRepository` for CRUD operations.
- **DTOs** — GraphQL Input types (`EmailSignUpInput`, `EmailSignInInput`, `ResetPasswordInput`, `ChangePasswordInput`, etc.) and Response types (`SignInResponse`, `BasicResponse`, `UserDetailEntity`, etc.).
- **Enums** — `AuthProvider`, `UserStatus`, `language`, `roles`, `verificationType`, `tokenTypes`.

### `@libs/guards`
- `AuthGuard` — validates Bearer JWT access tokens, checks user existence, suspension, and verification status.
- `LangGuard` — extracts language preference from headers or authenticated user profile.
- `RoleGuard` — ready for role-based access control.

### `@libs/services/auth`
- Handles the complete authentication lifecycle:
  - Email-based sign-up with OTP verification
  - Sign-in with password validation
  - Set password after sign-up
  - Refresh token rotation
  - Forgot / reset password flow with OTP
  - Email verification

### `@libs/services/user`
- User profile operations:
  - Get current user details
  - Change password
  - Change language preference
  - Logout / device removal
  - Verify change-email OTP

### `@libs/services/mail`
- Sends transactional emails via `Nodemailer` using Handlebars templates:
  - Welcome / email confirmation with OTP
  - Password reset with OTP

### `@libs/s3`
- Generates **presigned upload URLs** and **view URLs** for AWS S3 file storage.

### `@libs/localization`
- Multi-language message lookup supporting **English (`en`)** and **Nepali (`np`)**.

---

## Features

- **GraphQL API** with auto-generated schema (`schema.gql`) per app
- **JWT Authentication** — access tokens & refresh tokens with configurable expiry
- **OTP Email Verification** — secure email confirmation and password reset flows
- **Password Management** — bcrypt-hashed passwords with salt, change & reset capabilities
- **Device Management** — track user devices and Firebase tokens
- **Multi-language Support** — localized API responses based on `lang` header or user preference
- **Role-based Access Control** — guards ready for `USER`, `ADMIN`, `DRIVER` roles
- **AWS S3 Integration** — presigned URLs for secure file uploads
- **MongoDB with Mongoose** — schema-based ODM with custom plugins (soft-delete, timestamps)
- **Health Checks** — built-in `health` query for monitoring
- **Monorepo Scalability** — add new apps or shared libs without duplicating code

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | NestJS 11 |
| API Style | GraphQL (Apollo Server 5 + `@nestjs/apollo`) |
| Database | MongoDB (Mongoose 8) |
| Auth | JSON Web Tokens (`jsonwebtoken`) |
| Password Hashing | `bcryptjs` |
| Email | `nodemailer` + Handlebars templates |
| File Storage | AWS S3 (`@aws-sdk/client-s3`) |
| Validation | `class-validator` + `class-transformer` |
| Config | `@nestjs/config` + `.env` per app |
| Language | TypeScript 5 |
| Testing | Jest + Supertest |

---

## Prerequisites

- **Node.js** ≥ 20
- **npm** or **yarn**
- **MongoDB** instance (local or Atlas)
- **SMTP credentials** (for transactional emails)
- **AWS credentials** (optional, for S3 file uploads)

---

## Environment Variables

Each app has its own `.env` file. Copy from `.env.example` and fill in your values:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/admin-api/.env.example apps/admin-api/.env
cp apps/driver-api/.env.example apps/driver-api/.env
```

### Common Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` / `API_PORT` / `ADMIN_API_PORT` / `DRIVER_API_PORT` | HTTP server port | `3000`, `3001`, `3002` |
| `DB_CONNECTION_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET_KEY` | Secret for signing JWTs | `super-secret-key` |
| `ACCESS_TOKEN_LIFE` | Access token expiry | `5d` |
| `REFRESH_TOKEN_LIFE` | Refresh token expiry | `30d` |
| `RESET_PASSWORD_TOKEN_LIFE` | Reset token expiry | `10m` |
| `SUPPORT_EMAIL` | Sender email address | `support@ride-hailing.com` |
| `SUPPORT_EMAIL_AUTH` | SMTP password / app token | `xxxxxxxxxxxx` |
| `AWS_ACCESS_KEY_ID` | AWS credentials | `AKIA...` |
| `AWS_S3_SECRET_KEY` | AWS secret | `xxxxxxxx` |
| `S3_BUCKET_NAME` | S3 bucket name | `ride-hailing-uploads` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `AWS_S3_UPLOAD_PREFIX` | Path prefix for uploads | `uploads/` |
| `PRODUCTION_URL` | Public app URL | `https://ride-hailing.com` |

---

## Installation

```bash
# Install dependencies
npm install
```

---

## Running the Apps

### Production / Single Run

```bash
# Run the passenger API (default)
npm run start

# Or explicitly
npm run start:api
npm run start:admin-api
npm run start:driver-api
```

### Development with Hot Reload (Watch Mode)

```bash
# Passenger API with hot reload
npm run start:api:dev

# Admin API with hot reload
npm run start:admin-api:dev

# Driver API with hot reload
npm run start:driver-api:dev
```

> **Note:** `nest start <app> --watch` monitors `apps/` and `libs/` for changes and automatically restarts the server.

### Build All Apps

```bash
npm run build
```

---

## GraphQL Playground

Once an app is running, open the Apollo Sandbox in your browser:

- Passenger API: [`http://localhost:3000/graphql`](http://localhost:3000/graphql)
- Admin API: [`http://localhost:3001/graphql`](http://localhost:3001/graphql)
- Driver API: [`http://localhost:3002/graphql`](http://localhost:3002/graphql)

Example query:

```graphql
query {
  health
}
```

---

## Authentication Flow

1. **Sign Up** — `signUp(input: EmailSignUpInput)` creates an unverified user and sends an OTP to the email.
2. **Verify Email** — `verifyEmail(input: VerifyEmailInput)` confirms the OTP and marks the user as verified.
3. **Set Password** — `setPassword(input: SetPasswordInput)` sets the user's password and returns access & refresh tokens.
4. **Sign In** — `signIn(input: EmailSignInInput)` authenticates the user and returns tokens.
5. **Refresh Token** — `loginWithRefreshToken(input: RefreshTokenInput)` issues a new access token pair.
6. **Forgot Password** — `sendVerifyEmailOtp` → `verifyResetPasswordOtp` → `resetPassword` flow with OTP verification.

### Request Headers

| Header | Value | Purpose |
|--------|-------|---------|
| `Authorization` | `Bearer <accessToken>` | Required for protected mutations/queries |
| `lang` | `en` or `np` | Overrides response language (optional) |

---

## Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# App-specific tests
npm run test:api
npm run test:admin-api
npm run test:driver-api
```

---

## Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `npm run start:api` | Runs the default passenger API |
| `start:api` | `nest start api` | Runs passenger API (single run) |
| `start:api:dev` | `nest start api --watch` | Runs passenger API with **hot reload** |
| `start:admin-api` | `nest start admin-api` | Runs admin API (single run) |
| `start:admin-api:dev` | `nest start admin-api --watch` | Runs admin API with **hot reload** |
| `start:driver-api` | `nest start driver-api` | Runs driver API (single run) |
| `start:driver-api:dev` | `nest start driver-api --watch` | Runs driver API with **hot reload** |
| `build` | `nest build api && nest build admin-api && nest build driver-api` | Builds all apps |
| `lint` | `eslint "{apps,libs,test}/**/*.ts" --fix` | Lints and auto-fixes code |
| `format` | `prettier --write "apps/**/*.ts" "libs/**/*.ts"` | Formats all TypeScript files |
| `test` | `jest --config jest.config.js` | Runs unit tests |
| `test:watch` | `jest --config jest.config.js --watch` | Runs tests in watch mode |
| `test:cov` | `jest --config jest.config.js --coverage` | Runs tests with coverage |

---

## License

UNLICENSED

---

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="60" alt="Nest Logo" /></a>
</p>
