# Resumen del Proyecto: CRM Plus

## 🚀 Impacto del Proyecto
Transformación digital de una operación manual a un sistema centralizado y escalable.
- **Antes**: 13,000+ contactos dispersos en archivos VCF y Excel. Catálogo de productos estático en PDF. Búsqueda manual y lenta.
- **Después**: Base de datos SQL estructurada, búsqueda instantánea, catálogo digital con imágenes extraídas automáticamente y un Backoffice moderno.
- **Valor**: Reducción drástica del tiempo operativo para el equipo de ventas (usuario final) y preparación para futuras automatizaciones (marketing, ventas).

## 💡 Desafíos y Decisiones Técnicas

### 1. Migración de Datos Masiva (Data Engineering)
- **Problema**: Datos no estructurados. Miles de contactos duplicados y "sucios" en formatos legacy (.vcf).
- **Solución**: Scripts personalizados en TypeScript para parsear, limpiar y normalizar 13,000 registros antes de la ingestión.
- **Resultado**: Data limpia y deduplicada en Supabase.

### 2. Digitalización del Catálogo (The "Wow" Factor)
- **Problema**: El catálogo de productos era un PDF de diseño. No había base de datos de imágenes.
- **Solución Creativa**: Implementé un pipeline de extracción usando `pdfimages` para sacar los assets crudos, filtré íconos y máscaras mediante análisis de metadata, y escribí un script para mapear automáticamente las 129 imágenes a sus productos correspondientes.
- **Tech**: Node.js, pdfutils, Supabase Storage.

### 3. Stack Moderno y Performante
- **Next.js 16 (App Router)**: Elegido por **Server Actions** y **React Server Components**. Manejar tablas de 13k filas requiere renderizado eficiente en servidor para no bloquear el cliente.
- **Supabase**: Backend-as-a-Service para velocidad. Auth (seguridad inmediata), Database (Postgres robusto) y Storage (imágenes).
- **Tailwind CSS v4 + Glassmorphism**: Porque las herramientas internas no tienen por qué ser feas. Una UI premium mejora la experiencia del operador.

## 📝 Borrador para LinkedIn

**Título: De PDF y Excel a CRM Cloud en Tiempo Récord con Next.js 16 y Supabase**

¿Cómo centralizas 13,000 contactos y un catálogo estático en un fin de semana? 🚀

Acabo de terminar la Fase 1 de un CRM a medida ("CRM Plus") y quería compartir los retos técnicos más interesantes:

1️⃣ **Ingeniería de Datos Legacy**: Tuvimos que parsear archivos `.vcf` masivos y Excels antiguos. Escribí scripts de saneamiento en TypeScript para limpiar y estructurar más de 12k contactos antes de tocar la base de datos.

2️⃣ **Hacking del Catálogo PDF**: El cliente solo tenía un PDF de diseño. En lugar de pedir subir 129 fotos a mano, creé un pipeline que:
- Extrajo todas las imágenes del PDF a nivel binario.
- Filtró íconos y "basura" visual.
- Mapeó y subió automáticamente cada foto a su producto en la nube. 
 Resultado: Catálogo 100% digitalizado en segundos.

3️⃣ **Tech Stack de Vanguardia**:
- **Next.js 16**: Usando Server Actions para table filtering nativo y rápido.
- **Supabase**: Auth, DB y Storage en un solo lugar.
- **UI Premium**: Un Backoffice estilo "Glassmorphism" porque la UX interna también vende.

El resultado es una herramienta que reduce búsquedas de minutos a milisegundos.

¿Alguien más experimentando con la estabilidad de Next.js 16? 👇

#NextJS #Supabase #WebDevelopment #TypeScript #Automation #CRM
