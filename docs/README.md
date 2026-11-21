# Documentación — Invitación XV (temática espacial)

> **Esta es la puerta de entrada.** Si no sabés por dónde empezar, es acá.
>
> **Qué es esta carpeta:** el conocimiento del proyecto — qué se quiere construir, por qué se decidió cada
> cosa, qué falta y qué pasó. **La doc es la herramienta de soporte**: lo que no está acá hay que
> reconstruirlo leyendo código a las apuradas.
>
> **Estado del índice:** 2026-11-21. Si agregás un doc y no lo enlazás acá, queda invisible.

---

## Las 3 preguntas (encontrá el doc en 10 segundos)

| Pregunta | Documento | Qué te contesta |
|---|---|---|
| **¿Qué estamos haciendo HOY?** | [`../AHORA.md`](../AHORA.md) | fase abierta, bloqueantes, próximo tramo. **Se lee primero** |
| **¿Qué estamos construyendo y en qué orden?** | [`plan-invitacion-xv-2026-11-21.md`](plan-invitacion-xv-2026-11-21.md) | las fases `F0…F7`, cada una con su «terminado cuando» y su presupuesto de peso |
| **¿Qué cambió del universo y en qué tramos?** | [`guia-contenido-2026-11-21.md`](guia-contenido-2026-11-21.md) | **el rumbo nuevo**: Luna protagonista, Júpiter y Saturno, video completo, confirmación con estrella, y los tramos `I1` · `P1` · `P2` · `L1` · `L2` · `E0`–`E2` · `Q1`–`Q4` |
| **¿Para quién, cuándo y dónde es?** | [`datos-evento.md`](datos-evento.md) | nombre, fecha, lugar, dress code, regalos. **Todo provisional** hasta que el usuario lo cierre |
| **¿De dónde salió todo esto?** | [`analisis-material-2026-11-21.md`](analisis-material-2026-11-21.md) | inventario del Drive, huecos del material, riesgos técnicos |
| **¿Qué se decidió y por qué?** | [`decisiones.md`](decisiones.md) | `D-01…`: stack, 2.5D en vez de 3D, RSVP en Sheet, puerto, deploy. **Si un plan lo contradice, manda la tabla** |
| **¿Qué pasó y con qué commit?** | [`bitacora.md`](bitacora.md) | el diario: una línea por tramo |
| **¿Dónde corre y cómo se publica?** | [`entornos.md`](entornos.md) | puerto 5199, comandos, aislamiento, deploy en Cloudflare Pages |
| **¿Cómo se trabaja en este repo?** | [`../AGENTS.md`](../AGENTS.md) | plan-primero, tramos cortos, qué no se toca |
| **¿Qué queda pendiente?** | [`../TASK.md`](../TASK.md) | backlog abierto e ideas anotadas |
| **¿Cambió el elenco o el contenido?** | [`guia-contenido-2026-11-21.md`](guia-contenido-2026-11-21.md) | el rumbo del rediseño y sus tramos |

---

## Los documentos vivos

| Doc | Qué es | Cuándo se toca |
|---|---|---|
| [`plan-invitacion-xv-2026-11-21.md`](plan-invitacion-xv-2026-11-21.md) | **El plan que manda.** Fases, alcance, presupuesto de peso. | Al abrir/cerrar cada fase |
| [`guia-contenido-2026-11-21.md`](guia-contenido-2026-11-21.md) | **El rearmado del universo.** Elenco nuevo, contenido, confirmación con estrella, tramos y reglas de peso/privacidad. | Al abrir/cerrar cada tramo del rediseño |
| [`decisiones.md`](decisiones.md) | **El ADR.** La decisión manda sobre el plan. | Al decidir algo que cruza más de una fase |
| [`bitacora.md`](bitacora.md) | **El diario.** Qué pasó, cuándo, con qué commit. | **Al cerrar cada tramo: una línea** |
| [`entornos.md`](entornos.md) | **Dónde corre**: puerto, comandos, deploy, aislamiento. | Cuando cambie el deploy o el puerto |
| [`datos-evento.md`](datos-evento.md) | **El contenido**: nombre, fecha, lugar, dress code, alias. | Cada vez que el usuario confirme o cambie un dato |
| [`../AHORA.md`](../AHORA.md) | **El estado.** 2 líneas, no bitácora. | Al abrir y al cerrar cada tramo |

## Los documentos que **no** se actualizan (registro)

| Doc | Qué es |
|---|---|
| [`analisis-material-2026-11-21.md`](analisis-material-2026-11-21.md) | 📷 foto: análisis del material del Drive y riesgos detectados al 2026-11-21 |
| [`fuente-drive-spec.txt`](fuente-drive-spec.txt) | 📦 registro: la spec original bajada del Drive, tal cual la escribió el usuario |

---

## Convenciones

**Nombre.** `kebab-case`; los planes llevan la fecha de **creación**: `plan-<tema>-YYYY-MM-DD.md`
(no cambia al editarlo, así los links no se rompen).

**Encabezado (3 líneas).** Todo doc vivo o plan abierto arranca con:

```markdown
> **Estado:** 🟢 vivo · 🟡 en curso · 📋 plan aprobado · ⛔ superado por `otro.md`
> **Fecha:** YYYY-MM-DD
> **Manda / lo reemplaza:** qué doc tiene prioridad si hay conflicto
```

**Estados.** 🟢 vivo · 🟡 en curso · 📋 plan aprobado sin ejecutar · 👁 propuesta · ✅ cerrado ·
⛔ superado · 📷 foto (insumo de una fecha) · 📦 registro histórico.

**Cierre.** Un plan terminado **no se borra ni se mueve**: se le pone `✅` en la primera línea.

**Datos privados.** Nombres de invitados, teléfonos, alias/CBU y direcciones **no van al repo**.
Van a la planilla privada del evento y el código los lee por variable o por token.
