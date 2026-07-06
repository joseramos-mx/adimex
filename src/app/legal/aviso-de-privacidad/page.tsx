import type { Metadata } from "next"
import { BreadcrumbSchema } from "@/components/blog/breadcrumb"

export const metadata: Metadata = {
  title: "Aviso de Privacidad",
  description:
    "Aviso de Privacidad Integral de ADIMEX conforme a la LFPDPPP: qué datos personales recabamos, para qué los usamos y cómo ejercer tus derechos ARCO.",
  alternates: {
    canonical: "https://adimex.io/legal/aviso-de-privacidad",
  },
  robots: { index: true, follow: true },
}

const breadcrumbs = [
  { name: "Inicio", href: "/" },
  { name: "Legal", href: "/legal/aviso-de-privacidad" },
  { name: "Aviso de Privacidad", href: "/legal/aviso-de-privacidad" },
]

export default function AvisoPrivacidadPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />

      <h1>Aviso de Privacidad Integral</h1>
      <p className="!text-white/40 !text-xs font-mono">
        Última actualización: 6 de julio de 2026 · Versión 1.0
      </p>

      <p>
        El presente Aviso de Privacidad se emite en cumplimiento de lo
        dispuesto en la Ley Federal de Protección de Datos Personales en
        Posesión de los Particulares (LFPDPPP), su Reglamento y los
        lineamientos emitidos por el INAI. Antes de proporcionar tus datos
        personales, te pedimos leerlo con atención.
      </p>

      <h2>1. Identidad y domicilio del responsable</h2>
      <p>
        <strong>American Digital de México, S.A. de C.V.</strong> (en lo
        sucesivo, &quot;ADIMEX&quot;), con domicilio en Ciudad de México,
        México, es el responsable del tratamiento de tus datos personales.
      </p>
      <p>
        Para efectos legales, cualquier notificación puede dirigirse al
        correo electrónico{" "}
        <a href="mailto:contacto@adimex.io">contacto@adimex.io</a> o al
        domicilio de nuestras oficinas comerciales dentro del territorio
        mexicano.
      </p>

      <h2>2. Datos personales que recabamos</h2>
      <p>
        Para las finalidades que se describen más adelante, ADIMEX puede
        recabar las siguientes categorías de datos:
      </p>
      <ul>
        <li>
          <strong>Datos de identificación:</strong> nombre completo, RFC,
          teléfono, correo electrónico, cargo y empresa a la que representas.
        </li>
        <li>
          <strong>Datos de contacto comercial:</strong> domicilio fiscal y de
          envío, régimen fiscal, medio de contacto preferente.
        </li>
        <li>
          <strong>Datos financieros y transaccionales:</strong> medio de pago
          empleado, montos, historial de compra y facturación.
        </li>
        <li>
          <strong>Datos técnicos de navegación:</strong> dirección IP,
          identificador de dispositivo, páginas visitadas, tiempo de sesión y
          fuente de tráfico (recopilados vía cookies y herramientas de
          analítica).
        </li>
      </ul>
      <p>
        No recabamos datos personales sensibles en los términos del artículo
        3, fracción VI de la LFPDPPP.
      </p>

      <h2>3. Finalidades del tratamiento</h2>
      <h3>3.1 Finalidades primarias</h3>
      <p>Necesarias para la relación jurídica contigo:</p>
      <ul>
        <li>
          Procesar cotizaciones, pedidos, contratos, entregas y facturación
          (CFDI 4.0).
        </li>
        <li>
          Brindar soporte técnico, garantía y atención posventa a los
          productos FLEXEM y complementarios.
        </li>
        <li>
          Gestionar tu cuenta de usuario, historial de compras y sesión en el
          sitio.
        </li>
        <li>Cumplir con obligaciones fiscales, contables y regulatorias.</li>
        <li>
          Prevenir y detectar fraudes, incidentes de seguridad y usos abusivos
          de la plataforma.
        </li>
      </ul>

      <h3>3.2 Finalidades secundarias</h3>
      <p>
        No son necesarias para la relación jurídica y puedes oponerte en
        cualquier momento sin afectar tu operación con nosotros:
      </p>
      <ul>
        <li>Envío de boletín, novedades técnicas y contenido educativo.</li>
        <li>
          Invitaciones a webinars, capacitaciones, ferias y eventos de la
          industria.
        </li>
        <li>Mediciones de satisfacción y encuestas de mercado.</li>
        <li>
          Segmentación para publicidad personalizada en redes sociales y
          plataformas de terceros.
        </li>
      </ul>
      <p>
        Si no deseas que tus datos se usen para las finalidades secundarias,
        envía un correo a{" "}
        <a href="mailto:contacto@adimex.io">contacto@adimex.io</a>{" "}
        indicando explícitamente tu negativa.
      </p>

      <h2>4. Transferencias de datos</h2>
      <p>
        ADIMEX puede transferir tus datos, sin requerir tu consentimiento
        adicional cuando así lo permite la Ley, a los siguientes terceros:
      </p>
      <ul>
        <li>
          <strong>Autoridades competentes</strong> (SAT, INAI, PROFECO,
          fiscales) cuando exista requerimiento fundado y motivado.
        </li>
        <li>
          <strong>Proveedores de servicios en la nube</strong> (Vercel Inc.,
          Sanity.io ApS, Google Cloud) para hospedaje, base de datos y
          analítica, bajo cláusulas contractuales que garantizan el mismo
          nivel de protección.
        </li>
        <li>
          <strong>Plataforma de e-commerce</strong> (Shopify Inc.) para el
          procesamiento del pedido y del pago.
        </li>
        <li>
          <strong>Procesadores de pago</strong> autorizados (Shopify Payments,
          Stripe, Mercado Pago) para la ejecución de la operación
          transaccional.
        </li>
        <li>
          <strong>Empresas de mensajería y paquetería</strong> para la
          entrega de los productos adquiridos.
        </li>
        <li>
          <strong>El fabricante FLEXEM</strong> únicamente cuando la garantía
          escale al soporte de ingeniería en fábrica.
        </li>
      </ul>
      <p>
        Algunas de estas transferencias implican envío internacional de
        datos, incluyendo Estados Unidos, Canadá y la Unión Europea. Todas
        se rigen por contratos de tratamiento de datos con cláusulas
        equivalentes a las exigidas por la LFPDPPP.
      </p>

      <h2>5. Ejercicio de derechos ARCO</h2>
      <p>
        Tienes derecho a acceder, rectificar, cancelar u oponerte al
        tratamiento de tus datos personales (derechos ARCO), así como a
        revocar el consentimiento otorgado. Para ejercerlos:
      </p>
      <ol>
        <li>
          Envía tu solicitud al correo{" "}
          <a href="mailto:contacto@adimex.io">contacto@adimex.io</a> con el
          asunto <code>Solicitud ARCO</code>.
        </li>
        <li>
          Adjunta identificación oficial vigente y describe con claridad los
          datos y el derecho que ejerces.
        </li>
        <li>
          Responderemos en un plazo máximo de <strong>20 días hábiles</strong>{" "}
          y, de proceder, la haremos efectiva en los <strong>15 días</strong>{" "}
          hábiles siguientes.
        </li>
      </ol>
      <p>
        La cancelación del tratamiento no procede en los supuestos previstos
        en el artículo 26 de la LFPDPPP (obligaciones legales pendientes,
        investigaciones sancionadoras, etc.).
      </p>

      <h2>6. Medios para limitar el uso o divulgación</h2>
      <p>
        Puedes solicitar tu inclusión en un listado de exclusión interno
        escribiendo a <a href="mailto:contacto@adimex.io">contacto@adimex.io</a>.
        Adicionalmente, puedes inscribirte en el Registro Público para Evitar
        Publicidad (REPEP) de la PROFECO en{" "}
        <a
          href="https://repep.profeco.gob.mx"
          target="_blank"
          rel="noopener noreferrer"
        >
          repep.profeco.gob.mx
        </a>
        .
      </p>

      <h2>7. Cookies y tecnologías similares</h2>
      <p>
        Utilizamos cookies propias y de terceros para operar el sitio,
        recordar tus preferencias (idioma, región, carrito) y analizar el
        uso agregado. Para el detalle completo consulta nuestra{" "}
        <a href="/legal/politica-de-cookies">Política de Cookies</a>. Puedes
        desactivarlas desde la configuración de tu navegador.
      </p>

      <h2>8. Medidas de seguridad</h2>
      <p>
        Aplicamos medidas administrativas, físicas y técnicas razonables
        para proteger tus datos contra pérdida, uso indebido o alteración:
        cifrado TLS en tránsito, control de accesos por rol, respaldos
        periódicos y auditoría de proveedores. Ningún sistema es
        infalible; en caso de una vulneración que afecte tus datos, te
        notificaremos conforme al artículo 20 de la LFPDPPP.
      </p>

      <h2>9. Cambios al aviso</h2>
      <p>
        Cualquier modificación se publicará en{" "}
        <a href="https://adimex.io/legal/aviso-de-privacidad">
          adimex.io/legal/aviso-de-privacidad
        </a>
        , indicando la fecha de la última actualización. Si el cambio
        implica un nuevo tratamiento, te lo comunicaremos por el medio de
        contacto que tengamos registrado.
      </p>

      <h2>10. INAI</h2>
      <p>
        Si consideras que tu derecho a la protección de datos personales ha
        sido vulnerado, puedes acudir al Instituto Nacional de
        Transparencia, Acceso a la Información y Protección de Datos
        Personales (INAI) en{" "}
        <a
          href="https://home.inai.org.mx"
          target="_blank"
          rel="noopener noreferrer"
        >
          home.inai.org.mx
        </a>
        .
      </p>

      <hr />

      <p className="!text-xs !text-white/40">
        Este Aviso de Privacidad debe ser revisado por asesoría legal antes
        de ser considerado versión definitiva y firmada por el responsable.
        Los datos de identificación de ADIMEX (RFC, domicilio fiscal
        completo y representante legal) deben completarse conforme al acta
        constitutiva vigente.
      </p>
    </>
  )
}
