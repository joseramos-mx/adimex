# Reporte round-5 · rama `fix/pre-lanzamiento-pauta`

Commits añadidos:

```
08d1d2a round-5 p7: Playwright soporta VERCEL_AUTOMATION_BYPASS_SECRET (header en todas las requests + query param en primera nav; secret solo de env)
be25faa round-5 p6: normalizacion user_data segun spec Meta + 20 unit tests con casos mexicanos reales
2a8afcf round-5 p5: feed sin g:identifier_exists (brand+mpn ya cubren a Google Merchant)
f34bd29 round-5 p4: gate pixel/CAPI por VERCEL_ENV
f556b5a round-5 p3: SEND_ORDER_PII_WITHOUT_CONSENT (default false) + meta_consent cart attr
a3cd4b5 round-5 p2: captura fbclid + sintetiza cookie _fbc al aceptar marketing
015a629 round-5 p1: cartAttributesUpdate con merge + trigger al aceptar marketing y antes de goToCheckout
```

## 1. `cartAttributesUpdate` con merge

Nueva ruta [`/api/cart/attributes`](src/app/api/cart/attributes/route.ts) — `PATCH { cartId, attributes }`:

1. Lee los atributos actuales del carrito (`cartAttrs` query).
2. Sanea los entrantes con la misma whitelist / marketing-gate que `cartCreate`.
3. Server añade `meta_client_ip_address` si hay consent marketing.
4. **Merge**: `mergeCartAttrs(existing, incoming)` — cualquier key no presente en `incoming` se preserva de `existing`. Los UTM originales de la sesión no se pierden aunque el cliente sólo mande fbp/fbc/consent.
5. Ejecuta `cartAttributesUpdate` con la unión merged.

Cliente en [cart-context.tsx](src/context/cart-context.tsx) expone `syncAttributionAttrs()` privado y lo dispara en dos momentos:

- **(a) Al aceptar marketing**: `useEffect(consent.marketing → true && cart.id)` → adjunta fbp/fbc/user_agent que no pudimos setear en el `cartCreate` original.
- **(b) Justo antes de goToCheckout**: refresca cualquier atributo cambiado durante la sesión antes de redirigir a Shopify.

`goToCheckout` ahora es async (`() => Promise<void>`). Los 3 call sites (add-to-cart, cart-drawer, product-sticky-bar) ya no bloquean pero el sync corre antes del redirect.

Helper compartido: [`mergeCartAttrs()`, `sanitizeCartAttrs()`, `ALLOWED_CART_ATTR_KEYS`, `MARKETING_ONLY_ATTR_KEYS`](src/lib/attribution-attrs.ts) en un solo lugar. Duplicación server-side eliminada.

## 2. fbclid → `_fbc` synthesis

Nuevo módulo [src/lib/fbclid.ts](src/lib/fbclid.ts):

- `captureFbclidFromLocation()` — extrae `?fbclid=` en aterrizaje y guarda `{fbclid, ts: Date.now()}` en `sessionStorage` (una vez por sesión, no sobreescribe).
- `ensureFbcCookie()` — si NO existe cookie `_fbc` y hay fbclid guardado, escribe `_fbc = fb.1.<ts>.<fbclid>` (formato Meta spec: `fb.<subdomain_index>.<creation_time_ms>.<fbclid>`, `subdomain_index=1` para dominio raíz `adimex.io`). Idempotente — nunca pisa un `_fbc` existente.
- max-age = 90 días (spec de Meta).

Wiring:
- Captura en [whatsapp-enhancer.tsx](src/components/whatsapp-enhancer.tsx) `useEffect` — mismo mount donde ya se capturan UTMs.
- Síntesis en [cookie-consent-context.tsx](src/context/cookie-consent-context.tsx) `persist()` — cuando `next.marketing === true`, llama `ensureFbcCookie()` justo después de persistir el consent.

Ciclo completo:
1. Usuario aterriza con `?fbclid=IwAR...` → fbclid guardado, no cookie aún.
2. Usuario acepta marketing → `_fbc` cookie sintetizada.
3. `gatherAttributionAttrs(true)` lee `_fbc` de cookie → va como `meta_fbc` al carrito.
4. Al crear el pedido → `note_attributes.meta_fbc` → `user_data.fbc` en CAPI.
5. Meta correlaciona el click de Ads con la conversión.

