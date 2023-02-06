import { HTTPMethod } from "h3";

export interface CorsOptions {
  origin?: "*" | "null" | (string | RegExp)[] | ((origin: string) => boolean);
  methods?: "*" | HTTPMethod[];
  allowHeaders?: "*" | string[];
  exposeHeaders?: "*" | string[];
  credentials?: boolean;
  maxAge?: string | false;
  preflight?: {
    statusCode?: number;
  };
}

// Ref: https://github.com/ts-essentials/ts-essentials/blob/c63e30e6112ed93df0bcf05028cfe1d67617f93d/lib/types.ts#L133-L153
type DeepRequired<T> = T extends
  | string
  | number
  | boolean
  | ((...args: any[]) => any)
  | RegExp
  ? T
  : T extends Record<string, never>
  ? { [K in keyof T]-?: DeepRequired<T[K]> }
  : Required<T>;

export type ResolvedCorsOptions = DeepRequired<CorsOptions>;

export type EmptyHeader = Record<string, never>;

export type AccessControlAllowOriginHeader =
  | {
      "Access-Control-Allow-Origin": "*" | "null" | string;
      Vary: "Origin";
    }
  | EmptyHeader;

export type AccessControlAllowMethodsHeader =
  | {
      "Access-Control-Allow-Methods": "*" | string;
    }
  | EmptyHeader;

export type AccessControlAllowCredentialsHeader =
  | {
      "Access-Control-Allow-Credentials": "true";
    }
  | EmptyHeader;

export type AccessControlAllowHeadersHeader =
  | {
      "Access-Control-Allow-Headers": "*" | string;
      Vary: "Access-Control-Request-Headers";
    }
  | EmptyHeader;

export type AccessControlExposeHeadersHeader =
  | {
      "Access-Control-Expose-Headers": "*" | string;
    }
  | EmptyHeader;

export type AccessControlMaxAgeHeader =
  | {
      "Access-Control-Max-Age": string;
    }
  | EmptyHeader;

export type CorsHeaders =
  | AccessControlAllowOriginHeader
  | AccessControlAllowMethodsHeader
  | AccessControlAllowCredentialsHeader
  | AccessControlAllowHeadersHeader
  | AccessControlExposeHeadersHeader
  | AccessControlMaxAgeHeader;
