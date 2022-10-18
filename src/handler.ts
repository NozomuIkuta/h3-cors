import { defineEventHandler, getRequestHeader } from 'h3'
import { resolveCorsOptions, isAllowedOrigin, appendCorsPreflightHeaders, appendCorsActualRequestHeaders, isPreflight } from './utils'
import type { CorsOptions } from './types'

export function defineCorsEventHandler (options: CorsOptions): ReturnType<typeof defineEventHandler> {
  const { preflight: { statusCode } } = resolveCorsOptions(options)

  return defineEventHandler((event) => {
    const requestOriginHeader = getRequestHeader(event, 'Origin') as string
    const isAllowed = isAllowedOrigin(requestOriginHeader, options)

    if (!isAllowed) {
      throw new Error(`[h3-cors] ${requestOriginHeader} is not allowed origin`)
    }

    if (isPreflight(event)) {
      appendCorsPreflightHeaders(event, options)

      event.res.statusCode = statusCode
      event.res.setHeader('Content-Length', '0')
      event.res.end()
    } else {
      appendCorsActualRequestHeaders(event, options)
    }
  })
}
