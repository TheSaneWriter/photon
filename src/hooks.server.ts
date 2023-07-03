import { DEFAULT_INSTANCE_URL } from '$lib/lemmy.js'
import { error } from '@sveltejs/kit'

export async function handle({ event, resolve }) {
  // annoying hack to fix lemmy's CORS
  if (event.url.pathname.startsWith('/cors')) {
    const instance = `${event.url.pathname.split('/')[2]}`
    const url = `${event.url.pathname
      .split('/')
      .slice(3)
      .join('/')}?${event.url.searchParams.toString()}`

    event.request.headers.delete('origin')
    event.request.headers.delete('host')

    try {
      console.log(`https://${instance}/${url.toString()}`)
      const data = await fetch(`https://${instance}/${url.toString()}`, {
        method: event.request.method,
        body: event.request.body,
        headers: event.request.headers,
        signal: AbortSignal.timeout(20 * 1000),
      })

      return new Response(JSON.stringify(await data.json()))
    } catch (err) {
      console.error(err)
      throw error(500, { message: 'The proxy failed to fetch from the server' })
    }
  }

  const response = await resolve(event)
  return response
}
