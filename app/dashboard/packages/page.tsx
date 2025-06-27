import { PackagesClient } from "./packages-client"
import { getTripPackages } from "@/lib/actions/packages"

export default async function PackagesPage() {
  const packages = await getTripPackages()

  return <PackagesClient initialPackages={packages} />
}
