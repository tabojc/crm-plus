# Mobimed CRM & Sales Assistant

## 🎯 Vision: "Carmen 5x"
Boost Carmen's sales efficiency by 5x. Eliminate the chaos of spreadsheets, isolated phone contacts, and manual price checking. Transform the sales process from "memory-based" to "system-based".

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
- **Frontend**: Next.js (React) + TailwindCSS (Premium UI).
- **Backend**: Supabase (PostgreSQL + Auth).
- **Infrastructure**: Cloudflare.
- **AI (Future)**: Agents for auto-categorization and drafting responses.

## 📂 Project Structure
- `/app`: Next.js App Router.
- `/docs`: Raw data (PDF Catalog, .vcf contacts).
- `/lib`: VCard parsers, PDF extractors.
