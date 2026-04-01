import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { ProductGrid } from '@/components/store/ProductGrid'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    page?: string
    perPage?: string
    sort?: string
    inStock?: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await db.category.findUnique({
    where: { slug, active: true },
  })

  if (!category) return {}

  return {
    title: `${category.name} - Mi Tienda`,
    description: `Explora nuestra colección de productos en ${category.name}`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const search = await searchParams
  const page = parseInt(search.page ?? '1')
  const perPage = parseInt(search.perPage ?? '20')
  const sort = search.sort ?? 'newest'
  const inStock = search.inStock === 'true'

  const category = await db.category.findUnique({
    where: { slug, active: true },
    include: {
      children: { where: { active: true }, select: { id: true, name: true, slug: true } },
      parent: { select: { id: true, name: true, slug: true } },
    },
  })

  if (!category) notFound()

  const where: any = {
    active: true,
    categoryId: category.id,
  }
  if (inStock) where.stock = { gt: 0 }

  const orderBy: any = {
    newest: { createdAt: 'desc' },
    price_asc: { price: 'asc' },
    price_desc: { price: 'desc' },
  }[sort] ?? { createdAt: 'desc' }

  const [products, total] = await Promise.all([
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
      <nav className="flex items-center gap-1 text-xs text-neutral-500 mb-6" aria-label="Breadcrumb">
        <a href="/products" className="hover:text-neutral-700">Productos</a>
        {category.parent && (
          <>
            <span>/</span>
            <a href={`/categories/${category.parent.slug}`} className="hover:text-neutral-700">
              {category.parent.name}
            </a>
          </>
        )}
        <span>/</span>
        <span className="text-neutral-700">{category.name}</span>
      </nav>

      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">{category.name}</h1>

      {category.children.length > 0 && (
        <div className="mb-8">
          <p className="text-sm font-medium text-neutral-700 mb-3">Subcategorías</p>
          <div className="flex flex-wrap gap-2">
            {category.children.map(child => (
              <a
                key={child.id}
                href={`/categories/${child.slug}`}
                className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                {child.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {productsFormatted.length === 0 ? (
        <p className="text-neutral-500">No hay productos en esta categoría.</p>
      ) : (
        <>
          <p className="text-sm text-neutral-500 mb-4">
            {total} producto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
          </p>
          <ProductGrid products={productsFormatted} />

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <a
                  href={`/categories/${slug}?${new URLSearchParams({
                    page: String(page - 1),
                    sort: search.sort ?? '',
                    inStock: search.inStock ?? '',
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
                  href={`/categories/${slug}?${new URLSearchParams({
                    page: String(page + 1),
                    sort: search.sort ?? '',
                    inStock: search.inStock ?? '',
                  }).toString()}`}
                  className="px-3 py-1 border border-neutral-200 rounded hover:bg-neutral-50"
                >
                  Siguiente
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}