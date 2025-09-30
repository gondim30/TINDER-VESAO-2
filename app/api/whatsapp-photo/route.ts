import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const fallbackPayload = {
    success: true,
    result: "https://i.postimg.cc/gcNd6QBM/img1.jpg",
    is_photo_private: true,
  }

  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Número de telefone é obrigatório" },
        {
          status: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
        },
      )
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "")

    const response = await fetch("https://w.imagens.pics/webhook/182dd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        key: "wuAsuKHImXennBSFjt895tu984ut5",
      },
      body: JSON.stringify({ number: cleanPhone }),
      signal: AbortSignal.timeout?.(10_000),
    })

    if (!response.ok) {
      console.error("API externa retornou status:", response.status)
      return NextResponse.json(fallbackPayload, {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      })
    }

    const responseText = await response.text()

    if (!responseText || responseText.trim() === "") {
      return NextResponse.json(fallbackPayload, {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      })
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      return NextResponse.json(fallbackPayload, {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      })
    }

    const photoUrl = data?.foto || fallbackPayload.result
    const isPhotoPrivate = !data?.foto || photoUrl === fallbackPayload.result

    return NextResponse.json(
      {
        success: true,
        result: photoUrl,
        is_photo_private: isPhotoPrivate,
        status: data?.Status || "",
      },
      {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      },
    )
  } catch (err) {
    console.error("Erro no webhook WhatsApp:", err)
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
