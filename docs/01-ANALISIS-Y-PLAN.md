# Análisis del material + plan de proyecto

> **Proyecto:** invitación digital de 15 años — temática *Galaxia Cósmica y Profunda*
> **Objetivo:** mobile-first (se abre desde WhatsApp), espectacular, costo $0
> **Fecha de este análisis:** 2026-11-21

---

## 1. Inventario de lo que hay (Drive)

| Archivo | Tipo | Detalle verificado |
|---|---|---|
| `Proyecto Invitación Web 15 Años - Temática Espacial` | Google Doc | Spec de arquitectura y experiencia (~12 KB de texto). Es un documento de especificación, no un diseño. |
| `img/galaxia-desktop.jpg` | Imagen | 1344 × 768 px · 398 KB · JPEG. Fondo 16:9. |
| `img/galaxia-mobile.jpg` | Imagen | 768 × 1344 px · 343 KB · JPEG. Fondo 9:16. |
| `video/image_20261121_094446.mp4` | Video | **No se pudo descargar**: el archivo devuelve 404 en todos los endpoints de descarga (probablemente tiene la descarga deshabilitada o permisos distintos a la carpeta). Es el único bloqueante real. |

**Calidad del material:** bueno. Ya hay dos versiones de la imagen base (9:16 y 16:9), que es exactamente lo correcto para mobile-first. El video parece una generación nueva hecha hoy (nombre tipo *Google Flow / Kling*).

**Lo que falta en el material:**
- Nombre de la homenajeada, fecha, hora, lugar, dress code, alias/CBU.
- **Fotos de ella** — solo hay galaxia. Sin 3-4 fotos suyas la tarjeta se siente genérica.
- Textos: dedicatoria de los padres, frase o canción que la represente.
- Video 16:9 (para desktop) — solo se ve un archivo vertical.
- Lista de invitados / pases.

---

## 2. Análisis de la spec que escribiste

### Lo que está muy bien
1. **Máquina de estados de 3 etapas** (idle → warping → universe). Es la decisión más importante y está bien tomada: el botón "Iniciar viaje" existe justamente para *desbloquear audio y video* con un gesto del usuario, que es la única forma de que iOS y Android lo permitan.
2. **Corte sincronizado por `timeupdate` en 5.5 s** con flash + zoom: es el patrón correcto para que el video "se disuelva" en la interfaz en vez de cortar seco.
3. **Botón "Saltar"**: imprescindible. Los invitados recurrentes no van a ver el video 5 veces.
4. **Bucle de los primeros 2.5 s para la portada idle** en lugar de un GIF: correcto, ahorra un asset y peso.
5. **Paleta definida con hex** y jerarquía de superficies (fondo / nebulosa / acentos): lista para codificar.
6. **5 secciones mapeadas a "planetas"**: bien, le da estructura narrativa al scroll.

### Huecos y riesgos (mi lectura crítica)

| # | Riesgo | Por qué importa | Mitigación que propongo |
|---|---|---|---|
| R1 | **Three.js + 5 planetas 3D + partículas + video + Lenis** | En el navegador interno de WhatsApp (WebView) el contexto WebGL es inestable y se pierde al hacer scroll en gama media. Es la causa #1 de "se me trabó / se puso negro". | Un solo `<canvas>` fijo de fondo, con planetas **2.5D** (sprites/esferas con shader simple, `dpr` limitado a 1.5) y el contenido en HTML normal. Nada de scroll hijack. |
| R2 | **Lenis (scroll con inercia)** | Pelea con el pull-to-refresh y con el scroll anidado del WebView. | Scroll nativo. Si más adelante queremos inercia, solo en desktop (≥900 px). |
| R3 | **El video no es descargable** | Sin el MP4 no hay Etapa 2. | Necesito que lo hagas público o lo copies a `material/raw/video/`. Mientras tanto la Etapa 2 funciona con una transición CSS (zoom + flash) de 1.2 s — indistinguible al ojo. |
| R4 | **Peso total** | Un invitado abriendo desde datos móviles en la calle. Si tarda >5 s, cierra. | Presupuesto: primer pintado **< 250 KB**; experiencia completa **< 3 MB**; video **< 2 MB**; audio **< 600 KB**. |
| R5 | **Autoplay bloqueado en modo ahorro de batería (iOS)** | Ni con gesto funciona a veces. | Todo el viaje tiene un *fallback*: si `video.play()` rechaza la promesa → transición CSS + audio igual arranca (el audio sí es confiable). |
| R6 | **RSVP con datos personales** | El formulario va a circular por WhatsApp; la URL puede terminar reenviada. | URL con **token opaco** (`?i=7f3a9c`) mapeado en una planilla, nunca `?familia=Perez&pases=4`. `noindex` en la página. Rate-limit + honeypot. |
| R7 | **Música con copyright** | Un link público con un tema famoso puede ser silenciado o bloqueado por el navegador/algoritmo. | Pista instrumental generada (Suno) o de Pixabay, licencia libre. |
| R8 | **Imagen mobile de 768 px de ancho** | En un teléfono de 1170 px físicos se escala 1.5× → un poco blanda. | Pedir una versión 1080 × 1920 (o 1440 × 2560). Si no, igual funciona: una nebulosa perdona la falta de nitidez. |
| R9 | **La invitación no la "toca" a ella** | El riesgo más grande no es técnico: es emocional. Una galaxia genérica la puede sentir impersonal. | Ver §5 "cápsula de recuerdos": fotos, su constelación, la voz de ustedes, el cielo de invitados. |

