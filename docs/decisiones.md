# Decisiones (ADR)

> **Estado:** 🟢 vivo
> **Fecha:** 2026-11-21
> **Manda:** esta tabla. Si un plan la contradice, **manda la decisión** (y se corrige el plan).

Formato: `D-xx` · decisión · **por qué** · qué la revertiría.

| # | Decisión | Por qué | Se revierte si… |
|---|---|---|---|
| **D-01** | Proyecto **aislado**: carpeta `xv-galaxia/`, repo git propio, puerto **5199** | Pedido explícito: no interferir con las apps existentes. Puerto 5199 verificado libre (ocupados: 3000, 3100, 4001, 5432, 8000, 8080, 8443, 8880, 27117, 20241) | — |
| **D-02** | **Vite 8 + React 19 + TypeScript** | Mismo stack que `sorteo-norbridge` y `revista-digital`: consistencia y comportamiento conocido | Que el peso o el arranque se vuelvan un problema |
| **D-03** | **CSS plano con variables**, sin Tailwind | El efecto vive en blur, glows y gradientes: control total y 0 peso de runtime | Que la UI crezca a 15+ pantallas |
| **D-04** | **2.5D, no 3D.** Three.js / R3F **no** en la v1; planetas como sprites/esferas sobre canvas | El WebGL del WebView de WhatsApp se cae en gama media. El 90% del efecto se logra sin 3D real | Que el 2.5D no alcance **y** las pruebas en devices reales lo banquen |
| **D-05** | **Scroll nativo**, sin Lenis ni scroll hijack | Lenis pelea con el pull-to-refresh y el scroll anidado del WebView | Sólo desktop, si hace falta inercia |
| **D-06** | **RSVP en Google Apps Script + Google Sheet**, sin backend propio | $0, cero infra, cero deploy, no toca nada existente | Que haga falta panel con permisos o volumen alto |
| **D-07** | **Token opaco** por invitado en la URL (`?i=7f3a9c`), nunca `?familia=Perez&pases=4` | Un link reenviado no debe filtrar apellidos ni permitir inflar pases | — |
| **D-08** | **Cloudflare Pages** como hosting | Gratis, ancho de banda ilimitado, CDN, HTTPS, `*.pages.dev` | Que el dominio/DNS ya esté en otro proveedor |
| **D-09** | **Fallback CSS obligatorio** para la Etapa 2 (zoom + flash 1.2 s) | iOS en ahorro de batería bloquea el video aun con gesto. Nunca pantalla negra | — |
| **D-10** | **Presupuesto de peso** como contrato: <120 KB JS gzip, <180 KB imagen, <2 MB video, <3 MB total | El 90% de los invitados lo abre desde el celular y muchos con datos móviles | Que el hosting/CDN cambie el escenario |
| **D-11** | **Sin datos personales en el repo** (nombres, teléfonos, alias/CBU) | El repo puede terminar compartido; los datos del evento van a la planilla privada | — |
| **D-12** | **Plan-primero**: ningún tramo de código arranca sin OK explícito | Pedido explícito del 2026-11-21 (*"primero el plan"*) | Que el usuario pida modo autónomo |
| **D-13** | **Una sola rama (`main`)**, sin staging | Proyecto chico, sin usuarios concurrentes ni datos críticos | Que el RSVP empiece a recibir datos reales y haya que probar cambios |
| **D-14** | **Pista de audio instrumental libre** (Suno / Pixabay) | Un tema con copyright en un link público se silencia o se bloquea | Que el usuario tenga licencia del tema que quiere |
| **D-15** | **Los datos del evento viven en un único `src/evento.ts`** (nombre, fecha, hora, lugar, alias) | El nombre y la fecha son **provisionales**: cambiarlos tiene que ser un archivo, no diez pantallas | — |
| **D-16** | **Credencial de GitHub dedicada a este repo** (deploy key con write, o PAT fine-grained) | La llave SSH del server es un *deploy key* de `colegionorbridge/Portal-Norbridge` y no puede pushear a `rgcandia`. Una llave por repo no da acceso al resto de la cuenta | Que el usuario prefiera una llave de cuenta |

## Decisiones cerradas (2026-11-21)

| # | Pregunta | Decisión |
|---|---|---|
| A-01 | Nombre de la carpeta | ✅ **`xv-galaxia`** |
| A-04 | Mesa de regalos | ✅ **Alias / CBU por transferencia** (falta el alias concreto) |

