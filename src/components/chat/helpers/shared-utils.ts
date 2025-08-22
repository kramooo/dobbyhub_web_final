// Shared utilities for helper response parsing and validation

// Enhanced JSON parsing with multiple fallback strategies
export function parseHelperResponse(rawMessage: string, helperType: string): { data: any; error: string | null } {
  if (!rawMessage) {
    return { data: null, error: 'Empty response message' }
  }

  // Strategy 1: Try to parse the entire message as JSON
  try {
    const parsed = JSON.parse(rawMessage)
    return { data: parsed, error: null }
  } catch (e) {
    console.log('Strategy 1 failed: Full message parse')
  }

  // Strategy 2: Look for JSON in code blocks (```json ... ```)
  try {
    const codeBlockMatch = rawMessage.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
    if (codeBlockMatch) {
      const parsed = JSON.parse(codeBlockMatch[1])
      return { data: parsed, error: null }
    }
  } catch (e) {
    console.log('Strategy 2 failed: Code block JSON extraction')
  }

  // Strategy 3: Look for JSON object in the message
  try {
    const jsonMatch = rawMessage.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return { data: parsed, error: null }
    }
  } catch (e) {
    console.log('Strategy 3 failed: JSON object extraction')
  }

  // Strategy 4: Try to fix common JSON issues
  try {
    let cleanedMessage = rawMessage
      // Remove any text before the first {
      .replace(/^[^{]*/, '')
      // Remove any text after the last }
      .replace(/[^}]*$/, '')
      // Fix trailing commas
      .replace(/,(\s*[}\]])/g, '$1')
      // Fix unescaped quotes in strings (basic attempt)
      .replace(/": "([^"]*)"([^",}\]]*)"([^"]*)",/g, '": "$1\\"$2\\"$3",')

    if (cleanedMessage) {
      const parsed = JSON.parse(cleanedMessage)
      return { data: parsed, error: null }
    }
  } catch (e) {
    console.log('Strategy 4 failed: JSON cleanup')
  }

  // Strategy 5: Try to extract key-value pairs manually for specific helper types
  try {
    let extractedData = null
    switch (helperType) {
      case 'tweet-generator':
        extractedData = extractTweetData(rawMessage)
        break
      case 'token-analysis':
        extractedData = extractTokenAnalysisData(rawMessage)
        break
      case 'crypto-research':
        extractedData = extractCryptoResearchData(rawMessage)
        break
      case 'blockchain-educator':
        extractedData = extractBlockchainEducationData(rawMessage)
        break
    }
    
    if (extractedData) {
      return { data: extractedData, error: null }
    }
  } catch (e) {
    console.log(`Strategy 5 failed: Manual ${helperType} extraction`)
  }

  return { 
    data: null, 
    error: `Failed to parse JSON response for ${helperType}. The AI response may contain malformed JSON.` 
  }
}

// Manual extraction for Tweet responses when JSON parsing fails
export function extractTweetData(rawMessage: string): any | null {
  try {
    const tweetMatch = rawMessage.match(/"tweet":\s*"([^"]+)"/i)
    const toneMatch = rawMessage.match(/"tone":\s*"([^"]+)"/i)
    const hashtagsMatch = rawMessage.match(/"hashtags":\s*\[(.*?)\]/i)
    
    if (tweetMatch) {
      let hashtags: string[] = []
      if (hashtagsMatch) {
        // Try to extract hashtags from the match
        const hashtagStr = hashtagsMatch[1]
        hashtags = hashtagStr.split(',').map(tag => tag.trim().replace(/"/g, ''))
      }
      
      return {
        tweet: tweetMatch[1] || 'Unable to parse tweet content',
        tone: toneMatch?.[1] || 'neutral',
        hashtags: hashtags,
        engagement_tips: 'Response parsing was incomplete - content may be truncated'
      }
    }
  } catch (e) {
    console.log('Manual Tweet extraction failed:', e)
  }
  return null
}

// Manual extraction for Token Analysis responses when JSON parsing fails
export function extractTokenAnalysisData(rawMessage: string): any | null {
  try {
    const predictionMatch = rawMessage.match(/"price_prediction":\s*"([^"]+)"/i)
    const riskMatch = rawMessage.match(/"risk_level":\s*"([^"]+)"/i)
    const summaryMatch = rawMessage.match(/"summary":\s*"([^"]+)"/i)
    
    if (predictionMatch || riskMatch || summaryMatch) {
      return {
        analysis: {
          price_prediction: predictionMatch?.[1] || 'neutral',
          risk_level: riskMatch?.[1] || 'medium',
          summary: summaryMatch?.[1] || 'Unable to parse full analysis from malformed response',
          key_metrics: {
            market_cap: 'Unknown',
            volume: 'Unknown',
            holders: 'Unknown'
          },
          recommendations: ['Response parsing failed - please verify analysis independently']
        }
      }
    }
  } catch (e) {
    console.log('Manual Token Analysis extraction failed:', e)
  }
  return null
}

// Manual extraction for Crypto Research responses when JSON parsing fails
export function extractCryptoResearchData(rawMessage: string): any | null {
  try {
    const projectMatch = rawMessage.match(/"project_name":\s*"([^"]+)"/i)
    const categoryMatch = rawMessage.match(/"category":\s*"([^"]+)"/i)
    const overviewMatch = rawMessage.match(/"overview":\s*"([^"]+)"/i)
    const conclusionMatch = rawMessage.match(/"conclusion":\s*"([^"]+)"/i)
    
    if (projectMatch || overviewMatch) {
      return {
        research: {
          project_name: projectMatch?.[1] || 'Unknown Project',
          category: categoryMatch?.[1] || 'Other',
          overview: overviewMatch?.[1] || 'Unable to parse project overview from malformed response',
          strengths: ['Response parsing was incomplete'],
          weaknesses: ['Unable to parse detailed analysis'],
          market_analysis: 'Analysis incomplete due to parsing errors',
          conclusion: conclusionMatch?.[1] || 'Please verify research independently due to parsing issues'
        }
      }
    }
  } catch (e) {
    console.log('Manual Crypto Research extraction failed:', e)
  }
  return null
}

