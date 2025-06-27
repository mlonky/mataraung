"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/ui/image-upload"
import { X } from "lucide-react"
import { createTeamMember, updateTeamMember } from "@/lib/actions/team"
import type { TeamMember } from "@/lib/types"

interface TeamFormProps {
  member?: TeamMember
  onSuccess?: () => void
  onCancel?: () => void
}

export function TeamForm({ member: existingMember, onSuccess, onCancel }: TeamFormProps) {
  const [loading, setLoading] = useState(false)
  const [newAchievement, setNewAchievement] = useState("")
  const [formData, setFormData] = useState({
    name: existingMember?.name || "",
    role: existingMember?.role || "",
    specialization: existingMember?.specialization || "",
    experience: existingMember?.experience || "",
    location: existingMember?.location || "",
    image: existingMember?.image || "",
    bio: existingMember?.bio || "",
    achievements: existingMember?.achievements || [],
    rating: existingMember?.rating || 0,
    status: (existingMember?.status || "ACTIVE") as "ACTIVE" | "INACTIVE",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = existingMember
        ? await updateTeamMember(existingMember.id, formData)
        : await createTeamMember(formData)

      if (result.success) {
        onSuccess?.()
      } else {
        alert(result.error || "Terjadi kesalahan")
      }
    } catch (error) {
      console.error("Error saving team member:", error)
      alert("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, newAchievement.trim()],
      })
      setNewAchievement("")
    }
  }

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_: any, i: any) => i !== index),
    })
  }

  const roles = [
    "Founder & Lead Guide",
    "Senior Guide",
    "Mountain Guide",
    "Marine Guide",
    "Cultural Guide",
    "Adventure Guide",
    "Photography Guide",
    "Culinary Guide",
  ]

  const specializations = [
    "Pendakian Gunung",
    "Diving & Snorkeling",
    "Wisata Budaya",
    "Multi-Activity",
    "Food Tourism",
    "Photo Tours",
    "Adventure Sports",
    "Nature Photography",
  ]

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{existingMember ? "Edit Anggota Tim" : "Tambah Anggota Tim"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Nama lengkap anggota tim"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Posisi/Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="specialization">Spesialisasi</Label>
              <Select
                value={formData.specialization}
                onValueChange={(value) => setFormData({ ...formData, specialization: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih spesialisasi" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience">Pengalaman</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                required
                placeholder="Contoh: 5 tahun"
              />
            </div>

            <div>
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                placeholder="Contoh: Jakarta"
              />
            </div>
          </div>

          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            onRemove={() => setFormData({ ...formData, image: "" })}
            folder="team"
            label="Foto Profil"
            disabled={loading}
          />

          <div>
            <Label htmlFor="bio">Bio/Deskripsi</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              required
              placeholder="Deskripsi singkat tentang anggota tim..."
              rows={4}
            />
          </div>

          <div>
            <Label>Sertifikasi & Pencapaian</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="Tambah sertifikasi..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())}
              />
              <Button type="button" onClick={addAchievement} variant="outline">
                Tambah
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.achievements.map((achievement: any, index: any) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {achievement}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeAchievement(index)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                required
                placeholder="4.5"
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

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? "Menyimpan..." : existingMember ? "Update Anggota" : "Tambah Anggota"}
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
