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

## Acceso al servidor (Cloudflare Tunnel)

La entrada SSH **no** es por IP ni por el puerto 22: pasa por un túnel de Cloudflare.

```bash
ssh -o ProxyCommand="cloudflared access ssh --hostname %h" tic@ssh.alejndrogcandia.online
```

Para no repetir el flag, en `~/.ssh/config` **de la máquina del usuario**:

```
Host xv
    HostName ssh.alejndrogcandia.online
    User tic
    ProxyCommand cloudflared access ssh --hostname %h
```

### Subir archivos al server

```bash
scp TU_ARCHIVO.mp4 xv:/home/tic/proyectos/xv-galaxia/material/raw/video/
```

Con progreso y reanudable (el túnel corta en subidas largas):

```bash
rsync -avh --progress -e "ssh -o ProxyCommand='cloudflared access ssh --hostname %h'" \
  TU_ARCHIVO.mp4 tic@ssh.alejndrogcandia.online:/home/tic/proyectos/xv-galaxia/material/raw/video/
```

> `cloudflared` corre en la **máquina del usuario**, no en el server.
> Un MP4 ya comprimido no gana nada con `-C`: no usar.

---

## Producción (✅ ya deployado)

**URL real:** https://xv-galaxia.alejandrogcandia.workers.dev
Deploy automático: cada `git push` a `main` reconstruye y publica (Cloudflare Workers Builds).

> 📌 **El dominio aparece en UN solo lugar del código**: el `og:image` de `index.html`.
> Si algún día se agrega dominio propio, se cambia esa línea y nada más.

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

---

## Git / GitHub

| | |
|---|---|
| **Repo** | `https://github.com/rgcandia/xv-galaxia` (creado vacío el 2026-11-21) |
| **Remote** | `origin` → `git@github.com:rgcandia/xv-galaxia.git` |
| **Rama** | `main` |

### ⚠️ La llave SSH del server NO sirve para este repo

`~/.ssh/id_ed25519` es un **deploy key de `colegionorbridge/Portal-Norbridge`**
(`ssh -T git@github.com` → *"Hi colegionorbridge/Portal-Norbridge!"*). Un deploy key sólo abre **su**
repo: al pushear acá GitHub responde *"Could not read from remote repository"*.

### La llave de este proyecto

Se generó una llave **exclusiva**, sin passphrase:

```
~/.ssh/id_ed25519_xvgalaxia       (privada, chmod 600)
~/.ssh/id_ed25519_xvgalaxia.pub   (pública)
```

**Estado: ✅ instalada y funcionando** (2026-11-21) — deploy key con write access en `rgcandia/xv-galaxia`.
El repo ya tiene `core.sshCommand` seteado, así que **`git push` funciona sin flags**:

```bash
cd /home/tic/proyectos/xv-galaxia
git push          # listo, usa la llave correcta
```

> ⚠️ El `-o IdentitiesOnly=yes` es clave: sin eso, SSH ofrece primero la llave del portal y GitHub
> responde "repository not found" (porque esa llave es de otro repo).

**Instalación (una vez, por el usuario):**
GitHub → repo `xv-galaxia` → *Settings* → *Deploy keys* → *Add deploy key* → pegar la pública →
**tildar "Allow write access"**.

**Push (sin tocar `~/.ssh/config` ni afectar otros proyectos):**

```bash
GIT_SSH_COMMAND='ssh -i ~/.ssh/id_ed25519_xvgalaxia' git push -u origin main
```

Para no repetir el flag, se puede dejar en el repo:

```bash
git config core.sshCommand 'ssh -i ~/.ssh/id_ed25519_xvgalaxia'
```

> Alternativa sin tocar SSH: Personal Access Token fine-grained (*Contents: read & write* sólo en este
> repo) y remote por HTTPS. Se descartó por default: el token queda en texto en `.git/config`.
> Ver [`decisiones.md`](decisiones.md) `D-16`.
