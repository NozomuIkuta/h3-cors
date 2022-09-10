import { expect, it, describe } from 'vitest'
import type { CompatibilityEvent } from 'h3'
import { resolveCorsOptions, isPreflight, isAllowedOrigin, createOriginHeaders, createMethodsHeaders, createCredentialsHeaders, createAllowHeaderHeaders, createExposeHeaders, createMaxAgeHeader } from '../src/utils'
import type { CorsOptions } from '../src/types'

describe('resolveCorsOptions', () => {
  it('can merge default options and user options', () => {
    const options1 = resolveCorsOptions()
    const options2 = resolveCorsOptions({
      origin: ['https://example.com:3000'],
      methods: ['GET', 'POST'],
      allowHeaders: ['CUSTOM-HEADER'],
      exposeHeaders: ['EXPOSED-HEADER'],
      maxAge: '12345',
      preflight: {
        statusCode: 404
      }
    })

    expect(options1).toEqual({
      origin: '*',
      methods: '*',
      allowHeaders: '*',
      exposeHeaders: '*',
      credentials: false,
      maxAge: false,
      preflight: {
        statusCode: 204
      }
    })
    expect(options2).toEqual({
      origin: ['https://example.com:3000'],
      methods: ['GET', 'POST'],
      allowHeaders: ['CUSTOM-HEADER'],
      exposeHeaders: ['EXPOSED-HEADER'],
      credentials: false,
      maxAge: '12345',
      preflight: {
        statusCode: 404
      }
    })
  })
})

describe('isPreflight', () => {
  it('can detect preflight request', () => {
    const eventMock = {
      req: {
        method: 'OPTIONS',
        headers: {
          origin: 'http://example.com',
          'access-control-request-method': 'GET'
        }
      }
    } as CompatibilityEvent

    expect(isPreflight(eventMock)).toEqual(true)
  })

  it('can detect request of non-OPTIONS method)', () => {
    const eventMock = {
      req: {
        method: 'GET',
        headers: {
          origin: 'http://example.com',
          'access-control-request-method': 'GET'
        }
      }
    } as CompatibilityEvent

    expect(isPreflight(eventMock)).toEqual(false)
  })

  it('can detect request without Origin header', () => {
    const eventMock = {
      req: {
        method: 'OPTIONS',
        headers: {
          'access-control-request-method': 'GET'
        }
      }
    } as CompatibilityEvent

    expect(isPreflight(eventMock)).toEqual(false)
  })

  it('can detect request without AccessControlRequestMethod header', () => {
    const eventMock = {
      req: {
        method: 'OPTIONS',
        headers: {
          origin: 'http://example.com'
        }
      }
    } as CompatibilityEvent

    expect(isPreflight(eventMock)).toEqual(false)
  })
})

describe('isAllowedOrigin', () => {
  it('returns `true` if `origin` option is not defined', () => {
    const origin = 'https://example.com'
    const options: CorsOptions = {}

    expect(isAllowedOrigin(origin, options)).toEqual(true)
  })

  it('returns `true` if `origin` option is `"*"`', () => {
    const origin = 'https://example.com'
    const options: CorsOptions = {
      origin: '*'
    }

    expect(isAllowedOrigin(origin, options)).toEqual(true)
  })

  it('returns `true` if `origin` option is `"null"`', () => {
    const origin = 'https://example.com'
    const options: CorsOptions = {
      origin: 'null'
    }

    expect(isAllowedOrigin(origin, options)).toEqual(true)
  })

  it('can detect allowed origin (string)', () => {
    const origin = 'https://example.com'
    const options: CorsOptions = {
      origin: ['https://example.com']
    }

    expect(isAllowedOrigin(origin, options)).toEqual(true)
  })

  it('can detect allowed origin (regular expression)', () => {
    const origin = 'https://example.com'
    const options: CorsOptions = {
      origin: [/example/]
    }

    expect(isAllowedOrigin(origin, options)).toEqual(true)
  })

  it('can detect allowed origin (function)', () => {
    const origin = 'https://example.com'
    const options: CorsOptions = {
      origin: (_origin: string) => {
        expect(_origin).toEqual(origin)
        return true
      }
    }

    expect(isAllowedOrigin(origin, options)).toEqual(true)
  })

  it('can detect allowed origin (falsy)', () => {
    const origin = 'https://example.com'
    const options: CorsOptions = {
      origin: ['https://example2.com']
    }

    expect(isAllowedOrigin(origin, options)).toEqual(false)
  })
})

