import { NextRequest, NextResponse } from 'next/server'
import { dobbyHelpersDB } from '@/lib/database/dobby-helpers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { helperType, messages, language = 'en' } = body

    if (!helperType || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Helper type and messages are required' },
        { status: 400 }
      )
    }

    if (!process.env.FIREWORKS_API_KEY) {
      return NextResponse.json(
        { error: 'Fireworks API key not configured' },
        { status: 500 }
      )
    }

    // Get the helper type configuration from database
    const helperTypeConfig = await dobbyHelpersDB.getHelperType(helperType)
    
    if (!helperTypeConfig) {
      return NextResponse.json(
        { error: 'Helper type not found' },
        { status: 404 }
      )
    }

    // Build the system prompt with language injection
    const systemPrompt = helperTypeConfig.system_prompt.replace(
      'Language: en.', 
      `Language: ${language}.`
    )

    // Prepare messages with system prompt
    const apiMessages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...messages
    ]

    // Call Fireworks API
    const response = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.FIREWORKS_API_KEY}`
      },
      body: JSON.stringify({
        model: "accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b",
        max_tokens: 4096,
        top_p: 1,
        top_k: 40,
        presence_penalty: 0,
        frequency_penalty: 0,
        temperature: 0.6,
        messages: apiMessages
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Fireworks API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      )
    }

    const assistantMessage = data.choices[0].message.content

    // Try to parse JSON response for structured helpers
    let parsedResponse = null
    try {
      parsedResponse = JSON.parse(assistantMessage)
    } catch (e) {
      // If not JSON, return as plain text
      parsedResponse = { message: assistantMessage }
    }

    return NextResponse.json({
      success: true,
      data: {
        message: assistantMessage,
        parsed: parsedResponse,
        usage: data.usage,
        helper_type: helperTypeConfig.name,
        helper_display_name: helperTypeConfig.display_name
      }
    })

  } catch (error) {
    console.error('Helper chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
