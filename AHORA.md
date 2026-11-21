# AHORA.md — Invitación XV · Tiana (galaxia)

> **Estado:** portada, inmersión y universo **online y andando**. Rumbo nuevo aprobado
> ([`guia-contenido-2026-11-21.md`](docs/guia-contenido-2026-11-21.md)): **la Luna manda**, Júpiter y Saturno se
> quedan, el Sol y Venus salen, el video va completo y vuelve la confirmación de asistencia.
> **URL:** https://galaxia.orangetech.com.ar
> **Última actualización:** 2026-11-21

## Tablero

| | |
|---|---|
| **Rama / remoto** | `main` → `git@github.com:rgcandia/xv-galaxia.git` (deploy automático) |
| **Dominio** | **`galaxia.orangetech.com.ar`** (200 verificado). El viejo ya no resuelve |
| **Fases cerradas** | `F0` setup · `F1` portada · `F2` inmersión · `F3` universo (fondo, cuerpos, fugaces, anillo, viaje) |
| **Plan que manda** | [`docs/guia-contenido-2026-11-21.md`](docs/guia-contenido-2026-11-21.md) para el rediseño; [`plan-invitacion-xv-2026-11-21.md`](docs/plan-invitacion-xv-2026-11-21.md) para fases y cronograma |
| **Código/online** | `2289cff` (B1 fondo real + P1 revertido), pusheado y online |
| **Cerrados hoy (local, sin pushear)** | ✅ `I1` dominio nuevo en los meta · ✅ `P1` carga con tres estrellas · ✅ `P2` video completo (10 s) + aterrizaje |
| **Siguiente, esperando OK** | `L1` elenco (Luna · Júpiter · Saturno) · `L2` la Luna manda + rótulos · `E0`–`E2` la estrella |
| **⏸️ En pausa a pedido del usuario** | **"La memoria"** (`M0`–`M3`: fotos, videos, voces) — primero se define el cómo |
| **Costos** | **$0** (Cloudflare free + GitHub free + Apps Script) |
| **Deadline** | **12/12**: link listo para mandar (después el 20/12 el plan entra en pausa) |

## Lo que ya funciona (probar en el celular)

1. Portada con la galaxia, estrellas animadas, "Una noche en el cosmos", **Mis 15**, **Tiana** (sin fecha).
2. Botón **Iniciar viaje** → video warp **con sonido** → flash + zoom → universo. Botón **Saltar** y red de
   seguridad si el video no arranca.
3. Universo: fondo real (Helix Nebula), viñeta, grano, fugaces paralelas y satélite.
4. **Sol** (textura real + rótulo), **Venus** (aureola) y **Saturno** (anillo con perfil C/B/Cassini/A que pasa
   por delante y por detrás). Al tocar, el planeta **viaja** hasta llenar la pantalla y entra la sección.
5. Tres secciones: **Cuándo y dónde** (fecha, hora, lugar + Cómo llegar), **Cómo venir** (paleta) y
   **Un mensaje al universo** (alias + copiar). Sin scroll, con volver.

## Lo que cambia (y no está hecho todavía)

| Qué | Estado |
|---|---|
| Dominio nuevo en `canonical`/`og:*` | ✅ hecho (se ve al pushear: la vista previa de WhatsApp se refresca recién con el deploy) |
| Luna protagonista + Júpiter, afuera Sol y Venus | 📋 escrito (`L1`, `L2`) |
| Video completo (10 s) + aterrizaje por CSS | ✅ hecho |
| Carga con tres estrellas, sin % | ✅ hecho |
| Confirmación que enciende una estrella | 📋 escrito (`E0`–`E2`) |
| Recuerdos: fotos de bebé, videos, cápsula de audio | ⏸️ **en pausa**: falta definir |

## Bloqueantes

- [ ] **Datos del evento**: hora, lugar + Maps, dress code, alias definitivo.
- [ ] **Material de Tiana**: fotos de bebé y videos (cuando se defina "La memoria").
- [ ] Confirmar **nombre** y **fecha** (`provisional: true`).
- [ ] Respuestas abiertas de §10 de la guía (pases, cápsula curada o de invitados, nombres públicos o no).

## Reglas no negociables

1. 🔒 **El plan manda**: no se escribe código de un tramo sin OK del usuario.
2. 🔒 **Un tramo = un commit**, y `npm run build` verde antes de commitear.
3. 🔒 **No pushear sin OK** (1 push = 1 deploy de los 500/mes).
4. 🔒 **Nada de datos reales de invitados** en el repo; los nombres viven en la planilla.
