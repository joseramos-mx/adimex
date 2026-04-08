export type ProductCategory =
  | "servo"
  | "plc"
  | "hmi"
  | "iot-gateway"
  | "scada"
  | "cloud"

export type ProductSubcategory =
  | "Accionamientos servo"
  | "Motores servo"
  | "Controladores PLC"
  | "Módulos de expansión"
  | "HMI IoT"
  | "HMI Capacitiva"
  | "Web HMI"
  | "HMI Alto rendimiento"
  | "HMI Económica"
  | "HMI Integrado"
  | "Gateway industrial"
  | "Módulo IoT"
  | "Software SCADA"
  | "Plataforma Cloud"

export interface ProductSpec {
  label: string
  value: string
}

export interface Product {
  slug: string
  name: string
  series: string
  category: ProductCategory
  categoryLabel: string
  subcategory: ProductSubcategory
  tagline: string
  description: string
  image: string
  features: string[]
  specs: ProductSpec[]
  applications: string[]
  externalUrl: string
  /** Used by Shopify integration — leave undefined for static products */
  shopifyHandle?: string
}

const CDN = "https://omo-oss-image.thefastimg.com"
const D = `${CDN}/common/design/detail`
const P = `${CDN}/portal-saas/pg2024112117294648884/cms/image`

// ─── SERVO ────────────────────────────────────────────────────────────────────

