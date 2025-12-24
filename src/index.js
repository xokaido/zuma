import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
const assetManifest = JSON.parse(manifestJSON);

/**
 * The Worker Entry Point
 * Handles all incoming requests, routing them to either static assets or API endpoints.
 */
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // API Routes (Server-side functionality)
        if (url.pathname.startsWith('/api/')) {
            return handleApiRequest(request, env);
        }

        // Static Assets
        try {
            // Add logic here to customize asset serving if needed
            return await getAssetFromKV(
                {
                    request,
                    waitUntil: ctx.waitUntil.bind(ctx),
                },
                {
                    ASSET_NAMESPACE: env.__STATIC_CONTENT,
                    ASSET_MANIFEST: assetManifest,
                }
            );
        } catch (e) {
            if (e.status === 404) {
                return new Response('Not Found', { status: 404 });
            }
            return new Response('Internal Error: ' + e.message, { status: 500 });
        }
    },
};

/**
 * Handle API requests
 * @param {Request} request 
 * @param {Object} env 
 * @returns {Response}
 */
async function handleApiRequest(request, env) {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === '/api/health') {
        return new Response(JSON.stringify({
            status: 'ok',
            time: new Date().toISOString(),
            worker: 'active'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Example: Leaderboard endpoint (placeholder)
    if (url.pathname === '/api/leaderboard') {
        return new Response(JSON.stringify({
            scores: [] // Connect to KV or D1 here later
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
    });
}