## Decisiones abiertas

| # | Pregunta | Opciones | Quién decide |
|---|---|---|---|
| A-02 | Dominio propio | `*.pages.dev` gratis · dominio propio ~USD 12/año | Usuario |
| A-03 | ¿RSVP con pases por familia o abierto? | Con pases (recomendado) · sin pases | Usuario |
| A-05 | Métricas | Cloudflare Web Analytics (sin cookies) · ninguna | Usuario |
| A-06 | Dress code | Recomendado: "elegante sport en clave galaxia, evitá el blanco" | Usuario |

## Agregadas después del arranque

| ID | Decisión | Motivo |
|---|---|---|
| `D-17` | **La portada no muestra la fecha** | Pedido del usuario (2026-11-21). La fecha va en la sección *Núcleo*, no en la entrada. |
| `D-18` | **El `<video>` está siempre montado y oculto** (`preload="none"`) | Montarlo bajo demanda dejaba `videoRef.current = null` en el click: el CTA no arrancaba. Además, `play()` dentro del gesto es lo que habilita el audio en iOS. |
| `D-19` | **Corte del video en 7,5 s** (el video dura 10,24 s) | Con 6 s el audio se cortaba a mitad de frase. Es una constante: `corteVideoSegundos`. |
| `D-25` | **AVIF como formato principal y WebP como fallback** (`image-set()` dentro de un `@supports`, y `<picture>` con `type="image/avif"`) | Medido sobre los originales: galaxia 117→54 KB, poster 72→28 KB, planetas 62→26 KB. Es el mismo peso visual. El fallback es obligatorio: AVIF es Safari 16+ y no se puede apostar la invitación a eso. |
| `D-26` | **El `@supports` va aparte, nunca como segunda declaración en la misma regla** | El minificador de CSS borra la declaración pisada: el fallback WebP desaparecía y un navegador sin `image-set()` se quedaba **sin foto**. Detectado comparando el CSS de `dist/`. |
| `D-27` | **El video se re-codifica siempre desde `material/raw/video/`, nunca desde `public/media/warp.mp4`** | Re-comprimir un archivo ya comprimido acumula artefactos (doble generación). El crudo no se versiona justamente para esto. |
| `D-28` | **Video con `+faststart`** | Sin eso el índice queda al final del MP4 y el navegador no puede empezar a reproducir hasta bajarlo casi entero. |
| `D-29` | **El loader nunca bloquea**: aparece recién a los 500 ms y se libera solo a los 8 s | Un cartel de carga por un archivo que ya estaba es peor que la espera. Y si la red es mala, el invitado entra igual: la invitación no puede depender de 1 MB. |
| `D-30` | **El progreso de la barra se mide contra los pesos del build, no contra `Content-Length`** | Cloudflare no manda `Content-Length` en estos assets: sin esto la barra no tendría de qué agarrarse. El video cuenta 45 % y se da por completo con 40 % en buffer (dura 7,5 s: se reproduce mientras termina de bajar). |
| `D-31` | **El whoosh del viaje se genera con `ffmpeg` (ruido rosa filtrado + envolvente), no se descarga** | 0 problemas de licencia, 9,6 KB, y se puede re-generar/ajustar cambiando dos números. Mono, AAC en `.m4a` (lo tocan todos los navegadores, a diferencia de OGG en iOS). |
| `D-32` | **El audio se crea con `new Audio()` en vez de un `<audio>` en el JSX** | Permite `play()` dentro del gesto del tap (iOS lo exige) y que el componente lo reutilice. Si el navegador lo bloquea, el viaje sigue igual. |
| `D-33` | **El fondo del universo es una foto real (Helix Nebula, Hubble/Spitzer, NASA-JPL, dominio público), no una ilustración** | Los planetas ya eran fotografía; una base dibujada hacía que el ojo detectara lo falso justo en el fondo. 30 KB en AVIF (el anterior pesaba 54). Desenfoque de 5 px en vez de 9: una foto real no necesita disimulo. |
| `D-34` | **El viaje al planeta se anima con `@keyframes` en el contenedor, nunca con `transition` sobre un elemento animado** | Lección del bug del Sol: `pulso` animaba el `transform` del `.astro`; al quitarle la animación, el navegador libera la propiedad y el `transition` no tiene valor de partida → salta al final. Con `@keyframes` el `from` está escrito explícito y no depende del estado previo. |