const servoProducts: Product[] = [
  {
    slug: "servo-fv5-u3",
    name: "Serie FV5-U3",
    series: "FV5-U3",
    category: "servo",
    categoryLabel: "Servomotores",
    subcategory: "Accionamientos servo",
    tagline: "Servo de alto rendimiento con todas las funciones para control de movimiento exigente",
    description:
      "La Serie FV5-U3 es el servo de funciones completas de FLEXEM, orientado a manufactura de precisión con alta respuesta dinámica y posicionamiento preciso. Ofrece un ancho de banda del lazo de velocidad de 3.5 kHz, supresión de vibraciones adaptativa y conectividad Bluetooth para diagnóstico en campo.",
    image: `${D}/3ee3befb-6251-4747-8368-2e533f854785.png`,
    features: [
      "Ancho de banda del lazo de velocidad de 3.5 kHz",
      "Seguimiento de modelo, supresión de vibraciones y filtrado adaptativo",
      "Emparejamiento Bluetooth para diagnóstico y configuración móvil",
      "Función STO integrada en modelos de bus",
      "Salida de encoder y frenado dinámico estándar",
      "Soporte EtherCAT y Modbus; encoders Biss-C absolutos",
    ],
    specs: [
      { label: "Ancho de banda lazo de velocidad", value: "3.5 kHz" },
      { label: "Rango de corriente nominal", value: "1.1 – 26 Arms" },
      { label: "Rango de potencia", value: "100 W – 7500 W" },
      { label: "Modelos disponibles", value: "21 configuraciones" },
      { label: "Protocolos", value: "EtherCAT, Modbus RTU/TCP" },
      { label: "Encoders soportados", value: "ABZ incremental, Hall UVW, Biss-C absoluto" },
      { label: "Función de seguridad", value: "STO (Safe Torque Off)" },
      { label: "Conectividad adicional", value: "Bluetooth (app móvil)" },
    ],
    applications: [
      "Maquinaria de empaques",
      "Ensamble de equipos electrónicos",
      "Dispositivos 3C y semiconductores",
      "Máquinas herramienta",
      "Equipos fotovoltaicos",
      "Fabricación de baterías de litio",
    ],
    externalUrl: "https://es.flexem.com/products_detail/FV5-U3_Series.html",
  },
  {
    slug: "servo-fv5-e",
    name: "Serie FV5-E",
    series: "FV5-E",
    category: "servo",
    categoryLabel: "Servomotores",
    subcategory: "Accionamientos servo",
    tagline: "Servo de transmisión directa para manufactura de precisión micrométrica",
    description:
      "La Serie FV5-E es un servo de transmisión directa diseñado para aplicaciones de manufactura de alta precisión. Con precisión micrométrica, es ideal para semiconductores, industria 3C, equipos de medición y corte láser. Soporta múltiples tipos de encoders y protocolos de comunicación industrial.",
    image: `${D}/02e782e5-1142-4d23-9762-b8835e95b081.png`,
    features: [
      "Algoritmo de control avanzado optimizado para motores de transmisión directa",
      "Soporte para encoders ABZ incremental, Hall UVW, Biss-C, EnDat, Tamagawa y Nikon",
      "Comunicación EtherCAT y Modbus integrada",
      "Frenado dinámico estándar con resistencia de frenado interna",
      "Diagnóstico vía Bluetooth con app móvil",
      "Interfaz gráfica rediseñada con depuración paralela de múltiples máquinas",
    ],
    specs: [
      { label: "Corriente nominal", value: "3.0 – 26.0 Arms" },
      { label: "Corriente máxima de salida", value: "10.0 – 65.0 Arms" },
      { label: "Potencia (monofásico 220 V CA)", value: "400 – 1150 W" },
      { label: "Potencia (trifásico 380 V CA)", value: "1200 – 7500 W" },
      { label: "Entradas digitales", value: "5 – 8 canales" },
      { label: "Salidas digitales", value: "4 – 5 canales" },
      { label: "Interfaz de encoder", value: "CN3 / CN4 (ABZ, Hall, SSL)" },
      { label: "Protocolos de comunicación", value: "EtherCAT, Modbus RTU/TCP" },
    ],
    applications: [
      "Semiconductores y electrónica 3C",
      "Corte láser de precisión",
      "Fabricación de baterías de litio",
      "Equipos fotovoltaicos",
      "Industria de empaques",
      "Equipos de medición de precisión",
    ],
    externalUrl: "https://es.flexem.com/products_detail/FV5-E_Series.html",
  },
  {
    slug: "servo-fv5-r",
    name: "Serie FV5-R",
    series: "FV5-R",
    category: "servo",
    categoryLabel: "Servomotores",
    subcategory: "Accionamientos servo",
    tagline: "Servo rotativo de precisión con encoder absoluto multi-vuelta para transmisión y manipulación",
    description:
      "La Serie FV5-R es un accionamiento servo rotativo diseñado para ejes de transmisión y manipulación con precisión de nivel seda. Soporta encoder absoluto multi-vuelta de 17/23 bits, función de lazo cerrado completo, y conectividad EtherCAT y Modbus.",
    image: `${D}/5c24ddb0-9b87-497f-8913-824fe3f08e97.png`,
    features: [
      "Encoder absoluto multi-vuelta 17/23 bits sin necesidad de calibración",
      "Función de lazo cerrado completo (full closed-loop)",
      "Soporte EtherCAT y Modbus; entrada de pulso hasta 4M pps",
      "Frenado dinámico estándar y alimentación 24 V integrada",
      "Bluetooth para diagnóstico en campo y entrega de parámetros",
      "Algoritmos avanzados: seguimiento de modelo y supresión de vibraciones",
    ],
    specs: [
      { label: "Rango de potencia", value: "100 W – 7500 W" },
      { label: "Tensión de entrada (monofásico)", value: "200–240 V CA (±10%)" },
      { label: "Tensión de entrada (trifásico)", value: "200–240 / 380–440 V CA (±10%)" },
      { label: "Corriente nominal", value: "1.1 – 26.0 Arms" },
      { label: "Encoder", value: "ABZ, Hall, Biss-C, EnDat, Tamagawa, Nikon" },
      { label: "Protocolos", value: "EtherCAT, Modbus RTU/TCP" },
    ],
    applications: [
      "Robótica industrial",
      "Máquinas herramienta CNC",
      "Manipuladores y actuadores",
      "Equipos láser y semiconductores",
      "Automatización de ensamble",
    ],
    externalUrl: "https://es.flexem.com/products_detail/FV5-R_Series.html",
  },
  {
    slug: "servo-fv5l",
    name: "Serie FV5L",
    series: "FV5L",
    category: "servo",
    categoryLabel: "Servomotores",
    subcategory: "Accionamientos servo",
    tagline: "Servo Gantry de doble accionamiento para cargas largas en configuración maestro-esclavo",
    description:
      "La Serie FV5L es un servo de doble accionamiento tipo Gantry diseñado para cargas largas y configuraciones maestro-esclavo en electrónica, láser y máquinas herramienta de precisión. Combina alto rendimiento dinámico con supresión de vibraciones avanzada.",
    image: `${D}/02e782e5-1142-4d23-9762-b8835e95b081.png`,
    features: [
      "Configuración Gantry maestro-esclavo para cargas largas",
      "Alta respuesta, alta precisión y alta velocidad con algoritmos avanzados",
      "Interfaz gráfica de backend para depuración multi-máquina simultánea",
      "Bluetooth para diagnóstico y entrega de parámetros en campo",
    ],
    specs: [
      { label: "Topología", value: "Maestro-esclavo (Gantry)" },
      { label: "Protocolos", value: "EtherCAT, Modbus RTU/TCP" },
      { label: "Aplicación típica", value: "Equipos de doble eje sincronizado" },
    ],
    applications: [
      "Equipos láser de corte y grabado",
      "Líneas de PCB y electrónica",
      "Máquinas herramienta Gantry",
      "Equipos de inspección de alta precisión",
    ],
    externalUrl: "https://es.flexem.com/products_detail/FV5L_Series.html",
  },
  {
    slug: "servo-fv3s",
    name: "Serie FV3S",
    series: "FV3S",
    category: "servo",
    categoryLabel: "Servomotores",
    subcategory: "Accionamientos servo",
    tagline: "Servo rotativo absoluto multi-vuelta de 17/23 bits con entrada de pulsos 500K",
    description:
      "La Serie FV3S es un accionamiento servo rotativo con encoder absoluto multi-vuelta de 17/23 bits y entrada de pulsos de 500K. Solución comprobada para automatización de propósito general con comunicación RS485 integrada.",
    image: `${D}/5c24ddb0-9b87-497f-8913-824fe3f08e97.png`,
    features: [
      "Encoder absoluto multi-vuelta de 17/23 bits",
      "Entrada de pulso hasta 500K pps",
      "Comunicación RS485 integrada",
      "Amplia gama de tamaños y potencias",
    ],
    specs: [
      { label: "Tipo de encoder", value: "Absoluto multi-vuelta 17/23 bits" },
      { label: "Entrada de pulso", value: "500K pps" },
      { label: "Comunicación", value: "RS485" },
    ],
    applications: [
      "Automatización de propósito general",
      "Maquinaria de empaques",
      "Equipos de ensamble",
    ],
    externalUrl: "https://es.flexem.com/products_detail/FV3S_Series.html",
  },
  {
    slug: "servo-fv3",
    name: "Serie FV3",
    series: "FV3",
    category: "servo",
    categoryLabel: "Servomotores",
    subcategory: "Accionamientos servo",
    tagline: "Servo rotativo estándar con encoder absoluto de 17 bits y entrada de pulsos 500K",
    description:
      "La Serie FV3 es un accionamiento servo rotativo estándar con encoder absoluto de 17 bits. Ofrece una solución confiable y económica para aplicaciones de automatización general con comunicación RS485.",
    image: `${D}/5c24ddb0-9b87-497f-8913-824fe3f08e97.png`,
    features: [
      "Encoder absoluto de 17 bits",
      "Entrada de pulso hasta 500K pps",
      "Comunicación RS485 integrada",
      "Solución económica para automatización general",
    ],
    specs: [
      { label: "Tipo de encoder", value: "Absoluto 17 bits" },
      { label: "Entrada de pulso", value: "500K pps" },
      { label: "Comunicación", value: "RS485" },
    ],
    applications: [
      "Automatización de propósito general",
      "Maquinaria de bajo costo",
      "Equipos de posicionamiento básico",
    ],
    externalUrl: "https://es.flexem.com/products_detail/FV3_Series.html",
  },
  {
    slug: "servo-fd5",
    name: "Serie FD5",
    series: "FD5",
    category: "servo",
    categoryLabel: "Servomotores",
    subcategory: "Accionamientos servo",
    tagline: "Servo DC de bajo voltaje para cargas pequeñas y aplicaciones de alta precisión en AGV y empaques",
    description:
      "La Serie FD5 es un accionamiento servo DC de bajo voltaje diseñado para cargas pequeñas y aplicaciones de alta precisión como la industria de empaques y vehículos AGV. Ofrece encoder absoluto de 17/23 bits, múltiples modos de control y I/O de alta velocidad conectada directamente a FPGA.",
    image: `${D}/233d95d6-3fe1-4e32-bd65-3e54654282bb.png`,
    features: [
      "Encoder absoluto multi-vuelta 17/23 bits sin calibración",
      "Soporte EtherCAT y Modbus para integración industrial",
      "Control de torque, velocidad, posición y fuerza (lazo abierto/cerrado)",
      "I/O de alta velocidad con aislamiento por optoacoplador conectada a FPGA",
    ],
    specs: [
      { label: "Alimentación", value: "12 – 64 VDC" },
      { label: "Corriente nominal", value: "3.0 – 10.0 A" },
      { label: "Ancho de banda (torque)", value: "4.5 kHz" },
      { label: "Ancho de banda (velocidad)", value: "3 kHz" },
      { label: "Interfaz de encoder", value: "RS485 (Tamagawa, FLEXEM, Biss-C); ABZ diferencial" },
      { label: "Dimensiones", value: "57.5 × 75.5 × 25.4 mm" },
      { label: "Protocolos", value: "EtherCAT, Modbus RTU/TCP" },
    ],
    applications: [
      "Vehículos AGV y AMR",
      "Empaques de alta velocidad",
      "Robótica colaborativa",
      "Equipos médicos y de laboratorio",
      "Automatización de precisión en espacio reducido",
    ],
    externalUrl: "https://es.flexem.com/products_detail/FD5_Series.html",
  },
  {
    slug: "servo-motor-ac",
    name: "Servomotor AC de Alto Voltaje",
    series: "EAM/ECM",
    category: "servo",
    categoryLabel: "Servomotores",
    subcategory: "Motores servo",
    tagline: "Motores servo AC de 220V/380V con rango de potencia 50W–7.5kW y protección IP67",
    description:
      "Gama completa de servomotores AC de alto voltaje con series EAM (alta inercia) y ECM (uso general). Disponibles en bridas de 40 mm a 180 mm, potencias de 50W a 7.5kW, con encoders de 17/23 bits y protección IP67. Capacidad de sobrecarga de hasta 3.5×.",
    image: `${D}/5c24ddb0-9b87-497f-8913-824fe3f08e97.png`,
    features: [
      "Series EAM y ECM con baja, media y alta inercia",
      "Bridas de 40mm a 180mm, potencias de 50W a 7.5kW",
      "Encoders de alta precisión 17/23 bits con protección IP67",
      "Capacidad de sobrecarga de hasta 3.5×",
    ],
    specs: [
      { label: "Opciones de voltaje", value: "220 V / 380 V" },
      { label: "Rango de potencia", value: "50 W – 7500 W" },
      { label: "Torque nominal", value: "0.16 – 48.0 Nm" },
      { label: "Torque máximo", value: "Hasta 120.0 Nm" },
      { label: "Velocidad nominal", value: "1500 – 3000 rpm" },
      { label: "Velocidad máxima", value: "Hasta 6000 rpm" },
      { label: "Protección", value: "IP67" },
      { label: "Bridas", value: "40, 60, 80, 110, 130, 180 mm" },
    ],
    applications: [
      "Máquinas herramienta CNC",
      "Robótica industrial",
      "Maquinaria de empaques",
      "Equipos de semiconductores",
      "Automatización de manufactura general",
    ],
    externalUrl: "https://es.flexem.com/products_detail/High-Voltage_AC_Servo_Motor.html",
  },
  {
    slug: "servo-motor-dc",
    name: "Servomotor DC de Bajo Voltaje",
    series: "EAM",
    category: "servo",
    categoryLabel: "Servomotores",
    subcategory: "Motores servo",
    tagline: "Motor servo rotativo de bajo voltaje 50W–400W con protección IP67 para aplicaciones compactas",
    description:
      "Servomotores DC de bajo voltaje para aplicaciones compactas que requieren alta precisión en espacio reducido. Disponibles en potencias de 50W a 400W con protección IP67, compatibles con la serie FD5 de accionamientos.",
    image: `${D}/233d95d6-3fe1-4e32-bd65-3e54654282bb.png`,
    features: [
      "Rango de potencia 50W – 400W",
      "Protección IP67 para entornos industriales",
      "Compatible con accionamientos FD5",
      "Diseño compacto para espacios reducidos",
    ],
    specs: [
      { label: "Rango de potencia", value: "50 W – 400 W" },
      { label: "Protección", value: "IP67" },
      { label: "Tipo", value: "Servo rotativo DC de bajo voltaje" },
    ],
    applications: [
      "AGV y AMR",
      "Robótica colaborativa",
      "Equipos médicos",
      "Automatización compacta",
    ],
    externalUrl: "https://es.flexem.com/products_detail/Low-Voltage_DC_Servo_Motor.html",
  },
]

