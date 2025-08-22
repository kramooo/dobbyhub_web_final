import { NextRequest, NextResponse } from 'next/server'
import { dobbyHelpersDB } from '@/lib/database/dobby-helpers'

// GET /api/helpers - Get all helper types
export async function GET() {
  try {
    const helperTypes = await dobbyHelpersDB.getHelperTypes()
    
    return NextResponse.json({
      success: true,
      data: helperTypes
    })
  } catch (error) {
    console.error('Error fetching helper types:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch helper types' },
      { status: 500 }
    )
  }
}
