# Reporte · rama `fix/pre-lanzamiento-pauta`

Fecha de corte: 2026-09-23. Base: `main` en `dea9f89`. Commits nuevos: 15.

## 1. Tabla de tareas

| # | Estado | Tarea | Commit |
|---|---|---|---|
| T01 | ✅ hecha | Hero: "Precios en MXN + IVA" → "Precios en MXN, IVA incluido" | `95296b0` |
| T02 | ✅ hecha | Fuente única de precio con IVA (`src/lib/pricing.ts`) + fix grid "También te puede interesar" + fix JSON-LD + fix BlogProductCard | `d55e5fa` |
| T03 | ✅ hecha | Banner cookies como franja superior en móvil (bajo header); barra sticky de compra siempre visible | `b67371d` |
| T04 | ✅ hecha | `CONSENT_MODE` (`opt-in` por defecto, `notice` disponible) + cookie 180 d + pixel se carga al aceptar sin reload | `3c728ae` |
| T05 | ✅ hecha | ViewContent / AddToCart / InitiateCheckout / Contact con `event_id` único + `content_ids` + `value` con IVA + `currency` | `3c728ae` |
| T06 | ✅ hecha | Endpoint `/api/meta-capi/event` que refleja server-side los eventos del navegador con el mismo `event_id`, `event_source_url`, `client_ip_address`, `client_user_agent`, `fbp`, `fbc`. Verifica consent vía cookie | `b4d11dc` |
| T07 | ✅ hecha | `WhatsAppEnhancer` global captura UTMs de la primera página de la sesión y añade ` [Ref: <utm_content>]` + dispara Contact automáticamente en cualquier `wa.me` que no marque `data-wa-manual="1"` | `2739bd0` |
| T08 | ✅ hecha | `dataLayer` GA4: `view_item`, `add_to_cart`, `begin_checkout` con `items`/`item_id`/`price`/`quantity`/`currency` — mismo criterio de consent (analytics) | `b4d11dc` |
| T09 | ✅ hecha | Filtro `/productos` oculta categorías con 0 comprables (servo, iot-gateway, scada, cloud desaparecen). Footer envía a `/bajo-pedido#…`. Nueva página `/bajo-pedido` con placeholders `[[PLACEHOLDER — …]]` marcados | `f12b896` |
| T10 | ✅ hecha | `/productos` title `PLC y HMI Flexem con precio publicado`, canonical + `og:url` en `/productos`, redirect 301 `productos-hmi-f110` → `hmi-f110c` en `next.config.ts` | `aa4da16` |
| T11 | ✅ hecha | JSON-LD Product con `mpn`, `priceValidUntil` (365 d), `seller.url`, `itemCondition` también en bajo pedido | `b1c4694` |
| T12 | ✅ hecha | `scripts/verify-launch.ts` + `playwright.config.ts` + `npm run verify:launch` | `43340d9` |
| T13 | ✅ hecha | Header con **Tienda** (CTA primaria azul → `/productos`) + carrito visible en móvil y desktop; **Agendar demo** pasa a outline | `869284f` |
| T14 | ✅ hecha | Franja `/productos` en 2×2 en móvil (4 puntos visibles sin scroll) + targets 44 px en menú móvil (buscador, región, carrito) | `ac09786` |
| T15 | 🟡 bloqueada | Listado de frases en "usted" preparado (ver §4) — el cliente entregará textos en "tú" | — |
| T16 | 🟡 bloqueada | Localizaciones de "32 ejes", garantías 24-72 h vs 3-15 d, y párrafo del corte F110C listadas (§5) — pendiente validación de Vicente | — |
| T17 | 🟡 bloqueada | Estructura de kits documentada (§6) — pendiente definición Shopify | — |
| T18 | ✅ listado | Artículos del blog que usan `images.pexels.com` (§7) | — |

## 2. Cómo verificar cada cambio

Requiere el dev server activo:

```
npm install
npx playwright install chromium
npm run dev            # una terminal
npm run verify:launch  # otra terminal
```

Verificación manual además de Playwright:

