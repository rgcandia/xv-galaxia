# TASK — backlog abierto

> Lo pendiente que **no** es tramo de nadie. Si algo de acá se vuelve urgente, se promueve a tramo del
> [rearmado](docs/guia-contenido-2026-11-21.md) y se le escribe su «terminado cuando».
> **Regla:** acá se anota, no se construye.

## 🔴 Bloqueantes (frenan el plan)

- [ ] **Datos del evento** — hora, lugar + Maps, dress code, alias definitivo. Pasan por `src/evento.ts`.
- [ ] **Confirmar nombre y fecha** — siguen con `provisional: true` (2 de febrero de 2027).
- [ ] **Material de Tiana** — fotos de bebé y videos. Se piden **cuando se defina "La memoria"** (hoy en pausa).

## ✅ Promovidos a tramo (2026-11-21)

Ya tienen su tramo escrito en [`docs/guia-contenido-2026-11-21.md`](docs/guia-contenido-2026-11-21.md); no se
trabajan desde acá.

| Antes era una idea acá | Ahora es |
|---|---|
| El cielo de sus invitados (estrella por confirmación) | `E0` · `E1` · `E2` |
| Su constelación / cápsula de voz | `M1` · `M3` (⏸️ en pausa) |
| Rotación lenta de los cuerpos | `Q3` |
| `U4` La llegada | `Q1` |
| `U5` El latido que invita a tocar | `Q2` |

## 🟡 Ideas anotadas (no se construyen)

- [ ] **El cohete con humo** como indicador de carga — descartado por ahora (se lee infantil); si vuelve, va
      como **ícono del botón "Iniciar viaje"**, no como loader.
- [ ] **El eclipse** — la Luna cruzando el resplandor del Sol como transición de llegada al universo.
- [ ] **Los cráteres de la Luna** como álbum: tocás un cráter y se abre un recuerdo.
- [ ] **El álbum orbital** — las fotos orbitando la Luna despacio (ojo: batería).
- [ ] **La estela del cometa** — recorrido de su vida, bebé → 15, deslizando.
- [ ] **"Has viajado X millones de km"** — contador de años → kilómetros alrededor del Sol.
- [ ] **Muro de mensajes** — los invitados le dejan una frase; se puede proyectar en la fiesta.
- [ ] **Modo "sin sonido" explícito**, además del mute.
- [ ] **Sombra de Saturno sobre el anillo** (el planeta eclipsa la mitad del anillo).

## 🔵 Infra / calidad

- [ ] **Pedir la imagen mobile en 1080×1920** (la actual es 768 px de ancho: se escala 1.5× en pantallas modernas).
- [ ] **Audio ambient** — pista instrumental libre (Suno / Pixabay), mono 128 kbps, 40 s con loop y fade-in.
- [ ] **QR para la tarjeta física** (si hay invitación impresa).
- [ ] **Métricas** — Cloudflare Web Analytics (sin cookies): cuántos abrieron, cuántos confirmaron.

## ⚪ Descartado (queda como registro)

- **Parallax de los cuerpos con `pointermove`** — se probó (`P1`), se sintió tosco en el celular y se revirtió
  (`2289cff`). La profundidad la dan las capas, no el dedo. **No se reintenta.**
- **El porcentaje en la carga** — lo reemplazan las tres estrellas (`D-37`).
- **Three.js / R3F real** — se evalúa recién si el 2.5D no alcanza. Es el riesgo #1 de crashes en el WebView de WhatsApp.
- **Lenis (scroll con inercia)** — pelea con el pull-to-refresh. Solo se reconsidera para desktop.
- **Base de datos propia / backend Node** — la confirmación va a Apps Script + Sheet. Cero infra.
- **Tailwind** — CSS plano con variables cubre el caso y pesa 0 en runtime.
