export type DownloadCategory = "manual" | "software" | "certificado" | "ficha" | "dimensiones"

// CDN base for all hosted documents (R2 bucket: adimex-media-cdn)
const CDN = "https://cdn.adimex.io"

export type Download = {
  name: string
  description: string
  category: DownloadCategory
  size: string
  version?: string
  href: string
}

export type FAQ = {
  question: string
  answer: string
}

export type Tutorial = {
  title: string
  duration: string
  description: string
  videoId?: string // YouTube ID — vacío = coming soon
  level: "Básico" | "Intermedio" | "Avanzado"
}

export type ProductSupport = {
  productSlug: string
  productName: string
  category: string
  downloads: Download[]
  faqs: FAQ[]
  tutorials: Tutorial[]
}

// ─── Downloads & support data ──────────────────────────────────────────────────

export const soporteData: ProductSupport[] = [
  // ── PLC FL7 (en venta) ─────────────────────────────────────────────────────
  {
    productSlug: "plc-fl7",
    productName: "PLC Serie FL7",
    category: "PLCs",
    downloads: [
      {
        name: "Brochure Serie FL7 — PLC Product 2025",
        description: "Catálogo técnico completo con modelos, especificaciones y aplicaciones",
        category: "ficha",
        version: "2025-10-21",
        size: "—",
        href: `${CDN}/pdf/FL7/FL7%20Serires%20PLC%20Product%20Brochure%20-20251021.pdf`,
      },
      {
        name: "Dimensional FL721 (DWG)",
        description: "Archivo CAD AutoCAD para integración en plano de gabinete",
        category: "dimensiones",
        size: "—",
        href: `${CDN}/dwg/FL7/FL721%20Dimensions.dwg`,
      },
    ],
    faqs: [
      { question: "¿Para qué tipo de máquinas sirve este PLC?", answer: "Para máquinas con varios motores que necesitan moverse coordinadamente — líneas de empaque, equipos CNC compactos, máquinas de ensamble, dosificadoras y robots cartesianos. Si tu máquina tiene entre 2 y 32 motores, el FL7 es buen ajuste." },
      { question: "¿Funciona con servomotores de otras marcas?", answer: "Sí. El FL7 se comunica con cualquier servo que hable Modbus, EtherCAT o que acepte señal de pulso (la mayoría). No te casas con FLEXEM si ya tienes equipo instalado." },
      { question: "¿Cuánto se tarda en programarlo desde cero?", answer: "Una aplicación sencilla de 1-2 motores está corriendo en uno o dos días. Una línea completa con visualización, alarmas y recetas suele tomar 2-3 semanas para un técnico con experiencia en PLC. Damos capacitación si tu equipo aún no lo conoce." },
      { question: "¿Cuánto tarda la entrega en México?", answer: "Tenemos stock en CDMX. Pedidos antes de las 2 PM salen el mismo día y llegan en 2-3 días hábiles a la mayoría del país, hasta 5 días a zonas remotas." },
      { question: "¿Qué garantía incluye?", answer: "12 meses de garantía de fábrica contra defectos. Si falla, lo reemplazamos. Soporte técnico telefónico y por WhatsApp incluido los primeros 6 meses." },
    ],
    tutorials: [
      { title: "Primer proyecto en FlexPro IDE", duration: "20 min", description: "Setup del IDE, creación de proyecto FL7 y primer ladder.", level: "Básico", videoId: "" },
      { title: "Control de movimiento multi-eje con FL7", duration: "35 min", description: "Configuración de PTO y CAM electrónica con 4 ejes.", level: "Intermedio", videoId: "" },
    ],
  },

  // ── HMI F007N (en venta) ───────────────────────────────────────────────────
  {
    productSlug: "hmi-f007n",
    productName: "HMI F007N",
    category: "HMI",
    downloads: [],
    faqs: [
      { question: "¿Qué es una HMI y para qué la necesito?", answer: "Es la pantalla táctil que el operador usa para arrancar, supervisar y ajustar la máquina. Reemplaza botones, perillas y luces piloto en un solo equipo, y permite mostrar gráficas, recetas y alarmas." },
      { question: "¿Funciona con el PLC que ya tengo instalado?", answer: "Probablemente sí. La F007N se conecta a PLCs Siemens, Allen-Bradley, Mitsubishi, Omron, Delta y cualquiera que hable Modbus. Si tienes dudas con tu modelo específico, mándanos un WhatsApp y te confirmamos antes de la compra." },
      { question: "¿Necesito comprar software aparte para programarla?", answer: "No. El software de diseño es gratuito y se descarga del centro de soporte. Es visual (arrastrar y soltar) — un operador con conocimientos básicos puede armar pantallas sencillas sin programar." },
      { question: "¿Cuánto tarda en llegar y qué incluye la caja?", answer: "Entrega en 2-3 días hábiles desde CDMX. La caja incluye el HMI, marcos de empaque, accesorios de montaje y cable de programación USB. Cable Ethernet y fuente de 24 V no incluidos." },
      { question: "¿Qué garantía tiene?", answer: "12 meses de garantía contra defectos de fábrica. Soporte técnico telefónico incluido los primeros 6 meses." },
    ],
    tutorials: [
      { title: "Primer proyecto en FlexScreen Designer", duration: "15 min", description: "Diseño de pantalla básica con botones e indicadores.", level: "Básico", videoId: "" },
    ],
  },

  // ── HMI F110 (en venta) ────────────────────────────────────────────────────
  {
    productSlug: "productos-hmi-f110",
    productName: "HMI F110",
    category: "HMI",
    downloads: [],
    faqs: [
      { question: "¿En qué se diferencia del F007N?", answer: "La F110 es más grande (10.1\" vs 7\"), trae conectividad a la nube ya integrada y Bluetooth de fábrica. Si necesitas monitoreo remoto desde celular o un panel principal de planta, este es el modelo." },
      { question: "¿Necesito comprar un gateway extra para que se conecte a internet?", answer: "No. La F110 trae todo lo necesario para enviar datos a la nube ADIMEX FlexCloud directamente, sin equipo adicional. Solo necesitas que la red del tablero tenga acceso a internet." },
      { question: "¿La puedo instalar en posición vertical (tipo portarretrato)?", answer: "Sí. Soporta orientación horizontal y vertical — útil para tableros angostos o instalaciones tipo quiosco." },
      { question: "¿Para qué sirve el Bluetooth integrado?", answer: "Para que un técnico pueda ajustar parámetros o ver diagnósticos desde su celular sin abrir el tablero ni conectar laptop. Útil cuando el HMI ya está instalado en un lugar incómodo de alcanzar." },
      { question: "¿Cuánto tarda la entrega y qué garantía tiene?", answer: "Entrega 2-3 días hábiles desde CDMX. Garantía 12 meses de fábrica con soporte técnico telefónico los primeros 6 meses." },
    ],
    tutorials: [
      { title: "Configuración IoT y MQTT en F110", duration: "20 min", description: "Conexión a FlexCloud y publicación de tags.", level: "Intermedio", videoId: "" },
    ],
  },

  // ── Servomotores FV5-E ────────────────────────────────────────────────────
  {
    productSlug: "servo-fv5-e",
    productName: "Servomotores FV5-E",
    category: "Servomotores",
    downloads: [
      {
        name: "Brochure Serie FV5 — Servo Product 2025",
        description: "Catálogo técnico completo de la serie FV5 con specs, modelos y aplicaciones",
        category: "ficha",
        size: "24.45 MB",
        version: "2025-01-10",
        href: `${CDN}/pdf/FV5%20Series/FV5%20Series%20Servo%20Product%20Brochure-20250110%20.pdf`,
      },
      {
        name: "Dimensional FV5/FV3S — SIZE A (PDF)",
        description: "Plano dimensional 2D en PDF para chasis tamaño A",
        category: "dimensiones",
        size: "87 KB",
        href: `${CDN}/pdf/FV5%20Series/FV5%26FV3S-SIZEA-%E4%BA%A7%E5%93%81%E5%B0%BA%E5%AF%B8%E5%9B%BE.pdf`,
      },
      {
        name: "Dimensional FV5/FV3S — SIZE B (PDF)",
        description: "Plano dimensional 2D en PDF para chasis tamaño B",
        category: "dimensiones",
        size: "99 KB",
        href: `${CDN}/pdf/FV5%20Series/FV5%26FV3S-SIZEB-%E4%BA%A7%E5%93%81%E5%B0%BA%E5%AF%B8%E5%9B%BE.pdf`,
      },
      {
        name: "Dimensional FV5/FV3S — SIZE A (DWG)",
        description: "Archivo CAD AutoCAD para integración en plano de gabinete",
        category: "dimensiones",
        size: "400 KB",
        href: `${CDN}/dwg/FV5%26FV3S-SIZEA-%E4%BA%A7%E5%93%81%E5%B0%BA%E5%AF%B8%E5%9B%BE.dwg`,
      },
      {
        name: "Dimensional FV5/FV3S — SIZE B (DWG)",
        description: "Archivo CAD AutoCAD para integración en plano de gabinete",
        category: "dimensiones",
        size: "463 KB",
        href: `${CDN}/dwg/FV5%26FV3S-SIZEB-%E4%BA%A7%E5%93%81%E5%B0%BA%E5%AF%B8%E5%9B%BE.dwg`,
      },
      {
        name: "Dimensional FV5 — SIZE C (DWG)",
        description: "Archivo CAD AutoCAD para integración en plano de gabinete",
        category: "dimensiones",
        size: "288 KB",
        href: `${CDN}/dwg/FV5-SIZEC-%E4%BA%A7%E5%93%81%E5%B0%BA%E5%AF%B8%E5%9B%BE.dwg`,
      },
    ],
    faqs: [
      { question: "¿Qué es un servomotor y cuándo lo necesito en lugar de un motor normal?", answer: "Un servo es un motor que se mueve exactamente a la posición y velocidad que le pides, con error de milésimas. Lo usas cuando tu máquina necesita precisión: corte láser, posicionamiento, sincronía entre ejes, empaque rápido. Si solo necesitas que algo gire a velocidad constante, basta con un motor normal." },
      { question: "¿Funciona con el PLC que ya tengo o necesito comprar uno FLEXEM?", answer: "Funciona con cualquier PLC que soporte EtherCAT, Modbus o señal de pulso — Siemens, Allen-Bradley, Mitsubishi, Omron, Delta, etc. No te obliga a cambiar de marca." },
      { question: "¿Lo puedo instalar yo mismo o necesito un técnico especializado?", answer: "El cableado básico lo hace un electricista industrial siguiendo el manual. La puesta a punto inicial (ajuste de ganancias, sintonía con la carga) sí requiere un técnico con experiencia en servos. Si nunca has trabajado con servomotores, ofrecemos servicio de puesta en marcha en tu planta." },
      { question: "¿Qué incluye al comprarlo?", answer: "El drive (controlador) solo. El motor servo, cables de potencia y encoder se piden por separado según el tamaño que necesites. Si nos dices tu aplicación, te armamos el kit completo." },
      { question: "¿Cuánto tarda la entrega y qué garantía tiene?", answer: "Modelos en stock entregamos en 3-5 días en México. Configuraciones especiales pueden tardar 2-3 semanas. Garantía 12 meses de fábrica." },
    ],
    tutorials: [
      { title: "Instalación y cableado básico FV5-E", duration: "12 min", description: "Conexión de potencia, encoder y señales de control desde cero.", level: "Básico", videoId: "" },
      { title: "Primera puesta en marcha con FlexEM Studio", duration: "18 min", description: "Configuración del wizard, autotuning y primera prueba de movimiento.", level: "Básico", videoId: "" },
      { title: "Integración EtherCAT con PLC FL8", duration: "25 min", description: "Configuración del maestro, mapeo de PDOs y control desde TwinCAT/FL8.", level: "Intermedio", videoId: "" },
      { title: "Control de posición con perfiles CAM", duration: "30 min", description: "Programación de levas electrónicas para sincronización de ejes.", level: "Avanzado", videoId: "" },
    ],
  },

  // ── PLCs FL8 ──────────────────────────────────────────────────────────────
  {
    productSlug: "plc-fl8",
    productName: "PLCs FL8",
    category: "PLCs",
    downloads: [],
    faqs: [
      { question: "¿En qué se diferencia del PLC FL7?", answer: "El FL8 es más potente — mejor procesador, más memoria y capaz de controlar líneas grandes con muchos motores y sensores. Si tu aplicación es simple (1-4 motores), el FL7 te alcanza y cuesta menos. Para líneas complejas o coordinación de máquinas, conviene el FL8." },
      { question: "¿Cuántos motores y sensores puedo conectarle?", answer: "Hasta 32 motores coordinados al mismo tiempo y cientos de sensores vía módulos de expansión. Para la mayoría de plantas, sobra capacidad." },
      { question: "¿Puedo conectarlo a internet para monitorear desde mi celular?", answer: "Sí. Trae acceso remoto seguro vía VPN integrada — instalas la app ADIMEX FlexCloud en tu celular y ves el estado de la planta en tiempo real, recibes alertas, e incluso puedes hacer cambios menores desde fuera." },
      { question: "¿Qué incluye al comprarlo y cuánto tarda?", answer: "La caja incluye el PLC base, accesorios de montaje y guía rápida. El software de programación FlexPro lo descargas gratis. Entrega 3-5 días en México con stock disponible." },
      { question: "¿Qué garantía y soporte ofrecen?", answer: "12 meses de garantía contra defectos. Soporte técnico telefónico y por WhatsApp incluido los primeros 6 meses; ofrecemos planes extendidos de soporte 24/7 para aplicaciones críticas." },
    ],
    tutorials: [
      { title: "Primer proyecto en FlexPro IDE", duration: "20 min", description: "Instalación del IDE, configuración del proyecto y primer programa en Ladder.", level: "Básico", videoId: "" },
      { title: "Configuración de maestro EtherCAT con FV5-E", duration: "35 min", description: "Escaneo de red, mapeo PDO y bloques MC_MoveAbsolute.", level: "Intermedio", videoId: "" },
      { title: "Comunicación MODBUS TCP con FlexSCADA", duration: "22 min", description: "Exposición de variables y lectura en tiempo real desde el SCADA.", level: "Intermedio", videoId: "" },
      { title: "Programación de CAM sincronizada multi-eje", duration: "45 min", description: "Perfiles de movimiento sincronizado entre 8 ejes para línea de envasado.", level: "Avanzado", videoId: "" },
    ],
  },

  // ── HMI FE6300 ────────────────────────────────────────────────────────────
  {
    productSlug: "hmi-fe6300",
    productName: "HMI FE6300",
    category: "HMI",
    downloads: [],
    faqs: [
      { question: "¿En qué se diferencia de las HMI F007N y F110?", answer: "La FE6300 es la HMI 'industrial pesada': pantalla resistiva (funciona aún con guantes o destornillador), módulo IoT que cambias sin cambiar la HMI, y mayor robustez para ambientes con polvo o vibración. Las F007N/F110 son más modernas pero menos rudas." },
      { question: "¿Funciona con mi PLC actual (Siemens, Allen-Bradley, etc.)?", answer: "Sí. El software de configuración incluye decenas de drivers listos para usar — Siemens S7-200/300/1200/1500, Allen-Bradley Micro/CompactLogix, Mitsubishi FX/Q, Omron, Modbus, y más." },
      { question: "¿Cómo respaldo la configuración antes de hacer cambios?", answer: "Inserta una memoria USB en el puerto frontal y desde el menú del sistema seleccionas 'Exportar todo'. Se genera un archivo que contiene proyecto, recetas y registros. Si algo sale mal, restauras desde ese USB en menos de un minuto." },
      { question: "¿Qué garantía y entrega tiene?", answer: "12 meses de garantía. Entrega 3-5 días hábiles desde CDMX." },
    ],
    tutorials: [
      { title: "Diseño de pantalla básica con FlexScreen", duration: "15 min", description: "Crear una pantalla con indicadores, botones y navegación entre vistas.", level: "Básico", videoId: "" },
      { title: "Recetas y gestión de parámetros de proceso", duration: "28 min", description: "Crear, editar y proteger recetas con control de acceso por usuario.", level: "Intermedio", videoId: "" },
      { title: "Alarmas y registro histórico en FE6300", duration: "20 min", description: "Configuración de alarmas, bitácora y exportación de datos a USB.", level: "Intermedio", videoId: "" },
    ],
  },

  // ── FlexSCADA ─────────────────────────────────────────────────────────────
  {
    productSlug: "scada-flexscada",
    productName: "FlexSCADA",
    category: "SCADA",
    downloads: [],
    faqs: [
      { question: "¿Qué es FlexSCADA en pocas palabras?", answer: "Es el software que muestra en una pantalla (PC o tablet) todo lo que pasa en tu planta: estados de máquinas, alarmas, producción del turno, consumos. Conecta los PLCs y sensores a un panel visual que cualquier supervisor puede entender." },
      { question: "¿Necesito una computadora especial para correrlo?", answer: "No. Funciona en cualquier PC con Windows del año 2018 en adelante. Para plantas grandes recomendamos un equipo dedicado tipo servidor, pero para empezar basta una PC normal." },
      { question: "¿Es licencia mensual o se compra una sola vez?", answer: "Se compra una sola vez por cantidad de variables (tags) que necesitas monitorear. No hay cuota mensual ni anual. Actualizaciones menores son gratis los primeros 12 meses." },
      { question: "¿Puedo verlo desde la nube o solo localmente?", answer: "Ambas. Lo puedes correr en una PC dentro de tu planta o desplegarlo en Azure/AWS para que tu gerente lo vea desde cualquier sucursal. La conexión a las máquinas se hace de forma segura sin abrir puertos del firewall." },
      { question: "¿Lo instalan ustedes o me toca configurarlo a mí?", answer: "Ofrecemos servicio de implementación llave en mano (incluye instalación, configuración de conexión a PLCs y diseño de las pantallas principales) o solo te vendemos la licencia y lo armas tú con nuestra documentación. Tú decides." },
    ],
    tutorials: [
      { title: "Instalación y configuración inicial del servidor", duration: "25 min", description: "Instalación en Windows Server, licenciamiento y primer arranque.", level: "Básico", videoId: "" },
      { title: "Conexión a PLCs vía MODBUS TCP", duration: "18 min", description: "Configuración del driver, mapeo de tags y verificación de lectura.", level: "Básico", videoId: "" },
      { title: "Diseño de synóptico de planta", duration: "40 min", description: "Creación de pantalla de proceso con animaciones, válvulas y tendencias.", level: "Intermedio", videoId: "" },
      { title: "Configuración de reportes y KPIs de producción", duration: "35 min", description: "Reportes automáticos por turno, OEE y exportación a Excel/PDF.", level: "Intermedio", videoId: "" },
      { title: "Integración OPC-UA con sistema MES", duration: "30 min", description: "Exposición de tags como servidor OPC-UA y conexión con SAP ME.", level: "Avanzado", videoId: "" },
    ],
  },

  // ── IoT FBox ──────────────────────────────────────────────────────────────
  {
    productSlug: "iot-fbox",
    productName: "FBox IoT Gateway",
    category: "IoT",
    downloads: [],
    faqs: [
      { question: "¿Qué hace exactamente un IoT Gateway?", answer: "Es la 'caja puente' entre tus máquinas y la nube. Lee datos de PLCs, variadores y sensores (sin importar la marca), los empaqueta y los manda por internet a un panel donde puedes verlos desde cualquier lado. También permite acceso remoto seguro al PLC para programación a distancia." },
      { question: "¿Tengo que cambiar mis máquinas actuales para usarlo?", answer: "No. Se conecta a lo que ya tienes. Funciona con PLCs Siemens, Allen-Bradley, Mitsubishi, Omron, variadores Danfoss/ABB y prácticamente cualquier equipo industrial existente." },
      { question: "¿Cuántos datos consume al mes?", answer: "Para una máquina típica con 20-50 variables monitoreadas: entre 30 y 80 MB al mes. Un plan de datos básico (1 GB) alcanza fácil para una planta pequeña." },
      { question: "¿Funciona con red móvil 4G o necesita WiFi cableado?", answer: "Hay modelos para WiFi, Ethernet cableado y 4G LTE con SIM. Para máquinas en campo (estaciones de bombeo, equipos móviles) recomendamos el modelo 4G." },
      { question: "¿Necesito un servidor en la nube propio?", answer: "No. Puedes usar nuestra plataforma ADIMEX FlexCloud (prueba gratis incluida) o conectarlo a tu propio servidor si ya tienes uno. Sin contratos largos." },
    ],
    tutorials: [
      { title: "Configuración inicial del FBox y acceso remoto", duration: "15 min", description: "Primer arranque, red y activación del túnel VPN para acceso seguro.", level: "Básico", videoId: "" },
      { title: "Recolección de datos MODBUS y envío a FlexCloud", duration: "20 min", description: "Mapeo de registros MODBUS y configuración del pipeline hacia la nube.", level: "Intermedio", videoId: "" },
    ],
  },
]

export function getSoporteBySlug(slug: string): ProductSupport | undefined {
  return soporteData.find((s) => s.productSlug === slug)
}

export const downloadCategoryLabel: Record<DownloadCategory, string> = {
  manual:       "Manual",
  software:     "Software",
  certificado:  "Certificado",
  ficha:        "Ficha técnica",
  dimensiones:  "Dimensiones 2D / CAD",
}

export const downloadCategoryColor: Record<DownloadCategory, string> = {
  manual:       "text-[#017bfd] bg-[#017bfd]/8 border-[#017bfd]/20",
  software:     "text-emerald-700 bg-emerald-50 border-emerald-200",
  certificado:  "text-amber-700 bg-amber-50 border-amber-200",
  ficha:        "text-[#07080c]/45 bg-black/5 border-black/10",
  dimensiones:  "text-violet-700 bg-violet-50 border-violet-200",
}
