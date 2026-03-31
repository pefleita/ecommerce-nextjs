import { auth } from "@/lib/auth"

export const proxy = auth((req) => {
  if (!req.auth) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }
})

export const config = {
  matcher: [
    "/account/:path*",
    "/admin/:path*",
    "/api/account/:path*",
    "/api/admin/:path*",
  ],
}
