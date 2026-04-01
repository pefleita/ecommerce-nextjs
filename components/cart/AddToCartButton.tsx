'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'

interface AddToCartButtonProps {
  product: {
    productId: string
    name: string
    price: number
    image: string
    slug: string
    stock: number
  }
  disabled?: boolean
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function addToCart() {
    if (!session) {
      router.push('/login?callbackUrl=/products/' + product.slug)
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.productId,
          quantity: 1,
        }),
      })

      const data = await res.json()

      if (data.success) {
        router.push('/cart')
      } else {
        alert(data.error || 'Error al añadir al carrito')
      }
    } catch {
      alert('Error al añadir al carrito')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={addToCart} disabled={disabled || loading} size="lg" className="w-full">
      {loading ? 'Añadiendo...' : disabled ? 'Sin stock' : 'Añadir al carrito'}
    </Button>
  )
}
