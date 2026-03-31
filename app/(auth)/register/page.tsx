'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  firstName: z.string().min(2, 'Mínimo 2 caracteres').max(50),
  lastName: z.string().min(2, 'Mínimo 2 caracteres').max(50),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe incluir una mayúscula')
    .regex(/[0-9]/, 'Debe incluir un número')
    .regex(/[^a-zA-Z0-9]/, 'Debe incluir un carácter especial'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Error al crear cuenta')
        return
      }

      setSuccess(true)

      const loginRes = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (loginRes?.ok) {
        router.push('/')
        router.refresh()
      } else {
        router.push('/login')
      }
    } catch {
      setError('Error al crear cuenta')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <a href="/" className="text-xl font-semibold text-neutral-900">Mi Tienda</a>
          <h1 className="text-2xl font-semibold text-neutral-900 mt-6 mb-1">
            Crear cuenta
          </h1>
          <p className="text-sm text-neutral-500">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="text-accent-600 hover:text-accent-700 font-medium">
              Iniciar sesión
            </a>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="firstName"
                label="Nombre"
                autoComplete="given-name"
                required
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                id="lastName"
                label="Apellido"
                autoComplete="family-name"
                required
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>

            <Input
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              required
              placeholder="tu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              id="password"
              label="Contraseña"
              type="password"
              autoComplete="new-password"
              required
              hint="Mínimo 8 caracteres, mayúscula, número y carácter especial"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              id="confirmPassword"
              label="Confirmar contraseña"
              type="password"
              autoComplete="new-password"
              required
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {error && (
              <p role="alert" className="text-sm text-danger-600 bg-danger-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            {success && (
              <p role="status" className="text-sm text-success-600 bg-success-50 px-3 py-2 rounded-lg">
                Cuenta creada. Iniciando sesión...
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
              Crear cuenta
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
