# Plan de carga — que entre volando

> **Problema reportado:** "las imágenes tardan unos segundos en aparecer".
> **Fecha:** 21/11/2026 · **Estado:** propuesto, esperando OK. No se escribe código hasta que se autorice.
> Complementa el [plan general](plan-invitacion-xv-2026-11-21.md) (esto es la letra chica de la fase `F5`
> del presupuesto de peso) y el [plan del universo](plan-universo-2026-11-21.md).

## 1. Diagnóstico medido (no es intuición)

Pesos reales de hoy:

| Asset | Hoy | Cuándo se descarga | ¿Se nota? |
|---|---:|---|---|
| JS + CSS (gzip) | 76,8 KB | al abrir | no |
| `galaxia-mobile.webp` | **117,3 KB** | al abrir (portada) | **sí, es lo primero** |
| `poster.webp` | **71,6 KB** | al abrir | **sí** |
| `sol.webp` + `venus.webp` + `saturno.webp` | **61,9 KB** | **recién cuando aparece el universo** | **sí, los planetas aparecen de a uno** |
| `warp.mp4` | **1.343 KB** | **recién en el click** | **sí, el click se siente muerto** |
| `anillo.webp` | 12,1 KB | nunca (quedó sin usar) | basura a borrar |

**Total de la experiencia: 1.593 KB.**

Y el problema no es sólo el peso, son **tres momentos** en los que el usuario mira una pantalla vacía:

1. **Portada:** la imagen es el fondo de la portada → hasta que baja, se ve negro.
2. **Universo:** los planetas son `background-image` de CSS → el navegador **no los pide hasta que la
   pantalla se monta**, o sea después del video. Por eso "aparecen de a uno".
3. **Click en "Iniciar viaje":** el video arranca a descargarse **en ese momento** y encima con
   `preload="none"`. El click tiene que esperar red.

Extra: Cloudflare sirve **todo** con `cache-control: max-age=0, must-revalidate` → la segunda visita del
mismo invitado vuelve a preguntar por cada archivo (son 304 baratos, pero son 6 viajes de ida y vuelta).

## 2. Meta

| Métrica | Hoy | Meta |
|---|---:|---:|
| Peso hasta ver la portada | 265 KB | **≤ 150 KB** |
| Peso hasta poder tocar "Iniciar viaje" con todo listo | 1.593 KB (y esperando) | **≤ 900 KB, ya descargado** |
| Espera percibida en el click | 1-3 s | **0** |
| Segunda visita | revalida todo | **instantánea (caché inmutable)** |

## 3. Las cuatro palancas

### A. Cambiar de formato: AVIF (−50 % sin perder calidad)
No es "comprimir más fuerte", es un códec mejor: **misma calidad visual, la mitad del peso**. Medido con
los originales del Drive, no re-comprimiendo el WebP:

| Archivo | Hoy (WebP) | AVIF | Ahorro |
|---|---:|---:|---:|
| Galaxia mobile 768px | 117,3 KB | **53,7 KB** (crf 32) | −54 % |
| Galaxia (versión de fondo, 540px) | — | **~32 KB** (crf 38) | — |
| Poster | 71,6 KB | **28,2 KB** | −61 % |
| Sol | 31,5 KB | **14,8 KB** (@512px) | −53 % |
| Venus | 25,9 KB | **11,4 KB** (@512px) | −56 % |
| Saturno | 4,5 KB | ~3 KB | −30 % |

**Soporte:** AVIF lo banca Safari 16+ (sep-2022), Chrome 85+, Firefox 93+. Cubre prácticamente todos los
celulares que van a abrir esto. Igual **no se rompe nada** en los viejos: `image-set()` en CSS y
`<picture><source type="image/avif">` dejan el WebP actual como fallback. Cero riesgo.
**El fondo desenfocado además perdona**: la capa lejana tiene `blur(6px)` y la nebulosa `blur(26px)`, así
que ahí se puede ir a crf 38 sin que se note nada.

### B. Precargar en dos velocidades (esto es lo que mata la espera percibida)
- **Velocidad 1 — apenas abre:** `<link rel="preload">` de la galaxia + `fetchpriority="high"` en la
  portada. Se adelanta a la descarga del fondo.
- **Velocidad 2 — mientras el invitado lee la portada:** precarga silenciosa de los tres planetas y del
  video. **Ese tiempo muerto de lectura es gratis**: hoy se desperdicia.
- **LQIP:** un thumbnail de 20px de la galaxia, incrustado como base64 en el CSS (**~1 KB**), se estira y
  desenfoca al instante. La portada nunca se ve negra: se ve una galaxia borrosa y 300 ms después aparece
  nítida. Es la técnica que usan Instagram y Medium.

### C. Loader — "preparando el viaje"
Pantalla con la estética de la invitación (no un spinner de librería): un anillo orbitando + barra fina +
"Preparando el viaje" y el % real. Reglas:

