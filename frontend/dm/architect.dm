# Arquitectura del Sistema: Catálogo Web de Productos

## 1. Visión General
Sistema web modular de tipo catálogo orientado a la presentación visual de productos, generación de prospectos (leads) y consulta rápida. No incluye pasarela de pagos ni procesamiento de transacciones financieras.

---

## 2. Sistema de Diseño & Tipografía (Design Tokens)

Para garantizar consistencia visual y evitar confusión entre la jerarquía de textos, se define una regla de **máximo 2 familias tipográficas**:

### Regla Tipográfica
* **Fuentes primarias recomendadas:**
  * Opción A (SaaS / Técnico): **Inter** (Cuerpo) + **Plus Jakarta Sans** (Encabezados)
  * Opción B (E-commerce Elegante): **Inter** (Cuerpo) + **Playfair Display** (Encabezados)
  * Opción C (Corporativo / Limpio): **Roboto** (Cuerpo) + **Montserrat** (Encabezados)

### Escala Jerárquica y Tokens
```css
:root {
  /* Tipografía */
  --font-heading: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Tamaños y Pesos */
  --text-h1: 700 2.5rem/1.2 var(--font-heading);
  --text-h2: 600 2.0rem/1.3 var(--font-heading);
  --text-h3: 600 1.5rem/1.4 var(--font-heading);
  --text-body: 400 1.0rem/1.5 var(--font-body);
  --text-body-bold: 600 1.0rem/1.5 var(--font-body);
  --text-small: 400 0.875rem/1.4 var(--font-body);

  /* Paleta de Color Limpia (Modo Claro) */
  --color-bg-main: #FAFAFA;
  --color-bg-card: #FFFFFF;
  --color-text-primary: #111827;
  --color-text-secondary: #4B5563;
  --color-brand-primary: #0F172A;
  --color-brand-accent: #2563EB;
  --color-border: #E5E7EB;
}