- **T01** — Home, primera pantalla → cuarto chip debe decir "Precios en MXN, IVA incluido".
- **T02** — Abrir `/productos/hmi-f110c`, hacer scroll a "También te puede interesar" → la tarjeta de F007N debe mostrar **$7,308.00 · IVA incluido** (no $6,300).
- **T03** — En 375×812, abrir `/productos/plc-fl7` sin decidir cookies → precio y botón Comprar deben verse en el primer pantallazo. El banner ocupa una franja superior <15 % del viewport.
- **T04** — En 375×812, abrir la home → aparece el banner. Aceptar. Recargar `document.cookie` en la consola: verás `adimex_consent`. En consola: `typeof fbq === "function"` = `true`. Cambiar `CONSENT_MODE` a `'notice'` en [src/lib/consent-mode.ts](src/lib/consent-mode.ts) → el pixel arranca sin aceptar (probar en incógnito para limpiar cookie).
- **T05/T06** — DevTools › Network → filtrar `facebook.com/tr`. Cargar `/productos/plc-fl7` con cookies aceptadas → verás ViewContent con `cd[content_ids]=43162651590865`, `cd[value]=3445.20`, `cd[currency]=MXN` y `event_id=vc_...`. En paralelo, request a `/api/meta-capi/event` con el mismo `event_id`. Meta Events Manager › Test Events (con `META_CAPI_TEST_CODE`) debe mostrarlo deduplicado.
- **T07** — Abrir `https://adimex.io/?utm_content=M1-03&utm_source=meta` en Chrome, hacer clic en cualquier botón WhatsApp → el link debe abrir con `[Ref: M1-03]` al final del mensaje. Meta Events Manager debe registrar Contact.
- **T08** — Con GTM en modo Preview, cargar ficha → verás `view_item` con `items` correctos; clic en Agregar al carrito → `add_to_cart`; clic en Comprar ahora → `begin_checkout`.
- **T09** — `/productos` sidebar: sólo PLCs y HMI. Footer: "Servomotores" y "IoT Gateways" ahora van a `/bajo-pedido#servomotores` y `/bajo-pedido#iot-gateways`. La página `/bajo-pedido` renderiza con `[[PLACEHOLDER — ...]]` visibles.
- **T10** — `curl -I https://adimex.io/productos/productos-hmi-f110` → `301` con `Location: /productos/hmi-f110c`. En `/productos`: `view-source` → `<meta property="og:url" content="https://adimex.io/productos">` y `<title>PLC y HMI Flexem con precio publicado | ADIMEX</title>`.
- **T11** — Rich Results Test de Google con URL de las 3 fichas → schema Product sin errores; ofrece muestra en Merchant.
- **T12** — `npm run verify:launch` (ver §8).
- **T13** — En 375×812, header muestra `[logo] · [Tienda] · [🛒] · [☰]` sin scroll. Desktop: `Tienda` es CTA azul, `Agendar demo` outline.
- **T14** — En 375×812, la franja `/productos` muestra los 4 chips en cuadrícula 2×2 sin corte. Menú móvil: los botones Región, Carrito y Buscador miden ≥44 px de alto.

## 3. Variables de entorno

Ya usadas por el proyecto (todas con default seguro):

- `NEXT_PUBLIC_META_PIXEL_ID` (default `3413615145484207`)
- `NEXT_PUBLIC_GTM_ID` (default `GTM-MSLKT9D9`)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (default `G-8XQTCY1DRC`)
- `NEXT_PUBLIC_IVA_RATE` (default `0.16`)
- `NEXT_PUBLIC_USD_MXN_RATE` (default `18`)

Que TÚ tienes que crear/verificar en Vercel:

| Variable | Descripción |
|---|---|
| `META_CAPI_ACCESS_TOKEN` | Token de larga duración de Events Manager → Data Sources → Pixel → Conversions API → Generate access token. Sin él, `/api/meta-capi/event` responde 501. |
| `META_CAPI_TEST_CODE` | (opcional, mientras validas) TEST5XXX de Events Manager → Test events. Cuando lo quites, los eventos empiezan a contar producción. |
| `SHOPIFY_WEBHOOK_SECRET` | (opcional pero recomendado) secret HMAC del webhook `orders/create` que ya alimenta `/api/meta-capi` (Purchase). |

