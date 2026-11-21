/**
 * Loader "Preparando el viaje" (plan-carga tramo C5).
 *
 * Reglas (D-29):
 *  · No aparece si todo cargó rápido: el que decide es App (`visible`).
 *  · Nunca bloquea: a los 8 s App lo cierra igual (red de seguridad).
 *  · Progreso REAL por bytes, con los pesos conocidos del build: Cloudflare no
 *    manda Content-Length, así que no se puede medir desde la respuesta.
 *  · Respeta prefers-reduced-motion: sin órbita girando, barra quieta.
 */
export default function Loader({ progreso, visible }: { progreso: number; visible: boolean }) {
  const pct = Math.max(0, Math.min(100, Math.round(progreso)))

  return (
    <div className={`cargador ${visible ? 'is-on' : ''}`} aria-hidden={!visible}>
      <div className="cargador-orbita" aria-hidden="true">
        <span className="cargador-nucleo" />
        <span className="cargador-luna" />
      </div>

      <p className="cargador-texto">Preparando el viaje</p>

      <div
        className="cargador-barra"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Cargando"
      >
        <span style={{ width: `${pct}%` }} />
      </div>

      <p className="cargador-pct">{pct}%</p>
    </div>
  )
}
