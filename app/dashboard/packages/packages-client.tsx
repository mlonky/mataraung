"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Eye, Search, MapPin, Calendar, Users } from "lucide-react"
import Image from "next/image"
import { deleteTripPackage, togglePackageStatus } from "@/lib/actions/packages"
import { PackageForm } from "@/components/forms/package-form"
import type { TripPackageWithBookings } from "@/lib/types"

interface PackagesClientProps {
  initialPackages: TripPackageWithBookings[]
}

export function PackagesClient({ initialPackages }: PackagesClientProps) {
  const [packages, setPackages] = useState(initialPackages)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<TripPackageWithBookings | null>(null)
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
    if (!confirm("Apakah Anda yakin ingin menghapus paket ini?")) return

    setLoading(id)
    try {
      const result = await deleteTripPackage(id)
      if (result.success) {
        setPackages(packages.filter((pkg) => pkg.id !== id))
      }
    } catch (error) {
      console.error("Error deleting package:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleToggleStatus = async (id: string) => {
    setLoading(id)
    try {
      const result = await togglePackageStatus(id)
      if (result.success && result.package) {
        setPackages(packages.map((pkg) => (pkg.id === id ? { ...pkg, status: result.package!.status } : pkg)))
      }
    } catch (error) {
      console.error("Error toggling package status:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedPackage(null)
    // Refresh packages - in a real app, you might want to refetch data
    window.location.reload()
  }

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activePackages = packages.filter((p) => p.status === "ACTIVE").length
  const totalRevenue = packages.reduce((sum, pkg) => {
    const confirmedBookings = pkg.bookings.filter((b: any) => b.status === "CONFIRMED")
    return sum + confirmedBookings.reduce((bookingSum: any, booking: any) => bookingSum + booking.totalPrice, 0)
  }, 0)
  const totalBookings = packages.reduce((sum, pkg) => sum + pkg.bookings.length, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paket Trip</h1>
          <p className="text-muted-foreground">Kelola semua paket trip yang tersedia</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Paket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{packages.length}</div>
            <p className="text-xs text-muted-foreground">{activePackages} paket aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">Dari semua paket</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString("id-ID")}</div>
            <p className="text-xs text-muted-foreground">Dari pemesanan terkonfirmasi</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Cari paket trip..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Packages Grid */}
      <div className="grid gap-6">
        {filteredPackages.map((pkg) => (
          <Card key={pkg.id}>
            <CardContent className="p-6">
              <div className="flex gap-6">
                <div className="relative w-48 h-32 flex-shrink-0">
                  <Image
                    src={pkg.image || "/placeholder.svg?height=300&width=400"}
                    alt={pkg.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{pkg.name}</h3>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {pkg.location}
                      </div>
                    </div>
                    {getStatusBadge(pkg.status)}
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">{pkg.description}</p>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {pkg.duration}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      Max {pkg.maxPeople} orang
                    </div>
                    <div className="text-gray-600">
                      {pkg.bookings.filter((b: any) => b.status === "CONFIRMED").length} pemesanan
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-green-600">
                      Rp {pkg.price.toLocaleString("id-ID")}
                      <span className="text-sm text-gray-500 font-normal">/orang</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPackage(pkg)
                          setShowDetail(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPackage(pkg)
                          setShowForm(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(pkg.id)}
                        disabled={loading === pkg.id}
                      >
                        {pkg.status === "ACTIVE" ? "Nonaktifkan" : "Aktifkan"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => handleDelete(pkg.id)}
                        disabled={loading === pkg.id}
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

      {filteredPackages.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Tidak ada paket yang ditemukan.</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <PackageForm
            package={selectedPackage || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false)
              setSelectedPackage(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Paket Trip</DialogTitle>
            <DialogDescription>Informasi lengkap paket trip</DialogDescription>
          </DialogHeader>
          {selectedPackage && (
            <div className="space-y-4">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src={selectedPackage.image || "/placeholder.svg"}
                  alt={selectedPackage.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{selectedPackage.name}</h3>
                <p className="text-gray-600">{selectedPackage.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Lokasi:</strong> {selectedPackage.location}
                  </div>
                  <div>
                    <strong>Durasi:</strong> {selectedPackage.duration}
                  </div>
                  <div>
                    <strong>Harga:</strong> Rp {selectedPackage.price.toLocaleString("id-ID")}
                  </div>
                  <div>
                    <strong>Max Peserta:</strong> {selectedPackage.maxPeople} orang
                  </div>
                  <div>
                    <strong>Status:</strong> {getStatusBadge(selectedPackage.status)}
                  </div>
                  <div>
                    <strong>Total Pemesanan:</strong> {selectedPackage.bookings.length}
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