describe('createOriginHeaders', () => {
  it('returns an object whose `Access-Control-Allow-Origin` is `"*"` if `origin` option is not defined, `"*"`', () => {
    const eventMock = {
      req: {
        method: 'OPTIONS',
        headers: {
          origin: 'http://example.com'
        }
      }
    } as CompatibilityEvent
    const options1: CorsOptions = {}
    const options2: CorsOptions = {
      origin: '*'
    }

    expect(createOriginHeaders(eventMock, options1)).toEqual({ 'Access-Control-Allow-Origin': '*' })
    expect(createOriginHeaders(eventMock, options2)).toEqual({ 'Access-Control-Allow-Origin': '*' })
  })

  it('returns an object whose `Access-Control-Allow-Origin` is `"*"` if `origin` header is not defined', () => {
    const eventMock = {
      req: {
        method: 'OPTIONS',
        headers: {}
      }
    } as CompatibilityEvent
    const options: CorsOptions = {}

    expect(createOriginHeaders(eventMock, options)).toEqual({ 'Access-Control-Allow-Origin': '*' })
  })

  it('returns an object with `Access-Control-Allow-Origin` and `Vary` keys if `origin` option is `"null"`', () => {
    const eventMock = {
      req: {
        method: 'OPTIONS',
        headers: {
          origin: 'http://example.com'
        }
      }
    } as CompatibilityEvent
    const options: CorsOptions = {
      origin: 'null'
    }

    expect(createOriginHeaders(eventMock, options)).toEqual({ 'Access-Control-Allow-Origin': 'null', Vary: 'Origin' })
  })

  it('returns an object with `Access-Control-Allow-Origin` and `Vary` keys if `origin` option and `Origin` header matches', () => {
    const eventMock = {
      req: {
        method: 'OPTIONS',
        headers: {
          origin: 'http://example.com'
        }
      }
    } as CompatibilityEvent
    const options1: CorsOptions = {
      origin: ['http://example.com']
    }
    const options2: CorsOptions = {
      origin: [/example.com/]
    }

    expect(createOriginHeaders(eventMock, options1)).toEqual({ 'Access-Control-Allow-Origin': 'http://example.com', Vary: 'Origin' })
    expect(createOriginHeaders(eventMock, options2)).toEqual({ 'Access-Control-Allow-Origin': 'http://example.com', Vary: 'Origin' })
  })
})

describe('createMethodsHeaders', () => {
  it('returns an object whose `Access-Control-Allow-Methods` is `"*"` if `methods` option is not defined, `"*"`, or an empty array', () => {
    const options1: CorsOptions = {}
    const options2: CorsOptions = {
      methods: '*'
    }
    const options3: CorsOptions = {
      methods: []
    }

    expect(createMethodsHeaders(options1)).toEqual({ 'Access-Control-Allow-Methods': '*' })
    expect(createMethodsHeaders(options2)).toEqual({ 'Access-Control-Allow-Methods': '*' })
    expect(createMethodsHeaders(options3)).toEqual({ 'Access-Control-Allow-Methods': '*' })
  })

  it('returns an object whose `Access-Control-Allow-Methods` is set as `methods` option', () => {
    const options: CorsOptions = {
      methods: ['GET', 'POST']
    }

    expect(createMethodsHeaders(options)).toEqual({ 'Access-Control-Allow-Methods': 'GET,POST' })
  })
})

