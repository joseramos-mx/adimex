export type Caso = {
  slug: string
  industry: string
  client: string
  location: string
  year: string
  title: string
  tagline: string
  image: string
  challenge: string
  solution: string
  result: string
  products: string[]
  metrics: { value: string; label: string }[]
  tags: string[]
}

export const casos: Caso[] = [
  {
    slug: "tremec-servomotores-linea-ensamble",
    industry: "Automotriz",
    client: "Grupo TREMEC",
    location: "Querétaro, México",
    year: "2023",
    title: "Reducción de 35% en tiempos de ciclo en línea de ensamble automotriz",
    tagline: "Sustitución de actuadores neumáticos por servomotores FV5-E para mayor precisión y velocidad en línea de transmisiones.",
    image: "/cases/tremec.jpg",
    challenge:
      "TREMEC operaba su línea de ensamble de transmisiones con actuadores neumáticos de ciclo fijo, sin posibilidad de ajuste dinámico. Las variaciones de presión causaban rechazos del 4.2% y los tiempos de ciclo no podían reducirse sin comprometer la calidad de apriete.",
    solution:
      "ADIMEX diseñó un sistema de control de movimiento con 12 servomotores FV5-E coordinados por un PLC FL8 EtherCAT. Se programaron perfiles de velocidad y torque adaptativos por referencia de pieza, eliminando los rechazos por variación de apriete.",
    result:
      "La línea redujo su tiempo de ciclo de 48 s a 31 s, eliminó los rechazos por apriete y liberó capacidad para un turno adicional sin inversión en infraestructura. El ROI se alcanzó en 7 meses.",
    products: ["Servomotores FV5-E", "PLC FL8", "HMI FE6300"],
    metrics: [
      { value: "35%", label: "Reducción en tiempo de ciclo" },
      { value: "0%",  label: "Rechazos por apriete" },
      { value: "7 m", label: "Retorno de inversión" },
      { value: "1",   label: "Turno adicional liberado" },
    ],
    tags: ["Automotriz", "Servomotores", "Control de movimiento", "EtherCAT"],
  },
  {
    slug: "mabe-scada-visibilidad-produccion",
    industry: "Manufactura",
    client: "Mabe México",
    location: "San Luis Potosí, México",
    year: "2022",
    title: "Visibilidad total de 6 líneas de producción con FlexSCADA",
    tagline: "Integración de FlexSCADA sobre infraestructura existente para OEE en tiempo real sin parar producción.",
    image: "/cases/mabe.jpg",
    challenge:
      "Mabe operaba 6 líneas de electrodomésticos con PLCs de distintos fabricantes y sin sistema central de supervisión. Los supervisores tomaban decisiones con datos de hasta 4 horas de retraso, generando cuellos de botella invisibles y paros no programados recurrentes.",
    solution:
      "ADIMEX implementó FlexSCADA con conectores nativos para los PLCs existentes (Siemens, Allen-Bradley y FLEXEM), sin reemplazar ningún controlador. Se desarrollaron dashboards por línea, planta y turno con alertas por WhatsApp y correo para supervisores y gerencia.",
    result:
      "El OEE promedio de planta pasó de 71% a 84% en los primeros 90 días. Los paros no programados se redujeron 60% al detectar desviaciones antes de que generaran falla. La dirección ahora toma decisiones con datos en tiempo real desde cualquier dispositivo.",
    products: ["FlexSCADA", "PLC FL7"],
    metrics: [
      { value: "+13 pp", label: "OEE promedio de planta" },
      { value: "−60%",   label: "Paros no programados" },
      { value: "90 d",   label: "Para ver resultados" },
      { value: "6",      label: "Líneas integradas" },
    ],
    tags: ["Manufactura", "SCADA", "OEE", "Industria 4.0"],
  },
  {
    slug: "vitro-variadores-ahorro-energia",
    industry: "Vidrio",
    client: "Vitro Packaging",
    location: "Monterrey, México",
    year: "2023",
    title: "22% de ahorro energético en hornos de recocido con variadores FLEXEM",
    tagline: "Sustitución de arrancadores directos por variadores de frecuencia en motores de ventilación industrial.",
    image: "/cases/vitro.jpg",
    challenge:
      "Los 18 motores de ventilación de los hornos de recocido operaban a velocidad constante con arrancadores directos, consumiendo energía máxima independientemente de la carga térmica real. El costo energético representaba el 31% del costo operativo de la planta.",
    solution:
      "ADIMEX instaló variadores de frecuencia FLEXEM serie FS en los 18 motores, programados con control PID acoplado a los sensores de temperatura existentes. La velocidad de cada ventilador se ajusta automáticamente según la demanda térmica de cada zona del horno.",
    result:
      "El consumo eléctrico de la planta se redujo 22% en los primeros 6 meses, equivalente a un ahorro anual de $1.8 MXN millones. Los motores operan con menor estrés mecánico, proyectando una extensión de vida útil del 40%.",
    products: ["Variadores FS", "PLC FL7", "HMI FE6300"],
    metrics: [
      { value: "22%",   label: "Ahorro en consumo eléctrico" },
      { value: "$1.8M", label: "Ahorro anual MXN" },
      { value: "+40%",  label: "Vida útil proyectada motores" },
      { value: "18",    label: "Motores integrados" },
    ],
    tags: ["Vidrio", "Eficiencia energética", "Variadores", "Industria pesada"],
  },
  {
    slug: "cemex-plc-control-proceso",
    industry: "Cementera",
    client: "CEMEX",
    location: "Guadalajara, México",
    year: "2024",
    title: "18 meses sin paros no programados en planta cementera con PLCs FL7",
    tagline: "Migración de controladores obsoletos a PLC FL7 en ambiente de alta vibración y polvo.",
    image: "/cases/cemex.jpg",
    challenge:
      "La planta operaba con PLCs de más de 15 años sin soporte del fabricante. Los repuestos se conseguían en mercado gris, con tiempos de paro por falla de hardware de hasta 72 horas. La planta procesaba 4,000 ton/día y cada hora de paro representaba pérdidas de $180,000 MXN.",
    solution:
      "ADIMEX ejecutó una migración en caliente: instalando los PLCs FL7 en paralelo con los controladores existentes, migrando la lógica en ventanas de mantenimiento sin detener producción. Los nuevos controladores incluyen redundancia de CPU y comunicación PROFINET con el sistema SCADA existente.",
    result:
      "Cero paros no programados en 18 meses consecutivos. El tiempo de diagnóstico ante alarmas se redujo de 45 min a 3 min gracias al monitoreo remoto. La planta elimino el inventario de repuestos obsoletos, liberando $420,000 MXN en capital.",
    products: ["PLC FL7", "FlexSCADA"],
    metrics: [
      { value: "18 m",  label: "Sin paros no programados" },
      { value: "−93%",  label: "Tiempo de diagnóstico" },
      { value: "$420K", label: "Capital liberado en repuestos" },
      { value: "0 h",   label: "Paro en migración" },
    ],
    tags: ["Cementera", "PLCs", "Migración", "Alta disponibilidad"],
  },
]
