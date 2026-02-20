# Eventiqo - EO Management System

## Overview
Eventiqo is a one-stop solution for Event Organizers to manage events, budgets, vendors, and tasks professionally.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: MySQL (TiDB Cloud) via Prisma ORM
- **UI**: Tailwind CSS + Shadcn UI
- **Language**: TypeScript

## Getting Started

1.  **Prerequisites**:
    - Node.js v20+ (Run `nvm use 20`)
    - NPM

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Database**:
    The `.env` file is already configured with the provided database URL.
    Run migrations/push schema:
    ```bash
    npx prisma db push
    ```
    (Optional) Seed database with mock data:
    ```bash
    npx tsx prisma/seed.ts
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## Features Implemented
- **Dashboard**: Overview of events and stats.
- **Event Management**: List events, view details.
- **Budget Planner**: Interactive budgeting tool with real cost tracking.
- **Database Integration**: Events are fetched from the live database.

## Project Structure
- `src/app`: App Router pages.
- `src/components`: UI components and feature-specific components.
- `prisma/schema.prisma`: Database schema.
