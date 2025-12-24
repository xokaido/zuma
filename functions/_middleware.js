/**
 * Cloudflare Pages Functions Middleware
 * Entry point for server-side functionality
 * 
 * This middleware handles all requests and can be extended
 * to add API endpoints, authentication, or other server-side features.
 */

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // API routes placeholder for future server-side functionality
  if (url.pathname.startsWith('/api/')) {
    // Example API endpoint structure
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: Date.now() }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Placeholder for leaderboard API
    if (url.pathname === '/api/leaderboard') {
      // TODO: Implement with KV or D1 storage
      return new Response(JSON.stringify({ 
        message: 'Leaderboard API coming soon',
        scores: []
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 404 for unknown API routes
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // For all other requests, continue to static assets
  return next();
}
