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
  slug: "retrofit-plc-obsoleto-maquina-industrial",
  title: "Retrofit de PLC obsoleto: cómo migrar sin parar la producción",
  excerpt:
    "Plan de retrofit para máquinas con PLC descontinuado: inventario de señales, mapeo de E/S, migración en fin de semana y plan de reversa si algo falla.",
  description:
    "Cómo reemplazar un PLC descontinuado sin perder días de producción: cuándo conviene, cómo levantar las señales y cómo ejecutar el cambio en una ventana de paro.",
  cluster: "maquina",
  category: "Retrofit",
  publishedAt: "2026-08-07",
  author: "Equipo técnico ADIMEX",
  readingMinutes: 8,
  focusKeyword: "retrofit plc obsoleto",
  cover: {
    src: "https://images.pexels.com/photos/28265032/pexels-photo-28265032.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Tablero eléctrico industrial con cableado y switches",
  },
  relatedProductSlugs: ["plc-fl7", "hmi-f007n", "iot-fbox"],
  relatedPostSlugs: [
    "automatizar-maquina-empacadora",
    "plc-chino-vs-plc-europeo",
    "hmi-flexem-modbus-plc-otra-marca",
  ],
  whatsappContext:
    "tengo una máquina con PLC descontinuado y quiero evaluar un retrofit.",
  faq: [
    {
      q: "¿Cuándo conviene retrofit y cuándo comprar máquina nueva?",
      a: "Si la mecánica está sana y el problema es solo el control, el retrofit suele costar una fracción de una máquina nueva y se ejecuta en semanas en lugar de meses. Cuando el desgaste mecánico ya afecta la calidad del producto, o la máquina no alcanza la velocidad que necesitas aunque el control fuera perfecto, la inversión correcta es máquina nueva.",
    },
    {
      q: "¿Puedo conservar los sensores y actuadores existentes?",
      a: "En la mayoría de los casos sí. Los sensores de 24 V CD, finales de carrera y electroválvulas se reutilizan tal cual. Lo que casi siempre se reemplaza son los sensores propietarios del fabricante del PLC viejo y las tarjetas con señales fuera de estándar.",
    },
    {
      q: "¿Qué hago si perdí el programa original del PLC?",
      a: "Es el escenario más común en máquinas de más de 15 años. Si el PLC todavía enciende, a veces se puede subir el programa. Si no, se reconstruye la lógica desde el diagrama eléctrico y la observación de la máquina en operación. Suma de una a dos semanas al proyecto, así que hay que presupuestarlo desde el inicio.",
    },
    {
      q: "¿Cuánto tiempo tiene que parar la máquina?",
      a: "Con el tablero nuevo armado y probado en banco antes de la ventana de paro, el cambio físico de una máquina mediana toma de uno a tres días. La clave es que la máquina solo para para el cambio de cableado, no durante la ingeniería.",
    },
    {
      q: "¿Vale la pena agregar conectividad en el retrofit?",
      a: "Sí, y es el mejor momento porque el tablero ya está abierto. Agregar un gateway durante el retrofit cuesta mucho menos que volver a intervenir el tablero después, y te da diagnóstico remoto sobre una máquina que ya demostró que se descompone.",
    },
  ],
  Body: () => (
    <>
      <P>
        La llamada llega siempre con la misma urgencia: se quemó la CPU de una
        máquina de 1998, el modelo tiene 12 años descontinuado y el único
        repuesto que aparece está en un revendedor a precio de oro y sin
        garantía. La decisión de retrofit ya está tomada por las circunstancias.
        Lo que queda por resolver es cómo ejecutarlo sin regalar dos semanas de
        producción.
      </P>

      <H2 id="cuando">Las señales de que ya toca</H2>
      <P>
        No hace falta esperar a que se queme. Estas cinco condiciones,
        cualquiera de ellas, justifican empezar a planear:
      </P>
      <UL>
        <LI>
          <Strong>El fabricante declaró fin de soporte</Strong> y los repuestos
          solo se consiguen en mercado secundario.
        </LI>
        <LI>
          <Strong>Nadie tiene el software para programarlo.</Strong> Si el IDE
          corre solo en Windows XP y la licencia está en una laptop que ya nadie
          enciende, estás a un disco duro de distancia de perder la máquina.
        </LI>
        <LI>
          <Strong>La HMI ya no se lee</Strong> o la pantalla táctil resistiva
          perdió calibración de forma permanente.
        </LI>
        <LI>
          <Strong>Necesitas datos que la máquina no da.</Strong> Producción por
          turno, OEE, alarmas con hora — imposible si el control es de los
          noventa.
        </LI>
        <LI>
          <Strong>Cada falla toma días de diagnóstico</Strong> porque no hay
          quien entienda el programa original.
        </LI>
      </UL>

      <Callout title="El cálculo que importa" variant="warning">
        Multiplica tus horas de paro no planeado del último año por el costo por
        hora de esa máquina. Ese número, casi siempre, es mayor que el retrofit
        completo. Es el argumento que necesitas para el comité de inversión.
      </Callout>

      <H2 id="inventario">Paso 1: levantar el inventario de señales</H2>
      <P>
        Todo el proyecto se sostiene en este documento. Antes de cotizar nada,
        se recorre el tablero borne por borne y se llena una tabla con cinco
        columnas: número de borne, descripción física, tipo de señal, dirección
        en el PLC viejo, y dirección propuesta en el nuevo.
      </P>

      <SpecTable
        headers={["Tipo de señal", "Qué revisar", "Trampa frecuente"]}
        rows={[
          [
            "Entradas digitales",
            "Tensión (24 V CD, 110 V CA), lógica NPN o PNP",
            "Mezclar NPN y PNP en la misma tarjeta nueva",
          ],
          [
            "Salidas digitales",
            "Relevador o transistor, corriente por punto",
            "Cargas inductivas sin supresor que matan la salida",
          ],
          [
            "Analógicas",
            "Rango (4-20 mA, 0-10 V), aislamiento",
            "Instrumentos antiguos en 1-5 V o 0-20 mA",
          ],
          [
            "Temperatura",
            "Tipo de termopar o RTD, compensación",
            "Suponer que entra en una analógica genérica",
          ],
          [
            "Alta velocidad",
            "Encoders, frecuencia máxima real",
            "Contar el encoder como entrada digital normal",
          ],
          [
            "Comunicación",
            "Protocolo y equipos esclavos existentes",
            "Un variador viejo que solo habla protocolo propietario",
          ],
        ]}
      />

      <Callout title="Fotos, muchas fotos">
        Antes de desconectar el primer cable, fotografía el tablero completo,
        cada bornera y cada etiqueta. Cuando a las dos de la mañana del domingo
        haya un cable sin identificar, esas fotos valen más que el diagrama.
      </Callout>

      <H2 id="seleccion">Paso 2: elegir el controlador de reemplazo</H2>
      <P>
        Con el inventario en la mano la selección es aritmética. Suma puntos por
        tipo, agrega 20 por ciento de reserva y busca la combinación de CPU y
        expansiones que lo cubra. Dos criterios adicionales que pesan en un
        retrofit más que en una máquina nueva:
      </P>
      <OL>
        <LI>
          <Strong>Que el software sea gratuito y descargable hoy.</Strong> Media
          razón por la que estás en este problema es una licencia perdida. No
          repitas la historia.
        </LI>
        <LI>
          <Strong>Que hable Modbus de fábrica.</Strong> Siempre queda algún
          equipo viejo en la máquina que no vas a reemplazar. Modbus RTU es el
          idioma común que te deja conservarlo.
        </LI>
      </OL>

      <BlogProductCard slug="plc-fl7" variant="buy" />

      <P>
        Sobre la duda de fondo cuando el PLC saliente era europeo de marca
        conocida, la respondimos con números en{" "}
        <A href="/blog/plc-chino-vs-plc-europeo">
          PLC chino contra PLC europeo
        </A>
        .
      </P>

      <H2 id="hmi">Paso 3: la HMI es la mitad del valor percibido</H2>
      <P>
        Para el operador, el retrofit no es el PLC — es la pantalla. Es lo único
        que ve. Una HMI capacitiva a color, con alarmas con fecha y hora y
        contador de producción por turno, cambia por completo la percepción del
        proyecto en planta, y es lo que hace que el personal lo defienda en
        lugar de extrañar los botones de siempre.
      </P>

      <BlogProductCard slug="hmi-f007n" variant="buy" />

      <P>
        Si conservas un variador o un instrumento de otra marca, la HMI puede
        leerlo directo por Modbus sin pasar por el PLC. El procedimiento está en
        la{" "}
        <A href="/blog/hmi-flexem-modbus-plc-otra-marca">
          guía de Modbus con equipos de otra marca
        </A>
        .
      </P>

      <BlogWhatsAppCTA
        message="quiero evaluar el retrofit de una máquina con PLC descontinuado."
        title="¿Te ayudamos con el inventario de señales?"
        subtitle="Mándanos fotos del tablero y el diagrama si lo tienes. Te regresamos el conteo de E/S y la lista de material de reemplazo."
      />

      <H2 id="ventana">Paso 4: ejecutar en la ventana de paro</H2>
      <P>
        Aquí está la diferencia entre un retrofit profesional y una emergencia
        de dos semanas: <Strong>la máquina no debe parar durante la
        ingeniería</Strong>. Solo durante el cambio físico.
      </P>
      <OL>
        <LI>
          <Strong>Arma el tablero nuevo completo en banco.</Strong> Tablero
          paralelo, no intervención del existente. La máquina sigue produciendo.
        </LI>
        <LI>
          <Strong>Prueba la lógica con simulación de señales.</Strong> Cada
          entrada se fuerza y se verifica que la salida responda como debe. Sin
          la máquina.
        </LI>
        <LI>
          <Strong>Prepara el arnés de transición.</Strong> Cables ya cortados,
          etiquetados y numerados contra tu tabla de señales.
        </LI>
        <LI>
          <Strong>Cambio físico en la ventana.</Strong> Fin de semana o paro
          programado. Se desconecta, se conecta y se verifica punto por punto
          con la lista.
        </LI>
        <LI>
          <Strong>Arranque asistido en vacío, luego con producto.</Strong> Nunca
          al revés.
        </LI>
      </OL>

      <Callout title="Plan de reversa" variant="warning">
        No desmontes el tablero viejo hasta que la máquina lleve una semana
        produciendo con el nuevo. Guarda el PLC anterior en su lugar,
        desconectado pero cableable. Si algo sale mal el lunes, tienes camino de
        regreso en horas, no en días.
      </Callout>

      <H2 id="conectividad">Paso 5: aprovecha que el tablero está abierto</H2>
      <P>
        Es el momento más barato de la vida de la máquina para agregar
        conectividad. El tablero ya está intervenido, el electricista ya está
        ahí y la ingeniería está fresca. Un gateway instalado ahora te da
        diagnóstico remoto sobre una máquina que ya probó que falla.
      </P>

      <BlogProductCard slug="iot-fbox" variant="quote" />

      <H2 id="documentacion">Lo que se entrega al final</H2>
      <P>
        Un retrofit que no deja documentación solo pospone el problema quince
        años. El paquete de cierre debe incluir:
      </P>
      <UL>
        <LI>Programa fuente del PLC y proyecto de HMI, comentados y entregados en archivo.</LI>
        <LI>Diagrama eléctrico actualizado — el as-built, no el de diseño.</LI>
        <LI>Tabla final de señales con direcciones reales.</LI>
        <LI>Respaldo del firmware y versión exacta del software de programación.</LI>
        <LI>Lista de refacciones críticas con número de parte.</LI>
      </UL>

      <P>
        Ese paquete es lo que hace que el siguiente retrofit, dentro de muchos
        años, sea un proyecto de dos semanas y no una arqueología industrial.
      </P>

      <BlogWhatsAppCTA
        message="necesito cotizar un retrofit completo de tablero."
        title="Cotiza tu retrofit"
        subtitle="Dinos qué máquina es, qué PLC trae hoy y cuántas horas de paro puedes darnos. Armamos el plan y la lista de material."
      />
    </>
  ),
}