// Manual extraction for Blockchain Education responses when JSON parsing fails
export function extractBlockchainEducationData(rawMessage: string): any | null {
  try {
    // Strategy 1: Try the original markdown format with **topic:** structure
    const topicMatch1 = rawMessage.match(/\*\*topic:\*\*\s*([^\n*]+)/i) || 
                        rawMessage.match(/topic:\s*([^\n*]+)/i)
    
    if (topicMatch1) {
      const topic = topicMatch1[1].trim()
      const levels = ['child', 'teen', 'college', 'grad', 'expert']
      const explanations: any = {}

      for (const level of levels) {
        const levelSection = extractLevelSection(rawMessage, level)
        if (levelSection) {
          explanations[level] = levelSection
        } else {
          explanations[level] = {
            level: getLevelDisplayName(level),
            explanation: `Unable to parse ${level} explanation from response`,
            analogy: 'Response parsing was incomplete',
            key_point: 'Please ask again for a proper explanation'
          }
        }
      }

      const learningPath = extractLearningPath(rawMessage)

      return {
        education: {
          topic,
          explanations,
          learning_path: learningPath
        }
      }
    }

    // Strategy 2: Try the new structured format with **Level:** headers
    const structuredTopicMatch = rawMessage.match(/\*\*(.*?)\s+is\s+the\s+.*?\*\*/i) ||
                                rawMessage.match(/\*\*([^*]+)\*\*[^*]*?(?=\*\*Child\*\*|\*\*Teen\*\*)/i)
    
    if (structuredTopicMatch || rawMessage.includes('**Child:**') || rawMessage.includes('**Teen:**')) {
      const topic = structuredTopicMatch ? structuredTopicMatch[1].trim() : 'Unknown Topic'
      const explanations: any = {}
      
      // Extract structured format: **Child:** content, **Teen:** content, etc.
      const structuredLevels = [
        { key: 'child', patterns: ['\\*\\*Child:\\*\\*', '\\*\\*child:\\*\\*'] },
        { key: 'teen', patterns: ['\\*\\*Teen:\\*\\*', '\\*\\*teen:\\*\\*'] },
        { key: 'college', patterns: ['\\*\\*College:\\*\\*', '\\*\\*college:\\*\\*'] },
        { key: 'grad', patterns: ['\\*\\*Grad:\\*\\*', '\\*\\*grad:\\*\\*', '\\*\\*Graduate:\\*\\*'] },
        { key: 'expert', patterns: ['\\*\\*Expert:\\*\\*', '\\*\\*expert:\\*\\*'] }
      ]

      for (const levelInfo of structuredLevels) {
        let content = null
        
        // Try each pattern for this level
        for (const pattern of levelInfo.patterns) {
          const regex = new RegExp(`${pattern}\\s*([^*]+?)(?=\\*\\*(?:Child|Teen|College|Grad|Graduate|Expert|Learning Path):|$)`, 'is')
          const match = rawMessage.match(regex)
          if (match) {
            content = match[1].trim()
            break
          }
        }

        if (content) {
          explanations[levelInfo.key] = {
            level: getLevelDisplayName(levelInfo.key),
            explanation: content,
            analogy: content.includes('like') ? content : `Think of it like: ${content.substring(0, 100)}...`,
            key_point: content.split('.')[0] || content.substring(0, 100)
          }
        } else {
          explanations[levelInfo.key] = {
            level: getLevelDisplayName(levelInfo.key),
            explanation: `Unable to parse ${levelInfo.key} explanation`,
            analogy: 'Response parsing was incomplete',
            key_point: 'Please ask again for a proper explanation'
          }
        }
      }

      // Extract learning path from structured format
      const learningPathMatch = rawMessage.match(/\*\*Learning Path:\*\*\s*([\s\S]*?)(?=\*\*|$)/i)
      const learningPath = {
        prerequisites: ['Basic understanding needed'],
        next_topics: ['Advanced concepts'],
        difficulty_progression: learningPathMatch ? learningPathMatch[1].trim() : 'Progressive learning recommended'
      }

      return {
        education: {
          topic,
          explanations,
          learning_path: learningPath
        }
      }
    }

    console.log('No recognizable education format found in response')
    return null
  } catch (e) {
    console.log('Manual Blockchain Education extraction failed:', e)
  }
  return null
}

