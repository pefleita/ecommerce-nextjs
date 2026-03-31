import type {
  User, Product, ProductVariant, Order, OrderItem,
  Cart, Coupon, Review, Address, Category,
  ShippingMethod, Role
} from '@prisma/client'

export type ApiResponse<T = void> = {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: PaginationMeta
}

export type PaginationMeta = {
  total: number
  page: number
  perPage: number
  totalPages: number
}

export type CartItem = {
  productId: string
  variantId?: string
  quantity: number
  price: number
  name: string
  image: string
  slug: string
  stock: number
  attributes?: Record<string, string>
}

export type JwtPayload = {
  userId: string
  email: string
  role: Role
  iat: number
  exp: number
}

export type ProductWithCategory = Product & {
  category: Pick<Category, 'id' | 'name' | 'slug'>
  variants?: ProductVariant[]
  reviews?: Pick<Review, 'rating'>[]
}

export type OrderWithItems = Order & {
  items: (OrderItem & { product: Pick<Product, 'name' | 'slug'> })[]
}

export type CheckoutAddress = {
  firstName: string
  lastName: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
}
