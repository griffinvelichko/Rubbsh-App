import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { classificationResponseSchema } from '@/lib/validation'
import type { ClassificationResponse } from '@/app/types'
import { uploadWasteImage, saveRecommendation } from '@/lib/supabase'

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

    // Convert image to buffer
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload image to Supabase Storage and save metadata
    console.log('[Classify API] Uploading image to Supabase...')
    let imageId: string
    let storagePath: string
    let publicUrl: string

    try {
      const uploadResult = await uploadWasteImage(buffer, imageFile.type)
      imageId = uploadResult.imageId
      storagePath = uploadResult.storagePath
      publicUrl = uploadResult.publicUrl
      console.log('[Classify API] Image uploaded successfully:', { imageId, storagePath })
    } catch (uploadError) {
      console.error('[Classify API] Failed to upload image:', uploadError)
      return NextResponse.json(
        {
          error: true,
          error_description: 'Failed to store image',
          summary: '',
          parts: []
        },
        { status: 500 }
      )
    }

    // Convert image to base64 for Grok API
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
        model: 'grok-4-fast-reasoning',
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
                text: 'Analyze this waste item and provide classification. Return ONLY valid JSON matching the exact schema shown in the system prompt. Do not include any markdown formatting, code blocks, or additional text - just the raw JSON object.'
              }
            ]
          }
        ],
        temperature: 0.5,
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

    // Extract JSON from response (handle markdown code blocks)
    let jsonString = content.trim()

    // Remove markdown code blocks if present
    const codeBlockMatch = jsonString.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
    if (codeBlockMatch) {
      jsonString = codeBlockMatch[1].trim()
    }

    // Try to extract JSON object if there's extra text
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonString = jsonMatch[0]
    }

    // Parse JSON response
    let parsedResult: unknown
    try {
      parsedResult = JSON.parse(jsonString)
    } catch (parseError) {
      console.error('[Classify API] Failed to parse JSON:', jsonString)
      console.error('[Classify API] Original content:', content)
      return NextResponse.json(
        { error: true, error_description: 'Invalid classification response format', summary: '', parts: [] },
        { status: 500 }
      )
    }

    // Validate with Zod schema
    const validationResult = classificationResponseSchema.safeParse(parsedResult)

    if (!validationResult.success) {
      console.error('[Classify API] Validation error:', validationResult.error)
      return NextResponse.json(
        { error: true, error_description: 'Classification response validation failed', summary: '', parts: [] },
        { status: 500 }
      )
    }

    const classificationResult: ClassificationResponse = validationResult.data

    // Save recommendation to database
    console.log('[Classify API] Saving recommendation to database...')
    try {
      const recommendationId = await saveRecommendation(imageId, classificationResult)
      console.log('[Classify API] Recommendation saved:', recommendationId)
    } catch (dbError) {
      console.error('[Classify API] Failed to save recommendation:', dbError)
      // Continue anyway - the classification was successful, just logging failed
    }

    // If classification returned an error, return 422
    if (classificationResult.error) {
      return NextResponse.json(
        {
          ...classificationResult,
          imageId,
          imageUrl: publicUrl,
        },
        { status: 422 }
      )
    }

    // Success - include image metadata in response
    console.log('[Classify API] Classification successful:', classificationResult.summary)
    return NextResponse.json(
      {
        ...classificationResult,
        imageId,
        imageUrl: publicUrl,
      },
      { status: 200 }
    )

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
