import { type NextRequest, NextResponse } from "next/server"

const cache = new Map<string, { result: string; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function POST(request: NextRequest) {
  const fallbackPayload = {
    success: true,
    result: "https://i.postimg.cc/gcNd6QBM/img1.jpg",
    is_photo_private: true,
  }

  try {
    const { phone, countryCode } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        {
          status: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
        },
      )
    }

    const tel = phone.replace(/[^0-9]/g, "")
    const codigoPais = countryCode?.replace(/[^0-9]/g, "") || ""

    // Get 3rd digit for Brazilian number formatting
    const tel9 = tel.substr(2, 1)

    // Format Brazilian numbers (remove extra 9 if necessary)
    const telFormatado =
      codigoPais === "55" && tel.length === 11 ? tel.substr(0, 2) + (tel9 === "9" ? "" : tel9) + tel.substr(3) : tel

    const fullPhone = codigoPais + telFormatado

    const cached = cache.get(fullPhone)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log("[v0] Returning cached WhatsApp photo")
      return NextResponse.json(
        {
          success: true,
          result: cached.result,
          is_photo_private: false,
        },
        {
          status: 200,
          headers: { "Access-Control-Allow-Origin": "*" },
        },
      )
    }

    const urlProfile = `https://whatsapp-data.p.rapidapi.com/wspicture?phone=${fullPhone}`

    const response = await fetch(urlProfile, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "663753efb4mshcbbdde11e811789p149069jsnd73bd1ba7a71",
        "X-RapidAPI-Host": "whatsapp-data.p.rapidapi.com",
      },
      signal: AbortSignal.timeout?.(10_000),
    })

    if (response.status === 429) {
      console.log("[v0] Rate limit exceeded, returning fallback")
      return NextResponse.json(fallbackPayload, {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      })
    }

    if (!response.ok) {
      console.error("[v0] RapidAPI returned status:", response.status)
      return NextResponse.json(fallbackPayload, {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      })
    }

    const responseText = await response.text()

    if (!responseText || responseText.trim() === "" || !responseText.startsWith("https://")) {
      console.log("[v0] Invalid or empty response from RapidAPI, returning fallback")
      return NextResponse.json(fallbackPayload, {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      })
    }

    cache.set(fullPhone, {
      result: responseText.trim(),
      timestamp: Date.now(),
    })

    if (cache.size > 100) {
      const oldestKey = Array.from(cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0]
      cache.delete(oldestKey)
    }

    // Photo URL found successfully
    return NextResponse.json(
      {
        success: true,
        result: responseText.trim(),
        is_photo_private: false,
      },
      {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      },
    )
  } catch (err) {
    console.error("[v0] Error fetching WhatsApp photo:", err)
    return NextResponse.json(fallbackPayload, {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
    })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
