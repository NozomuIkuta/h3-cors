import { appendHeaders, getMethod, getRequestHeaders, getRequestHeader } from 'h3'
import { defu } from 'defu'
import type { CompatibilityEvent } from 'h3'
import type { CorsOptions, AccessControlAllowOriginHeader, AccessControlAllowMethodsHeader, AccessControlAllowCredentialsHeader, AccessControlAllowHeadersHeader, AccessControlExposeHeadersHeader, AccessControlMaxAgeHeader } from './types'

export function resolveCorsOptions (options: CorsOptions = {}): CorsOptions {
  const defaultOptions: CorsOptions = {
    origin: '*',
    methods: '*',
    allowHeaders: '*',
    exposeHeaders: '*',
    credentials: false,
    maxAge: false,
    preflight: {
      passThrough: false,
      statusCode: 204
    }
  }

  return defu(options, defaultOptions)
}

export function isPreflight (event: CompatibilityEvent): boolean {
  const method = getMethod(event)
  const origin = getRequestHeader(event, 'origin')
  const accessControlRequestMethod = getRequestHeader(event, 'access-control-request-method')

  return method === 'OPTIONS' && !!origin && !!accessControlRequestMethod
}

export function isAllowedOrigin (origin: ReturnType<typeof getRequestHeaders>['origin'], options: CorsOptions): boolean {
  const { origin: originOption } = options

  if (!originOption || originOption === '*' || originOption === 'null') {
    return true
  }

  if (Array.isArray(originOption)) {
    return !!originOption.find((_origin) => {
      if (_origin instanceof RegExp) {
        return _origin.test(origin)
      }

      return origin === _origin
    })
  }

  return originOption(origin)
}

export function createOriginHeaders (event: CompatibilityEvent, options: CorsOptions): AccessControlAllowOriginHeader {
  const { origin } = options

  if (!origin || origin === '*') {
    return { 'Access-Control-Allow-Origin': '*' }
  }

  if (typeof origin === 'string') {
    return { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' }
  }

  const requestOriginHeader = getRequestHeader(event, 'Origin') as string
  const headers = Array.isArray(requestOriginHeader) ? requestOriginHeader.join(',') : requestOriginHeader

  if (isAllowedOrigin(requestOriginHeader, options)) {
    return { 'Access-Control-Allow-Origin': headers, Vary: 'Origin' }
  }

  return {}
}

export function createMethodsHeaders (options: CorsOptions): AccessControlAllowMethodsHeader {
  const { methods } = options

  if (!methods || methods === '*' || !methods.length) {
    return { 'Access-Control-Allow-Methods': '*' }
  }

  return { 'Access-Control-Allow-Methods': methods.join(',') }
}

export function createCredentialsHeaders (options: CorsOptions): AccessControlAllowCredentialsHeader {
  const { credentials } = options

  if (credentials) {
    return { 'Access-Control-Allow-Credentials': 'true' }
  }

  return {}
}

export function createAllowHeaderHeaders (event: CompatibilityEvent, options: CorsOptions): AccessControlAllowHeadersHeader {
  const { allowHeaders } = options

  if (!allowHeaders || allowHeaders === '*' || !allowHeaders.length) {
    const headers = getRequestHeader(event, 'access-control-request-headers')

    return {
      'Access-Control-Allow-Headers': Array.isArray(headers) ? headers.join(',') : headers,
      Vary: 'Access-Control-Request-Headers'
    }
  }

  return {
    'Access-Control-Allow-Headers': allowHeaders.join(','),
    Vary: 'Access-Control-Request-Headers'
  }
}

export function createExposeHeaders (options: CorsOptions): AccessControlExposeHeadersHeader {
  const { exposeHeaders } = options

  if (!exposeHeaders) {
    return {}
  }

  if (exposeHeaders === '*') {
    return { 'Access-Control-Expose-Headers': exposeHeaders }
  }

  return { 'Access-Control-Expose-Headers': exposeHeaders.join(',') }
}

export function createMaxAgeHeader (options: CorsOptions): AccessControlMaxAgeHeader {
  const { maxAge } = options

  if (maxAge) {
    return { 'Access-Control-Max-Age': maxAge }
  }

  return {}
}

export function appendCorsPreflightHeaders (event: CompatibilityEvent, options: CorsOptions) {
  appendHeaders(event, createOriginHeaders(event, options))
  appendHeaders(event, createCredentialsHeaders(options))
  appendHeaders(event, createExposeHeaders(options))
  appendHeaders(event, createMethodsHeaders(options))
  appendHeaders(event, createAllowHeaderHeaders(event, options))
}

export function appendCorsActualRequestHeaders (event: CompatibilityEvent, options: CorsOptions) {
  appendHeaders(event, createOriginHeaders(event, options))
  appendHeaders(event, createCredentialsHeaders(options))
  appendHeaders(event, createExposeHeaders(options))
}
