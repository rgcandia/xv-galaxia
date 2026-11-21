/**
 * D-64 · El rincón donde aterriza el planeta elegido, en píxeles.
 *
 * Lo usan los DOS extremos del vuelo: `Mapa` para saber a dónde va el cuerpo y
 * `Universo` para saber dónde se dibuja el planeta de fondo. Antes cada uno
 * tenía su propia idea del tamaño final ("que cubra la pantalla", medido a ojo)
 * y el empalme se veía como un salto: es el bug que el usuario describió como
 * "aparece como un scroll".
 *
 * 🔒 Si cambia acá, cambia también `.universo .planeta-fondo` en `universo.css`.
 * Los números son los mismos a propósito: CSS manda para el tamaño en pantalla
 * (así responde al girar el teléfono sin JS) y esta función los replica para
 * que el vuelo sepa cuánto mide el destino antes de que exista.
 */
export type Rincon = { left: number; top: number; tam: number }

export function medirRincon(): Rincon {
  const ancho = window.innerWidth
  const alto = window.innerHeight
  const tam = Math.min(ancho * 0.58, 460) // width: min(58vw, 460px)
  return {
    left: ancho * 1.12 - tam, // right: -12vw
    top: -alto * 0.12, // top: -12vh
    tam,
  }
}
