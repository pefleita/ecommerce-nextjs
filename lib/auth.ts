import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { loginSchema } from '@/lib/validations/auth'
import type { Role } from '@prisma/client'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db) as any,

  session: { strategy: 'jwt' },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          firstName: profile.given_name ?? profile.name?.split(' ')[0] ?? '',
          lastName: profile.family_name ?? profile.name?.split(' ')[1] ?? '',
          image: profile.picture,
          role: 'CUSTOMER' as Role,
          active: true,
          emailVerified: new Date(),
        }
      },
    }),

    Credentials({
      name: 'credentials',
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await db.user.findUnique({ where: { email } })

        const hashToCompare = user?.passwordHash ?? '$2b$12$invalidhashfortimingsafety000'
        const passwordOk = await bcrypt.compare(password, hashToCompare)

        if (!user || !passwordOk || !user.active) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          active: user.active,
          image: user.image ?? undefined,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role as Role
        token.firstName = (user as any).firstName as string
        token.lastName = (user as any).lastName as string
        token.active = (user as any).active as boolean
      }

      if (trigger === 'update' && session) {
        if (session.firstName) token.firstName = session.firstName
        if (session.lastName) token.lastName = session.lastName
      }

      if (token.id && !user) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, active: true, firstName: true, lastName: true },
        })
        if (dbUser) {
          token.role = dbUser.role
          token.active = dbUser.active
          token.firstName = dbUser.firstName
          token.lastName = dbUser.lastName
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.active = token.active as boolean
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/',
  },

  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
})
