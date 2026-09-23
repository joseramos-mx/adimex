# Reporte round-4 · rama `fix/pre-lanzamiento-pauta`

Commits añadidos:

```
4b77d2f round-4 hotfix: mover CookieConsentProvider por encima de CartProvider (SSR fallaba porque Cart usa useCookieConsent)
fe7d2db round-4 p3: cart attributes con fbp/fbc/UA/UTMs (consent-gated) + webhook orders/create los pasa a user_data de CAPI con hashing correcto
65a78af round-4 p2: /products.xml (Google Merchant, solo comprables, precio con IVA numerico) + mpn en Product + robots allow + tests coincidencia feed<->ViewContent
d3141bc round-4 p1: content_id = variant ID numerico de Shopify (elimina mapa hardcoded); meta:content_id en la ficha para verificacion
```

## 1. IDs dinámicos — sin mapa hardcoded

Eliminé `META_CONTENT_IDS` de [src/lib/meta-pixel.ts](src/lib/meta-pixel.ts) junto con `toMetaContentId()` y `toMetaContentIds()`. Nuevo helper único: [src/lib/shopify-id.ts](src/lib/shopify-id.ts) — `extractShopifyNumericId(gid)` que devuelve el ID numérico de una GID de Shopify.

Todos los sitios usan la misma función:

| Sitio | Antes | Ahora |
|---|---|---|
| [view-content.tsx](src/components/meta-events/view-content.tsx) | `toMetaContentId(slug)` | `extractShopifyNumericId(product.variantId)` |
| [add-to-cart.tsx](src/components/add-to-cart.tsx) | `toMetaContentId(sku ?? variantId)` | `extractShopifyNumericId(variantId)` |
| [product-sticky-bar.tsx](src/components/product-sticky-bar.tsx) | idem | idem |
| [cart-drawer.tsx](src/components/cart-drawer.tsx) | `toMetaContentId(i.sku ?? i.productHandle ?? i.variantId)` | `extractShopifyNumericId(i.variantId)` |
| [blog/wa-quote-button.tsx](src/components/blog/wa-quote-button.tsx) | recibía `productSku`, mapeaba | recibe `variantId`, extrae numérico |
| [/api/meta-capi webhook](src/app/api/meta-capi/route.ts) | `toMetaContentId(li.sku ?? String(li.variant_id))` | `String(li.variant_id)` directo |

En el frontend el ID sale del `variantId` que ya está en el pipeline `products.ts`. En el webhook sale de `line_item.variant_id` (ya numérico en Shopify). Cero riesgo de desincronización.

Además, [/productos/[slug]/page.tsx](src/app/productos/[slug]/page.tsx) publica `<meta name="meta:content_id">` en el `<head>` con el mismo ID — sirve de puente de verificación para el test de coincidencia.

### Test de coincidencia (p2)

Añadido a [scripts/verify-launch.ts](scripts/verify-launch.ts):

```
test("g:id del feed coincide con meta:content_id de cada ficha (base para ViewContent)")
```

Flujo: fetch `/products.xml` → por cada `<item>`, navegar a `g:link` y leer `<meta name="meta:content_id">`. Asserta igualdad. Se marca skip si el feed viene vacío (Shopify no conectado en local).

## 2. Feed `/products.xml`

Nueva route [src/app/products.xml/route.ts](src/app/products.xml/route.ts):

- RSS 2.0 con namespace `xmlns:g="http://base.google.com/ns/1.0"` — formato Google Merchant, aceptado también por Meta.
- Filtro: sólo productos con `variantId` **y** `price` **y** `currencyCode === "MXN"` (comprables). Los "bajo pedido" quedan fuera del catálogo.
- Campos por item:
  - `g:id` = variant ID numérico (mismo que el pixel)
  - `g:title` = nombre del producto
  - `g:description` = HTML stripeado + máx 5000 chars
  - `g:link` = `https://adimex.io/productos/<slug>`
  - `g:image_link` = URL de la imagen principal
  - `g:availability` = `in_stock` / `out_of_stock` (`availableForSale`)
  - `g:price` = `mxnWithIva(price).toFixed(2) + " MXN"` — numérico sin `$` ni comas
  - `g:brand` = `FLEXEM`
  - `g:condition` = `new`
  - `g:mpn` = **modelo real del fabricante** (`FL721-0808P-D`, `F007N`, `F110C`)
  - `g:identifier_exists` = `no` (no tenemos GTIN)
