export const inertia = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },

  fadeUp: {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.45,
      ease: 'easeOut',
    },
  },

  fadeDown: {
    initial: { opacity: 0, y: -6 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.45,
      ease: 'easeOut',
    },
  },
}
