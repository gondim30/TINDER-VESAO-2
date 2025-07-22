import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // JSON-default de retorno em caso de falha da API externa
  const fallbackPayload = {
    success: true,
    result:
      "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
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

    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/[^0-9]/g, "")

    // Adiciona código do país se não tiver (assumindo Brasil +55)
    let fullNumber = cleanPhone
    if (!cleanPhone.startsWith("55") && cleanPhone.length === 11) {
      fullNumber = "55" + cleanPhone
    }

    const response = await fetch(
      `https://primary-production-aac6.up.railway.app/webhook/request_photo?tel=${fullNumber}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Origin: "https://whatspy.chat",
        },
        // timeout de 10 s (Edge Runtime aceita AbortController)
        signal: AbortSignal.timeout?.(10_000),
      },
    )

    // Se a API externa falhar, devolvemos payload padrão 200
    if (!response.ok) {
      console.error("API externa retornou status:", response.status)
      return NextResponse.json(fallbackPayload, {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      })
    }

    const data = await response.json()

    const isPhotoPrivate = !data?.link || data.link.includes("no-user-image-icon")

    return NextResponse.json(
      {
        success: true,
        result: isPhotoPrivate ? fallbackPayload.result : data.link,
        is_photo_private: isPhotoPrivate,
      },
      {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      },
    )
  } catch (err) {
    console.error("Erro no webhook WhatsApp:", err)
    // Nunca deixamos propagar status 500; devolvemos fallback
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
