# Meta Pixel + Conversions API — Setup ADIMEX

Documento operativo para dejar Meta Pixel 100% funcional en producción.
Cubre lo que ya está en código, lo que hay que configurar en Shopify /
Meta Business Manager, y cómo verificar que todo mide correctamente.

**Pixel ID:** `3413615145484207`

---

## 1. Estado del código

Ya instalado y desplegado:

| Componente | Archivo | Estado |
|---|---|---|
| Categoría "Marketing" en consent | `src/context/cookie-consent-context.tsx` | ✅ v2 |
| Toggle de Marketing en banner | `src/components/cookie-consent-banner.tsx` | ✅ |
| Snippet del pixel gateado | `src/components/meta-pixel.tsx` | ✅ |
| Helper `trackMetaEvent` + `newEventId` + `hashSha256` | `src/lib/meta-pixel.ts` | ✅ |
| `PageView` | Auto en el `init` del pixel | ✅ |
| `ViewContent` en ficha de producto | `src/components/meta-events/view-content.tsx` | ✅ |
| `AddToCart` | `src/components/add-to-cart.tsx` | ✅ |
| `InitiateCheckout` (Comprar ahora) | `src/components/add-to-cart.tsx` | ✅ |
| `InitiateCheckout` (Cart drawer → Ir a pagar) | `src/components/cart-drawer.tsx` | ✅ |
| `Contact` (WhatsApp flotante) | `src/components/whatsapp-button.tsx` | ✅ |
| `Contact` (Blog CTA) | `src/components/blog/whatsapp-cta.tsx` | ✅ |
| `Contact` (Blog product card) | `src/components/blog/wa-quote-button.tsx` | ✅ |
| `Search` (buscador Ctrl+K, debounced 800ms) | `src/components/ui/header-04.tsx` | ✅ |
| API route CAPI | `src/app/api/meta-capi/route.ts` | ✅ (necesita token) |

Eventos que **NO** están automatizados en el navegador:

- **`AddPaymentInfo`** — sucede en el checkout de Shopify, fuera de nuestro dominio. Se cubre con la integración nativa de Meta en Shopify (paso 3).
- **`Purchase`** — mismo caso. Se cubre con: (a) integración nativa de Shopify + (b) webhook a nuestra ruta CAPI para deduplicar y enriquecer con advanced matching.

---

## 2. Variables de entorno requeridas

Añade a `.env.local` en desarrollo y a Vercel Project Settings en producción:

```bash
# Pixel ID (por defecto el que ya está en código; sobreescribir si cambias)
NEXT_PUBLIC_META_PIXEL_ID=3413615145484207

# Token de la Conversions API — se genera en Business Manager:
#   Settings > Data sources > Pixel > Conversions API > Generate access token
META_CAPI_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxx

# (Opcional) Test event code para validar que llegan a Meta antes de
# habilitar el conteo real. Meta lo asigna en Events Manager > Test Events.
META_CAPI_TEST_CODE=TEST1234

# (Opcional) Firma HMAC del webhook de Shopify para verificar autenticidad
SHOPIFY_WEBHOOK_SECRET=xxx
```

---

## 3. Configuración en Shopify

**Objetivo:** que Shopify dispare `AddPaymentInfo` y `Purchase` desde su
checkout con el mismo pixel ID que usamos en nuestro sitio, más un
webhook a nuestra ruta CAPI para deduplicar y mejorar el matching.

### 3.1 Integración nativa (imprescindible)

1. En Shopify Admin → **Sales channels** → **Facebook & Instagram** (si no está instalada, instala la app *Facebook & Instagram by Meta*).
2. Conecta tu Meta Business Manager con la cuenta de Shopify.
3. En la configuración de la app → **Data sharing** selecciona **Enhanced Data Sharing** (envía `AddToCart`, `InitiateCheckout`, `AddPaymentInfo`, `Purchase`).
4. Verifica que el Pixel ID que aparece es `3413615145484207`.
5. En **Signal quality** > **Event details** asegura que Shopify manda emails y teléfonos hasheados.

Con esto Shopify dispara `AddPaymentInfo` y `Purchase` automáticamente
en su thank-you page, con advanced matching básico.

### 3.2 Webhook a nuestra API CAPI (para deduplicar + enriquecer)

1. Shopify Admin → **Settings** → **Notifications** → **Webhooks**.
2. **Create webhook**:
   - Event: `Order creation`
   - Format: `JSON`
   - URL: `https://adimex.io/api/meta-capi`
   - Webhook API version: la más reciente
3. Copia el **Webhook signing secret** que Shopify te muestra y ponlo en Vercel como `SHOPIFY_WEBHOOK_SECRET`.

**Cómo funciona la deduplicación:**

