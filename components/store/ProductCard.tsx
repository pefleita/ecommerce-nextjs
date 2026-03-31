import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    comparePrice?: number | null
    stock: number
    images: string[]
    category: {
      name: string
    }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : '/placeholder.jpg'

  return (
    <article className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all group">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square overflow-hidden bg-neutral-100">
          <Image
            src={imageUrl}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs text-neutral-500 mb-1">{product.category.name}</p>
        <h3 className="text-sm font-medium text-neutral-900 line-clamp-2 mb-2">
          <Link href={`/products/${product.slug}`} className="hover:text-accent-600">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-semibold text-neutral-900">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-neutral-400 line-through ml-2">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
          {product.stock === 0 && (
            <Badge variant="danger">Sin stock</Badge>
          )}
        </div>
        <Button className="w-full mt-3" size="sm" disabled={product.stock === 0}>
          Agregar al carrito
        </Button>
      </div>
    </article>
  )
}
