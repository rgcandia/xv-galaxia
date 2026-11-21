import { useState } from 'react'
import Starfield from './components/Starfield'
import './styles/portada.css'

export default function App() {
  // Placeholders hasta tener los datos reales del evento.
  const nombre = 'Sofía'
  const [started, setStarted] = useState(false)

  return (
    <main className="stage">
      <picture className="bg">
        <source media="(min-width: 900px)" srcSet="/media/galaxia-desktop.jpg" />
        <img src="/media/galaxia-mobile.jpg" alt="" aria-hidden="true" />
      </picture>

      <Starfield />

      <div className="vignette" aria-hidden="true" />

      <header className="top">
        <p className="eyebrow">Una noche en el cosmos</p>
        <h1 className="mis">Mis 15</h1>
        <h2 className="nombre">{nombre}</h2>
      </header>

      <footer className="bottom">
        <button
          className="cta"
          onClick={() => {
            // Fase 2: aqui arranca video + audio (warping).
            setStarted((v) => !v)
          }}
        >
          <span>{started ? 'Iniciando viaje…' : 'Iniciar viaje'}</span>
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
        <p className="hint">Se recomienda ver con sonido</p>
      </footer>
    </main>
  )
}
