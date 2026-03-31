import type { NextAuthConfig } from "next-auth"

const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
}

export default authConfig
