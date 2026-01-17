# Project Roadmap & Implementation Status

## 1. Completed Migrations
We have consolidated valid ad-hoc scripts into Supabase SQL migrations to ensure reproducibility and stability in production.

*   **[20260117100000_add_quote_number_and_address.sql]**: Added `number` to quotes and `address` to contacts.
*   **[20260117110000_dedup_products_and_constrain.sql]**: Deduplicated products and added `UNIQUE` constraint.
*   **[20260117120000_fix_quote_items_product_link.sql]**: Linked orphan quote items to products.

## 2. Deferred Features (Backlog)

### Settings Module
The "Settings" menu item has been removed from the UI to focus on core functionality. The following features are pending implementation for this module:
*   **User Profile**: Ability to update name, email, and password.
*   **App Configuration**: UI to update `NEXT_PUBLIC_COMPANY_NAME` and upload company logo.
*   **Notification Preferences**: Toggle email/WhatsApp notifications.
*   **Tax/Currency Settings**: Configure VAT (IVA) rates and currency symbols.

## 3. Enterprise Roadmap (Technical Excellence)
To elevate the project to a senior/production-ready standard, the following technical improvements are recommended:
*   **Automated Testing**:
    *   Unit Tests (Vitest/Jest) for calculation utilities (tax, totals) and helper functions.
    *   E2E Tests (Playwright) for critical flows: Login -> Create Contact -> Create Quote.
*   **Global Error Handling**:
    *   Implement `error.tsx` boundaries for graceful UI failure catch.
    *   Integrate error logging service (e.g., Sentry) for production monitoring.
*   **CI/CD Pipeline**:
    *   GitHub Actions workflow to run `lint`, `type-check`, and `test` on every Pull Request.
    *   Automated deployment to staging/production on merge.
*   **Runtime Validation**:
    *   Integrate `zod` schemas for all Server Actions inputs to ensure type safety beyond TypeScript compile time.
    *   Validate database responses to prevent runtime crashes from unexpected data shapes.
