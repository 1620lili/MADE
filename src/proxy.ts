import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';
import { getServiceSupabase } from '@/lib/supabase';

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (
    pathname.startsWith('/auth') ||
    pathname === '/' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') || 
    pathname.startsWith('/image') ||
    pathname.startsWith('/boutique')
  ) {
    return NextResponse.next();
  }

  const { supabase, response } = createClient(req);
  const adminSupabase = getServiceSupabase();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    // If trying to access a protected route without a session, bounce to auth
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  const { data: profile, error: profileError } = await adminSupabase
    .from('User')
    .select('id, companyId, isSuper')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile) {
    // If profile is missing but user is auth'd, let them see /auth to break the loop or finish registration
    const redirectResponse = NextResponse.redirect(new URL('/auth', req.url));
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  const isSuper = profile?.isSuper === true;

  // Check Super Admin routes
  if (pathname.startsWith('/admin')) {
    if (!isSuper) {
      const redirectResponse = NextResponse.redirect(new URL('/dashboard', req.url));
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      return redirectResponse;
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
