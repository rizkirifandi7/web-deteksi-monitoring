import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if ( pathname.startsWith("/")) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	const response = NextResponse.next();
	return response;
}

export const config = {
	matcher: ["/"],
};
