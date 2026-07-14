import { redirect } from "next/navigation"

export default function SwitzerlandMapPage() {
  redirect("/map?country=ch")
}
