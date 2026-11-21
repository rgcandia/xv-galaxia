import { useEffect, useRef } from 'react'

/**
 * Estrellas fugaces + satélite lento (plan-universo §3.3, tramo U3).
 *
 * Regla de física: las fugaces de una lluvia real son PARALELAS — todas vienen
 * del mismo radiante. Direcciones distintas se leen como error (D-22).
 * Una cada 8-14 s; 1 de cada 5 más brillante y más larga (la irregularidad
 * es lo que la hace creíble). El satélite cruza lento cada 25-40 s.
 * Un solo requestAnimationFrame, se apaga si la pestaña no está visible.
 */
export default function Fugaces() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = cv.getContext('2d')
    if (!ctx) return

    const ANG = (38 * Math.PI) / 180 // radiante: 38° desde arriba-izquierda
    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let vivo = true

    type Meteoro = {
      x: number; y: number; len: number; v: number; vida: number; max: number; grosor: number; brillo: number
    }
    type Satelite = { x: number; y: number; v: number; vida: number; max: number }

    let fugaces: Meteoro[] = []
    let satelites: Satelite[] = []
    let proxFugaz = performance.now() + 1500
    let proxSat = performance.now() + 12000

    function medir() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = cv!.clientWidth
      h = cv!.clientHeight
      cv!.width = Math.floor(w * dpr)
      cv!.height = Math.floor(h * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function lanzarFugaz() {
      const fuerte = Math.random() < 0.2 // 1 de cada 5
      const len = fuerte ? 210 + Math.random() * 90 : 90 + Math.random() * 80
      // nacen arriba y a la izquierda del centro; algunas fuera de cuadro
      const x = Math.random() * w * 1.1 - w * 0.25
      const y = -40 + Math.random() * h * 0.45
      fugaces.push({
        x,
        y,
        len,
        v: (fuerte ? 900 : 620) + Math.random() * 220,
        vida: 0,
        max: fuerte ? 0.95 : 0.5 + Math.random() * 0.35,
        grosor: fuerte ? 4.2 : 2.4,
        brillo: fuerte ? 1 : 0.55 + Math.random() * 0.3,
      })
    }

    function lanzarSatelite() {
      const izq = Math.random() < 0.5
      satelites.push({
        x: izq ? -20 : w + 20,
        y: h * (0.15 + Math.random() * 0.55),
        v: (izq ? 1 : -1) * (16 + Math.random() * 10),
        vida: 0,
        max: (w + 40) / 20,
      })
    }

    function frame(t: number) {
      if (!vivo) return
      ctx!.clearRect(0, 0, w, h)

      if (t > proxFugaz) {
        lanzarFugaz()
        proxFugaz = t + 8000 + Math.random() * 6000
      }
      if (t > proxSat) {
        lanzarSatelite()
        proxSat = t + 25000 + Math.random() * 15000
      }

      const dt = 1 / 60

      for (const m of fugaces) {
        m.vida += dt
        m.x += Math.cos(ANG) * m.v
        m.y += Math.sin(ANG) * m.v
        const k = 1 - m.vida / m.max
        if (k <= 0) continue
        const tx = m.x - Math.cos(ANG) * m.len
        const ty = m.y - Math.sin(ANG) * m.len
        const g = ctx!.createLinearGradient(m.x, m.y, tx, ty)
        g.addColorStop(0, `rgba(255,255,255,${0.95 * k * m.brillo})`)
        g.addColorStop(0.4, `rgba(200,235,255,${0.35 * k * m.brillo})`)
        g.addColorStop(1, 'rgba(160,210,255,0)')
        ctx!.strokeStyle = g
        ctx!.lineWidth = m.grosor
        ctx!.lineCap = 'round'
        ctx!.beginPath()
        ctx!.moveTo(m.x, m.y)
        ctx!.lineTo(tx, ty)
        ctx!.stroke()
      }
      fugaces = fugaces.filter((m) => m.vida < m.max && m.x < w + 320 && m.y < h + 320)

      for (const s of satelites) {
        s.vida += dt
        s.x += s.v * dt
        ctx!.fillStyle = 'rgba(220,240,255,0.55)'
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, 1.6, 0, Math.PI * 2)
        ctx!.fill()
        ctx!.fillStyle = 'rgba(160,210,255,0.10)'
        ctx!.beginPath()
        ctx!.arc(s.x - Math.sign(s.v) * 6, s.y, 2.2, 0, Math.PI * 2)
        ctx!.fill()
      }
      satelites = satelites.filter((s) => s.x > -40 && s.x < w + 40)

      raf = requestAnimationFrame(frame)
    }

    medir()
    raf = requestAnimationFrame(frame)
    window.addEventListener('resize', medir)

    const vis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
      } else {
        raf = requestAnimationFrame(frame)
      }
    }
    document.addEventListener('visibilitychange', vis)

    return () => {
      vivo = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', medir)
      document.removeEventListener('visibilitychange', vis)
    }
  }, [])

  return <canvas ref={ref} className="fugaces" aria-hidden="true" />
}
