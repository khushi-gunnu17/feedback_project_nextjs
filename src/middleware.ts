import { NextResponse, NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

	const token = await getToken({req : request})
	const url = request.nextUrl

	// Redirect to dashboard if the user is already authenticated
	// and trying to access signin, signup, or home page
	if (token && (
		url.pathname.startsWith('/signin') ||
		url.pathname.startsWith('/signup') ||
		url.pathname.startsWith('/verify') ||
		url.pathname === '/'
	)) {
		return NextResponse.redirect(new URL('/dashboard', request.url))
	}

	if (!token && url.pathname.startsWith('/dasboard')) {
		return NextResponse.redirect(new URL('/signin', request.url))
	}

	return NextResponse.next()

}
 
export const config = {
  // paths where your middleware is gonna work
	matcher: [
		'/signin',
		'/signup',
		'/',
		'/dashboard/:path*',
		'/verify/:path*'
	]
}