"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Calendar, ArrowLeft, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getTripPackages, getTripPackageById } from "@/lib/actions/packages"
import { createBooking } from "@/lib/actions/bookings"
import type { TripPackage } from "@/lib/types"

function BookingForm() {
  const searchParams = useSearchParams()
  const packageId = searchParams.get("package")
  const [packages, setPackages] = useState<TripPackage[]>([])
  const [selectedPackage, setSelectedPackage] = useState<TripPackage | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingId, setBookingId] = useState<string>("")
  const [formData, setFormData] = useState({
    customerName: "",
    whatsapp: "",
    people: 1,
    packageId: packageId || "",
    tripDate: "",
    notes: "",
  })

  useEffect(() => {
    async function loadData() {
      try {
        const packagesData = await getTripPackages()
        const activePackages = packagesData.filter((pkg: any) => pkg.status === "ACTIVE")
        setPackages(activePackages)

        if (packageId) {
          const pkg = await getTripPackageById(packageId)
          if (pkg && pkg.status === "ACTIVE") {
            setSelectedPackage(pkg)
            setFormData((prev) => ({ ...prev, packageId }))
          }
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [packageId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const result = await createBooking({
        customerName: formData.customerName,
        whatsapp: formData.whatsapp,
        people: formData.people,
        packageId: formData.packageId,
        tripDate: formData.tripDate,
        notes: formData.notes,
      })

      if (result.success && result.booking) {
        setBookingSuccess(true)
        setBookingId(result.booking.id)

        // Reset form
        setFormData({
          customerName: "",
          whatsapp: "",
          people: 1,
          packageId: packageId || "",
          tripDate: "",
          notes: "",
        })
      } else {
        alert("Gagal membuat pemesanan. Silakan coba lagi.")
      }
    } catch (error) {
      console.error("Error creating booking:", error)
      alert("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setSubmitting(false)
    }
  }

  const handlePackageChange = async (value: string) => {
    setFormData((prev) => ({ ...prev, packageId: value }))
    try {
      const pkg = await getTripPackageById(value)
      setSelectedPackage(pkg)
    } catch (error) {
      console.error("Error fetching package:", error)
    }
  }

  const totalPrice = selectedPackage ? selectedPackage.price * formData.people : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  // Success state
  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">Pemesanan Berhasil Dikirim!</h1>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h2 className="font-semibold text-green-800 mb-2">ID Pemesanan: {bookingId}</h2>
                <p className="text-green-700 text-sm">
                  Pemesanan Anda telah berhasil dikirim dan sedang menunggu persetujuan dari admin.
                </p>
              </div>

              <div className="space-y-4 text-left bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900">Langkah Selanjutnya:</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">
                      1
                    </div>
                    <p>Tim kami akan meninjau pemesanan Anda dalam 1x24 jam</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">
                      2
                    </div>
                    <p>
                      Jika disetujui, admin akan menghubungi Anda via WhatsApp untuk konfirmasi detail dan pembayaran
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">
                      3
                    </div>
                    <p>Pastikan nomor WhatsApp Anda ({formData.whatsapp}) aktif untuk dihubungi</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  <strong>Catatan:</strong> Pemesanan belum final sampai mendapat konfirmasi dari admin. Jangan
                  melakukan pembayaran sebelum mendapat konfirmasi resmi.
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Link href="/">
                  <Button variant="outline">Kembali ke Beranda</Button>
                </Link>
                <Button
                  onClick={() => {
                    setBookingSuccess(false)
                    setBookingId("")
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Buat Pemesanan Lain
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Package Details */}
          {selectedPackage && (
            <Card>
              <div className="relative h-64">
                <Image
                  src={selectedPackage.image || "/placeholder.svg?height=300&width=400"}
                  alt={selectedPackage.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <Badge className="absolute top-4 left-4 bg-green-600">{selectedPackage.duration}</Badge>
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{selectedPackage.name}</CardTitle>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {selectedPackage.location}
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 mb-4">{selectedPackage.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Max {selectedPackage.maxPeople} orang
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {selectedPackage.duration}
                  </div>
                </div>

                <div className="text-2xl font-bold text-green-600">
                  Rp {selectedPackage.price.toLocaleString("id-ID")}
                  <span className="text-sm text-gray-500 font-normal">/orang</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Form Pemesanan</CardTitle>
              <p className="text-sm text-gray-600">
                Isi form di bawah ini. Admin akan menghubungi Anda untuk konfirmasi.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                    required
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))}
                    required
                    placeholder="08xxxxxxxxxx"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Admin akan menghubungi Anda melalui nomor ini untuk konfirmasi
                  </p>
                </div>

                <div>
                  <Label htmlFor="package">Paket Trip</Label>
                  <Select value={formData.packageId} onValueChange={handlePackageChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih paket trip" />
                    </SelectTrigger>
                    <SelectContent>
                      {packages.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.name} - Rp {pkg.price.toLocaleString("id-ID")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="people">Jumlah Orang</Label>
                  <Select
                    value={formData.people.toString()}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, people: Number.parseInt(value) }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: selectedPackage?.maxPeople || 10 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} orang
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tripDate">Tanggal Trip yang Diinginkan</Label>
                  <Input
                    id="tripDate"
                    type="date"
                    value={formData.tripDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tripDate: e.target.value }))}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <p className="text-xs text-gray-500 mt-1">Tanggal ini masih bisa berubah sesuai ketersediaan</p>
                </div>

                <div>
                  <Label htmlFor="notes">Catatan atau Permintaan Khusus (Opsional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Contoh: Vegetarian, alergi makanan tertentu, dll."
                    rows={3}
                  />
                </div>

                {totalPrice > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Estimasi Total Harga:</span>
                      <span className="text-2xl font-bold text-green-600">Rp {totalPrice.toLocaleString("id-ID")}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.people} orang × Rp {selectedPackage?.price.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">*Harga final akan dikonfirmasi oleh admin</p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Proses Pemesanan:</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Kirim form pemesanan</li>
                    <li>2. Tunggu persetujuan admin (1x24 jam)</li>
                    <li>3. Admin akan menghubungi via WhatsApp</li>
                    <li>4. Konfirmasi detail & pembayaran</li>
                  </ol>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? "Mengirim Pemesanan..." : "Kirim Pemesanan"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingForm />
    </Suspense>
  )
}
