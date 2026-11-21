# xv-galaxia · Invitación XV (temática espacial)

Invitación digital de 15 años, mobile-first, pensada para abrirse desde WhatsApp.
Proyecto **aislado**: carpeta, repo y puerto propios. No comparte nada con el resto de los proyectos.

- **Local:** http://localhost:5199 (`npm run dev`)
- **Stack:** Vite 8 · React 19 · TypeScript · CSS plano · Canvas 2D
- **Deploy objetivo:** Cloudflare Pages · **Costo:** $0

---

## Por dónde empezar

| Si querés… | Leé |
|---|---|
| saber **dónde estamos** | [`AHORA.md`](AHORA.md) |
| saber **cómo se trabaja acá** (humanos e IA) | [`AGENTS.md`](AGENTS.md) |
| ver **el plan** (fases `F0…F7`) | [`docs/plan-invitacion-xv-2026-11-21.md`](docs/plan-invitacion-xv-2026-11-21.md) |
| ver **de dónde salió** (material del Drive, riesgos) | [`docs/analisis-material-2026-11-21.md`](docs/analisis-material-2026-11-21.md) |
| ver **qué se decidió y por qué** | [`docs/decisiones.md`](docs/decisiones.md) |
| ver **qué pasó** | [`docs/bitacora.md`](docs/bitacora.md) |
| ver **qué falta** | [`TASK.md`](TASK.md) |
| la **puerta de entrada a la doc** | [`docs/README.md`](docs/README.md) |

## Estado

`F0` (setup aislado) ✅ · prototipo de `F1` (portada) 🟡 **congelado** · `F2` ⛔ (falta el video).
El resto del plan está escrito y esperando autorización. **No se escribe código sin OK.**

## Estructura

```
xv-galaxia/
├─ AGENTS.md            # archivo principal que lee la IA
├─ AHORA.md             # estado (2 líneas)
├─ TASK.md              # backlog e ideas
├─ docs/
│  ├─ README.md                                  # puerta de entrada
│  ├─ plan-invitacion-xv-2026-11-21.md           # el plan que manda
│  ├─ analisis-material-2026-11-21.md            # insumo (foto)
│  ├─ decisiones.md                              # ADR D-01…D-14
│  ├─ bitacora.md                                # el diario
│  ├─ entornos.md                                # puerto, comandos, deploy
│  └─ fuente-drive-spec.txt                      # spec original del Drive
├─ material/
│  ├─ raw/img/          # originales del Drive (9:16 y 16:9)
│  ├─ raw/video/        # (vacío) MP4 de inmersión — bloqueante
│  └─ optimized/        # (vacío) AVIF/WebP + MP4 comprimido + MP3
├─ public/media/        # assets servidos (por ahora, JPG originales)
├─ src/
│  ├─ components/Starfield.tsx    # estrellas en Canvas 2D
│  ├─ styles/global.css           # tokens (paleta de la spec)
│  ├─ styles/portada.css          # etapa 1
│  └─ App.tsx                     # máquina de estados
└─ vite.config.ts                 # puerto 5199, strictPort
```

## Comandos

```bash
npm install
npm run dev      # http://localhost:5199
npm run build    # tsc --noEmit && vite build
npm run preview
```

## Bloqueantes

1. **El MP4 de inmersión no se puede descargar** (404 en el Drive).
2. **Faltan los datos del evento**: nombre, fecha, lugar, dress code, RSVP, regalos y fotos de ella.
