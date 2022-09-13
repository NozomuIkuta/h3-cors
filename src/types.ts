import { HTTPMethod } from 'h3'

export interface CorsOptions {
  origin?: '*' | 'null' | (string | RegExp)[] | ((origin: string) => boolean)
  methods?: '*' | HTTPMethod[]
  allowHeaders?: '*' | string[]
  exposeHeaders?: '*' | string[]
  credentials?: boolean
  maxAge?: string | false
  preflight?: {
    statusCode?: number
  }
}

// Ref: https://github.com/ts-essentials/ts-essentials/blob/c63e30e6112ed93df0bcf05028cfe1d67617f93d/lib/types.ts#L133-L153
type DeepRequired<T> = T extends (string | number | boolean | Function | RegExp)
  ? T
  : T extends {}
  ? { [K in keyof T]-?: DeepRequired<T[K]> }
  : Required<T>;

export type ResolvedCorsOptions = DeepRequired<CorsOptions>

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
