'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Review {
  id: string
  rating: number
  title?: string | null
  comment?: string | null
  createdAt: Date
  user: {
    firstName: string
    lastName: string
  }
}

interface ProductReviewsProps {
  reviews: Review[]
  productId: string
  avgRating: number
}

export function ProductReviews({ reviews, productId, avgRating }: ProductReviewsProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) {
      setError('Selecciona una calificación')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, title, comment }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error)
        return
      }

      setSuccess(true)
      setRating(0)
      setTitle('')
      setComment('')
    } catch {
      setError('Error al enviar la reseña')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <h2 className="text-xl font-semibold text-neutral-900 mb-6">Reseñas</h2>

      {reviews.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-bold text-neutral-900">{avgRating.toFixed(1)}</span>
            <div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`text-lg ${star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-neutral-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-neutral-500">{reviews.length} reseñas</p>
            </div>
          </div>
        </div>
      )}

      {status === 'authenticated' && !success && (
        <form onSubmit={handleSubmit} className="bg-neutral-50 rounded-xl p-6 mb-8">
          <h3 className="font-medium text-neutral-900 mb-4">Escribe una reseña</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Calificación
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl transition-colors"
                >
                  <span className={star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-neutral-300'}>
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
              Título (opcional)
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={100}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-neutral-700 mb-1">
              Comentario (opcional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={e => setComment(e.target.value)}
              maxLength={1000}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-accent-600 text-white text-sm font-medium rounded-lg hover:bg-accent-700 disabled:opacity-50"
          >
            {submitting ? 'Enviando...' : 'Enviar reseña'}
          </button>
        </form>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-8">
          ¡Gracias! Tu reseña ha sido enviada y está pendiente de aprobación.
        </div>
      )}

      {status === 'unauthenticated' && (
        <p className="text-sm text-neutral-500 mb-8">
          <a href="/login" className="text-accent-600 hover:underline">Inicia sesión</a> para escribir una reseña.
        </p>
      )}

      {reviews.length === 0 ? (
        <p className="text-neutral-500">Aún no hay reseñas para este producto.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <article key={review.id} className="border-b border-neutral-100 pb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-neutral-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm font-medium text-neutral-900">
                  {review.user.firstName} {review.user.lastName}
                </span>
              </div>
              {review.title && (
                <p className="font-medium text-neutral-900 mb-1">{review.title}</p>
              )}
              {review.comment && (
                <p className="text-sm text-neutral-600">{review.comment}</p>
              )}
              <p className="text-xs text-neutral-400 mt-2">
                {new Date(review.createdAt).toLocaleDateString('es-ES')}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
