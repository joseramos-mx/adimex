# Reporte round-6 · rama `fix/pre-lanzamiento-pauta` (congelar tras esto)

Commits:

```
aac5a60 round-6 p4: buildUserData con fallback extendido (phone/name/city) + tipo billing_address
48549fb round-6 p3: goToCheckout con timeout 1500ms al sync de attrs
5532b91 round-6 p2: mergeCartAttrs revoca marketing keys si incoming trae meta_consent=false + 5 unit tests
4d0c26e round-6 p1: beforeEach envia ?pixel_test=1 en primera nav
```

## 1. `?pixel_test=1` en beforeEach

[scripts/verify-launch.ts](scripts/verify-launch.ts): nuevo helper `pixelTestFirstNavUrl(url)` que compone `bypassUrl(url) + ?pixel_test=1`. El `test.beforeEach` navega ahí una vez por test — `shouldLoadPixelInEnv()` guarda el flag en `sessionStorage`, así el resto de navs del test cargan el pixel sin necesitar el query param.

El `beforeEach` ya no está gated por `BYPASS` (antes sólo se ejecutaba si había secret). Ahora corre siempre para garantizar el flag de pixel en preview y en local dev. En prod es no-op — `shouldLoadPixelInEnv()` devuelve true sin flag.

Los tests de ViewContent y AddToCart mantienen su skip por `waitForFbq` — pero ahora la única causa posible es que `connect.facebook.net` esté inaccesible desde el runner, nunca el env gate.

## 2. `mergeCartAttrs` con revocación por `meta_consent=false`

[src/lib/attribution-attrs.ts](src/lib/attribution-attrs.ts): al final del merge, si `incoming` trae `meta_consent=false`, se borran todas las `MARKETING_ONLY_ATTR_KEYS` (`meta_fbp`, `meta_fbc`, `meta_user_agent`, `meta_client_ip_address`) aunque estuvieran en `existing`.

Flujo real:
1. Usuario acepta marketing → cart tiene UTMs + IDs de marketing + `meta_consent=true`.
2. Usuario reabre banner y rechaza → sync incoming `[{ meta_consent: "false" }]`.
3. Merge produce: UTMs preservados, `meta_consent=false`, sin IDs de marketing.

Al pedido llegan sólo los UTMs y `meta_consent=false` → el webhook (round-5 p3) también oculta PII → Meta recibe Purchase mínimo (value/currency/content_ids). Cadena de opt-out completa.

5 unit tests nuevos en [scripts/unit-cart-attrs.test.ts](scripts/unit-cart-attrs.test.ts):

```
ok 1 preserva UTMs originales cuando incoming solo trae consent
ok 2 incoming sobrescribe existing con la misma key
ok 3 aceptar → rechazar: las llaves de marketing desaparecen
ok 4 meta_consent=true no borra nada
ok 5 meta_consent ausente en incoming no revoca (el estado persiste)
```

Suite unitaria total: **25 pass / 25** (20 previas + 5 nuevas).

## 3. `goToCheckout` con timeout 1500 ms

[src/context/cart-context.tsx](src/context/cart-context.tsx): `goToCheckout` ahora corre `syncAttributionAttrs()` bajo `Promise.race([sync, setTimeout(1500)])`.

- Si el sync completa antes de 1500 ms → redirect normal.
- Si el sync tarda más → `console.warn('excedió 1500ms — checkout continúa sin refresh de atributos')` → redirect.
- Si el sync tira excepción → `console.warn('falló — checkout continúa', err)` → redirect.

**La compra nunca se bloquea por atribución.** Si Shopify Storefront está lento o caído, el user llega al checkout igual y perdemos sólo un refresh de atributos que ya venían en el `cartCreate` original.

## 4. `buildUserData` con fallback extendido

[src/app/api/meta-capi/route.ts](src/app/api/meta-capi/route.ts):

Nuevo tipo `ShopifyAddress` compartido para `shipping_address` y **`billing_address`** (ambos con `phone` incluido). Helper `firstNonEmpty(...)` colapsa cadenas de más de dos niveles trimeando valores vacíos.

Fallback chains:

| Campo | Cadena |
|---|---|
| `ph` | `order.phone → shipping.phone → billing.phone → customer.phone` |
| `fn` | `shipping.first_name → billing.first_name` |
| `ln` | `shipping.last_name → billing.last_name` |
| `ct` | `shipping.city → billing.city` |
| `zp` | `shipping.zip → billing.zip` (mismo patrón) |
| `country` | `shipping.country_code → billing.country_code` (mismo patrón) |
| `em` | `customer.email → order.email` (sin cambio) |

Cubre pedidos guest sin `customer` expandido y digital-only sin `shipping`. Cada fallback pasa por su normalizador (`normalizePhone` MX-friendly, `normalizeName`, `normalizeCity`, etc.) — vacío tras normalizar = campo omitido, nunca hasheamos strings vacíos.

## Preview Vercel

Push a `origin/fix/pre-lanzamiento-pauta` @ `aac5a60`.

**Estado:** ✅ **success** — `Deployment has completed`.

- Preview URL: `https://adimex-git-fix-pre-lanzam-f633c8-joserams219-gmailcoms-projects.vercel.app`
- Panel: `https://vercel.com/joserams219-gmailcoms-projects/adimex/3x4hwScQbaENsFfVWkMqGvtYHxWX`

**Rama congelada en `aac5a60`** (código) + `<hash-de-este-reporte>` (docs). Siguiente paso natural: abrir PR contra `main`.
