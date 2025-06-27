"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { createTripPackage, updateTripPackage } from "@/lib/actions/packages"
import type { TripPackage } from "@/lib/types"

interface PackageFormProps {
  package?: TripPackage
  onSuccess?: () => void
  onCancel?: () => void
}

export function PackageForm({ package: existingPackage, onSuccess, onCancel }: PackageFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: existingPackage?.name || "",
    description: existingPackage?.description || "",
    image: existingPackage?.image || "",
    location: existingPackage?.location || "",
    price: existingPackage?.price || 0,
    duration: existingPackage?.duration || "",
    maxPeople: existingPackage?.maxPeople || 1,
    status: (existingPackage?.status || "ACTIVE") as "ACTIVE" | "INACTIVE",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = existingPackage
        ? await updateTripPackage(existingPackage.id, formData)
        : await createTripPackage(formData)

      if (result.success) {
        onSuccess?.()
      } else {
        alert(result.error || "Terjadi kesalahan")
      }
    } catch (error) {
      console.error("Error saving package:", error)
      alert("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{existingPackage ? "Edit Paket Trip" : "Tambah Paket Trip"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Nama Paket</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Contoh: Bromo Sunrise Adventure"
            />
          </div>

          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Deskripsi lengkap paket trip..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="location">Lokasi</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              placeholder="Contoh: Malang, Jawa Timur"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
                min="0"
                placeholder="850000"
              />
            </div>

            <div>
              <Label htmlFor="duration">Durasi</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
                placeholder="Contoh: 2D1N"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxPeople">Maksimal Peserta</Label>
              <Input
                id="maxPeople"
                type="number"
                value={formData.maxPeople}
                onChange={(e) => setFormData({ ...formData, maxPeople: Number(e.target.value) })}
                required
                min="1"
                placeholder="15"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "ACTIVE" | "INACTIVE") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Aktif</SelectItem>
                  <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            onRemove={() => setFormData({ ...formData, image: "" })}
            folder="packages"
            label="Gambar Paket Trip"
            disabled={loading}
          />

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? "Menyimpan..." : existingPackage ? "Update Paket" : "Tambah Paket"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Batal
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