## 3. `SEND_ORDER_PII_WITHOUT_CONSENT` + `meta_consent`

Nuevo flag en [src/lib/consent-mode.ts](src/lib/consent-mode.ts):

```ts
export const SEND_ORDER_PII_WITHOUT_CONSENT: boolean = false
```

Cliente ([attribution-attrs.ts](src/lib/attribution-attrs.ts)) siempre incluye `meta_consent=true|false` en `gatherAttributionAttrs()` — el snapshot del consent al momento de crear/actualizar el carrito.

Webhook [/api/meta-capi](src/app/api/meta-capi/route.ts):

```ts
const consentAttr = attrValue(order, "meta_consent")
const hasMarketingConsent = consentAttr === "true"
const includePii = SEND_ORDER_PII_WITHOUT_CONSENT || hasMarketingConsent
const userData = includePii ? await buildUserData(order) : {}
```

Cuando `includePii === false` → Meta recibe `Purchase` con `value + currency + content_ids + event_id + custom_data`, sin `em/ph/fn/ln/ct/zp/country/fbp/fbc/UA/IP`. Log a Vercel:

```
[meta-capi] Purchase sin PII — meta_consent no era true { order_id, meta_consent }
```

## 4. Gate por `VERCEL_ENV`

Nuevo módulo [src/lib/env-gating.ts](src/lib/env-gating.ts):

| Función | Prod | Preview / dev |
|---|---|---|
| `isProdEnv()` (server) | `VERCEL_ENV === "production"` | — |
| `isProdEnvClient()` | `NEXT_PUBLIC_VERCEL_ENV === "production"` | — |
| `shouldLoadPixelInEnv()` (client) | `true` | `true` **sólo si** `?pixel_test=1` en URL. Persiste flag en `sessionStorage` para nav siguiente. |
| `shouldSendCapi()` (server) | `true` | `true` **sólo si** `META_CAPI_TEST_CODE` está definido |
| `forceTestEventCode()` | `false` (a menos que operador lo ponga a mano) | `true` cuando hay `META_CAPI_TEST_CODE` |

Wiring:
- [MetaPixel](src/components/meta-pixel.tsx): añadida gate `envAllows`. Preview sin `?pixel_test=1` → pixel no carga aunque haya consent. Evita contaminar las estadísticas de producción con pruebas.
- [/api/meta-capi](src/app/api/meta-capi/route.ts): responde `{ok:true, skipped:"non-prod without test code"}` en preview sin TEST_CODE. Con TEST_CODE incluye `test_event_code` en el payload siempre en preview.
- [/api/meta-capi/event](src/app/api/meta-capi/event/route.ts): mismo criterio, responde 204 silencioso.
- [next.config.ts](next.config.ts) copia `VERCEL_ENV` a `NEXT_PUBLIC_VERCEL_ENV` para que el cliente lo lea. En Vercel dashboard esta env var ya viene por default en `VERCEL_ENV`.

## 5. Feed sin `g:identifier_exists`

Eliminado de [/products.xml](src/app/products.xml/route.ts). Google Merchant ya toma `<g:brand>FLEXEM</g:brand>` + `<g:mpn>...</g:mpn>` como identificación válida cuando no hay GTIN.

## 6. Normalización `user_data` per spec de Meta

Nuevo módulo [src/lib/meta-user-data.ts](src/lib/meta-user-data.ts) — funciones puras, testeadas:

| Campo | Regla |
|---|---|
| `em` | `trim + toLowerCase` |
| `fn`, `ln` | `toLowerCase`, quita puntuación (mantiene letras/números/acentos ES/-), colapsa espacios |
| `ct` | `toLowerCase`, quita **todo** lo no-alfanumérico (Meta pide "sin espacios ni puntuación") |
| `zp` | Sólo dígitos, primeros 5 (México) |
| `ph` | Sólo dígitos + regla mexicana: `10d → 52+10`, `521+10d → 52+10` (drop 1 legacy móvil), `52+10d → tal cual`, otros → tal cual |
| `country` | ISO-2 en minúsculas |

