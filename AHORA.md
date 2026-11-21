# AHORA — dónde estamos (2026-11-21)

> **Primer archivo, siempre.** Si sos una IA: leé esto y [`AGENTS.md`](AGENTS.md), y **no explores el repo**.
> Se actualiza **al abrir y al cerrar cada tramo** (2 líneas). Esto no es la bitácora.

| | |
|---|---|
| **Rama** | `main` (único). Repo **local**, sin remote todavía. |
| **Fase abierta** | **Ninguna.** `F0` (setup aislado) y un **prototipo de `F1`** (portada) están hechos y **congelados**: el usuario pidió *"dejalo hasta acá, primero el plan"*. **No escribir código hasta autorización.** |
| **Plan que manda** | [`docs/plan-invitacion-xv-2026-11-21.md`](docs/plan-invitacion-xv-2026-11-21.md) |
| **Estado del plan** | `📋 aprobado en concepto` — la recomendación técnica fue aceptada (*"me gustó mucho"*). Falta el OK fase por fase. |
| **Próximo tramo propuesto** | **`F1-b` — Portada final**: aplicar nombre y fecha reales, tipografía definitiva, `og:image` de WhatsApp. Requiere los datos de §Datos faltantes. |
| **Bloqueante #1** | 🔴 **El video de inmersión no está**: el MP4 del Drive devuelve 404 en todos los endpoints de descarga (verificado 2026-11-21 13:14 y 13:20). Sin él, `F2` no arranca. Mientras tanto hay fallback CSS. |
| **Bloqueante #2** | 🔴 **Datos del evento**: nombre de la homenajeada, fecha y hora, lugar + Maps, dress code, RSVP, regalos, y 3-4 fotos de ella. |
| **Costo** | $0 (Cloudflare Pages + Apps Script + Sheet). Opcional: dominio propio ~USD 12/año. |

## Datos faltantes (para arrancar `F1-b`)

1. Nombre completo de ella y cómo le dicen.
2. Fecha y hora exactas (¿15 de diciembre? ¿ceremonia y fiesta separadas?).
3. Lugar + link de Google Maps + dress code.
4. RSVP: ¿confirmación? ¿pases por familia? ¿menú especial?
5. Regalos: ¿alias/CBU, buzón físico, o "no es necesario"?
6. 3-4 fotos de ella + una frase o canción que la identifique.

## Lo que ya existe en el repo

- `src/` — prototipo de portada (Etapa 1): imagen 9:16, respiración cósmica, campo de estrellas en
  Canvas 2D, CTA "Iniciar viaje". **Funciona** (`npm run dev` → :5199; build 71 KB gzip).
- `material/raw/img/` — las dos imágenes del Drive (mobile 768×1344 y desktop 1344×768).
- `public/media/` — esas mismas imágenes servidas tal cual (sin optimizar todavía).
- `docs/` — análisis, plan, decisiones, bitácora, entornos.

## Las 3 guardas que no se negocian

1. **Un tramo = un commit.** Si el anterior está rojo, no se arranca el siguiente.
2. **Si el tramo no entra en ~6 archivos / ~300 líneas, se corta ANTES** de empezar.
3. **Ningún tramo de código arranca sin OK del usuario** — este proyecto se maneja plan-primero.
