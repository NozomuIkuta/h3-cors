import { defineEventHandler } from 'h3'
import { resolveCorsOptions, appendCorsPreflightHeaders, appendCorsActualRequestHeaders, isPreflight } from './utils'
import type { CorsOptions } from './types'

export function defineCorsEventHandler (options: CorsOptions): ReturnType<typeof defineEventHandler> {
  const { preflight: { statusCode } } = resolveCorsOptions(options)

  return defineEventHandler((event) => {
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
