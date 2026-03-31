import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/Providers"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Mi Tienda",
  description: "Tu tienda online de confianza",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-50">
        <Suspense fallback={null}>
          <Providers>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </Suspense>
      </body>
    </html>
  )
}