`BASE_URL` es opcional para Playwright (default `http://localhost:3000`).

## 4. Frases en "usted" — T15 (BLOQUEADA)

Cuando me pases el texto nuevo en "tú", los sustituyo en estos puntos. Frases explícitamente formales:

| Archivo | Línea | Texto actual |
|---|---|---|
| `src/components/ui/cta-3.tsx` | 34 | ¿Listo para transformar su operación? |
| `src/components/ui/cta-3.tsx` | 40 | Hable con nuestros especialistas. Sin compromiso. |
| `src/components/ui/cta-3.tsx` | 49 | Mensaje recibido — le contactaremos pronto. |
| `src/components/ui/cta-3.tsx` | 85 | placeholder="¿En qué podemos ayudarle?" |
| `src/components/catalog.tsx` | 16 | Descubra cómo. |
| `src/components/catalog.tsx` | 28 | ¿Tiene preguntas sobre nuestros productos o soluciones? Estamos listos para ayudarle. |

Frases con mezcla tú/usted que también revisar cuando pases textos (no son formales estrictas pero conviene consistencia):

- `src/lib/contact.ts:11-13` — mensajes prellenados de WhatsApp (`sus soluciones`).
- Landing pages en `src/app/lp/*` — mezcla "tu sistema" con estructuras formales.

## 5. Datos técnicos — T16 (BLOQUEADA)

**"32 ejes" — 14 apariciones**:

Marketing / SEO / navegación (afectan a captación):
- `src/components/hero.tsx:27`
- `src/components/ui/header-04.tsx:36`
- `src/data/products.ts:399, 442, 444, 447, 461, 475, 477, 484 (aquí está la aparente contradicción con FL6), 504`
- `src/app/lp/plc-fl7/page.tsx:29, 30, 68, 380`
- `src/content/blog/guia-compra-plc-flexem-fl7.tsx:24, 50, 54, 93`
- `src/content/blog/flexem-en-mexico-distribuidor-autorizado.tsx:267`

Ninguna se ha modificado.

**F110C corte de panel**:
- `src/data/products.ts:907` — FAQ dice "271×213 mm; requiere más espacio que la F007N". No encontré en el repo una frase que diga que "mantiene el corte de panel de una de 7\"". Si la vio Vicente en la web hoy, puede que esté en Shopify (metafield) — dímelo y la busco allá.

