# Análisis del material — 2026-11-21

> **Estado:** 📷 foto (insumo de una fecha). **No se actualiza.**
> **Fecha:** 2026-11-21
> **Para qué:** es el insumo del [plan](plan-invitacion-xv-2026-11-21.md). Acá está *qué había* y *qué riesgo
> tenía*, no *qué se va a hacer*.

---

## 1. Inventario del Drive

Carpeta: `Tarjeta Invitación Digital` (pública, leída el 2026-11-21).

| Archivo | Tipo | Detalle verificado |
|---|---|---|
| `Proyecto Invitación Web 15 Años - Temática Espacial` | Google Doc | Spec de arquitectura y experiencia (~12 KB). Texto completo en [`fuente-drive-spec.txt`](fuente-drive-spec.txt). |
| `img/galaxia-desktop.jpg` | Imagen | 1344 × 768 · 398 KB · JPEG |
| `img/galaxia-mobile.jpg` | Imagen | 768 × 1344 · 343 KB · JPEG |
| `video/image_20261121_094446.mp4` | Video | **No descargable.** 404 en `drive.usercontent`, `drive.google.com/uc`, `docs.google.com/uc` y thumbnail (500). Verificado dos veces (13:14 y 13:20). |

**Diagnóstico:** el material base está bien encaminado — ya existen las dos proporciones (9:16 y 16:9),
que es exactamente lo que pide un diseño mobile-first con futuro desktop. El video parece una generación
nueva (nombre tipo *Google Flow / Kling*, fecha de hoy).

## 2. Qué dice la spec original (síntesis)

- **Temática:** "Galaxia Cósmica y Profunda", enfoque mobile-first para abrir desde WhatsApp.
- **Paleta:** `#0B132B` fondo · `#00F0FF` cian · `#E2E8F0` plata · `#FFD166` dorado · `#1C2541` nebulosa.
- **3 estados:** `idle` (portada) → `warping` (video 5.5–6 s) → `universe` (secciones).
- **5 secciones:** Bienvenida · Ubicación · RSVP · DJ · Regalos.
- **Stack propuesto:** React + Vite + Tailwind, Three.js / R3F, Framer Motion, tsParticles, Lenis,
  backend Node + Mongo/Postgres, pipeline de assets con IA (ImageFX → Kling → Suno).

## 3. Lo que la spec tiene muy bien

1. **La máquina de estados con botón "Iniciar viaje"**: es la única forma confiable de destrabar audio y
   video en móvil (política de autoplay). Está bien resuelto conceptualmente.
2. **Corte sincronizado por `timeupdate` en 5.5 s** con flash + zoom: el patrón correcto para que el video
   se disuelva en la interfaz en vez de cortar seco.
3. **Bucle de los primeros 2.5 s** para la portada en vez de un GIF: ahorra un asset y mucho peso.
4. **Botón "Saltar"**: imprescindible para quien vuelve a entrar.
5. **Paleta cerrada con hex** y jerarquía de superficies: lista para codificar.
6. **Mapeo de secciones a planetas**: le da estructura narrativa al scroll.

## 4. Huecos del material

| Falta | Impacto |
|---|---|
| Nombre de la homenajeada | Sin esto no hay portada |
| Fecha, hora, lugar, dress code | Sin esto la invitación no informa |
| **Fotos de ella** | El riesgo más grande: una galaxia genérica se siente impersonal |
| Textos (dedicatoria, frase, canción) | La tarjeta no tiene voz |
| Video 16:9 para desktop | Sólo hay un archivo vertical |
| Lista de invitados / pases | Sin esto no hay RSVP con pases |
| `og:image` 1200×630 | La vista previa de WhatsApp es la primera impresión real |
| Audio ambient | La Etapa 2 queda muda sin él |

## 5. Riesgos detectados en la spec (y cómo se mitigaron en el plan)

| # | Riesgo | Por qué | Mitigación adoptada |
|---|---|---|---|
| R1 | Three.js + 5 planetas 3D + partículas + video + Lenis juntos | El contexto WebGL del WebView de WhatsApp se pierde en gama media: es la causa #1 de "se puso negro" | Canvas fijo + planetas 2.5D + HTML normal (`D-04`) |
| R2 | Lenis (scroll con inercia) | Pelea con el pull-to-refresh y el scroll del WebView | Scroll nativo (`D-05`) |
| R3 | Video no descargable | Sin MP4 no hay Etapa 2 | Fallback CSS 1.2 s + bloqueante anotado |
| R4 | Peso sin presupuesto | Invitado en la calle con datos móviles: si tarda >5 s, cierra | Presupuesto numérico en el plan §3 |
| R5 | Autoplay bloqueado en ahorro de batería (iOS) | Ni con gesto funciona a veces | Fallback completo + audio independiente |
| R6 | `?familia=Perez&pases=4` en la URL | Falsificable y filtra apellidos en la vista previa | Token opaco (`D-07`) |
| R7 | Música con copyright | Un link público con tema famoso se silencia o se bloquea | Pista instrumental libre |
| R8 | Imagen mobile de 768 px | Se escala 1.5× en pantallas modernas | Pedir 1080×1920; si no, aceptar (una nebulosa perdona) |
| R9 | Impersonal | El riesgo no es técnico, es emocional | Los extras de `F3-b` (constelación, cielo de invitados, cápsula de voz) |

## 6. Presupuesto de peso medido al 2026-11-21

| Recurso | Medido | Límite |
|---|---|---|
| JS+CSS del prototipo (gzip) | **71 KB** | < 120 KB ✅ |
| Imagen mobile | 343 KB JPEG | < 180 KB ❌ |
| Imagen desktop | 398 KB JPEG | < 180 KB ❌ |
| Video | — (no disponible) | < 2 MB ⛔ |
| Audio | — (no existe) | < 600 KB ⛔ |