- **Sólo aparece si tarda más de 500 ms.** Si la red está rápida, el invitado no ve nada (nada peor que un
  loader por un archivo que ya estaba).
- **Progreso real por bytes**, con los pesos conocidos del build (no dependemos de `Content-Length`, que
  Cloudflare no manda).
- **Red de seguridad: a los 8 s se habilita el botón igual.** Nunca se queda trabado. Si no cargó todo,
  arranca y el resto sigue bajando.
- **El video no necesita el 100 %**: alcanza con `canplaythrough` (unos primeros segundos en buffer) porque
  la animación dura 7,5 s y se va reproduciendo mientras baja. Esto es clave: pedir 1,3 MB antes de dejar
  pasar sería peor que el problema original.
- Respeta `prefers-reduced-motion` (sin anillo girando, barra estática).

### D. Caché inmutable + video más liviano
- `_headers` con `max-age=31536000, immutable` para `/media/*` y `/assets/*` → **segunda visita = 0 red**.
  Como `immutable` congela el archivo, los nombres se versionan (`galaxia-mobile.v2.avif`) al cambiarlos.
- Video re-codificado: **1.343 KB → ~783 KB** (crf 33, medido; crf 34 = 716 KB). A 704px y con una
  animación de warp borrosa, la diferencia **no se ve**. Además `+faststart` (el índice al principio: hoy
  el MP4 lo tiene al final, lo que retrasa el arranque).

## 4. Tramos

Cada tramo es un commit, entra en una respuesta y deja el build verde.

| # | Qué | Archivos | Terminado cuando |
|---|---|---|---|
| **C1** | Generar AVIF + fallback, borrar `anillo.webp` | `public/media/` (assets) + `mapa.css`/`App.tsx` (rutas) | La portada y el universo se ven **idénticos** y el peso de imágenes baja ≥ 50 %. Verificado en Chrome y Safari |
| **C2** | Re-codificar el video (crf 33 + faststart) | `public/media/warp.mp4` | El video pesa ≤ 800 KB y se ve igual. Primer frame en < 300 ms |
| **C3** | Caché inmutable versionado | `public/_headers` + nombres | Segunda visita: **0 requests** de media en DevTools (todo `from disk cache`) |
| **C4** | Precarga + LQIP | `index.html`, `App.tsx`, `src/portada.css` | Al abrir no hay instante negro: hay galaxia borrosa → nítida |
| **C5** | Loader con progreso real | `src/components/Loader.tsx` + `App.tsx` + CSS | En 4G simulada el invitado ve el % subir y el click arranca **sin espera**. Con red rápida el loader ni aparece |

**Orden:** C1 y C2 primero (son los que bajan el peso), C3 después (barato), y C4+C5 al final (son los que
cambian la sensación). Si en algún momento hay que cortar, C1+C2+C5 ya dan el 80 % del resultado.

## 5. Riesgos y cómo se cubren

| Riesgo | Cobertura |
|---|---|
| Un navegador viejo no lee AVIF | `image-set()` / `<picture>` con fallback WebP. Nunca queda sin imagen |
| El loader se vuelve un bloqueo peor | Aparece sólo si > 500 ms y se libera solo a los 8 s |
| `_headers` no lo soporta Cloudflare Workers (sí Pages) | Se verifica en C3; si no lo soporta, se hace con una regla de Cache Rules en el panel (mismo resultado) |
| `immutable` sirve una imagen vieja para siempre | Nombres versionados (`.v2.`, `.v3.`) |
| Precargar el video gasta datos del invitado | 783 KB y sólo después del primer pintado; es lo que igual iba a bajar al tocar |
| Safari ignora la precarga del video | Se usa el propio `<video preload="auto">` ya montado (D-18) y se mide `buffered`; si Safari no colabora, el click espera lo mismo que hoy — **no empeora nada** |

## 6. Decisiones que esto agrega (a confirmar)

- **D-25 — AVIF como formato principal, WebP como fallback.** Misma calidad, −50 % de peso.
- **D-26 — Nombres versionados en `/media/`.** Es el precio de cachear para siempre.
- **D-27 — El loader nunca bloquea.** 500 ms para aparecer, 8 s de red de seguridad, y el video se espera
  sólo hasta `canplaythrough`.
- **D-28 — LQIP inline para el fondo de la portada.** ~1 KB que eliminan el "pantallazo negro".
- **D-29 — Presupuesto nuevo:** primer pintado ≤ 150 KB, experiencia completa ≤ 900 KB.

## 7. Lo que NO entra acá

- No se toca el diseño, ni los textos, ni la escena del universo: es **sólo peso y orden de carga**.
- No se agregan dependencias (ni `sharp`, ni `imagemagick`, ni librerías de loader). Todo con `ffmpeg` +
  `cwebp` que ya están en el server.
- No se hace service worker / PWA: agrega complejidad de caché y no hace falta para una invitación.
- No se baja la resolución por debajo de lo que pide la pantalla: eso **sí** se vería.
