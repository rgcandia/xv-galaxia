# Plan — Invitación XV, temática espacial

> **Estado:** 📋 plan aprobado en concepto (la recomendación técnica fue aceptada el 2026-11-21).
> Cada fase se ejecuta **solo con OK explícito** del usuario (ver [`AGENTS.md`](../AGENTS.md)).
> **Fecha:** 2026-11-21 (creación)
> **Manda:** este plan. Si algo lo contradice, mandan [`decisiones.md`](decisiones.md).
> **Insumo:** [`analisis-material-2026-11-21.md`](analisis-material-2026-11-21.md) · [`fuente-drive-spec.txt`](fuente-drive-spec.txt)

---

## 1. Qué es

Una **invitación digital de 15 años** que se abre desde WhatsApp en un celular y se siente como entrar a
una galaxia. Tres etapas: portada → viaje de inmersión → universo con las secciones del evento.

- **Mobile-first**, y después versión desktop (misma URL, otra composición).
- **Costo $0.** Sin backend propio, sin base de datos, sin servidor nuevo.
- **Proyecto aislado**: carpeta y puerto propios, no comparte nada con el resto de las apps del servidor.

**Éxito =** el invitado abre el link, dice *"wow"*, entiende fecha y lugar sin scrollear de más, y
confirma en menos de 40 segundos.

---

## 2. Flujo de la experiencia (3 etapas)

```
┌─────────────┐  tap "Iniciar viaje"  ┌──────────────┐  5.5 s / "Saltar"  ┌──────────────┐
│   PORTADA   │ ────────────────────> │  INMERSIÓN   │ ──────────────────> │   UNIVERSO   │
│   (idle)    │  audio fade-in 1.2 s  │  (warping)   │  flash + zoom-out   │  secciones   │
└─────────────┘  video desde 0        └──────────────┘                     └──────────────┘
```

| Etapa | Qué se ve | Qué resuelve técnicamente |
|---|---|---|
| **1 · Portada** | Imagen 9:16 de galaxia con "respiración cósmica", estrellas en movimiento, "Mis 15" + nombre, CTA | El tap es lo que **desbloquea audio y video** en iOS/Android. Nada de autoplay con sonido. |
| **2 · Inmersión** | Video de zoom hacia el núcleo, audio ambient entrando de a poco, botón "Saltar" | Corte por `timeupdate` en 5.5 s → flash + zoom → el video se disuelve en la UI, sin corte seco. |
| **3 · Universo** | Fondo estelar fijo + secciones que scrollean, navegación flotante abajo | Scroll **nativo**. Las estrellas reaccionan al scroll, pero el scroll no se secuestra. |

### Etapa 3 — las 5 secciones ("planetas")

| # | Planeta | Contenido |
|---|---|---|
| 1 | **Núcleo** | Bienvenida, fecha, contador en vivo, dress code |
| 2 | **Órbita** | Lugar, horarios (recepción / ceremonia / fiesta), botón a Google Maps |
| 3 | **Señal** | RSVP: nombre, pases precargados por token, menú especial, mensaje |
| 4 | **Frecuencia** | Sugerencia de canciones para el DJ + ver la lista |
| 5 | **Nebulosa** | Regalos: alias/CBU con copiar-al-portapapeles + buzón físico |

### Extras que la hacen *de ella* (aprobados en concepto, se ejecutan en `F3-b`)

- **El cielo de sus invitados**: cada RSVP confirmado enciende una estrella dorada.
- **Su constelación**: las estrellas trazan sus iniciales.
- **Cápsula de voz**: 20 s de audio de los padres en el planeta 1.
- **"Has viajado X millones de km alrededor del Sol"**: años → kilómetros.
- **Muro de mensajes**: frases de los invitados, proyectables en la fiesta.

---

## 3. Presupuesto de peso y performance

> Es un contrato, no un deseo. Si una fase lo rompe, se recorta esa fase — no el presupuesto.

| Recurso | Límite | Hoy |
|---|---|---|
| HTML + CSS + JS (gzip) | **< 120 KB** | 71 KB ✅ |
| Imagen de portada (AVIF/WebP) | **< 180 KB** | 398 KB ❌ (a optimizar en F1) |
| Video de inmersión | **< 2.0 MB** | ❌ no disponible |
| Audio ambient | **< 600 KB** | ❌ no existe |
| **Primer pintado** | **< 250 KB** | — |
| **Experiencia completa** | **< 3.0 MB** | — |
| **LCP en 4G** | **< 2.5 s** | — |

Regla práctica: **el video se descarga recién después del tap**, nunca antes. La portada se pinta con la
imagen y el canvas; el resto llega en segundo plano.

---

## 4. Decisiones técnicas que aplican la recomendación

Detalle y motivos en [`decisiones.md`](decisiones.md). Resumen:

