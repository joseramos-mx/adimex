export type DownloadCategory = "manual" | "software" | "certificado" | "ficha"

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
  // ── Servomotores FV5-E ────────────────────────────────────────────────────
  {
    productSlug: "servo-fv5-e",
    productName: "Servomotores FV5-E",
    category: "Servomotores",
    downloads: [
      { name: "Manual de usuario FV5-E", description: "Instalación, parámetros, cableado y resolución de fallas", category: "manual", size: "12.4 MB", version: "v2.3", href: "#" },
      { name: "Guía rápida FV5-E", description: "Puesta en marcha en menos de 30 minutos", category: "manual", size: "2.1 MB", version: "v1.0", href: "#" },
      { name: "FlexEM Studio Setup", description: "Software de configuración y puesta en marcha para drives FV5", category: "software", size: "185 MB", version: "v3.2.1", href: "#" },
      { name: "Ficha técnica FV5-E", description: "Especificaciones eléctricas y mecánicas completas", category: "ficha", size: "980 KB", href: "#" },
      { name: "Declaración CE / UL", description: "Certificaciones de conformidad para exportación", category: "certificado", size: "340 KB", href: "#" },
    ],
    faqs: [
      { question: "¿Cómo configuro el modo de control de torque en el FV5-E?", answer: "Ingrese al parámetro P0-01 y seleccione el valor 2 (Torque Control Mode). Luego configure el límite de torque en P1-13. Asegúrese de que la señal analógica de referencia esté conectada al pin AI1 del conector CN1." },
      { question: "El drive muestra alarma E-04 al arrancar, ¿qué significa?", answer: "La alarma E-04 indica sobrevoltaje en el bus DC. Verifique que la tensión de alimentación no exceda el rango nominal (200-240 VAC para modelos L, 380-440 VAC para modelos H). Si persiste, revise el resistor de frenado dinámico." },
      { question: "¿Puedo conectar el FV5-E directamente a un PLC FL8 vía EtherCAT?", answer: "Sí. El FV5-E soporta EtherCAT CiA 402. En FlexEM Studio active el protocolo EtherCAT en P5-00=1, configure la dirección de estación en P5-01 y reinicie el drive. En el FL8 agregue el ESI del FV5-E desde el catálogo del maestro EtherCAT." },
      { question: "¿Cuál es el procedimiento de autotuning de ganancias?", answer: "Con el motor acoplado a la carga, ponga P2-00=1 (inercia estimada automática) y ejecute un ciclo de movimiento con el wizard de FlexEM Studio. El sistema calculará automáticamente las ganancias P, I y D del lazo de velocidad y posición." },
      { question: "¿El FV5-E soporta encoder absoluto multivuelta?", answer: "Sí, soporta encoder ABZ incremental (P9-00=0), encoder serial absoluto de 17 bit (P9-00=3) y encoder Hiperface DSL multivuelta de 23 bit (P9-00=5). Seleccione el tipo correcto según el motor FLEXEM utilizado." },
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
    downloads: [
      { name: "Manual de programación FL8", description: "Lenguajes IEC 61131-3: LD, FBD, ST, IL, SFC", category: "manual", size: "28.7 MB", version: "v4.1", href: "#" },
      { name: "Manual de hardware FL8", description: "Montaje, E/S, módulos de expansión y especificaciones eléctricas", category: "manual", size: "9.2 MB", version: "v2.0", href: "#" },
      { name: "FlexPro IDE", description: "Entorno de programación IEC 61131-3 para PLC FL7/FL8", category: "software", size: "320 MB", version: "v5.1.3", href: "#" },
      { name: "Librería EtherCAT Master FL8", description: "Bloques de función para control de ejes EtherCAT CiA 402", category: "software", size: "4.5 MB", version: "v1.8", href: "#" },
      { name: "Ficha técnica FL8", description: "Especificaciones completas del controlador", category: "ficha", size: "1.2 MB", href: "#" },
      { name: "Certificación IEC 61131 / CE", description: "Conformidad de programación y hardware", category: "certificado", size: "410 KB", href: "#" },
    ],
    faqs: [
      { question: "¿Cuántos ejes EtherCAT puede controlar el FL8 simultáneamente?", answer: "El FL8 soporta hasta 32 ejes EtherCAT con tiempo de ciclo de 125 µs. Para aplicaciones con más de 16 ejes se recomienda el modo de ciclo de 250 µs para garantizar determinismo." },
      { question: "¿Cómo actualizo el firmware del FL8 desde FlexPro?", answer: "En FlexPro vaya a Device → Update Firmware, seleccione el archivo .bin descargado del portal FLEXEM y haga clic en Update. El proceso tarda ~3 minutos. No desconecte la alimentación durante la actualización." },
      { question: "¿El FL8 puede actuar como servidor MODBUS TCP simultáneamente al maestro EtherCAT?", answer: "Sí. El FL8 tiene doble puerto Ethernet independiente. Asigne el puerto 1 a EtherCAT y el puerto 2 a MODBUS TCP en la configuración de red de FlexPro. Ambos protocolos funcionan en paralelo sin afectar el tiempo de ciclo del EtherCAT." },
      { question: "¿Cómo habilito el acceso remoto vía VPN al FL8?", answer: "El FL8 incluye cliente OpenVPN integrado. Configure el certificado del servidor en System → VPN → Client Certificate y el archivo .ovpn en VPN Profile. Requiere FlexCloud o un servidor VPN propio." },
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
    downloads: [
      { name: "Manual de usuario FE6300", description: "Configuración de pantalla, objetos gráficos y comunicaciones", category: "manual", size: "18.3 MB", version: "v3.0", href: "#" },
      { name: "FlexScreen Designer", description: "Software de diseño de pantallas HMI para serie FE", category: "software", size: "240 MB", version: "v4.5.0", href: "#" },
      { name: "Driver MODBUS RTU/TCP para FE6300", description: "Driver de comunicación con PLCs de terceros", category: "software", size: "1.8 MB", version: "v2.1", href: "#" },
      { name: "Ficha técnica FE6300", description: "Resolución, capacidad, tiempos de respuesta", category: "ficha", size: "760 KB", href: "#" },
    ],
    faqs: [
      { question: "¿El FE6300 puede comunicarse con PLCs Siemens S7 directamente?", answer: "Sí, a través del driver S7 MPI/PPI o S7 Ethernet disponible en FlexScreen Designer. Para S7-1200/1500 use el driver S7 Ethernet con el protocolo ISO on TCP, configurando el TSAP del PLC." },
      { question: "¿Cómo hago un backup de la receta y configuración del FE6300?", answer: "Inserte una memoria USB en el puerto frontal y en el menú del sistema seleccione Backup → Export All. Se genera un archivo .fepk que contiene el proyecto, recetas y logs. Para restaurar, use Import All con el mismo archivo." },
      { question: "La pantalla táctil no responde con precisión, ¿cómo calibro el touch?", answer: "Entre al menú de sistema manteniendo presionadas las esquinas superior-izquierda e inferior-derecha simultáneamente por 5 segundos. Seleccione Touch Calibration y siga las instrucciones en pantalla con un stylus fino." },
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
    downloads: [
      { name: "Manual de administrador FlexSCADA", description: "Instalación del servidor, configuración de drivers y usuarios", category: "manual", size: "22.1 MB", version: "v6.0", href: "#" },
      { name: "Manual del diseñador FlexSCADA", description: "Creación de synópticos, tendencias y reportes", category: "manual", size: "31.5 MB", version: "v6.0", href: "#" },
      { name: "FlexSCADA Server (Windows)", description: "Servidor SCADA para Windows Server 2019/2022", category: "software", size: "680 MB", version: "v6.1.2", href: "#" },
      { name: "FlexSCADA Client", description: "Cliente de visualización para Windows / Linux", category: "software", size: "120 MB", version: "v6.1.2", href: "#" },
      { name: "Driver Pack v6 — MODBUS, EtherNet/IP, OPC-UA", description: "Paquete de drivers de comunicación industriales", category: "software", size: "45 MB", version: "v6.0", href: "#" },
      { name: "Guía de integración OPC-UA", description: "Conexión con sistemas MES/ERP vía OPC Unified Architecture", category: "manual", size: "3.4 MB", href: "#" },
    ],
    faqs: [
      { question: "¿FlexSCADA puede correr en la nube (Azure/AWS)?", answer: "Sí. FlexSCADA Server v6+ soporta despliegue en máquinas virtuales Windows Server en Azure, AWS o GCP. Para conectividad con campo, use el FlexEdge Gateway que establece un túnel seguro desde la red industrial hasta el servidor en la nube sin abrir puertos en el firewall de planta." },
      { question: "¿Cómo configuro redundancia de servidores en FlexSCADA?", answer: "En la consola de administración active el modo Hot Standby: configure el servidor primario con su IP en Redundancy → Primary, y el servidor secundario apuntando al primario en Redundancy → Secondary. La conmutación automática ocurre en menos de 3 segundos ante falla." },
      { question: "¿FlexSCADA tiene conector nativo con SAP o sistemas ERP?", answer: "FlexSCADA incluye un conector REST API bidireccional y soporte OPC-UA Server que permite integración directa con SAP ME, SAP MII y la mayoría de sistemas MES/ERP modernos. Para SAP R/3 legacy se requiere el módulo FlexSCADA Bridge disponible por separado." },
      { question: "¿Cuántos tags soporta FlexSCADA sin afectar el rendimiento?", answer: "FlexSCADA v6 soporta hasta 500,000 tags con actualización de 100 ms en hardware estándar (8 cores, 32 GB RAM). Para instalaciones mayores, el modo cluster distribuye la carga entre múltiples nodos." },
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
    downloads: [
      { name: "Manual FBox Gateway", description: "Configuración de protocolos, VPN y conectividad cloud", category: "manual", size: "8.6 MB", version: "v2.1", href: "#" },
      { name: "FlexEdge Manager", description: "Plataforma de gestión remota de gateways FBox", category: "software", size: "95 MB", version: "v2.3.0", href: "#" },
      { name: "Ficha técnica FBox", description: "Especificaciones de conectividad y consumo", category: "ficha", size: "540 KB", href: "#" },
    ],
    faqs: [
      { question: "¿El FBox puede actuar como cliente VPN sin infraestructura propia?", answer: "Sí. El FBox incluye cliente WireGuard y OpenVPN integrados. Si no dispone de servidor VPN propio, puede usar el servicio FlexCloud que provisiona automáticamente el túnel seguro sin configuración adicional." },
      { question: "¿Qué protocolos industriales soporta el FBox para lectura de campo?", answer: "MODBUS RTU/TCP, EtherNet/IP, PROFINET, OPC-UA Client, BACnet, DNP3 y protocolos seriales RS-232/RS-485. Los drivers se activan por licencia modular en FlexEdge Manager." },
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
}

export const downloadCategoryColor: Record<DownloadCategory, string> = {
  manual:       "text-[#017bfd] bg-[#017bfd]/8 border-[#017bfd]/20",
  software:     "text-emerald-700 bg-emerald-50 border-emerald-200",
  certificado:  "text-amber-700 bg-amber-50 border-amber-200",
  ficha:        "text-[#07080c]/45 bg-black/5 border-black/10",
}