// ─── PLC ──────────────────────────────────────────────────────────────────────

const plcProducts: Product[] = [
  {
    slug: "plc-fl8",
    name: "Serie FL8",
    series: "FL8",
    category: "plc",
    categoryLabel: "PLCs",
    subcategory: "Controladores PLC",
    tagline: "PLC de mediano tamaño con bus EtherCAT integrado y hasta 32 ejes de movimiento",
    description:
      "La Serie FL8 es un PLC inteligente de mediano tamaño basado en la plataforma CODESYS con arquitectura IEC 61131-3. Integra bus de movimiento EtherCAT de alta velocidad, puertos Ethernet y serie, y soporta OPC UA y Modbus para integración seamless con sistemas superiores.",
    image: `${P}/99a54598-d41e-4c12-be0f-9d654ff8fb5e.png`,
    features: [
      "Cumple el estándar internacional IEC 61131-3",
      "Bus de movimiento EtherCAT integrado de alta velocidad",
      "Programación orientada a objetos",
      "I/O de alta velocidad y comunicación CANopen integrada",
      "Arquitectura de sistema distribuido",
      "Soporte OPC UA y Modbus TCP/RTU",
    ],
    specs: [
      { label: "Procesador", value: "Quad-core 1 GHz" },
      { label: "Memoria RAM", value: "1 GB (E8) / 2 GB (E16/E32)" },
      { label: "Almacenamiento", value: "4 GB (E8) / 8 GB (E16/E32)" },
      { label: "Ejes EtherCAT", value: "8 / 16 / 32 ejes + ejes de pulso" },
      { label: "Ejes de pulso", value: "6 ejes @ 200 kHz" },
      { label: "Esclavos EtherCAT", value: "Hasta 72 esclavos" },
      { label: "I/O por defecto", value: "8 entradas + 8 salidas NPN" },
      { label: "Módulos de expansión", value: "Hasta 31 módulos" },
      { label: "Puertos Ethernet", value: "2 × 100 M" },
      { label: "Puertos serie", value: "2 × RS485" },
      { label: "Protocolos", value: "EtherCAT, Modbus TCP/RTU, CANopen, OPC UA" },
      { label: "Lenguajes de programación", value: "IL, LD, ST, SFC, CFC, FBD" },
    ],
    applications: [
      "Automatización industrial avanzada",
      "Maquinaria de empaques",
      "Semiconductores y electrónica",
      "Máquinas herramienta CNC",
      "Fabricación de baterías de litio",
      "Sistemas SCADA",
    ],
    externalUrl: "https://es.flexem.com/products_detail/FL8_Series.html",
  },
  {
    slug: "plc-fl7",
    name: "Serie FL7",
    series: "FL7",
    category: "plc",
    categoryLabel: "PLCs",
    subcategory: "Controladores PLC",
    tagline: "PLC CODESYS para control de bus y movimiento multi-eje hasta 32 ejes simultáneos",
    description:
      "La Serie FL7 está diseñada para aplicaciones complejas de automatización mecánica y control de movimiento multi-eje. Integra funciones de entrada/salida de pulso de alta velocidad, soporte para múltiples algoritmos de interpolación, leva electrónica y control simultáneo de hasta 32 ejes.",
    image: `${P}/9b4c8cda-3b31-4a27-8492-a71eec09963e.jpg`,
    features: [
      "Control de movimiento multi-eje hasta 32 ejes simultáneos",
      "Entrada/salida de pulso de alta velocidad (PTO/HSC)",
      "Soporte para múltiples algoritmos de interpolación",
      "Leva electrónica integrada",
      "Compatible con CODESYS",
      "Doble canal RS485 + Ethernet",
    ],
    specs: [
      { label: "Modelos base", value: "FL721-0808N-D, FL721-0808P-D, FL721-0806R-D" },
      { label: "Alimentación", value: "24 V DC" },
      { label: "Entradas digitales", value: "8 puntos (transistor bidireccional)" },
      { label: "Contador de alta velocidad (HSC)", value: "8 puntos; 4 canales AB @ 200 kHz" },
      { label: "Salidas digitales", value: "8 NPN / 8 PNP / 6 relé" },
      { label: "Salida de pulso (PTO)", value: "8 puntos, 4 ejes @ 200 kHz" },
      { label: "Ejes máximos", value: "32 ejes simultáneos" },
      { label: "Comunicación", value: "2 × RS485, 1 × Ethernet" },
    ],
    applications: [
      "Maquinaria de empaques",
      "Ensamble de equipos electrónicos",
      "Dispositivos 3C",
      "Procesamiento de semiconductores",
      "Máquinas herramienta",
      "Fabricación de baterías de litio",
    ],
    externalUrl: "https://es.flexem.com/products_detail/Serie_FL7.html",
  },
  {
    slug: "plc-fl6",
    name: "Serie FL6",
    series: "FL6",
    category: "plc",
    categoryLabel: "PLCs",
    subcategory: "Controladores PLC",
    tagline: "PLC CODESYS de mediano tamaño con EtherCAT, hasta 64 ejes y CPU quad-core 1.5 GHz",
    description:
      "La Serie FL6 es un controlador inteligente de mediano tamaño desarrollado en la plataforma CODESYS con arquitectura IEC61131-3. Soporta múltiples buses de campo, control de movimiento sincronizado y programación orientada a objetos. Disponible en configuraciones de 16, 32 y 64 ejes.",
    image: `${D}/7ddf260e-2537-4752-bc6f-3387b54a183b.png`,
    features: [
      "Cumple el estándar internacional IEC 61131-3",
      "Bus de movimiento EtherCAT de alta velocidad integrado",
      "Programación orientada a objetos",
      "Comunicación CANopen integrada",
      "CPU quad-core de 1.5 GHz con 2 GB RAM y 8 GB almacenamiento",
      "Soporte para múltiples buses de campo",
    ],
    specs: [
      { label: "CPU", value: "4 núcleos @ 1.5 GHz" },
      { label: "Memoria RAM", value: "2 GB" },
      { label: "Almacenamiento", value: "8 GB" },
      { label: "Capacidad de ejes", value: "16 / 32 / 64 ejes" },
      { label: "Capacidad del programa", value: "32 MB" },
      { label: "Alimentación", value: "DC 24V (-25% a +20%)" },
      { label: "Temperatura de operación", value: "-20°C a +60°C" },
      { label: "Protocolos", value: "EtherCAT, CANopen, Modbus" },
    ],
    applications: [
      "Automatización de alta complejidad",
      "Líneas de producción multi-eje",
      "Equipos CNC avanzados",
      "Robótica industrial",
      "Semiconductores y electrónica de precisión",
    ],
    externalUrl: "https://es.flexem.com/products_detail/FL6_Series.html",
  },
  {
    slug: "plc-f5",
    name: "Serie F5",
    series: "F5",
    category: "plc",
    categoryLabel: "PLCs",
    subcategory: "Controladores PLC",
    tagline: "PLC compacto y económico con plataforma FS unificada, leva electrónica e IoT integrable",
    description:
      "La Serie F5 es un PLC compacto basado en la plataforma propietaria FS-unified de FLEXEM con arquitectura IEC61131-3. Incluye funciones de leva electrónica, engranaje, interpolación y conectividad IoT mediante módulo instalable para monitoreo remoto en la nube.",
    image: `${P}/a622dcab-06de-40e3-bf89-d1dd36969fdd.png`,
    features: [
      "Leva electrónica, engranaje e interpolación para control de movimiento avanzado",
      "Programación en LD y ST mediante software FStudio",
      "Conectividad IoT mediante módulo instalable para monitoreo cloud",
      "Soporte Modbus-RTU/TCP con configuración múltiple de esclavos",
    ],
    specs: [
      { label: "Puntos de I/O", value: "20 / 30 / 40 puntos (modelos disponibles)" },
      { label: "Entradas de alta velocidad (F5M)", value: "7 puntos @ 100 kHz" },
      { label: "Salidas de alta velocidad (F5M)", value: "6 puntos @ 100 kHz" },
      { label: "Comunicación", value: "USB Type-C, RS232/RS485, 1× Ethernet RJ45" },
      { label: "Módulos de expansión", value: "Hasta 31 módulos de I/O" },
      { label: "Protocolos", value: "Modbus RTU/TCP, IoT cloud (con módulo)" },
    ],
    applications: [
      "Maquinaria compacta de bajo costo",
      "Empaques y dosificadores",
      "Equipos de ensamble sencillos",
      "AGV y sistemas de transporte",
      "Aplicaciones IoT industriales",
    ],
    externalUrl: "https://es.flexem.com/products_detail/F5.html",
  },
  {
    slug: "plc-fr-remote-io",
    name: "Módulo FR de E/S Remotas (D)",
    series: "FR",
    category: "plc",
    categoryLabel: "PLCs",
    subcategory: "Módulos de expansión",
    tagline: "Módulo de extensión de E/S remotas para arquitecturas distribuidas con la Serie FR",
    description:
      "El Módulo de Extensión de E/S Remotas Serie FR (D) permite construir arquitecturas de control distribuido conectando I/O remotas a controladores FLEXEM a través del bus EtherCAT u otros protocolos de comunicación.",
    image: `${P}/99a54598-d41e-4c12-be0f-9d654ff8fb5e.png`,
    features: [
      "E/S remotas para arquitecturas distribuidas",
      "Compatible con controladores FLEXEM FL6/FL7/FL8",
      "Configuración modular y flexible",
      "Terminales extraíbles para mantenimiento sencillo",
    ],
    specs: [
      { label: "Tipo", value: "Módulo de E/S remotas distribuidas" },
      { label: "Compatible con", value: "Serie FL6, FL7, FL8" },
    ],
    applications: ["Control distribuido", "Líneas de producción extendidas", "Arquitecturas multi-nodo"],
    externalUrl: "https://es.flexem.com/products_detail/FR_Series_Remote_IOExtension_Module-D.html",
  },
  {
    slug: "plc-fr-coupler",
    name: "Acoplador de E/S Remoto Serie FR",
    series: "FR",
    category: "plc",
    categoryLabel: "PLCs",
    subcategory: "Módulos de expansión",
    tagline: "Acoplador para sistemas de E/S remotas distribuidas Serie FR",
    description:
      "El Acoplador de E/S Remoto Serie FR actúa como nodo maestro en arquitecturas de E/S distribuidas, conectando módulos de expansión remotos a la red de control principal.",
    image: `${P}/99a54598-d41e-4c12-be0f-9d654ff8fb5e.png`,
    features: [
      "Nodo maestro para E/S distribuidas",
      "Compatible con módulos de expansión Serie FR",
      "Instalación en carril DIN",
      "Configuración flexible del bus",
    ],
    specs: [{ label: "Tipo", value: "Acoplador de bus para E/S remotas" }],
    applications: ["Control distribuido en planta", "Redes de E/S extendidas"],
    externalUrl: "https://es.flexem.com/products_detail/FR_Series_Remote_IO--Coupler.html",
  },
  {
    slug: "plc-f5-expansion",
    name: "Placa de Expansión PLC Serie F5",
    series: "F5",
    category: "plc",
    categoryLabel: "PLCs",
    subcategory: "Módulos de expansión",
    tagline: "Placa de expansión de I/O para ampliar la capacidad de los PLCs Serie F5",
    description:
      "La Placa de Expansión PLC Serie F5 permite ampliar la cantidad de puntos de E/S de los controladores F5, con combinación modular y configuración flexible para adaptarse a diferentes aplicaciones.",
    image: `${P}/a622dcab-06de-40e3-bf89-d1dd36969fdd.png`,
    features: [
      "Combinación modular y configuración flexible",
      "Terminales extraíbles para fácil mantenimiento",
      "Compatible con Series F5 y F5M",
      "Hasta 31 módulos de expansión soportados",
    ],
    specs: [{ label: "Compatible con", value: "Serie F5, F5M" }, { label: "Módulos máximos", value: "31" }],
    applications: ["Expansión de I/O en sistemas F5", "Aplicaciones con múltiples señales"],
    externalUrl: "https://es.flexem.com/products_detail/F5_Series_PLC_Expansion_Board.html",
  },
  {
    slug: "plc-temp-module",
    name: "Módulos de Expansión de Temperatura",
    series: "FL/F5",
    category: "plc",
    categoryLabel: "PLCs",
    subcategory: "Módulos de expansión",
    tagline: "Módulos de expansión para medición y control de temperatura en PLCs FLEXEM",
    description:
      "Módulos de expansión de temperatura compatibles con las series de PLCs FLEXEM para la adquisición de señales de termopares, RTD y otros sensores de temperatura.",
    image: `${P}/99a54598-d41e-4c12-be0f-9d654ff8fb5e.png`,
    features: [
      "Soporte para termopares tipo J, K, T, E, R, S, B",
      "Soporte para sensores RTD (PT100, PT1000)",
      "Terminales extraíbles",
      "Compatible con series FL y F5",
    ],
    specs: [{ label: "Señales soportadas", value: "Termopares J/K/T/E/R/S/B, PT100, PT1000" }],
    applications: ["Control de temperatura en hornos", "Monitoreo térmico de procesos", "Industria alimentaria y química"],
    externalUrl: "https://es.flexem.com/products_detail/Temperature_Expansion_Modules.html",
  },
  {
    slug: "plc-analog-module",
    name: "Módulo de Expansión Analógica",
    series: "FL/F5",
    category: "plc",
    categoryLabel: "PLCs",
    subcategory: "Módulos de expansión",
    tagline: "Módulo de expansión analógica para entradas y salidas de señal continua",
    description:
      "Módulo de expansión de señales analógicas para PLCs FLEXEM. Soporta entradas y salidas de corriente y voltaje para control de variadores, válvulas proporcionales y adquisición de sensores analógicos.",
    image: `${P}/99a54598-d41e-4c12-be0f-9d654ff8fb5e.png`,
    features: [
      "Entradas analógicas 0–10V / 4–20mA",
      "Salidas analógicas 0–10V / 4–20mA",
      "Resolución de 12 bits",
      "Compatible con series FL y F5",
    ],
    specs: [{ label: "Rango de entrada", value: "0–10V / 4–20mA" }, { label: "Resolución", value: "12 bits" }],
    applications: ["Control de variadores de frecuencia", "Válvulas proporcionales", "Adquisición de sensores analógicos"],
    externalUrl: "https://es.flexem.com/products_detail/Analog_Expansion_Module.html",
  },
  {
    slug: "plc-digital-module",
    name: "Módulo de Expansión Digital",
    series: "FL/F5",
    category: "plc",
    categoryLabel: "PLCs",
    subcategory: "Módulos de expansión",
    tagline: "Módulo de E/S digitales para ampliar puntos de control en PLCs FLEXEM",
    description:
      "Módulo de expansión de entradas y salidas digitales para PLCs FLEXEM. Combinación modular y configuración flexible con terminales extraíbles. Soporta configuraciones NPN/PNP y salidas de relé.",
    image: `${P}/99a54598-d41e-4c12-be0f-9d654ff8fb5e.png`,
    features: [
      "Entradas digitales NPN/PNP",
      "Salidas de transistor y relé disponibles",
      "Terminales extraíbles para mantenimiento",
      "Combinación modular y configuración flexible",
    ],
    specs: [
      { label: "Tipo de entradas", value: "NPN/PNP" },
      { label: "Tipo de salidas", value: "Transistor NPN/PNP, Relé" },
    ],
    applications: ["Expansión de I/O digital", "Control de actuadores y sensores adicionales"],
    externalUrl: "https://es.flexem.com/products_detail/Digital_Expansion_Module.html",
  },
  {
    slug: "plc-f5-iot-module",
    name: "Módulo IoT PLC Serie F5",
    series: "F5",
    category: "plc",
    categoryLabel: "PLCs",
    subcategory: "Módulos de expansión",
    tagline: "Módulo de expansión IoT para conectar PLCs Serie F5 a la nube FLEXEM",
    description:
      "El Módulo IoT PLC Serie F5 se instala directamente en el PLC F5 para habilitar conectividad cloud, monitoreo remoto de datos y gestión de dispositivos desde la plataforma FlexCloud sin modificar el programa de control existente.",
    image: `${P}/a622dcab-06de-40e3-bf89-d1dd36969fdd.png`,
    features: [
      "Conectividad 4G/WiFi para PLCs Serie F5",
      "Monitoreo remoto en FlexCloud sin cambiar el programa PLC",
      "Configuración sencilla desde FStudio",
      "Soporte MQTT para publicación y suscripción de datos",
    ],
    specs: [
      { label: "Compatible con", value: "Serie F5, F5M" },
      { label: "Conectividad", value: "4G LTE / WiFi" },
      { label: "Protocolo cloud", value: "MQTT" },
    ],
    applications: ["Monitoreo remoto de máquinas F5", "Integración con FlexCloud", "Industria 4.0 en equipos existentes"],
    externalUrl: "https://es.flexem.com/products_detail/F5_Series_PLC_IoT_Expansion_Module.html",
  },
]

