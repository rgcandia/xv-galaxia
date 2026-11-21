# AHORA.md — Invitación XV · Tiana (galaxia)

> **Estado:** la portada y la inmersión están **online y andando**.
> **URL:** https://xv-galaxia.orangetech.com.ar
> **Última actualización:** 2026-11-21

## Tablero

| | |
|---|---|
| **Rama / remoto** | `main` → `git@github.com:rgcandia/xv-galaxia.git` (deploy automático) |
| **Fases cerradas** | `F0` setup · `F1` portada · `F2` inmersión |
| **Fase abierta** | **`F3-a` — Universo, tramo 1**: secciones Núcleo (fecha/lugar) y Órbita (historia) + navegación flotante |
| **Plan que manda** | [`docs/plan-invitacion-xv-2026-11-21.md`](docs/plan-invitacion-xv-2026-11-21.md) |
| **Costos** | **$0** (Cloudflare free + GitHub free + Apps Script) |

## Lo que ya funciona (probar en el celular)

1. Portada con la galaxia, estrellas animadas, "Una noche en el cosmos", **Mis 15**, **Tiana**.
   - La portada **no muestra la fecha** (pedido del 2026-11-21).
2. Botón **Iniciar viaje** → video warp **con sonido** → a los **7,5 s** flash + zoom → aparece la portada.
3. Botón **Saltar** y red de seguridad si el video no arranca.

## Bloqueantes

- [ ] **Datos del evento**: hora, lugar + Maps, dress code, alias de regalos.
- [ ] **Fotos de Tiana** (1-2) → `material/raw/img/`, mismo `scp` del video.
- [ ] Confirmar **nombre** y **fecha** (siguen marcados `provisional: true`).

## Reglas no negociables

1. 🔒 **El plan manda**: no se escribe código de una fase sin OK del usuario.
2. 🔒 **Un tramo = un commit**, y `npm run build` verde antes de commitear.
3. 🔒 **Nada de datos reales de invitados** en el repo.
