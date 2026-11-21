/**
 * Fuente única de verdad del evento (D-15).
 * Cambiar el nombre, la fecha o el lugar = editar SOLO este archivo.
 *
 * 🟡 PROVISIONAL: nombre y fecha pueden cambiar (pedido del usuario, 2026-11-21).
 * Cuando se confirmen, se actualiza acá y se borra el flag `provisional`.
 */
export const evento = {
  /** Nombre corto: el que va grande en la portada. */
  nombre: 'Tiana',
  /** Nombre completo (para el pie legal y el título de la página). */
  nombreCompleto: 'Tiana Anahí González Candia',

  /** Fecha del evento (ISO). Provisional. */
  fechaISO: '2027-02-02',
  /** Cómo se muestra la fecha en pantalla. */
  fechaTexto: '2 de febrero',
  /** Año, separado para poder mostrarlo chico. */
  anio: '2027',

  /** Línea chica de arriba. */
  eyebrow: 'Una noche en el cosmos',
  /** Título grande. */
  titulo: 'Mis 15',
  /** Texto del botón principal. */
  cargando: 'Preparando el viaje',
  cta: 'Iniciar viaje',

  /**
   * Segundo del video en el que se dispara el flash y se entra a la portada.
   * El video dura 10.24 s. A 7.5 s deja respirar el final del audio sin que
   * la intro se haga larga. Poner 10.24 para usarlo completo.
   */
  corteVideoSegundos: 7.5,

  /* ─────────────────────────────────────────────────────────────
     🟡 DATOS INVENTADOS (placeholder). Cambiar acá y nada más.
     ───────────────────────────────────────────────────────────── */
  regalos: {
    /** Alias para transferencias. */
    alias: 'Mimi.Maffin',
    /** Titular de la cuenta. */
    titular: 'a nombre de Thian The GC',
  },

  /** Etapa 3 · secciones. */
  secciones: {
    nucleo: {
      nav: 'Cuándo',
      eyebrow: 'Núcleo',
      titulo: 'Cuándo y dónde',
      hora: '21:00 hs',
      recepcion: 'Recepción a las 20:30',
      lugar: 'Salón Estelar',
      direccion: 'Av. de los Constituyentes 4500, CABA',
      maps: 'https://maps.google.com/?q=Av.+de+los+Constituyentes+4500,+CABA',
    },
    orbita: {
      nav: 'Vestimenta',
      eyebrow: 'Órbita',
      titulo: 'Cómo venir',
      estilo: 'Elegante sport galáctico',
      texto:
        'Negro, azul noche, plata y dorado. Lo que te haga sentir parte del cielo.',
      paleta: ['#0b132b', '#1c2541', '#00f0ff', '#ffd166'],
      aviso: 'El blanco lo reserva Tiana 🤍',
    },
    senal: {
      nav: 'Regalos',
      eyebrow: 'Señal',
      titulo: 'Un mensaje al universo',
      texto: 'Tu presencia es el regalo. Si además querés dejarme algo:',
    },
    pie: 'Te espero para volar juntos.',
  },

  /** 🟡 true mientras los datos no estén confirmados. */
  provisional: true,
} as const
