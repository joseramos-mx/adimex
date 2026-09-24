# Reporte round-3 · rama `fix/pre-lanzamiento-pauta`

Commits añadidos:

```
bd46caf round-3 p2: log warn si Purchase value < 100 (auditoria de tiendas mal configuradas)
d5ae0ec round-3 p1: /bajo-pedido textos finales + botones WA por familia + seccion Como funciona
```

## 1. `/bajo-pedido`

Reemplacé los 5 `[[PLACEHOLDER]]` con los textos exactos que pasaste. Añadí también:

- Botón WhatsApp **por familia**, con mensaje prellenado `Hola, quiero precio bajo pedido de <Familia>.` (label desde `categoryMeta`, ej. `Servomotores`, `IoT Gateways`, `SCADA`, `Cloud`). Marcados con `data-wa-surface="bajo-pedido:<anchor>"` para telemetría — el `WhatsAppEnhancer` global les añade el `Ref: <utm_content>` cuando aplica.
- Sección `#como-funciona` al final con los 3 pasos, en grid 3-columnas (md+) o vertical (móvil). Cada paso en tarjeta con etiqueta "Paso N".
- Quité el CTA azul "Cotizar por WhatsApp" del hero (los CTAs por familia lo reemplazan).
- Sin especificaciones técnicas ni tiempos de entrega en el cuerpo.

Guard confirmado:

```
$ node scripts/check-no-placeholders.mjs; echo "exit=$?"
exit=0

$ npm run build
> adimex@0.1.0 prebuild
> node scripts/check-no-placeholders.mjs
                                  ← guard PASA
> adimex@0.1.0 build
> next build
▲ Next.js 16.1.6 (Turbopack)
...
```

Nota: `next build` cayó en este entorno con un error interno de Turbopack ("os error 1450 — Recursos insuficientes en el sistema") al leer `node_modules/groq-js/dist/index.mjs`. Es un límite de Windows (handles/paging), **no de nuestro código** — el `prebuild` corrió y pasó. En Vercel el build corre en Linux y no ve ese error.

## 2. Alerta de value bajo

En [`/api/meta-capi/route.ts`](src/app/api/meta-capi/route.ts):

```ts
if (value < 100) {
  console.warn(
    "[meta-capi] Purchase value sospechosamente bajo",
    { order_id: order.id, value, currency, total_price: order.total_price },
  )
}
```

- No bloquea el envío a Meta.
- Sale en Vercel Logs como `warn` — filtrable con "Purchase value sospechosamente bajo" para auditar tiendas mal configuradas (p.ej. Shopify quedó en modo "precios NO incluyen impuestos", o llegó un pedido en USD sin conversión).
- Umbral 100 MXN elegido porque los tres productos publicados están por encima de $3,445 MXN — cualquier value < 100 es señal segura de error de conversión, no un pedido legítimo.

## 3. Feed de productos — recomendación

**No existe feed hoy.** Sitemap XML sí ([`src/app/sitemap.ts`](src/app/sitemap.ts)), pero no un data feed para Merchant / Meta Catalog.

### Opciones

| Opción | Pros | Contras |
|---|---|---|
| **A. Shopify Google & YouTube Sales Channel** (app nativa) | Auto-sync, sin código | El `link` sale como `<shop>.myshopify.com/products/<handle>`. Sólo lo cambias si pones adimex.io como **primary domain** en Shopify Admin → Settings → Domains — pero al ser headless nunca lo hicimos, y hacerlo re-rutea el online store. Además la app genera el feed desde `product.description` (HTML), no del nuestro. |
| **B. Shopify Facebook & Instagram Sales Channel** | Igual, auto-sync a Meta Catalog | Mismo problema del `link`. Además Meta Catalog importa por default y los IDs no siempre coinciden con el `META_CONTENT_IDS` que ya tenemos hardcodeado en [meta-pixel.ts](src/lib/meta-pixel.ts) → riesgo de que ViewContent llegue con IDs distintos a los del catálogo. |
| **C. Feed propio servido desde adimex.io** (recomendado) | Links siempre `https://adimex.io/productos/<slug>`; usa `pricing.ts` (IVA garantizado); IDs consistentes con `META_CONTENT_IDS`; funciona igual si algún día migramos de Shopify | Hay que escribirlo (~150 líneas TS) y mantenerlo. |

