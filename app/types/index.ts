// Shared TypeScript types for Rubbish App

export type BinType = 'FoodScraps' | 'RecyclableContainers' | 'Paper' | 'Garbage'

export interface WastePart {
  name: string
  separation_instruction: string
  bin: BinType
}

export interface ClassificationResponse {
  error: boolean
  error_description: string
  summary: string
  parts: WastePart[]
}

export interface CameraPermissionState {
  granted: boolean | null
  denied: boolean
  prompt: boolean
}
