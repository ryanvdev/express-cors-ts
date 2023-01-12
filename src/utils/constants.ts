import { Protocol, RequestMethod } from '../types';

export const ACCESS_CONTROL_ALLOW_ORIGIN = 'Access-Control-Allow-Origin';

export const REQUEST_METHODS = Object.freeze([
    'GET',
    'HEAD',
    'POST',
    'PUT',
    'DELETE',
    'CONNECT',
    'OPTIONS',
    'TRACE',
    'PATCH',
] as RequestMethod[]);

export const OPTIONS_METHOD: RequestMethod = 'OPTIONS';

export const PROTOCOLS = Object.freeze(['http', 'https'] as Protocol[]);

export const STR_REQUEST_METHODS = REQUEST_METHODS.join(', ');
