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
  slug: "automatizar-maquina-empacadora",
  title:
    "Cómo automatizar una máquina empacadora: arquitectura PLC, HMI y servo",
  excerpt:
    "Arquitectura de control para empacadoras flow pack, VFFS y encartonadoras: cuántos ejes servo necesitas, cómo contar E/S y qué PLC y HMI elegir.",
  description:
    "Guía práctica para definir el control de una empacadora: conteo de entradas y salidas, ejes servo reales, comunicación y la lista de material que sí vas a necesitar.",
  cluster: "maquina",
  category: "Empaque y envasado",
  publishedAt: "2026-08-04",
  author: "Equipo técnico ADIMEX",
  readingMinutes: 9,
  focusKeyword: "automatizar maquina empacadora",
  cover: {
    src: "https://images.pexels.com/photos/32845694/pexels-photo-32845694.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Ingeniero revisando una línea de empaque industrial con tablet",
  },
  relatedProductSlugs: ["plc-fl7", "servo-fv5-e", "hmi-f007n"],
  relatedPostSlugs: [
    "guia-compra-plc-flexem-fl7",
    "cuanto-cuesta-automatizar-maquina-mexico-2026",
    "hmi-flexem-f007n-vs-f110c",
  ],
  whatsappContext:
    "quiero automatizar una empacadora y necesito definir la arquitectura de control.",
  faq: [
    {
      q: "¿Cuántos ejes servo necesita una empacadora flow pack?",
      a: "Una flow pack típica lleva tres ejes: arrastre de película, mordaza transversal y banda de alimentación. Si la mordaza es de movimiento continuo (box motion) y sincroniza con el producto, se agrega un cuarto eje. Menos de tres ejes suele indicar que parte del movimiento sigue siendo mecánico por leva.",
    },
    {
      q: "¿Puedo usar un PLC compacto o necesito uno modular?",
      a: "Si tu conteo de E/S cabe con holgura del 20 por ciento en un FL7 con una o dos expansiones, el compacto alcanza y sale más barato. Cuando pasas de 60 puntos o necesitas E/S remota en varios puntos de la máquina, conviene ir a arquitectura modular con acopladores.",
    },
    {
      q: "¿El PLC y el servo tienen que ser de la misma marca?",
      a: "No es obligatorio, pero ayuda. Con FL7 y servos FV5 la puesta en marcha usa el mismo entorno y los perfiles de movimiento ya vienen resueltos. Mezclar marcas funciona vía Modbus o pulso y dirección, a cambio de más tiempo de integración y de dos soportes técnicos distintos.",
    },
    {
      q: "¿Cuánto tarda la puesta en marcha de una empacadora automatizada?",
      a: "Para una máquina de tres ejes con receta y HMI, calcula de dos a cuatro semanas de programación y una semana de pruebas con producto real. El tiempo se va en el ajuste fino de sincronía y en las recetas por formato, no en el cableado.",
    },
    {
      q: "¿Qué pasa si mi empacadora es vieja y quiero conservar la estructura mecánica?",
      a: "Es el caso más común y suele ser rentable: se conserva chasis, mordazas y transportes, y se sustituye tablero, PLC, HMI y accionamientos. Lo tratamos a detalle en nuestra guía de retrofit.",
    },
  ],
  Body: () => (
    <>
      <P>
        Casi todos los proyectos de empaque que nos llegan empiezan igual:
        “necesito automatizar mi empacadora, ¿cuánto me cuesta?”. La pregunta
        no se puede responder sin antes definir la arquitectura, porque una
        flow pack de tres ejes y una encartonadora con alimentación por visión
        no juegan en la misma cancha. Este artículo es el orden en que nosotros
        lo resolvemos, con las decisiones que de verdad mueven el presupuesto.
      </P>

      <Callout title="Regla de oro">
        Define primero <Strong>cuántos ejes coordinados</Strong> tiene la
        máquina y después el PLC. Al revés casi siempre termina en un cambio de
        plataforma a media integración, que cuesta más que haber comprado el
        controlador correcto desde el inicio.
      </Callout>

      <H2 id="tipos">Primero: qué tipo de empacadora tienes</H2>
      <P>
        La familia de máquina determina el número de ejes y con eso el
        controlador. Estas son las que más se automatizan en México:
      </P>

      <SpecTable
        headers={[
          "Tipo de máquina",
          "Ejes servo típicos",
          "Complejidad de control",
        ]}
        rows={[
          [
            "Flow pack horizontal (HFFS)",
            "3 a 4 (película, mordaza, alimentación)",
            "Media — sincronía película contra producto",
          ],
          [
            "Vertical VFFS (bolsa formada)",
            "2 a 3 (arrastre, mordaza, dosificador)",
            "Media — el reto está en la dosificación",
          ],
          [
            "Encartonadora",
            "3 a 6 (alimentación, formado, empuje, cierre)",
            "Alta — muchos actuadores neumáticos y enclavamientos",
          ],
          [
            "Enfardadora o retráctil",
            "1 a 2",
            "Baja — control de temperatura y tiempos",
          ],
          [
            "Etiquetadora en línea",
            "1 a 2 (arrastre de etiqueta, banda)",
            "Baja a media — precisión de registro",
          ],
        ]}
      />

      <H2 id="conteo">Segundo: cuenta las entradas y salidas de verdad</H2>
      <P>
        El error más caro de esta etapa es contar solo lo obvio. Una lista
        realista para una flow pack de tres ejes se ve así:
      </P>
      <UL>
        <LI>
          <Strong>Entradas digitales:</Strong> sensor de marca de registro,
          fotocelda de producto, fin de carrera de mordaza, sensor de película
          agotada, puertas de seguridad, botones de marcha y paro, selector de
          modo, paro de emergencia con contacto auxiliar. Ya vas en 12 y no has
          contado los enclavamientos.
        </LI>
        <LI>
          <Strong>Salidas digitales:</Strong> electroválvulas de mordaza y
          expulsión, torreta de tres colores, arranque de resistencias,
          señalización de fallo, permisivo hacia la máquina de aguas abajo.
        </LI>
        <LI>
          <Strong>Analógicas:</Strong> una por cada zona de temperatura de
          sellado — casi siempre dos o tres — más la lectura de tensión de
          película si es una máquina de precisión.
        </LI>
        <LI>
          <Strong>Temperatura:</Strong> los termopares de mordaza no van en una
          entrada analógica genérica, necesitan módulo específico. Es el punto
          que más veces vemos olvidado en la lista de material.
        </LI>
      </UL>

      <Callout title="Deja holgura" variant="warning">
        Suma tu conteo y agrégale <Strong>20 por ciento</Strong>. Toda máquina
        de empaque crece: un rechazador aquí, un detector de metales allá.
        Comprar el PLC justo al conteo exacto significa comprar una expansión
        seis meses después.
      </Callout>

      <H2 id="controlador">Tercero: el controlador</H2>
      <P>
        Con el conteo listo, la elección del PLC deja de ser una opinión. Para
        el rango de máquina de empaque que se automatiza en planta mexicana, el
        FL7 cubre la mayoría de los casos porque combina control de movimiento y
        E/S expandible sin saltar a una plataforma de gama alta.
      </P>

      <BlogProductCard slug="plc-fl7" variant="buy" />

      <P>
        Si vienes de un proyecto donde solo necesitas lógica secuencial sin ejes
        coordinados — una enfardadora, una banda con tiempos — el FL7 te queda
        grande y conviene revisar la gama menor. La{" "}
        <A href="/blog/guia-compra-plc-flexem-fl7">guía de compra del FL7</A>{" "}
        tiene el detalle de cuándo sí y cuándo no.
      </P>

      <H2 id="servos">Cuarto: los ejes</H2>
      <P>
        Aquí es donde una empacadora se gana o se pierde. El arrastre de
        película necesita par constante a baja velocidad y capacidad de arranque
        y paro cientos de veces por minuto sin perder registro. Eso es
        territorio de servo, no de variador con motor asíncrono.
      </P>

      <BlogProductCard slug="servo-fv5-e" variant="quote" />

      <P>
        Los tres criterios para dimensionar cada eje, en orden de importancia:
      </P>
      <OL>
        <LI>
          <Strong>Par pico contra par continuo.</Strong> La mordaza demanda un
          pico fuerte en el instante de sellado y casi nada el resto del ciclo.
          Dimensionar por el pico infla el costo; dimensionar por el promedio
          quema el servo. Se calcula con el ciclo completo.
        </LI>
        <LI>
          <Strong>Inercia reflejada.</Strong> La relación entre la inercia de la
          carga y la del motor debe quedar dentro del rango del accionamiento, o
          el eje va a oscilar por más que ajustes ganancias. Aquí es donde el
          reductor se vuelve parte del cálculo, no un accesorio.
        </LI>
        <LI>
          <Strong>Resolución del encoder contra tolerancia de corte.</Strong> Si
          tu especificación es más o menos un milímetro sobre una bolsa de 200
          mm, necesitas saber cuántos pulsos por revolución te quedan en el
          punto de arrastre.
        </LI>
      </OL>

      <BlogWhatsAppCTA
        message="tengo una empacadora y necesito dimensionar los servos."
        title="¿Quieres que dimensionemos los ejes contigo?"
        subtitle="Mándanos el diámetro del rodillo de arrastre, la velocidad en bolsas por minuto y el peso del producto. Te regresamos el cálculo de par y el modelo de servo que aplica."
      />

      <H2 id="hmi">Quinto: la interfaz de operador</H2>
      <P>
        En empaque, la HMI no es decorativa: es donde vive el sistema de
        recetas. Cada formato de bolsa es un juego de parámetros — largo,
        temperatura por zona, tiempo de sellado, velocidad, offset de registro —
        y el operador tiene que poder cambiar de formato sin llamarte por
        teléfono.
      </P>
      <UL>
        <LI>
          <Strong>Menos de 25 pantallas y tablero angosto:</Strong> una HMI de 7
          pulgadas alcanza y sobra.
        </LI>
        <LI>
          <Strong>
            Con tendencias de temperatura y conteo de producción visible:
          </Strong>{" "}
          conviene subir a 10 pulgadas para que las gráficas se lean sin
          recortar ejes.
        </LI>
      </UL>

      <BlogProductCard slug="hmi-f007n" variant="buy" />

      <P>
        El criterio completo, con medidas de corte de tablero, está en la{" "}
        <A href="/blog/hmi-flexem-f007n-vs-f110c">
          comparativa F007N contra F110C
        </A>
        .
      </P>

      <H2 id="errores">Cinco errores que vemos repetirse</H2>
      <OL>
        <LI>
          <Strong>Dejar la seguridad para el final.</Strong> El paro de
          emergencia y los enclavamientos de puerta cambian el diagrama y a
          veces obligan a un relevador de seguridad que no estaba
          presupuestado. Va en el diseño, no en el arranque.
        </LI>
        <LI>
          <Strong>No aislar los termopares.</Strong> Las señales de temperatura
          corriendo junto a los cables de potencia del servo dan lecturas que
          bailan. Charola separada o mínimo 20 cm de separación.
        </LI>
        <LI>
          <Strong>Programar sin recetas.</Strong> Si los parámetros de formato
          viven como constantes en el código, cada cambio de producto es una
          visita del integrador. Estructura de receta desde el día uno.
        </LI>
        <LI>
          <Strong>Olvidar el permisivo con la máquina de aguas abajo.</Strong>{" "}
          La empacadora casi nunca trabaja sola. Deja libres al menos dos
          entradas y dos salidas para dialogar con la llenadora o la
          encajonadora.
        </LI>
        <LI>
          <Strong>Sin diagnóstico remoto.</Strong> Agregar un gateway al tablero
          cuesta una fracción de un viaje a planta. Si la máquina va a otro
          estado, es la inversión más rentable del proyecto.
        </LI>
      </OL>

      <BlogProductCard slug="iot-fbox" variant="quote" />

      <H2 id="presupuesto">Qué esperar en presupuesto y tiempos</H2>
      <P>
        El material de control de una empacadora de tres ejes — PLC, HMI, servos
        con sus accionamientos, módulo de temperatura y componentes de tablero —
        representa la mayor parte del costo del proyecto, pero no todo: falta
        ingeniería, armado de tablero, cableado en máquina y puesta en marcha.
        Desglosamos ese cálculo con cifras en{" "}
        <A href="/blog/cuanto-cuesta-automatizar-maquina-mexico-2026">
          cuánto cuesta automatizar una máquina en México
        </A>
        .
      </P>
      <P>
        En tiempos, la ruta crítica normalmente son los servos si el modelo va
        bajo pedido. Por eso el conteo de ejes es lo primero que definimos: nos
        deja disparar la compra larga mientras se hace la ingeniería del resto.
      </P>

      <BlogWhatsAppCTA
        message="quiero cotizar el control completo de una empacadora."
        title="Cotiza la lista completa"
        subtitle="Cuéntanos qué tipo de empacadora es, cuántos formatos maneja y a qué velocidad trabaja. Armamos la lista de material con tiempos de entrega reales."
      />
    </>
  ),
}