Nuestra ruta usa como `event_id` el string `order_<ID_SHOPIFY>`.
La integración nativa de Shopify también incluye el `event_id`
`order_<ID_SHOPIFY>` en su Purchase browser-side. Meta ve dos eventos
Purchase con el mismo `event_id` (uno de Shopify Pixel, uno de nuestra
CAPI), los deduplica y cuenta una sola compra.

**Ventaja de mandar los dos:** cuando el navegador bloquea cookies de
terceros o Safari corta el pixel, CAPI llega igual con datos hasheados
completos (email, teléfono, nombre, ciudad, código postal). Meta puede
atribuir la compra que el pixel solo hubiera perdido.

---

## 4. Verificación

### 4.1 Meta Events Manager (real time)

1. Business Manager → **Events Manager** → selecciona el pixel `3413615145484207`.
2. Pestaña **Test Events** → introduce tu URL (`https://adimex.io`) y un test event code.
3. Navega el sitio:
   - Acepta cookies (marketing y analytics).
   - Abre una ficha de producto — debería aparecer **ViewContent**.
   - Agrega al carrito — **AddToCart**.
   - Clic en "Ir a pagar" — **InitiateCheckout**.
   - Buscador Ctrl+K con 3+ chars — **Search**.
   - Botón flotante de WhatsApp — **Contact**.
4. Cada evento aparece en Test Events en 2-5 segundos.

### 4.2 CAPI

Antes de conectar el webhook real, prueba con curl:

```bash
curl -X POST https://adimex.io/api/meta-capi \
  -H "Content-Type: application/json" \
  -d '{
    "id": 99999,
    "email": "test@adimex.io",
    "currency": "MXN",
    "total_price": "3445.20",
    "line_items": [
      {"variant_id": 1, "sku": "plc-fl7", "quantity": 1, "price": "3445.20"}
    ],
    "customer": {
      "email": "test@adimex.io",
      "phone": "+525635698469",
      "first_name": "Test",
      "last_name": "User"
    },
    "shipping_address": {
      "city": "Ciudad de México",
      "zip": "01000",
      "country_code": "MX"
    }
  }'
```

Debe responder `{"ok":true, "meta": {"events_received": 1, ...}}`.

Si el `META_CAPI_ACCESS_TOKEN` no está definido, responde `501` sin
romper — el deploy no falla, sólo el evento CAPI se salta.

### 4.3 Match quality

Business Manager → Events Manager → pestaña **Diagnostics** →
**Match quality**. Objetivo: ≥ 7/10 en Purchase.

Si el score sale bajo, revisa:

- Advanced matching hasheado: email, teléfono, nombre, apellido, ciudad, CP y país deben llegar como SHA-256 lowercase. La ruta CAPI ya lo hace; verifica que Shopify envíe email y teléfono al pixel.
- Cookies bloqueadas: Safari ITP. La CAPI compensa esto.
- `event_id` idéntico en pixel y CAPI: si no coincide Meta cuenta doble.

---

## 5. Content IDs y catálogo

Los `content_ids` que mandamos hoy son el **slug del producto** (por ejemplo `plc-fl7`, `hmi-f007n`). Para que el **retargeting dinámico** funcione, el ID debe coincidir con el ID de producto en el **Catálogo de Meta**.

Rutas para alinear:

1. **Fácil (recomendado):** en el catálogo de Meta (Sales Channels → Facebook → Product Catalog), usa el mismo slug de Shopify como identificador.
2. **Si el catálogo usa el SKU de Shopify (ej. `FL721-0808P-D`):** cambia la línea `sku={product.slug}` en `src/app/productos/[slug]/page.tsx` por el SKU de Shopify (`sku={product.shopifyHandle ?? product.slug}` o el campo que corresponda).

Sin alineación no explota nada — pero el "producto visitado / no comprado" no aparecerá en anuncios dinámicos.

---

## 6. Checklist final antes de lanzar campañas

- [ ] `META_CAPI_ACCESS_TOKEN` configurado en Vercel producción
- [ ] `META_CAPI_TEST_CODE` configurado temporalmente para validar
- [ ] Shopify → Facebook & Instagram app instalada y con Enhanced Data Sharing
- [ ] Webhook `orders/create` apuntando a `/api/meta-capi`
- [ ] Test Events muestra los 7 eventos del navegador
- [ ] Purchase de prueba (order test en Shopify) llega tanto por Shopify Pixel como por CAPI, con mismo `event_id`
- [ ] Match quality ≥ 7 en Purchase
- [ ] Catálogo de Meta con IDs alineados a los `content_ids` del sitio
- [ ] `META_CAPI_TEST_CODE` **removido** de producción (para que las conversiones cuenten en tus campañas)

---

*Documento de setup · ADIMEX · Julio 2026 · Actualiza este archivo cuando cambies el pixel ID, agregues eventos o modifiques el catálogo.*
