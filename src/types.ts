import { HTTPMethod } from 'h3'

export interface CorsOptions {
  origin?: '*' | 'null' | (string | RegExp)[] | ((origin: string) => boolean)
  methods?: '*' | HTTPMethod[]
  allowHeaders?: '*' | string[]
  exposeHeaders?: '*' | string[]
  credentials?: boolean
  maxAge?: string | false
  preflight?: {
    passThrough?: boolean
    statusCode?: 204
  }
}

export type AccessControlAllowOriginHeader = Partial<{
  'Access-Control-Allow-Origin': '*' | 'null' | string
  Vary: 'Origin'
}>

export type AccessControlAllowMethodsHeader = Partial<{
  'Access-Control-Allow-Methods': '*' | string
  Vary: 'Access-Control-Request-Method'
}>

export type AccessControlAllowCredentialsHeader = Partial<{
  'Access-Control-Allow-Credentials': 'true'
}>

export type AccessControlAllowHeadersHeader = Partial<{
  'Access-Control-Allow-Headers': '*' | string
  Vary: 'Access-Control-Request-Headers'
}>

export type AccessControlExposeHeadersHeader = Partial<{
  'Access-Control-Expose-Headers': '*' | string
}>

export type AccessControlMaxAgeHeader = Partial<{
  'Access-Control-Max-Age': string
}>

export type CorsHeaders =
  | AccessControlAllowOriginHeader
  | AccessControlAllowMethodsHeader
  | AccessControlAllowCredentialsHeader
  | AccessControlAllowHeadersHeader
  | AccessControlExposeHeadersHeader
  | AccessControlMaxAgeHeader
