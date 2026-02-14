export const DashboardContract = {
  forbidMetrics() {
    if (process.env.NODE_ENV === 'development') {
      // Intentional no-op — this exists to document intent
    }
  },

  forbidComparisons() {
    if (process.env.NODE_ENV === 'development') {
      // No ranks, no trends, no deltas
    }
  },

  forbidUrgency() {
    if (process.env.NODE_ENV === 'development') {
      // No streaks, no “keep it up”, no reminders
    }
  },
}
