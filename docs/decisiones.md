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

## Rearmado del universo (2026-11-21)

> Pedido de la cumpleañera: la Luna como protagonista, Júpiter y Saturno porque son sus favoritos, el Sol afuera,
> y una confirmación de asistencia que encienda una estrella. Plan completo en
> [`guia-contenido-2026-11-21.md`](guia-contenido-2026-11-21.md).

| ID | Decisión | Por qué | Se revierte si… |
|---|---|---|---|
| `D-35` | **Dominio `galaxia.orangetech.com.ar`** (el anterior deja de usarse) | El usuario lo cambió en Cloudflare. Verificado 2026-11-21: el nuevo responde **200**, el viejo ya no resuelve | Que se vuelva a mover el dominio |
| `D-36` | **Elenco: Luna protagonista + Júpiter + Saturno.** El Sol sale del plano (solo queda un resplandor fuera de encuadre) y **Venus sale** | Pedido explícito de la cumpleañera. Sin un Sol como destino, la escena quedaba sin fuente de luz: el resplandor fuera de cuadro resuelve eso sin competir con la Luna | Que ella cambie de idea |
| `D-37` | **La carga de la portada son tres estrellas que se encienden, sin porcentaje.** El cohete, si aparece, va como ícono del botón | Los puntitos son el idioma universal de "cargando" (profesional) y las estrellas pertenecen al cielo. El "62 %" grita app; el cohete con humo se lee infantil en una invitación de 15 | Que el usuario pida el cohete |
| `D-38` | **Video completo (10,24 s) + aterrizaje por CSS.** ⛔ Revierte `D-19` (corte en 7,5 s) | Se midió el original: el brillo **sube** hacia el final (YAVG 90 → 111), o sea que termina en crescendo y su audio completo es la parte más dramática. El CSS continúa el movimiento para que no haya corte seco | Que la espera se sienta larga en las pruebas |
| `D-39` | **Vuelve la confirmación de asistencia**: se pide el **nombre completo** al entrar —en una tarjeta blanda, con "Solo mirar"— y la confirmación **enciende una estrella** en su cielo. ⛔ Revierte "RSVP afuera" (2026-11-21, mañana) | Pedido del usuario: confirmar deja de ser un trámite y pasa a ser un regalo visible. Blando y no bloqueante porque el invitado que llega de WhatsApp no tiene paciencia antes del impacto | Si la fricción espanta invitados en las pruebas |
| `D-40` | **Fotos y videos de Tiana sí van.** ⛔ Revierte la decisión §7 de `plan-universo` ("no van") | Cambió el pedido: hay fotos de bebé y videos que quiere mostrar. **En pausa**: primero se define el cómo (§5 de la guía) | Que se decida que no van |
| `D-41` | **Rótulos en dos capas:** el **destino** tiene nombre poético (`La cita`, `El brillo`, `Un detalle`) y la **sección adentro** mantiene el título funcional (`Cuándo y dónde`, `Cómo venir`) | "Vestimenta" y "Regalos" suenan a menú de banco; pero sin título claro el invitado se pierde. Dos capas resuelven las dos cosas | Que el usuario prefiera otra familia de nombres |
| `D-42` | **Los nombres de los invitados no se publican**: el sitio muestra solo el **total de estrellas**; los nombres viven en la planilla del usuario | Un link público con nombres y apellidos de invitados es un problema de privacidad que no compensa ninguna funcionalidad | Que el usuario pida lo contrario para un círculo cerrado |
| `D-43` | **Rótulos confirmados**: `La cita` · `El brillo` · `Un detalle` · `La memoria` · `Tu estrella` (con título funcional adentro de cada sección) | El usuario eligió la primera familia sobre la de viaje | Que ella prefiera otra |
| `D-44` | **La estrella pide el nombre completo y el nombre vive solo en la planilla del usuario.** El sitio muestra únicamente el total | Pedido explícito. Y es un juego, no un control de asistencia: sirve para saber quién entró, no para decidir nada | Que se quiera mostrar nombres en pantalla |
| `D-45` | **El que ya se registró no vuelve a ver la tarjeta**: se recuerda en `localStorage` (no en `sessionStorage`) | "Ya se salga": el invitado no debe completar dos veces. Es un dato mínimo, sin identificadores | — |
| `D-46` | **Dónde se guarda el nombre: a definir entre Apps Script + Sheet (`D-06`) y una base en el server propio** | El usuario pidió "nuestro propio server". Pros del server: control y respaldo propio. Contras: hay que mantener backup, permisos, HTTPS y disponibilidad. Apps Script: $0 y cero mantenimiento. **Decide el usuario** | — |
| `D-47` | **El caché de imágenes ya está resuelto** (`C3`, `_headers`: `/assets/*` inmutable 1 año, `/media/*` 7 días + `stale-while-revalidate`) | Pedido del usuario: que las imágenes no se vuelvan a bajar. Verificado en producción (`9dcfcf5`) | — |

