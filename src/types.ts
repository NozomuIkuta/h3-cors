import { HTTPMethod } from "h3";
import type { Object, Any } from "ts-toolbelt";

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

export type ResolvedCorsOptions = Object.Required<CorsOptions, Any.Key, "deep">;

export type EmptyHeader = Record<string, never>;

export type AccessControlAllowOriginHeader =
  | {
      "Access-Control-Allow-Origin": "*";
    }
  | {
      "Access-Control-Allow-Origin": "null" | string;
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