describe('createCredentialsHeaders', () => {
  it('returns an empty object if `credentials` option is not defined', () => {
    const options: CorsOptions = {}

    expect(createCredentialsHeaders(options)).toEqual({})
  })

  it('returns an object whose `Access-Control-Allow-Credentials` is `"true"` if `credentials` option is true', () => {
    const options: CorsOptions = {
      credentials: true
    }

    expect(createCredentialsHeaders(options)).toEqual({ 'Access-Control-Allow-Credentials': 'true' })
  })
})

describe('createAllowHeaderHeaders', () => {
  it('returns an object with `Access-Control-Allow-Headers` and `Vary` keys according to `Access-Control-Request-Headers` header if `allowHeaders` option is not defined, `"*"`, or an empty array', () => {
    const eventMock = {
      req: {
        method: 'OPTIONS',
        headers: {
          'access-control-request-headers': 'CUSTOM-HEADER'
        }
      }
    } as CompatibilityEvent
    const options1: CorsOptions = {}
    const options2: CorsOptions = {
      allowHeaders: '*'
    }
    const options3: CorsOptions = {
      allowHeaders: []
    }

    expect(createAllowHeaderHeaders(eventMock, options1)).toEqual({ 'Access-Control-Allow-Headers': 'CUSTOM-HEADER', Vary: 'Access-Control-Request-Headers' })
    expect(createAllowHeaderHeaders(eventMock, options2)).toEqual({ 'Access-Control-Allow-Headers': 'CUSTOM-HEADER', Vary: 'Access-Control-Request-Headers' })
    expect(createAllowHeaderHeaders(eventMock, options3)).toEqual({ 'Access-Control-Allow-Headers': 'CUSTOM-HEADER', Vary: 'Access-Control-Request-Headers' })
  })

  it('returns an object with `Access-Control-Allow-Headers` and `Vary` keys according to `allowHeaders` option', () => {
    const eventMock = {
      req: {
        method: 'OPTIONS',
        headers: {}
      }
    } as CompatibilityEvent
    const options: CorsOptions = {
      allowHeaders: ['CUSTOM-HEADER']
    }

    expect(createAllowHeaderHeaders(eventMock, options)).toEqual({ 'Access-Control-Allow-Headers': 'CUSTOM-HEADER', Vary: 'Access-Control-Request-Headers' })
  })
})

describe('createExposeHeaders', () => {
  it('returns an object if `exposeHeaders` option is not defined', () => {
    const options: CorsOptions = {}

    expect(createExposeHeaders(options)).toEqual({})
  })

  it('returns an object with `Access-Control-Expose-Headers` key according to `exposeHeaders` option', () => {
    const options1: CorsOptions = {
      exposeHeaders: '*'
    }
    const options2: CorsOptions = {
      exposeHeaders: ['EXPOSED-HEADER-1', 'EXPOSED-HEADER-2']
    }

    expect(createExposeHeaders(options1)).toEqual({ 'Access-Control-Expose-Headers': '*' })
    expect(createExposeHeaders(options2)).toEqual({ 'Access-Control-Expose-Headers': 'EXPOSED-HEADER-1,EXPOSED-HEADER-2' })
  })
})

describe('createMaxAgeHeader', () => {
  it('returns an object if `maxAge` option is not defined, false, or an empty string', () => {
    const options1: CorsOptions = {}
    const options2: CorsOptions = {
      maxAge: false
    }
    const options3: CorsOptions = {
      maxAge: ''
    }

    expect(createMaxAgeHeader(options1)).toEqual({})
    expect(createMaxAgeHeader(options2)).toEqual({})
    expect(createMaxAgeHeader(options3)).toEqual({})
  })

  it('returns an object with `Access-Control-Max-Age` key according to `exposeHeaders` option', () => {
    const options1: CorsOptions = {
      maxAge: '12345'
    }
    const options2: CorsOptions = {
      maxAge: '0'
    }

    expect(createMaxAgeHeader(options1)).toEqual({ 'Access-Control-Max-Age': '12345' })
    expect(createMaxAgeHeader(options2)).toEqual({ 'Access-Control-Max-Age': '0' })
  })
})