// ─── HMI ──────────────────────────────────────────────────────────────────────

const hmiProducts: Product[] = [
  {
    slug: "hmi-fe6300",
    name: "Serie FE6300",
    series: "FE6300",
    category: "hmi",
    categoryLabel: "HMI",
    subcategory: "HMI IoT",
    tagline: "HMI IoT industrial 7\"/10.1\" con módulo FLink2 intercambiable y 3000 etiquetas",
    description:
      "La Serie FE6300 son pantallas HMI industriales IoT con pantalla táctil TFT LCD de 7\" y 10.1\", procesador dual-core Cortex-A7 a 1 GHz y conectividad flexible mediante módulo FLink2 intercambiable. Soportan 3,000 etiquetas y están disponibles con certificación CE, RoHS y UL.",
    image: `${D}/64205bb5-84a0-471c-88ee-91b6ad585cb1.png`,
    features: [
      "Pantalla TFT LCD táctil resistiva, 24 bits de color, relación 16:9",
      "Procesador dual-core Cortex-A7 @ 1 GHz",
      "Módulo FLink2 IoT intercambiable para conectividad flexible",
      "Soporte de 3,000 etiquetas/tags",
      "Almacenamiento de 4 GB",
      "Certificaciones CE, RoHS; modelos UL disponibles",
    ],
    specs: [
      { label: "Tamaños de pantalla", value: "7\" (1024×600) / 10.1\" (1024×600 o 800×480)" },
      { label: "Tipo de pantalla", value: "TFT LCD táctil resistiva, 24 bits" },
      { label: "Procesador", value: "Dual-core Cortex-A7 @ 1 GHz" },
      { label: "Almacenamiento", value: "4 GB" },
      { label: "Etiquetas soportadas", value: "3,000 tags" },
      { label: "Conectividad", value: "Ethernet (modelos -E) + módulo FLink2 IoT" },
      { label: "Certificaciones", value: "CE, RoHS, UL (modelos -UL)" },
    ],
    applications: [
      "Control de maquinaria industrial",
      "Monitoreo de líneas de producción",
      "Integración con sistemas IoT y SCADA",
      "Industria alimentaria y farmacéutica",
      "Equipos de empaques y manufactura",
    ],
    externalUrl: "https://es.flexem.com/products_list/FE6300_Series.html",
  },
  {
    slug: "hmi-f01",
    name: "Serie F0/1",
    series: "F0/1",
    category: "hmi",
    categoryLabel: "HMI",
    subcategory: "HMI Capacitiva",
    tagline: "HMI con pantalla capacitiva multi-touch y soporte de 3000 etiquetas",
    description:
      "La Serie F0/1 son HMIs con pantalla táctil capacitiva multi-touch que ofrecen una experiencia de operación similar a dispositivos de consumo. Soportan 3,000 etiquetas y están diseñadas para entornos industriales exigentes.",
    image: `${D}/64205bb5-84a0-471c-88ee-91b6ad585cb1.png`,
    features: [
      "Pantalla táctil capacitiva multi-touch",
      "3,000 etiquetas de datos soportadas",
      "Diseño industrial robusto",
      "Interfaz intuitiva similar a dispositivos modernos",
    ],
    specs: [{ label: "Tipo de pantalla", value: "Táctil capacitiva multi-touch" }, { label: "Etiquetas", value: "3,000 tags" }],
    applications: ["Control de maquinaria", "Supervisión de procesos", "Interfaces operador de alta usabilidad"],
    externalUrl: "https://es.flexem.com/products_list/F0/1_Series.html",
  },
  {
    slug: "hmi-fpad",
    name: "FPad",
    series: "FPad",
    category: "hmi",
    categoryLabel: "HMI",
    subcategory: "Web HMI",
    tagline: "Web HMI inteligente con etiquetas ilimitadas y acceso desde cualquier navegador",
    description:
      "El FPad es una HMI Web inteligente que permite acceso desde cualquier navegador con etiquetas ilimitadas. Combina las capacidades de una HMI industrial con la flexibilidad de la interfaz web para monitoreo y control remoto.",
    image: `${D}/64205bb5-84a0-471c-88ee-91b6ad585cb1.png`,
    features: [
      "Acceso desde cualquier navegador web",
      "Etiquetas ilimitadas",
      "Monitoreo y control remoto",
      "Compatible con FlexSCADA y FlexCloud",
    ],
    specs: [{ label: "Tipo", value: "Web HMI" }, { label: "Etiquetas", value: "Ilimitadas" }, { label: "Acceso", value: "Navegador web" }],
    applications: ["Supervisión remota de planta", "Paneles web de control", "Integración con sistemas SCADA"],
    externalUrl: "https://es.flexem.com/products_list/FPad_Series.html",
  },
  {
    slug: "hmi-fe9000",
    name: "Serie FE9000",
    series: "FE9000",
    category: "hmi",
    categoryLabel: "HMI",
    subcategory: "HMI Alto rendimiento",
    tagline: "HMI de alto rendimiento con etiquetas ilimitadas para aplicaciones exigentes",
    description:
      "La Serie FE9000 es una HMI de alto rendimiento con etiquetas ilimitadas, diseñada para aplicaciones industriales exigentes que requieren procesamiento rápido, grandes proyectos de visualización y máxima confiabilidad.",
    image: `${D}/64205bb5-84a0-471c-88ee-91b6ad585cb1.png`,
    features: [
      "Etiquetas ilimitadas para grandes proyectos",
      "Alto rendimiento de procesamiento",
      "Diseño industrial de alta confiabilidad",
      "Amplia compatibilidad de protocolos",
    ],
    specs: [{ label: "Etiquetas", value: "Ilimitadas" }, { label: "Serie", value: "FE9000" }],
    applications: ["Aplicaciones industriales de alta complejidad", "Paneles de control principales", "Sistemas SCADA integrados"],
    externalUrl: "https://es.flexem.com/products_list/FE9000_Series.html",
  },
  {
    slug: "hmi-fe7000",
    name: "Serie FE7000",
    series: "FE7000",
    category: "hmi",
    categoryLabel: "HMI",
    subcategory: "HMI IoT",
    tagline: "HMI IoT con certificación UL y soporte de 1000 etiquetas para el mercado norteamericano",
    description:
      "La Serie FE7000 es una HMI IoT con certificación UL Listed diseñada específicamente para el mercado norteamericano. Soporta 1,000 etiquetas y ofrece conectividad IoT para integración con plataformas en la nube.",
    image: `${D}/64205bb5-84a0-471c-88ee-91b6ad585cb1.png`,
    features: [
      "Certificación UL Listed para mercado norteamericano",
      "Conectividad IoT integrada",
      "1,000 etiquetas de datos soportadas",
      "Diseño industrial robusto",
    ],
    specs: [{ label: "Etiquetas", value: "1,000 tags" }, { label: "Certificación", value: "UL Listed" }, { label: "Conectividad", value: "IoT (4G/WiFi)" }],
    applications: ["Equipos para mercado norteamericano", "Plantas con requisito UL", "Automatización IoT certificada"],
    externalUrl: "https://es.flexem.com/products_list/FE7000_Series.html",
  },
  {
    slug: "hmi-fe3300",
    name: "Serie FE3300",
    series: "FE3300",
    category: "hmi",
    categoryLabel: "HMI",
    subcategory: "HMI Económica",
    tagline: "HMI resistiva económica para aplicaciones básicas de visualización y control",
    description:
      "La Serie FE3300 es una HMI táctil resistiva económica diseñada para aplicaciones básicas de visualización donde se prioriza el costo sobre las funciones avanzadas. Solución de entrada para modernizar paneles de control existentes.",
    image: `${D}/64205bb5-84a0-471c-88ee-91b6ad585cb1.png`,
    features: [
      "Pantalla táctil resistiva de bajo costo",
      "Solución económica para modernización de paneles",
      "Diseño robusto para entornos industriales",
      "Configuración sencilla",
    ],
    specs: [{ label: "Tipo de pantalla", value: "Táctil resistiva" }, { label: "Etiquetas", value: "Sin etiquetas de datos" }],
    applications: ["Paneles de control básicos", "Modernización de equipos existentes", "Aplicaciones de bajo presupuesto"],
    externalUrl: "https://es.flexem.com/products_list/FE3300_Series.html",
  },
  {
    slug: "hmi-plc-integrado",
    name: "PLC HMI Integrado",
    series: "PLC HMI",
    category: "hmi",
    categoryLabel: "HMI",
    subcategory: "HMI Integrado",
    tagline: "Todo en uno: PLC y HMI integrados en un mismo dispositivo compacto",
    description:
      "El PLC HMI Integrado combina un controlador lógico programable y una pantalla HMI en un único dispositivo compacto, reduciendo costos de cableado, espacio en gabinete y tiempo de instalación.",
    image: `${D}/64205bb5-84a0-471c-88ee-91b6ad585cb1.png`,
    features: [
      "PLC y HMI en un único dispositivo",
      "Reduce costos de cableado y espacio en gabinete",
      "Instalación y configuración simplificada",
      "Ideal para máquinas compactas",
    ],
    specs: [{ label: "Tipo", value: "All-in-one PLC + HMI" }],
    applications: ["Máquinas compactas", "Equipos autónomos", "Aplicaciones con espacio reducido"],
    externalUrl: "https://es.flexem.com/products_list/PLC_HMI.html",
  },
]

