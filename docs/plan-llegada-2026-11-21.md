# Plan de llegada al planeta — Z1…Z3

> Pedido: al tocar un planeta el acercamiento "pasa muy rápido"; el Sol no hace ninguna
> animación; ¿conviene sonido? ¿un video de entrada? (esto último queda para después).
> **Estado:** `Z1` y `Z2` hechos (2026-11-21). Falta la devolución del usuario y el push.

## 1. Qué pasa hoy

- `viajar(v)` marca el cuerpo con `.is-elegido` y **470 ms después** cambia de pantalla.
- La animación es `transform: scale(9) + opacity: 0` en `.astro`. El CSS no tiene
  `transition` para ese cambio: el navegador lo interpola a la velocidad que puede
  (≈400 ms), y encima cortamos a los 470 ms → **se ve un salto, no un viaje**.
- **El Sol no se mueve** por un motivo concreto: su `.astro` tiene `animation: pulso 8s`,
  y una animación en curso **pisa** el `transform` de la clase `.is-elegido`. No es que
  falte la regla: la regla está y la animación la gana.

## 2. Tramo Z1 — Acercamiento lento (lo que pidió) · 2 archivos
`mapa.css` + `Mapa.tsx`

- `transition: transform 1,9 s cubic-bezier(.5, 0, .75, 0), opacity .5s ease .9s` en `.astro`.
  Curva de aceleración (arranca lento y se dispara): es lo que hace que se sienta "viaje".
- `viajar()` pasa de 470 ms a **2.500 ms**, y el resto de la pantalla se atenúa
  (`filter: brightness(.35)` en las capas de fondo) para que el cuerpo elegido mande.
- Se pausa `pulso`/`flotar` del cuerpo elegido (`animation: none`) para que no peleen.
- **El Sol queda igual que Venus y Saturno**, sin reglas especiales.
- Reduced-motion: sin zoom, salto directo (como hoy).
- **Terminado cuando:** los tres destinos hacen el mismo viaje, se llega a ver el planeta
  crecer, y no queda ningún salto.

## 3. Tramo Z2 — Sonido de entrada (opcional, decidir)
`public/media/whoosh.ogg` + `Mapa.tsx`

- Un "whoosh" corto (~1 s, mono, OGG/MP3, **≤ 25 KB**) con fade-in al tocar.
- ⚠️ **iOS bloquea audio sin gesto**: acá sí hay gesto (el tap), así que funciona.
- ⚠️ El usuario ya pidió **no** poner avisos de sonido en la portada: si entra audio, tiene
  que ser discreto y no depender de que el invitado lo espere.
- **Recomendación:** sí, pero recién cuando esté Z1 aprobado. Un sonido de 1 s con el zoom
  lento multiplica la sensación de viaje. Riesgo bajo, 25 KB.
- Alternativa sin archivo: un `AudioContext` con ruido filtrado (0 KB). Suena más pobre.

## 4. Lo que NO hacemos ahora
- **Video de entrada al planeta**: son 300-800 KB por destino, otros 3 assets, y hay que
  coordinarlos con el zoom (o lo reemplazan). Va a `TASK.md` como idea, no a este tramo.
- Nada de 3D real ni texturas nuevas.

## 5. Riesgo
| Riesgo | Cobertura |
|---|---|
| 2,5 s se sienten lentos al que ya vio la animación | Es un número: se baja a 1,8 s sin tocar nada más. Se prueba en celular |
| Con reduced-motion queda raro | Esa rama mantiene el comportamiento de hoy |
| El sonido molesta | Archivo aparte, se borra la línea y listo |
