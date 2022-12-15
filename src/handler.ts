import { defineEventHandler } from 'h3'
import { resolveCorsOptions, appendCorsPreflightHeaders, appendCorsActualRequestHeaders, isPreflight } from './utils'
import type { CorsOptions } from './types'

export function defineCorsEventHandler (options: CorsOptions) {
  const { preflight: { statusCode } } = resolveCorsOptions(options)

  return defineEventHandler((event) => {
    if (isPreflight(event)) {
      appendCorsPreflightHeaders(event, options)
      sendNoContent(event, statusCode)
    } else {
      appendCorsActualRequestHeaders(event, options)
    }
  })
}

export const corsEventHandler = defineCorsEventHandler