| Tema | Decisión |
|---|---|
| Stack | **Vite 8 + React 19 + TypeScript**, igual que `sorteo-norbridge` y `revista-digital` |
| Estilos | **CSS plano + variables** (sin Tailwind) |
| Estrellas | **Canvas 2D propio** (~80 líneas, 0 dependencias) |
| Planetas | **2.5D** (sprites/esferas). **Three.js no entra en la v1** |
| Scroll | **Nativo**. Sin Lenis. Sin scroll hijack |
| Animación UI | Framer Motion |
| RSVP | **Google Apps Script → Google Sheet** (sin backend propio) |
| Pases | **Token opaco** en la URL (`?i=7f3a9c`), nunca `?familia=Perez&pases=4` |
| Deploy | **Cloudflare Pages** (`*.pages.dev`), `noindex` |
| Puerto local | **5199** |
| Fallback de video | Si `play()` falla → transición CSS de 1.2 s (zoom + flash). Nunca pantalla negra |

---

## 5. Fases

> Cada fase: **qué entra**, **qué NO entra** y **«terminado cuando»**. Un commit por fase (o por sub-fase).
> Estados: ✅ hecho · 🟡 en curso · ⬜ pendiente · ⛔ bloqueado

### `F0` · Setup aislado ✅
- **Entra:** carpeta, git, Vite + React + TS, tokens de diseño (paleta de la spec), puerto 5199, docs.
- **No entra:** ninguna pantalla.
- **Terminado cuando:** `npm run dev` levanta en :5199 sin chocar con otros puertos y `npm run build` pasa. ✅

### `F1` · Portada (Etapa 1)
- **Entra:** imagen 9:16 + `srcset`/AVIF, respiración cósmica, campo de estrellas, "Mis 15" + nombre,
  CTA "Iniciar viaje", `prefers-reduced-motion`, `og:image` 1200×630, favicon.
- **No entra:** video, audio, secciones.
- **Terminado cuando:** se ve bien en iPhone SE, iPhone 14 y Android gama media; LCP < 2.5 s en 4G simulado;
  la vista previa del link en WhatsApp muestra la imagen y el título correctos.
- 🟡 **Prototipo hecho y congelado** (falta nombre/fecha reales y optimización de imagen).

### `F2` · Inmersión (Etapa 2) ⛔
- **Entra:** video 720×1280 H.264 < 2 MB, `poster`, corte en 5.5 s, flash + zoom, botón "Saltar" (que
  recuerda la elección en `localStorage`), audio ambient con fade-in, botón de mute persistente,
  **fallback completo** si el video no puede reproducirse.
- **No entra:** secciones del universo.
- **Terminado cuando:** en un celular real, desde WhatsApp, el viaje entra y sale sin corte visible; con el
  video bloqueado (ahorro de batería) la experiencia sigue siendo buena; con `prefers-reduced-motion` no
  hay zoom ni flash.
- ⛔ **Bloqueado:** falta el MP4.

### `F3` · Universo (Etapa 3)
- **Entra:** fondo estelar persistente, las 5 secciones, navegación flotante inferior, contador en vivo,
  Google Maps, copiar al portapapeles.
- **No entra:** RSVP funcional, DJ, extras.
- **Terminado cuando:** se recorre de punta a punta a 60 fps en gama media; ninguna sección queda cortada
  por la barra de Safari; navegación accesible con teclado.

### `F3-b` · Los extras que la hacen *de ella*
- **Entra:** cielo de invitados, constelación con sus iniciales, cápsula de voz, contador de km, muro de mensajes.
- **Terminado cuando:** cada extra se puede apagar desde un solo archivo de configuración (`evento.ts`).

### `F4` · RSVP + DJ + regalos
- **Entra:** Apps Script (`doPost`), planilla, tokens por invitado, formulario con pases precargados, menú
  especial, sugerencias de canciones con dedupe, copiar alias/CBU, honeypot + rate-limit, panel mínimo para
  que ustedes vean las confirmaciones.
- **No entra:** mails automáticos, recordatorios, integración con WhatsApp Business.
- **Terminado cuando:** una confirmación real llega a la planilla y se ve en el panel; un token inválido no
  rompe nada; el formulario se puede enviar dos veces sin duplicar; probado en WhatsApp iOS y Android.

### `F5` · QA + deploy
- **Entra:** matriz de pruebas en dispositivos reales, deploy en Cloudflare Pages, métricas, link corto.
- **Terminado cuando:** pasa el checklist de §6 y el link se manda entre ustedes sin vergüenza.

### `F6` · Desktop 16:9
- **Entra:** composición horizontal (dos columnas), imagen 16:9, video 16:9 si existe, hover states.
- **Terminado cuando:** en 1440×900 y en 1920×1080 se ve intencional, no "estirado".

