import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-neutral-900 mb-3">Mi Tienda</h3>
            <p className="text-sm text-neutral-500">
              Tu tienda online de confianza
            </p>
          </div>

          <div>
            <h4 className="font-medium text-neutral-900 mb-3">Productos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm text-neutral-600 hover:text-neutral-900">
                  Ver todo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-neutral-900 mb-3">Cuenta</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/account" className="text-sm text-neutral-600 hover:text-neutral-900">
                  Mi cuenta
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-sm text-neutral-600 hover:text-neutral-900">
                  Mis pedidos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-neutral-900 mb-3">Ayuda</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-sm text-neutral-600 hover:text-neutral-900">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-8 pt-8">
          <p className="text-xs text-neutral-500 text-center">
            © 2025 Mi Tienda. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
