import { PROTOCOLS, STR_REQUEST_METHODS } from './constants';
import { CorsDomainConfig, ResponseHeaders } from '../types';

export const defaultResponseHeaders = Object.freeze(<ResponseHeaders>{
    'Access-Control-Allow-Methods': STR_REQUEST_METHODS,
    'Access-Control-Allow-Headers': [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Auth',
        'Authorization',
    ].join(', '),
    // 'Access-Control-Allow-Credentials': 'true'
});

export const defaultCorsDomainConfig = Object.freeze(<CorsDomainConfig>{
    responseHeaders: defaultResponseHeaders,
    ports: '*',
    protocols: PROTOCOLS,
});
