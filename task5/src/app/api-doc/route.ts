import { ApiReference } from '@scalar/nextjs-api-reference';

const config = {
    url: '/api/docs',
    theme: 'default',
    layout: 'modern',
} as const;

export const GET = ApiReference(config);