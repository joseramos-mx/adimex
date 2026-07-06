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
  slug: "hmi-flexem-f007n-vs-f110c",
  title:
    "HMI Flexem F007N vs F110C: cuál elegir según tu aplicación",
  excerpt:
    "Comparativa técnica y de precios entre las HMI Flexem F007N (7\") y F110/F110C (10.1\"). Cuándo conviene cada una según tablero, presupuesto y arquitectura.",
  description:
    "Elige entre la HMI capacitiva F007N y la F110/F110C usando criterios reales: tamaño de tablero, número de pantallas, integración IoT y Bluetooth, y precio en México.",
  cluster: "transaccional",
  category: "HMI",
  publishedAt: "2026-07-06",
  author: "Equipo técnico ADIMEX",
  readingMinutes: 7,
  focusKeyword: "hmi flexem 7 pulgadas",
  cover: {
    src: "https://images.pexels.com/photos/37769419/pexels-photo-37769419.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Ingeniero operando panel HMI de control industrial",
  },
  relatedProductSlugs: ["hmi-f007n", "productos-hmi-f110", "hmi-fe6300"],
  relatedPostSlugs: [
    "guia-compra-plc-flexem-fl7",
    "flexem-en-mexico-distribuidor-autorizado",
    "cuanto-cuesta-automatizar-maquina-mexico-2026",
  ],
  whatsappContext:
    "leí la comparativa F007N vs F110C y necesito ayuda para elegir la correcta.",
  faq: [
    {
      q: "¿La F007N y la F110 usan el mismo software de proyecto?",
      a: "Sí. Ambas se programan en Flexem Studio y comparten el mismo formato de proyecto. Puedes migrar un proyecto de una a otra reasignando pantallas y ajustando el layout.",
    },
    {
      q: "¿La F110 tiene todas las funciones de la F110C?",
      a: "La F110C incluye IoT y Bluetooth de fábrica; la F110 estándar los trae en modelos superiores o los omite en la variante económica. Para conectividad cloud nativa, elige F110C.",
    },
    {
      q: "¿Cuál es la resolución real de cada HMI?",
      a: "F007N: 1024×600 en 7 pulgadas (16:9). F110/F110C: 800×1280 en 10.1 pulgadas (16:10), configurable en horizontal o vertical.",
    },
    {
      q: "¿Se pueden montar en cualquier tablero industrial?",
      a: "Sí, siempre que el corte cumpla las dimensiones del datasheet. La F007N requiere aproximadamente 192 × 138 mm; la F110 requiere 271 × 213 mm. Ambas soportan grados de protección IP en frontal.",
    },
    {
      q: "¿Hablan Modbus con PLC de otras marcas?",
      a: "Sí. Ambas soportan Modbus RTU (RS485) y Modbus TCP (Ethernet) de fábrica. Publicamos un tutorial paso a paso para conectarlas a PLC Delta, Siemens y Allen-Bradley.",
    },
  ],
  Body: () => (
    <>
      <P>
        La pregunta llega semanal: “tengo tablero para HMI de 7 pulgadas, ¿me
        alcanza o subo a 10?”. La respuesta correcta rara vez es la pantalla
        más grande. Depende de cuántas pantallas de proyecto vas a diseñar, si
        vas a conectar con FlexCloud, y cuánto espacio real tienes en el
        gabinete. Vamos por partes.
      </P>

      <Callout title="Recomendación rápida">
        Si tu máquina tiene menos de 20 pantallas, no necesita cloud nativo y
        el tablero tiene menos de 250 mm de ancho útil:{" "}
        <Strong>F007N</Strong>. Si tienes dashboards con tendencias, más de 30
        pantallas o necesitas integrar Bluetooth/IoT sin hardware extra:{" "}
        <Strong>F110C</Strong>.
      </Callout>

      <H2 id="tabla">Comparativa técnica lado a lado</H2>

      <SpecTable
        headers={["Característica", "F007N", "F110 / F110C"]}
        rows={[
          ["Tamaño de pantalla", "7\" (17.8 cm)", "10.1\" (25.6 cm)"],
          ["Resolución", "1024 × 600 (16:9)", "800 × 1280 (16:10)"],
          [
            "Tipo",
            "Capacitiva multi-touch",
            "Capacitiva multi-touch",
          ],
          [
            "Profundidad de color",
            "24 bits",
            "24 bits",
          ],
          [
            "Orientación",
            "Horizontal fija",
            "Horizontal o vertical",
          ],
          [
            "Comunicación estándar",
            "1 × Ethernet, RS485/RS232",
            "1 × Ethernet, RS485/RS232",
          ],
          [
            "IoT integrado",
            "No (agregable con Flink2)",
            "Sí, de fábrica (F110C)",
          ],
          [
            "Bluetooth",
            "No",
            "Sí (F110C)",
          ],
          [
            "Certificaciones",
            "CE, RoHS; UL en variante -UL",
            "CE, RoHS",
          ],
          [
            "Variantes",
            "F007N, F007N-BL (marco negro), F007N-UL",
            "F110, F110C (premium con IoT+BT)",
          ],
          [
            "Corte recomendado",
            "~192 × 138 mm",
            "~271 × 213 mm",
          ],
        ]}
      />

      <H2 id="cuando-f007n">Cuándo elegir la F007N</H2>
      <UL>
        <LI>
          <Strong>Máquinas compactas OEM</Strong> donde el tablero de operador
          es un panel pequeño (encartonadora individual, celda de trabajo,
          equipo de laboratorio).
        </LI>
        <LI>
          <Strong>Retrofit de HMI antigua de 7\".</Strong> Aprovechas el corte
          existente sin modificar tablero.
        </LI>
        <LI>
          <Strong>Presupuesto ajustado</Strong> con proyecto simple (10-25
          pantallas, sin dashboards ni tendencias).
        </LI>
        <LI>
          <Strong>Ambiente con humedad o alimentos.</Strong> La variante{" "}
          <Strong>F007N-UL</Strong> tiene certificación adicional y frontal
          apto para lavado.
        </LI>
      </UL>

      <BlogProductCard slug="hmi-f007n" variant="buy" />

      <H2 id="cuando-f110">Cuándo elegir la F110 o F110C</H2>
      <UL>
        <LI>
          <Strong>Dashboards con tendencias y KPIs.</Strong> La resolución más
          alta (800×1280) muestra gráficas legibles sin recortar ejes.
        </LI>
        <LI>
          <Strong>Proyectos con más de 30 pantallas.</Strong> Más área de
          trabajo reduce navegación y clics.
        </LI>
        <LI>
          <Strong>Instalación en pared u orientación vertical</Strong>{" "}
          (quioscos, tableros de línea que se leen desde lejos).
        </LI>
        <LI>
          <Strong>Conectividad IoT sin hardware extra.</Strong> La F110C incluye
          IoT + Bluetooth — ideal si vas directo a FlexCloud o quieres emparejar
          celulares para diagnóstico.
        </LI>
      </UL>

      <BlogProductCard slug="productos-hmi-f110" variant="buy" />

      <H2 id="opcion-c">¿Y si necesitas 10\" con FLink2?</H2>
      <P>
        Existe una tercera opción cuando la aplicación necesita 10.1 pulgadas{" "}
        <Strong>y</Strong> el módulo IoT intercambiable FLink2 (por ejemplo
        para cambiar el tipo de conectividad a lo largo del ciclo de vida):
      </P>
      <BlogProductCard slug="hmi-fe6300" variant="quote" />
      <P>
        La FE6300 es HMI industrial IoT con módulo FLink2 intercambiable y
        pantalla resistiva 24 bits. No compite en tacto capacitivo con la
        F110C, pero es la elección cuando el ambiente exige tacto con guantes
        gruesos, hay riesgo de agua sobre la superficie, o el operador usa
        stylus por norma sanitaria.
      </P>

      <H2 id="checklist">Checklist de decisión en 60 segundos</H2>
      <OL>
        <LI>
          ¿Cuánto ancho útil tiene tu tablero para HMI? Menos de 220 mm →
          F007N. Más de 280 mm → F110/F110C.
        </LI>
        <LI>
          ¿Cuántas pantallas de proyecto vas a diseñar? Menos de 25 → F007N
          alcanza. Más de 30 → F110 rinde mejor.
        </LI>
        <LI>
          ¿Vas a enviar datos a la nube en tiempo real? Sí → F110C. No →
          cualquiera de las dos.
        </LI>
        <LI>
          ¿El operador va a usar guantes de nitrilo? Ambas capacitivas
          responden. Si son guantes gruesos de carnaza o hay riesgo de agua
          sobre la superficie, considera FE6300 resistiva.
        </LI>
        <LI>
          ¿Vas a montar la HMI vertical (formato quiosco)? Solo la F110/F110C
          lo soportan.
        </LI>
      </OL>

      <BlogWhatsAppCTA
        message="tengo dudas para elegir entre la F007N y la F110C."
        title="¿Aún dudas cuál va contigo?"
        subtitle="Mándanos las dimensiones del tablero y cuántas pantallas piensas diseñar. Te decimos cuál conviene y te la enviamos con envío express."
      />

      <H2 id="programacion">Programación: son la misma familia</H2>
      <P>
        Buena noticia si migras entre ambas: comparten IDE y formato de
        proyecto. Flexem Studio te deja abrir un proyecto de F007N y
        reasignarlo a F110, ajustando el canvas — no reprogramas la lógica,
        solo reacomodas widgets. Para el detalle paso a paso, revisa la{" "}
        <A href="/blog/hmi-flexem-modbus-plc-otra-marca">
          guía Modbus para conectar HMI Flexem con PLC de otra marca
        </A>{" "}
        (sirve igual para ambas).
      </P>

      <H2 id="precio">Precio en México</H2>
      <P>
        Ambos SKUs los mantenemos en stock. Los precios son en pesos con IVA,
        válidos para clientes con RFC en México.
      </P>
      <UL>
        <LI>
          <Strong>F007N</Strong> — $7,308 MXN con IVA. Envío nacional 3-5 días
          hábiles.
        </LI>
        <LI>
          <Strong>F110</Strong> — $9,103 MXN con IVA. Envío nacional 3-5 días
          hábiles.
        </LI>
        <LI>
          <Strong>F110C</Strong> con IoT + Bluetooth — bajo pedido, 4 semanas.
        </LI>
      </UL>

      <BlogWhatsAppCTA
        message="quiero cotizar HMI F007N y F110 en volumen para OEM."
        title="¿Necesitas volumen para OEM?"
        subtitle="Manda cantidad y modelo. Preparamos descuento por volumen y calendario de entregas parciales."
      />
    </>
  ),
}
