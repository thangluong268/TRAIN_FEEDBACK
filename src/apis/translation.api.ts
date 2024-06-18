import { CLOUDFLARE_ACCOUNT_ID } from 'app.config';

export const TRANSLATION_API = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/m2m100-1.2b`;