---

## 3. Arquitectura recomendada (aislada de todo lo demás)

### Aislamiento — cómo garantizo que no toca nada
- Carpeta propia: `/home/tic/proyectos/xv-galaxia` (repo git propio, sin submódulos ni monorepo).
- **Puerto propio: 5199** (verifiqué los ocupados: 3000, 3100, 4001, 5432, 8000, 8080, 8443, 8880, 27117, 20241 — ninguno choca).
- Sin `.env` compartidos, sin Docker, sin base de datos propia, sin tocar `portal-norbridge`, `bot-*` ni sus APIs.
- El RSVP escribe en una **planilla nueva** de tu Drive vía Apps Script: es un endpoint independiente, no consume ni modifica nada existente.

### Stack
| Capa | Elección | Motivo |
|---|---|---|
| Build | **Vite 8 + React 19 + TypeScript** | Igual que `sorteo-norbridge` y `revista-digital`: consistencia, y ya sabés cómo se comporta. |
| Estilos | **CSS plano + variables** | El efecto vive en detalles (blur, glows, gradientes); CSS a mano da control total y 0 peso de runtime. Tailwind queda opcional. |
| Animación UI | **Framer Motion** | Ya lo tenés instalado en sorteo; ideal para las transiciones de estado. |
| Campo de estrellas | **Canvas 2D propio** (~80 líneas, ya escrito) | 0 dependencias, ~0.2 ms/frame. |
| Planetas | **R3F + drei solo en la etapa "universe", lazy** | Si el device no da (WebGL ausente), se degrada a esferas CSS. |
| Confetti / festejo | `canvas-confetti` | 2 KB, ya en tu stack. |
| Backend RSVP | **Google Apps Script → Google Sheet** | $0, 0 infra, 0 deploy, sin exponer nada tuyo. |
| Hosting | **Cloudflare Pages** | Gratis, ancho de banda ilimitado, CDN, HTTPS, dominio `*.pages.dev`. Alternativa: Netlify/Vercel. |
| Métricas (opcional) | Cloudflare Web Analytics | Gratis, sin cookies, te dice cuántos abrieron. |

**Costo total: $0.** Único gasto opcional: dominio propio (~USD 10-12/año) si querés algo tipo `los15desofia.com`.

### Presupuesto de performance (lo que voy a medir)
```
HTML+CSS+JS (gzip) ............ < 120 KB   (hoy: 71 KB)
Imagen portada AVIF/WebP ...... < 180 KB   (hoy: 398 KB JPEG → a optimizar)
Video inmersión ............... < 2.0 MB   (720×1280, H.264, CRF 28, sin audio)
Audio ambient ................. < 600 KB   (mono 128 kbps, 40 s, loop con crossfade)
--------------------------------------------------
Primer pintado ................ < 250 KB
Experiencia completa .......... < 3.0 MB
LCP en 4G ..................... < 2.5 s
```

---

## 4. Flujo de la experiencia (ajustado)

