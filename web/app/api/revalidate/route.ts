import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string
      slug?: { current: string }
    }>(req, process.env.SANITY_WEBHOOK_SECRET)

    // Validate the webhook signature
    if (!isValidSignature) {
      console.error('Invalid webhook signature')
      return new Response('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      console.error('Missing _type in webhook body')
      return new Response('Bad Request', { status: 400 })
    }

    console.log('Webhook received:', { type: body._type, slug: body.slug?.current })

    // Revalidate all pages - this will revalidate both homepage and all blog posts
    revalidatePath('/', 'layout')
    console.log('Revalidated all pages')

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      body: body,
    })
  } catch (err) {
    console.error('Webhook error:', err)
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return new Response(message, { status: 500 })
  }
}
