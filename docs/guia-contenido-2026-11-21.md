# Guía · El universo de Tiana (rearmado)

> **Estado:** 📋 plan definido en rumbo · **ningún tramo se construye sin OK explícito**
> **Fecha:** 2026-11-21
> **Manda / lo reemplaza:** manda sobre [`plan-universo-2026-11-21.md`](plan-universo-2026-11-21.md) (ese queda como registro del elenco anterior: Sol/Venus/Saturno). El [`plan-invitacion-xv-2026-11-21.md`](plan-invitacion-xv-2026-11-21.md) sigue mandando en fases, cronograma y presupuesto de peso.

> **Cómo se usa este doc:** acá está el rumbo completo y el detalle de cada tramo. Se construye **de a uno**,
> en orden, y cada tramo se cierra con `npm run build` verde + un commit. Sin push hasta que el usuario lo pida
> (1 push = 1 deploy de los 500/mes del plan free).

---

## 0. El pedido, en una línea

Tiana vio la invitación y le encantó. Pidió **cambios de elenco y más contenido de ella**: la **Luna** como
personaje principal, **Júpiter** y **Saturno** porque son sus favoritos, el **Sol afuera**, menos "menú de
banco" en los nombres, el **video entero**, y una forma de **confirmar asistencia que encienda una estrella**.

## 1. Qué NO se toca (es lo que le gustó)

| Se conserva | Por qué |
|---|---|
| La portada: galaxia, estrellas, "Mis 15 · Tiana" | el impacto que la convenció |
| El video de inmersión con su audio y el whoosh | "la parte más dramática" (pedido del usuario) |
| El fondo del universo (Helix Nebula), viñeta y grano | la profundidad que ya funciona |
| Las fugaces paralelas y el satélite | la escena se siente viva sin ser nerviosa |
| El viaje al tocar un cuerpo + flash + `@keyframes` | el efecto que costó 5 tramos dejar bien (`Z1`–`Z3-c`) |
| Una sección por pantalla, sin scroll | legible en cualquier celular |
| Todo CSS + canvas: **0 imágenes nuevas** para los cuerpos | `D-24` |

## 2. El reparto

| Cuerpo | Rol | Sección |
|---|---|---|
| 🌕 **Luna** | **protagonista**: 3× los demás, rompe el encuadre arriba, halo, terminador (media luna iluminada, no un círculo lleno) | La cita |
| 🪐 **Júpiter** | secundario: bandas como paleta + Gran Mancha Roja + sus 4 lunas chiquitas | El brillo |
| 💍 **Saturno** | secundario: anillos, queda como está (ya funciona) | Un detalle |
| ⭐ **La estrella de cada invitado** | no es un cuerpo: va como píldora fija arriba a la derecha con el contador | Tu estrella |
| ☀️ ~~Sol~~ | **sale del plano**. Solo queda un resplandor cálido **fuera del encuadre**, que no se toca y no tiene rótulo | — |
| ♀️ ~~Venus~~ | **sale**: no es favorito de nadie y con Júpiter ya están los dos que ella eligió | — |

## 3. Los cinco destinos

| Destino (lo que se ve) | Título adentro | Tratamiento |
|---|---|---|
| 🌕 **La cita** | *Cuándo y dónde* | Luna, la protagonista |
| 🪐 **El brillo** | *Cómo venir* | Júpiter: las bandas **son** la paleta (negro, azul noche, plata, dorado) |
| 💍 **Un detalle** | *Un mensaje al universo* | Saturno, regalos + alias |
| ✨ **La memoria** | *Sus 15* | **⏸️ en pausa, sin definir** (§5) |
| ⭐ **Tu estrella** | *Confirmá tu asistencia* | no va en la barra de destinos: píldora fija arriba |

**La regla que resuelve el problema de los nombres (`D-41`):** el nombre del **destino** es poético (lo que se
ve en el universo) y el **título de la sección** es claro y funcional (lo que se lee adentro). Así no se pierde
nadie y no suena a trámite.

## 4. Los tramos

Estados: 🟢 pedido por el usuario · 📋 propuesto · ⏸️ en pausa · ⬜ pendiente · ✅ hecho

### Ola 0 · El arranque (esta semana)

#### `I1` · Dominio `galaxia.orangetech.com.ar` ✅
- **Contexto:** el usuario cambió el dominio en Cloudflare. Verificado el 2026-11-21: **`galaxia.orangetech.com.ar` → 200**
  y `xv-galaxia.orangetech.com.ar` **ya no resuelve**.
