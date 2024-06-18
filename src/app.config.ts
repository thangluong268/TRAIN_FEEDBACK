import { config } from 'dotenv';
config({ path: `.env` });

export const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_WORKERS_AI_TOKEN, HUGGING_FACE_ACCESS_TOKEN } = process.env;
