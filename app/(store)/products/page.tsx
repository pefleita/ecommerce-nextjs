import { Suspense } from 'react'
import { db } from '@/lib/db'
import { ProductGrid } from '@/components/store/ProductGrid'
import { ProductFilters } from '@/components/store/ProductFilters'
import { Skeleton } from '@/components/ui/Skeleton'

export const metadata = {
  title: 'Productos - Mi Tienda',
  description: 'Explora nuestra colección de productos',
}

interface Props {
  searchParams: Promise<{
    page?: string
    perPage?: string
    categoryId?: string
    sort?: string
    inStock?: string
    minPrice?: string
    maxPrice?: string
    q?: string
  }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1')
  const perPage = parseInt(params.perPage ?? '20')
  const categoryId = params.categoryId
  const sort = params.sort ?? 'newest'
  const inStock = params.inStock === 'true'
  const q = params.q

  const where: any = { active: true }
  if (categoryId) where.categoryId = categoryId
  if (inStock) where.stock = { gt: 0 }
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ]
  }

  const orderBy: any = {
    newest: { createdAt: 'desc' },
    price_asc: { price: 'asc' },
    price_desc: { price: 'desc' },
    best_selling: { orderItems: { _count: 'desc' } },
  }[sort] ?? { createdAt: 'desc' }

  const [products, total, categories] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    }),
    db.product.count({ where }),
    db.category.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    }),
  ])

  const productsFormatted = products.map(p => ({
    ...p,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
    weight: p.weight ? Number(p.weight) : null,
    images: Array.isArray(p.images) ? p.images as string[] : [],
  }))

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Productos</h1>

      <div className="flex gap-8">
        <ProductFilters categories={categories} />

        <div className="flex-1">
          {products.length === 0 ? (
            <p className="text-neutral-500">No se encontraron productos.</p>
          ) : (
            <>
              <p className="text-sm text-neutral-500 mb-4">
                {total} producto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
              </p>
              <ProductGrid products={productsFormatted} />
            </>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <a
                  href={`/products?${new URLSearchParams({
                    ...params,
                    page: String(page - 1),
                  }).toString()}`}
                  className="px-3 py-1 border border-neutral-200 rounded hover:bg-neutral-50"
                >
                  Anterior
                </a>
              )}
              <span className="px-3 py-1 text-neutral-500">
                Página {page} de {totalPages}
              </span>
              {page < totalPages && (
                <a
                  href={`/products?${new URLSearchParams({
                    ...params,
                    page: String(page + 1),
                  }).toString()}`}
                  className="px-3 py-1 border border-neutral-200 rounded hover:bg-neutral-50"
                >
                  Siguiente
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
