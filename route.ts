import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  try {
    const supabase = await getSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await rateLimit(user.id)

    const { imageUrl, style_id } = await req.json()

    if (!imageUrl || !style_id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // Check if user has credits
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (!profile || profile.credits <= 0) {
      return NextResponse.json({ error: "NO_CREDIT" }, { status: 402 })
    }

    const { data: job, error } = await supabase
      .from("jobs")
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        style_id,
        status: "pending"
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ jobId: job.id })
  } catch (error: any) {
    console.error("Generate error:", error)
    
    if (error.message === "RATE_LIMIT") {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
