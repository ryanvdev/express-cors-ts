import {
    CorsConfigs,
    ExpressCorsMiddleware,
    OtherOriginsHandle,
    AllowedOrigin,
} from './types';
import { processAllowedOrigins } from './utils/pre-processing';
import withAllOrigins from './middleware/with-all-origins';
import withSelectiveOrigins from './middleware/with-selective-origins';
import { NextFunction, Request, Response } from 'express';

export interface ExpressCorsProps {
    /**
     * List of allowed origin configurations
     * @default '*'
     */
    allowedOrigins?: AllowedOrigin[] | '*';

    /**
     * Configuration other origins if the origin not exists in allowedOrigins
     * @default 'no-action'
     */
    otherOrigins?: OtherOriginsHandle;
}

/**
 * @default { allowedOrigins: '*', otherOrigins: 'no-action'}
 */

export function expressCors(props?: ExpressCorsProps): ExpressCorsMiddleware {
    if (!props) return withAllOrigins;

    const { allowedOrigins, otherOrigins } = props;

    if (!allowedOrigins || allowedOrigins === '*') {
        return withAllOrigins;
    }

    const corsConfigs: CorsConfigs = processAllowedOrigins(allowedOrigins);
    return withSelectiveOrigins(corsConfigs, otherOrigins || 'no-action');
}
