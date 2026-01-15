# Guía de Despliegue Frontend

Esta guía explica cómo desplegar la aplicación CRM Plus a producción en un proveedor gratuito.

## Opción 1: Vercel (Recomendado)
Vercel es el creador de Next.js. Su plan "Hobby" es gratuito y 100% compatible sin configuración extra.

### Ventajas
- **Cero Configuración**: Detecta Next.js automáticamente.
- **Optimización de Imágenes**: Funciona nativamente (hasta 1000 imág/mes gratis).
- **Server Actions**: Soporte nativo y rápido.

### Pasos
1.  Sube tu código a **GitHub/GitLab/Bitbucket**.
2.  Ve a [vercel.com](https://vercel.com) e inicia sesión.
3.  Click en **"Add New..."** -> **"Project"**.
4.  Selecciona tu repositorio.
5.  En **Environment Variables**, agrega las mismas de tu `.env.local` (pero apuntando a PROD):
    - `NEXT_PUBLIC_SUPABASE_URL`: (Tu URL de Supabase Prod)
    - `SUPABASE_SERVICE_ROLE_KEY`: (Tu Key de Supabase Prod)
6.  Click **Deploy**.

---

## Opción 2: Cloudflare Pages (Alternativa)
Cloudflare tiene una infraestructura global muy rápida, pero requiere adaptadores para Next.js.

### Consideraciones Importantes
- **Imágenes**: La optimización nativa de `next/image` **NO funciona** en el free tier de Cloudflare Pages (usa Workers).
    - *Solución*: Debes configurar `unoptimized: true` en `next.config.ts` o usar un loader externo.
- **Node.js**: Next.js corre en "Edge Runtime" o requiere compatibilidad con Node.js en Workers.

### Pasos
1.  Instala el adaptador en tu proyecto:
    ```bash
    npm install --save-dev @cloudflare/next-on-pages
    ```
2.  Configura el script de build en `package.json`:
    ```json
    "pages:build": "npx @cloudflare/next-on-pages"
    ```
3.  Sube tu código a GitHub.
4.  Ve a Cloudflare Dashboard -> **Workers & Pages** -> **Create Application** -> **Pages** -> **Connect to Git**.
5.  Selecciona tu repo.
6.  Configuración de Build:
    - **Framework Preset**: Next.js
    - **Build command**: `npx @cloudflare/next-on-pages`
    - **Output directory**: `.vercel/output/static`
7.  Agrega las variables de entorno en la configuración de Cloudflare.

---

## Recomendación: Usa Vercel
Dado que usamos **Server Actions** y **Next.js Image**, Vercel es la opción que "simplemente funciona" y es gratis para proyectos personales. Cloudflare requeriría desactivar la optimización de imágenes o configuración avanzada.
