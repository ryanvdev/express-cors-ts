import { PROTOCOLS, REQUEST_METHODS, STR_REQUEST_METHODS } from './constants';
import {
    AllowedOriginConfig,
    CorsConfigs,
    CorsDomainConfig,
    Protocol,
    RequestMethod,
    ResponseHeaders,
    AllowedOrigin,
} from '../types';
import { defaultCorsDomainConfig, defaultResponseHeaders } from './default-config';

export function processMethodsConfig(
    methods: RequestMethod | RequestMethod[] | '*',
): Readonly<RequestMethod[]> {
    switch (typeof methods) {
        case 'string': {
            if (methods === '*') return REQUEST_METHODS;

            if (methods === 'OPTIONS') {
                return Object.freeze(['OPTIONS'] as RequestMethod[]);
            }

            return Object.freeze([methods, 'OPTIONS'] as RequestMethod[]);
        }
        case 'object': {
            if (!Array.isArray(methods) || methods.length === 0) {
                throw new Error(
                    '[express-cors] Methods must be a array or a string and methods must have a length greater than 0',
                );
            }

            const allAreMethods = methods.every(
                (method) =>
                    typeof method === 'string' && REQUEST_METHODS.includes(method),
            );

            if (!allAreMethods) {
                throw new Error(
                    '[express-cors] Methods must be a array or a string and methods must have a length greater than 0',
                );
            }

            return Object.freeze(
                Array.from(new Set([...methods, 'OPTIONS'] as RequestMethod[])),
            );
        }
        default: {
            throw new Error('[express-cors] Methods must be a array or a string');
        }
    }
}

export function processPortsConfig(
    ports?: number | number[] | '*',
): Readonly<number[]> | '*' {
    if (!ports) return '*';

    switch (typeof ports) {
        case 'string': {
            if (ports !== '*') {
                throw new Error(
                    '[express-cors] config posts must be a array of numbers or a number or "*" ',
                );
            }
            return ports;
        }
        case 'number': {
            if (!isFinite(ports)) {
                throw new Error(
                    '[express-cors] config posts must be a array of numbers or a number',
                );
            }
            return Object.freeze([ports]);
        }
        case 'object': {
            if (!Array.isArray(ports)) {
                throw new Error(
                    '[express-cors] config posts must be a array of numbers or a number',
                );
            }

            const allAreNumbers = ports.every(
                (port) => typeof port === 'number' && isFinite(port),
            );

            if (!allAreNumbers) {
                throw new Error(
                    '[express-cors] config posts must be a array of numbers or a number',
                );
            }

            const uniquePorts = Array.from(new Set([...ports]));
            return Object.freeze(uniquePorts);
        }
        default: {
            throw new Error(
                '[express-cors] config posts must be a array of numbers or a number',
            );
        }
    }
}

export function processProtocolsConfig(
    protocols?: '*' | Protocol | Protocol[],
): Readonly<Protocol[]> {
    if (!protocols) return PROTOCOLS;

    switch (typeof protocols) {
        case 'string': {
            if (protocols === '*') {
                return PROTOCOLS;
            }

            if (!PROTOCOLS.includes(protocols)) {
                throw new Error(`[express-cors] Invalid protocol config: '${protocols}'`);
            }

            return Object.freeze([protocols] as Protocol[]);
        }
        case 'object': {
            if (!Array.isArray(protocols)) {
                throw new Error(
                    '[express-cors] Invalid protocol config. Protocols must be a array of protocols or a protocol',
                );
            }

            const allAreProtocols = protocols.every(
                (protocol) =>
                    typeof protocol === 'string' && PROTOCOLS.includes(protocol),
            );

            if (!allAreProtocols) {
                throw new Error(
                    '[express-cors] Invalid protocol config. Protocols must be a array of protocols or a protocol',
                );
            }

            const uniqueProtocols = Array.from(new Set([...protocols]));

            if (uniqueProtocols.length === PROTOCOLS.length) {
                return PROTOCOLS;
            }

            return Object.freeze([...uniqueProtocols]);
        }
        default: {
            throw new Error(
                '[express-cors] Invalid protocol config. Protocols must be a array of protocols or a protocol',
            );
        }
    }
}

