import { evento } from '../evento'
import './mapa.css'

/**
 * Etapa 3 · El universo. Pantalla de planetas: cada uno lleva a su sección.
 * Hechos con CSS (D-01): 0 KB, nitidos en cualquier pantalla.
 */
export default function Mapa() {
  const p = evento.secciones

  const destinos = [
    { id: 'cuando', nombre: p.nucleo.nav, clase: 'p-nucleo', tamaño: 'lg' },
    { id: 'vestimenta', nombre: p.orbita.nav, clase: 'p-orbita', tamaño: 'md' },
    { id: 'regalos', nombre: p.senal.nav, clase: 'p-senal', tamaño: 'sm' },
  ] as const

  return (
    <section className="mapa" aria-label="Elegí un destino">
      <p className="mapa-eyebrow">El universo</p>
      <h2 className="mapa-titulo">Elegí un destino</h2>

      <div className="orbitas">
        {destinos.map((d) => (
          <a key={d.id} href={`#${d.id}`} className={`destino ${d.tamaño}`}>
            <span className={`planeta ${d.clase}`} aria-hidden="true" />
            <span className="destino-nombre">{d.nombre}</span>
          </a>
        ))}
      </div>

      <p className="mapa-pie">o deslizá hacia abajo</p>
    </section>
  )
}
