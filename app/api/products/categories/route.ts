import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { ApiResponse } from '@/types'

export async function GET(req: NextRequest) {
  try {
    const categories = await db.category.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { products: { where: { active: true } } } },
      },
    })

    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error('[PRODUCTS/CATEGORIES]', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
