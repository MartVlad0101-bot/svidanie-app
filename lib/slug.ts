import { randomBytes } from 'node:crypto';
export const newSlug = () => randomBytes(16).toString('base64url').slice(0, 10);