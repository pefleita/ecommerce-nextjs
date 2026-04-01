import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { productQuerySchema } from '@/lib/validations/product'
import type { ApiResponse } from '@/types'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const parsed = productQuerySchema.safeParse(Object.fromEntries(searchParams))
  
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Parámetros inválidos' },
      { status: 400 }
    )
  }

  const { page, perPage, categoryId, minPrice, maxPrice, inStock, featured, sort, q } = parsed.data

  const where: any = { active: true }
  if (categoryId) where.categoryId = categoryId
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      ...(minPrice !== undefined ? { gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
    }
  }
  if (inStock) where.stock = { gt: 0 }
  if (featured) where.featured = true
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { sku: { contains: q } },
    ]
  }

  const orderBy: any = {
    newest: { createdAt: 'desc' },
    price_asc: { price: 'asc' },
    price_desc: { price: 'desc' },
    best_selling: { orderItems: { _count: 'desc' } },
  }[sort] ?? { createdAt: 'desc' }

  const [total, products] = await Promise.all([
    db.product.count({ where }),
    db.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        reviews: { select: { rating: true }, where: { approved: true } },
      },
    }),
  ])

  return NextResponse.json({
    success: true,
    data: products,
    meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
  })
}
