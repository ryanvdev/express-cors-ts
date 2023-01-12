import { NextFunction, Request, Response } from 'express';

export type Protocol = 'http' | 'https';

export type RequestMethod =
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'CONNECT'
    | 'OPTIONS'
    | 'TRACE'
    | 'PATCH';

export interface AllowedOriginConfig {
    /**
     * * Example 1: hostnames: "hostname.com"
     * * Example 1: hostnames: [ "sales-shop.com", "admin-sales-shop.com" ]
     */
    hostnames: string | string[];

    /**
     * Access-Control-Allow-Credentials
     * @default false
     */
    allowCredentials?: boolean;

    /**
     * If protocols equals with '*' then protocols = [ 'http', 'https' ]
     * * Example 1: protocols: 'http'
     * * Example 2: protocols: [ 'http', 'https' ]
     * * Example 3: protocols: '*'
     * @default '*'
     */
    protocols?: Protocol | Protocol[] | '*';

    /**
     * * Example 1: ports: '*'
     * * Example 2: ports: 3000
     * * Example 3: ports: [ 3000, 443, 8080, 80 ]
     * @default '*'
     */
    ports?: number | number[] | '*';

    /**
     * Access-Control-Max-Age
     * * Example 1: maxAge: 600
     */
    maxAge?: number;

    /**
     * Access-Control-Allow-Methods
     * * Example 1: allowMethods: ['GET', 'POST', 'PATCH', 'OPTIONS', 'PUT', 'DELETE']
     * * Example 2: allowMethods: 'POST'
     * * Example 3: allowMethods: '*'
     * @default '*'
     */
    allowMethods?: RequestMethod | RequestMethod[] | '*';

    /**
     * Access-Control-Expose-Headers
     */
    exposeHeaders?: string[];

    /**
     * Access-Control-Allow-Headers
     * @default [ 'Origin', 'X-Requested-With', 'Content-Type', 'Auth', 'Authorization' ]
     */
    allowHeaders?: string[];

    /**
     * + Custom response headers
     * + If you set the response header to a different value, the added header will override the default header.
     * * Example 1: headers: { 'Access-Control-Allow-Headers': 'Origin, X-Requested-With' }
     */
    headers?: ResponseHeaders;
}

export type OtherOriginsHandle =
    | ((req: Request, res: Response, next: NextFunction) => any)
    | 'no-action'
    | 'deny';

export type ExpressCorsMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<void>;

export type AllowedOrigin = string | AllowedOriginConfig;
//=========================================================================

export interface ResponseHeaders {
    [k: string]: string;
}

export interface CorsDomainConfig {
    ports: Readonly<number[]> | '*';
    protocols: Readonly<Protocol[]>;
    responseHeaders: ResponseHeaders;
}

export interface CorsConfigs {
    [p: string]: Readonly<CorsDomainConfig>;
}
