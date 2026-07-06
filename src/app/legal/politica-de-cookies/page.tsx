import type { Metadata } from "next"
import { BreadcrumbSchema } from "@/components/blog/breadcrumb"

export const metadata: Metadata = {
  title: "Política de Cookies",
  description:
    "Política de Cookies de adimex.io: qué cookies usamos, para qué, cuánto duran y cómo desactivarlas desde tu navegador.",
  alternates: {
    canonical: "https://adimex.io/legal/politica-de-cookies",
  },
  robots: { index: true, follow: true },
}

const breadcrumbs = [
  { name: "Inicio", href: "/" },
  { name: "Legal", href: "/legal/politica-de-cookies" },
  { name: "Política de Cookies", href: "/legal/politica-de-cookies" },
]

export default function PoliticaCookiesPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />

      <h1>Política de Cookies</h1>
      <p className="text-gray-500! text-xs! font-mono">
        Última actualización: 6 de julio de 2026 · Versión 1.0
      </p>

      <p>
        En <a href="https://adimex.io">adimex.io</a> utilizamos cookies y
        tecnologías similares para operar el sitio, recordar tus
        preferencias y medir el uso agregado. Esta política complementa
        el <a href="/legal/aviso-de-privacidad">Aviso de Privacidad</a> y
        detalla qué archivos guardamos en tu navegador y para qué.
      </p>

      <h2>1. Qué es una cookie</h2>
      <p>
        Una cookie es un pequeño archivo de texto que un sitio web
        almacena en tu navegador. Sirve para recordar información entre
        visitas (idioma, sesión iniciada, carrito de compra) o para
        entender cómo se usa el sitio. La mayoría de los navegadores
        modernos permiten aceptarlas, rechazarlas o eliminarlas desde su
        configuración.
      </p>

      <h2>2. Categorías de cookies que usamos</h2>

      <h3>2.1 Cookies estrictamente necesarias</h3>
      <p>
        Indispensables para que el sitio funcione. Sin ellas no puedes
        iniciar sesión ni completar una compra.
      </p>
      <ul>
        <li>
          <code>__session</code>, <code>cart</code> — mantienen tu carrito
          y sesión de compra.
        </li>
        <li>
          <code>region</code> — recuerda si operas en modalidad México o
          Estados Unidos (afecta precios y moneda).
        </li>
        <li>
          <code>theme</code> — recuerda tu preferencia de tema visual.
        </li>
      </ul>

      <h3>2.2 Cookies de rendimiento y analítica</h3>
      <p>
        Nos ayudan a entender qué páginas se visitan más, qué contenidos
        funcionan mejor y dónde hay fricción. Los datos se agregan; no te
        identifican individualmente.
      </p>
      <ul>
        <li>
          <strong>Vercel Analytics</strong> — mide visitas y desempeño de
          las páginas. No usa cookies persistentes; funciona con
          identificadores efímeros por sesión.
        </li>
        <li>
          <strong>Vercel Speed Insights</strong> — mide Core Web Vitals
          reales de usuarios para optimizar la velocidad del sitio.
        </li>
      </ul>

      <h3>2.3 Cookies de terceros</h3>
      <p>
        Establecidas por servicios externos que integramos al sitio:
      </p>
      <ul>
        <li>
          <strong>Shopify</strong> — cookies para procesar el pago y
          detectar fraude (<code>_shopify_*</code>).
        </li>
        <li>
          <strong>Sanity</strong> — sólo se activan cuando accedes al
          panel administrativo <code>/studio</code>.
        </li>
        <li>
          <strong>WhatsApp Business</strong> — al abrir el botón flotante
          se te dirige al ecosistema de Meta, que utiliza sus propias
          cookies conforme a su política.
        </li>
      </ul>

      <h2>3. Cómo controlar y desactivar cookies</h2>
      <p>
        Puedes gestionar las cookies desde la configuración de tu
        navegador. Los enlaces oficiales:
      </p>
      <ul>
        <li>
          <a
            href="https://support.google.com/chrome/answer/95647?hl=es"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Chrome
          </a>
        </li>
        <li>
          <a
            href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mozilla Firefox
          </a>
        </li>
        <li>
          <a
            href="https://support.apple.com/es-mx/guide/safari/sfri11471/mac"
            target="_blank"
            rel="noopener noreferrer"
          >
            Safari
          </a>
        </li>
        <li>
          <a
            href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft Edge
          </a>
        </li>
      </ul>
      <p>
        Ten en cuenta que si deshabilitas las cookies estrictamente
        necesarias, algunas funciones del sitio pueden dejar de operar
        correctamente (por ejemplo, no podrás mantener sesión ni finalizar
        una compra).
      </p>

      <h2>4. Cookies de publicidad</h2>
      <p>
        Al día de hoy <strong>adimex.io no ejecuta píxeles de publicidad</strong>{" "}
        (Meta Pixel, Google Ads, LinkedIn Insight, TikTok Pixel u otros).
        Si en el futuro habilitamos alguno, actualizaremos esta política y
        te lo notificaremos mediante un banner de consentimiento previo.
      </p>

      <h2>5. Cambios a esta política</h2>
      <p>
        Cualquier modificación se publicará en{" "}
        <a href="https://adimex.io/legal/politica-de-cookies">
          adimex.io/legal/politica-de-cookies
        </a>
        , indicando la fecha de la última actualización.
      </p>

      <h2>6. Contacto</h2>
      <p>
        Si tienes dudas sobre esta política o el tratamiento de tus
        datos, escríbenos a{" "}
        <a href="mailto:contacto@adimex.io">contacto@adimex.io</a>.
      </p>

      <hr />

      <p className="text-xs! text-gray-400!">
        Esta política se debe revisar cada vez que se agregue una nueva
        integración de terceros o herramienta de analítica.
      </p>
    </>
  )
}