| `D-50` | **Los tres cuerpos, siempre a plena luz.** Se probó atenuar Júpiter y Saturno al 55 % y encenderlos al toque; el usuario lo rechazó (se lee "apagado / roto" y el foco distrae del viaje). La jerarquía la sostienen el tamaño y el halo de la Luna. | Es lo que pidió la cumpleañera. | Si la escena se lee plana |
| `D-51` | **Carga mínima visible de 1,3 s.** El progreso llegaba a 100 % en 200 ms y las estrellas titilaban media vez. No es espera inventada: es el tiempo mínimo para que la animación comunique. | Sin piso, el indicador de carga no se ve y parece que no existe. | Si alguien se queja de la demora |
| `D-52` | **Movimiento reducido: leve, no inmóvil.** Con `prefers-reduced-motion` se apagan sólo los movimientos grandes o de profundidad (zoom del viaje, deriva del fondo); el flotar, el latido y el titilar se conservan a media velocidad. | Apagar todo dejaba el sitio inmóvil en equipos con las animaciones del sistema desactivadas, que es un ajuste común en Windows. | Si se detecta molestia real en alguien |
| `D-53` | **El anillo en tres capas.** La superficie del planeta es una capa propia entre la mitad de atrás y la de adelante del anillo. | Un pseudo con `z-index` negativo se pinta encima del fondo de su propio elemento: no sirve para "esconder detrás". | No |
| `D-54` | **Nada que parezca un botón.** Ninguna caja, borde ni relleno en elementos interactivos: la señal es el **movimiento** (línea que respira) y las áreas táctiles se mantienen grandes. El foco de teclado se reemplaza por un cambio de luz, no por un recuadro. | La píldora de vidrio rompía la ilusión de estar dentro del universo. | Si el test de QA muestra gente que no encuentra cómo entrar |
| `D-55` | **Las estrellas son ritmo, no medición.** Se prenden y se apagan de a una en ola; el progreso real lo informa la barra de 1 px. | Una estrella que se queda llena convierte el adorno en una barra de progreso, y el usuario ya tiene la barra. | No |
| `D-56` | **Movimiento reducido: la regla es selectiva, no un comodín.** Nada de `*{animation-duration:0.001ms!important}`: se aceleran sólo los movimientos grandes (zoom del viaje) y lo sutil sigue vivo. Se agregó `?debug` para diagnosticar en pantalla. | Un `*` con `!important` congelaba la invitación entera en equipos con animaciones del sistema apagadas. | No |
| `D-57` | **El warp llena la pantalla (`cover`).** Un video de hiperspacio no tiene encuadre que respetar: es textura en movimiento. Si el audio se bloquea, se reproduce **mudo** en vez de saltear el video. | Con `contain` el viaje quedaba como una tira con franjas negras; saltear por audio fallido mataba la parte más dramática. | Cuando exista el video 16:9 propio |
| `D-58` | **La carga se muestra sólo con estrellas.** Sin barra ni porcentaje en pantalla; el avance queda en `aria-valuenow` para lectores de pantalla. | El usuario prefiere el cielo antes que un medidor; la barra sobraba con la ola de estrellas. | Si el QA muestra gente que duda de que esté cargando |
| `D-59` | **El viaje se muestra siempre.** Se retira el `sessionStorage` que recordaba el "Saltar": cada carga arranca con el video y el botón Saltar está a la vista. | La memoria del salto hacía que la segunda visita no viera nunca la parte más dramática, y obligaba a usar `?intro` para revisar. | Si molesta a quien recarga varias veces |
| `D-60` | **El zoom del viaje no se cancela con movimiento reducido**: se acorta (1,1 s, scale 4 en vez de 12). | Tercera vez que una guarda de `prefers-reduced-motion` dejaba la animación invisible en el equipo del usuario. | **Superada por `D-63`** |
| `D-61` | **El planeta de fondo va nítido**: sin blur. La profundidad la dan la opacidad y el tamaño, no el desenfoque. | El usuario lo describió como "nebuloso" y no distinguía si era el planeta el que estaba borroso. | `D-64` (se va también la máscara de borde) |
| `D-62` | **Ninguna animación se cancela por accesibilidad: se acorta.** Se elimina el `early return` que, con movimiento reducido, salteaba el aterrizaje entero. | Mismo motivo que `D-60`. Regla para todo el sitio, no sólo para el viaje. | `D-63` |
| `D-63` | **El viaje es un recorrido, no un zoom** — y el **camino es el mismo** con movimiento reducido: sólo cambia la duración (1400 → 900 ms) y se anula el arco. Toda la geometría se **mide** (`getBoundingClientRect`) en vez de estimarse. | El zoom terminaba en un tamaño distinto del que arrancaba el aterrizaje —3840 px → 1358 px en desktop, y **1280 → 1358 px con movimiento reducido** (¡crecía!)— y ese salto es lo que el usuario describió como "aparece como un scroll". Cambiar el recorrido entre los dos caminos de accesibilidad fue la causa de tres bugs seguidos. | Si el arco se siente largo o corto |
| `D-64` | **Un solo cuerpo de punta a punta.** El planeta del rincón es el mismo `.astro` del mapa (capas, terminador, anillo), no una foto en un cuadrado recortado; `medirRincon()` (`src/lib/rincon.ts`) es la única fuente de la geometría del destino. | Dos objetos distintos hacían visible el relevo, y Saturno **aterrizaba sin anillo**: una elipse del 268 % del planeta no entra en un `border-radius: 50%`. | No |
| `D-65` | **Una sola curva para el vuelo.** La posición se **muestrea** (15 fotogramas, easing lineal) sobre `smootherstep` en vez de encadenar dos tramos de easing. Duración 1600 ms (1000 con movimiento reducido), en `DUR_VUELO` (`Mapa.tsx`), un solo número. | Con dos tramos de easing, en el empalme la velocidad saltaba **2,4×** (el primero salía a 1,9 y el segundo entraba a 4,6): eso es exactamente lo que el usuario sintió "brusco". Con la curva en los valores, la velocidad no tiene saltos. | El número, el arco o el destino: los tres están a la vista |
| `D-66` | **La vuelta es el mismo vuelo con los extremos invertidos**, y se anima **en el mapa**, no en la sección: el destino (el rectángulo real del cuerpo) sólo existe con el mapa montado. Se mide en `useLayoutEffect` (antes del primer pintado), la sección se apaga primero (texto → cielo) y el cambio de pantalla lo tapa un velo del mismo negro (`#03040a`). Al posarse, el cuerpo lleva `.en-casa`: conserva el `flotar` y **no** re-dispara `entrar`. | Idéntico motivo que `D-64` pero al revés: cualquier corte entre pantallas se lee como scroll, y si la vuelta fuera *otro* movimiento se notaría. Medir después de montar evita el salto de "aparece en su lugar y después salta al rincón". | No |
