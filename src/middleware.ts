import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ✅ FIX: Verify this line says "export function middleware"
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Reconstruct the cookie name
  const projectId = process.env.PROJECT_ID;
  
  // Safety check: prevent crash if env var is missing
  if (!projectId) {
     console.error("Middleware Error: NEXT_PUBLIC_APPWRITE_PROJECT_ID is missing!");
     return NextResponse.next();
  }

  const cookieName = `a_session_${projectId.toLowerCase()}`;
  
  // 2. Check cookie
  const sessionCookie = request.cookies.get(cookieName);
  console.log("Middleware - Session Cookie:", sessionCookie);
  const isLoggedIn = !!sessionCookie;

  // 3. Define Auth Routes (Pages logged-in users shouldn't see)
  const authRoutes = ['/Login', '/Signup', '/patient'];

  // 4. Redirect Logic
  if (isLoggedIn && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// ✅ FIX: Ensure config is exported separately
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}