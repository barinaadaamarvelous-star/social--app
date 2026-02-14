'use server'

export async function startCheckout() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/checkout`,
    { method: 'POST' }
  )

  const data = await res.json()

  if (!data.url) {
    throw new Error('Checkout failed')
  }

  return data.url
}