export function processHeadersConfig(
    config: AllowedOriginConfig,
): Readonly<ResponseHeaders> {
    const {
        headers,
        allowMethods,
        maxAge,
        allowCredentials,
        allowHeaders,
        exposeHeaders,
    } = config;

    const responseHeaders: ResponseHeaders = {
        ...defaultResponseHeaders,
    };

    if (headers) {
        for (const key in headers) {
            if (headers[key] === undefined && key in responseHeaders) {
                delete responseHeaders[key];
            } else {
                responseHeaders[key] = headers[key];
            }
        }
    }

    if (allowMethods) {
        if (allowMethods === '*') {
            responseHeaders['Access-Control-Allow-Methods'] = STR_REQUEST_METHODS;
        } else {
            responseHeaders['Access-Control-Allow-Methods'] =
                processMethodsConfig(allowMethods).join(', ');
        }
    }

    if (maxAge && isFinite(maxAge) && maxAge >= 0) {
        responseHeaders['Access-Control-Max-Age'] = String(Math.round(maxAge));
    }

    if (allowCredentials === true) {
        responseHeaders['Access-Control-Allow-Credentials'] = 'true';
    }

    if (exposeHeaders && exposeHeaders.length !== 0) {
        responseHeaders['Access-Control-Expose-Headers'] = exposeHeaders.join(', ');
    }

    if (allowHeaders) {
        responseHeaders['Access-Control-Allow-Headers'] = allowHeaders.join(', ');
    }

    return Object.freeze(responseHeaders);
}

export function processAllowedOrigins(allowedOrigins: AllowedOrigin[]) {
    return allowedOrigins.reduce((sum, allowedOrigin) => {
        switch (typeof allowedOrigin) {
            case 'string': {
                if (allowedOrigin in sum) {
                    throw new Error(
                        `[express-cors] This hostname='${allowedOrigin}' has been configured`,
                    );
                }
                sum[allowedOrigin] = defaultCorsDomainConfig;
                return sum;
            }
            case 'object': {
                const hostnames = allowedOrigin.hostnames;

                const domainConfig = Object.freeze({
                    responseHeaders: processHeadersConfig(allowedOrigin),
                    ports: processPortsConfig(allowedOrigin.ports),
                    protocols: processProtocolsConfig(allowedOrigin.protocols),
                } as CorsDomainConfig);

                switch (typeof hostnames) {
                    case 'string': {
                        if (hostnames in sum) {
                            throw new Error(
                                `[express-cors] This hostname='${hostnames}' has been configured`,
                            );
                        }
                        sum[hostnames] = domainConfig;
                        break;
                    }
                    case 'object': {
                        if (!Array.isArray(hostnames)) {
                            throw new Error(
                                '[express-cors] hostnames must be a array of string or a string',
                            );
                        }

                        if (!hostnames.every((item) => typeof item === 'string')) {
                            throw new Error(
                                '[express-cors] hostnames must be a array of string or a string',
                            );
                        }

                        hostnames.forEach((hostname) => {
                            if (hostname in sum) {
                                throw new Error(
                                    `[express-cors] This hostname='${hostname}' has been configured`,
                                );
                            }
                            sum[hostname] = domainConfig;
                        });
                        break;
                    }
                    default: {
                        throw new Error(
                            '[express-cors] hostnames must be a array of string or a string',
                        );
                    }
                }
                return sum;
            }
            default: {
                throw new Error(
                    '[express-cors] Invalid config. For more information, please visit https://www.npmjs.com/package/express-cors-ts',
                );
            }
        }
    }, {} as CorsConfigs);
}
