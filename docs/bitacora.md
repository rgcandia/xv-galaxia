# Bitácora

> El diario del proyecto: qué pasó, cuándo, con qué commit. **Una línea por tramo.** No es `AHORA.md`
> (ese es el estado; este es el registro). No pasa de ~500 líneas: si crece, se rota a un archivo por mes.

| Fecha | Qué | Commit |
|---|---|---|
| 2026-11-21 | **Relevamiento del Drive.** Se listó la carpeta "Tarjeta Invitación Digital": 1 Google Doc de spec ("Temática Espacial"), `img/galaxia-mobile.jpg` (768×1344) y `img/galaxia-desktop.jpg` (1344×768). El `video/image_20261121_094446.mp4` **no se pudo descargar** (404 en 4 endpoints distintos, thumbnail 500). Se bajaron las dos imágenes y la spec a texto. | — |
| 2026-11-21 | **Análisis y plan.** Se leyó la spec completa, se detectaron 9 riesgos (WebGL en WebView, Lenis, peso, autoplay, URL con datos, copyright, imagen 768, impersonal) y 8 huecos de material. Se propuso la arquitectura: 2.5D en vez de 3D, scroll nativo, RSVP en Apps Script + Sheet, Cloudflare Pages, presupuesto de peso. Se escribieron [`analisis-material-2026-11-21.md`](analisis-material-2026-11-21.md) y [`plan-invitacion-xv-2026-11-21.md`](plan-invitacion-xv-2026-11-21.md). | `fcb7dcb` (análisis inicial) |
| 2026-11-21 | **`F0` · setup aislado.** Carpeta `xv-galaxia/` con git propio, Vite 8 + React 19 + TS, tokens de diseño de la paleta, puerto **5199** con `strictPort`. Build verde: 71 KB gzip de JS. Sin tocar ningún otro proyecto. | `fcb7dcb` |
| 2026-11-21 | **Prototipo de `F1` (congelado por pedido del usuario).** Portada con imagen 9:16, respiración cósmica, campo de estrellas en Canvas 2D (0 dependencias) y CTA "Iniciar viaje". **No se continúa** hasta autorización. | `fcb7dcb` |
| 2026-11-21 | **Estructura de documentación.** Se copiaron las convenciones de `portal-norbridge`: `AGENTS.md` (archivo principal que lee la IA), `AHORA.md`, `TASK.md`, `docs/README.md` como puerta de entrada, `decisiones.md` (`D-01…D-14`), `bitacora.md` y `entornos.md`. El plan se reescribió con fases `F0…F7` y «terminado cuando». | _(este commit)_ |
