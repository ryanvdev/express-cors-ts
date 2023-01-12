import { Protocol } from '../types';

export function isValidProtocol(v: unknown): v is Protocol {
    return v === 'http' || v === 'https';
}

export function isValidPort(v: unknown): v is number {
    if (typeof v !== 'number') return false;

    if (isNaN(v) || !isFinite(v)) return false;

    return 1 <= v && v <= 65535;
}
