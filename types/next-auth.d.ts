import "next-auth"

declare module "next-auth" {
  interface User {
    role: string
    firstName: string
    lastName: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      firstName: string
      lastName: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    firstName: string
    lastName: string
  }
}
