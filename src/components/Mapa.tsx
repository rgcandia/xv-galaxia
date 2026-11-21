import { useEffect, useRef, useState } from 'react'
import { evento } from '../evento'
import type { Vista } from './Universo'
import Fugaces from './Fugaces'
import './mapa.css'

/**
 * Etapa 3 · El universo (plan-universo, tramos U1 + U2).
 *
 * Escena con profundidad: 3 capas de fondo (galaxia desenfocada, estrellas,
 * polvo) que se desplazan distinto con el dedo, y tres cuerpos con
 * significado — Sol (cuándo), Venus (vestimenta), Saturno (regalos).
 * Todo CSS: 0 KB de imágenes nuevas (D-24).
 */
export default function Mapa({ onIr }: { onIr: (v: Vista) => void }) {
  const p = evento.secciones
  const [saliendo, setSaliendo] = useState<Vista | null>(null)
  const ref = useRef<HTMLElement>(null)

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
    setSaliendo(v)
    window.setTimeout(() => onIr(v), 470)
  }

  return (
    <section ref={ref} className={`escena ${saliendo ? 'is-saliendo' : ''}`} aria-label="Elegí un destino">
      {/* Capa 1 · la misma galaxia de la portada, desenfocada y derivando */}
      <div className="capa lejana" aria-hidden="true" />
      {/* Capa 2 · estrellas */}
      <div className="capa media" aria-hidden="true" />
      {/* Fugaces + satélite (capa media) */}
      <Fugaces />
      {/* Capa 3 · polvo cercano */}
      <div className="capa cerca" aria-hidden="true" />

      <header className="escena-texto">
        <p className="mapa-eyebrow">El universo</p>
        <h2 className="mapa-titulo">Elegí un destino</h2>
      </header>

      {/* ☀️ Sol — el dominante, rompe el encuadre por la derecha */}
      <button
        type="button"
        className={`cuerpo sol ${saliendo === 'cuando' ? 'is-elegido' : ''}`}
        onClick={() => viajar('cuando')}
      >
        <span className="astro" aria-hidden="true" />
        <span className="astro-nombre">{p.nucleo.nav}</span>
      </button>

      {/* 🪐 Venus — aureola difusa */}
      <button
        type="button"
        className={`cuerpo venus ${saliendo === 'vestimenta' ? 'is-elegido' : ''}`}
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
        <span className="astro" aria-hidden="true" />
        <span className="astro-nombre">{p.senal.nav}</span>
      </button>
    </section>
  )
}
