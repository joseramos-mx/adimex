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
  slug: "primer-proyecto-flexem-studio-parte-1",
  title:
    "Cómo programar tu primer proyecto en Flexem Studio (parte 1 · setup y HMI)",
  excerpt:
    "Serie paso a paso para arrancar en Flexem Studio: instalación, licencia, crear un proyecto para HMI F007N y armar la primera pantalla con botones y luces.",
  description:
    "Primera entrega de la serie Flexem Studio. Instalación del IDE, licencia, creación de proyecto para HMI F007N, primera pantalla funcional con botones y direcciones internas.",
  cluster: "soporte",
  category: "Tutoriales",
  publishedAt: "2026-07-06",
  author: "Equipo técnico ADIMEX",
  readingMinutes: 9,
  focusKeyword: "flexem studio tutorial español",
  cover: {
    src: "https://images.pexels.com/photos/36496927/pexels-photo-36496927.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Programador escribiendo código en laptop para configuración de HMI",
  },
  relatedProductSlugs: ["hmi-f007n", "productos-hmi-f110"],
  relatedPostSlugs: [
    "hmi-flexem-modbus-plc-otra-marca",
    "guia-compra-plc-flexem-fl7",
    "hmi-flexem-f007n-vs-f110c",
  ],
  whatsappContext:
    "estoy siguiendo el tutorial de Flexem Studio y tengo dudas.",
  faq: [
    {
      q: "¿Flexem Studio es gratuito?",
      a: "Sí. Flexem Studio se descarga sin costo desde el centro de soporte y no requiere licencia para desarrollar. Solo requiere un HMI Flexem físico para hacer el descargo (download) al equipo.",
    },
    {
      q: "¿En qué versión de Windows funciona Flexem Studio?",
      a: "Windows 10 y Windows 11. En Windows 7 aún funciona pero sin actualizaciones oficiales. Se recomienda 8 GB de RAM y espacio en disco SSD para responder ágil durante la simulación.",
    },
    {
      q: "¿Puedo simular sin HMI física?",
      a: "Sí. Flexem Studio incluye un simulador que reproduce la HMI en tu computadora. Puedes probar navegación entre pantallas, animaciones y direcciones internas sin conectar hardware.",
    },
    {
      q: "¿Este tutorial sirve para F110 y F110C?",
      a: "Sí. Al crear el proyecto solo cambias el modelo destino. El flujo de trabajo es idéntico entre F007N, F110, F110C y FE6300.",
    },
  ],
  Body: () => (
    <>
      <P>
        Este es el primer capítulo de la serie “Flexem Studio desde cero”. El
        objetivo: al terminar tendrás el IDE funcionando, un proyecto para la
        HMI F007N y una primera pantalla con dos botones que encienden y
        apagan luces. Ninguna magia. Solo pasos claros.
      </P>

      <Callout title="Requisitos previos">
        Windows 10/11 con 8 GB de RAM y 4 GB libres en disco. Si vas a
        descargar al HMI real, un cable de programación mini-USB o Ethernet
        cross según tu modelo. Si solo vas a simular, con la PC basta.
      </Callout>

      <H2 id="paso-1">Paso 1 · Descargar e instalar Flexem Studio</H2>
      <OL>
        <LI>
          Entra al centro de soporte de ADIMEX y descarga la última versión
          estable de Flexem Studio. Al momento de este artículo es la v3.5.
        </LI>
        <LI>
          Ejecuta el instalador como administrador. Selecciona la ruta por
          defecto <Strong>C:\Program Files\Flexem\Studio</Strong> salvo que
          tengas política corporativa distinta.
        </LI>
        <LI>
          Cuando el instalador te pregunte por “driver USB” acepta. Es lo que
          permite descargar el programa al HMI vía cable.
        </LI>
        <LI>
          Reinicia. En el primer arranque el IDE te pedirá seleccionar idioma
          — elige <Strong>Español (Latinoamérica)</Strong>.
        </LI>
      </OL>

      <Callout variant="warning" title="Antivirus corporativo">
        Algunos antivirus empresariales bloquean el driver USB. Si el HMI no
        aparece al conectarlo, agrega una excepción para{" "}
        <Strong>C:\Program Files\Flexem\Studio</Strong> antes de reinstalar el
        driver.
      </Callout>

      <H2 id="paso-2">Paso 2 · Crear el proyecto para F007N</H2>
      <OL>
        <LI>
          Abre Flexem Studio y elige <Strong>Nuevo proyecto</Strong>.
        </LI>
        <LI>
          En la lista de modelos, selecciona <Strong>F007N</Strong> (o el
          modelo que vayas a usar). Confirma resolución 1024×600.
        </LI>
        <LI>
          Deja el modo de comunicación en <Strong>Modbus TCP</Strong> por
          defecto — más adelante cambiaremos a RS485 si conectas a un PLC
          serie.
        </LI>
        <LI>
          Nombra el proyecto <Strong>PrimerProyecto</Strong> y guarda en una
          carpeta que puedas versionar con Git más adelante.
        </LI>
      </OL>

      <BlogProductCard slug="hmi-f007n" variant="buy" />

      <H2 id="paso-3">Paso 3 · Configurar dispositivo interno</H2>
      <P>
        Para probar sin PLC vamos a usar el <Strong>dispositivo interno</Strong>{" "}
        de la HMI. Es una memoria virtual dentro del HMI, útil para simular y
        para variables de UI (idioma, usuario, etc.).
      </P>
      <OL>
        <LI>
          En el árbol izquierdo abre <Strong>Dispositivos → HMI interno</Strong>.
        </LI>
        <LI>
          Crea dos direcciones:
          <UL>
            <LI>
              <Strong>LB0</Strong> (Local Bit 0) — bandera de “luz encendida”.
            </LI>
            <LI>
              <Strong>LB1</Strong> — bandera de “alarma activa”.
            </LI>
          </UL>
        </LI>
        <LI>
          Asigna una etiqueta (tag name) legible: <Strong>LuzOK</Strong> y{" "}
          <Strong>AlarmaActiva</Strong>. Esto no es solo cosmético — al hablar
          por Modbus con un PLC más adelante, las etiquetas se remapearán y
          conviene tenerlas listas.
        </LI>
      </OL>

      <H2 id="paso-4">Paso 4 · Primera pantalla</H2>
      <P>
        Vamos a diseñar una pantalla simple: dos botones (Encender / Apagar),
        una luz piloto y un texto.
      </P>

      <H3>4.1 · Insertar un botón momentáneo</H3>
      <OL>
        <LI>
          En la barra de herramientas, elige <Strong>Botón → Bit Switch</Strong>.
        </LI>
        <LI>
          Dibújalo en la pantalla y en propiedades:
          <UL>
            <LI>Dirección: <Strong>LB0</Strong></LI>
            <LI>Modo: <Strong>Set ON</Strong></LI>
            <LI>Texto del botón: <Strong>Encender</Strong></LI>
          </UL>
        </LI>
        <LI>
          Duplica el botón, ponlo al lado y cámbialo:
          <UL>
            <LI>Dirección: <Strong>LB0</Strong></LI>
            <LI>Modo: <Strong>Set OFF</Strong></LI>
            <LI>Texto: <Strong>Apagar</Strong></LI>
          </UL>
        </LI>
      </OL>

      <H3>4.2 · Agregar la luz piloto</H3>
      <OL>
        <LI>
          Inserta un <Strong>Indicador de bit (Bit Lamp)</Strong> a la derecha.
        </LI>
        <LI>
          Dirección: <Strong>LB0</Strong>. Estado ON → color verde. Estado OFF →
          gris. Texto: <Strong>Luz OK</Strong>.
        </LI>
      </OL>

      <H3>4.3 · Etiqueta de texto</H3>
      <P>
        Agrega un widget de texto en la parte superior:{" "}
        <Strong>“Panel de operación · Máquina 1”</Strong>. Ajusta fuente y
        tamaño desde propiedades. Esto es la disciplina que separa un HMI
        legible de uno que el operador maldice cada turno.
      </P>

      <H2 id="paso-5">Paso 5 · Simular el proyecto</H2>
      <OL>
        <LI>
          Guarda con Ctrl+S y compila con <Strong>Compilar → Todo</Strong>{" "}
          (F5). Confirma cero errores.
        </LI>
        <LI>
          Ejecuta <Strong>Simulación → Simulador HMI</Strong>.
        </LI>
        <LI>
          Toca “Encender” — la luz verde debe activarse. “Apagar” la debe
          apagar.
        </LI>
      </OL>

      <Callout variant="success" title="Milestone">
        Si tu simulador reproduce el encendido/apagado, ya tienes la mecánica
        completa de HMI. En la parte 2 (próxima entrega) montamos comunicación
        real hacia un PLC FL7 y hacemos que el bit encienda una salida física.
      </Callout>

      <H2 id="paso-6">Paso 6 · Descargar al HMI real (opcional)</H2>
      <P>
        Si tienes el HMI conectado, la descarga es directa:
      </P>
      <OL>
        <LI>
          Conecta el HMI por USB o Ethernet a la PC.
        </LI>
        <LI>
          En Flexem Studio, elige <Strong>Descargar → USB</Strong> o{" "}
          <Strong>Ethernet</Strong>.
        </LI>
        <LI>
          Confirma la dirección IP si es Ethernet (por defecto 192.168.0.4).
          Ajusta si tu red usa otra.
        </LI>
        <LI>
          Espera la barra de progreso. Cuando termine, el HMI se reinicia y
          arranca con tu proyecto.
        </LI>
      </OL>

      <H2 id="siguiente-parte">Qué viene en la parte 2</H2>
      <P>
        En la siguiente entrega conectamos la HMI a un PLC FL7 vía Modbus TCP,
        mapeamos LB0 a una salida física del PLC, y creamos una pantalla de
        alarmas real con histórico. Si quieres avanzar más rápido, revisa la{" "}
        <A href="/blog/hmi-flexem-modbus-plc-otra-marca">
          guía Modbus para conectar HMI Flexem a PLC de otra marca
        </A>{" "}
        — cubre el mismo concepto para PLC no-Flexem.
      </P>

      <BlogWhatsAppCTA
        message="estoy siguiendo el tutorial de Flexem Studio y necesito ayuda."
        title="¿Trabado en algún paso?"
        subtitle="Manda una captura del error o la pantalla donde estás. Un ingeniero nuestro te contesta el mismo día hábil."
        buttonLabel="Pedir ayuda técnica"
      />
    </>
  ),
}
