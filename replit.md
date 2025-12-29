# Renovaciones Dashboard

## Overview

A real-time KPI monitoring dashboard for business renewals (renovaciones). The application tracks manager performance metrics including renewals, quality scores, delays, calls, and connectivity. It features a public dashboard view and a password-protected admin panel for data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS v4 with shadcn/ui component library
- **Build Tool**: Vite with custom plugins for Replit integration
- **Animations**: Framer Motion for UI animations

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful endpoints under `/api/*`
- **Authentication**: Simple password-based admin authentication via headers (`x-admin-password`)

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` - shared between frontend and backend
- **Current Storage**: In-memory storage (`MemStorage` class) - designed for easy migration to PostgreSQL
- **Database Config**: Drizzle Kit configured for PostgreSQL migrations

### Key Data Models
- **Users**: Basic user table with id, username, password
- **Managers**: Performance tracking with fields for nombre (name), renovaciones (renewals), calidad (quality), atrasos (delays), llamadas (calls), conectividad (connectivity), semana (week 1-4)

### API Endpoints
- `GET /api/managers` - Fetch all managers
- `GET /api/managers/week/:week` - Fetch managers by week number
- `POST /api/managers` - Create manager (admin protected)
- `PATCH /api/managers/:id` - Update manager (admin protected)
- `DELETE /api/managers/:id` - Delete manager (admin protected)

### Project Structure
```
client/           # React frontend
  src/
    components/ui/  # shadcn/ui components
    pages/          # Route pages (dashboard, admin)
    hooks/          # Custom React hooks
    lib/            # Utilities and query client
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route definitions
  storage.ts      # Data storage layer
shared/           # Shared code between client/server
  schema.ts       # Drizzle schema and Zod validators
```

## External Dependencies

### Database
- **PostgreSQL**: Required via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migrations via `npm run db:push`

### UI Component Library
- **shadcn/ui**: Pre-built accessible components (new-york style)
- **Radix UI**: Underlying primitives for shadcn components
- **Lucide React**: Icon library

### Build & Development
- **Vite**: Frontend bundler with HMR
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development

### Session Management
- **connect-pg-simple**: PostgreSQL session store (available but not currently used)