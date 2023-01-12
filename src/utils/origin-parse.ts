import { Protocol } from '../types';
import { isValidPort, isValidProtocol } from './check';

const processPort = (
    strPort: string | undefined,
    protocol: Protocol,
): number | undefined => {
    if (!strPort) {
        switch (protocol) {
            case 'http': {
                return 80;
            }
            case 'https': {
                return 443;
            }
            default: {
                return undefined;
            }
        }
    }

    const port = parseInt(strPort);

    if (!isValidPort(port)) {
        return undefined;
    }

    return port;
};

// @audit originParse
export interface OriginParseReturn {
    port: number;
    hostname: string;
    protocol: Protocol;
}

const originRegEx = /^([a-zA-Z0-9]+)\:\/\/([a-zA-Z0-9\-\.\_]+)(\:(\d+)){0,1}$/;
const originParse = (origin: string): OriginParseReturn | undefined => {
    const originMatched = origin.match(originRegEx);

    if (!originMatched) return undefined;

    const [_, rawProtocol, hostname, __, rawPort] = originMatched;

    const protocol: string | undefined = rawProtocol.toLowerCase();

    if (!isValidProtocol(protocol) || !hostname) {
        return undefined;
    }

    const port = processPort(rawPort, protocol);

    if (!port) return undefined;

    return {
        protocol,
        hostname,
        port,
    };
};

export default originParse;
