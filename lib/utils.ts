import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(amount: number | string, currency = 'USD'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(num)
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function paginate<T>(
  items: T[],
  page: number,
  perPage: number
): { items: T[]; total: number; totalPages: number } {
  const total = items.length
  const totalPages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  return { items: items.slice(start, start + perPage), total, totalPages }
}

export function safeJson<T>(value: string, fallback: T): T {
  try { return JSON.parse(value) as T }
  catch { return fallback }
}
