'use client'

import Link from 'next/link'
import { ShoppingCart, Search, User, Menu } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="container">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="font-semibold text-neutral-900 text-lg tracking-tight">
            Mi Tienda
          </Link>

          <nav className="hidden md:flex items-center gap-6" aria-label="Categorías">
            <Link href="/products" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
              Productos
            </Link>
            <Link href="/categories" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
              Categorías
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Buscar"
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/cart"
              aria-label="Carrito"
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>

            <Link
              href="/account"
              aria-label="Cuenta"
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>

            <button
              type="button"
              aria-label="Menú"
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