Cada campo vacío tras normalización se omite (nunca se hashea string vacío).

Wireado en [meta-capi/route.ts:buildUserData()](src/app/api/meta-capi/route.ts): reemplaza el trim/lowercase inline que había, usa los normalizadores puros. La rama que fabrica `user_data` con PII sigue idéntica en shape, sólo cambia cómo se prepara cada campo antes de hashear.

### Tests unitarios — 20 pasan

Archivo nuevo [scripts/unit-meta-user-data.test.ts](scripts/unit-meta-user-data.test.ts). Playwright config actualizado para descubrir `unit-*.test.ts`:

```
20 passed (1.3s)
```

Casos MX reales cubiertos:
- Teléfono: `5635698469`, `55 3569 8469`, `(55) 3569-8469`, `5215635698469`, `+525635698469` → todos → `525...`
- Ciudades: "Ciudad de México" → `ciudaddeméxico`, "San Luis Potosí" → `sanluispotosí`, "Guadalajara, Jal." → `guadalajarajal`
- Nombres con acentos: "José Ramos" → `josé ramos`, "Muñoz-Álvarez" → `muñoz-álvarez` (guion permitido), `O'Neill, Jr.` → `oneill jr`
- CPs: `06600`, `06600-1234` → `06600`
- Country: `MX` → `mx`, `us` → `us`, `México` → `""` (no ISO-2)
- Regresión: vacío/undefined/null → `""` en todos los normalizadores

## 7. Playwright soporte de Vercel Deployment Protection

[playwright.config.ts](playwright.config.ts): si `VERCEL_AUTOMATION_BYPASS_SECRET` está en env, Playwright añade:

```ts
extraHTTPHeaders: {
  "x-vercel-protection-bypass": BYPASS,
  "x-vercel-set-bypass-cookie": "true",
}
```

en `use`. Aplica a todas las requests (page.goto, page.request.*).

[scripts/verify-launch.ts](scripts/verify-launch.ts): también añadido `test.beforeEach` que hace primera nav a `bypassUrl(BASE + "/")` con el secret como query param — belt-and-suspenders para que la cookie de bypass quede seteada antes del test real.

Uso:

```
VERCEL_AUTOMATION_BYPASS_SECRET=<vercel-generated-secret> \
BASE_URL=https://adimex-git-fix-pre-lanzam-...vercel.app \
PLAYWRIGHT_CHANNEL=msedge \
npx playwright test --project=chromium
```

**El secret NUNCA se escribe al repo.** `grep -r VERCEL_AUTOMATION_BYPASS_SECRET` sólo devuelve las dos referencias a la variable de entorno.

## Push + preview

Push a `origin/fix/pre-lanzamiento-pauta` @ `08d1d2a`.

**Estado Vercel preview:** ✅ **success** — `Deployment has completed`.

- Preview URL (privada, SSO): `https://adimex-git-fix-pre-lanzam-f633c8-joserams219-gmailcoms-projects.vercel.app` (misma que el branch — Vercel reutiliza el subdominio predecible).
- Panel: `https://vercel.com/joserams219-gmailcoms-projects/adimex/GTqK7sBe9qpmCWU47Bn8auGnWHqD`

Para correr Playwright contra este preview:

```
VERCEL_AUTOMATION_BYPASS_SECRET=<pega el secret de Vercel Settings → Deployment Protection> \
BASE_URL=https://adimex-git-fix-pre-lanzam-f633c8-joserams219-gmailcoms-projects.vercel.app \
PLAYWRIGHT_CHANNEL=msedge \
npx playwright test --project=chromium
```

En Preview → Environment Variables, replicar además `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_PRIVATE_TOKEN`, `META_CAPI_ACCESS_TOKEN`, `META_CAPI_TEST_CODE` (para que CAPI reenvíe con test code), `SHOPIFY_WEBHOOK_SECRET` — sin ellas los flujos comprables + CAPI quedan skipped por diseño.
