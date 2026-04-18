import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Obtenemos la URL de la variable de entorno que configurarás en Vercel.
    const webhookUrl = process.env.N8N_WEBHOOK_URL

    if (!webhookUrl) {
      console.error('[n8n] ERROR: La variable N8N_WEBHOOK_URL no está configurada.')
      return NextResponse.json(
        { error: 'Webhook no configurado en el servidor' },
        { status: 500 }
      )
    }

    console.log(`[n8n] Enviando datos a: ${webhookUrl}`)

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const responseText = await response.text()
    console.log(`[n8n] Respuesta: ${response.status} - ${responseText}`)

    if (!response.ok) {
      throw new Error(`Error de n8n: ${response.status} ${response.statusText} - ${responseText}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[n8n] Error al enviar webhook:', error)
    return NextResponse.json(
      { error: 'No se pudo procesar la solicitud', detail: String(error) },
      { status: 500 }
    )
  }
}
