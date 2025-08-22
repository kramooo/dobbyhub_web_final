import { NextRequest, NextResponse } from 'next/server'
import { dobbyHelpersDB } from '@/lib/database/dobby-helpers'

// POST /api/helpers/sessions/[sessionId]/messages - Add a message to helper session
export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params
    const body = await req.json()
    const { role, content, tokenCount } = body

    if (!role || !content) {
      return NextResponse.json(
        { success: false, error: 'Role and content are required' },
        { status: 400 }
      )
    }

    if (!['user', 'assistant', 'system'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      )
    }

    const message = await dobbyHelpersDB.addHelperMessage(
      sessionId,
      role,
      content,
      tokenCount
    )

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Failed to add message' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: message
    })
  } catch (error) {
    console.error('Error adding helper message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add message' },
      { status: 500 }
    )
  }
}