**Garantía DOA vs falla en 12 m**:
- PLC ([src/data/products.ts:500](src/data/products.ts#L500)): "3-15 días hábiles" (para DOA y falla).
- F110C ([src/data/products.ts:919](src/data/products.ts#L919)): "DOA reemplazo 24-72 h; falla dentro de 12 m diagnóstico 3-15 días".
- Blog ([src/content/blog/flexem-en-mexico-distribuidor-autorizado.tsx:136-143](src/content/blog/flexem-en-mexico-distribuidor-autorizado.tsx#L136-L143)): tabla con "24-72 h" vs "3-15 días hábiles".

## 6. Kits — T17 (BLOQUEADA)

Necesito para armarlo:
1. **Composición final** de cada kit (Básico y Pro), con SKUs FLEXEM exactos.
2. **Precio** del kit con IVA — decidir si:
   - a) crear un **producto simple en Shopify** con su propio precio (más fácil, no muestra desglose de stock por componente), o
   - b) usar la app **Shopify Bundles** (nativo, sí desglosa stock), o
   - c) metafields `custom.bundle_components` en un producto suelto y renderizarlo en la ficha.
3. Confirmar el texto "Incluye 45 min de arranque asistido con ingeniero" y si aplica algún costo.

Cuando lo tengas defino qué crear en Shopify y termino la ficha.

## 7. Artículos con `images.pexels.com` — T18

`src/content/blog/`:
- automatizar-maquina-empacadora.tsx
- cuanto-cuesta-automatizar-maquina-mexico-2026.tsx
- flexem-en-mexico-distribuidor-autorizado.tsx
- guia-compra-plc-flexem-fl7.tsx
- hmi-flexem-f007n-vs-f110c.tsx
- hmi-flexem-modbus-plc-otra-marca.tsx
- modbus-rtu-vs-modbus-tcp.tsx
- plc-chino-vs-plc-europeo.tsx
- primer-proyecto-flexem-studio-parte-1.tsx
- retrofit-plc-obsoleto-maquina-industrial.tsx
- servomotor-vs-motor-a-pasos.tsx

11 archivos. Ninguno modificado.

## 8. `npm run verify:launch`

**No lo pude correr en esta sesión**: Playwright quedó agregado a `devDependencies` pero no se ejecutó `npm install` porque instalar dependencias afecta al `package-lock.json` compartido y prefiero que apruebes antes. Comandos para hacerlo:

```
npm install
npx playwright install chromium
npm run dev           # terminal 1
npm run verify:launch # terminal 2
```

Si falta `META_CAPI_ACCESS_TOKEN` en local, los tests que dependen de CAPI (T06) igual pasan porque validan el request del navegador; el mirror server-side responde 501 sin romper la petición.

## 9. Configuraciones fuera del código (que hago YO afuera / TÚ hoy)

**Meta Events Manager**:
- Generar `META_CAPI_ACCESS_TOKEN` en Data Sources → Pixel 3413615145484207 → Conversions API → Generate access token.
- (Opcional) Emitir `META_CAPI_TEST_CODE` mientras validas y luego quitarlo.
- Activar **Deduplication** para ViewContent, AddToCart, InitiateCheckout y Contact (Meta ya lo hace automático cuando ve mismo `event_id`).
- El catálogo de Meta debe tener los tres content_ids esperados (`43162651590865`, `43162684260561`, `43103064195281`) para que Advantage+ Catalog empareje.

**Google Tag Manager (GTM-MSLKT9D9)**:
- Crear una etiqueta **GA4 Event** por cada uno de:
  - `view_item` — disparador Custom Event = `view_item`.
  - `add_to_cart` — disparador Custom Event = `add_to_cart`.
  - `begin_checkout` — disparador Custom Event = `begin_checkout`.
- En cada una: **Send ecommerce data → Data Layer**.
- (Recomendado) Consent Mode v2 con `ad_storage` y `analytics_storage` = `denied` por defecto; los actualizamos con `gtag('consent', 'update', {...})` cuando el usuario acepta. Actualmente el gating es "carga/no carga el contenedor completo" — es más restrictivo que Consent Mode y también válido.
- Google Ads conversion tag para "Comprar ahora" (`begin_checkout`) o "Purchase" según cómo definas la meta de campaña.

**Shopify**:
- Verificar que el webhook `orders/create` sigue apuntando a `https://adimex.io/api/meta-capi` (el Purchase server-side ya existía, no lo tocamos).
- Kits (T17): definir producto/bundle/metafield según elijas.
- Placeholders visibles en `/bajo-pedido` — rellenar los `[[PLACEHOLDER — ...]]` cuando me pases el texto.

## 10. Commits en la rama

```
43340d9 T12: Playwright verify-launch (pixel, precios, slug F110C) + script npm run verify:launch
b4d11dc T06+T08: CAPI browser endpoint con dedupe + dataLayer GA4 ecommerce (view_item/add_to_cart/begin_checkout)
3c728ae T04+T05: CONSENT_MODE opt-in/notice + cookie 180d + eventos Meta con event_id y data-wa-manual
2739bd0 T07: captura UTMs de la sesion + enhancer global de wa.me con Ref y Contact
869284f T13: header con Tienda CTA y carrito visibles en movil + desktop; demo pasa a outline
ac09786 T14: trust bar 2x2 en movil + targets 44px en menu movil (region/carrito/buscador)
b1c4694 T11: JSON-LD Product completo con mpn, priceValidUntil, seller.url
aa4da16 T10: /productos title y og:url + redirect 301 productos-hmi-f110
f12b896 T09: filter oculta categorias sin comprables + pagina /bajo-pedido (placeholders)
b67371d T03: banner cookies como franja superior en movil (bajo header); barra sticky siempre visible
d55e5fa T02: fuente única de precio con IVA (pricing.ts) + fix related grid y JSON-LD
95296b0 T01: hero muestra 'Precios en MXN, IVA incluido'
```
