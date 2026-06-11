# Camera Rental House - Production Architecture

This repository follows a strict separation of concerns designed for high-scalability and production readiness on Railway.

## Directory Structure

### `apps/`
User Interface applications.
- `client`: Customer website (domain.com).
- `admin`: Admin dashboard (admin.domain.com).

### `server/`
The core API platform (api.domain.com).
- Decoupled from frontend logic.
- Consumes infrastructure from `database/` and `cloud-storage/`.

### `database/`
Infrastructure layer for Data.
- Supabase client configuration.
- Migrations, Schemas, and Seeders.
- Shared by `server` and potentially other future services.

### `cloud-storage/`
Infrastructure layer for Media.
- Cloudinary, R2, and Supabase Storage handlers.
- Image processing and media transformations.

### `packages/`
Shared code across the monorepo.
- `shared`: Consolidated Auth logic and core Data taxonomies.
- `ui`: Reusable Design System / React Components.
- `types`: Global TypeScript definitions.
- `utils`: Cross-cutting helper functions.

## Deployment Strategy (Railway)

### 1. Client App (`apps/client`)
- **Type**: Static Site
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Domain**: `domain.com`

### 2. Admin App (`apps/admin`)
- **Type**: Static Site
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Domain**: `admin.domain.com`

### 3. API Server (`server`)
- **Type**: Node.js Service
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Domain**: `api.domain.com`

## Environment Variables

Refer to `.env.example` in each respective directory for the required secrets.
