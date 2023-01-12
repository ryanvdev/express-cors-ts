import { NextFunction, Request, Response, response } from 'express';
import { ExpressCorsMiddleware, RequestMethod } from '../types';
import { ACCESS_CONTROL_ALLOW_ORIGIN, OPTIONS_METHOD } from '../utils/constants';
import { defaultResponseHeaders } from '../utils/default-config';

const withAllOrigins: ExpressCorsMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const origin = req.get('Origin');

    if (!origin) {
        next();
        return;
    }

    res.setHeader(ACCESS_CONTROL_ALLOW_ORIGIN, origin);

    for (const key in defaultResponseHeaders) {
        res.setHeader(key, defaultResponseHeaders[key]);
    }

    //! ============== RETURN ===========================
    if (req.method === OPTIONS_METHOD) {
        res.sendStatus(202);
        return;
    }

    next();
};

export default withAllOrigins;
