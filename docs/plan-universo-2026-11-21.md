# Plan · El Universo (Etapa 3)

**Estado:** ⛔ superado por [`guia-contenido-2026-11-21.md`](guia-contenido-2026-11-21.md) — se conserva como registro del elenco anterior (Sol · Venus · Saturno)
**Fecha:** 2026-11-21
**Manda / lo reemplaza:** lo reemplaza la **guía de contenido** (`D-36` cambia el elenco: Luna protagonista + Júpiter + Saturno, el Sol y Venus salen; `D-40` revierte el §7 "las fotos no van"). Lo que sigue vigente de este doc: el fondo en tres capas, las reglas de las fugaces (§3.3), el presupuesto y los riesgos (§5–6).

---

## 1. El problema

La portada impacta: galaxia, video, zoom, flash. El universo **no**. Diagnóstico:

1. **Tres cuerpos iguales** de distinto tamaño: no hay jerarquía ni significado, es una grilla.
2. **Fondo distinto al de la portada** (degradado plano vs. galaxia): se siente como entrar a otra página, no a la misma galaxia.
3. **Nada se mueve** salvo un flote suave: la pantalla parece un póster.
4. **No hay profundidad**: todo está en el mismo plano, sin capas.

## 2. El objetivo

Que la pantalla siguiente **continúe** el impacto del video, no que lo baje. La sensación buscada: *"entré a esa galaxia y ahora estoy adentro"*.

## 3. La escena

### 3.1 Fondo en tres capas (profundidad real)

| Capa | Contenido | Movimiento |
|---|---|---|
| **Lejana** | la misma imagen de galaxia, **blur 8–12 px**, oscurecida 60%, escala 120% | deriva de 60 s, 3% de recorrido |
| **Media** | estrellas nítidas (ya existe `Starfield`) + **estrellas fugaces** + polvo | parallax leve con el dedo |
| **Cercana** | 20–30 partículas de polvo grandes y muy transparentes | parallax más marcado |

La capa lejana es lo que da **continuidad** con la portada: el invitado reconoce el mismo cielo, más cerca.

### 3.2 Tres cuerpos, tres significados

| # | Cuerpo | Sección | Tratamiento |
|---|---|---|---|
| 1 | ☀️ **Sol** | Cuándo y dónde | el dominante: 3× los demás, **rompe el encuadre** por el borde, corona con rayos suaves, granulación, pulso de 8 s |
| 2 | 🪐 **Venus** | Vestimenta | aureola exterior difusa (blur real), ámbar pálido, superficie con nubes en bandas |
| 3 | 💍 **Saturno** | Regalos | anillos en **dos elipses** (una por delante, una por detrás), inclinación 20°, sombra del planeta sobre el anillo |

Ninguno se mueve en fila: **orbitan** el Sol muy despacio, en ángulos distintos.

### 3.3 Reglas de las estrellas fugaces

Las de una lluvia real son **paralelas**, vienen del mismo radiante. Romper eso se lee como error.

- Todas del mismo ángulo: **~35–40°, desde arriba-izquierda**.
- Frecuencia: **una cada 8–14 s**, con azar (a veces dos seguidas, a veces ninguna en 20 s).
- Trazo fino (1 px), duración 0,5–0,9 s, estela que se desvanece.
- Capa **media**: detrás de los planetas, delante de la nebulosa.
- **1 de cada 5** más brillante y más larga: la irregularidad es lo que la hace creíble.
- Extra: cada tanto un **punto lento** (satélite) cruzando 20 s de borde a borde.

## 4. Tramos

### U1 · Fondo y composición
- Capa lejana con la galaxia (blur + deriva), capa media, capa cercana con parallax.
- El Sol rompe el encuadre; escala real entre cuerpos.
- **Terminado cuando:** la pantalla se siente *dentro* de la misma galaxia del inicio, y el Sol manda visualmente.

### U2 · Los tres cuerpos
- Sol con corona y granulación · Venus con aureola · Saturno con anillos y sombra.
- **Terminado cuando:** vistos de a uno, cada cuerpo se reconoce como *ese* cuerpo y no como una esfera genérica.

### U3 · Vida
- Fugaces paralelas con las reglas de §3.3 + polvo en órbita + deriva de los cuerpos.
- **Terminado cuando:** mirando la pantalla 30 s sin tocar nada, se ve vivo y no nervioso.

### U4 · La llegada
- Al terminar el video, la cámara se aleja: los cuerpos entran escalonados (Sol → Venus → Saturno) y el texto aparece a los ~1,2 s.
- **Terminado cuando:** la transición video → universo es continua, sin corte seco.

### U5 · Pulido de interacción
- Halo al tocar, nombre que aparece antes del viaje, y un pulso que invite a tocar (sin texto instructivo).
- **Terminado cuando:** alguien que abre el link por primera vez toca un planeta sin que se lo digan.

## 5. Presupuesto

| | |
|---|---|
| Imágenes nuevas | **0 KB** (todo CSS; la galaxia ya está descargada) |
| JS | +2–4 KB (fugaces en el canvas existente) |
| CSS | +4–6 KB |
| Límite | JS sigue bajo 80 KB gzip · primer pintado sin cambios |

## 6. Riesgos

| Riesgo | Mitigación |
|---|---|
| Parallax con `pointermove` falla en WebViews | si no hay eventos, queda estático; nunca rompe |
| Blur grande en celulares de gama baja | `blur` sólo en la capa lejana y con `will-change` acotado |
| Muchas animaciones = batería | fugaces y polvo en un solo `requestAnimationFrame`, se pausa con la pestaña oculta |
| `prefers-reduced-motion` | sin fugaces, sin deriva, sin pulso: escena quieta y legible |
| Se ve saturado | regla dura: **1 dominante, 2 secundarios, resto al 40% de opacidad** |

## 7. Fuera de alcance (por ahora)

- Texturas fotográficas reales (~25 KB por cuerpo): se evalúan **después** de U2. Si la escena CSS convence, no hacen falta.
- Three.js / 3D real: descartado (`D-01`), el costo en peso y compatibilidad no se justifica.
- Fotos de Tiana: no van (decisión del usuario, no le gustan).

## 8. Decisiones nuevas

| ID | Decisión | Porqué |
|---|---|---|
| D-20 | El fondo del universo reusa la galaxia, desenfocada y en capas | continuidad con la portada; hoy se siente otra página |
| D-21 | Los tres cuerpos son distintos (Sol / Venus / Saturno), no esferas iguales | jerarquía y significado: fecha, vestimenta, regalo |
| D-22 | Estrellas fugaces **paralelas**, mismo radiante, 1 cada 8–14 s | es física real; direcciones distintas se leen como error |
| D-23 | Nada de texto instructivo en el universo ("tocá un planeta") | el pulso y el halo invitan solos; el texto mata la magia |
| D-24 | Todo en CSS + el canvas existente, 0 imágenes nuevas | peso, nitidez y control de color |
