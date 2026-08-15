import highDemand1 from "@/lib/blog-image-data/high-demand-1"
import highDemand2 from "@/lib/blog-image-data/high-demand-2"
import highDemand3 from "@/lib/blog-image-data/high-demand-3"
import howTo1 from "@/lib/blog-image-data/how-to-1"
import howTo2 from "@/lib/blog-image-data/how-to-2"
import howTo3 from "@/lib/blog-image-data/how-to-3"
import salary1 from "@/lib/blog-image-data/salary-1"
import salary2 from "@/lib/blog-image-data/salary-2"
import salary3 from "@/lib/blog-image-data/salary-3"

export const runtime = "nodejs"

const images: Record<string, string[]> = {
  "high-demand-careers-australia-2026.avif": [highDemand1, highDemand2, highDemand3],
  "how-to-become-electrician-australia-2026.avif": [howTo1, howTo2, howTo3],
  "electrician-salary-australia-2026.avif": [salary1, salary2, salary3],
}

export async function GET(
  _request: Request,
  props: { params: Promise<{ name: string }> }
) {
  const { name } = await props.params
  const chunks = images[name]

  if (!chunks) {
    return new Response("Not found", { status: 404 })
  }

  const bytes = new Uint8Array(Buffer.from(chunks.join(""), "base64"))

  return new Response(bytes, {
    headers: {
      "Content-Type": "image/avif",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
