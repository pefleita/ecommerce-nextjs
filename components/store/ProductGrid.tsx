'use client'

import { clonePageVaryPathWithNewSearchParams } from 'next/dist/client/components/segment-cache/vary-path'
import { ProductCard } from './ProductCard'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  stock: number
  images: string[]
  category: {
    id: string
    name: string
    slug: string
  }
}

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="text-neutral-500 text-center py-8">No hay productos para mostrar.</p>
    )
  }

  console.log(products);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
