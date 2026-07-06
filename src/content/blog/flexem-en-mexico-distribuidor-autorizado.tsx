import type { BlogPost } from "./types"
import BlogProductCard from "@/components/blog/product-card"
import BlogWhatsAppCTA from "@/components/blog/whatsapp-cta"
import {
  P,
  H2,
  H3,
  UL,
  OL,
  LI,
  A,
  Strong,
  Callout,
  SpecTable,
} from "@/components/blog/prose"

export const post: BlogPost = {
  slug: "flexem-en-mexico-distribuidor-autorizado",
  title:
    "Flexem en México: distribuidor autorizado, garantía, soporte y tiempos de entrega",
  excerpt:
    "Somos el distribuidor autorizado de FLEXEM en México. Explicamos cómo funciona la garantía, el soporte técnico en español y los tiempos de entrega reales de PLC, HMI y servos.",
  description:
    "Todo lo que necesitas saber antes de comprar equipo FLEXEM en México — distribución oficial, garantía del fabricante, soporte de ingeniería local y tiempos de entrega verificables.",
  cluster: "transaccional",
  category: "Distribución oficial",
  publishedAt: "2026-07-06",
  author: "Equipo técnico ADIMEX",
  readingMinutes: 8,
  focusKeyword: "flexem méxico",
  cover: {
    src: "https://images.pexels.com/photos/10871565/pexels-photo-10871565.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Operadores trabajando con maquinaria industrial en planta mexicana",
  },
  relatedProductSlugs: ["plc-fl7", "hmi-f007n", "productos-hmi-f110"],
  relatedPostSlugs: [
    "guia-compra-plc-flexem-fl7",
    "hmi-flexem-f007n-vs-f110c",
    "cuanto-cuesta-automatizar-maquina-mexico-2026",
  ],
  whatsappContext:
    "quiero cotizar equipo FLEXEM y verificar tiempos de entrega en México.",
  faq: [
    {
      q: "¿ADIMEX es distribuidor autorizado oficial de FLEXEM en México?",
      a: "Sí. American Digital de México (ADIMEX) es el distribuidor autorizado de FLEXEM para el territorio mexicano. Manejamos catálogo oficial, garantía del fabricante y soporte técnico en español.",
    },
    {
      q: "¿La garantía de fábrica de FLEXEM aplica igual comprando en México?",
      a: "Sí. Todos los productos FLEXEM comprados a ADIMEX vienen con la garantía original del fabricante (12 meses estándar en electrónica industrial), tramitada localmente sin necesidad de exportar equipo dañado a China.",
    },
    {
      q: "¿Cuánto tarda una entrega de PLC o HMI FLEXEM en México?",
      a: "Los SKUs de mayor demanda (PLC FL721-0808P-D, HMI F007N, HMI F110) los tenemos en almacén con envío nacional en 3-5 días hábiles. El catálogo bajo pedido tarda entre 4 y 8 semanas dependiendo del modelo y el volumen.",
    },
    {
      q: "¿Ofrecen soporte técnico en español para Flexem Studio y FlexSCADA?",
      a: "Sí. Nuestro equipo de ingeniería resuelve consultas de programación, comunicación Modbus/EtherCAT, configuración de HMI y arquitectura SCADA en español, con la misma metodología que aplicamos en integraciones para FEMSA, Atlas Copco y City Express.",
    },
    {
      q: "¿Pueden facturar en pesos mexicanos con IVA desglosado?",
      a: "Sí. Facturamos en MXN con IVA desglosado y CFDI 4.0. Los precios visibles en la tienda ya incluyen IVA y aplican para clientes con RFC en México.",
    },
  ],
  Body: () => (
    <>
      <P>
        Si buscas “Flexem México” en Google es probable que estés en uno de tres
        escenarios: ya tienes un equipo FLEXEM y necesitas soporte, estás
        evaluando la marca para un proyecto nuevo, o quieres validar que el
        proveedor con quien piensas cotizar es realmente el canal oficial. Este
        artículo responde las tres cosas, sin promesas de folleto.
      </P>

      <Callout title="Resumen ejecutivo">
        ADIMEX (<Strong>American Digital de México</Strong>) es el distribuidor
        autorizado FLEXEM para México. Facturamos en pesos, cubrimos garantía
        del fabricante en territorio nacional, sostenemos soporte técnico en
        español y mantenemos stock de los SKUs de mayor rotación (PLC FL7, HMI
        F007N, HMI F110) para envío en 3-5 días hábiles.
      </Callout>

      <H2 id="quien-distribuye">Quién distribuye FLEXEM en México</H2>
      <P>
        FLEXEM es un fabricante chino con foco en automatización industrial:
        PLCs CODESYS, HMI capacitivas, servos, IoT gateways y la plataforma
        FlexSCADA/FlexCloud. Su presencia comercial en Latinoamérica se
        canaliza a través de distribuidores autorizados por región, no de una
        subsidiaria propia. Para México, ese canal es{" "}
        <A href="/">ADIMEX</A>.
      </P>
      <P>
        Trabajar con el distribuidor autorizado no es un formalismo: implica
        acceso a listas de precios oficiales, capacitación técnica directa del
        fabricante, y —lo más importante— la posibilidad de escalar un ticket
        de soporte al equipo de ingeniería en fábrica cuando el problema
        excede lo que se resuelve en una llamada de una hora.
      </P>

      <H3>Cómo verificar que un proveedor es canal oficial</H3>
      <OL>
        <LI>
          Solicita una <Strong>carta de distribución vigente</Strong> emitida
          por FLEXEM o su representación regional. No es un documento
          confidencial; los canales serios la comparten.
        </LI>
        <LI>
          Confirma que el número de parte que te cotizan aparece en el
          catálogo oficial (
          <A href="https://es.flexem.com" external>
            es.flexem.com
          </A>
          ). Los proveedores paralelos suelen ofrecer códigos “equivalentes”
          que no son idénticos y no aplican para garantía original.
        </LI>
        <LI>
          Pide que el equipo llegue con etiqueta original de fábrica y número
          de serie escaneable. Los clones se distinguen ahí.
        </LI>
      </OL>

      <H2 id="garantia">Cómo funciona la garantía en México</H2>
      <P>
        La política estándar de FLEXEM para equipos electrónicos industriales
        es de <Strong>12 meses</Strong> a partir de la fecha de facturación,
        contra defectos de fabricación. En automatización industrial rara vez
        conviene extender ese plazo con un seguro caro: los equipos que fallan
        lo hacen dentro de las primeras 48 horas de operación o dentro del
        primer año.
      </P>

      <SpecTable
        headers={["Escenario", "Cómo se resuelve", "Tiempo típico"]}
        rows={[
          [
            "DOA (falla en el primer arranque)",
            "Reemplazo inmediato desde nuestro stock, sin costo. No requiere diagnóstico previo del fabricante.",
            "24-72 horas",
          ],
          [
            "Falla dentro de los 12 meses",
            "Diagnóstico local por ingeniería ADIMEX. Si aplica garantía, gestionamos reemplazo o reparación con FLEXEM.",
            "3-15 días hábiles",
          ],
          [
            "Falla fuera de garantía o por causa externa",
            "Reparación con cargo o venta de refacción. Presentamos cotización antes de intervenir.",
            "Variable, según refacción",
          ],
          [
            "Duda o defecto intermitente",
            "Sesión de soporte remoto (Flexem Studio, capturas de HMI, log de PLC). Muchas veces se resuelve sin RMA.",
            "Mismo día",
          ],
        ]}
      />
      <Callout variant="warning" title="Importante">
        La garantía se pierde si el equipo llega modificado (firmware alterado,
        soldaduras posteriores, retiro del sello de fábrica) o si se instala
        fuera de las condiciones ambientales del datasheet — por ejemplo, un
        HMI capacitivo IP66 montado sin junta en gabinete pintado con solvente
        agresivo.
      </Callout>

      <H2 id="soporte">Soporte técnico en español</H2>
      <P>
        Este es el diferenciador que rara vez se lee en un datasheet.
        Comprarle a un canal que no sostiene soporte es comprar caro por
        adelantado. Nuestro equipo cubre tres capas:
      </P>
      <UL>
        <LI>
          <Strong>Capa 1 — Programación y comunicación.</Strong> Uso de Flexem
          Studio, importación de proyectos existentes, configuración Modbus
          RTU/TCP hacia PLC de otras marcas, direccionamiento EtherCAT, curvas
          de leva electrónica en el FL7.
        </LI>
        <LI>
          <Strong>Capa 2 — Arquitectura.</Strong> Selección de HMI adecuada
          para la aplicación (F007N vs F110 vs FE6300), cálculo de par e
          inercia para elegir servo FV5 correcto, dimensionamiento de red
          Ethernet industrial.
        </LI>
        <LI>
          <Strong>Capa 3 — Fabricante.</Strong> Escalamiento a ingeniería
          FLEXEM cuando el caso lo justifica. La ventaja de ser el canal
          autorizado es que el ticket no muere en un buzón genérico.
        </LI>
      </UL>

      <BlogWhatsAppCTA
        message="tengo dudas técnicas sobre un equipo FLEXEM que ya opero."
        title="¿Ya tienes equipo FLEXEM instalado?"
        subtitle="Manda modelo y una descripción del problema. Te confirmamos si podemos resolverlo remoto o requiere visita."
        buttonLabel="Abrir ticket por WhatsApp"
      />

      <H2 id="tiempos-entrega">Tiempos de entrega reales</H2>
      <P>
        Distinguimos dos flujos: catálogo en stock y catálogo bajo pedido. Ser
        claros aquí evita la promesa habitual del sector de “te lo tenemos la
        próxima semana” para después estirar a dos meses.
      </P>

      <H3>Stock local (envío 3-5 días hábiles)</H3>
      <P>
        Mantenemos inventario permanente de los SKUs con mayor demanda en
        integraciones OEM y mantenimiento correctivo. Estos son los que puedes
        comprar directo en línea con precio y disponibilidad visibles:
      </P>

      <BlogProductCard slug="plc-fl7" variant="buy" />
      <BlogProductCard slug="hmi-f007n" variant="buy" />
      <BlogProductCard slug="productos-hmi-f110" variant="buy" />

      <H3>Bajo pedido (4 a 8 semanas)</H3>
      <P>
        Todo el catálogo FLEXEM está disponible bajo pedido: servos FV5-U3,
        FV5-E, FV5-R, PLC FL6 y FL8 en configuraciones especiales, HMI FE9000
        y FE7000, IoT gateway FBox, licencias FlexSCADA y FlexCloud. El plazo
        depende de si el producto está en stock del fabricante o si arranca
        producción bajo tu orden.
      </P>
      <UL>
        <LI>
          <Strong>4 semanas típicas</Strong> — HMI capacitivas y PLC de la
          familia FL7 en configuraciones estándar.
        </LI>
        <LI>
          <Strong>6 semanas</Strong> — Servos FV5, PLC FL6 con módulos de
          expansión, kits de IoT industrial.
        </LI>
        <LI>
          <Strong>8 semanas</Strong> — Licencias FlexSCADA multi-nodo, PLC FL8
          en configuraciones de más de 16 ejes, HMI de gran formato.
        </LI>
      </UL>

      <H2 id="facturacion">Facturación, precios y régimen fiscal</H2>
      <P>
        Facturamos con CFDI 4.0 en pesos mexicanos e IVA desglosado. Los
        precios publicados en la tienda son válidos para clientes con RFC en
        México y ya incluyen IVA. Para proyectos con licitación pública,
        emitimos cotización formal en formato oficial con NIP, condiciones de
        pago y vigencia.
      </P>
      <P>
        Si tu compra es para exportación o para una filial fuera de México,
        podemos facturar sin IVA con el trámite correspondiente. Contáctanos
        antes de emitir la orden para configurar el escenario.
      </P>

      <H2 id="por-que-flexem">Por qué considerar FLEXEM antes de decidir</H2>
      <P>
        FLEXEM no compite en el mismo tramo que Siemens o Rockwell. Compite
        con Delta, Unitronics, INVT y los distribuidores de marca blanca china
        que llegan por Alibaba. Contra esas tres alternativas su ventaja es
        clara:
      </P>
      <UL>
        <LI>
          <Strong>PLC CODESYS real.</Strong> El FL7 y el FL6 corren CODESYS
          IEC 61131-3 con soporte para ST, LD, FBD y CFC. La curva de
          aprendizaje es la industria estándar, no un IDE cerrado.
        </LI>
        <LI>
          <Strong>Control de movimiento serio.</Strong> El FL7 opera hasta 32
          ejes con interpolación y leva electrónica; el FL6 llega a 64 con
          EtherCAT. Muy pocos PLC en el rango de precio hacen esto.
        </LI>
        <LI>
          <Strong>Ecosistema completo.</Strong> Servos, HMI, IoT, SCADA y
          Cloud de la misma marca reducen fricción de integración.
        </LI>
        <LI>
          <Strong>Precio en el punto justo.</Strong> Un PLC FL721-0808P-D con
          8 ejes de PTO cuesta $3,445 MXN con IVA. Un Siemens S7-1200
          equivalente entra al triple. Un Delta DVP se acerca en precio pero
          no incluye leva electrónica.
        </LI>
      </UL>
      <P>
        Contra los distribuidores paralelos de Alibaba, la ventaja no es el
        producto: es la garantía, el soporte, la factura y el hecho de que en
        seis meses seguimos existiendo. Es la promesa completa de la marca —
        el acompañamiento técnico real, no el catálogo.
      </P>

      <BlogWhatsAppCTA
        message="quiero validar si FLEXEM es la marca correcta para mi proyecto de automatización."
        title="¿No estás seguro si FLEXEM aplica a tu proyecto?"
        subtitle="Cuéntanos qué máquina o proceso quieres controlar y te decimos con honestidad si te conviene."
      />

      <H2 id="proximos-pasos">Próximos pasos según tu caso</H2>
      <OL>
        <LI>
          <Strong>Necesito una refacción para un equipo ya instalado.</Strong>{" "}
          Manda modelo, número de serie y una foto de la etiqueta a WhatsApp.
          Cotizamos ese mismo día.
        </LI>
        <LI>
          <Strong>Estoy diseñando una máquina nueva.</Strong> Lee la{" "}
          <A href="/blog/guia-compra-plc-flexem-fl7">
            Guía de compra del PLC FL7
          </A>
          . Ahí describimos los tres submodelos, precios y aplicaciones típicas.
        </LI>
        <LI>
          <Strong>Ya tengo equipo FLEXEM y necesito soporte.</Strong> Abre un
          ticket por WhatsApp con el modelo y una descripción. Nuestro
          ingeniero de guardia responde el mismo día hábil.
        </LI>
        <LI>
          <Strong>Estoy comparando marcas.</Strong> Revisa la{" "}
          <A href="/blog/plc-chino-vs-plc-europeo">
            comparativa PLC chino vs PLC europeo
          </A>{" "}
          — reconoce dónde gana y dónde no gana FLEXEM.
        </LI>
      </OL>
    </>
  ),
}
