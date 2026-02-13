export const BASE_PROMPT =
  "Ultra realistic commercial product photography, high detail, studio quality"

export const STYLE_PROMPTS: Record<string, string> = {
  luxury_marble:
    "Luxury marble table background, cinematic lighting, premium brand aesthetic",

  minimal_studio:
    "Minimal white studio background, soft shadow, clean modern composition",

  outdoor_nature:
    "Natural outdoor environment, soft daylight, lifestyle commercial look"
}

// Language Isolation: All prompts are in English to ensure consistent AI output
// Frontend text is never passed to the AI model