- **Problema:** `index.html` todavía declara el dominio viejo en `og:url`, `canonical` y **`og:image`**. Como
  `og:image` es una URL absoluta, la **vista previa del link en WhatsApp apunta a un dominio muerto**.
- **Entra:** los 3 meta de `index.html`, `AHORA.md`, `entornos.md`, `bitacora.md`.
- **No entra:** nada del lado Cloudflare (el custom domain lo maneja el usuario).
- **Terminado cuando:** la vista previa de WhatsApp del dominio nuevo muestra imagen y título.
- **Archivos:** `index.html` + docs.

#### `P1` · La carga de la portada con tres estrellas ✅
- **Hoy:** el botón muestra "Preparando el viaje" + barra + **porcentaje**.
- **Decisión (`D-37`):** salen los puntitos y sale el **porcentaje** (grita "app"). Quedan **tres estrellas que
  se encienden en secuencia** (0 KB, pertenecen al cielo) + una **línea de 1 px** que avanza con el progreso real.
- **Por qué no el cohete con humo:** se lee infantil en una invitación de 15 y el humo cuesta frames en gama
  media. Si el cohete aparece, que sea **como ícono del botón "Iniciar viaje"**, no como loader.
- **Terminado cuando:** no hay salto ni cartel vacío entre el HTML y el React; si la red es mala, el invitado
  entra igual (se mantiene el rescate a los 8 s).
- **Archivos:** `src/App.tsx`, `src/styles/portada.css`.

#### `P2` · El video completo + el aterrizaje por CSS ✅
- **Medido antes de decidir:** el original dura **10,24 s** (7,2 MB) y el que está online es un recorte de **7,5 s**
  (782 KB). La luminancia **sube** hacia el final (90 → 111): el video **termina en crescendo**, no se apaga.
  Por eso conviene usarlo entero.
- **Entra:** re-encode **desde `material/raw/video/`** (`D-27`, nunca desde el `warp.mp4` ya comprimido) con los
  mismos parámetros (crf 33, 704 px, AAC mono, `+faststart`) → ~1,65 MB. `corteVideoSegundos` pasa a 10,24 y el
  corte lo hace `onEnded`. Después: **último frame congelado → zoom + bloom de 0,9 s por CSS → cruce al universo
  que arranca al 115 % y vuelve a 100 %**. Y **`Saltar` que recuerda la elección** (`localStorage`): el que ya lo
  vio entra directo.
- **No entra:** audio nuevo, segundo video.
- **Terminado cuando:** no existe corte visible entre el último frame y el universo, y el invitado que ya lo vio
  no lo vuelve a ver.
- **Riesgo:** +3 s de espera obligatoria → mitigado por el `Saltar` persistente.
- **Archivos:** `public/media/warp.mp4`, `src/evento.ts`, `src/App.tsx`, `src/styles/portada.css`.

### Ola 1 · El elenco (después de la 0)

#### `L1` · Cambio de elenco 📋
- **Entra:** Luna (cráteres con radial-gradients, terminador), Júpiter (bandas + Gran Mancha Roja + 4 lunas
  chiquitas), Saturno igual. Afuera el Sol como destino y afuera Venus. Resplandor cálido fuera de encuadre.
- **No entra:** jerarquía ni rótulos (eso es `L2`).
- **Terminado cuando:** los tres se reconocen de un vistazo, sin leer el rótulo.
- **Archivos:** `src/components/mapa.css`, `src/components/Mapa.tsx`.

#### `L2` · La Luna manda + los rótulos 📋
- **Entra:** la Luna al 3× y rompiendo el encuadre; Júpiter y Saturno al 40 % de opacidad hasta que los tocás;
  rótulos nuevos (`La cita` / `El brillo` / `Un detalle`) + el título funcional adentro de cada sección.
- **Terminado cuando:** a los 5 s de mirar se entiende que la Luna es el centro (sin texto instructivo, `D-23`).
- **Archivos:** `mapa.css`, `Mapa.tsx`, `Universo.tsx`, `evento.ts`.

### Ola 2 · ⏸️ EN PAUSA — "La memoria"

**El usuario todavía no quiere construirla: primero quiere definirla.** Los cuatro tramos quedan escritos acá
para no perderlos, **sin fecha y sin autorización**:

