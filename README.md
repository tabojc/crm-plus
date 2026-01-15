# CRM Plus & Sales Assistant

## 🎯 Vision: "Efficiency 5x"
Boost sales efficiency by 5x. Eliminate the chaos of spreadsheets, isolated phone contacts, and manual price checking. Transform the sales process from "memory-based" to "system-based".

## 🚩 The Problem
- **Data Silos**: 13,000+ contacts locked in `.vcf` files and individual phones. No centralized history.
- **Manual Pricing**: Checking a price requires opening a PDF or asking someone.
- **Slow Quotes**: Creating a budget is manual (Calc/Excel), prone to error, and slow to share on WhatsApp.
- **No Metrics**: Hard to know who attends whom or what products move the most.

## 🚀 The Solution: A Simple, High-Impact CRM

### Core Pillars
1.  **Centralized Contacts**: Universal search for all 13k+ contacts. Tagging (Client, Lead, Supplier).
2.  **Digital Catalog**: Instant price lookup. "Add to Quote" functionality.
3.  **WhatsApp-First Design**: Everything is designed to be copied/pasted or shared to WhatsApp instantly.

## 🛠 Tech Stack
- **Frontend**: Next.js 16 (React Server Components, Server Actions)
- **Styling**: TailwindCSS v4 + Lucide Icons
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Language**: TypeScript
- **Deployment**: Vercel (Frontend) + Supabase Cloud (Backend)

## 🤝 Cómo Contribuir
Consulta nuestra [Guía de Contribución](CONTRIBUTING.md) para detalles sobre **GitFlow** y **Conventional Commits**.

## 💻 How to Run Locally

### 1. Prerequisites
- **Node.js 20+**: Required for Next.js 16.
  - Check version: `node -v`
  - Recommended: Use `nvm` to manage versions (`nvm use 20`).
- Docker (for local Supabase)
- Supabase CLI (`npm i -g supabase`)

### 2. Setup Supabase
Start the local database and services.
```bash
npx supabase start
```
*This runs Supabase at `http://127.0.0.1:54321`.*

### 3. Setup Project
Install dependencies and run the development server.
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 4. Default Local Credentials
To access the app locally, use the following pre-configured user:
- **Email**: `admin@crmplus.com`
- **Password**: `password123`

If this user does not exist (or after a database reset), run:
```bash
npx tsx scripts/create-user.ts
```

---

## 🌍 Environments & Deployment

### Switching Environments
The project uses `.env` files to switch between Local and Production.

1.  **Local (Default for Dev)**: uses `.env.local`
    ```bash
    NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_..."
    ```

2.  **Production**: uses `.env.production`
    To run locally against Prod (careful!), rename `.env.production` to `.env.local` or update the values.

### Deployment Guide
1.  **Database**: Push schema changes to remote.
    ```bash
    npx supabase db push --linked
    ```
2.  **Frontend**: Deploy to Vercel (Auto-deploys on push to `main`).
    ```bash
    git push origin main
    ```

## 📂 Project Structure
- `/app`: Next.js App Router.
- `/docs`: Raw data (PDF Catalog, .vcf contacts).
- `/lib`: VCard parsers, PDF extractors.
