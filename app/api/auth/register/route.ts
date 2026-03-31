import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { db } from '@/lib/db'
import { registerSchema } from '@/lib/validations/auth'
import type { ApiResponse } from '@/types'

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos' },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, password } = parsed.data

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Este email ya está registrado' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const emailVerifyToken = nanoid(32)

    await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        emailVerifyToken,
        role: 'CUSTOMER',
        active: true,
        emailVerified: null,
      },
    })

    return NextResponse.json(
      { success: true, message: 'Cuenta creada. Inicia sesión.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('[AUTH/REGISTER]', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
