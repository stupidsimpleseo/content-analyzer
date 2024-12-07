import { NextResponse } from 'next/server'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    
    // Fetch webpage content
    console.log(`Fetching content from: ${url}`)
    const response = await fetch(url)
    const html = await response.text()
    
    // Extract text content (basic example - you might want to use a proper HTML parser)
    const textContent = html.replace(/<[^>]*>/g, ' ')
                           .replace(/\s+/g, ' ')
                           .trim()
    
    // Analyze content using OpenAI
    console.log('Analyzing content with OpenAI...')
    const { text: analysis } = await generateText({
      model: openai('gpt-4-turbo'),
      messages: [
        {
          role: 'system',
          content: `You are a webpage content analyzer. Analyze the following webpage content and determine if it's helpful or unhelpful based on these criteria:
          1. Authorship credibility
          2. Content depth and intent
          3. SEO-driven headings
          4. Practical advice value
          5. Template-based writing
          6. Visual authenticity
          7. Content intent and SEO signals
          
          Provide a clear final prediction as either "Helpful Content" or "Unhelpful Content" and explain why.`
        },
        {
          role: 'user',
          content: textContent
        }
      ]
    })

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'An error occurred while analyzing the content.' }, { status: 500 })
  }
}

