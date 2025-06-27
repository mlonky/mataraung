"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, Bell, Globe } from "lucide-react"
import { updateSettings } from "@/lib/actions/settings"
import type { Settings } from "@/lib/types"

interface SettingsClientProps {
  initialSettings: Settings
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState(initialSettings)

  const handleSave = async (section: string) => {
    setLoading(true)
    try {
      const result = await updateSettings(settings)
      if (result.success) {
        alert(`${section} settings saved successfully!`)
      } else {
        alert(`Error saving settings: ${result.error}`)
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Error saving settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola pengaturan website dan sistem</p>
      </div>

      <div className="grid gap-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Informasi Perusahaan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company-name">Nama Perusahaan</Label>
                <Input
                  id="company-name"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="company-email">Email</Label>
                <Input
                  id="company-email"
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="company-phone">Telepon</Label>
                <Input
                  id="company-phone"
                  value={settings.companyPhone}
                  onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="company-whatsapp">WhatsApp</Label>
                <Input
                  id="company-whatsapp"
                  value={settings.companyWhatsapp}
                  onChange={(e) => setSettings({ ...settings, companyWhatsapp: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="company-address">Alamat</Label>
              <Textarea
                id="company-address"
                value={settings.companyAddress}
                onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="company-description">Deskripsi Perusahaan</Label>
              <Textarea
                id="company-description"
                value={settings.companyDescription}
                onChange={(e) => setSettings({ ...settings, companyDescription: e.target.value })}
                rows={3}
              />
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleSave("Company")}
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              Simpan Perubahan
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Pengaturan Notifikasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifikasi Pemesanan Baru</Label>
                <p className="text-sm text-muted-foreground">Terima email ketika ada pemesanan baru</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>WhatsApp Notifikasi</Label>
                <p className="text-sm text-muted-foreground">Terima notifikasi WhatsApp untuk pemesanan urgent</p>
              </div>
              <Switch
                checked={settings.whatsappNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, whatsappNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifikasi Blog Baru</Label>
                <p className="text-sm text-muted-foreground">Notifikasi ketika artikel blog baru dipublikasi</p>
              </div>
              <Switch
                checked={settings.blogNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, blogNotifications: checked })}
              />
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleSave("Notification")}
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              Simpan Pengaturan
            </Button>
          </CardContent>
        </Card>

        {/* Website Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Website</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mode Maintenance</Label>
                <p className="text-sm text-muted-foreground">Aktifkan untuk menonaktifkan sementara website</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-approve Booking</Label>
                <p className="text-sm text-muted-foreground">Otomatis menyetujui semua pemesanan baru</p>
              </div>
              <Switch
                checked={settings.autoApproveBooking}
                onCheckedChange={(checked) => setSettings({ ...settings, autoApproveBooking: checked })}
              />
            </div>
            <Separator />
            <div>
              <Label htmlFor="max-booking">Maksimal Pemesanan per Hari</Label>
              <Input
                id="max-booking"
                type="number"
                value={settings.maxBookingPerDay}
                onChange={(e) => setSettings({ ...settings, maxBookingPerDay: Number(e.target.value) })}
              />
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleSave("Website")}
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              Simpan Pengaturan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
