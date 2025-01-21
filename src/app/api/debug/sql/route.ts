import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { query } = await request.json()

    if (!query) {
      return new NextResponse('Query is required', { status: 400 })
    }

    const { data, error } = await supabase.rpc('debug_sql', { query_text: query })

    if (error) {
      return new NextResponse(error.message, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 })
  }
}