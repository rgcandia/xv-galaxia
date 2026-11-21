# TASK — backlog abierto

> Lo pendiente que **no** es tramo de nadie. Si algo de acá se vuelve urgente, se promueve a fase del
> [plan](docs/plan-invitacion-xv-2026-11-21.md) y se le escribe su «terminado cuando».
> **Regla:** acá se anota, no se construye.

## 🔴 Bloqueantes (frenan el plan)

- [ ] **Video de inmersión** — el MP4 del Drive devuelve 404. Opciones: (a) compartirlo como "cualquiera
      con el enlace", (b) copiarlo a `material/raw/video/`, (c) generarlo de nuevo (Kling / Hailuo / Flow,
      6 s, 720×1280, movimiento de cámara hacia el núcleo).
- [ ] **Datos del evento** — nombre, fecha/hora, lugar + Maps, dress code, RSVP, regalos, fotos.

## 🟡 Ideas aprobadas en concepto (van al plan cuando se autoricen)

- [ ] **El cielo de sus invitados** — cada RSVP confirmado enciende una estrella dorada. La galaxia *es* su gente.
- [ ] **Su constelación** — las estrellas del fondo trazan sus iniciales.
- [ ] **Cápsula de voz** — audio de 20 s de los padres escondido en el planeta 1.
- [ ] **"Has viajado X millones de km"** — contador de años → kilómetros alrededor del Sol.
- [ ] **Muro de mensajes** — los invitados le dejan una frase; se puede proyectar en la fiesta.
- [ ] **Modo "sin sonido"** explícito, además del botón de mute.

## 🔵 Infra / calidad

- [ ] **Optimizar imágenes** a AVIF/WebP (hoy 398 KB y 343 KB JPEG) + `srcset` 1x/2x.
- [ ] **Pedir la imagen mobile en 1080×1920** (la actual es 768 px de ancho: se escala 1.5× en pantallas modernas).
- [ ] **Audio ambient** — pista instrumental libre (Suno / Pixabay), mono 128 kbps, 40 s con loop y fade-in.
- [ ] **`og:image` 1200×630** — es la vista previa del link en WhatsApp: la primera impresión real.
- [ ] **QR para la tarjeta física** (si hay invitación impresa).
- [ ] **Métricas** — Cloudflare Web Analytics (sin cookies): cuántos abrieron, cuántos confirmaron.
- [ ] **Dominio propio** (opcional, ~USD 12/año) — decisión del usuario.

## ⚪ Descartado por ahora (queda como registro)

- **Three.js / R3F real** — se evalúa recién si el 2.5D no alcanza en las pruebas. Agregar 3D es sumar el
  riesgo #1 de crashes en el WebView de WhatsApp.
- **Lenis (scroll con inercia)** — pelea con el pull-to-refresh del celular. Sólo se reconsidera para desktop.
- **Base de datos propia / backend Node** — el RSVP va a Apps Script + Sheet. Cero infra.
- **Tailwind** — CSS plano con variables cubre el caso y pesa 0 en runtime.
