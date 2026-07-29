export const revalidate = 86400

export function GET(request: Request) {
  return Response.redirect(new URL("/sitemap.xml", request.url), 308)
}
