export const FEATURE_FLAGS = {
  aiGeneration: process.env.ENABLE_AI_GENERATION === "true",
} as const
