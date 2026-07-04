import { fetchGitHubData, fetchProfileViews } from "./github";
import { compileProfileStats } from "./stats";
import { renderSummarySVG, renderLanguagesSVG, renderActivitySVG, renderFallbackSVG } from "./svg";

export interface Env {
  GITHUB_TOKEN?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const username = "PraveenAmujuri";

    // 1. Caching Check (Cloudflare Cache API)
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), {
      method: "GET",
      headers: request.headers
    });
    
    // Only cache GET requests
    if (request.method === "GET") {
      const cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) {
        console.log(`Cache hit for path: ${path}`);
        return cachedResponse;
      }
    }

    // 2. Fetch and Compile Stats
    let svgContent = "";
    try {
      const githubToken = env.GITHUB_TOKEN;
      if (!githubToken) {
        throw new Error("Missing GITHUB_TOKEN Cloudflare Secret variable.");
      }

      // Fetch views and raw GitHub data concurrently
      const [raw, views] = await Promise.all([
        fetchGitHubData(username, githubToken),
        fetchProfileViews(username)
      ]);

      const stats = compileProfileStats(username, raw, views);

      // Route mapping
      if (path === "/" || path === "/summary.svg" || path === "/profile.svg") {
        svgContent = renderSummarySVG(stats);
      } else if (path === "/languages.svg") {
        svgContent = renderLanguagesSVG(stats);
      } else if (path === "/activity.svg") {
        svgContent = renderActivitySVG(stats);
      } else {
        return new Response("Not Found", { status: 404 });
      }

      // Construct Response with caching headers
      const response = new Response(svgContent, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=1800, s-maxage=1800, stale-while-revalidate=600"
        }
      });

      // Write to Cache asynchronously
      if (request.method === "GET") {
        ctx.waitUntil(cache.put(cacheKey, response.clone()));
      }

      return response;

    } catch (error) {
      console.error("Worker Execution Error:", error);

      // Fallback Strategy:
      // Try to recover any stale cached SVG (even if request headers differ)
      try {
        const cachedFallback = await cache.match(cacheKey);
        if (cachedFallback) {
          console.log("Serving stale cache as fallback due to error.");
          return cachedFallback;
        }
      } catch (cacheErr) {
        console.error("Error retrieving fallback cache:", cacheErr);
      }

      // Return a graceful vector SVG instead of an HTTP 500 error page
      return new Response(renderFallbackSVG(), {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      });
    }
  }
};
