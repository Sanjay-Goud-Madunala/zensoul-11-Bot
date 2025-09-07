import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function analyzeJournalEntry(content: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
    Analyze this journal entry for mental health insights. Provide a JSON response with:
    1. sentiment: "positive", "neutral", "negative", or "concerning"
    2. keywords: array of key emotional words/themes (max 8)
    3. suggestions: array of helpful, supportive suggestions (max 3)
    4. riskLevel: "low", "medium", or "high" based on distress indicators
    5. needsSupport: boolean if emergency support might be needed

    Journal entry: "${content}"

    Focus on identifying signs of distress, suicidal ideation, self-harm, or need for professional help.
    Be supportive and encouraging in suggestions. Look for patterns of depression, anxiety, or crisis.
    If you detect any mention of suicide, self-harm, or severe distress, set needsSupport to true and riskLevel to "high".
    
    Return only valid JSON without any markdown formatting.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()
    
    // Clean up the response to ensure it's valid JSON
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    try {
      const analysis = JSON.parse(cleanText)
      
      // Validate the response structure
      return {
        sentiment: analysis.sentiment || 'neutral',
        keywords: Array.isArray(analysis.keywords) ? analysis.keywords.slice(0, 8) : [],
        suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions.slice(0, 3) : ['Take time for self-care today'],
        riskLevel: analysis.riskLevel || 'low',
        needsSupport: Boolean(analysis.needsSupport)
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError, 'Raw text:', text)
      // Fallback analysis
      return {
        sentiment: 'neutral',
        keywords: [],
        suggestions: ['Take time for self-care today', 'Consider talking to someone you trust'],
        riskLevel: 'low',
        needsSupport: false
      }
    }
  } catch (error) {
    console.error('AI analysis error:', error)
    return {
      sentiment: 'neutral',
      keywords: [],
      suggestions: ['Take time for self-care today'],
      riskLevel: 'low',
      needsSupport: false
    }
  }
}

export async function generateChatResponse(message: string, context?: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
    You are a compassionate mental health support assistant for ZenSoul, a mindfulness app.
    
    User message: "${message}"
    ${context ? `Context: ${context}` : ''}
    
    Respond with empathy and provide helpful guidance. Guidelines:
    
    - If the user expresses distress: Offer coping strategies, suggest journaling, breathing exercises
    - If suicidal thoughts mentioned: Encourage seeking professional help and emergency contacts immediately
    - If anxiety/panic: Suggest breathing exercises, grounding techniques, or calming music
    - If requesting music: Acknowledge the request and mention that music will be provided
    - If general wellness: Provide positive affirmations and mindfulness tips
    - If happy/positive: Celebrate with them and suggest ways to maintain the mood
    
    Keep responses concise (2-4 sentences) and supportive. Never provide medical advice.
    Be warm, understanding, and encouraging. Use a caring, friend-like tone.
    
    If the user seems to be in crisis, gently suggest professional help or emergency resources.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Chat AI error:', error)
    return "I'm here to support you. Would you like to try some breathing exercises, write in your journal, or listen to some calming music?"
  }
}

export async function generateAffirmation(mood?: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
    Generate a personalized, uplifting affirmation for someone who might be feeling ${mood || 'neutral'}.
    Make it personal, positive, and empowering. 
    
    Guidelines:
    - Use "I am" or "I" statements
    - Focus on inner strength and self-worth
    - Be specific to the mood if provided
    - Keep it under 25 words
    - Make it feel genuine and meaningful
    - Avoid clichés
    
    Return only the affirmation text, no quotes or extra formatting.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  } catch (error) {
    console.error('Affirmation AI error:', error)
    const fallbacks = [
      "I am stronger than I know and capable of handling whatever comes my way.",
      "I deserve peace, happiness, and all the good things life has to offer.",
      "Every breath I take fills me with calm and centers my mind.",
      "I trust myself to make choices that honor my wellbeing.",
      "I am worthy of love, respect, and compassion - especially from myself."
    ]
    return fallbacks[Math.floor(Math.random() * fallbacks.length)]
  }
}