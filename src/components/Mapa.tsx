import { useEffect, useRef, useState } from 'react'
import { evento } from '../evento'
import type { Vista } from './Universo'
import Fugaces from './Fugaces'
import Starfield from './Starfield'
import './mapa.css'

/**
 * Etapa 3 · El universo (plan-universo, tramos U1 + U2).
 *
 * Escena con profundidad: nebulosa + estrellas en canvas + polvo que se
 * desplazan distinto con el dedo, viñeta y grano de acabado, y tres cuerpos
 * con significado — Luna (la cita), Júpiter (el brillo), Saturno (un detalle).
 * Todo CSS + canvas: 0 KB de imágenes nuevas (D-24).
 */
export default function Mapa({ onIr }: { onIr: (v: Vista) => void }) {
  const p = evento.secciones
  const [saliendo, setSaliendo] = useState<Vista | null>(null)
  const ref = useRef<HTMLElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  /* Z2 · Whoosh del viaje. Se crea una vez y se reusa. Va acá y no en un
     <audio> del JSX para poder llamar play() DENTRO del gesto del tap (si no,
     iOS lo bloquea). Si falla, se ignora: el viaje no depende del sonido. */
  useEffect(() => {
    const a = new Audio('/media/whoosh.m4a')
    a.preload = 'auto'
    a.volume = 0.45
    audioRef.current = a
    return () => {
      a.pause()
      audioRef.current = null
    }
  }, [])

  /** Parallax suave: cada capa se mueve distinto (si el WebView lo permite). */
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const mover = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2
        const y = (e.clientY / window.innerHeight - 0.5) * 2
        el.style.setProperty('--px', x.toFixed(3))
        el.style.setProperty('--py', y.toFixed(3))
      })
    }
    el.addEventListener('pointermove', mover, { passive: true })
    return () => {
      el.removeEventListener('pointermove', mover)
      cancelAnimationFrame(raf)
    }
  }, [])

  function viajar(v: Vista) {
    if (saliendo) return
    const a = audioRef.current
    if (a) {
      try {
        a.currentTime = 0
      } catch {
        /* sin metadata todavía: play() lo resuelve */
      }
      a.play().catch(() => {
        /* autoplay bloqueado o audio no soportado: se sigue igual */
      })
    }
    setSaliendo(v)
    window.setTimeout(() => onIr(v), 2500)
  }

  return (
    <section ref={ref} className={`escena ${saliendo ? 'is-saliendo' : ''}`} aria-label="Elegí un destino">
      {/* Capa 0 · la misma galaxia de la portada, desenfocada y derivando */}
      <div className="capa lejana" aria-hidden="true" />
      {/* Capa 0-b · nebulosa: la misma foto ampliada y deshecha, sólo suma luz */}
      <div className="capa nebulosa" aria-hidden="true" />
      {/* Capa 1 · estrellas reales (cientos, canvas) con parallax */}
      <div className="capa media" aria-hidden="true">
        <Starfield density={0.00028} />
      </div>
      {/* Fugaces + satélite (capa media) */}
      <Fugaces />
      {/* Capa 2 · polvo cercano */}
      <div className="capa cerca" aria-hidden="true" />
      {/* Capas de acabado: viñeta y grano (mata el look "plano digital") */}
      <div className="vineta" aria-hidden="true" />
      <div className="grano" aria-hidden="true" />

      <header className="escena-texto">
        <p className="mapa-eyebrow">Mi universo</p>
        <h2 className="mapa-titulo">Elegí un destino</h2>
      </header>

      {/* 🌕 Luna — la protagonista: 3× los demás y rompe el encuadre */}
      <button
        type="button"
        className={`cuerpo luna ${saliendo === 'cuando' ? 'is-elegido' : ''}`}
        onClick={() => viajar('cuando')}
      >
        <span className="astro" aria-hidden="true" />
        <span className="astro-nombre">{p.nucleo.nav}</span>
      </button>

      {/* 🪐 Júpiter — bandas + Gran Mancha Roja */}
      <button
        type="button"
        className={`cuerpo jupiter ${saliendo === 'vestimenta' ? 'is-elegido' : ''}`}
        onClick={() => viajar('vestimenta')}
      >
        <span className="astro" aria-hidden="true" />
        <span className="astro-nombre">{p.orbita.nav}</span>
      </button>

      {/* 💍 Saturno — anillos inclinados con sombra */}
      <button
        type="button"
        className={`cuerpo saturno ${saliendo === 'regalos' ? 'is-elegido' : ''}`}
        onClick={() => viajar('regalos')}
      >
        <span className="astro" aria-hidden="true">
          <span className="superficie" />
        </span>
        <span className="astro-nombre">{p.senal.nav}</span>
      </button>
    </section>
  )
}
