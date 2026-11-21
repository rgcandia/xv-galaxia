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
  cta: 'Iniciar viaje',
  /** Aviso chico debajo del botón (con ícono de parlante). */
  hint: 'Con sonido',

  /**
   * Segundo del video en el que se dispara el flash y se entra a la portada.
   * El video dura 10.24 s; cortar a los 6 s deja el mejor tramo sin hacerse largo.
   * Poner 10.24 para usarlo completo.
   */
  corteVideoSegundos: 6,

  /** 🟡 true mientras los datos no estén confirmados. */
  provisional: true,
} as const
