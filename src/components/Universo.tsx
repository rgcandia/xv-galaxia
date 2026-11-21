import { useRef, useState } from 'react'
import { evento } from '../evento'
import './universo.css'

export type Vista = 'mapa' | 'cuando' | 'vestimenta' | 'regalos'

/* S8-b · El cuerpo que vuela y el cuerpo que queda de fondo son EL MISMO:
   mismo `.astro`, mismas capas, mismo terminador. Si el del rincón fuera una
   foto en un cuadrado con `border-radius: 50%`, el empalme mostraría dos
   objetos distintos — y además Saturno perdería el anillo, porque un anillo
   elíptico no entra en un círculo recortado. */
const CUERPO: Record<Vista, string> = {
  mapa: 'luna',
  cuando: 'luna',
  vestimenta: 'jupiter',
  regalos: 'saturno',
}

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
  const [saliendo, setSaliendo] = useState(false)
  const saliendoRef = useRef(false)

  /* S9 · La vuelta empieza acá: la sección se apaga (el texto primero, el cielo
     después) y el planeta del rincón queda solo sobre `#03040a`. Ese es
     exactamente el primer cuadro del mapa cuando vuelve, así que el cambio de
     pantalla no se ve: no hay corte, hay continuidad. El planeta, mientras
     tanto, no se mueve todavía — el viaje de regreso lo anima `Mapa` en cuanto
     monta (ahí es donde existe su lugar de destino). */
  function volver() {
    if (saliendoRef.current) return
    saliendoRef.current = true

    /* El mismo whoosh de la ida, disparado dentro del gesto (iOS no deja sonar
       audio nacido de un `setTimeout`). Si falla, la vuelta no depende del
       sonido. */
    try {
      const a = new Audio('/media/whoosh.m4a')
      a.volume = 0.45
      a.play().catch(() => {})
    } catch {
      /* sin audio */
    }

    setSaliendo(true)
    window.setTimeout(onVolver, 380)
  }

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
    <div className={`universo ${saliendo ? 'is-saliendo' : ''}`} key={vista}>
      <button className="volver" onClick={volver} type="button">
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
          (llegaste a algún lado) y ata cada pantalla a su cuerpo.
          S8-b · Ya no es una foto en un cuadrado: es el mismo cuerpo del mapa,
          al 58 % del ancho, con sus capas y su anillo. El vuelo de `Mapa.tsx`
          termina justo sobre este rectángulo, así que el relevo no se ve. */}
      <div key={vista} className={`planeta-fondo ${CUERPO[vista]}`} aria-hidden="true">
        {/* `.superficie` no es adorno: Saturno NO tiene fondo propio en el
            `.astro` (la cara vive en esta capa para poder quedar entre las dos
            mitades del anillo, L7). Sin esta línea, el rincón mostraba el
            anillo y el agujero del anillo: Saturno llegaba y desaparecía.
            En Luna y Júpiter la clase existe pero no está estilada: no hace nada. */}
        <span className="astro"><span className="superficie" /></span>
      </div>

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
