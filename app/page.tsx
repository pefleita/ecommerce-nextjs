import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="container py-12">
      <section className="text-center py-16">
        <h1 className="text-4xl font-semibold text-neutral-900 mb-4">
          Bienvenido a Mi Tienda
        </h1>
        <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
          Descubre nuestros productos de calidad con los mejores precios del mercado.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/products">
            <Button size="lg">
              Ver productos
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
          Categorías destacadas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Link
            href="/categories"
            className="bg-white rounded-xl border border-neutral-200 p-6 hover:border-neutral-300 hover:shadow-md transition-all"
          >
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Electrónica
            </h3>
            <p className="text-sm text-neutral-500">
              Los mejores dispositivos tecnológicos
            </p>
          </Link>
          <Link
            href="/categories"
            className="bg-white rounded-xl border border-neutral-200 p-6 hover:border-neutral-300 hover:shadow-md transition-all"
          >
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Ropa
            </h3>
            <p className="text-sm text-neutral-500">
              Moda actualizada para todos
            </p>
          </Link>
          <Link
            href="/categories"
            className="bg-white rounded-xl border border-neutral-200 p-6 hover:border-neutral-300 hover:shadow-md transition-all"
          >
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Hogar
            </h3>
            <p className="text-sm text-neutral-500">
              Todo lo que necesitas para tu casa
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}