| # | Tramo | Entra |
|---|---|---|
| `M0` | Tubería de medios | script de compresión (fotos → AVIF/WebP ≤ 80 KB, videos ≤ 500 KB, audios ≤ 300 KB), nombres neutros (`r01.webp`), sin EXIF ni GPS |
| `M1` | La constelación | las fotos de bebé como estrellas, juntas dibujan una **T** |
| `M2` | Los videos | 2–3 clips mudos de 3–6 s, `playsInline`, `preload="none"`, poster |
| `M3` | Las voces | cápsula curada: cada audio es una estrella que habla |

Ver §5 para lo que hay que decidir antes de arrancar.

### Ola 3 · La estrella (la confirmación)

Vuelve el RSVP, que hoy está afuera (`D-39`). **No es un muro: es una pregunta blanda.**

#### `E0` · Backend (sin pantalla)
- Google Apps Script `doPost` + planilla de Google. Campos: **nombre completo**, cantidad de pases (a definir),
  fecha. Dedupe por nombre normalizado, freno por IP/día, honeypot.
- **Terminado cuando:** un nombre llega a la planilla y el mismo nombre repetido no duplica la estrella.

#### `E1` · El pedido de nombre + el encendido
- A los ~1,5 s de la portada, tarjeta suave: **"¿Cómo te llamás? Tu estrella te espera"** + `[Escribir mi
  nombre]` + un discreto **"Solo mirar"**. Nunca antes del impacto, nunca bloqueando el paso.
- Al enviar: **se enciende una estrella**, el nombre se ve un segundo y "Gracias". Queda guardado en el
  teléfono (no vuelve a preguntar).
- Si el envío falla: la estrella se enciende igual en su teléfono y el sitio sigue.
- **Terminado cuando:** confirmás y ves **tu** estrella encenderse, y al volver a entrar no te pregunta de nuevo.