export function getLevelDisplayName(level: string): string {
  switch (level) {
    case 'child': return 'Child (Ages 5-10)'
    case 'teen': return 'Teen (Ages 13-17)'
    case 'college': return 'College Student (Ages 18-22)'
    case 'grad': return 'Graduate Student (Ages 22+)'
    case 'expert': return 'Expert/Professional'
    default: return 'Unknown Level'
  }
}

export function extractLevelSection(text: string, level: string): any | null {
  try {
    // Look for the level section in the markdown-style response
    const levelRegex = new RegExp(`\\*\\*${level}\\*\\*([\\s\\S]*?)(?=\\*\\*(?:child|teen|college|grad|expert|learning_path)\\*\\*|$)`, 'i')
    const levelMatch = text.match(levelRegex)
    
    if (!levelMatch) return null

    const levelContent = levelMatch[1]

    // Extract fields for this level
    const levelName = extractField(levelContent, 'level') || getLevelDisplayName(level)
    const explanation = extractField(levelContent, 'explanation')
    const analogy = extractField(levelContent, 'analogy')
    const keyPoint = extractField(levelContent, 'key_point')
    const technicalDetails = extractField(levelContent, 'technical_details')
    const researchContext = extractField(levelContent, 'research_context')
    const implications = extractField(levelContent, 'implications')
    const technicalSpecs = extractField(levelContent, 'technical_specifications')
    const mathFoundations = extractField(levelContent, 'mathematical_foundations')
    const currentResearch = extractField(levelContent, 'current_research')
    const practicalApps = extractField(levelContent, 'practical_applications')

    const result: any = {
      level: levelName,
      explanation: explanation || `No explanation found for ${level} level`,
      key_point: keyPoint || `No key point found for ${level} level`
    }

    // Add optional fields based on level
    if (analogy) result.analogy = analogy
    if (technicalDetails) result.technical_details = technicalDetails
    if (researchContext) result.research_context = researchContext
    if (implications) result.implications = implications
    if (technicalSpecs) result.technical_specifications = technicalSpecs
    if (mathFoundations) result.mathematical_foundations = mathFoundations
    if (currentResearch) result.current_research = currentResearch
    if (practicalApps) result.practical_applications = practicalApps

    return result
  } catch (e) {
    console.log(`Failed to extract ${level} section:`, e)
    return null
  }
}

export function extractField(text: string, fieldName: string): string | null {
  const fieldRegex = new RegExp(`\\*\\*${fieldName}:\\*\\*\\s*([^\\n*]+(?:\\n(?!\\s*\\*\\*)[^\\n*]+)*)`, 'i')
  const match = text.match(fieldRegex)
  return match ? match[1].trim() : null
}

export function extractLearningPath(text: string): any {
  try {
    const pathRegex = /\*\*learning_path\*\*([\s\S]*?)$/i
    const pathMatch = text.match(pathRegex)
    
    if (!pathMatch) {
      return {
        prerequisites: ['Unable to parse prerequisites'],
        next_topics: ['Unable to parse next topics'],
        difficulty_progression: 'Unable to parse difficulty progression'
      }
    }

    const pathContent = pathMatch[1]
    
    const prerequisites = extractField(pathContent, 'prerequisites')?.split(',').map(s => s.trim()) || ['Unable to parse prerequisites']
    const nextTopics = extractField(pathContent, 'next_topics')?.split(',').map(s => s.trim()) || ['Unable to parse next topics']
    const difficultyProgression = extractField(pathContent, 'difficulty_progression') || 'Unable to parse difficulty progression'

    return {
      prerequisites,
      next_topics: nextTopics,
      difficulty_progression: difficultyProgression
    }
  } catch (e) {
    console.log('Failed to extract learning path:', e)
    return {
      prerequisites: ['Parsing failed'],
      next_topics: ['Parsing failed'],
      difficulty_progression: 'Parsing failed'
    }
  }
}

// Common clipboard and social sharing utilities
export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

export function openTwitterIntent(text: string) {
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
  window.open(tweetUrl, '_blank')
}

