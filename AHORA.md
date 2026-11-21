# AHORA · 2026-11-21 20:10

> Puerta de entrada. Si algo no está acá, no es el trabajo de hoy.
> Plan que manda: [`docs/guia-contenido-2026-11-21.md`](docs/guia-contenido-2026-11-21.md)

## Dónde estamos

**Fase:** `F3` (el universo) cerrada + `F6-a` (desktop) v1 + **el viaje reescrito** (`S7`, `S8`).
**Dominio:** **`galaxia.orangetech.com.ar`** (el viejo `xv-galaxia.` ya no resuelve).
**Estado:** el planeta **vuela** de su lugar al rincón en vez de hacer zoom. **Local, sin pushear**
(2 commits nuevos sobre `ae9e121`). Pendiente: que el usuario lo mire en localhost.

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

## Lo que sigue (en orden de pedido)

- [ ] **Ver el viaje en localhost** y ajustar (velocidad 1400 ms, arco, tamaño del destino).
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
