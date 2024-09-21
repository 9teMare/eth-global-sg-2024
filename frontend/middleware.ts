import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Redirect "/" to "/marketplace"
    if (pathname === "/") {
        return NextResponse.redirect(new URL("/marketplace", req.url));
    }

    // Allow all other paths
    return NextResponse.next();
}

// Specify which paths to match (in this case, we only want to match the root path "/")
export const config = {
    matcher: "/",
};
