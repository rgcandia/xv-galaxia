import { useState } from 'react'
import { evento } from '../evento'
import './universo.css'

/** Navegación flotante entre secciones. */
function Nav() {
  const items = [
    ['cuando', evento.secciones.nucleo.nav],
    ['vestimenta', evento.secciones.orbita.nav],
    ['regalos', evento.secciones.senal.nav],
  ]
  return (
    <nav className="nav" aria-label="Secciones">
      {items.map(([id, label]) => (
        <a key={id} href={`#${id}`} className="nav-item">
          {label}
        </a>
      ))}
    </nav>
  )
}

function Titulo({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <>
      <p className="s-eyebrow">{eyebrow}</p>
      <h2 className="s-titulo">{children}</h2>
    </>
  )
}

/** Etapa 3 · Universo. Secciones posteriores a la portada. */
export default function Universo() {
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
    <div className="universo">
      {/* ── Núcleo · cuándo y dónde ─────────────────────────────── */}
      <section id="cuando" className="s">
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
          <a className="mapa" href={nucleo.maps} target="_blank" rel="noreferrer noopener">
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
      </section>

      {/* ── Órbita · vestimenta ─────────────────────────────────── */}
      <section id="vestimenta" className="s">
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
      </section>

      {/* ── Señal · regalos ─────────────────────────────────────── */}
      <section id="regalos" className="s">
        <Titulo eyebrow={senal.eyebrow}>{senal.titulo}</Titulo>

        <div className="card">
          <p className="dato-chico">{senal.texto}</p>
          <p className="alias">{evento.regalos.alias}</p>
          <button className="copiar" onClick={copiarAlias} type="button">
            {copiado ? 'Copiado ✓' : 'Copiar alias'}
          </button>
          <p className="dato-chico">{evento.regalos.titular}</p>
        </div>
      </section>

      <footer className="pie">
        <p>{evento.nombreCompleto}</p>
        <p className="pie-nota">{evento.secciones.pie}</p>
      </footer>

      <Nav />
    </div>
  )
}
