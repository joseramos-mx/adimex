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
  slug: "cuanto-cuesta-automatizar-maquina-mexico-2026",
  title:
    "Cuánto cuesta automatizar una máquina en México en 2026: desglose real",
  excerpt:
    "Presupuestos reales para automatizar una máquina en México: PLC, HMI, servos, tablero e ingeniería. Rangos por complejidad y consejos para no explotar el costo.",
  description:
    "Desglosamos partida por partida el costo de automatizar una máquina industrial en México en 2026 — desde una celda simple hasta una línea multi-eje — con precios verificables.",
  cluster: "transaccional",
  category: "Costos y presupuestos",
  publishedAt: "2026-07-06",
  author: "Equipo técnico ADIMEX",
  readingMinutes: 11,
  focusKeyword: "costo automatización industrial méxico",
  cover: {
    src: "https://images.pexels.com/photos/36564992/pexels-photo-36564992.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Equipo de automatización industrial con tablero de control ensamblado",
  },
  relatedProductSlugs: ["plc-fl7", "hmi-f007n", "servo-fv5-e"],
  relatedPostSlugs: [
    "guia-compra-plc-flexem-fl7",
    "plc-chino-vs-plc-europeo",
    "flexem-en-mexico-distribuidor-autorizado",
  ],
  whatsappContext:
    "leí su desglose de costos y quiero cotizar la automatización de una máquina.",
  faq: [
    {
      q: "¿Cuánto cuesta automatizar una máquina simple en México?",
      a: "Una celda simple (1 PLC, 1 HMI de 7\", 2 sensores, tablero pequeño, ingeniería) parte de $80,000 a $150,000 MXN con IVA. Una máquina con 4 ejes servo y HMI de 10\" suele entrar entre $250,000 y $500,000 MXN.",
    },
    {
      q: "¿Puedo bajar el costo de tablero usando componentes chinos?",
      a: "Puedes bajar 30-50% el costo de la electrónica de control usando FLEXEM en vez de Siemens o Rockwell, sin sacrificar calidad. Lo que no conviene abaratar: cableado (usa THHN calibre correcto), borneras (Phoenix o WAGO) y contactores (Schneider, Eaton, ABB).",
    },
    {
      q: "¿Cuánto vale la mano de obra de ingeniería?",
      a: "En 2026, un integrador experimentado en México cobra entre $700 y $1,500 MXN/hora dependiendo de la complejidad. Un proyecto llave en mano incluye horas de diseño, programación, puesta en marcha y capacitación.",
    },
    {
      q: "¿Cuál es el margen de imprevistos que debo considerar?",
      a: "Considera 10-15% del presupuesto para imprevistos: retrabajos, sensores extra, cables largos, permisos. Los proyectos con margen 0 siempre terminan en excedente.",
    },
    {
      q: "¿Los precios varían según región de México?",
      a: "La electrónica cuesta igual en cualquier estado — envío nacional. Lo que varía es la mano de obra de instalación (más alta en Monterrey, Bajío y Ciudad de México) y la logística de traslado en zonas remotas.",
    },
  ],
  Body: () => (
    <>
      <P>
        “¿Cuánto me sale automatizar mi máquina?” es la pregunta con más
        respuestas erróneas del sector. Un cotizador honesto no da un número
        de bala — pero sí puede darte rangos verificables por tipo de
        proyecto. Aquí van, con precios de 2026 y catálogo comprobable.
      </P>

      <Callout title="Cómo leer este artículo">
        Los rangos son en MXN con IVA e incluyen electrónica, tablero e
        ingeniería. No incluyen el mecánico (bandas, motores base, chasis) ni
        la obra civil. Los rangos “alto” asumen componentes premium y hasta 15%
        de imprevistos.
      </Callout>

      <H2 id="cuatro-perfiles">Cuatro perfiles de proyecto</H2>
      <P>
        En automatización mexicana, el 90% de los proyectos entra en uno de
        cuatro perfiles. Identifica el tuyo antes de leer los desgloses.
      </P>

      <SpecTable
        headers={["Perfil", "Ejemplo", "Rango total con IVA"]}
        rows={[
          [
            "1 · Celda simple",
            "Etiquetadora manual con avance automático, dispensadora de una estación",
            "$80,000 – $180,000 MXN",
          ],
          [
            "2 · Máquina compacta multi-eje",
            "Encartonadora, taponadora, envasadora vertical, prensa hidráulica automatizada",
            "$250,000 – $500,000 MXN",
          ],
          [
            "3 · Línea con SCADA",
            "Línea de llenado + tapado + etiquetado con supervisión, dosificadora de multi-ingrediente",
            "$700,000 – $1,800,000 MXN",
          ],
          [
            "4 · Automatización de planta",
            "Multi-línea con MES, gestión energética, monitoreo remoto, Big Data",
            "$2M – $10M+ MXN",
          ],
        ]}
      />

      <H2 id="perfil-1">Perfil 1 · Celda simple ($80k a $180k)</H2>
      <P>
        Es el caso típico de OEM pequeño o retrofit de máquina manual. La
        arquitectura mínima:
      </P>

      <SpecTable
        headers={["Partida", "Rango MXN con IVA"]}
        rows={[
          ["1 PLC compacto (FL7 o similar)", "$3,500 – $6,000"],
          ["1 HMI 7\" capacitiva", "$7,000 – $9,000"],
          ["Fuente 24 V DC 40W + protecciones", "$1,500 – $3,000"],
          ["Sensores (2-4 unidades)", "$2,000 – $6,000"],
          ["Contactores, botones, luces piloto", "$2,500 – $5,000"],
          ["Tablero, cableado, borneras", "$8,000 – $15,000"],
          ["Ingeniería (diseño + programación + puesta en marcha)", "$40,000 – $100,000"],
          ["Capacitación e imprevistos", "$8,000 – $25,000"],
        ]}
      />

      <P>
        Ejemplo real: retrofit de dispensadora manual. Un{" "}
        <A href="/productos/plc-fl7">FL721-0808P-D</A> ($3,445), un{" "}
        <A href="/productos/hmi-f007n">HMI F007N</A> ($7,308), fuente Meanwell
        y sensores DHT, tablero de 400×300 y 25 horas de ingeniería. Total
        llave en mano: alrededor de <Strong>$115,000 MXN con IVA</Strong>.
      </P>

      <BlogProductCard slug="plc-fl7" variant="buy" />

      <H2 id="perfil-2">Perfil 2 · Máquina compacta multi-eje ($250k a $500k)</H2>
      <P>
        Aquí entran las máquinas de empaque, la mayoría del portafolio de
        integradores mexicanos. La regla es 4-8 ejes de movimiento, 20-40
        pantallas de HMI, y comunicación con báscula, impresora o visión.
      </P>

      <SpecTable
        headers={["Partida", "Rango MXN con IVA"]}
        rows={[
          ["1 PLC multi-eje (FL7 con módulos analógicos)", "$6,000 – $12,000"],
          ["1 HMI 10\" IoT (F110C o FE6300)", "$9,000 – $15,000"],
          ["4-6 servos + motores con reductor", "$60,000 – $150,000"],
          ["Sensores, encoders, celdas de carga", "$15,000 – $40,000"],
          ["Contactores, breakers, protecciones", "$10,000 – $25,000"],
          ["Tablero grande + cableado industrial", "$25,000 – $60,000"],
          ["Ingeniería (60-150 horas)", "$80,000 – $200,000"],
          ["Puesta en marcha + capacitación", "$25,000 – $60,000"],
        ]}
      />

      <P>
        Ejemplo real: encartonadora horizontal de 40 cajas/min. FL7 con módulo
        analógico, HMI F110C, 4 servos FV5-E, sensores fotoeléctricos y un
        encoder de posición en cabezal. Ingeniería 90 horas, cableado
        industrial, puesta en marcha 3 días. Total llave en mano:{" "}
        <Strong>alrededor de $380,000 MXN con IVA</Strong>.
      </P>

      <BlogProductCard slug="servo-fv5-e" variant="quote" />

      <H2 id="perfil-3">Perfil 3 · Línea con SCADA ($700k a $1.8M)</H2>
      <P>
        Múltiples máquinas coordinadas + supervisión centralizada. Aquí entra
        FlexSCADA (o Ignition en proyectos grandes), servidores redundantes y
        recolección de datos operacionales.
      </P>

      <SpecTable
        headers={["Partida", "Rango MXN con IVA"]}
        rows={[
          ["3-5 PLC de línea + expansiones", "$25,000 – $60,000"],
          ["3-5 HMI 10\"", "$30,000 – $75,000"],
          ["10-20 servos + motores", "$180,000 – $500,000"],
          ["Sensores, encoders, visión industrial", "$60,000 – $180,000"],
          ["Tableros modulares + cableado + fibra", "$120,000 – $280,000"],
          ["Licencia FlexSCADA o Ignition", "$25,000 – $80,000"],
          ["Servidor + backup + red industrial", "$40,000 – $100,000"],
          ["Ingeniería (250-500 horas)", "$220,000 – $500,000"],
        ]}
      />

      <P>
        En este perfil el margen operativo depende más de la ingeniería que del
        equipo. Un integrador que reutiliza librerías de software y estándares
        propios puede reducir el costo total 15-25%.
      </P>

      <H2 id="perfil-4">Perfil 4 · Automatización de planta ($2M+)</H2>
      <P>
        Escenarios: Grupo FEMSA con monitoreo de compresores en múltiples
        plantas, Atlas Copco con dashboards de eficiencia, City Express con
        control centralizado de HVAC. El equipo importa pero la infraestructura
        (red industrial, ciberseguridad, MES/ERP, cloud) domina el presupuesto.
      </P>
      <P>
        En este rango no hay tabla estándar. Estos proyectos requieren
        levantamiento previo, plan director y por lo general se ejecutan en
        fases. Es el punto donde la conversación deja de ser sobre precio y
        empieza a ser sobre ROI.
      </P>

      <BlogWhatsAppCTA
        message="tengo un proyecto de automatización de planta y necesito un levantamiento."
        title="¿Tu proyecto está en el perfil 4?"
        subtitle="Agendamos un levantamiento sin costo. En 90 minutos identificamos alcance, arquitectura y presupuesto realista."
      />

      <H2 id="donde-abaratar">Dónde puedes abaratar sin arriesgar</H2>
      <OL>
        <LI>
          <Strong>Electrónica de control (PLC + HMI).</Strong> Usar FLEXEM
          contra Siemens ahorra 50-70% sin comprometer calidad para la
          mayoría de aplicaciones. Ejemplo: FL7 + F007N cuestan $10,800
          contra un S7-1200 + KTP700 que ronda $45,000-$60,000.
        </LI>
        <LI>
          <Strong>Servos.</Strong> FV5 es 30-45% más barato que Delta ASDA-A2
          y comparable en respuesta dinámica.
        </LI>
        <LI>
          <Strong>Reutilización de librerías.</Strong> Un integrador con
          librerías propias reduce horas de programación 20-40%.
        </LI>
      </OL>

      <H2 id="donde-no">Dónde NO abaratar</H2>
      <UL>
        <LI>
          <Strong>Cableado eléctrico.</Strong> Usa THHN calibre correcto,
          canaleta industrial, ferrules en cada extremo. Un tablero mal
          cableado se paga después con dobles de hora de campo.
        </LI>
        <LI>
          <Strong>Borneras y conectores.</Strong> Phoenix Contact, WAGO o
          Weidmüller. Las alternativas baratas producen fallos intermitentes
          que se cazan meses.
        </LI>
        <LI>
          <Strong>Protecciones eléctricas.</Strong> Contactores, breakers y
          SPD son la línea de defensa contra transitorios; ahorrar aquí es
          apostar contra tu propio proyecto.
        </LI>
        <LI>
          <Strong>Ingeniería.</Strong> El integrador barato termina siendo
          caro. Prioriza un proveedor con casos verificables, no el que
          cotiza 30% menos y explica poco.
        </LI>
      </UL>

      <BlogWhatsAppCTA
        message="quiero un desglose realista para mi máquina."
        title="¿Necesitas un desglose real antes de aprobar el CAPEX?"
        subtitle="Manda tipo de máquina y ejes aproximados. Te enviamos un desglose partida por partida en 24 horas."
      />

      <H2 id="conclusion">Cómo lo cotizamos en ADIMEX</H2>
      <P>
        Nuestro proceso estándar para un proyecto de perfil 2 o 3:
      </P>
      <OL>
        <LI>
          <Strong>Descubrimiento (sin costo).</Strong> Llamada de 60 minutos +
          revisión de layout mecánico.
        </LI>
        <LI>
          <Strong>Anteproyecto (con anticipo).</Strong> Selección de PLC, HMI,
          servos y sensores. Diagrama unifilar preliminar. Rango de costo con
          ±15% de precisión.
        </LI>
        <LI>
          <Strong>Cotización formal.</Strong> Con lista de materiales
          detallada, cronograma y condiciones de pago.
        </LI>
        <LI>
          <Strong>Ejecución.</Strong> Programación, tablero, puesta en marcha,
          documentación y capacitación al operador.
        </LI>
      </OL>
    </>
  ),
}