- **NO** hay `g:shipping` todavía — dejado como constante comentada [route.ts:19-20](src/app/products.xml/route.ts#L19-L20). Envíame el costo real y lo activo.
- `revalidate = 3600` (regenera cada hora) + cache header `s-maxage=3600, stale-while-revalidate=86400`.
- [robots.ts](src/app/robots.ts) permite explícitamente `/products.xml`.

Nuevo campo `mpn?: string` en el tipo `Product` ([src/data/products.ts:76-81](src/data/products.ts#L76-L81)) y asignado a los 3 productos comprables:

| Producto | mpn |
|---|---|
| PLC FL7 | `FL721-0808P-D` |
| HMI F007N | `F007N` |
| HMI F110C | `F110C` |

También actualicé el JSON-LD Product para preferir `product.mpn` sobre `product.series` como fuente del `mpn` schema ([slug]/page.tsx:114-116).

### Test del feed

Añadido a [scripts/verify-launch.ts](scripts/verify-launch.ts):

```
test("XML válido con campos obligatorios de Google Merchant")
```

Valida por cada `<item>`: `g:id` es todo dígitos, `g:link` apunta a `https://adimex.io/productos/<slug>`, `g:price` matchea `^\d+\.\d{2} MXN$` **sin `$`** **sin comas**, `g:brand === "FLEXEM"`, `g:mpn` no vacío, `g:availability ∈ {in_stock, out_of_stock}`, `g:title` no vacío.

## 3. Datos de matching para Purchase

Nuevo módulo [src/lib/attribution-attrs.ts](src/lib/attribution-attrs.ts):

- `gatherAttributionAttrs(marketingConsent)` → arma un array de `{key, value}` con:
  - UTMs de la sesión (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `landing_url`) → **siempre**, no son PII.
  - `meta_fbp`, `meta_fbc`, `meta_user_agent` → **sólo si `marketingConsent`**.

En [cart-context.tsx](src/context/cart-context.tsx) el `addItem` los pasa a `/api/cart` **sólo en la primera adición** (cartCreate) — Shopify no permite update de attributes con Storefront, así preservamos la fuente original de la sesión.

[/api/cart POST](src/app/api/cart/route.ts):

- Whitelist estricta de keys aceptadas (no se permite inyectar campos arbitrarios).
- Verifica `adimex_consent.marketing` cookie server-side; filtra `meta_*` si el consent bajó entre el navegador y el POST.
- Si hay consent marketing, añade `meta_client_ip_address` = `X-Forwarded-For` de la request.
- Mutation `cartCreate` actualizado para aceptar `attributes: [AttributeInput!]`.

[/api/meta-capi webhook](src/app/api/meta-capi/route.ts):

- Nuevo campo `note_attributes` en el tipo `ShopifyOrder`.
- `buildUserData(order)` ahora:
  - Normaliza email/nombres/ciudad con `trim()` (hashSha256 ya hace `toLowerCase`).
  - Normaliza teléfono a sólo dígitos (per Meta spec, código de país incluido, sin `+`).
  - Skip campo vacío (nunca hashear string vacío).
  - Lee `meta_fbp`, `meta_fbc`, `meta_user_agent`, `meta_client_ip_address` de `note_attributes` y los pone en `user_data.fbp` / `fbc` / `client_user_agent` / `client_ip_address` (en claro, como Meta espera).

Resultado en un pedido con consent + UTM + fbp:

```json
"user_data": {
  "em": ["<sha256(email)>"],
  "ph": ["<sha256(digits)>"],
  "fn": ["<sha256(firstName)>"],
  "ln": ["<sha256(lastName)>"],
  "ct": ["<sha256(city)>"],
  "zp": ["<sha256(zip)>"],
  "country": ["<sha256(country_code)>"],
  "fbp": "fb.1.1737...",
  "fbc": "fb.1.1737...IwAR...",
  "client_user_agent": "Mozilla/5.0 ...",
  "client_ip_address": "189.204.x.x"
}
```

Si no hubo consent marketing, `fbp/fbc/client_user_agent/client_ip_address` faltan; el resto se manda igual (son datos del pedido, base contractual distinta a la de tracking).

## 4. Build en Vercel preview

Push del branch a `origin/fix/pre-lanzamiento-pauta`.

**Primer intento (`fe7d2db`)**: **falló**. Sin acceso a los logs desde este entorno (Vercel CLI necesita auth), diagnostiqué por inspección del código:

- `CartProvider` en el commit `fe7d2db` empezó a usar `useCookieConsent()` para decidir si adjunta `fbp/fbc/UA` como cart attributes.
- Pero en [src/app/layout.tsx](src/app/layout.tsx) el árbol de providers estaba `<CartProvider><CookieConsentProvider>{children}` — el hook de consent se resolvía **sin proveedor arriba** → `useCookieConsent must be used inside CookieConsentProvider` → SSR reventaba en el prerender.
- Localmente no lo detecté antes porque `next build` en este Windows sale por OOM de Turbopack antes de llegar al render.

**Hotfix `4b77d2f`**: invertí el orden a `<CookieConsentProvider><CartProvider>{children}` (Cart ahora es hijo de CookieConsent). CartDrawer/Banner/etc siguen funcionando porque siguen bajo ambos providers.

**Segundo intento (`4b77d2f`)**: **✅ success** — `Deployment has completed`.

- Preview URL: `https://adimex-git-fix-pre-lanzam-f633c8-joserams219-gmailcoms-projects.vercel.app` (privada, protegida por Vercel SSO).
- `curl -I <preview>/` → `302 Found` (SSO gate; dominio activo).
- `curl -I <preview>/products.xml` → `302 Found` (ruta existe, no 404 ni 500).
- Panel Vercel: `https://vercel.com/joserams219-gmailcoms-projects/adimex/De9VsqBpC2BrJEkfdG4Ti8dSgBkb`

### Para validar contenido tras autenticar el SSO

- `<preview>/products.xml` → feed. Sólo tendrá `<item>` si el preview tiene `SHOPIFY_STORE_DOMAIN` + `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` en env. Si no, viene vacío igual que en local.
- `<preview>/productos/plc-fl7` → `view-source:` debe incluir `<meta name="meta:content_id" content="<numérico>">` en `<head>` (sólo aparece cuando el producto tiene `variantId` de Shopify).
- `<preview>/api/meta-capi/event` POST desde otro origen → 403.
- `<preview>/api/meta-capi` sin `X-Shopify-Hmac-Sha256` → 401.

Env vars para replicar en Vercel → Settings → Environment Variables → Preview: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_PRIVATE_TOKEN`, `META_CAPI_ACCESS_TOKEN`, `SHOPIFY_WEBHOOK_SECRET`.
