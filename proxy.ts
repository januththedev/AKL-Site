import { NextResponse, type NextRequest } from 'next/server';
import { AI_ACCESS_MESSAGE, restrictAiRequest } from './lib/ai-access';

export function proxy(request: NextRequest) {
  if (restrictAiRequest(request.headers.get('user-agent'), request.nextUrl.pathname)) {
    return new NextResponse(request.method === 'HEAD' ? null : AI_ACCESS_MESSAGE, {
      status: 403,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'private, no-store',
        'Vary': 'User-Agent',
        'X-Content-Type-Options': 'nosniff',
        'Link': '</ai-policy.txt>; rel="describedby"',
      },
    });
  }
  return NextResponse.next();
}

// Assets and the downloadable profile are covered too; hashed framework bundles skip the proxy.
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
