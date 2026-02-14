'use client'

export async function redirectToStripeCheckout() {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
  })

  const { url } = await res.json()

  if (url) {
    window.location.href = url
  }
}
