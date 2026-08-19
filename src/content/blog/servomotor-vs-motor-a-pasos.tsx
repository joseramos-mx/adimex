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
  slug: "servomotor-vs-motor-a-pasos",
  title: "Servomotor vs motor a pasos: cuál usar en cada aplicación",
  excerpt:
    "Lazo cerrado contra lazo abierto, par a alta velocidad, pérdida de pasos y costo real. Cuándo el paso a paso es suficiente y cuándo cuesta caro insistir.",
  description:
    "Diferencias reales entre servomotor y motor a pasos: comportamiento del par, precisión, riesgo de pérdida de posición y el criterio de costo total, no solo de compra.",
  cluster: "educacional",
  category: "Fundamentos",
  publishedAt: "2026-08-11",
  author: "Equipo técnico ADIMEX",
  readingMinutes: 8,
  focusKeyword: "servomotor vs motor a pasos",
  cover: {
    src: "https://images.pexels.com/photos/5532986/pexels-photo-5532986.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Maquinaria industrial con accionamientos y motores",
  },
  relatedProductSlugs: ["servo-fv5-e", "servo-fv3", "servo-fd5"],
  relatedPostSlugs: [
    "automatizar-maquina-empacadora",
    "guia-compra-plc-flexem-fl7",
    "cuanto-cuesta-automatizar-maquina-mexico-2026",
  ],
  whatsappContext:
    "necesito decidir entre servomotor y motor a pasos para mi aplicación.",
  faq: [
    {
      q: "¿Un motor a pasos pierde posición aunque esté bien dimensionado?",
      a: "Puede perderla si la carga excede el par disponible a esa velocidad, si hay una vibración resonante o si acelera demasiado rápido. Como trabaja en lazo abierto, el control no se entera: sigue contando pulsos que el motor ya no ejecutó. Por eso el error se acumula silenciosamente hasta el siguiente referenciado.",
    },
    {
      q: "¿Los pasos con encoder equivalen a un servo?",
      a: "No del todo. Un paso a paso con encoder (lazo cerrado) detecta y corrige la pérdida de pasos, lo que elimina el peor riesgo, pero sigue teniendo la caída de par a alta velocidad propia de la tecnología. Cierra la brecha de confiabilidad, no la de desempeño dinámico.",
    },
    {
      q: "¿A partir de qué velocidad deja de convenir el paso a paso?",
      a: "Como referencia práctica, arriba de unas 1000 rpm el par del paso a paso cae de forma pronunciada. Si tu aplicación vive por encima de ese rango o necesita par alto en movimiento rápido, el servo es la respuesta correcta.",
    },
    {
      q: "¿El servo siempre es más caro?",
      a: "En precio de compra casi siempre sí. En costo total no necesariamente: si el paso a paso te obliga a sobredimensionar, agregar referenciado frecuente o asumir paros por pérdida de posición, el servo se paga solo. La comparación honesta es por costo del ciclo de vida.",
    },
    {
      q: "¿Puedo controlar un servo con pulso y dirección como un paso a paso?",
      a: "Sí. La mayoría de los servoaccionamientos aceptan pulso y dirección, lo que facilita migrar desde un control diseñado para pasos sin rehacer toda la lógica. Es una ruta de migración habitual, aunque desaprovecha las funciones avanzadas del bus.",
    },
  ],
  Body: () => (
    <>
      <P>
        Es la pregunta más frecuente de quien diseña su primera máquina con
        movimiento controlado, y la respuesta “usa servo, es mejor” es tan
        inútil como cara. El paso a paso sigue siendo la elección correcta en
        muchísimas aplicaciones. Lo que hay que entender es exactamente dónde
        está la frontera, y por qué cruzarla sin darse cuenta sale caro.
      </P>

      <H2 id="diferencia">La diferencia de fondo: lazo abierto contra cerrado</H2>
      <P>
        Todo lo demás se deriva de aquí. Un <Strong>motor a pasos</Strong>{" "}
        trabaja en lazo abierto: el control envía pulsos y confía en que el
        motor los ejecutó. No hay confirmación. Si la carga fue mayor de lo
        previsto y el rotor no alcanzó a moverse, el sistema nunca se entera y
        la pieza sale fuera de medida.
      </P>
      <P>
        Un <Strong>servomotor</Strong> lleva encoder y trabaja en lazo cerrado:
        el accionamiento compara la posición ordenada contra la real miles de
        veces por segundo y corrige la diferencia. Si la carga aumenta, entrega
        más corriente. Si algo bloquea el eje, lo reporta como falla en lugar de
        seguir contando pulsos imaginarios.
      </P>

      <Callout title="La frase que resume todo">
        El paso a paso <Strong>supone</Strong> que llegó. El servo{" "}
        <Strong>sabe</Strong> que llegó. Todo lo que sigue — precio, tamaño,
        ajuste — es consecuencia de esa diferencia.
      </Callout>

      <H2 id="tabla">Comparativa punto por punto</H2>

      <SpecTable
        headers={["Criterio", "Motor a pasos", "Servomotor"]}
        rows={[
          ["Control", "Lazo abierto (o cerrado con encoder)", "Lazo cerrado siempre"],
          [
            "Par a baja velocidad",
            "Excelente — es su mejor terreno",
            "Bueno, con par continuo estable",
          ],
          [
            "Par a alta velocidad",
            "Cae fuerte arriba de ~1000 rpm",
            "Mantiene par hasta la velocidad nominal",
          ],
          [
            "Par pico disponible",
            "Sin reserva — el nominal es el máximo",
            "Dos a tres veces el nominal por periodos cortos",
          ],
          [
            "Riesgo de perder posición",
            "Sí, y de forma silenciosa",
            "No — la desviación se detecta y se reporta",
          ],
          [
            "Comportamiento en reposo",
            "Mantiene con corriente plena, se calienta",
            "Consume solo lo necesario para sostener",
          ],
          [
            "Ruido y vibración",
            "Notorios, sobre todo en resonancia",
            "Suave, funcionamiento silencioso",
          ],
          ["Ajuste de ganancias", "No requiere", "Requiere sintonía (hoy en buena parte automática)"],
          ["Precio de compra", "Menor", "Mayor — de dos a cuatro veces"],
          [
            "Diagnóstico",
            "Prácticamente nulo",
            "Corriente, seguimiento, temperatura y alarmas",
          ],
        ]}
      />

      <H2 id="cuando-pasos">Cuándo el paso a paso es la decisión correcta</H2>
      <P>
        Elegir servo donde bastaba un paso a paso también es un error, solo que
        uno que se paga de golpe en la compra. El paso a paso gana cuando:
      </P>
      <UL>
        <LI>
          <Strong>El movimiento es lento y bien conocido.</Strong> Un dosificador
          que gira a 60 rpm con carga constante no necesita lazo cerrado.
        </LI>
        <LI>
          <Strong>La carga no varía.</Strong> Si siempre mueve lo mismo, el
          margen de dimensionamiento cubre el riesgo.
        </LI>
        <LI>
          <Strong>Se sostiene una posición fija mucho tiempo</Strong> sin
          demandar par dinámico — el paso a paso sostiene sin freno mecánico.
        </LI>
        <LI>
          <Strong>El presupuesto manda</Strong> y la aplicación tolera un
          referenciado de vez en cuando.
        </LI>
        <LI>
          <Strong>Ejes auxiliares:</Strong> ajuste de guías, posicionamiento de
          topes, cambio de formato manual asistido.
        </LI>
      </UL>

      <H2 id="cuando-servo">Cuándo el servo deja de ser opcional</H2>
      <P>
        Cruzaste la frontera si tu aplicación cumple con cualquiera de estas.
        Una sola basta:
      </P>
      <OL>
        <LI>
          <Strong>Necesitas velocidad con par.</Strong> Arrastre de película,
          husillos rápidos, cualquier eje por encima de 1000 rpm bajo carga.
        </LI>
        <LI>
          <Strong>La carga es variable o desconocida.</Strong> Producto que
          cambia de peso, material que ofrece resistencia distinta según el
          lote.
        </LI>
        <LI>
          <Strong>Hay sincronía entre ejes.</Strong> Dos o más ejes que se
          coordinan — leva electrónica, corte al vuelo, seguimiento de banda —
          exigen realimentación.
        </LI>
        <LI>
          <Strong>Perder posición cuesta dinero o riesgo.</Strong> Si un error
          de posición arruina producto, daña la máquina o pone en riesgo al
          operador, el lazo abierto no es defendible.
        </LI>
        <LI>
          <Strong>Miles de arranques y paros por hora.</Strong> El ciclo agresivo
          demanda par pico repetido, justo la reserva que el paso a paso no
          tiene.
        </LI>
      </OL>

      <BlogProductCard slug="servo-fv5-e" variant="quote" />

      <BlogWhatsAppCTA
        message="quiero saber si mi aplicación necesita servo o alcanza con paso a paso."
        title="¿En la frontera y no sabes de qué lado caes?"
        subtitle="Cuéntanos velocidad, par estimado y si la carga varía. Te decimos con franqueza cuál te conviene, aunque la respuesta sea la más barata."
      />

      <H2 id="costo">El error de comparar solo el precio de compra</H2>
      <P>
        Un servo cuesta de dos a cuatro veces lo que un paso a paso equivalente.
        Es real y no tiene caso negarlo. Pero la comparación honesta incluye lo
        que casi nadie suma:
      </P>
      <UL>
        <LI>
          <Strong>Sobredimensionamiento.</Strong> Como el paso a paso no tiene
          reserva de par, hay que comprarlo más grande de lo que la aplicación
          pide. Parte de la diferencia de precio se evapora ahí.
        </LI>
        <LI>
          <Strong>Producto desperdiciado.</Strong> Cada pérdida de pasos que
          nadie detectó son piezas fuera de especificación.
        </LI>
        <LI>
          <Strong>Paros por referenciado.</Strong> Si la rutina exige regresar a
          cero seguido para no acumular error, eso es tiempo de máquina.
        </LI>
        <LI>
          <Strong>Diagnóstico.</Strong> Un servo te dice qué corriente demanda y
          cuánto se desvía. Con eso detectas un rodamiento que se está pegando
          antes de que se rompa. El paso a paso no te dice nada hasta que falla.
        </LI>
      </UL>

      <Callout title="Cómo decidir en la práctica" variant="success">
        Si dudas, calcula el costo de <Strong>una hora</Strong> de paro no
        planeado de esa máquina. Compáralo contra la diferencia de precio entre
        las dos tecnologías. En equipo de producción continua, el servo casi
        siempre se paga con el primer paro que evita.
      </Callout>

      <H2 id="intermedio">El punto intermedio que sí existe</H2>
      <P>
        El paso a paso en lazo cerrado —  con encoder integrado — corrige la
        pérdida de pasos y elimina el riesgo silencioso, conservando buena parte
        de la ventaja de precio. Es una solución legítima para ejes de precisión
        moderada y velocidad baja donde el riesgo de perder posición era el
        único problema. Lo que no resuelve es la caída de par a alta velocidad,
        que es física de la tecnología: si tu problema es velocidad, este camino
        no te salva.
      </P>

      <H2 id="dimensionar">Cómo dimensionar sin equivocarte</H2>
      <P>
        Elegida la tecnología, el dimensionamiento sigue el mismo orden en ambos
        casos:
      </P>
      <OL>
        <LI>
          Calcula el <Strong>par requerido</Strong> incluyendo fricción, inercia
          en la aceleración y cualquier carga de gravedad si el eje es vertical.
        </LI>
        <LI>
          Revisa el <Strong>perfil de velocidad</Strong> completo del ciclo, no
          solo el punto máximo.
        </LI>
        <LI>
          Verifica la <Strong>relación de inercias</Strong> entre carga y motor;
          aquí se define si necesitas reductor.
        </LI>
        <LI>
          Contrasta el par requerido contra la{" "}
          <Strong>curva par-velocidad</Strong> del modelo, no contra el dato
          nominal aislado.
        </LI>
        <LI>
          Agrega margen: 20 por ciento en servo, más en paso a paso por la falta
          de reserva.
        </LI>
      </OL>

      <P>
        Si estás definiendo el control completo y no solo el motor, el orden de
        decisiones está en{" "}
        <A href="/blog/automatizar-maquina-empacadora">
          cómo automatizar una máquina empacadora
        </A>
        , que aplica igual para otras familias de máquina.
      </P>

      <BlogWhatsAppCTA
        message="necesito dimensionar un servo para mi aplicación."
        title="Te calculamos el par sin compromiso"
        subtitle="Mándanos masa, diámetro, velocidad objetivo y tiempo de aceleración. Te regresamos el modelo que aplica y si necesitas reductor."
      />
    </>
  ),
}
