import { useState } from 'react'
import Starfield from './components/Starfield'
import { evento } from './evento'
import './styles/portada.css'

export default function App() {
  const [started, setStarted] = useState(false)

  return (
    <main className="stage">
      <picture className="bg">
        <source media="(min-width: 900px)" srcSet="/media/galaxia-desktop.webp" />
        <img src="/media/galaxia-mobile.webp" alt="" aria-hidden="true" />
      </picture>

      <Starfield />

      <div className="vignette" aria-hidden="true" />

      <header className="top">
        <p className="eyebrow">{evento.eyebrow}</p>
        <h1 className="mis">{evento.titulo}</h1>
        <h2 className="nombre">{evento.nombre}</h2>
        <p className="fecha">
          {evento.fechaTexto}
          <span className="anio"> · {evento.anio}</span>
        </p>
      </header>

      <footer className="bottom">
        <button
          className="cta"
          onClick={() => {
            // Fase 2: aca arranca video + audio (warping).
            setStarted((v) => !v)
          }}
        >
          <span>{started ? 'Iniciando viaje…' : evento.cta}</span>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M5 12h13m0 0-5-5m5 5-5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <p className="hint">{evento.hint}</p>
      </footer>
    </main>
  )
}
