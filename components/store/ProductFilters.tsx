'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Button } from '@/components/ui/Button'

interface ProductFiltersProps {
  categories: { id: string; name: string; slug: string }[]
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null) params.delete(key)
    else params.set(key, value)
    params.set('page', '1')
    router.push(`/products?${params.toString()}`)
  }, [router, searchParams])

  const currentCategory = searchParams.get('categoryId')
  const currentSort = searchParams.get('sort') ?? 'newest'
  const inStock = searchParams.get('inStock') === 'true'

  return (
    <aside className="w-56 flex-shrink-0 space-y-6" aria-label="Filtros">
      <div>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
          Ordenar por
        </p>
        <div className="space-y-1">
          {[
            { value: 'newest', label: 'Más recientes' },
            { value: 'price_asc', label: 'Menor precio' },
            { value: 'price_desc', label: 'Mayor precio' },
            { value: 'best_selling', label: 'Más vendidos' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => updateParam('sort', option.value)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                currentSort === option.value
                  ? 'bg-accent-50 text-accent-700 font-medium'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
          Categoría
        </p>
        <div className="space-y-1">
          <button
            onClick={() => updateParam('categoryId', null)}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
              !currentCategory
                ? 'bg-accent-50 text-accent-700 font-medium'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            Todas las categorías
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => updateParam('categoryId', cat.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                currentCategory === cat.id
                  ? 'bg-accent-50 text-accent-700 font-medium'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={inStock}
          onChange={e => updateParam('inStock', e.target.checked ? 'true' : null)}
          className="accent-accent-600 rounded"
        />
        Solo disponibles
      </label>

      <Button variant="ghost" size="sm" onClick={() => router.push('/products')}>
        Limpiar filtros
      </Button>
    </aside>
  )
}
