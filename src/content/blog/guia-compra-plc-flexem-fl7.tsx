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
  slug: "guia-compra-plc-flexem-fl7",
  title:
    "Guía de compra PLC Flexem FL7: modelos, precios y dónde comprarlo en México",
  excerpt:
    "PLC Flexem FL7 para control de movimiento multi-eje: qué modelo elegir, cuánto cuesta con IVA, aplicaciones típicas y dónde comprarlo con garantía en México.",
  description:
    "El PLC Flexem FL7 es un CODESYS multi-eje que controla hasta 32 ejes con leva electrónica. Comparamos los tres submodelos, precios reales, y explicamos cuándo conviene contra Delta o Siemens.",
  cluster: "transaccional",
  category: "PLCs",
  publishedAt: "2026-07-06",
  author: "Equipo técnico ADIMEX",
  readingMinutes: 10,
  focusKeyword: "plc flexem precio méxico",
  cover: {
    src: "https://images.pexels.com/photos/18471536/pexels-photo-18471536.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Módulo de control industrial con componentes electrónicos en tablero",
  },
  relatedProductSlugs: ["plc-fl7", "plc-fl6", "servo-fv5-e"],
  relatedPostSlugs: [
    "flexem-en-mexico-distribuidor-autorizado",
    "plc-chino-vs-plc-europeo",
    "cuanto-cuesta-automatizar-maquina-mexico-2026",
  ],
  whatsappContext:
    "leí su guía del PLC Flexem FL7 y quiero cotizar una configuración.",
  faq: [
    {
      q: "¿Cuánto cuesta un PLC Flexem FL7 en México?",
      a: "El modelo más solicitado, el FL721-0808P-D, cuesta $3,445 MXN con IVA en la tienda de ADIMEX. Los modelos FL721-0808N-D y FL721-0806R-D varían levemente de precio según configuración de salidas.",
    },
    {
      q: "¿El FL7 soporta EtherCAT?",
      a: "El FL7 no soporta EtherCAT nativo — controla ejes mediante salida de pulso (PTO) para hasta 32 ejes. Si tu aplicación exige EtherCAT como bus de movimiento, el modelo indicado es el FL6.",
    },
    {
      q: "¿Cuántos ejes puede controlar realmente el FL7?",
      a: "Ocho salidas de pulso hasta 200 kHz permiten controlar hasta 4 ejes con retorno de posición o hasta 32 ejes en configuraciones sin lazo cerrado por PTO. Para más de 8 ejes con precisión industrial recomendamos el FL6.",
    },
    {
      q: "¿En qué se diferencia el FL7 del Delta DVP?",
      a: "El FL7 corre CODESYS estándar IEC 61131-3 con leva electrónica integrada; el Delta DVP usa ISPSoft/WPLSoft (entorno propietario) y para leva electrónica requiere módulos adicionales. En precio son comparables; en control de movimiento el FL7 gana.",
    },
    {
      q: "¿Hay stock en México o es bajo pedido?",
      a: "El FL721-0808P-D lo mantenemos en almacén con envío nacional en 3-5 días hábiles. Los otros submodelos y las configuraciones especiales se piden a fábrica (4-6 semanas).",
    },
    {
      q: "¿Puedo programar el FL7 en ladder o solo en texto estructurado?",
      a: "El FL7 acepta los cinco lenguajes IEC 61131-3: LD (ladder), FBD, SFC, ST (texto estructurado) y CFC. Además incluye la biblioteca CODESYS SoftMotion para movimiento coordinado.",
    },
  ],
  Body: () => (
    <>
      <P>
        El PLC Flexem FL7 se convirtió en el controlador de referencia para
        integradores mexicanos que necesitan control de movimiento multi-eje
        sin pagar el ticket de Siemens o Beckhoff. Esta guía resume qué hace
        exactamente, cuál de los tres submodelos elegir y a qué precio.
      </P>

      <Callout title="TL;DR">
        El FL721-0808P-D es el submodelo que compra el 80% de los integradores
        en México: 8 entradas / 8 salidas PNP, 4 ejes PTO a 200 kHz, doble
        RS485 + Ethernet, CODESYS con SoftMotion. Precio actual{" "}
        <Strong>$3,445 MXN con IVA</Strong>, en stock, envío 3-5 días.
      </Callout>

      <BlogProductCard slug="plc-fl7" variant="buy" />

      <H2 id="que-es">Qué es el FL7 y en qué máquinas encaja</H2>
      <P>
        El Flexem FL7 es un PLC de la familia CODESYS orientado a aplicaciones
        complejas de mecánica y control de movimiento. Trae de fábrica:
      </P>
      <UL>
        <LI>Control de hasta 32 ejes simultáneos (por PTO).</LI>
        <LI>
          Contador de alta velocidad hasta 200 kHz por canal, con 4 canales AB
          con retorno de encoder.
        </LI>
        <LI>
          Interpolación lineal, circular y helicoidal, más leva electrónica
          integrada (no requiere módulo adicional).
        </LI>
        <LI>Compatible con CODESYS estándar — no un derivado propietario.</LI>
        <LI>2 puertos RS485 + 1 Ethernet — Modbus TCP/RTU nativo.</LI>
      </UL>

      <H3>Aplicaciones típicas en el sector mexicano</H3>
      <SpecTable
        headers={["Industria", "Máquinas donde encaja el FL7", "Comentario"]}
        rows={[
          [
            "Empaque y envasado",
            "Envasadora flow pack, encartonadora, etiquetadora rotativa, taponadora",
            "El punto dulce del FL7: leva electrónica para sincronización de rodillos, motor de arrastre y cortadora.",
          ],
          [
            "Textil",
            "Devanadora, guiadora de orillo, bobinadora slitter",
            "Control de tensión con lazo cerrado usando HSC + PTO.",
          ],
          [
            "Baterías y solar",
            "Cortadora de hilo fotovoltaico, clasificadora de celdas",
            "Aprovecha la interpolación helicoidal y el manejo de leva.",
          ],
          [
            "Máquinas herramienta ligeras",
            "CNC de 3-4 ejes, dispensadora, insertadora",
            "SoftMotion resuelve trayectorias sin necesidad de escalar al FL6.",
          ],
          [
            "Electrónica 3C",
            "Dispensadora de alta velocidad, ensamble automatizado",
            "El HSC de 200 kHz cubre encoder de alta resolución.",
          ],
        ]}
      />

      <H2 id="submodelos">Los tres submodelos y cuál elegir</H2>
      <P>
        Todos comparten CPU, memoria y capacidades de programación. La
        diferencia son las salidas y define casi por completo la elección.
      </P>

      <SpecTable
        headers={["Modelo", "Tipo de salida", "Aplicación ideal"]}
        rows={[
          [
            "FL721-0808N-D",
            "8 salidas NPN (colector abierto)",
            "Cuando la máquina se diseña con lógica NPN (común en tableros que reemplazan un PLC japonés antiguo).",
          ],
          [
            "FL721-0808P-D",
            "8 salidas PNP (source)",
            "El estándar en México y para nuevos diseños. Compatible con la mayoría de servos, drivers y sensores actuales.",
          ],
          [
            "FL721-0806R-D",
            "6 salidas de relé",
            "Cuando necesitas conmutar cargas de mayor potencia sin drivers intermedios (ventiladores, contactores pequeños). Sacrifica dos salidas de pulso.",
          ],
        ]}
      />

      <Callout variant="warning" title="Elige PNP salvo que sepas por qué NPN">
        La mayoría de servos y drivers modernos (Flexem FV5, Delta ASDA, Yaskawa
        Sigma-7) aceptan tren de pulsos PNP. Si vas a diseñar una máquina de
        cero y no tienes una razón específica para NPN, ve directo al{" "}
        <Strong>FL721-0808P-D</Strong>.
      </Callout>

      <H2 id="precio">Precio en México y qué incluye</H2>
      <P>
        Los precios son de la tienda ADIMEX, en pesos mexicanos con IVA
        incluido, válidos para clientes con RFC en México:
      </P>

      <SpecTable
        headers={["Modelo", "Precio con IVA (MXN)", "Disponibilidad"]}
        rows={[
          ["FL721-0808P-D", "$3,445", "En stock — envío 3-5 días"],
          ["FL721-0808N-D", "Bajo pedido, ~$3,300", "4-6 semanas"],
          ["FL721-0806R-D", "Bajo pedido, ~$3,600", "4-6 semanas"],
        ]}
      />

      <P>Cada PLC llega con:</P>
      <UL>
        <LI>Fuente de alimentación de 24 V DC — se compra por separado.</LI>
        <LI>
          Licencia CODESYS embebida (no pagas licencia adicional para
          programar).
        </LI>
        <LI>Garantía de fábrica 12 meses tramitada en México.</LI>
        <LI>Manual y firmware descargable del centro de soporte ADIMEX.</LI>
      </UL>

      <H2 id="que-mas-necesito">Qué más necesitas para arrancar</H2>
      <P>
        El PLC solo no arma la máquina. Estos son los componentes que suelen ir
        con un FL7:
      </P>

      <H3>1. HMI para operación en piso</H3>
      <P>
        La combinación más pedida es FL7 + HMI capacitiva de 7 o 10 pulgadas.
        Ambos modelos hablan Modbus TCP con el FL7 de fábrica; no hay drivers
        propietarios.
      </P>

      <BlogProductCard slug="hmi-f007n" variant="buy" />
      <BlogProductCard slug="productos-hmi-f110" variant="buy" />

      <P>
        Si dudas entre ambos tamaños, revisa la{" "}
        <A href="/blog/hmi-flexem-f007n-vs-f110c">
          comparativa F007N vs F110
        </A>{" "}
        — resume cuál cabe según tablero y presupuesto.
      </P>

      <H3>2. Servo o driver por eje</H3>
      <P>
        Para control de movimiento nuevo, la ruta lógica es FL7 + servos FV5 de
        FLEXEM (misma marca, drivers ya probados con la biblioteca SoftMotion).
        También funciona con Delta, Yaskawa o Panasonic — el FL7 se comunica por
        tren de pulsos o Modbus según el driver.
      </P>

      <BlogProductCard
        slug="servo-fv5-e"
        variant="quote"
        waContext="quiero cotizar servos FV5 para mi proyecto con FL7."
      />

      <H3>3. Módulos de expansión</H3>
      <UL>
        <LI>
          Módulo de entrada analógica (0-10 V, 4-20 mA) — cuando lees sensores
          de presión, temperatura o carga.
        </LI>
        <LI>
          Módulo de expansión digital — cuando 8 entradas y 8 salidas no
          alcanzan.
        </LI>
        <LI>
          Módulo IoT / gateway — para telemetría a FlexCloud o Ignition
          (opcional, no bloquea la puesta en marcha).
        </LI>
      </UL>

      <H2 id="donde-comprar">Dónde comprarlo en México</H2>
      <P>
        Como distribuidor autorizado, ADIMEX es el canal oficial para México.
        Tres formas de comprarlo:
      </P>

      <OL>
        <LI>
          <Strong>Compra en línea.</Strong> El FL721-0808P-D se paga con
          tarjeta, transferencia SPEI o crédito empresarial en la ficha del
          producto. Facturamos con CFDI 4.0 el mismo día.
        </LI>
        <LI>
          <Strong>Cotización formal para licitación.</Strong> Si el proyecto
          exige NIP, condiciones a 30 días, o documentación de canal oficial,
          emitimos cotización en formato empresarial.
        </LI>
        <LI>
          <Strong>Kit llave en mano.</Strong> Para OEM: PLC + HMI + servos
          seleccionados por nosotros según tu aplicación, con capacitación
          incluida.
        </LI>
      </OL>

      <BlogWhatsAppCTA
        message="quiero armar una configuración FL7 llave en mano para mi máquina."
        title="¿Necesitas la combinación PLC + HMI + servo correcta?"
        subtitle="Manda un croquis o descripción de la máquina. Te armamos la lista de materiales y confirmamos disponibilidad y precio."
      />

      <H2 id="vs-competencia">FL7 vs las alternativas más comunes</H2>
      <SpecTable
        headers={["Frente a…", "Cuándo elegir FL7", "Cuándo NO elegir FL7"]}
        rows={[
          [
            "Delta DVP-SV/SX",
            "Necesitas CODESYS estándar y leva electrónica integrada. Presupuesto similar.",
            "Ya tienes stock de refacciones Delta o el cliente lo exige explícitamente.",
          ],
          [
            "Siemens S7-1200",
            "El proyecto no exige TIA Portal y quieres reducir costo 60-70% con capacidad multi-eje similar.",
            "Cliente exige S7-1200 por estándar corporativo o la red ya es Profinet.",
          ],
          [
            "Unitronics Vision",
            "Quieres separar HMI y PLC (más flexible en tablero) y necesitas más de 4 ejes.",
            "Buscas todo-en-uno para máquina compacta con 1-2 ejes.",
          ],
          [
            "Beckhoff CX9020",
            "El presupuesto no absorbe Beckhoff pero necesitas control coordinado real.",
            "Aplicación exige EtherCAT o TwinCAT motion completo. Ahí Beckhoff gana.",
          ],
        ]}
      />

      <H2 id="pasos">Cómo elegir la configuración correcta paso a paso</H2>
      <OL>
        <LI>
          Cuenta los ejes reales (motor por motor). Si son 4 o menos con PTO,
          el FL7 lo hace. Si son más de 8 con lazo cerrado por encoder,
          considera FL6.
        </LI>
        <LI>
          Cuenta entradas y salidas digitales. 8+8 alcanza para máquinas
          pequeñas y medianas. Si no, agrega módulo de expansión F5.
        </LI>
        <LI>
          Cuenta entradas analógicas (sensores, celdas de carga). Si hay más
          de dos, agrega módulo analógico.
        </LI>
        <LI>
          Decide la HMI. Regla: 7 pulgadas para 20-30 pantallas; 10 pulgadas
          para 40+ o dashboards con tendencias.
        </LI>
        <LI>
          Decide comunicación con clientes/servos: PTO+RS485 para PLC
          compatible con drivers económicos; considera FL6 si necesitas
          EtherCAT nativo.
        </LI>
      </OL>

      <BlogWhatsAppCTA
        message="quiero validar la configuración del FL7 para mi proyecto."
        title="¿Ya tienes los números? Validemos juntos"
        subtitle="Comparte cuántos ejes, entradas y salidas necesitas. Te confirmamos si el FL7 es la ruta o si conviene subir al FL6."
      />
    </>
  ),
}
