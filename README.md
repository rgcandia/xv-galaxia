# xv-galaxia · Invitación XV (temática espacial)

Invitación digital de 15 años, mobile-first, pensada para abrirse desde WhatsApp.
Proyecto **aislado**: carpeta, repo y puerto propios. No comparte nada con el resto de los proyectos.

- **Local:** http://localhost:5199 (`npm run dev`)
- **Stack:** Vite 8 · React 19 · TypeScript · CSS plano · Canvas 2D
- **Deploy objetivo:** Cloudflare Pages (gratis)
- **Costo:** $0

## Estado

| Fase | Estado |
|---|---|
| F0 Setup aislado + tokens | ✅ |
| F1 Portada idle (prototipo) | 🟡 en curso |
| F2 Inmersión (video + audio) | ⬜ bloqueado: falta el MP4 |
| F3 Universo (5 secciones) | ⬜ |
| F4 RSVP / DJ / regalos | ⬜ |
| F5 QA mobile + deploy | ⬜ |
| F6 Desktop 16:9 | ⬜ |

## Estructura

```
xv-galaxia/
├─ docs/
│  ├─ 01-ANALISIS-Y-PLAN.md      # análisis del material + plan completo
│  └─ fuente-drive-spec.txt      # spec original bajada del Drive
├─ material/
│  ├─ raw/img/                   # originales del Drive (9:16 y 16:9)
│  ├─ raw/video/                 # (pendiente) MP4 de inmersión
│  └─ optimized/                 # AVIF/WebP + MP4 comprimido + MP3
├─ public/media/                 # assets servidos (por ahora, JPG originales)
├─ src/
│  ├─ components/Starfield.tsx   # campo de estrellas en Canvas 2D
│  ├─ styles/global.css          # tokens de diseño (paleta de la spec)
│  ├─ styles/portada.css         # etapa 1
│  └─ App.tsx                    # máquina de estados
└─ vite.config.ts                # puerto 5199, strictPort
```

## Comandos

```bash
npm install
npm run dev      # http://localhost:5199
npm run build    # tsc --noEmit && vite build
npm run preview
```

## Pendientes bloqueantes

1. MP4 de inmersión (el del Drive no es descargable).
2. Nombre, fecha, lugar, dress code, RSVP y datos de regalos.
3. 3-4 fotos de la homenajeada.
