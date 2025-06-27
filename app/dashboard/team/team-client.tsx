"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Eye, Search, Star, Award, MapPin } from "lucide-react"
import Image from "next/image"
import { deleteTeamMember, toggleTeamMemberStatus } from "@/lib/actions/team"
import { TeamForm } from "@/components/forms/team-form"
import type { TeamMemberWithPosts } from "@/lib/types"

interface TeamClientProps {
  initialMembers: TeamMemberWithPosts[]
}

export function TeamClient({ initialMembers }: TeamClientProps) {
  const [members, setMembers] = useState(initialMembers)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<TeamMemberWithPosts | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>
        {status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
      </Badge>
    )
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus anggota tim ini?")) return

    setLoading(id)
    try {
      const result = await deleteTeamMember(id)
      if (result.success) {
        setMembers(members.filter((member) => member.id !== id))
      }
    } catch (error) {
      console.error("Error deleting team member:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleToggleStatus = async (id: string) => {
    setLoading(id)
    try {
      const result = await toggleTeamMemberStatus(id)
      if (result.success && result.member) {
        setMembers(members.map((member) => (member.id === id ? { ...member, status: result.member!.status } : member)))
      }
    } catch (error) {
      console.error("Error toggling team member status:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedMember(null)
    // Refresh members - in a real app, you might want to refetch data
    window.location.reload()
  }

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeMembers = members.filter((m) => m.status === "ACTIVE").length
  const totalTrips = members.reduce((sum, member) => sum + member.trips, 0)
  const avgRating = members.length > 0 ? members.reduce((sum, member) => sum + member.rating, 0) / members.length : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tim</h1>
          <p className="text-muted-foreground">Kelola anggota tim dan guide</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Anggota
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Anggota</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-xs text-muted-foreground">{activeMembers} anggota aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trip</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrips}</div>
            <p className="text-xs text-muted-foreground">Dari semua guide</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating Rata-rata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Dari semua guide</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {members.reduce((sum, member) => sum + member.blogPosts.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Blog posts ditulis</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Cari anggota tim..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Team Members */}
      <div className="grid gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-6">
              <div className="flex gap-6">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={member.image || "/placeholder.svg?height=300&width=300"}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{member.name}</h3>
                      <p className="text-green-600 font-medium">{member.role}</p>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {member.location}
                      </div>
                    </div>
                    {getStatusBadge(member.status)}
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">{member.bio}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Spesialisasi:</span>
                      <p className="font-medium">{member.specialization}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Pengalaman:</span>
                      <p className="font-medium">{member.experience}</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{member.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="font-medium">{member.trips} trips</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500 text-sm">Sertifikasi:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.achievements.slice(0, 3).map((achievement: any, index: any) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                      {member.achievements.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.achievements.length - 3} lainnya
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-gray-500">
                      Bergabung: {new Date(member.joinDate).toLocaleDateString("id-ID")} • {member.blogPosts.length}{" "}
                      artikel
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMember(member)
                          setShowDetail(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMember(member)
                          setShowForm(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(member.id)}
                        disabled={loading === member.id}
                      >
                        {member.status === "ACTIVE" ? "Nonaktifkan" : "Aktifkan"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => handleDelete(member.id)}
                        disabled={loading === member.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Tidak ada anggota tim yang ditemukan.</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <TeamForm
            member={selectedMember || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false)
              setSelectedMember(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Anggota Tim</DialogTitle>
            <DialogDescription>Informasi lengkap anggota tim</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <Image
                    src={selectedMember.image || "/placeholder.svg"}
                    alt={selectedMember.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedMember.name}</h3>
                  <p className="text-green-600 font-medium">{selectedMember.role}</p>
                  <div className="flex items-center gap-2 mt-1">{getStatusBadge(selectedMember.status)}</div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">{selectedMember.bio}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Spesialisasi:</strong> {selectedMember.specialization}
                  </div>
                  <div>
                    <strong>Pengalaman:</strong> {selectedMember.experience}
                  </div>
                  <div>
                    <strong>Lokasi:</strong> {selectedMember.location}
                  </div>
                  <div>
                    <strong>Rating:</strong> {selectedMember.rating}/5
                  </div>
                  <div>
                    <strong>Total Trips:</strong> {selectedMember.trips}
                  </div>
                  <div>
                    <strong>Artikel Blog:</strong> {selectedMember.blogPosts.length}
                  </div>
                </div>
                <div>
                  <strong>Sertifikasi & Pencapaian:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedMember.achievements.map((achievement: any, index: any) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
