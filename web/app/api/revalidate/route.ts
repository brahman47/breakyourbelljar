import { revalidateTag } from 'next/cache'
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

    // Revalidate using cache tags for efficient invalidation
    revalidateTag('post')
    console.log('Revalidated cache tag: post')

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      body: body,
    })
  } catch (err: any) {
    console.error('Webhook error:', err)
    return new Response(err.message, { status: 500 })
  }
}
