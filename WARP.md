# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Start Development Server
```bash
npm run dev
```
Uses Node.js `--watch` flag for automatic restarts on file changes.

### Code Quality
```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting without making changes
npm run format:check
```

### Database Operations
```bash
# Generate new migration files
npm run db:generate

# Run pending migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## Architecture Overview

This is a Node.js Express API using modern ES modules with path aliases for clean imports.

### Core Stack
- **Runtime**: Node.js with ES modules (`"type": "module"`)
- **Framework**: Express.js v5
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with migrations
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Zod schemas
- **Logging**: Winston with file and console transports

### Directory Structure & Path Aliases
The project uses import maps for clean module resolution:

- `#config/*` → `./src/config/*` - Database, logger configuration
- `#controllers/*` → `./src/controllers/*` - Request handlers
- `#middleware/*` → `./src/middleware/*` - Express middleware
- `#models/*` → `./src/models/*` - Drizzle database schemas
- `#routes/*` → `./src/routes/*` - Express route definitions
- `#services/*` → `./src/services/*` - Business logic
- `#utils/*` → `./src/utils/*` - Utility functions
- `#validations/*` → `./src/validations/*` - Zod validation schemas

### Application Flow
1. `src/index.js` - Entry point, imports server
2. `src/server.js` - Creates HTTP server, starts listening
3. `src/app.js` - Express app setup with middleware and routes

### Key Components

#### Database Layer
- **Connection**: Neon serverless PostgreSQL via `@neondatabase/serverless`
- **Schema**: Drizzle ORM with type-safe queries
- **Models**: Currently has `users` table with auth fields
- **Migrations**: Generated in `./drizzle/` directory

#### Authentication System
- JWT-based authentication with HTTP-only cookies
- Password hashing with bcrypt (10 rounds)
- Role-based access (`user`, `admin`)
- Cookie settings: HTTP-only, secure in production, SameSite strict, 15min expiry

#### Logging & Monitoring
- Winston logger with file rotation (`logs/error.log`, `logs/combined.log`)
- Morgan HTTP request logging piped to Winston
- Console logging in non-production environments
- Health check endpoint at `/health`

## Code Style & Standards

### ESLint Configuration
- ES2022 features enabled
- 2-space indentation with switch case indentation
- Single quotes, semicolons required
- Unix line endings
- Unused variables error (except those prefixed with `_`)
- Prefer const, arrow functions, object shorthand

### Import/Export Patterns
Always use ES modules with path aliases:
```javascript
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { createUser } from '#services/auth.service.js';
```

### Error Handling
- Services throw descriptive Error objects
- Controllers catch and format errors appropriately
- Winston logger used for error tracking
- Validation errors formatted using utility functions

## Environment Setup

Required environment variables (see `.env.example`):
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment setting
- `LOG_LEVEL` - Winston log level
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - Token expiration time

## Database Schema Management

The project uses Drizzle for type-safe database operations:
- Schema definitions in `src/models/*.model.js`
- Configuration in `drizzle.config.js`
- Migrations auto-generated from schema changes
- Use `db:studio` for visual database management

## Current API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login (placeholder)
- `POST /api/auth/sign-out` - User logout (placeholder)

### Utility Routes
- `GET /` - Basic application greeting
- `GET /health` - Health check with uptime
- `GET /api` - API status check