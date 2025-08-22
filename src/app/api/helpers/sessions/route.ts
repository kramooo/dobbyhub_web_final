import { NextRequest, NextResponse } from 'next/server'
import { dobbyHelpersDB } from '@/lib/database/dobby-helpers'

// GET /api/helpers/sessions - Get all helper sessions for the user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const helperType = searchParams.get('type')
    const search = searchParams.get('search')

    let sessions
    if (search) {
      sessions = await dobbyHelpersDB.searchHelperSessions(search)
    } else if (helperType) {
      sessions = await dobbyHelpersDB.getHelperSessionsByType(helperType)
    } else {
      sessions = await dobbyHelpersDB.getHelperSessions()
    }
    
    return NextResponse.json({
      success: true,
      data: sessions
    })
  } catch (error) {
    console.error('Error fetching helper sessions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch helper sessions' },
      { status: 500 }
    )
  }
}

// POST /api/helpers/sessions - Create a new helper session
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { helperTypeId, title, language } = body

    if (!helperTypeId) {
      return NextResponse.json(
        { success: false, error: 'Helper type ID is required' },
        { status: 400 }
      )
    }

    const session = await dobbyHelpersDB.createHelperSession(
      helperTypeId,
      title,
      language
    )

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Failed to create helper session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: session
    })
  } catch (error) {
    console.error('Error creating helper session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create helper session' },
      { status: 500 }
    )
  }
}
