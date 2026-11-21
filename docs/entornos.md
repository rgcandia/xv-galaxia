# Entornos — dónde corre y cómo se publica

> **Estado:** 🟢 vivo
> **Fecha:** 2026-11-21
> **Manda:** este doc para todo lo operativo (puertos, comandos, deploy).

---

## Local

| | |
|---|---|
| **Ruta** | `/home/tic/proyectos/xv-galaxia` |
| **Puerto** | **5199** (fijo, `strictPort: true`) |
| **URL** | http://localhost:5199 |
| **Node** | v22.23.1 · npm 11.18.0 |
| **Servidor** | `server-tic` — Ubuntu 24.04, usuario `tic`, **compartido con otros proyectos** |

```bash
npm install
npm run dev       # http://localhost:5199
npm run build     # tsc --noEmit && vite build  → dist/
npm run preview   # sirve dist/ en :5199
```

## Puertos del servidor (no reutilizar)

| Puerto | Quién |
|---|---|
| 3000 | portal-norbridge (prod) |
| 3100 | portal-v2 (staging) |
| 4001 | — (servicio del portal) |
| 5432 | PostgreSQL |
| 8000 | pdf-serve |
| 8080 / 8443 / 8880 | proxies del server |
| 27117 / 20241 | servicios internos |
| **5199** | **xv-galaxia ← este proyecto** |

## Aislamiento

- 🔒 **No tocar** otros directorios de `/home/tic/proyectos/`, ni sus contenedores, volúmenes o bases.
- **Sin Docker**, sin cron, sin `.env` compartidos, sin base de datos local.
- **Sin backend**: el RSVP habla con Google Apps Script (dominio `script.google.com`), no con el servidor.
- El material pesado (`material/raw/`) no se publica: lo que se sirve está en `public/media/`.

## Producción (a partir de `F5`)

| | |
|---|---|
| **Hosting** | Cloudflare Pages |
| **URL** | `https://<proyecto>.pages.dev` |
| **Build** | `npm run build` · output `dist/` |
| **Variables de entorno** | ninguna (el front es estático) |
| **Indexación** | `noindex, nofollow` (invitación privada) |
| **Costo** | $0 · ancho de banda ilimitado |

**Publicar (borrador, a confirmar en `F5`):**

```bash
npm run build
npx wrangler pages deploy dist --project-name=xv-galaxia
```

Alternativa sin CLI: conectar el repo en el panel de Cloudflare Pages (build command `npm run build`,
output `dist`).

## Checklist antes de publicar

- [ ] `npm run build` verde
- [ ] Peso dentro del presupuesto (`dist/` + assets < 3 MB; primer pintado < 250 KB)
- [ ] `og:image` 1200×630 y título correctos (probar el link en WhatsApp)
- [ ] `robots.txt` con `Disallow: /` y `<meta name="robots" content="noindex">`
- [ ] Sin datos personales en el bundle ni en la URL
- [ ] QA de §6 del [plan](plan-invitacion-xv-2026-11-21.md) pasado en dispositivos reales
- [ ] El RSVP escribe en la planilla correcta (probar con un token de prueba)

## Rollback

Cloudflare Pages guarda cada deploy: en el panel → *Deployments* → elegir el anterior → *Rollback*.
No hay base de datos que revertir; el único estado está en la planilla de Google.
