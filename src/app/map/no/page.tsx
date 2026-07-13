import { redirect } from "next/navigation"

export default function NorwayMapPage() {
  redirect("/map?country=no")
}