// ─── IoT GATEWAY ──────────────────────────────────────────────────────────────

const iotProducts: Product[] = [
  {
    slug: "iot-fbox",
    name: "Serie FBox",
    series: "FBox",
    category: "iot-gateway",
    categoryLabel: "IoT Gateway",
    subcategory: "Gateway industrial",
    tagline: "Gateway industrial inteligente para adquisición remota de datos y mantenimiento en campo",
    description:
      "La Serie FBox es una terminal inteligente de adquisición de datos en sitio para plataformas IoT industriales. Permite recopilación remota de datos, actualización de software y mantenimiento de dispositivos sin configuración local. Soporta más de 400 protocolos industriales.",
    image: `${D}/f64780a2-1790-4675-91c1-7a2f5ac5deee.png`,
    features: [
      "Soporte para más de 400 protocolos de dispositivos industriales",
      "Conexión por Ethernet, GPRS, 3G y 4G sin configuración local",
      "Descarga de programas y monitoreo en línea remotos",
      "Caché offline con sincronización automática al reconectarse",
      "Cómputo en el borde con programación de scripts",
      "Transmisión cifrada, validación de acceso y autorización por roles",
    ],
    specs: [
      { label: "Procesador", value: "ARM Cortex-A8 @ 600 MHz" },
      { label: "Memoria", value: "128 MB Flash + 128 MB DDR3" },
      { label: "Red (FBox-4G-G)", value: "Ethernet + 4G LTE" },
      { label: "Red (FBox-WiFi)", value: "Ethernet + Wi-Fi 802.11b/g/n" },
      { label: "Puertos serie", value: "RS232 / RS485 / RS422" },
      { label: "Puertos Ethernet", value: "3 × 10M/100M" },
      { label: "I/O digital", value: "2 entradas aisladas + 2 salidas relé (5 A)" },
      { label: "Almacenamiento adicional", value: "Ranura SD + USB 2.0" },
      { label: "Consumo de energía", value: "< 5 W (DC 24 V, rango 9–28 V)" },
      { label: "Temperatura de operación", value: "-10 a 60 °C" },
      { label: "Dimensiones", value: "130 × 94 × 48 mm" },
      { label: "Puntos de monitoreo", value: "500 (4G) / 300 (WiFi)" },
    ],
    applications: [
      "Monitoreo remoto de maquinaria industrial",
      "Gestión de energía y utilidades",
      "Integración de equipos legados a plataformas cloud",
      "Mantenimiento predictivo en campo",
      "Industria 4.0 y digitalización de plantas",
    ],
    externalUrl: "https://es.flexem.com/products_detail/FBox_Series.html",
  },
  {
    slug: "iot-fbox-lite",
    name: "Serie FBox-lite",
    series: "FBox-lite",
    category: "iot-gateway",
    categoryLabel: "IoT Gateway",
    subcategory: "Gateway industrial",
    tagline: "Gateway IoT económico y compacto para pequeños proyectos industriales y cómputo en el borde",
    description:
      "La Serie FBox-lite es un gateway IoT industrial ligero y económico diseñado para pequeños proyectos industriales y escenarios de cómputo en el borde. Ofrece recopilación de datos y gestión remota de controladores industriales convencionales con un factor de forma compacto.",
    image: `${D}/f64780a2-1790-4675-91c1-7a2f5ac5deee.png`,
    features: [
      "Configuración sencilla sin ajuste local — solo conectar Ethernet, GPRS, 3G o 4G",
      "Soporte para más de 400 protocolos de dispositivos industriales",
      "Monitoreo remoto vía web, app móvil y WeChat",
      "Caché de datos offline con sincronización automática",
    ],
    specs: [
      { label: "Procesador", value: "ARM9, 300 MHz" },
      { label: "Memoria", value: "128 MB Flash + 64 MB DDR3" },
      { label: "Red", value: "Ethernet 10M/100M + 4G LTE" },
      { label: "Puertos serie", value: "COM1 (RS232/RS485/RS422), COM3 (RS232)" },
      { label: "Consumo de energía", value: "< 5 W (DC 9–28 V)" },
      { label: "Puntos de monitoreo", value: "300 datos / 30 alarmas / 60 históricos" },
      { label: "Retención de datos", value: "180 días" },
      { label: "Dimensiones", value: "90 × 75 × 25 mm" },
    ],
    applications: [
      "Proyectos industriales pequeños y medianos",
      "Modernización de equipos legados",
      "Monitoreo de múltiples sitios remotos",
      "Integración con FlexCloud",
    ],
    externalUrl: "https://es.flexem.com/products_detail/FBox-lite_Series.html",
  },
  {
    slug: "iot-flink2",
    name: "Serie FLink2",
    series: "FLink2",
    category: "iot-gateway",
    categoryLabel: "IoT Gateway",
    subcategory: "Módulo IoT",
    tagline: "Módulo IoT para HMI Serie 6300 con conectividad 4G/WiFi hot-swap",
    description:
      "La Serie FLink2 es un módulo IoT de acceso que se conecta a las HMIs Serie FE6300 de FLEXEM para habilitar gestión remota de dispositivos a través de la plataforma IoT de FLEXEM. Admite modelos 4G, WiFi y combinado, con instalación hot-swap en la ranura trasera.",
    image: `${D}/30a9c6ea-cda1-4204-aacb-972d17a66037.png`,
    features: [
      "Opciones de conectividad: 4G, WiFi y combinado 4G+WiFi",
      "Instalación hot-swap en ranura trasera oculta de la HMI",
      "Soporte de protocolo MQTT para publicación y suscripción de datos",
      "Compatible con más de 400 protocolos industriales",
    ],
    specs: [
      { label: "Conectividad", value: "4G LTE / WiFi 802.11b/g/n / Combo" },
      { label: "Instalación", value: "Hot-swap en ranura trasera HMI FE6300" },
      { label: "Red (FLink2-WiFi)", value: "Ethernet + WiFi" },
      { label: "Temperatura de operación", value: "-10 a 60 °C" },
      { label: "Dimensiones (FLink2-WiFi)", value: "37 × 62 × 15.3 mm" },
      { label: "Puntos de monitoreo", value: "300 datos / 100 alarmas" },
      { label: "Protocolo cloud", value: "MQTT" },
    ],
    applications: [
      "Gestión remota de HMIs FE6300",
      "Integración de HMI con FlexCloud",
      "Monitoreo IoT de equipos con HMI FLEXEM",
    ],
    externalUrl: "https://es.flexem.com/products_detail/FLink2_Series.html",
  },
]

