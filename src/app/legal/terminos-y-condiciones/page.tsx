import type { Metadata } from "next"
import { BreadcrumbSchema } from "@/components/blog/breadcrumb"

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Términos y Condiciones de uso del sitio adimex.io y de compra de productos FLEXEM en México: garantía, envíos, devoluciones y jurisdicción aplicable.",
  alternates: {
    canonical: "https://adimex.io/legal/terminos-y-condiciones",
  },
  robots: { index: true, follow: true },
}

const breadcrumbs = [
  { name: "Inicio", href: "/" },
  { name: "Legal", href: "/legal/terminos-y-condiciones" },
  { name: "Términos y Condiciones", href: "/legal/terminos-y-condiciones" },
]

export default function TerminosCondicionesPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />

      <h1>Términos y Condiciones</h1>
      <p className="text-gray-500! text-xs! font-mono">
        Última actualización: 24 de septiembre de 2026 · Versión 1.1
      </p>

      <p>
        Los presentes Términos y Condiciones (los &quot;Términos&quot;) regulan
        el uso del sitio <a href="https://adimex.io">adimex.io</a> y la
        adquisición de productos y servicios ofrecidos por{" "}
        <strong>American Digital de México, S.A. de C.V.</strong> (&quot;ADIMEX&quot;), en
        su carácter de distribuidor autorizado de la marca FLEXEM en la
        República Mexicana.
      </p>
      <p>
        Al navegar el sitio, crear una cuenta o realizar una compra,
        confirmas haber leído, entendido y aceptado estos Términos. Si no
        estás de acuerdo con alguna disposición, te pedimos abstenerte de
        usar el sitio.
      </p>

      <h2>1. Definiciones</h2>
      <ul>
        <li>
          <strong>Sitio:</strong> el portal accesible en el dominio adimex.io
          y sus subdominios.
        </li>
        <li>
          <strong>Usuario:</strong> toda persona física o moral que accede al
          sitio o realiza una compra.
        </li>
        <li>
          <strong>Cliente:</strong> el Usuario que perfecciona una orden de
          compra con ADIMEX.
        </li>
        <li>
          <strong>Producto:</strong> equipos FLEXEM (PLC, HMI, servos, SCADA,
          IoT), accesorios, refacciones y licencias de software
          comercializados por ADIMEX.
        </li>
        <li>
          <strong>Servicios:</strong> ingeniería, integración, capacitación,
          puesta en marcha y soporte técnico.
        </li>
      </ul>

      <h2>2. Capacidad legal</h2>
      <p>
        Para contratar con ADIMEX debes ser mayor de edad y contar con
        capacidad legal en términos del Código Civil Federal. Si contratas
        en representación de una persona moral, declaras contar con
        facultades suficientes y bastantes para obligarla.
      </p>

      <h2>3. Cuenta de usuario</h2>
      <p>
        El registro es opcional y facilita el seguimiento de pedidos y
        cotizaciones. Eres responsable de:
      </p>
      <ul>
        <li>Proporcionar información veraz y actualizada.</li>
        <li>
          Conservar la confidencialidad de tus credenciales de acceso.
        </li>
        <li>
          Todas las actividades ejecutadas bajo tu cuenta, salvo caso
          fortuito o fuerza mayor debidamente acreditados.
        </li>
      </ul>
      <p>
        ADIMEX puede suspender o cancelar cuentas cuando detecte uso
        indebido, información falsa o incumplimiento a estos Términos.
      </p>

      <h2>4. Productos, precios y disponibilidad</h2>
      <p>
        Los productos con precio visible en el sitio se comercializan bajo
        la modalidad de compra directa (e-commerce). Los productos sin
        precio visible operan bajo pedido y requieren cotización formal.
      </p>
      <ul>
        <li>
          Los precios están expresados en <strong>pesos mexicanos (MXN)</strong>{" "}
          e incluyen IVA cuando así se indique.
        </li>
        <li>
          La disponibilidad se actualiza en tiempo real; sin embargo, puede
          existir desfase por operaciones concurrentes. En caso de
          agotarse un producto luego de confirmada tu orden, contactaremos
          contigo para reprogramar la entrega o reembolsar el monto pagado.
        </li>
        <li>
          Nos reservamos el derecho de modificar precios y catálogo sin
          aviso previo; los cambios no aplican a órdenes ya confirmadas.
        </li>
      </ul>

      <h2>5. Proceso de compra</h2>
      <ol>
        <li>El Usuario selecciona los productos y confirma su orden.</li>
        <li>
          El sistema envía correo de acuse con folio de pedido y detalle.
        </li>
        <li>
          Una vez validado el pago, ADIMEX prepara el envío en los tiempos
          descritos en la sección 7.
        </li>
        <li>
          Al recibir la mercancía, el Cliente firma de conformidad; se
          recomienda inspeccionar el empaque antes de firmar.
        </li>
      </ol>

      <h2>6. Formas de pago y facturación</h2>
      <p>
        Aceptamos tarjeta de crédito/débito, transferencia SPEI, y —para
        clientes con línea de crédito autorizada— pago a crédito con
        condiciones pactadas por escrito. Los pagos se procesan a través
        de proveedores certificados (Shopify Payments, Stripe, Mercado
        Pago). ADIMEX no almacena datos completos de tarjetas.
      </p>
      <p>
        Emitimos CFDI 4.0 con el uso y régimen fiscal que declares al
        momento de la compra. La factura se envía al correo electrónico
        proporcionado dentro de los tres días hábiles posteriores a la
        confirmación del pago.
      </p>

      <h2>7. Envíos</h2>
      <ul>
        <li>
          <strong>Cobertura:</strong> todo el territorio nacional. Envíos
          internacionales bajo cotización específica.
        </li>
        <li>
          <strong>Tiempo estimado (SKUs en stock):</strong> 3 a 5 días
          hábiles a partir de la confirmación del pago.
        </li>
        <li>
          <strong>Tiempo estimado (bajo pedido):</strong> entre 4 y 8
          semanas conforme al modelo y volumen.
        </li>
        <li>
          <strong>Costo:</strong> se calcula al finalizar la compra según
          peso, volumen y destino.
        </li>
        <li>
          <strong>Riesgo:</strong> la propiedad y el riesgo se transfieren
          al Cliente al momento de la entrega en el domicilio indicado.
        </li>
      </ul>

      <h2 id="devoluciones">8. Política de Devoluciones</h2>

      <h3>8.1. Alcance</h3>
      <p>
        Esta política aplica a toda compra de productos realizada a
        través del sitio adimex.io, incluyendo pedidos pagados en línea
        y pedidos bajo cotización. No aplica a servicios de ingeniería,
        capacitación, puesta en marcha, licencias de software activadas
        ni a órdenes con configuración o programación personalizada
        (ver sección 8.6).
      </p>

      <h3>8.2. Derecho de retracto (5 días hábiles)</h3>
      <p>
        En cumplimiento del artículo 56 de la{" "}
        <strong>Ley Federal de Protección al Consumidor</strong>, el
        Cliente puede cancelar la operación y solicitar reembolso total
        sin necesidad de justificar su decisión dentro de los{" "}
        <strong>5 días hábiles</strong> posteriores a la entrega del
        producto, siempre que éste no haya sido usado y se mantenga en
        su empaque original. El reembolso se procesa por el mismo medio
        de pago utilizado.
      </p>

      <h3>8.3. Plazo comercial extendido (30 días naturales)</h3>
      <p>
        Como política comercial adicional al derecho de retracto,
        ADIMEX acepta devoluciones dentro de los{" "}
        <strong>30 días naturales</strong> posteriores a la entrega
        siempre que:
      </p>
      <ul>
        <li>El producto esté en su empaque original, sellado o reempaquetado sin daños.</li>
        <li>Se incluyan todos los accesorios, manuales y componentes recibidos.</li>
        <li>El producto no muestre señales de uso, instalación ni programación.</li>
        <li>Se presente la factura CFDI 4.0 de la operación.</li>
      </ul>

      <h3>8.4. Proceso para solicitar devolución (RMA)</h3>
      <ol>
        <li>
          Escribe a <a href="mailto:devoluciones@adimex.io">devoluciones@adimex.io</a>{" "}
          — o si prefieres, a <a href="mailto:contacto@adimex.io">contacto@adimex.io</a> —
          indicando folio de la orden, SKU, motivo de la devolución y
          fotografías del producto y del empaque recibidos.
        </li>
        <li>
          ADIMEX responde en un plazo máximo de <strong>2 días hábiles</strong>{" "}
          con un número de autorización de devolución (RMA) y las
          instrucciones de envío.
        </li>
        <li>
          Empaca el producto con el RMA visible en el exterior y envíalo
          a la dirección que te indiquemos dentro de los{" "}
          <strong>10 días hábiles</strong> siguientes a la emisión del
          RMA. Las devoluciones recibidas sin RMA pueden ser rechazadas.
        </li>
        <li>
          Al recibir la mercancía, ADIMEX inspecciona en un plazo máximo
          de <strong>5 días hábiles</strong> y comunica el resultado
          (aprobación, rechazo o solicitud de información adicional) por
          correo.
        </li>
      </ol>

      <h3>8.5. Costos de envío y reembolso</h3>
      <ul>
        <li>
          <strong>Causa atribuible a ADIMEX</strong> (producto equivocado,
          defecto de fábrica detectado al desempacar, daño en tránsito con
          empaque intacto, descripción incorrecta en el sitio): el costo
          de la devolución corre por cuenta de ADIMEX. Enviamos guía
          prepagada o reembolsamos el costo de la mensajería.
        </li>
        <li>
          <strong>Cambio de opinión o selección incorrecta por el Cliente</strong>{" "}
          (dentro del plazo comercial de 30 días): el costo de envío de
          la devolución corre por cuenta del Cliente. Se descuenta además
          del reembolso el costo original de envío si éste fue bonificado
          por promoción.
        </li>
        <li>
          <strong>Plazo del reembolso:</strong> una vez aprobada la
          devolución, el reembolso se procesa en un máximo de{" "}
          <strong>10 días hábiles</strong>. Para tarjeta de crédito o
          débito el abono puede tardar 1 a 2 ciclos de corte adicionales
          según tu banco emisor. Para transferencia SPEI se reembolsa a
          la misma cuenta ordenante.
        </li>
      </ul>

      <h3>8.6. Casos no sujetos a devolución</h3>
      <p>
        Por su naturaleza, los siguientes productos y servicios{" "}
        <strong>no admiten devolución</strong>, salvo defecto de fábrica
        cubierto por la garantía (ver sección 9):
      </p>
      <ul>
        <li>
          Productos configurados o programados a solicitud del Cliente
          (ej. parámetros preestablecidos en PLC o HMI).
        </li>
        <li>Licencias de software activadas o descargadas.</li>
        <li>
          Refacciones y módulos de reemplazo cuando el equipo original
          haya sido manipulado o la instalación hubiere sido incorrecta.
        </li>
        <li>
          Productos con daños derivados de manejo posterior a la entrega,
          instalación fuera de las especificaciones del datasheet o
          alteración del sello de fábrica.
        </li>
        <li>
          Pedidos de productos bajo pedido o fabricación especial
          después de iniciada su producción, salvo cancelación dentro de
          las 24 horas posteriores a la confirmación del anticipo.
        </li>
      </ul>

      <h3>8.7. Producto dañado al recibirlo</h3>
      <p>
        Inspecciona el empaque antes de firmar la carta porte. Si
        detectas daño visible (caja aplastada, perforaciones, sello
        roto), anótalo en el comprobante de entrega y notifícanos dentro
        de las <strong>24 horas siguientes</strong> adjuntando
        fotografías. Daños reportados fuera de este plazo pueden ser
        considerados daños de uso y no proceden como devolución, aunque
        podrás escalarlos vía garantía si aplica.
      </p>

      <h3>8.8. Cambios de producto</h3>
      <p>
        Si prefieres cambiar el producto por uno de modelo distinto en
        lugar de solicitar reembolso, indícalo en el correo inicial de
        RMA. El procedimiento es el mismo; la diferencia en precio se
        cobra o reembolsa según corresponda.
      </p>

      <h3>8.9. Contacto</h3>
      <p>
        Para cualquier aclaración sobre esta política escribe a{" "}
        <a href="mailto:devoluciones@adimex.io">devoluciones@adimex.io</a>{" "}
        o llama a nuestro WhatsApp de atención a clientes. Para
        inconformidades no resueltas puedes acudir a la{" "}
        <strong>Procuraduría Federal del Consumidor (PROFECO)</strong>:{" "}
        <a href="https://www.gob.mx/profeco" target="_blank" rel="noopener noreferrer">
          gob.mx/profeco
        </a>.
      </p>

      <h2>9. Garantía</h2>
      <p>
        Los productos FLEXEM comercializados por ADIMEX cuentan con la
        garantía original del fabricante por defectos de manufactura,
        con vigencia estándar de <strong>12 meses</strong> a partir de la
        fecha de facturación, salvo indicación distinta en el datasheet.
      </p>
      <p>La garantía queda sin efecto cuando el equipo:</p>
      <ul>
        <li>Sufre daño por descargas eléctricas o transitorios externos.</li>
        <li>
          Se instala fuera de las condiciones ambientales (temperatura,
          humedad, grado de protección) del datasheet.
        </li>
        <li>Presenta modificaciones físicas o de firmware no autorizadas.</li>
        <li>Es reparado por terceros no autorizados por FLEXEM o ADIMEX.</li>
      </ul>
      <p>
        Para hacer efectiva la garantía, el Cliente debe abrir un ticket
        con descripción del incidente, fotografías y factura. ADIMEX
        diagnostica localmente o escala al fabricante. El reemplazo o la
        reparación no extienden el plazo original.
      </p>

      <h2>10. Servicios de ingeniería</h2>
      <p>
        Los proyectos llave en mano, capacitaciones y consultorías se
        rigen por propuesta técnica-comercial específica que forma parte
        integral de estos Términos. La aceptación de la propuesta se
        formaliza mediante orden de compra o firma electrónica.
      </p>

      <h2>11. Propiedad intelectual</h2>
      <p>
        Todos los contenidos del sitio (textos, imágenes, videos, código,
        diseño y marcas) son propiedad de ADIMEX o se usan con
        autorización de sus titulares. Se prohíbe la reproducción parcial
        o total sin consentimiento previo por escrito. La marca FLEXEM y
        sus derivados son propiedad de FLEXEM Technology Co., Ltd. y se
        usan bajo licencia como distribuidor autorizado.
      </p>

      <h2>12. Enlaces a terceros</h2>
      <p>
        El sitio puede incluir enlaces a portales de terceros (p.ej. redes
        sociales, catálogos oficiales del fabricante). ADIMEX no controla
        ni asume responsabilidad por su contenido, políticas de privacidad
        o prácticas.
      </p>

      <h2>13. Limitación de responsabilidad</h2>
      <p>
        Salvo dolo o culpa grave debidamente acreditada, la
        responsabilidad de ADIMEX se limita al monto efectivamente pagado
        por el Cliente por el producto o servicio que dio origen a la
        reclamación. En ningún caso ADIMEX es responsable por daños
        indirectos, lucro cesante, pérdida de datos o interrupción de la
        operación derivada del uso del producto.
      </p>

      <h2>14. Fuerza mayor</h2>
      <p>
        ADIMEX no será responsable por retrasos o incumplimientos
        derivados de eventos de fuerza mayor o caso fortuito (huelgas,
        desastres naturales, restricciones sanitarias, interrupciones de
        transporte internacional, entre otros).
      </p>

      <h2>15. Modificaciones</h2>
      <p>
        ADIMEX puede modificar estos Términos en cualquier momento. La
        versión vigente será la publicada en{" "}
        <a href="https://adimex.io/legal/terminos-y-condiciones">
          adimex.io/legal/terminos-y-condiciones
        </a>
        . Las órdenes en curso se rigen por la versión aplicable al
        momento de su confirmación.
      </p>

      <h2>16. Jurisdicción y legislación aplicable</h2>
      <p>
        Estos Términos se rigen por la legislación mexicana federal. Para
        la interpretación y cumplimiento, las partes se someten
        expresamente a la jurisdicción de los tribunales competentes de
        la Ciudad de México, renunciando a cualquier otro fuero que
        pudiera corresponderles.
      </p>
      <p>
        En materia de consumo, aplican adicionalmente las disposiciones
        de la Ley Federal de Protección al Consumidor y la competencia de
        la Procuraduría Federal del Consumidor (PROFECO).
      </p>

      <hr />

      <p className="text-xs! text-gray-400!">
        Estos Términos deben ser revisados por asesoría legal antes de
        considerarse versión definitiva. Se recomienda registrar los
        precios y catálogo publicados en el Portal Único del Consumidor
        (PROFECO) cuando aplique.
      </p>
    </>
  )
}
