import { defineEventHandler } from 'h3'
import type { CompatibilityEvent } from 'h3'
import { resolveCorsOptions, appendCorsPreflightHeaders, appendCorsActualRequestHeaders, isPreflight } from './utils'
import type { CorsOptions } from './types'

export function defineCorsEventHandler (options: CorsOptions): ReturnType<typeof defineEventHandler> {
  const { preflight: { statusCode, passThrough } } = resolveCorsOptions(options)

  return defineEventHandler((event: CompatibilityEvent) => {
    if (isPreflight(event)) {
      appendCorsPreflightHeaders(event, options)

      if (passThrough) {
        return Promise.resolve()
      }

      event.res.statusCode = statusCode
      event.res.setHeader('Content-Length', '0')
      event.res.end()
      return
    }

    appendCorsActualRequestHeaders(event, options)
    return Promise.resolve()
  })
}
