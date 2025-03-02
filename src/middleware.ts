import {
  // LOGIN_REDIRECT,
  apiAuthPrefix,
  apiPrefixRoutes,
  authRoutes,
  homeUrl,
  publicGroupRoute,
  publicRoutes,
} from "./config/routesConfig";
import authProvidersConfig from "@/config/authProvidersConfig";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
const { auth } = NextAuth(authProvidersConfig);

export default auth((req) => {
  const { nextUrl } = req;

  // Check if the user is logged in
  const isLoggedIn = !!req.auth;

  // Route type checks
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isApiRoute = nextUrl.pathname.startsWith(apiPrefixRoutes);

  // Check if the route matches public group routes
  const isPublicGroupRoute = publicGroupRoute.some((route) => {
    const routeRegex = new RegExp(`^${route}(\\/|$)`); // Match "/p" or "/p/...".
    return routeRegex.test(nextUrl.pathname);
  });

  if (isApiRoute || isApiAuthRoute || isPublicGroupRoute) {
    return NextResponse.next();
  }

  // Handle authenticated routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(homeUrl, nextUrl));
    }
    return NextResponse.next();
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    // if (nextUrl.search) {
    //   callbackUrl += nextUrl.search;
    // }

    // const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    // const url = new URL(
    //   `/auth/login?callbackUrl=${encodeURIComponent(`${DEFAULT_AFTER_LOGIN_REDIRECT}?callbackUrl=${callbackUrl}`)}`,
    //   nextUrl,
    // );
    // return NextResponse.redirect(url);
    // // return NextResponse.redirect(
    // //   new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    // // );

    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }

  // Allow other requests to proceed
  return NextResponse.next();
});
export const config = {
  // matcher: ["/((?!.+\\.[\\w]+$|_next|slug=media).*)", "/", "/(api|trpc)(.*)"],
  // matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
