# KYC Verification System

A comprehensive Know Your Customer (KYC) verification system built with modern web technologies in a Nx monorepo
architecture.

## Project Structure

The project consists of three main applications:

- **KYC Website** (NuxtJS) - Customer-facing web application
- **Admin Dashboard** (NextJS) - Administrative interface
- **API Server** (Express.js) - Backend server handling all business logic

## Prerequisites

- Node.js (LTS version recommended)
- PostgreSQL database
- NPM or Yarn package manager
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/e-lobo/nova-org.git
cd nova-org
```

### 2. Install Dependencies

Install dependencies for each application:

```bash
cd apps/kyc-website && npm install
cd ../kyc-dashboard && npm install
cd ../kyc-api && npm install
```

### 3. Environment Configuration

Create `.env` or `.env.development` (kyc-dashboard **needed** if modifications) files for each application based on the provided `.env.example` at the root of the project.

TIP: If ports 3000,3001 and 4000 are not in use you the only thing to check is the database connection string in the API application.

#### Website Environment Variables (apps/kyc-website)

```bash
# All variables are optional with defaults
NUXT_API_BASE_URL=http://localhost:4000        # Backend base URL
NUXT_PUBLIC_API_BASE_URL=http://localhost:4000 # Backend public URL
NUXT_PORT=3000                                 # Website port
NUXT_HOST=localhost                            # Host name
NUXT_AUTH_TOKEN_KEY=auth_token                 # Auth token cookie key
NUXT_AUTH_USER_KEY=auth_user                   # Auth user cookie key
NODE_ENV=development                           # Node environment
```

#### Dashboard Environment Variables (apps/kyc-dashboard)

```bash
# All variables are optional with defaults
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1 # Backend API URL
NEXT_PUBLIC_ENV=development                      # Environment
PORT=3001                                        # Dashboard port
```

#### API Environment Variables (apps/kyc-api)

```bash
# DATABASE_URL is mandatory
DATABASE_URL=postgresql://postgres@localhost:5432/postgre # Database connection string

# Optional variables with defaults
NODE_ENV=production
PORT=4000
API_URL=https://localhost:4000
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
RATE_LIMIT_MAX_REQUESTS=100
JWT_SECRET=secret
```

### 4. Database Setup

Navigate to the API application directory and run migrations:

```bash
cd apps/kyc-api
npm run db:migrate:dev
```

### 5. Seed Initial Data

Create the super admin account:

```bash
npm run db:seed
```

Super admin credentials:

- Email: admin@admin.com
- Password: admin

### 6. Running the Applications

#### Development Mode

Run all applications:

```bash
npx nx run-many --target=serve --all
```

Or run individually:

```bash
npx nx serve kyc-dashboard
npx nx serve kyc-api
npx nx serve kyc-website
```

Or head to the individual application directories and run:

```bash
cd apps/kyc-dashboard && npm run dev
cd ../kyc-api && npm run dev
cd ../kyc-website && npm run dev
```

#### Production Build

Build all applications:

```bash
npx nx run-many --target=build --all
```

Run in production mode:

```bash
npx nx run-many --target=serve -c production
```

## System Assumptions

1. **Single KYC Per User**
    - Only one active KYC verification per user
    - No versioning of past edits

2. **Admin Actions**
    - Admins can accept, reject, or return KYC for modification
    - Acceptance is final
    - Rejection or return for modification triggers file deletion
    - New file uploads required for resubmission
    - Admin feedback available for rejections and modifications
¬