import { db } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Categorías - Mi Tienda',
  description: 'Explora todas las categorías de productos',
}

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    where: { active: true, parentId: null },
    orderBy: { name: 'asc' },
    include: {
      children: {
        where: { active: true },
        select: { id: true, name: true, slug: true },
      },
      _count: {
        select: { products: { where: { active: true } } },
      },
    },
  })

  const categoriesFormatted = categories.map(c => ({
    ...c,
    image: c.image ? c.image as string : null,
    productCount: c._count.products,
  }))

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Categorías</h1>

      {categoriesFormatted.length === 0 ? (
        <p className="text-neutral-500">No hay categorías disponibles.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoriesFormatted.map(category => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group block bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all"
            >
              <div className="aspect-[4/3] bg-neutral-100 relative overflow-hidden">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-4xl">📁</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-medium text-neutral-900 group-hover:text-accent-600 transition-colors">
                  {category.name}
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  {category.productCount} producto{category.productCount !== 1 ? 's' : ''}
                </p>
                {category.children.length > 0 && (
                  <p className="text-xs text-neutral-400 mt-2">
                    {category.children.length} subcategoría{category.children.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}