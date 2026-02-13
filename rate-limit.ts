const requests = new Map<string, number[]>()

export async function rateLimit(userId: string) {
  const now = Date.now()
  const windowMs = 60_000 // 1 minute

  const userRequests = requests.get(userId) || []
  const recent = userRequests.filter(t => now - t < windowMs)

  if (recent.length >= 3) {
    throw new Error("RATE_LIMIT")
  }

  recent.push(now)
  requests.set(userId, recent)
}