// ─── SCADA ────────────────────────────────────────────────────────────────────

const scadaProducts: Product[] = [
  {
    slug: "scada-flexscada",
    name: "FlexSCADA",
    series: "FlexSCADA",
    category: "scada",
    categoryLabel: "SCADA",
    subcategory: "Software SCADA",
    tagline: "Plataforma SCADA web de próxima generación para digitalización de manufactura",
    description:
      "FlexSCADA es una plataforma de software SCADA web de nueva generación diseñada para modernizar rápidamente equipos y líneas de producción. Ofrece desarrollo modular, operación visual, despliegue flexible, monitoreo en tiempo real y confiabilidad con integración abierta de OT e IT. Soporta más de 400 protocolos industriales.",
    image: `${D}/9899acc5-c20d-428e-a9a4-e36ee2c52af5.png`,
    features: [
      "Arquitectura Servidor/Navegador con acceso multiusuario simultáneo",
      "Más de 400 protocolos de comunicación industrial soportados",
      "Compatible con Windows, Linux y Ubuntu",
      "Cálculo de KPIs inteligente: OEE, rendimiento y disponibilidad",
      "Reportes automáticos diarios, mensuales y anuales con +20 tipos de gráficos",
      "Firma electrónica, registro de operaciones y control de permisos de usuarios",
      "Desarrollo low-code con librería de componentes industriales",
    ],
    specs: [
      { label: "Sistemas operativos", value: "Windows 7 SP1+, Linux Ubuntu 18.04+" },
      { label: "Navegadores soportados", value: "Chrome v91+, Edge v91+" },
      { label: "Bases de datos", value: "PostgreSQL, SQL Server 2005+, MySQL 5.6+" },
      { label: "Frecuencia de datos", value: "200 ítems/segundo" },
      { label: "Versiones disponibles", value: "500, 3000, 10000 o puntos ilimitados" },
      { label: "Protocolos de comunicación", value: "12 – 64 protocolos según versión" },
      { label: "Tipos de gráficos", value: "+20 tipos de gráficos y dashboards" },
    ],
    applications: [
      "Monitoreo de líneas de manufactura",
      "Control y supervisión de procesos industriales",
      "Gestión energética de plantas",
      "Industria farmacéutica (trazabilidad y auditoría)",
      "Automotriz y ensamble",
      "Industria alimentaria y de bebidas",
    ],
    externalUrl: "https://es.flexem.com/products_detail/FlexSCADA.html",
  },
]

