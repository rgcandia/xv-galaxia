import { useEffect, useRef, useState } from 'react'
import Starfield from './components/Starfield'
import Mapa from './components/Mapa'
import Universo, { type Vista } from './components/Universo'
import { evento } from './evento'
import './styles/portada.css'

/* C5 · Pesos reales de los assets críticos (bytes exactos del build). Cloudflare
   no manda Content-Length, así que el progreso se mide contra estos números. */
const PESOS_IMG: Array<[string, number]> = [
  ['/media/galaxia-mobile.avif', 53746],
  ['/media/luna.avif', 22965],
  ['/media/jupiter.avif', 6495],
  ['/media/poster.webp', 24134],
  ['/media/saturno.webp', 4486],
]

type Fase = 'idle' | 'warp' | 'flash' | 'revelado'

export default function App() {
  const [fase, setFase] = useState<Fase>('idle')
  const [vista, setVista] = useState<Vista>('mapa')
  const [progreso, setProgreso] = useState(0)
  const [listo, setListo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const terminado = useRef(false)
  const failsafe = useRef<number | null>(null)

  const enViaje = fase === 'warp' || fase === 'flash'

  /* D-51 · Carga mínima visible. Con la red rápida el progreso llegaba a 100 %
     en 200 ms y las estrellas titilaban media vez. 1,3 s alcanza para que se
     vea el movimiento y no se siente una espera inventada. */
  const [minEspera, setMinEspera] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setMinEspera(true), 1300)
    return () => window.clearTimeout(t)
  }, [])

  const puedeEntrar = listo && minEspera

  // Diagnóstico temporal: `?debug` muestra si el navegador pide "movimiento
  // reducido" y cuántas animaciones CSS están vivas. Sin esto estamos
  // adivinando por qué no se ve movimiento en un equipo y sí en otro.
  const [dbg, setDbg] = useState('')

  useEffect(() => {
    if (!window.location.search.includes('debug')) return
    const t = window.setTimeout(() => {
      const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const anims = document.getAnimations ? document.getAnimations().length : -2
      setDbg(`reduce=${reducido ? 'SI' : 'no'} · anim=${anims} · dpr=${window.devicePixelRatio} · ${window.innerWidth}px`)
    }, 1500)
    return () => window.clearTimeout(t)
  }, [])

  /* C5 · Carga con progreso real. El invitado se queda leyendo la portada un
     par de segundos: ese tiempo se usa para bajar los planetas y el video.
     Las imágenes valen 55 % de la barra; el video otro 45 %, y se considera
     completo con 40 % en buffer (la animación dura 7,5 s: se reproduce mientras
     sigue bajando). Si el navegador pide ahorro de datos, el video no se toca. */
  useEffect(() => {
    let vivo = true
    let bytesImg = 0
    let mejorRatio = 0

    const ahorro = (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData
    const pesoVideo = ahorro ? 0 : 45
    const totalImg = PESOS_IMG.reduce((acc, [, peso]) => acc + peso, 0)

    const pintar = () => {
      if (!vivo) return
      const avanceImg = bytesImg / totalImg
      const avanceVideo = Math.min(1, mejorRatio / 0.4)
      setProgreso(Math.min(100, avanceImg * (100 - pesoVideo) + avanceVideo * pesoVideo))
    }

    const imgs = PESOS_IMG.map(([src, peso]) => {
      const img = new Image()
      // onerror también suma: si un asset falla, el invitado no queda trabado
      img.onload = img.onerror = () => {
        bytesImg += peso
        pintar()
      }
      img.src = src
      // decode() fuerza el decodificado antes de que la capa se pinte: sin esto
      // el cuerpo puede aparecer un instante después de entrar a la escena.
      img.decode?.().catch(() => {})
      return img
    })

    const v = videoRef.current
    const onProgress = () => {
      if (!v || !v.duration || !v.buffered.length) return
      const ratio = v.buffered.end(v.buffered.length - 1) / v.duration
      if (ratio > mejorRatio) {
        mejorRatio = ratio
        pintar()
      }
    }

    if (v && !ahorro) {
      v.addEventListener('progress', onProgress)
      v.preload = 'auto'
      v.load()
    } else if (ahorro) {
      mejorRatio = 1
      pintar()
    }

    // Nunca trabar la entrada: a los 8 s se libera igual.
    const rescate = window.setTimeout(() => {
      if (!vivo) return
      setProgreso(100)
      setListo(true)
    }, 8000)

    return () => {
      vivo = false
      window.clearTimeout(rescate)
      v?.removeEventListener('progress', onProgress)
      imgs.forEach((i) => {
        i.onload = null
        i.onerror = null
      })
    }
  }, [])

  useEffect(() => {
    if (progreso >= 99.5) setListo(true)
  }, [progreso])

  /** Cierra la inmersión: flash -> portada. Idempotente. */
  function entrar() {
    if (terminado.current) return
    terminado.current = true
    if (failsafe.current) window.clearTimeout(failsafe.current)
    videoRef.current?.pause()
    setFase('flash')
    window.setTimeout(() => setFase('revelado'), 620)
  }

  function saltar() {
    entrar()
  }

  function iniciar() {
    if (enViaje) return

    // Ya lo saltó en esta sesión: entra directo al universo, sin repetir el viaje.

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

    v.muted = false
    v.volume = 1

    const p = v.play()
    if (p && typeof p.catch === 'function') {
      /* Antes, si el navegador bloqueaba el audio, saltábamos el video entero
         (1,1 s y al universo): en desktop se veía "un zoom roto que desaparece
         sin música". El audio es lo que el navegador bloquea, no el video:
         se reintenta MUDO y el viaje igual se ve. Sólo si también falla se
         saltea. */
      p.catch(() => {
        v.muted = true
        const p2 = v.play()
        if (p2 && typeof p2.catch === 'function') {
          p2.catch(() => window.setTimeout(entrar, 900))
        }
      })
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
        {!puedeEntrar && (
          <div
            className="cta-carga"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progreso)}
            aria-label="Preparando el viaje"
          >
            <span className="cta-carga-texto">{evento.cargando}</span>
            {/* D-58 · Sólo las estrellas: se fue la barra. Sin barra no hay
                medición visible, así que las estrellas ya no marcan el
                progreso real (eso lo hace el `role="progressbar"` de arriba,
                para lectores de pantalla): hacen una ola continua, que es lo
                que comunica "seguí esperando". */}
            <span className="cta-carga-estrellas" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <i key={i} className="estrella" />
              ))}
            </span>
          </div>
        )}

        {puedeEntrar && (
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
        )}

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
        <button className="skip" onClick={saltar} type="button" tabIndex={enViaje ? 0 : -1}>
          Saltar
        </button>
      </div>
    </main>
    )}

    {/* P2 · El aterrizaje: el blanco del flash se disuelve sobre el universo,
        así el paso del video a la escena no corta en seco. */}
    {fase === 'revelado' && vista === 'mapa' && <div className="aterrizaje" aria-hidden="true" />}

    {/* Etapa 3 · aparece recién cuando termina la inmersión. */}
    {fase === 'revelado' &&
      (vista === 'mapa' ? (
        <Mapa onIr={setVista} />
      ) : (
        <Universo vista={vista} onVolver={() => setVista('mapa')} />
      ))}
      {dbg && (
        <div
          style={{
            position: 'fixed',
            left: 8,
            bottom: 8,
            zIndex: 9999,
            font: '11px ui-monospace, monospace',
            color: '#ffd479',
            background: 'rgba(0,0,0,.75)',
            padding: '4px 8px',
            borderRadius: 4,
          }}
        >
          {dbg}
        </div>
      )}
    </>
  )
}
