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
  slug: "hmi-flexem-modbus-plc-otra-marca",
  title:
    "Cómo comunicar un HMI Flexem con PLC de otra marca (Modbus RTU/TCP paso a paso)",
  excerpt:
    "Guía completa para conectar una HMI Flexem por Modbus RTU o TCP a PLC Delta, Siemens, Allen-Bradley o Mitsubishi. Cableado, direcciones y prueba en 45 minutos.",
  description:
    "Tutorial paso a paso para comunicar una HMI Flexem F007N o F110 con un PLC de otra marca por Modbus RTU (RS485) o Modbus TCP (Ethernet). Cableado, direcciones y verificación.",
  cluster: "soporte",
  category: "Tutoriales",
  publishedAt: "2026-07-06",
  author: "Equipo técnico ADIMEX",
  readingMinutes: 10,
  focusKeyword: "hmi flexem modbus tutorial",
  cover: {
    src: "https://images.pexels.com/photos/18471551/pexels-photo-18471551.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Máquina industrial con cableado y borneras de comunicación RS485",
  },
  relatedProductSlugs: ["hmi-f007n", "productos-hmi-f110", "plc-fl7"],
  relatedPostSlugs: [
    "primer-proyecto-flexem-studio-parte-1",
    "hmi-flexem-f007n-vs-f110c",
    "guia-compra-plc-flexem-fl7",
  ],
  whatsappContext:
    "estoy conectando una HMI Flexem con un PLC de otra marca por Modbus y necesito ayuda.",
  faq: [
    {
      q: "¿Qué diferencia hay entre Modbus RTU y Modbus TCP?",
      a: "Modbus RTU corre sobre RS485 con velocidades típicas de 9600 a 115200 baud. Es robusto en ambientes eléctricamente ruidosos y llega a 1200 metros. Modbus TCP corre sobre Ethernet estándar (RJ45), ofrece mayor ancho de banda y múltiples clientes simultáneos.",
    },
    {
      q: "¿Puedo usar la HMI Flexem como maestro y esclavo al mismo tiempo?",
      a: "Sí. La HMI puede ser maestro Modbus TCP hacia un PLC y esclavo Modbus RTU hacia un sistema de supervisión, todo en el mismo proyecto. Se configura cada puerto por separado.",
    },
    {
      q: "¿Cuál es la distancia máxima con RS485?",
      a: "Hasta 1200 metros con cable blindado apantallado a 9600 baud. A 115200 baud reduce a alrededor de 100-200 metros. En trayectos largos coloca terminadores de 120 Ω en cada extremo del bus.",
    },
    {
      q: "¿La HMI Flexem se comunica con Siemens S7 sin Modbus?",
      a: "Sí. Flexem Studio incluye driver nativo Siemens S7 (ISO on TCP) — no necesitas Modbus. Igualmente para Mitsubishi (MC Protocol), Omron (FINS) y Allen-Bradley (EtherNet/IP CIP).",
    },
    {
      q: "¿Qué pasa si el PLC usa dirección Modbus 0-based y la HMI 1-based?",
      a: "Ajústalo en el driver: al agregar el dispositivo en Flexem Studio hay una opción de 'offset de dirección'. Si tu PLC lee '40001' donde la HMI escribe '40000', pon offset +1.",
    },
  ],
  Body: () => (
    <>
      <P>
        La HMI Flexem es agnóstica de marca por diseño. Con dos horas de setup
        deja hablar por Modbus RTU o TCP a prácticamente cualquier PLC del
        mercado — Delta, Siemens (con driver nativo o Modbus), Allen-Bradley,
        Mitsubishi, Omron, Panasonic. Este tutorial cubre las cuatro
        combinaciones más pedidas.
      </P>

      <Callout title="Antes de empezar">
        Requieres: HMI Flexem (F007N, F110 o similar) + Flexem Studio
        instalado + PLC destino con puerto RS485 o Ethernet + cable blindado o
        cable Ethernet Cat5e mínimo. Tiempo estimado: 30-60 min.
      </Callout>

      <H2 id="tipos">Modbus RTU vs Modbus TCP en 30 segundos</H2>
      <SpecTable
        headers={["Aspecto", "Modbus RTU", "Modbus TCP"]}
        rows={[
          ["Medio físico", "RS485 (2 hilos + tierra)", "Ethernet RJ45"],
          ["Velocidad típica", "9600 – 115200 baud", "10/100 Mbps"],
          ["Distancia máxima", "1200 m con blindado", "100 m por segmento"],
          ["Multi-cliente", "1 maestro / múltiples esclavos", "Varios clientes/servidores simultáneos"],
          ["Ideal para", "Máquinas OEM, tableros pequeños, ambiente ruidoso", "Líneas integradas, SCADA, gateways IoT"],
        ]}
      />

      <H2 id="rs485">Escenario 1 · HMI Flexem + PLC Delta por Modbus RTU (RS485)</H2>

      <H3>1.1 · Cableado eléctrico</H3>
      <P>
        En el conector COM del HMI (típicamente DB9), usa los pines:
      </P>
      <UL>
        <LI>Pin 7 → A+ del PLC (D+ en algunos manuales).</LI>
        <LI>Pin 8 → B- del PLC.</LI>
        <LI>Pin 5 → GND lógica común (opcional pero recomendado).</LI>
      </UL>
      <P>
        Usa cable blindado <Strong>Belden 9841</Strong> o equivalente. Aterriza
        la malla en un solo extremo (evita loops de tierra). Instala terminador
        de 120 Ω en cada extremo del bus si vas a más de 5 metros o 38400 baud.
      </P>

      <Callout variant="warning" title="El error más común">
        Cambiar A y B invertidos. Si compilas todo y no hay tráfico, prueba
        invertir los dos hilos antes de sospechar del PLC. Es la primera causa
        de tickets de soporte en esta ruta.
      </Callout>

      <H3>1.2 · Configuración en Flexem Studio</H3>
      <OL>
        <LI>
          Abre el proyecto. Ve a{" "}
          <Strong>Dispositivos → Agregar dispositivo</Strong>.
        </LI>
        <LI>
          Selecciona <Strong>Modbus RTU</Strong> como protocolo y{" "}
          <Strong>Master</Strong> como rol (la HMI pregunta, el PLC responde).
        </LI>
        <LI>
          Configura el puerto:
          <UL>
            <LI>Puerto: <Strong>COM1</Strong></LI>
            <LI>Baud: <Strong>9600</Strong> (o el que use tu PLC — Delta por defecto 9600, N, 8, 1)</LI>
            <LI>Paridad: <Strong>None</Strong></LI>
            <LI>Bits de datos: <Strong>8</Strong></LI>
            <LI>Bit de parada: <Strong>1</Strong></LI>
          </UL>
        </LI>
        <LI>
          Asigna al esclavo su ID:{" "}
          <Strong>Slave ID = 1</Strong> (o el que tenga configurado tu PLC).
        </LI>
      </OL>

      <H3>1.3 · Direccionar registros del PLC</H3>
      <P>
        En el Delta DVP, las áreas Modbus típicas:
      </P>
      <SpecTable
        headers={["Elemento del PLC Delta", "Función Modbus", "Rango típico"]}
        rows={[
          ["Bits M (Auxiliares)", "Coil (0x)", "0x0800 – 0x0FFF"],
          ["Registros D (Datos)", "Holding Register (4x)", "0x1000 – 0x11FF"],
          ["Entradas X", "Discrete Input (1x)", "0x0400 – 0x04FF"],
          ["Salidas Y", "Coil (0x)", "0x0500 – 0x05FF"],
        ]}
      />

      <P>
        En Flexem Studio, al crear una etiqueta del PLC selecciona{" "}
        <Strong>Función = 03 (Read Holding Registers)</Strong>, dirección
        4096 decimal (= 0x1000 = D0 del Delta), tipo de dato 16-bit signed.
      </P>

      <BlogProductCard slug="hmi-f007n" variant="buy" />

      <H2 id="tcp">Escenario 2 · HMI Flexem + PLC Siemens S7 por Modbus TCP</H2>
      <P>
        En Siemens hay dos rutas: usar el driver nativo{" "}
        <Strong>Siemens S7 (ISO on TCP)</Strong> — recomendado — o forzar
        Modbus TCP habilitando el módulo Modbus en el S7. Cubrimos ambos.
      </P>

      <H3>2.1 · Vía driver nativo Siemens (recomendado)</H3>
      <OL>
        <LI>
          En Flexem Studio agrega dispositivo → <Strong>Siemens S7-1200/1500 (ISO on TCP)</Strong>.
        </LI>
        <LI>
          Configura IP del PLC (por defecto 192.168.0.1), rack 0, slot 1.
        </LI>
        <LI>
          En el TIA Portal, en propiedades del PLC → Protection & Security:
          activa <Strong>Permit access with PUT/GET communication</Strong> y
          habilita comunicación PUT/GET en cada bloque de datos que quieras leer.
        </LI>
        <LI>
          Direccionamiento en Flexem Studio: usa{" "}
          <Strong>DB1.DBW0</Strong>, <Strong>DB1.DBX2.0</Strong>, etc. —
          notación S7 directa.
        </LI>
      </OL>

      <H3>2.2 · Vía Modbus TCP (si no puedes tocar TIA Portal)</H3>
      <OL>
        <LI>
          En Flexem Studio agrega dispositivo → <Strong>Modbus TCP</Strong>{" "}
          → rol Master.
        </LI>
        <LI>
          IP del PLC + puerto 502 (estándar Modbus TCP).
        </LI>
        <LI>
          En el S7 configura las funciones MB_SERVER en un OB cíclico
          apuntando a un DB reservado — el manual de Siemens “Modbus TCP
          Communication” lo detalla en 3 páginas.
        </LI>
      </OL>

      <BlogProductCard slug="productos-hmi-f110" variant="buy" />

      <H2 id="ab">Escenario 3 · HMI Flexem + PLC Allen-Bradley</H2>
      <P>
        Con Allen-Bradley CompactLogix y MicroLogix la ruta directa es{" "}
        <Strong>EtherNet/IP CIP</Strong>. Flexem Studio incluye driver
        Allen-Bradley EtherNet/IP.
      </P>
      <OL>
        <LI>
          Agrega dispositivo → <Strong>Allen-Bradley EtherNet/IP</Strong>.
        </LI>
        <LI>
          IP del PLC (por defecto 192.168.1.10 en CompactLogix).
        </LI>
        <LI>
          Direccionamiento por{" "}
          <Strong>tag name</Strong>: escribe el nombre del tag exactamente como
          está en Studio 5000 (ej. <code>Motor_Encendido</code>,{" "}
          <code>Velocidad_Actual</code>).
        </LI>
        <LI>
          El HMI hace la resolución de tags automáticamente — no tienes que
          calcular offsets ni funciones.
        </LI>
      </OL>

      <H2 id="mitsu">Escenario 4 · HMI Flexem + PLC Mitsubishi</H2>
      <P>
        Con Mitsubishi FX o iQ-F usa <Strong>MC Protocol (3E o 1E frame)</Strong>{" "}
        sobre Ethernet o serie. Flexem Studio incluye el driver.
      </P>
      <OL>
        <LI>
          Agrega dispositivo → <Strong>Mitsubishi FX/Q Series (MC Protocol)</Strong>.
        </LI>
        <LI>
          Configura IP + puerto TCP 5001 (o el que hayas asignado en GX Works).
        </LI>
        <LI>
          Direccionamiento: <Strong>D0</Strong>, <Strong>M100</Strong>,{" "}
          <Strong>Y10</Strong> — nomenclatura Mitsubishi directa.
        </LI>
      </OL>

      <H2 id="verificar">Cómo verificar que la comunicación funciona</H2>
      <OL>
        <LI>
          Compila el proyecto (F5) y descárgalo al HMI.
        </LI>
        <LI>
          En la pantalla que hayas diseñado, coloca un{" "}
          <Strong>Numeric Display</Strong> apuntando a una dirección del PLC
          que sepas cambia (ej. contador de scan o valor de un potenciómetro).
        </LI>
        <LI>
          Si el número se actualiza en tiempo real: éxito. Si no cambia:
          revisa siguiente sección.
        </LI>
        <LI>
          Habilita el <Strong>diagnóstico de comunicación</Strong> en Flexem
          Studio → Herramientas. Muestra tráfico por puerto en vivo.
        </LI>
      </OL>

      <H2 id="troubleshooting">Troubleshooting rápido</H2>
      <SpecTable
        headers={["Síntoma", "Causa probable", "Fix"]}
        rows={[
          [
            "HMI muestra “Comm error”",
            "IP incorrecta o cable Ethernet mal terminado (TCP) / A-B invertidos (RTU)",
            "Ping desde el HMI. Si es RTU, invierte A y B en un extremo.",
          ],
          [
            "Datos incorrectos (offset de dirección)",
            "PLC 0-based vs HMI 1-based",
            "Ajusta offset +1 o -1 en el driver del dispositivo.",
          ],
          [
            "Comunicación intermitente",
            "Sin terminador de 120 Ω o cable no blindado en ambiente ruidoso",
            "Instala terminadores y usa cable blindado con malla aterrizada en un extremo.",
          ],
          [
            "Timeouts en algunas direcciones",
            "Bloque de lectura muy grande o dirección fuera de rango del PLC",
            "Divide la lectura en bloques más pequeños; verifica que la dirección exista.",
          ],
          [
            "Fluctuación de valores enteros",
            "Endianness invertido (big vs little)",
            "Cambia el orden de bytes en el driver — “Word swap” o “ABCD/CDAB”.",
          ],
        ]}
      />

      <BlogWhatsAppCTA
        message="tengo una HMI Flexem con un PLC de otra marca y la comunicación no arranca."
        title="¿Sigue sin comunicar?"
        subtitle="Manda una captura del diagnóstico de comunicación y el modelo exacto del PLC. Te contestamos con la corrección específica."
        buttonLabel="Diagnóstico por WhatsApp"
      />

      <H2 id="siguientes">Qué sigue</H2>
      <P>
        Con la comunicación estable, ya puedes agregar pantallas de alarmas,
        histórico de tendencias, receta de producto y usuarios. Cubriremos
        cada uno en próximas entregas. Si el proyecto crece a supervisión
        multi-máquina, revisa la ficha de{" "}
        <A href="/productos/scada-flexscada">FlexSCADA</A> — es el paso natural
        cuando la HMI local ya no alcanza.
      </P>
    </>
  ),
}