### `F7` · Cierre
- **Entra:** textos finales, QR para la tarjeta física, congelar cambios 5 días antes.
- **Terminado cuando:** el link está enviado y no se toca más.

---

## 6. Checklist de QA (F5)

**Dispositivos / navegadores**
- [ ] iPhone SE (pantalla chica) — Safari
- [ ] iPhone 13/14 — Safari
- [ ] Android gama media (Moto G / similar) — Chrome
- [ ] **WhatsApp in-app** en iOS y en Android (el caso real)
- [ ] Instagram in-app (por si lo mandan por ahí)
- [ ] Desktop 1440×900 y 1920×1080

**Condiciones**
- [ ] 4G con throttling (DevTools) y 3G lento
- [ ] Modo ahorro de batería en iOS (bloquea autoplay)
- [ ] `prefers-reduced-motion: reduce`
- [ ] Rotar el teléfono a horizontal
- [ ] Volver a entrar (segunda visita: el "Saltar" ya está recordado)

**Contenido**
- [ ] Fecha, hora, lugar y dress code correctos (¡y en zona horaria de Argentina!)
- [ ] Link de Maps abre la app en iOS y Android
- [ ] Copiar alias/CBU funciona en iOS (necesita `navigator.clipboard` o fallback `execCommand`)
- [ ] Vista previa del link en WhatsApp: imagen + título + descripción
- [ ] Nada de datos personales en la URL

---

## 7. Riesgos y su mitigación

| Riesgo | Mitigación (ya en el plan) |
|---|---|
| WebGL inestable en el WebView de WhatsApp | Nada de Three.js en v1; 2.5D + Canvas 2D |
| Autoplay bloqueado (ahorro de batería) | Fallback CSS; el audio arranca igual |
| El invitado cierra antes de ver nada | Portada con todo lo esencial: fecha visible en < 2 s |
| Peso excesivo en datos móviles | Presupuesto de §3 + video post-tap |
| URL reenviada con datos | Token opaco + `noindex` |
| Música con copyright bloqueada | Pista instrumental libre (Suno / Pixabay) |
| Que se sienta impersonal | Fotos + constelación + cápsula de voz + cielo de invitados |
| Fecha encima (últimas 2 semanas) | `F7` congela 5 días antes; lo cosmético se recorta, lo informativo no |

---

## 8. Cronograma propuesto (evento el **2 de febrero**, 2027)

> Hoy faltan **73 días**, pero **diciembre y enero son feriados**: la gente desaparece y cualquier
> bloqueo (un video que no llega, una respuesta que tarda) cuesta una semana, no un día.
> **Por eso el objetivo real es terminar `F5` antes del 20/12** y dejar enero sólo para retoques.

| Semana | Fases | Hito |
|---|---|---|
| 21–27/11 | `F1` portada final (Tiana + 2 de febrero) + optimización de assets | La portada se manda por WhatsApp y se ve bien |
| 28/11–05/12 | `F2` inmersión (necesita el video) | El "wow" de los primeros 7 segundos |
| 06–13/12 | `F3` universo (dos tramos: secciones 1-3 y 4-5) + `F3-b` extras | Recorrido completo |
| 14–19/12 | `F4` RSVP / DJ / regalos + `F5` QA | **Link público antes del 20/12** |
| 20/12–10/1 | 🎄 pausa — sólo correcciones urgentes | — |
| 11–20/1 | `F6` desktop 16:9 + retoques | Se ve intencional en PC |
| 21–28/1 | `F7` textos finales, QR, congelar | Congelado |
| 29/1–1/2 | — | Envío |

> ⚠️ La fecha es **provisional** (el usuario avisó que puede cambiar). Si se mueve, se reescala el
> cronograma: las fases no cambian, los días sí. Lo único crítico es que `F1` y `F2` no dependan de la
> fecha — y no dependen.

> 📅 **Ojo con el día de la semana:** el 2 de febrero de 2027 cae **martes**. Si la fiesta es un sábado,
> probablemente sea el **30 de enero** o el **6 de febrero**. Confirmar antes de escribir los textos.

---

## 9. Qué necesito para arrancar `F1-b`

Ya hay (provisional, ver [`datos-evento.md`](datos-evento.md)):
**Tiana Anahí González Candia** · **2 de febrero** · **alias para regalos**.

Falta:

1. **Cómo le dicen** (el nombre corto que va grande en la portada).
2. **Hora** de la fiesta (y si hay ceremonia aparte).
3. **Lugar real** + link de Maps.
4. **Dress code** (recomendación en `datos-evento.md`).
5. **El alias/CBU + titular**.
6. **3-4 fotos** de ella.
7. **El video** (o el OK para regenerarlo).

Con 1, 2 y 3, `F1-b` cierra en un tramo. Lo demás puede entrar después sin rehacer nada.
