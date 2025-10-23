import { z } from 'zod'

// Bin type enum schema
export const binTypeSchema = z.enum([
  'FoodScraps',
  'RecyclableContainers',
  'Paper',
  'Garbage'
])

// Waste part schema
export const wastePartSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  separation_instruction: z.string().min(1, 'Instruction is required'),
  bin: binTypeSchema
})

// Classification response schema
export const classificationResponseSchema = z.object({
  error: z.boolean(),
  error_description: z.string(),
  summary: z.string(),
  parts: z.array(wastePartSchema)
})

// Type inference from Zod schemas (single source of truth)
export type ClassificationResponse = z.infer<typeof classificationResponseSchema>
export type WastePart = z.infer<typeof wastePartSchema>
export type BinType = z.infer<typeof binTypeSchema>
