import Replicate from "replicate"

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!
})

export async function removeBackground(imageUrl: string): Promise<string> {
  const output = await replicate.run(
    "lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1",
    { 
      input: { 
        image: imageUrl 
      } 
    }
  ) as unknown as string

  return output
}

export async function generateBackground(image: string, prompt: string): Promise<string> {
  const output = await replicate.run(
    "black-forest-labs/flux-1.1-pro",
    {
      input: {
        prompt,
        aspect_ratio: "1:1",
        output_format: "png",
        output_quality: 90,
        safety_tolerance: 2
      }
    }
  ) as unknown as string

  return output
}
