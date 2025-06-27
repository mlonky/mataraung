import { SettingsClient } from "./settings-client"
import { getSettings } from "@/lib/actions/settings"

export default async function SettingsPage() {
  const settings = await getSettings()

  return <SettingsClient initialSettings={settings} />
}
