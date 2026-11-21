# AGENTS.md — cómo trabajar en este repo (LEER PRIMERO)

> Instrucciones para agentes de IA. Es la **primera cosa** que hay que leer, junto con [`AHORA.md`](AHORA.md).
> Proyecto: **invitación digital de 15 años**, temática galaxia cósmica. Mobile-first, costo $0.
> Detalle del porqué de cada decisión: [`docs/decisiones.md`](docs/decisiones.md).

## 🧭 Arranque de sesión (30 segundos, antes de explorar nada)

1. Leer **este archivo** y **[`AHORA.md`](AHORA.md)**. Con eso alcanza: fase abierta, bloqueantes,
   qué plan manda y cuál es el próximo tramo.
2. **No explorar el repo** para averiguar el estado: si no está en `AHORA.md`, no es el trabajo de hoy.
3. Antes de escribir código: decir **el tramo**, **el «terminado cuando»** y **los archivos** que se van
   a tocar. Si el tramo no entra en ~6 archivos, **cortarlo antes** de empezar.
4. Al cerrar: **commit** (rama correcta), **una línea en la bitácora** y **actualizar `AHORA.md`**.

## 🔴 Regla de este proyecto: el plan manda, el código espera

Este proyecto nació de un pedido explícito: *"primero el plan"*. Por eso:

- 🔒 **No se escribe código de una fase sin autorización explícita del usuario.** Se propone el tramo,
  se espera el OK, y recién ahí se toca `src/`.
- 🔒 **No se instalan dependencias nuevas** (Three.js, Tailwind, tsParticles, Lenis, etc.) sin aprobación.
  Cada una que entra se anota en [`docs/decisiones.md`](docs/decisiones.md) con su motivo.
- 🔒 **No se agregan secciones, planetas ni "extras"** que no estén en el plan aprobado. Las ideas van a
  [`TASK.md`](TASK.md), no al código.
- Lo que ya está construido (`F0` + prototipo de `F1`) queda **congelado** hasta que se autorice seguir.

## ⚠️ Regla de oro: DÓNDE se trabaja

| Qué | Rama | Dónde |
|---|---|---|
| **Todo** (docs y código) | `main` | — (proyecto chico, sin staging por ahora) |
| **Deploy** | `main` | Cloudflare Pages (automático al pushear, cuando exista) |

- Este proyecto **no tiene staging**: no hay usuarios concurrentes ni datos críticos. Si algún día hace
  falta (por el RSVP), se decide y se anota; **no se improvisa**.
- 🔒 **Antes de commitear, verificar la rama** (`git branch --show-current`) y decirle al usuario cuál es.
- 🔒 **No pushear sin confirmación explícita.** ⚠️ Cada `push` a `main` **dispara un deploy** y el plan free de Cloudflare tiene **500 por mes**. Por eso:
  - Se commitea local todo lo que haga falta, y **se pushea cuando el usuario lo pide**.
  - **Agrupar commits en un solo push** siempre que se pueda (1 push = 1 deploy).
  - Si hay que mostrar algo, se muestra local; no se publica "para ver".
- 🔒 **No pushear sin confirmación explícita.** El remote es `git@github.com:rgcandia/xv-galaxia.git`.
  La llave SSH del server es un *deploy key* de otro repo (`colegionorbridge/Portal-Norbridge`):
  **no sirve acá** — hace falta la credencial de `D-16` o el push falla.

## 🧱 Cómo se trabaja: tramos cortos

**Qué es un tramo:** una sección de la experiencia, un commit, y algo que se puede probar **solo**.

| Tramo | Qué entra | Qué NO entra |
|---|---|---|
| Asset | comprimir un video / imagen / audio + su fallback | pantallas |
| Pantalla | **una** etapa o **una** sección | otra sección en el mismo commit |
| Integración | RSVP **o** DJ **o** regalos | las tres juntas |
| Infra | deploy, dominio, métricas | cambios visuales |

Reglas:

- 🔒 **Un tramo = un commit.** Si el anterior está rojo o sin commitear, no se arranca el siguiente.
- 🔒 **Un tramo entra en una respuesta** (~6 archivos, ~300 líneas). Si no entra, **se corta antes**.
- **No mezclar capas.** Un commit de assets no trae cambios de UI; un commit de UI no trae backend.
- **Cada corte deja el árbol verde**: `npm run build` pasa.
- **Dónde queda el plan:** [`docs/plan-invitacion-xv-2026-11-21.md`](docs/plan-invitacion-xv-2026-11-21.md),
  con la lista `F0…F7` y su «terminado cuando». Se marca ahí, no de memoria.

