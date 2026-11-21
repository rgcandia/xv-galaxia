import { useState } from 'react'
import { evento } from '../evento'
import './universo.css'

export type Vista = 'mapa' | 'cuando' | 'vestimenta' | 'regalos'

function Titulo({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <>
      <p className="s-eyebrow">{eyebrow}</p>
      <h2 className="s-titulo">{children}</h2>
    </>
  )
}

/**
 * Etapa 3 · Una sección por pantalla (sin scroll vertical).
 * Se entra desde el mapa de planetas y se vuelve con el botón de arriba.
 */
export default function Universo({ vista, onVolver }: { vista: Vista; onVolver: () => void }) {
  const [copiado, setCopiado] = useState(false)
  const { nucleo, orbita, senal } = evento.secciones

  async function copiarAlias() {
    try {
      await navigator.clipboard.writeText(evento.regalos.alias)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 1800)
    } catch {
      /* si el navegador no deja copiar, el alias igual está a la vista */
    }
  }

  return (
    <div className="universo" key={vista}>
      <button className="volver" onClick={onVolver} type="button">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path
            d="M19 12H6m0 0 5-5m-5 5 5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Universo
      </button>

      {/* S1 · El planeta elegido queda de fondo en su sección: cierra el viaje
          (llegaste a algún lado) y ata cada pantalla a su cuerpo. Es la misma
          textura que ya está en caché: no se descarga nada nuevo. */}
      <span className={`planeta-fondo es-${vista}`} aria-hidden="true" />

      <div className="s">
        {vista === 'cuando' && (
          <>
            <Titulo eyebrow={nucleo.eyebrow}>{nucleo.titulo}</Titulo>

            <div className="card">
              <p className="dato-grande">{evento.fechaTexto}</p>
              <p className="dato-medio">{evento.anio}</p>
              <div className="linea" />
              <p className="dato-medio">{nucleo.hora}</p>
              <p className="dato-chico">{nucleo.recepcion}</p>
            </div>

            <div className="card">
              <p className="dato-grande">{nucleo.lugar}</p>
              <p className="dato-chico">{nucleo.direccion}</p>
              <a className="mapa-link" href={nucleo.maps} target="_blank" rel="noreferrer noopener">
                Cómo llegar
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                  <path
                    d="M7 17 17 7M9 7h8v8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </>
        )}

        {vista === 'vestimenta' && (
          <>
            <Titulo eyebrow={orbita.eyebrow}>{orbita.titulo}</Titulo>

            <div className="card">
              <p className="vestimenta">{orbita.estilo}</p>
              <p className="dato-chico">{orbita.texto}</p>

              <div className="paleta" role="list" aria-label="Paleta sugerida">
                {orbita.paleta.map((c) => (
                  <span key={c} className="swatch" style={{ background: c }} role="listitem" />
                ))}
              </div>

              <p className="dato-chico destacado">{orbita.aviso}</p>
            </div>
          </>
        )}

        {vista === 'regalos' && (
          <>
            <Titulo eyebrow={senal.eyebrow}>{senal.titulo}</Titulo>

            <div className="card">
              <p className="dato-chico">{senal.texto}</p>
              <p className="alias">{evento.regalos.alias}</p>
              <button className="copiar" onClick={copiarAlias} type="button">
                {copiado ? 'Copiado ✓' : 'Copiar alias'}
              </button>
              <p className="dato-chico">{evento.regalos.titular}</p>
            </div>

            <p className="pie">{evento.secciones.pie}</p>
          </>
        )}
      </div>
    </div>
  )
}
