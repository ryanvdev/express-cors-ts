import { expressCors, ExpressCorsProps } from './express-cors';
import {
    OtherOriginsHandle,
    Protocol,
    RequestMethod,
    AllowedOriginConfig,
    ExpressCorsMiddleware,
    AllowedOrigin,
} from './types';

export type {
    Protocol,
    RequestMethod,
    AllowedOriginConfig,
    ExpressCorsMiddleware,
    ExpressCorsProps,
    AllowedOrigin,
    OtherOriginsHandle,
};

export { expressCors };
export default expressCors;