#### `E2` · El cielo
- Píldora fija arriba a la derecha con el contador. Se muestra **solo el total** ("48 estrellas ya están en el
  cielo"), **nunca los nombres completos** (`D-42`: los nombres los ve el usuario en su planilla).
- **Terminado cuando:** se ve lleno y vivo sin exponer datos de invitados (regla: **cero datos reales de
  invitados en el repo**).

### Ola 4 · Pulido (antes del 12/12)

| # | Tramo | Terminado cuando |
|---|---|---|
| `Q1` | La llegada (ex `U4`): entra la Luna → Júpiter → Saturno, texto a ~1,2 s | la transición video → universo no tiene corte seco |
| `Q2` | El pulso (ex `U5`): la Luna late cada tanto + halo al tocar | alguien toca la luna sin que se lo digan |
| `Q3` | Rotación de los tres cuerpos | se nota vivo mirando 20 s, sin bajar de 60 fps |
| `Q4` | QA: iPhone + Android reales, 4G, ahorro de batería, `prefers-reduced-motion` | **el link está listo para mandar** |

## 5. ⏸️ Lo que hay que definir antes de "La memoria"

### Las ideas sobre la mesa (todas guardadas, ninguna decidida)

| Idea | Cómo es | Costo |
|---|---|---|
| **A · La constelación es su inicial** | las fotos son estrellas y juntas dibujan una **T** (o un 15); una estrella más brillante = una voz | bajo |
| **B · Los cráteres de la luna** | tocás un cráter y se abre un recuerdo | alto (8–12 imágenes recortadas) |
| **C · El álbum orbital** | las fotos orbitan la luna despacio | alto (batería: 12 imágenes animadas) |
| **D · La estela del cometa** | un recorrido por su vida, bebé → 15, deslizando | bajo, y el más narrativo |

**Recomendación del agente:** `A` como puerta y clima + `D` adentro como recorrido. No decidido.

### Las preguntas que faltan contestar

1. ¿Constelación con su inicial, estela del cometa, cráteres, álbum orbital, u otra cosa?
2. ¿Cuántas fotos y cuáles? (propuesta: 8–12, las que ella elija)
3. ¿Videos: cuántos y de qué momento?
4. ¿Cápsula **curada** (3–6 voces elegidas) o **de invitados** (graban desde el celular)?
   - Curada: sin backend, $0, un tramo.
   - De invitados: Apps Script + almacenamiento, moderación, más riesgo y más pruebas.
5. ¿La memoria es un **4º destino** del universo o el **cierre**, después de "Tu estrella"?
6. ¿Los audios tienen que ver con "cápsula de tiempo" (se guardan para que ella los escuche después) o son
   para escuchar ahí mismo?

## 6. Reglas duras

1. **Peso:** primera pantalla ≤ 600 KB · el contenido de memoria ≤ 1,8 MB **y siempre con carga diferida**
   (nada se descarga antes de abrirlo). Hoy el arranque es ~200 KB.
2. **Un solo medio suena a la vez.** Videos `muted`, `playsInline`, `preload="none"`, poster siempre; al abrir
   un audio se pausa el video. Dos players compitiendo rompen iOS.
3. **Fotos de una menor en un link público:** `noindex` ya está · nombres de archivo neutros · **sin EXIF ni
   GPS** · sin nombre completo en pantalla.
4. **Cero datos de invitados en el repo.** Los nombres viven en la planilla del usuario.
5. **Todo apagable desde `evento.ts`** (regla `F3-b`): si un día se arrepiente de algo, se apaga con un `false`.
6. `prefers-reduced-motion` y `saveData`: sin autoplay, sin fugaces, sin zoom. Nunca romper.
7. **Un tramo = un commit**, `build` verde, **sin push** hasta que el usuario lo pida.

## 7. Cómo llega el material

Mismo camino que el video (scp por el Cloudflare Tunnel) a `material/raw/img/` y `material/raw/video/`.
Los originales **no se versionan** (están en `.gitignore`): al repo entra solo lo comprimido, con nombre neutro.

## 8. Riesgos

| Riesgo | Mitigación |
|---|---|
| 12 fotos + 3 videos = se pierde la liviandad | carga diferida + topes de peso verificados en cada tramo |
| el celular corta por memoria en gama baja | fotos de 1400 px máx, videos de 540 px, nunca los originales |
| la Luna blanca gigante parece una lámpara | se pinta con **terminador** (media luna iluminada), no un círculo lleno |
| el pedido de nombre espanta invitados | "Solo mirar" siempre visible, y nunca antes del impacto |
| nombres de invitados expuestos | solo el total en pantalla; los nombres, solo en la planilla |
| diciembre se corta el 20 | la ola 4 tiene deadline duro: **12/12** |
| el parallax ya falló una vez (`P1` revertido) | no se vuelve a intentar; la profundidad la dan las capas, no el `pointermove` |

## 9. Decisiones derivadas

| ID | Decisión |
|---|---|
| `D-35` | Dominio `galaxia.orangetech.com.ar` (el viejo queda muerto) |
| `D-36` | Elenco: Luna protagonista + Júpiter + Saturno. Afuera Sol (como destino) y Venus |
| `D-37` | Carga con **tres estrellas**, sin porcentaje. El cohete, si aparece, va en el botón |
| `D-38` | Video **completo** (10,24 s) + aterrizaje por CSS. Revierte `D-19` (corte en 7,5 s) |
| `D-39` | **Vuelve la confirmación de asistencia**: nombre al entrar (blando) → enciende una estrella |
| `D-40` | **Fotos y videos de Tiana sí van.** Revierte la decisión §7 de `plan-universo` ("no van") |
| `D-41` | Rótulos: destino poético + título funcional adentro |
| `D-42` | Los nombres de invitados **no se publican**: solo el total de estrellas |

## 10. Preguntas abiertas (esperando respuesta del usuario)

1. ¿La tarjeta del nombre lleva **"Solo mirar"**? (recomendación: sí, siempre)
2. ¿Se pide **cantidad de pases** además del nombre?
3. ¿Los nombres se ven en el sitio o **solo en la planilla**? (recomendación: solo planilla)
4. ¿Cápsula **curada** o **de invitados**?
5. ¿La familia **"La cita / El brillo / Un detalle / La memoria / Tu estrella"** cierra, o preferís otra?
6. ¿**Fecha 2/2/2027** confirmada? Sigue `provisional: true`.
7. ¿La memoria es **4º destino** o **cierre**?

## 11. Registro de ideas (van a `TASK.md`, no se construyen)

- El cohete con humo como loader (descartado por ahora; posible como ícono del botón).
- El eclipse: la Luna cruzando el resplandor del Sol como transición de llegada.
- Los cráteres de la Luna como álbum.
- El álbum orbital.
- Contador "has viajado X km" / muro de mensajes / modo sin sonido (ya estaban en `TASK.md`).
