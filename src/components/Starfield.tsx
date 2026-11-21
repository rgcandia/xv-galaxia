import { useEffect, useRef } from 'react'

type Star = { x: number; y: number; r: number; a: number; v: number }

/**
 * Campo de estrellas en Canvas 2D (no WebGL): ~0.2ms por frame en gama media.
 * Se usa como capa de parallax barata sobre la imagen de portada, para que la
 * pantalla "respire" sin descargar un video ni arrancar Three.js todavia.
 */
export default function Starfield({ density = 0.00018 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let stars: Star[] = []
    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const seed = () => {
      const count = Math.round(w * h * density)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.25,
        a: Math.random() * 0.6 + 0.25,
        v: Math.random() * 0.06 + 0.01,
      }))
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        // parpadeo suave, desfasado por estrella
        const tw = reduced ? s.a : s.a + Math.sin(t * 0.001 + s.x * 0.05) * 0.22
        ctx.globalAlpha = Math.max(0.05, Math.min(1, tw))
        ctx.fillStyle = s.r > 1.1 ? '#ffffff' : '#cfe3ff'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
        if (!reduced) {
          s.y -= s.v
          if (s.y < -2) {
            s.y = h + 2
            s.x = Math.random() * w
          }
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    resize()
    raf = requestAnimationFrame(draw)

    const onResize = () => resize()
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [density])

  return <canvas ref={ref} className="starfield" aria-hidden="true" />
}
