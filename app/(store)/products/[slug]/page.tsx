import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { ProductGallery } from '@/components/store/ProductGallery'
import { ProductReviews } from '@/components/store/ProductReviews'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { formatPrice } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await db.product.findUnique({
    where: { slug, active: true },
    select: { name: true, description: true, images: true },
  })

  if (!product) return {}

  const images = product.images as string[]
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: { images: images?.[0] ? [images[0]] : [] },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params

  const product = await db.product.findUnique({
    where: { slug, active: true },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      variants: { where: { active: true } },
      reviews: {
        where: { approved: true },
        include: { user: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  })

  if (!product) notFound()

  const images = product.images as string[]
  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ProductGallery images={images} name={product.name} />

        <div className="space-y-5">
          <nav className="flex items-center gap-1 text-xs text-neutral-500" aria-label="Breadcrumb">
            <a href="/products" className="hover:text-neutral-700">Productos</a>
            <span>/</span>
            <a href={`/categories/${product.category.slug}`} className="hover:text-neutral-700">
              {product.category.name}
            </a>
            <span>/</span>
            <span className="text-neutral-700">{product.name}</span>
          </nav>

          <h1 className="text-2xl font-semibold text-neutral-900">{product.name}</h1>

          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`text-sm ${star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-neutral-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-neutral-500">
                {avgRating.toFixed(1)} ({product.reviews.length} reseñas)
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-neutral-900">
              {formatPrice(Number(product.price))}
            </span>
            {product.comparePrice && (
              <span className="text-lg text-neutral-400 line-through">
                {formatPrice(Number(product.comparePrice))}
              </span>
            )}
          </div>

          <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0
              ? product.stock < 10 ? `¡Solo quedan ${product.stock}!` : 'En stock'
              : 'Sin stock'}
          </p>

          <p className="text-sm text-neutral-600 leading-relaxed">{product.description}</p>

          <AddToCartButton
            product={{
              productId: product.id,
              name: product.name,
              price: Number(product.price),
              image: images?.[0] ?? '',
              slug: product.slug,
              stock: product.stock,
            }}
            disabled={product.stock === 0}
          />
        </div>
      </div>

      <div className="mt-16">
        <ProductReviews
          reviews={product.reviews}
          productId={product.id}
          avgRating={avgRating}
        />
      </div>
    </div>
  )
}
