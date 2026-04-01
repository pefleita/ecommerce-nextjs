import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createReviewSchema } from '@/lib/validations/product'
import { getSessionForApi } from '@/lib/auth-helpers'
import type { ApiResponse } from '@/types'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Producto requerido' },
        { status: 400 }
      )
    }

    const reviews = await db.review.findMany({
      where: { productId, approved: true },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: reviews })
  } catch (error) {
    console.error('[REVIEWS/GET]', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionForApi()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const parsed = createReviewSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos' },
        { status: 400 }
      )
    }

    const { productId, rating, title, comment } = parsed.data

    const existing = await db.review.findFirst({
      where: { productId, userId: session.user.id },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ya has valorado este producto' },
        { status: 409 }
      )
    }

    const review = await db.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating,
        title,
        comment,
        approved: false,
      },
    })

    return NextResponse.json(
      { success: true, data: review, message: 'Reseña enviada. Pendiente de aprobación.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('[REVIEWS/POST]', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
