import { NextRequest, NextResponse } from 'next/server'
import { dobbyHelpersDB } from '@/lib/database/dobby-helpers'

// GET /api/helpers/sessions/[sessionId] - Get a specific helper session
export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params

    const session = await dobbyHelpersDB.getHelperSession(sessionId)

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Helper session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: session
    })
  } catch (error) {
    console.error('Error fetching helper session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch helper session' },
      { status: 500 }
    )
  }
}

// PUT /api/helpers/sessions/[sessionId] - Update helper session title
export async function PUT(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params
    const body = await req.json()
    const { title } = body

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      )
    }

    const success = await dobbyHelpersDB.updateHelperSessionTitle(sessionId, title)

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update helper session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Helper session updated successfully'
    })
  } catch (error) {
    console.error('Error updating helper session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update helper session' },
      { status: 500 }
    )
  }
}

// DELETE /api/helpers/sessions/[sessionId] - Delete helper session
export async function DELETE(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params

    const success = await dobbyHelpersDB.deleteHelperSession(sessionId)

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete helper session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Helper session deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting helper session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete helper session' },
      { status: 500 }
    )
  }
}
