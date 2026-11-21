import { useState } from 'react'
import { evento } from '../evento'
import type { Vista } from './Universo'
import './mapa.css'

/**
 * Etapa 3 · El universo. Pantalla de planetas: cada uno lleva a su sección.
 * Hechos con CSS (D-01): 0 KB, nitidos en cualquier pantalla.
 */
export default function Mapa({ onIr }: { onIr: (v: Vista) => void }) {
  const p = evento.secciones
  const [saliendo, setSaliendo] = useState<Vista | null>(null)

  const destinos: { vista: Vista; nombre: string; clase: string; tamaño: string }[] = [
    { vista: 'cuando', nombre: p.nucleo.nav, clase: 'p-nucleo', tamaño: 'lg' },
    { vista: 'vestimenta', nombre: p.orbita.nav, clase: 'p-orbita', tamaño: 'md' },
    { vista: 'regalos', nombre: p.senal.nav, clase: 'p-senal', tamaño: 'sm' },
  ]

  /** El planeta crece y "te lleva": después del zoom, cambia de pantalla. */
  function viajar(v: Vista) {
    if (saliendo) return
    setSaliendo(v)
    window.setTimeout(() => onIr(v), 430)
  }

  return (
    <section className={`mapa ${saliendo ? 'is-saliendo' : ''}`} aria-label="Elegí un destino">
      <p className="mapa-eyebrow">El universo</p>
      <h2 className="mapa-titulo">Elegí un destino</h2>

      <div className="orbitas">
        {destinos.map((d) => (
          <button
            key={d.vista}
            type="button"
            className={`destino ${d.tamaño} ${saliendo === d.vista ? 'is-elegido' : ''}`}
            onClick={() => viajar(d.vista)}
          >
            <span className={`planeta ${d.clase}`} aria-hidden="true" />
            <span className="destino-nombre">{d.nombre}</span>
          </button>
        ))}
      </div>

      <p className="mapa-pie">elegí un planeta para viajar</p>
    </section>
  )
}
