import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Just pass through all requests without any checks
  return NextResponse.next()
}

// Empty matcher means it won't run for any routes
export const config = {
  matcher: []
}
