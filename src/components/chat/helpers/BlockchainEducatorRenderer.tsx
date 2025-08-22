'use client'

import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'
import type { BlockchainEducatorResponse } from '@/types'
import { useState } from 'react'

interface BlockchainEducatorRendererProps {
  data: BlockchainEducatorResponse | any
}

export function BlockchainEducatorRenderer({ data }: BlockchainEducatorRendererProps) {
  const [selectedLevel, setSelectedLevel] = useState<'child' | 'teen' | 'college' | 'grad' | 'expert'>('college')
  
  console.log('BlockchainEducatorRenderer received:', data)
  
  // Simplified parsing - handle the actual response structure
  let educationData: any = null
  
  // Case 1: data is already properly structured
  if (data && typeof data === 'object' && 'education' in data && data.education) {
    educationData = data.education
  }
  // Case 2: data has a message field containing JSON string
  else if (data && typeof data === 'object' && 'message' in data && data.message) {
    const message = data.message
    console.log('Found message field, attempting to parse JSON from:', message.substring(0, 100) + '...')
    
    // Try to extract JSON from code blocks
    const codeBlockMatch = message.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
    if (codeBlockMatch) {
      try {
        const parsed = JSON.parse(codeBlockMatch[1])
        if (parsed.education) {
          educationData = parsed.education
        }
      } catch (e) {
        console.log('Failed to parse JSON from code block:', e)
      }
    }
  }
  // Case 3: data is a string containing JSON
  else if (typeof data === 'string') {
    console.log('Received string data, attempting to parse...')
    const codeBlockMatch = data.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
    if (codeBlockMatch) {
      try {
        const parsed = JSON.parse(codeBlockMatch[1])
        if (parsed.education) {
          educationData = parsed.education
        }
      } catch (e) {
        console.log('Failed to parse JSON from string:', e)
      }
    }
  }
  
  // Final validation
  if (!educationData || !educationData.topic || !educationData.explanations) {
    console.log('No valid education data found')
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Invalid Education Data</p>
            <p className="text-xs mt-1">Could not parse blockchain education response</p>
          </div>
        </div>
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-500">Show Raw Data</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-red-600 overflow-auto max-h-64">
            {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
          </pre>
        </details>
      </div>
    )
  }

  const currentExplanation = educationData.explanations[selectedLevel]
  
  // Fallback if selected level doesn't exist
  if (!currentExplanation) {
    const availableLevels = Object.keys(educationData.explanations)
    if (availableLevels.length > 0) {
      const fallbackLevel = availableLevels[0] as 'child' | 'teen' | 'college' | 'grad' | 'expert'
      setSelectedLevel(fallbackLevel)
      return <div>Loading...</div> // Re-render with valid level
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'child':
        return '🧒'
      case 'teen':
        return '👦'
      case 'college':
        return '🎓'
      case 'grad':
        return '📚'
      case 'expert':
        return '🔬'
      default:
        return '📖'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'child':
        return 'from-pink-500 to-purple-500'
      case 'teen':
        return 'from-blue-500 to-cyan-500'
      case 'college':
        return 'from-green-500 to-emerald-500'
      case 'grad':
        return 'from-orange-500 to-red-500'
      case 'expert':
        return 'from-purple-500 to-indigo-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Topic Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{educationData.topic}</h3>
        <p className="text-sm text-gray-600">Choose your learning level to get the perfect explanation</p>
      </div>

      {/* Level Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {(['child', 'teen', 'college', 'grad', 'expert'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={`p-3 rounded-xl border-2 transition-all duration-200 ${
              selectedLevel === level
                ? `bg-gradient-to-r ${getLevelColor(level)} text-white border-transparent shadow-lg`
                : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-1">{getLevelIcon(level)}</div>
            <div className={`text-xs font-medium ${
              selectedLevel === level ? 'text-white' : 'text-gray-700'
            }`}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Explanation */}
      <div className={`bg-gradient-to-r ${getLevelColor(selectedLevel)} p-1 rounded-2xl`}>
        <div className="bg-white rounded-xl p-6 space-y-4">
          {/* Level Badge */}
          <div className="flex items-center justify-between">
            <Badge className={`bg-gradient-to-r ${getLevelColor(selectedLevel)} text-white border-0`}>
              {getLevelIcon(selectedLevel)} {currentExplanation.level}
            </Badge>
          </div>

          {/* Main Explanation */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Explanation:</h4>
            <div className="text-gray-700 leading-relaxed">
              {currentExplanation.explanation}
            </div>
          </div>

          {/* Analogy */}
          {'analogy' in currentExplanation && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Analogy:</h4>
              <div className="text-gray-700 italic bg-blue-50 p-3 rounded-lg border border-blue-200">
                💡 {currentExplanation.analogy}
              </div>
            </div>
          )}

          {/* Technical Details (for college and above) */}
          {('technical_details' in currentExplanation) && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Technical Details:</h4>
              <div className="text-gray-700 bg-gray-50 p-3 rounded-lg border">
                {currentExplanation.technical_details}
              </div>
            </div>
          )}

          {/* Research Context (for grad level) */}
          {selectedLevel === 'grad' && 'research_context' in currentExplanation && (
            <>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Research Context:</h4>
                <div className="text-gray-700 bg-purple-50 p-3 rounded-lg border border-purple-200">
                  {currentExplanation.research_context}
                </div>
              </div>
              {'implications' in currentExplanation && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Implications:</h4>
                  <div className="text-gray-700">
                    {currentExplanation.implications}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Expert-level details */}
          {selectedLevel === 'expert' && 'technical_specifications' in currentExplanation && (
            <>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Technical Specifications:</h4>
                <div className="text-gray-700 bg-gray-50 p-3 rounded-lg border font-mono text-sm">
                  {currentExplanation.technical_specifications}
                </div>
              </div>
              {'mathematical_foundations' in currentExplanation && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Mathematical Foundations:</h4>
                  <div className="text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    {currentExplanation.mathematical_foundations}
                  </div>
                </div>
              )}
              {'current_research' in currentExplanation && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Current Research:</h4>
                  <div className="text-gray-700">
                    {currentExplanation.current_research}
                  </div>
                </div>
              )}
              {'practical_applications' in currentExplanation && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Practical Applications:</h4>
                  <div className="text-gray-700">
                    {currentExplanation.practical_applications}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Key Point */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Key Takeaway:</h4>
            <div className={`text-white p-3 rounded-lg bg-gradient-to-r ${getLevelColor(selectedLevel)}`}>
              ⭐ {currentExplanation.key_point}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Path */}
      {educationData.learning_path && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <h4 className="font-semibold text-gray-900">Learning Path</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Prerequisites:</h5>
              <ul className="space-y-1">
                {(educationData.learning_path.prerequisites || []).map((prereq: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span className="text-gray-600">{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-medium text-gray-700 mb-2">Next Topics:</h5>
              <ul className="space-y-1">
                {(educationData.learning_path.next_topics || []).map((topic: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span className="text-gray-600">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-medium text-gray-700 mb-2">Difficulty Progression:</h5>
              <p className="text-gray-600 text-sm leading-relaxed">
                {educationData.learning_path.difficulty_progression || 'No progression info available'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Level Navigation */}
      <div className="flex flex-wrap gap-2 justify-center pt-2">
        <span className="text-sm text-gray-600">Quick switch:</span>
        {(['child', 'teen', 'college', 'grad', 'expert'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={`px-3 py-1 rounded-full text-xs transition-all ${
              selectedLevel === level
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {getLevelIcon(level)} {level}
          </button>
        ))}
      </div>
    </div>
  )
}