// ─── CLOUD ────────────────────────────────────────────────────────────────────

const cloudProducts: Product[] = [
  {
    slug: "cloud-flexcloud",
    name: "FlexCloud",
    series: "FlexCloud",
    category: "cloud",
    categoryLabel: "Plataforma Cloud",
    subcategory: "Plataforma Cloud",
    tagline: "Plataforma cloud para monitoreo remoto y gestión de equipos industriales",
    description:
      "FlexCloud es la plataforma en la nube de FLEXEM para monitoreo remoto y gestión centralizada de equipos industriales. Permite visualizar el estado de máquinas, recibir alertas, analizar tendencias y gestionar flotas de dispositivos desde cualquier lugar. Ofrece prueba gratuita.",
    image: `${P}/0f9fdf35-d6d7-4d2e-8978-9b76ae42e74e.png`,
    features: [
      "Monitoreo remoto en tiempo real desde cualquier dispositivo",
      "Alertas y notificaciones configurables por umbral",
      "Análisis de tendencias y datos históricos",
      "Gestión centralizada de flotas de dispositivos FBox",
      "Integración nativa con FlexSCADA y gateways FBox",
      "Prueba gratuita disponible",
    ],
    specs: [
      { label: "Despliegue", value: "Cloud (SaaS)" },
      { label: "Acceso", value: "Navegador web / App móvil" },
      { label: "Integración de hardware", value: "FBox, FBox-lite, FLink2" },
      { label: "Integración de software", value: "FlexSCADA" },
      { label: "Disponibilidad", value: "Prueba gratuita + planes de suscripción" },
    ],
    applications: [
      "Gestión remota de activos industriales",
      "Mantenimiento predictivo y preventivo",
      "Monitoreo de energía y consumos",
      "Flotas de máquinas distribuidas geográficamente",
      "Industria 4.0 y transformación digital",
    ],
    externalUrl: "https://es.flexem.com/products_detail/FlexCloud.html",
  },
]

// ─── EXPORTS ──────────────────────────────────────────────────────────────────

export const products: Product[] = [
  ...servoProducts,
  ...plcProducts,
  ...hmiProducts,
  ...iotProducts,
  ...scadaProducts,
  ...cloudProducts,
]

export const categoryMeta: Record<ProductCategory, { label: string; description: string }> = {
  servo: {
    label: "Servomotores",
    description: "Accionamientos y motores servo de alta precisión",
  },
  plc: {
    label: "PLCs",
    description: "Controladores lógicos programables y módulos de expansión",
  },
  hmi: {
    label: "HMI",
    description: "Interfaces hombre-máquina táctiles para operación y supervisión",
  },
  "iot-gateway": {
    label: "IoT Gateway",
    description: "Gateways industriales para conectividad y adquisición de datos remota",
  },
  scada: {
    label: "SCADA",
    description: "Software de supervisión y control para digitalización de plantas",
  },
  cloud: {
    label: "Plataforma Cloud",
    description: "Soluciones cloud para monitoreo y gestión remota de activos",
  },
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category)
}

export const categoryOrder: ProductCategory[] = [
  "servo", "plc", "hmi", "iot-gateway", "scada", "cloud",
]
