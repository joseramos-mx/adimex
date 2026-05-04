export type CasoVideo = {
  src: string
  title: string
  description: string
}

export type Caso = {
  slug: string
  industry: string
  placeholder?: boolean
  client: string
  location: string
  year: string
  title: string
  tagline: string
  image: string
  videos?: CasoVideo[]
  challenge: string
  solution: string
  result: string
  products: string[]
  metrics: { value: string; label: string }[]
  tags: string[]
}

export const casos: Caso[] = [
  {
    slug: "sala-bombas-monitoreo-scada-iot",
    industry: "Infraestructura",
    client: "Proyecto Confidencial",
    location: "México",
    year: "2024",
    title: "Monitoreo remoto en tiempo real de sala de bombas con SCADA 3D e IoT",
    tagline: "Sistema de supervisión IoT con visualización 3D del cuarto de bombas, alertas en tiempo real y gestión de alarmas por prioridad.",
    image: "/cases/bombas.jpg",
    videos: [
      {
        src: "https://cdn.adimex.io/video/video-presentacion.mp4",
        title: "Dashboard SCADA 3D",
        description: "Vista general del sistema de monitoreo con visualización tridimensional del cuarto de bombas",
      },
      {
        src: "https://cdn.adimex.io/video/video-diagram.mp4",
        title: "Arquitectura IoT",
        description: "Diagrama de conectividad inalámbrica y comunicación entre sensores y plataforma",
      },
      {
        src: "https://cdn.adimex.io/video/video-ejem1.mp4",
        title: "Gabinete de control",
        description: "Panel físico con PLC, HMI y módulos de E/S instalados en campo",
      },
      {
        src: "https://cdn.adimex.io/video/video-ej2.mp4",
        title: "Instalación en sitio",
        description: "Tablero de control operando en la sala de bombas real",
      },
    ],
    challenge:
      "La instalación operaba con supervisión manual intermitente: un técnico revisaba parámetros físicamente en turnos definidos. Las fallas en presión, caudal o nivel no se detectaban hasta que el sistema ya había fallado, generando cortes de suministro de agua. No existía historial de datos ni trazabilidad de alarmas.",
    solution:
      "ADIMEX implementó un sistema SCADA con visualización 3D del cuarto de bombas en tiempo real. Cuatro bombas con monitoreo individual de frecuencia y estado, sensores de presión entrada/salida, temperatura, humedad, caudal y nivel de cloro residual. Las alarmas se clasifican por prioridad (Warning, Minor, Major, Critical) con log histórico y notificaciones automáticas. El sistema se conecta vía IoT inalámbrico, eliminando cableado adicional.",
    result:
      "El equipo de operaciones pasó de revisiones cada 4 horas a visibilidad continua desde cualquier dispositivo. Las alarmas críticas ahora se detectan en segundos. El historial de datos permite análisis de tendencias para mantenimiento predictivo, reduciendo el riesgo de paros por falla imprevista.",
    products: ["FlexSCADA", "PLC FL7", "Gateway IoT Inalámbrico", "HMI FE6300"],
    metrics: [
      { value: "24/7", label: "Monitoreo continuo" },
      { value: "4",    label: "Bombas supervisadas" },
      { value: "<5 s", label: "Tiempo de detección de alarma" },
      { value: "100%", label: "Conectividad inalámbrica" },
    ],
    tags: ["Infraestructura", "SCADA", "IoT", "Bombas", "Agua", "Monitoreo remoto", "Alarmas"],
  },
  {
    slug: "placeholder-manufactura",
    industry: "Manufactura",
    placeholder: true,
    client: "",
    location: "",
    year: "",
    title: "",
    tagline: "",
    image: "",
    challenge: "",
    solution: "",
    result: "",
    products: [],
    metrics: [],
    tags: [],
  },
  {
    slug: "placeholder-energia",
    industry: "Energía",
    placeholder: true,
    client: "",
    location: "",
    year: "",
    title: "",
    tagline: "",
    image: "",
    challenge: "",
    solution: "",
    result: "",
    products: [],
    metrics: [],
    tags: [],
  },
  {
    slug: "placeholder-automotriz",
    industry: "Automotriz",
    placeholder: true,
    client: "",
    location: "",
    year: "",
    title: "",
    tagline: "",
    image: "",
    challenge: "",
    solution: "",
    result: "",
    products: [],
    metrics: [],
    tags: [],
  },
]
