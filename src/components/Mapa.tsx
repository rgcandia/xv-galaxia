import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { evento } from '../evento'
import type { Vista } from './Universo'
import Fugaces from './Fugaces'
import Starfield from './Starfield'
import { medirRincon } from '../lib/rincon'
import './mapa.css'

/* ── S9 · El vuelo, en un solo lugar (ida y vuelta) ────────────────────────
   La ida y la vuelta son el MISMO movimiento con los extremos invertidos:
   mismo arco, misma curva, misma duración. Si cada sentido tuviera su propia
   animación, el regreso se sentiría otro viaje (o peor: un corte). */
const DUR_VUELO = { normal: 1600, reducido: 1000 }

/** smootherstep: arranca y frena SIN aceleración en los extremos. */
function suave(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

/** Clava el cuerpo en el rectángulo que ocupa ahora, en píxeles: así el primer
    cuadro del vuelo es idéntico a lo que se venía viendo y el empalme no puede
    fallar (ni al salir ni al volver). */
function fijar(el: HTMLElement, r: { left: number; top: number; width: number }) {
  el.style.position = 'fixed'
  el.style.left = `${r.left}px`
  el.style.top = `${r.top}px`
  el.style.width = `${r.width}px`
  el.style.right = 'auto'
  el.style.bottom = 'auto'
  el.style.margin = '0'
  el.style.zIndex = '40'
}

/**
 * El recorrido: de (0,0) a (dx,dy) con escala 1 → k, por un arco perpendicular
 * al viaje que se abre y se cierra solo (del lado que se aleja del centro de la
 * pantalla: nunca cruza el texto por encima).
 *
 * S9 · Por qué se muestrea la curva en vez de usar dos tramos de easing: antes
 * había un tramo "acelerar" y otro "frenar" pegados en la mitad, y en ese
 * empalme la velocidad saltaba 2,4× — eso es lo que se sentía brusco. Acá la
 * curva va en los VALORES y el easing es lineal: la velocidad no tiene saltos,
 * el planeta sale suave, viaja y se posa. El último fotograma clava el destino
 * exacto, sin redondeos, para que el empalme cierre.
 */
function animarVuelo(
  el: HTMLElement,
  dx: number,
  dy: number,
  k: number,
  dur: number,
  arco: number,
  opDesde: number,
  opHasta: number,
) {
  const r = el.getBoundingClientRect()
  const L = Math.hypot(dx, dy) || 1
  const px = -dy / L
  const py = dx / L
  const mx = r.left + r.width / 2 + dx / 2 - window.innerWidth / 2
  const my = r.top + r.height / 2 + dy / 2 - window.innerHeight / 2
  const lado = px * mx + py * my >= 0 ? 1 : -1

  const PASOS = 15
  const fotogramas: Keyframe[] = []
  for (let i = 0; i <= PASOS; i++) {
    const e = suave(i / PASOS)
    const desvio = Math.sin(Math.PI * e) * arco * lado
    fotogramas.push({
      transform: `translate3d(${dx * e + px * desvio}px, ${dy * e + py * desvio}px, 0) scale(${
        1 + (k - 1) * e
      })`,
      opacity: opDesde + (opHasta - opDesde) * e,
      easing: 'linear', // la curva ya está en los valores
    })
  }
  fotogramas[PASOS] = {
    transform: `translate3d(${dx}px, ${dy}px, 0) scale(${k})`,
    opacity: opHasta,
  }

  return el.animate(fotogramas, { duration: dur, fill: 'both' })
}

/**
 * Etapa 3 · El universo (plan-universo, tramos U1 + U2).
 *
 * Escena con profundidad: nebulosa + estrellas en canvas + polvo que se
 * desplazan distinto con el dedo, viñeta y grano de acabado, y tres cuerpos
 * con significado — Luna (la cita), Júpiter (el brillo), Saturno (un detalle).
 * Todo CSS + canvas: 0 KB de imágenes nuevas (D-24).
 */
export default function Mapa({
  onIr,
  volverDe = null,
}: {
  onIr: (v: Vista) => void
  volverDe?: Vista | null
}) {
  const p = evento.secciones
  const [saliendo, setSaliendo] = useState<Vista | null>(null)
  /* S9 · La vuelta: `llegando` arranca en null a propósito. Si naciera con el
     valor, el cuerpo ya estaría con `position: fixed` y sin medidas en el
     primer render, y lo que se mediría no sería su lugar real. Se mide el mapa
     quieto (en `useLayoutEffect`, sin llegar a pintarse) y recién ahí se clava
     el cuerpo en el rincón. */
  const [llegando, setLlegando] = useState<Vista | null>(null)
  /* Cuerpo que ya se posó: no vuelve a "entrar" (ver `.en-casa` en mapa.css). */
  const [enCasa, setEnCasa] = useState<Vista | null>(null)
  const ref = useRef<HTMLElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  /* La vuelta se arma UNA vez por montaje. En desarrollo React monta los
     efectos dos veces (StrictMode): sin esta guarda la segunda pasada mediría
     el cuerpo ya clavado en el rincón y el vuelo saldría de cero. */
  const vueltaArmada = useRef(false)

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

  /* ── S9 · La vuelta: el mismo vuelo, al revés ─────────────────────────────
     El destino (el lugar de cada cuerpo en el mapa) sólo existe con el mapa
     montado, así que la vuelta se anima acá y no en la sección. Corre en
     `useLayoutEffect`: se mide y se clava ANTES del primer pintado, así que
     nunca se ve un cuadro con el planeta ya en su lugar y después saltando al
     rincón. Arranca exactamente donde terminó la ida (`medirRincon()` es la
     misma geometría) y se posa sobre el rectángulo real del cuerpo.
     El velo (`div.velo`) es el "apagón" de la ida dado vuelta: mientras el
     planeta vuelve, el negro de la sección se disuelve sobre el mapa. */
  useLayoutEffect(() => {
    if (!volverDe || vueltaArmada.current) return
    vueltaArmada.current = true

    const btn = ref.current?.querySelector<HTMLButtonElement>(`[data-vista="${volverDe}"]`)
    const astro = btn?.querySelector<HTMLElement>('.astro')
    if (!btn || !astro) return

    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dur = reducido ? DUR_VUELO.reducido : DUR_VUELO.normal
    const r = astro.getBoundingClientRect()
    const rincon = medirRincon()

    fijar(btn, { left: rincon.left, top: rincon.top, width: rincon.tam })
    btn.classList.add('is-elegido') // el ancho del `.astro` pasa a 100 % AHORA
    setLlegando(volverDe)

    const dx = r.left + r.width / 2 - (rincon.left + rincon.tam / 2)
    const dy = r.top + r.height / 2 - (rincon.top + rincon.tam / 2)
    const k = r.width / rincon.tam
    const arco = reducido ? 0 : Math.min(90, Math.hypot(dx, dy) * 0.11)

    const anim = animarVuelo(btn, dx, dy, k, dur, arco, 0.9, 1)
    const posar = () => {
      /* Cancelar y soltar en el mismo cuadro (antes de que se pinte): el cuerpo
         vuelve a ser el botón del mapa, sin rastros de la animación. */
      anim.cancel()
      btn.removeAttribute('style')
      setLlegando(null)
      setEnCasa(volverDe)
    }
    anim.finished.then(posar).catch(posar)
    // Se mide una sola vez, al montar: el mapa se re-monta en cada regreso.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
     quedar corto o largo según el equipo.
     S9 · La curva y el arco viven en `animarVuelo()`: ida y vuelta usan el
     mismo movimiento, con los extremos invertidos. */
  function viajar(v: Vista, btn: HTMLButtonElement) {
    if (saliendo || llegando) return

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
    const dur = reducido ? DUR_VUELO.reducido : DUR_VUELO.normal

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
    fijar(btn, r)
    btn.classList.add('is-elegido')
    setSaliendo(v)

    // Del centro del cuerpo al centro del rincón
    const dx = rincon.left + rincon.tam / 2 - (r.left + r.width / 2)
    const dy = rincon.top + rincon.tam / 2 - (r.top + r.height / 2)
    const k = rincon.tam / r.width
    const arco = reducido ? 0 : Math.min(90, Math.hypot(dx, dy) * 0.11)

    /* El rincón dibuja el cuerpo al 90 %: el vuelo termina igual. */
    const anim = animarVuelo(btn, dx, dy, k, dur, arco, 1, 0.9)

    anim.finished.then(() => onIr(v)).catch(() => onIr(v))
  }

  return (
    <section
      ref={ref}
      className={`escena ${saliendo ? 'is-saliendo' : ''} ${volverDe ? 'is-vuelta' : ''}`}
      aria-label="Elegí un destino"
    >
      {/* S9 · El velo de la vuelta: el negro con el que termina la sección se
          disuelve sobre el mapa mientras el planeta viaja de regreso. */}
      {llegando && <div className="velo" aria-hidden="true" />}
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
        data-vista="cuando"
        className={`cuerpo luna ${
          saliendo === 'cuando' || llegando === 'cuando' ? 'is-elegido' : ''
        } ${enCasa === 'cuando' ? 'en-casa' : ''}`}
        onClick={(e) => viajar('cuando', e.currentTarget)}
      >
        <span className="astro" aria-hidden="true" />
        <span className="astro-nombre">{p.nucleo.nav}</span>
      </button>

      {/* 🪐 Júpiter — bandas + Gran Mancha Roja */}
      <button
        type="button"
        data-vista="vestimenta"
        className={`cuerpo jupiter ${
          saliendo === 'vestimenta' || llegando === 'vestimenta' ? 'is-elegido' : ''
        } ${enCasa === 'vestimenta' ? 'en-casa' : ''}`}
        onClick={(e) => viajar('vestimenta', e.currentTarget)}
      >
        <span className="astro" aria-hidden="true" />
        <span className="astro-nombre">{p.orbita.nav}</span>
      </button>

      {/* 💍 Saturno — anillos inclinados con sombra */}
      <button
        type="button"
        data-vista="regalos"
        className={`cuerpo saturno ${
          saliendo === 'regalos' || llegando === 'regalos' ? 'is-elegido' : ''
        } ${enCasa === 'regalos' ? 'en-casa' : ''}`}
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
