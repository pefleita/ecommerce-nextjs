import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  const adminHash = await bcrypt.hash('Admin1234!', 12)
  const admin = await db.user.upsert({
    where: { email: 'admin@tienda.com' },
    update: {},
    create: {
      email: 'admin@tienda.com',
      passwordHash: adminHash,
      firstName: 'Admin',
      lastName: 'Tienda',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  const electronics = await db.category.upsert({
    where: { slug: 'electronica' },
    update: {},
    create: { name: 'Electrónica', slug: 'electronica', sortOrder: 1 },
  })
  const clothing = await db.category.upsert({
    where: { slug: 'ropa' },
    update: {},
    create: { name: 'Ropa', slug: 'ropa', sortOrder: 2 },
  })
  const home = await db.category.upsert({
    where: { slug: 'hogar' },
    update: {},
    create: { name: 'Hogar', slug: 'hogar', sortOrder: 3 },
  })

  const products = [
    {
      name: 'Auriculares inalámbricos Pro',
      slug: 'auriculares-inalambricos-pro',
      description: 'Auriculares Bluetooth con cancelación activa de ruido, 30 horas de batería y sonido Hi-Fi.',
      price: 79.99,
      comparePrice: 99.99,
      stock: 50,
      images: ['https://placehold.co/800x800/f4f4f5/27272a?text=Auriculares'],
      categoryId: electronics.id,
      weight: 0.3,
      featured: true,
      sku: 'AUR-PRO-001',
    },
    {
      name: 'Camiseta premium algodón',
      slug: 'camiseta-premium-algodon',
      description: 'Camiseta 100% algodón orgánico de comercio justo. Disponible en múltiples colores.',
      price: 24.99,
      stock: 200,
      images: ['https://placehold.co/800x800/f4f4f5/27272a?text=Camiseta'],
      categoryId: clothing.id,
      weight: 0.2,
      sku: 'CAM-ORG-001',
    },
    {
      name: 'Lámpara de escritorio LED',
      slug: 'lampara-escritorio-led',
      description: 'Lámpara con 5 niveles de brillo, temperatura de color ajustable y puerto USB de carga.',
      price: 39.99,
      stock: 80,
      images: ['https://placehold.co/800x800/f4f4f5/27272a?text=Lámpara'],
      categoryId: home.id,
      weight: 0.8,
      sku: 'LAM-LED-001',
    },
  ]

  for (const product of products) {
    await db.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  const shippingMethods = [
    { name: 'Envío estándar', description: '3-5 días hábiles', cost: 5.99, minDays: 3, maxDays: 5 },
    { name: 'Envío express',  description: '1-2 días hábiles', cost: 14.99, minDays: 1, maxDays: 2 },
    { name: 'Envío gratis',   description: '5-7 días hábiles (pedidos > $50)', cost: 0, minDays: 5, maxDays: 7 },
  ]

  for (const method of shippingMethods) {
    await db.shippingMethod.create({ data: method }).catch(() => {})
  }

  await db.coupon.upsert({
    where: { code: 'BIENVENIDO10' },
    update: {},
    create: {
      code: 'BIENVENIDO10',
      type: 'PERCENTAGE',
      value: 10,
      minPurchase: 20,
      usageLimit: 1000,
      validUntil: new Date('2026-12-31'),
    },
  })

  console.log('✅ Seed complete')
  console.log('   Admin: admin@tienda.com / Admin1234!')
  console.log('   Coupon: BIENVENIDO10 (10% off, min $20)')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