```
┌─────────────┐   tap "Iniciar viaje"   ┌──────────────┐   5.5 s / "Saltar"   ┌──────────────┐
│   PORTADA   │ ──────────────────────> │  INMERSIÓN   │ ───────────────────> │   UNIVERSO   │
│   (idle)    │   audio fade-in 1.2 s   │  (warping)   │   flash + zoom-out   │  (secciones) │
└─────────────┘   video desde 0        └──────────────┘                      └──────────────┘
   imagen 9:16       video 9:16            5.5 s                    scroll nativo
   + estrellas       + pista ambient
   + "Mis 15"        + botón saltar
```

**Etapa 3 — secciones (una por "planeta")**

| Planeta | Sección | Contenido |
|---|---|---|
| 1 | **Núcleo** | Bienvenida + fecha + contador en vivo + dress code |
| 2 | **Órbita** | Lugar, horarios (recepción / ceremonia / fiesta) + botón Google Maps |
| 3 | **Señal** (RSVP) | Confirmación con pases precargados por token, menú especial, mensaje |
| 4 | **Frecuencia** (DJ) | Sugerencia de canciones + ver la lista en vivo |
| 5 | **Nebulosa** (regalos) | Alias/CBU con copiar-al-portapapeles + buzón físico |

**Extras que la hacen "de ella"** (baratos de hacer, altísimo impacto):
- **Su constelación**: las estrellas del fondo trazan las iniciales de su nombre.
- **El cielo de sus invitados**: cada RSVP confirmado enciende una estrella nueva. Al final, la galaxia *es* su gente. (Técnicamente: el fetch de la planilla devuelve N y se dibujan N estrellas doradas.)
- **Cápsula de voz**: un audio de 20 s de ustedes escondido en el planeta 1.
- **"Has viajado X millones de km alrededor del Sol"**: contador de años → kilómetros. Detalle nerd que le va a encantar.
- **Muro de mensajes**: los invitados le dejan una frase; se puede mostrar en la fiesta en una pantalla.

---

## 5. Plan por fases

> Asumo evento el **15 de diciembre** (a confirmar). Hoy faltan ~24 días: entra con margen.

| Fase | Qué se hace | Entregable | Días |
|---|---|---|---|
| **F0** | Setup aislado, tokens de diseño, optimización de assets (AVIF/WebP, video, audio) | repo + `localhost:5199` funcionando | 1-2 |
| **F1** | Portada idle: imagen, respiración cósmica, estrellas, tipografía, CTA | pantalla 1 en celular real | 1 |
| **F2** | Inmersión: video + audio + flash + saltar + fallbacks | el "wow" de los primeros 7 s | 2 |
| **F3** | Universo: 5 secciones, fondo estelar persistente, navegación flotante | recorrido completo scrolleable | 3-4 |
| **F4** | RSVP + DJ + regalos + planilla + panel de control para ustedes | confirmaciones reales llegando | 2 |
| **F5** | QA en dispositivos reales (WhatsApp iOS/Android, 4G, ahorro de batería) + deploy | link público listo para enviar | 2 |
| **F6** | Versión desktop 16:9, composición horizontal, detalles | misma URL, se ve distinto en PC | 2 |
| **F7** | Congelar 5 días antes: textos finales, QR para la tarjeta física, og:image para WhatsApp | envío | 1 |

**Hito crítico:** el `og:image` (la vista previa del link en WhatsApp) se define en F1 y se prueba mandándose el link entre ustedes. Es la primera impresión real.

---

## 6. Datos que necesito para arrancar en serio

1. **Nombre completo** de ella (y cómo le dicen).
2. **Fecha y hora** exactas (¿15 de diciembre? ¿ceremonia y fiesta por separado?).
3. **Lugar** + link de Google Maps + **dress code**.
4. **RSVP:** ¿querés confirmación? ¿pases por familia? ¿menú especial?
5. **Mesa de regalos:** ¿alias/CBU, buzón físico, o "no es necesario"?
6. **El video:** ¿lo podés hacer público / copiarlo a `material/raw/video/`?
7. **3-4 fotos de ella** (y una frase o canción que la identifique).

---

## 7. Decisiones que ya tomé (cambiables, decime si no te cierran)

- Nombre de carpeta: `xv-galaxia` (renombrar es trivial).
- Puerto local: **5199**.
- Sin Tailwind: CSS plano con variables.
- Sin 3D real en la v1: planetas 2.5D + canvas 2D. Three.js queda como mejora opcional si en las pruebas vuela.
- RSVP en Google Sheet, no en base de datos propia.
- Despliegue en Cloudflare Pages.
