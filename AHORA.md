# AHORA — dónde estamos (2026-11-21)

> **Primer archivo, siempre.** Si sos una IA: leé esto y [`AGENTS.md`](AGENTS.md), y **no explores el repo**.
> Se actualiza **al abrir y al cerrar cada tramo** (2 líneas). Esto no es la bitácora.

| | |
|---|---|
| **Rama** | `main` (única). Remote: **`git@github.com:rgcandia/xv-galaxia.git`** — ⚠️ **sin credencial todavía** (ver §GitHub). |
| **Fase abierta** | **`F3` — Universo** (las 5 secciones + navegación). `F0`, `F1` y `F2` **cerradas**. |
| **Plan que manda** | [`docs/plan-invitacion-xv-2026-11-21.md`](docs/plan-invitacion-xv-2026-11-21.md) |
| **Datos del evento** | [`docs/datos-evento.md`](docs/datos-evento.md) — **provisionales** (nombre y fecha pueden cambiar) |
| **Próximo tramo propuesto** | **`F3-a` — Universo, tramo 1**: secciones Núcleo (fecha/lugar) y Órbita (historia), con la navegación flotante. Sin RSVP ni regalos. |
| **Bloqueante #1** | 🔴 **Video de inmersión**: el MP4 del Drive devuelve 404 incluso en `/view` (el archivo no está compartido; las imágenes de la misma carpeta sí bajan). Verificado 6 endpoints. |
| **Bloqueante #2** | 🔴 **Credenciales de GitHub**: la llave SSH del server es un *deploy key* de `colegionorbridge/Portal-Norbridge`, **no puede pushear a `rgcandia`**. |
| **Costo** | $0 (Cloudflare Pages + Apps Script + Sheet). Opcional: dominio propio ~USD 12/año. |

## Datos que faltan (para cerrar los textos)

1. Cómo le dicen a **Tiana** (el nombre corto que va en la portada).
2. **Hora** de la fiesta y si hay ceremonia aparte.
3. **Lugar real** + link de Google Maps.
4. **Dress code** (recomendación en [`datos-evento.md`](docs/datos-evento.md)).
5. **Alias/CBU + titular** para los regalos.
6. **3-4 fotos** de ella + una frase o canción.
7. RSVP: ¿pases por familia? ¿menú especial?

## GitHub — falta la credencial

- Repo creado y **vacío**: `https://github.com/rgcandia/xv-galaxia.git` (verificado: `ls-remote` no devuelve refs).
- La llave `~/.ssh/id_ed25519` del server autentica como **`colegionorbridge/Portal-Norbridge`** (deploy key
  de otro repo). **No sirve** para `rgcandia`.
- Dos caminos (elegir uno):
  - **(A) Deploy key nueva, sólo para este repo** — recomendado: genero `~/.ssh/id_ed25519_xvgalaxia`,
    el usuario la pega en *Settings → Deploy keys* con **Allow write access**. No da acceso a nada más.
  - **(B) Personal Access Token** — el usuario crea un token fine-grained con *Contents: read & write*
    sólo en `rgcandia/xv-galaxia` y lo pasa una vez; queda en `~/.git-credentials` (chmod 600).

## Lo que ya existe en el repo

- `src/` — prototipo de portada: imagen 9:16, respiración cósmica, estrellas en Canvas 2D, CTA. Build 71 KB gzip.
- `material/raw/img/` — las dos imágenes del Drive (768×1344 y 1344×768). `material/raw/video/` vacío (bloqueante).
- `docs/` — plan, análisis, decisiones, bitácora, entornos, datos del evento.

## Las 3 guardas que no se negocian

1. **Un tramo = un commit.** Si el anterior está rojo, no se arranca el siguiente.
2. **Si el tramo no entra en ~6 archivos / ~300 líneas, se corta ANTES** de empezar.
3. **Ningún tramo de código arranca sin OK del usuario** — este proyecto se maneja plan-primero.
