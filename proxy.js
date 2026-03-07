import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// protected routes
const isProtectedRoute = createRouteMatcher([
  "/doctors(.*)",
  "/admin(.*)",
  "/doctor(.*)",
  "/video-call(.*)",
  "/appointments(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // if not logged in and accessing protected route
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};