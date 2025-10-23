import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { z } from 'zod'

// Validation schema for classification result
const ClassificationResultSchema = z.object({
  error: z.boolean(),
  error_description: z.string(),
  summary: z.string(),
  parts: z.array(
    z.object({
      name: z.string(),
      separation_instruction: z.string(),
      bin: z.enum(['FoodScraps', 'RecyclableContainers', 'Paper', 'Garbage'])
    })
  )
})

type ClassificationResult = z.infer<typeof ClassificationResultSchema>

// Rate limiting and size constraints
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = process.env.GROK_API_KEY
    if (!apiKey) {
      console.error('GROK_API_KEY not configured')
      return NextResponse.json(
        { error: true, error_description: 'Server configuration error', summary: '', parts: [] },
        { status: 500 }
      )
    }

    // Parse FormData
    const formData = await request.formData()
    const imageFile = formData.get('image') as File | null

    if (!imageFile) {
      return NextResponse.json(
        { error: true, error_description: 'No image provided', summary: '', parts: [] },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        {
          error: true,
          error_description: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
          summary: '',
          parts: []
        },
        { status: 400 }
      )
    }

    // Validate file size
    if (imageFile.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        {
          error: true,
          error_description: `File too large. Maximum size: ${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
          summary: '',
          parts: []
        },
        { status: 400 }
      )
    }

    // Convert image to base64
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Image = buffer.toString('base64')
    const imageDataUrl = `data:${imageFile.type};base64,${base64Image}`

    // Read system prompt
    const promptPath = join(process.cwd(), 'prompts', 'image_system_prompt.md')
    const systemPrompt = await readFile(promptPath, 'utf-8')

    // Call Grok Vision API
    console.log('[Classify API] Calling Grok Vision API...')

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'grok-2-vision-1212',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: imageDataUrl
                }
              },
              {
                type: 'text',
                text: 'Analyze this waste item and provide classification in the required JSON format.'
              }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Classify API] Grok API error:', response.status, errorText)

      return NextResponse.json(
        {
          error: true,
          error_description: 'Classification service temporarily unavailable',
          summary: '',
          parts: []
        },
        { status: 503 }
      )
    }

    const data = await response.json()
    console.log('[Classify API] Grok API response:', JSON.stringify(data, null, 2))

    // Extract content from response
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      console.error('[Classify API] No content in response')
      return NextResponse.json(
        { error: true, error_description: 'Invalid response from classification service', summary: '', parts: [] },
        { status: 500 }
      )
    }

    // Parse JSON response
    let parsedResult: unknown
    try {
      parsedResult = JSON.parse(content)
    } catch (parseError) {
      console.error('[Classify API] Failed to parse JSON:', content)
      return NextResponse.json(
        { error: true, error_description: 'Invalid classification response format', summary: '', parts: [] },
        { status: 500 }
      )
    }

    // Validate with Zod schema
    const validationResult = ClassificationResultSchema.safeParse(parsedResult)

    if (!validationResult.success) {
      console.error('[Classify API] Validation error:', validationResult.error)
      return NextResponse.json(
        { error: true, error_description: 'Classification response validation failed', summary: '', parts: [] },
        { status: 500 }
      )
    }

    const classificationResult = validationResult.data

    // If classification returned an error, return 422
    if (classificationResult.error) {
      return NextResponse.json(classificationResult, { status: 422 })
    }

    // Success
    console.log('[Classify API] Classification successful:', classificationResult.summary)
    return NextResponse.json(classificationResult, { status: 200 })

  } catch (error) {
    console.error('[Classify API] Unexpected error:', error)
    return NextResponse.json(
      {
        error: true,
        error_description: 'Internal server error',
        summary: '',
        parts: []
      },
      { status: 500 }
    )
  }
}
