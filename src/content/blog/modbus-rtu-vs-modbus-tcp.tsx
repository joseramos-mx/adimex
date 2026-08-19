import type { BlogPost } from "./types"
import BlogProductCard from "@/components/blog/product-card"
import BlogWhatsAppCTA from "@/components/blog/whatsapp-cta"
import {
  P,
  H2,
  UL,
  OL,
  LI,
  A,
  Strong,
  Callout,
  SpecTable,
} from "@/components/blog/prose"

export const post: BlogPost = {
  slug: "modbus-rtu-vs-modbus-tcp",
  title: "Modbus RTU vs Modbus TCP: cuál conviene en tu planta",
  excerpt:
    "Diferencias reales entre Modbus RTU y TCP: cableado, velocidad, número de equipos, distancias y los errores de instalación que tiran la comunicación.",
  description:
    "Guía clara para elegir entre Modbus RTU sobre RS485 y Modbus TCP sobre Ethernet, con las fallas de campo más comunes y cómo evitarlas desde el diseño.",
  cluster: "educacional",
  category: "Fundamentos",
  publishedAt: "2026-08-14",
  author: "Equipo técnico ADIMEX",
  readingMinutes: 7,
  focusKeyword: "modbus rtu vs modbus tcp",
  cover: {
    src: "https://images.pexels.com/photos/19841115/pexels-photo-19841115.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Detalle de gabinetes industriales con cableado de comunicación",
  },
  relatedProductSlugs: ["hmi-f007n", "plc-fl7", "iot-fbox"],
  relatedPostSlugs: [
    "hmi-flexem-modbus-plc-otra-marca",
    "retrofit-plc-obsoleto-maquina-industrial",
    "primer-proyecto-flexem-studio-parte-1",
  ],
  whatsappContext:
    "tengo dudas sobre si usar Modbus RTU o Modbus TCP en mi instalación.",
  faq: [
    {
      q: "¿Modbus RTU y Modbus TCP son compatibles entre sí?",
      a: "El modelo de datos es el mismo — mismos registros y mismas funciones — pero la capa física y el formato de trama son distintos, así que no se conectan directo. Se unen con un gateway Modbus, que traduce entre ambos mundos y es una solución muy común en plantas con equipos de distintas generaciones.",
    },
    {
      q: "¿Cuántos equipos puedo poner en una red Modbus RTU?",
      a: "El estándar permite hasta 247 direcciones, pero el límite físico de RS485 son 32 nodos por segmento sin repetidor. En la práctica, más de 15 equipos en un mismo bus empieza a degradar los tiempos de respuesta porque todo es secuencial: el maestro pregunta a uno a la vez.",
    },
    {
      q: "¿Qué distancia alcanza cada uno?",
      a: "Modbus RTU sobre RS485 llega hasta unos 1200 metros a baja velocidad, lo que lo hace ideal para plantas extendidas con cable económico. Ethernet se limita a 100 metros por tramo de cobre, aunque con switches o fibra se extiende sin problema.",
    },
    {
      q: "¿Por qué mi red RS485 funciona a veces y a veces no?",
      a: "Las tres causas más frecuentes son: falta de resistencias de terminación de 120 ohms en los extremos, referencia de tierra o común no conectada entre equipos, y cable de comunicación corriendo junto a cables de potencia. Los tres producen fallas intermitentes que aparecen justo cuando arranca un motor.",
    },
    {
      q: "¿Modbus TCP es seguro para conectar a la red de la empresa?",
      a: "Modbus no tiene autenticación ni cifrado en su diseño original: quien alcance el puerto puede leer y escribir registros. Por eso la red industrial debe estar segmentada de la red administrativa, con firewall o VLAN entre ambas, y nunca expuesta directo a internet.",
    },
  ],
  Body: () => (
    <>
      <P>
        Modbus cumplió más de cuarenta años y sigue siendo el protocolo que
        todos los equipos hablan. Esa es su virtud: un variador japonés, un
        medidor alemán y una HMI china se entienden sin licencias ni
        certificaciones. La duda práctica no es si usarlo, sino cuál de sus dos
        sabores conviene en cada tramo de la instalación.
      </P>

      <H2 id="mismo-idioma">Mismo idioma, distinto teléfono</H2>
      <P>
        La confusión más común es creer que son protocolos diferentes. No lo
        son. El <Strong>modelo de datos es idéntico</Strong>: las mismas cuatro
        tablas — bobinas, entradas discretas, registros de entrada y registros de
        retención — y los mismos códigos de función para leer y escribir.
      </P>
      <P>
        Lo que cambia es el transporte. RTU viaja por un par de cables en serie
        y verifica la integridad con CRC. TCP viaja por Ethernet dentro de una
        trama con encabezado propio, y deja el control de errores a la pila de
        red. Por eso migrar un equipo de RTU a TCP no obliga a reprogramar la
        lógica: las direcciones de registro son las mismas.
      </P>

      <H2 id="tabla">Comparativa directa</H2>

      <SpecTable
        headers={["Criterio", "Modbus RTU (RS485)", "Modbus TCP (Ethernet)"]}
        rows={[
          ["Medio físico", "Par trenzado, 2 o 3 hilos", "Cable de red o fibra"],
          ["Distancia por tramo", "Hasta 1200 m a baja velocidad", "100 m en cobre, más con fibra"],
          ["Velocidad típica", "9600 a 115200 bps", "10/100 Mbps o superior"],
          [
            "Equipos por segmento",
            "32 físicos (247 direcciones)",
            "Limitado por la red, en la práctica muchos más",
          ],
          [
            "Modo de operación",
            "Maestro y esclavos, uno a la vez",
            "Cliente y servidor, múltiples sesiones simultáneas",
          ],
          [
            "Costo de cableado",
            "Bajo — cable económico y largo",
            "Medio — requiere switches",
          ],
          [
            "Diagnóstico",
            "Difícil, hace falta analizador serie",
            "Sencillo, herramientas de red estándar",
          ],
          [
            "Sensible a ruido eléctrico",
            "Sí, exige buenas prácticas de instalación",
            "Menos, el par trenzado y la pila ayudan",
          ],
          [
            "Terreno donde brilla",
            "Distancias largas, equipos viejos, presupuesto ajustado",
            "Muchos datos, varios maestros, integración con TI",
          ],
        ]}
      />

      <H2 id="cuando-rtu">Cuándo conviene RTU</H2>
      <UL>
        <LI>
          <Strong>Equipos que solo hablan serie.</Strong> Variadores, medidores
          de energía e instrumentos de más de diez años rara vez traen Ethernet.
          RTU es el idioma que sí entienden.
        </LI>
        <LI>
          <Strong>Distancias largas dentro de planta.</Strong> Llevar señal a un
          tablero a 400 metros con dos hilos cuesta una fracción de tender fibra
          o instalar switches intermedios.
        </LI>
        <LI>
          <Strong>Pocos datos y baja frecuencia.</Strong> Leer diez registros
          cada segundo no justifica una infraestructura de red.
        </LI>
        <LI>
          <Strong>Retrofit con presupuesto contenido.</Strong> Aprovechas el
          cable existente si ya había una red serie.
        </LI>
      </UL>

      <H2 id="cuando-tcp">Cuándo conviene TCP</H2>
      <UL>
        <LI>
          <Strong>Varios maestros necesitan el mismo dato.</Strong> En RTU solo
          un maestro pregunta; en TCP la HMI, el SCADA y el gateway IoT pueden
          leer el mismo PLC al mismo tiempo.
        </LI>
        <LI>
          <Strong>Muchos registros o refresco rápido.</Strong> Un dashboard con
          tendencias en vivo satura un bus serie mucho antes que una red
          Ethernet.
        </LI>
        <LI>
          <Strong>Ya existe infraestructura de red</Strong> en la nave. El costo
          marginal de sumar un nodo es mínimo.
        </LI>
        <LI>
          <Strong>Vas hacia SCADA o nube.</Strong> Toda la integración moderna
          asume Ethernet; empezar ahí evita un gateway más adelante.
        </LI>
      </UL>

      <BlogProductCard slug="plc-fl7" variant="buy" />

      <Callout title="No es una elección excluyente" variant="success">
        La arquitectura más común en planta usa <Strong>las dos</Strong>: TCP
        como columna vertebral entre PLC, HMI y SCADA, y ramas RTU colgando de
        cada tablero para llegar a variadores e instrumentos. El PLC actúa de
        puente entre ambos mundos.
      </Callout>

      <H2 id="errores">Los cinco errores que tiran una red RS485</H2>
      <P>
        Casi todas las fallas de comunicación que atendemos son de instalación,
        no de configuración. En este orden de frecuencia:
      </P>
      <OL>
        <LI>
          <Strong>Falta de terminación.</Strong> RS485 necesita resistencias de
          120 ohms en los <Strong>dos extremos</Strong> del bus, no en cada
          equipo. Sin ellas la señal rebota y aparecen errores de CRC
          intermitentes.
        </LI>
        <LI>
          <Strong>Topología en estrella.</Strong> El bus debe ser una línea que
          entra y sale de cada equipo. Las derivaciones largas desde un punto
          central provocan reflexiones difíciles de diagnosticar.
        </LI>
        <LI>
          <Strong>Sin referencia común.</Strong> Los dos hilos de datos no bastan
          cuando los equipos están en tableros distintos: hace falta el tercer
          hilo de común o una referencia de tierra bien hecha.
        </LI>
        <LI>
          <Strong>Cable junto a potencia.</Strong> Si el par de comunicación
          corre en la misma charola que la alimentación de un motor, la
          comunicación se cae justo cuando ese motor arranca. Separación física
          o cable blindado con el blindaje aterrizado en un solo extremo.
        </LI>
        <LI>
          <Strong>Parámetros disparejos.</Strong> Velocidad, paridad, bits de
          paro y dirección deben coincidir en todos los nodos. Una dirección
          repetida produce respuestas colisionadas que parecen ruido.
        </LI>
      </OL>

      <Callout title="Antes de culpar al equipo" variant="warning">
        Cuando una red RTU falla de forma intermitente, revisa terminación,
        referencia común y separación de potencia <Strong>antes</Strong> de
        cambiar hardware. En nuestra experiencia esas tres causas explican la
        gran mayoría de los casos.
      </Callout>

      <H2 id="seguridad">Una advertencia sobre Modbus TCP</H2>
      <P>
        Modbus nació sin seguridad. No tiene autenticación ni cifrado: cualquiera
        que alcance el puerto puede leer registros y, peor, escribirlos. Eso
        estaba bien en un bus serie dentro de un tablero cerrado; en una red
        Ethernet es un riesgo real.
      </P>
      <P>Las medidas mínimas, en orden de importancia:</P>
      <UL>
        <LI>
          <Strong>Segmenta.</Strong> La red industrial va en su propia VLAN,
          separada de la red administrativa.
        </LI>
        <LI>
          <Strong>Nunca expongas el puerto a internet.</Strong> Para acceso
          remoto se usa VPN o un gateway diseñado para eso, jamás un redireccionamiento
          de puertos en el módem.
        </LI>
        <LI>
          <Strong>Restringe la escritura.</Strong> Si un cliente solo necesita
          leer, dale acceso de solo lectura donde el equipo lo permita.
        </LI>
      </UL>

      <BlogProductCard slug="iot-fbox" variant="quote" />

      <BlogWhatsAppCTA
        message="quiero definir la arquitectura de comunicación de mi planta."
        title="¿Diseñando la red de tu planta?"
        subtitle="Cuéntanos qué equipos tienes que integrar y a qué distancia están. Te proponemos la arquitectura y los gateways que necesitas."
      />

      <H2 id="practica">Cómo se ve en la práctica</H2>
      <P>
        Una configuración típica de máquina en México se arma así: la HMI y el
        PLC dialogan por Ethernet dentro del tablero; el PLC baja por RS485 a los
        variadores y al medidor de energía; y un gateway toma los datos que
        importan para mandarlos a la nube. Cada tramo usa el transporte que le
        conviene y ninguno paga infraestructura de más.
      </P>
      <P>
        Si vas a conectar una HMI con un PLC de otra marca, el procedimiento
        completo con parámetros y direccionamiento está en la{" "}
        <A href="/blog/hmi-flexem-modbus-plc-otra-marca">
          guía de Modbus para HMI con PLC de otra marca
        </A>
        . Y si estás modernizando una máquina antigua, revisa cómo levantar el
        inventario de señales en la{" "}
        <A href="/blog/retrofit-plc-obsoleto-maquina-industrial">
          guía de retrofit de PLC obsoleto
        </A>
        .
      </P>

      <BlogProductCard slug="hmi-f007n" variant="buy" />
    </>
  ),
}