## 🚫 Alcance: qué NO se hace en este repo

- **No se toca ningún otro proyecto** de `/home/tic/proyectos/` (ver §Entorno).
- **No hay backend propio**: el RSVP va a Google Apps Script + Google Sheet. Nada de Postgres, Docker ni
  servicios nuevos en el servidor.
- **No se usan datos reales de invitados** en el repo ni en commits: ni nombres, ni teléfonos, ni alias/CBU.
  Los datos del evento van en una planilla privada y se referencian por variable.
- **No se sube material pesado sin optimizar** (`material/raw/` es la excepción, y el video está en `.gitignore`).

## Deploy (cuando llegue F5)

- **Cloudflare Pages**, proyecto propio, conectado a este repo. Gratis, ancho de banda ilimitado, HTTPS.
- El build es estático (`npm run build` → `dist/`). No hay variables de entorno secretas en el front.
- 🔒 **Antes de publicar: pasar el checklist de §F5 del plan** (QA en WhatsApp iOS/Android, 4G, ahorro
  de batería). Publicar sin eso es publicar a ciegas.
- El link es público para quien lo tenga, pero `noindex, nofollow` para que no aparezca en Google.

## Entorno de ejecución (importante)

- Es un **servidor Linux compartido** (Ubuntu 24.04, usuario `tic`, host `server-tic`), **no la máquina
  de escritorio** de nadie.
- 🔒 Hay otros proyectos vivos en `/home/tic/proyectos/` (`portal-norbridge`, `portal-norbridge-prod`,
  `bot-norbridge`, `bot-dgcatra`, `admisiones-norbridge`, `revista-digital`, `sorteo-norbridge`,
  `peter-solution`, `estrategia-ia-norbridge`, `relevamiento-puertos`). **Trabajar SÓLO dentro de
  `xv-galaxia/`**: no tocar, mover ni borrar otros directorios, contenedores ni volúmenes.
- **Puerto local propio: 5199** (`strictPort` en `vite.config.ts`). Ocupados por otros proyectos:
  3000, 3100, 4001, 5432, 8000, 8080, 8443, 8880, 27117, 20241. **No reutilizar esos.**
- Sin Docker, sin `.env` compartidos, sin cron, sin base de datos local.

## Mapa de documentación (no mezclar planes)

- 🚪 **Puerta de entrada: [`docs/README.md`](docs/README.md)** — las 3 preguntas y el mapa de docs.
- 📘 **El plan que manda:** [`docs/plan-invitacion-xv-2026-11-21.md`](docs/plan-invitacion-xv-2026-11-21.md)
  (fases `F0…F7` con «terminado cuando»).
- 📷 **El insumo:** [`docs/analisis-material-2026-11-21.md`](docs/analisis-material-2026-11-21.md)
  (qué hay en el Drive, qué falta, riesgos detectados). **No se actualiza**: es una foto del 21/11.
- 🧾 **Las decisiones:** [`docs/decisiones.md`](docs/decisiones.md) (`D-01…`). Si un plan la contradice,
  **manda la tabla**.
- 📔 **El diario:** [`docs/bitacora.md`](docs/bitacora.md) — una línea por tramo, con fecha y commit.
- 🖥️ **Dónde corre:** [`docs/entornos.md`](docs/entornos.md) — puerto, comandos, deploy, aislamiento.
- 📋 **El backlog:** [`TASK.md`](TASK.md) — ideas y pendientes que **no** son tramo de nadie.

> **Regla de mantenimiento:** un tramo, **una línea** en la bitácora. Si cambió una decisión, se anota en
> `decisiones.md`. Si cambió la fase, se actualiza `AHORA.md` y la tabla de estado del plan.

## Al terminar una tarea

- `npm run build` verde antes de commitear.
- Commit **en `main`** y **avisar** qué se commiteó.
- Una línea en [`docs/bitacora.md`](docs/bitacora.md) + `AHORA.md` actualizado si cambió la fase.
- No pushear sin OK.

## 🗣️ Cómo se responde

- **Alto nivel por defecto.** El usuario **dirige**, no lee código: qué se hizo, por qué, qué sigue — en
  pocas líneas.
- **Un pedazo de código sí, el volcado no**: si hace falta, un fragmento de 5–15 líneas que muestre la
  idea. Nada de archivos enteros ni árboles completos.
- **Bajo nivel sólo si lo pide** ("mostrame el código", "el diff").
- El detalle técnico no se pierde: va al **commit** y a la **bitácora**, no al chat.
