import { useRef, useState } from 'react'
import Starfield from './components/Starfield'
import { evento } from './evento'
import './styles/portada.css'

type Fase = 'idle' | 'warp' | 'flash' | 'revelado'

export default function App() {
  const [fase, setFase] = useState<Fase>('idle')
  const videoRef = useRef<HTMLVideoElement>(null)
  const terminado = useRef(false)

  /** Cierra la inmersión: flash -> portada. Idempotente. */
  function entrar() {
    if (terminado.current) return
    terminado.current = true
    videoRef.current?.pause()
    setFase('flash')
    window.setTimeout(() => setFase('revelado'), 620)
  }

  function iniciar() {
    if (fase !== 'idle') return
    terminado.current = false
    setFase('warp')

    const v = videoRef.current
    if (!v) return

    // El click ES el gesto que habilita audio. Si aun asi falla
    // (ahorro de bateria de iOS, autoplay bloqueado), caemos a CSS.
    v.currentTime = 0
    const p = v.play()
    if (p && typeof p.catch === 'function') {
      p.catch(() => window.setTimeout(entrar, 1200))
    }
  }

  const enViaje = fase === 'warp' || fase === 'flash'

  return (
    <main className={`stage ${fase === 'revelado' ? 'is-revealed' : ''}`}>
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
        <button className="cta" onClick={iniciar} aria-label={`${evento.cta} — reproducir animación`}>
          <span>{evento.cta}</span>
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

      {/* Etapa 2 · Inmersión: solo se monta al tocar el CTA (ahorra datos). */}
      {enViaje && (
        <div className={`warp ${fase === 'flash' ? 'is-flash' : ''}`} aria-hidden="true">
          <video
            ref={videoRef}
            className="warp-video"
            src="/media/warp.mp4"
            poster="/media/poster.webp"
            playsInline
            preload="auto"
            muted={false}
            onTimeUpdate={(e) => {
              if (e.currentTarget.currentTime >= evento.corteVideoSegundos) entrar()
            }}
            onEnded={entrar}
            onError={entrar}
          />
          <button className="skip" onClick={entrar} type="button">
            Saltar
          </button>
        </div>
      )}
    </main>
  )
}
