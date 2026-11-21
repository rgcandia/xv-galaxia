# AHORA · 2026-11-21 20:25

> Puerta de entrada. Si algo no está acá, no es el trabajo de hoy.
> Plan que manda: [`docs/guia-contenido-2026-11-21.md`](docs/guia-contenido-2026-11-21.md)

## Dónde estamos

**Fase:** `F3` (el universo) cerrada + `F6-a` (desktop) v1 + **el viaje reescrito** (`S7`, `S8`).
**Dominio:** **`galaxia.orangetech.com.ar`** (el viejo `xv-galaxia.` ya no resuelve).
**Estado:** el planeta **vuela** de su lugar al rincón, más suave, **y vuelve** a su lugar. **Saturno ya
se ve en el rincón** (`S10`: le faltaba la capa `.superficie`, el anillo viajaba sin planeta) y **su
anillo está vivo** (`S11`: sombra sobre la cara + brillo en contrafase, `D-67`). En desktop **la galaxia
de entrada va acostada** (`S12`) y llena la pantalla, sin la franja negra que dejaba el viejo "recentrado"
(`S13`, `D-69`). **Local, sin pushear** (29 commits nuevos sobre
`ae9e121`). Pendiente: mirar en localhost · el desfase de ~0,4 s del whoosh en la vuelta (queda así por
decisión del usuario).

### Recién hecho: el final del video y el título (`S25` → `S26`/`S28` · `S29`)
El velo final es **oscuro y con un agujero** en el punto de luz de la galaxia: la luz queda encendida y
sigue encendida del otro lado, así que la transición no se lee como corte (`D-81`). El título pasó a ser
la frase **"Una noche en el cosmos"**, con `Mis 15` de kicker arriba y `Tiana` de firma.
La portada ganó peso sin recuperar la caja: kicker en champagne, scrim detrás del bloque de arriba y abajo del
CTA una sola señal: la barrita que titila (`S30`/`S31`, `D-82`).
**Falta mirarlo en localhost.** Queda pendiente la **música con botón** (decidida, sin empezar).

### Antes: el final del video (`S25` → corregido en `S26`)
Al llegar al corte **no se pausa** el video: sube a 2,2× **mientras se apaga** hasta `brightness(0.35)`,
y una capa **oscura** opaca le pasa por encima en 0,8 s. Recién ahí se suelta el video, se monta el mapa
debajo y el velo —del mismo negro que el cielo— se va en 0,8 s: el mapa no aparece, se ilumina. Se fue el "cuadro
congelado" **y** el fogonazo blanco (`D-79` → `D-80`). Corte a 9,9 s. **Falta mirarlo en localhost.**

### Cerrado: el parpadeo al aterrizar (`S22`–`S24`)
El planeta parpadeaba al terminar de acomodarse. No era la geometría (cierra exacta) ni la
rasterización: **era un cuadro intermedio de React**. `posar()` soltaba la animación y los estilos en
línea antes de pedir el cambio de clases, y ese `setState` viene de una promesa → React lo agenda para
otra tarea → en el medio se pinta un cuadro con el cuerpo `position: fixed` sin `left/top/width` y sin
transformación. Ahora `flushSync` hornea las clases primero y recién después se suelta lo imperativo
(`D-78`). **Falta confirmar en el celular.**

## Quién manda en la escena (pedido de la cumpleañera, `D-36`)

| Cuerpo | Rol | Sección |
|---|---|---|
| 🌕 **Luna** | protagonista (3× los demás, halo que late, textura real + terminador) | **La cita** |
| 🪐 **Júpiter** | secundario (textura real, bandas + mancha) | **El brillo** |
| 💍 **Saturno** | secundario (anillo ya en su lugar: `D-53`) | **Un detalle** |
| ☀️ ♀️ | **afuera**: el Sol y Venus salieron del plano y de la precarga (−83 KB) | — |

## Lo que se cerró hoy

1. **Dominio** `galaxia.` en `og:*` y `canonical` (`I1`).
2. **Portada**: tres estrellas en ola, **sin barra y sin botón** — la señal es el movimiento (`D-37`, `D-54`, `D-58`).
3. **Video completo** (10 s) y **aterrizaje** que funde con el universo.
4. **Nada que parezca un botón**: CTA y nav sin caja (`V1`, `V2`).
5. **Movimiento devuelto**: el `*{animation-duration:0.001ms!important}` de `global.css` congelaba la invitación entera en equipos con animaciones del sistema apagadas (`D-56`).
6. **Desktop**: sky a pantalla completa, cuerpos en columna de 440 px, y el video warp tratado como **portal vertical** con bordes fundidos (`D-48`, `D-57`).