### Recomendación: **C**

Es lo que espera un sitio headless. Una route handler nueva `src/app/products.xml/route.ts` (o `.rss` / `.csv`) que:

1. Llame a `getProducts({})` (mismo pipeline que la ficha, ya cacheado por request).
2. Emita XML de Google Merchant con estas columnas por producto **comprable** (`shopifyHandle && price`):
   - `<g:id>` = `META_CONTENT_IDS[slug]` (mismo ID que ViewContent → dedup perfecto).
   - `<g:title>` = `product.name`
   - `<g:description>` = `product.description` truncado a 5000 chars.
   - `<g:link>` = `https://adimex.io/productos/${slug}`
   - `<g:image_link>` = `product.image`
   - `<g:price>` = `formatMxnWithIva(price)` como `"9103.47 MXN"` (con IVA, misma función que la ficha).
   - `<g:availability>` = `in_stock` / `out_of_stock` según `availableForSale`.
   - `<g:brand>` = `FLEXEM`
   - `<g:mpn>` = `product.series`
   - `<g:condition>` = `new`
   - `<g:google_product_category>` = ID de la categoría "Business & Industrial > Manufacturing" (los podemos mapear después; opcional en MX).
3. Cache con `export const revalidate = 3600` (igual que sitemap) — se regenera cada hora.

Volumen: 3 productos hoy. Ligero, sin coste.

### Lo que tú tienes que configurar afuera

**Google Merchant Center** (obligatorio para Shopping Ads y Free Product Listings):
1. Crear cuenta en merchants.google.com con el email de dominio.
2. **Verificar y reclamar** `adimex.io` (mismo flow de Search Console — hoy con Google Analytics + DNS TXT).
3. Products → Feeds → Add primary feed:
   - Country: **México** · Language: **es** · Destination: Free listings + Shopping ads
   - Type: **Scheduled fetch** · URL: `https://adimex.io/products.xml`
   - Fetch: **Daily** a las 6:00 AM CDMX (después de tu re-caché horario).
4. En Data Quality → confirmar que no hay warnings de "shipping" / "tax" — MX no requiere shipping en el feed si tienes envío gratis publicado, pero conviene añadir `<g:shipping>` con "MX::flat rate:$0.00 MXN" para no perder impresiones.
5. Linkear Merchant Center ↔ Google Ads (Ads → Tools → Linked accounts).

**Meta Commerce Manager** (para catalog ads / DPA):
1. Commerce Manager → Catalogs → **Assets → Product feeds**. Si la app de Shopify ya creó un catálogo, **desactivarlo** (para no tener dos catálogos con `content_ids` distintos).
2. Create catalog → E-commerce → Manual · MX · MXN.
3. Data source → **Use scheduled feed** → `https://adimex.io/products.xml` con las mismas columnas Google Merchant (Meta acepta el mismo XML si respetamos el namespace `xmlns:g="http://base.google.com/ns/1.0"`).
4. Asociar el catálogo al **Pixel 3413615145484207** (Configure → Associated event source).
5. Verificar en Events Manager que la primera hora tras la ingesta, ViewContent aparezca con "Matched to catalog: 3/3 items".

### Coste de hacer esto

Es ~1-2 h de código: nueva route, dos test de que el XML valida contra XSD de Merchant, entrada en `robots.ts` (permitir crawling del feed). Puedo mandarlo en un PR aparte cuando me digas.

Mientras tanto, si necesitas empezar pauta con Shopping Ads antes: la opción B/A funciona pero contamina content_ids. Recomendación fuerte: NO usarlas y esperar el feed propio.
