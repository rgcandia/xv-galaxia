import { useEffect, useRef, useState } from 'react'
import { evento } from '../evento'
import type { Vista } from './Universo'
import Fugaces from './Fugaces'
import Starfield from './Starfield'
import { medirRincon } from '../lib/rincon'
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

  /* ── S8 · El viaje: el cuerpo no se acerca, se VA ─────────────────────────
     Antes: el cuerpo se escalaba 12× hasta llenar la pantalla y después la
     sección aparecía con OTRO planeta en el rincón. Dos objetos y un corte en
     el medio — se leía como scroll.
     Ahora: se fija el cuerpo donde está (en píxeles), se mide el rincón de
     destino y se interpola entre esos dos rectángulos reales. Un solo cuerpo,
     continuo, y el tamaño final no se adivina: se calcula. El recorrido es un
     arco (desvío perpendicular) porque una recta se lee como "arrastre" y un
     arco se lee como "vuelo".
     El corte lo cierra el fin de la animación, no un `setTimeout` que puede
     quedar corto o largo según el equipo. */
  function viajar(v: Vista, btn: HTMLButtonElement) {
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

    const astro = btn.querySelector<HTMLElement>('.astro')
    /* D-63 · Con movimiento reducido el viaje es el MISMO recorrido, más
       corto. Nunca otro recorrido: cambiar la geometría es lo que rompió el
       empalme tres veces (D-56, D-60, D-62). */
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dur = reducido ? 900 : 1400

    if (!astro) {
      setSaliendo(v)
      window.setTimeout(() => onIr(v), dur)
      return
    }

    const r = astro.getBoundingClientRect()
    const rincon = medirRincon()

    /* Fijado en el lugar exacto que ocupaba: `left/top/width` en píxeles y no
       una clase con medidas en vw — así el primer cuadro del vuelo es idéntico
       al último del mapa y el empalme no puede fallar. */
    btn.style.position = 'fixed'
    btn.style.left = `${r.left}px`
    btn.style.top = `${r.top}px`
    btn.style.width = `${r.width}px`
    btn.style.right = 'auto'
    btn.style.bottom = 'auto'
    btn.style.margin = '0'
    btn.style.zIndex = '40'
    btn.classList.add('is-elegido')
    setSaliendo(v)

    // Del centro del cuerpo al centro del rincón
    const dx = rincon.left + rincon.tam / 2 - (r.left + r.width / 2)
    const dy = rincon.top + rincon.tam / 2 - (r.top + r.height / 2)
    const k = rincon.tam / r.width

    /* Lado del arco: perpendicular al recorrido, del lado que se aleja del
       centro de la pantalla. Si el planeta sale del borde, se va hacia afuera;
       si sale del centro, también. Nunca cruza el texto por encima. */
    const L = Math.hypot(dx, dy) || 1
    const px = -dy / L
    const py = dx / L
    const mx = r.left + r.width / 2 + dx / 2 - window.innerWidth / 2
    const my = r.top + r.height / 2 + dy / 2 - window.innerHeight / 2
    const lado = px * mx + py * my >= 0 ? 1 : -1
    const arco = reducido ? 0 : Math.min(90, L * 0.11)

    const anim = btn.animate(
      [
        {
          transform: 'translate(0, 0) scale(1)',
          opacity: 1,
          offset: 0,
          easing: 'cubic-bezier(.42, 0, .78, .58)', // sale: acelera
        },
        {
          transform: `translate(${dx * 0.46 + px * arco * lado}px, ${
            dy * 0.46 + py * arco * lado
          }px) scale(${1 + (k - 1) * 0.34})`,
          opacity: 1,
          offset: 0.46,
          easing: 'cubic-bezier(.12, .55, .22, 1)', // llega: frena
        },
        {
          // el planeta del rincón vive al 90 %: el vuelo termina igual
          transform: `translate(${dx}px, ${dy}px) scale(${k})`,
          opacity: 0.9,
          offset: 1,
        },
      ],
      { duration: dur, fill: 'both' },
    )

    anim.finished.then(() => onIr(v)).catch(() => onIr(v))
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
        onClick={(e) => viajar('cuando', e.currentTarget)}
      >
        <span className="astro" aria-hidden="true" />
        <span className="astro-nombre">{p.nucleo.nav}</span>
      </button>

      {/* 🪐 Júpiter — bandas + Gran Mancha Roja */}
      <button
        type="button"
        className={`cuerpo jupiter ${saliendo === 'vestimenta' ? 'is-elegido' : ''}`}
        onClick={(e) => viajar('vestimenta', e.currentTarget)}
      >
        <span className="astro" aria-hidden="true" />
        <span className="astro-nombre">{p.orbita.nav}</span>
      </button>

      {/* 💍 Saturno — anillos inclinados con sombra */}
      <button
        type="button"
        className={`cuerpo saturno ${saliendo === 'regalos' ? 'is-elegido' : ''}`}
        onClick={(e) => viajar('regalos', e.currentTarget)}
      >
        <span className="astro" aria-hidden="true">
          <span className="superficie" />
        </span>
        <span className="astro-nombre">{p.senal.nav}</span>
      </button>
    </section>
  )
}
