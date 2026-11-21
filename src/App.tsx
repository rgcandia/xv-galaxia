import { useEffect, useRef, useState } from 'react'
import Starfield from './components/Starfield'
import Mapa from './components/Mapa'
import Universo, { type Vista } from './components/Universo'
import { evento } from './evento'
import './styles/portada.css'

type Fase = 'idle' | 'warp' | 'flash' | 'revelado'

export default function App() {
  const [fase, setFase] = useState<Fase>('idle')
  const [vista, setVista] = useState<Vista>('mapa')
  const videoRef = useRef<HTMLVideoElement>(null)
  const terminado = useRef(false)
  const failsafe = useRef<number | null>(null)

  const enViaje = fase === 'warp' || fase === 'flash'

  /* C4 · Precarga silenciosa. Hoy el invitado se queda leyendo la portada un
     par de segundos y ese tiempo se desperdicia: acá lo usamos para bajar los
     planetas y el video. Se espera 1,2 s para no competir con el primer
     pintado. Si el navegador avisa "ahorro de datos", el video NO se precarga. */
  useEffect(() => {
    const t = window.setTimeout(() => {
      for (const src of ['/media/sol.avif', '/media/venus.avif']) {
        const img = new Image()
        img.src = src
      }
      const ahorro = (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData
      const v = videoRef.current
      if (v && !ahorro && v.preload !== 'auto') {
        v.preload = 'auto'
        v.load()
      }
    }, 1200)
    return () => window.clearTimeout(t)
  }, [])

  /** Cierra la inmersión: flash -> portada. Idempotente. */
  function entrar() {
    if (terminado.current) return
    terminado.current = true
    if (failsafe.current) window.clearTimeout(failsafe.current)
    videoRef.current?.pause()
    setFase('flash')
    window.setTimeout(() => setFase('revelado'), 620)
  }

  function iniciar() {
    if (enViaje) return
    terminado.current = false
    const v = videoRef.current
    if (!v) return

    // IMPORTANTE: el <video> está siempre montado (oculto), así el play()
    // ocurre DENTRO del gesto del usuario -> iOS permite el audio.
    try {
      v.currentTime = 0
    } catch {
      /* si todavía no hay metadata, el play() de abajo lo resuelve */
    }
    setFase('warp')

    const p = v.play()
    if (p && typeof p.catch === 'function') {
      p.catch(() => window.setTimeout(entrar, 1100))
    }

    // Red de seguridad: si el video no avanza (buffer lento, códec raro),
    // no dejamos al invitado mirando un cartel negro.
    if (failsafe.current) window.clearTimeout(failsafe.current)
    failsafe.current = window.setTimeout(
      entrar,
      (evento.corteVideoSegundos + 6) * 1000,
    )
  }

  // Sin scroll vertical en ninguna etapa: cada pantalla es 100dvh (plan, Etapa 3).
  useEffect(() => {
    document.body.style.overflow = 'hidden'
  }, [])

  useEffect(() => () => {
    if (failsafe.current) window.clearTimeout(failsafe.current)
  }, [])

  return (
    <>
    {fase !== 'revelado' && (
    <main className="stage">
      <picture className="bg">
        <source
          media="(min-width: 900px)"
          type="image/avif"
          srcSet="/media/galaxia-desktop.avif"
        />
        <source media="(min-width: 900px)" srcSet="/media/galaxia-desktop.webp" />
        <source type="image/avif" srcSet="/media/galaxia-mobile.avif" />
        <img src="/media/galaxia-mobile.webp" alt="" aria-hidden="true" fetchPriority="high" />
      </picture>

      <Starfield />

      <div className="vignette" aria-hidden="true" />

      <header className="top">
        <p className="eyebrow">{evento.eyebrow}</p>
        <h1 className="mis">{evento.titulo}</h1>
        <h2 className="nombre">{evento.nombre}</h2>
      </header>

      <footer className="bottom">
        <button className="cta" onClick={iniciar} aria-label={evento.cta}>
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

      </footer>

      {/* Etapa 2 · Inmersión. Siempre montado, oculto: el play() sale del gesto. */}
      <div className={`warp ${enViaje ? 'is-on' : ''} ${fase === 'flash' ? 'is-flash' : ''}`}>
        <video
          ref={videoRef}
          className="warp-video"
          src="/media/warp.mp4"
          poster="/media/poster.webp"
          playsInline
          preload="none"
          onTimeUpdate={(e) => {
            if (e.currentTarget.currentTime >= evento.corteVideoSegundos) entrar()
          }}
          onEnded={entrar}
          onError={entrar}
        />
        <button className="skip" onClick={entrar} type="button" tabIndex={enViaje ? 0 : -1}>
          Saltar
        </button>
      </div>
    </main>
    )}

    {/* Etapa 3 · aparece recién cuando termina la inmersión. */}
    {fase === 'revelado' &&
      (vista === 'mapa' ? (
        <Mapa onIr={setVista} />
      ) : (
        <Universo vista={vista} onVolver={() => setVista('mapa')} />
      ))}
    </>
  )
}
