import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Manejo de CORS para que tu frontend pueda comunicarse con esta función sin bloqueos
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Recibimos los datos de la compra desde tu página web
    const { amountInCents, currency, reference } = await req.json()

    // 2. Traemos tu llave secreta de Wompi que guardamos en Supabase en el Paso 2
    const integritySecret = Deno.env.get('WOMPI_INTEGRITY_SECRET')

    if (!integritySecret) {
      throw new Error('Falta el secreto de integridad en las variables de entorno.')
    }

    // 3. Wompi exige pegar estos 4 datos exactamente en este orden
    const concatenatedString = `${reference}${amountInCents}${currency}${integritySecret}`

    // 4. Transformamos ese texto en un código de seguridad indescifrable (SHA-256)
    const messageBuffer = new TextEncoder().encode(concatenatedString)
    const hashBuffer = await crypto.subtle.digest('SHA-256', messageBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // 5. Le enviamos la firma de seguridad de vuelta a tu página web
    return new Response(
      JSON.stringify({ signature }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})