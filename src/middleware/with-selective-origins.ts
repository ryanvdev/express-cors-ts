import { NextFunction, Request, Response } from 'express';
import { CorsConfigs, ExpressCorsMiddleware, OtherOriginsHandle } from '../types';
import { ACCESS_CONTROL_ALLOW_ORIGIN, OPTIONS_METHOD } from '../utils/constants';
import originParse from '../utils/origin-parse';

const withSelectiveOrigins = (
    configs: CorsConfigs,
    otherOriginsHandle: OtherOriginsHandle,
): ExpressCorsMiddleware => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const deny = async () => {
            if (req.method === OPTIONS_METHOD) {
                res.sendStatus(403);
                res.end();
                return;
            }

            if (typeof otherOriginsHandle === 'function') {
                await otherOriginsHandle(req, res, next);
                return;
            }

            switch (otherOriginsHandle) {
                case 'no-action': {
                    next();
                    return;
                }
                case 'deny': {
                    res.sendStatus(403);
                    res.end();
                    return;
                }
                default: {
                    throw new Error(`Invalid otherOrigins = ${otherOriginsHandle}`);
                }
            }
        };

        const origin = req.headers['origin'];

        if (!origin) {
            next();
            return;
        }

        const parsedOrigin = originParse(origin);
        if (!parsedOrigin) {
            res.status(400).send(`Invalid origin header: "Origin: ${origin}"`);
            res.end();
            return;
        }

        const { hostname, port, protocol } = parsedOrigin;
        const hostnameConfig = configs[hostname];

        // check host name
        if (!hostnameConfig) {
            return await deny();
        }

        // check port
        if (hostnameConfig.ports !== '*' && !hostnameConfig.ports.includes(port)) {
            return await deny();
        }

        // check protocol
        if (!hostnameConfig.protocols.includes(protocol)) {
            return await deny();
        }

        // ============ PASS =================

        res.setHeader(ACCESS_CONTROL_ALLOW_ORIGIN, origin);

        for (const key in hostnameConfig.responseHeaders) {
            res.setHeader(key, hostnameConfig.responseHeaders[key]);
        }

        // next ======

        if (req.method === OPTIONS_METHOD) {
            res.sendStatus(202);
            res.end();
            return;
        }

        next();
    };
};

export default withSelectiveOrigins;