## El tramo abierto: el viaje (`S7` + `S8`)

Lo que estaba roto y por qué se leía como **scroll** — tres causas, no una:

1. `.universo` entraba con `aparecer`, que sube **14 px** la pantalla entera con el texto quieto.
2. El zoom terminaba en un tamaño distinto del que arrancaba el aterrizaje
   (3840 px → 1358 px en desktop; y **1280 → 1358 con movimiento reducido**: crecía). Ese salto es el corte.
3. El planeta del rincón era **otro objeto** (foto recortada en un círculo), no el cuerpo que tocaste.

Ahora hay **un solo cuerpo**, medido en píxeles en los dos extremos (`src/lib/rincon.ts`), que sale de
donde está, hace un arco y se acomoda arriba a la derecha; el cielo se apaga y la sección se enciende
debajo. Saturno, de paso, **conserva el anillo** al aterrizar.

## Cerrado: el anillo de Saturno (`S11`–`S21`)

Costó cinco tramos y el aprendizaje quedó en `D-67`/`D-72`/`D-73`/`D-74`/`D-75`/`D-76`: dos copias
semitransparentes del anillo que se tocan **siempre** dejan juntura (clara con `clip-path`, oscura con
máscaras). La solución es una sola copia entera detrás del planeta + su mitad de adelante dibujada
dentro de la cara y recortada por ella. **Se ve bien, no tocar.**

## Próximo tramo (a definir con el usuario): el contenido de las secciones

Pedido: **sin chips ni tarjetas** — el contenido va directo sobre el espacio. Cada planeta con su
propia forma de mostrar y su propia animación (satélite orbitando, tránsito, etc.).
Pendiente: elegir el lenguaje de cada sección antes de escribir código.

## El tramo abierto: el viaje, suave y de ida y vuelta (`S9`)

Lo que cambió después de verlo el usuario:

1. **La curva.** Eran dos tramos de easing pegados en la mitad y en el empalme la velocidad saltaba
   **2,4×** — de ahí la sensación de brusco. Ahora se muestrea **una** curva continua
   (`smootherstep`, 15 fotogramas con easing lineal): sale suave, viaja, se posa.
   El número es **uno**: `DUR_VUELO` en `Mapa.tsx` (1600 ms · 1000 con movimiento reducido).
2. **La vuelta.** El destino del regreso no existe hasta que el mapa está montado, así que se anima
   **en el mapa**: al tocar "Universo" la sección se apaga, queda el planeta solo sobre `#03040a`, y
   el mapa monta con un **velo del mismo negro**; antes del primer pintado se mide el lugar real del
   cuerpo y se lo trae por **el mismo arco**. El pasaje no corta: es un apagón y el planeta volviendo.

Los tres números que se pueden mover: **duración** (`DUR_VUELO`), **arco** (11 % del recorrido, tope
90 px) y **tamaño del destino** (`min(58vw, 460px)` en `.universo .planeta-fondo` ⇄ `medirRincon()`).

## Lo que sigue (en orden de pedido)

- [ ] **Ver el vuelo y la vuelta en localhost** y ajustar (`DUR_VUELO`, arco, tamaño del destino).
- [ ] **El anillo de Saturno, animado** (`T-ring`): sombra del anillo sobre la cara + brillo que recorre la banda.
- [ ] **La Luna tiene el terminador muerto**: hay dos `.luna .astro::after` y la segunda pisa a la primera.
      Es un bug viejo, no de este tramo. ¿Se arregla? (cambia el look de la protagonista).
- [ ] **Cambios nuevos del usuario** (llegan después de verlo en el celular).
- [ ] **Video 16:9**: es la solución de raíz para desktop. Mismo prompt, nuevo encuadre.
- [ ] **Confirmación = estrella** (`E0`–`E2`): falta **una** decisión — Apps Script + Sheet (recomendado, $0) o tablita en el server propio.
- [ ] ⏸️ **"La memoria"** (`M0`–`M3`): fotos + videos + cápsula de audio. En pausa hasta definir el cómo (`§5` de la guía).
- [ ] **Datos reales del evento**: hora/lugar, Maps, dress code. Fecha `2/2/2027` sigue **provisional**.

## Reglas que no cambian

- Un tramo = un commit · `npm run build` verde antes de commitear.
- 🔒 **No se pushea sin OK** (cada push = 1 deploy de los 500 del plan free).
- Cero datos de invitados en el repo · nombres solo en la planilla privada.
