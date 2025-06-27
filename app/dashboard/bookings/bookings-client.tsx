"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Check, X, Eye, Search, Filter, Calendar, MapPin, Users, Phone, MessageCircle } from "lucide-react"
import { approveBooking, declineBooking } from "@/lib/actions/bookings"
import type { BookingWithPackage } from "@/lib/types"

interface BookingsClientProps {
  initialBookings: BookingWithPackage[]
  stats: {
    total: number
    pending: number
    confirmed: number
    declined: number
  }
}

export function BookingsClient({ initialBookings, stats }: BookingsClientProps) {
  const [bookings, setBookings] = useState(initialBookings)
  const [selectedBooking, setSelectedBooking] = useState<BookingWithPackage | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      CONFIRMED: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      DECLINED: "bg-red-100 text-red-800",
    }
    const labels: { [key: string]: string } = {
      CONFIRMED: "Dikonfirmasi",
      PENDING: "Menunggu",
      DECLINED: "Ditolak",
    }
    return <Badge className={colors[status]}>{labels[status]}</Badge>
  }

  const handleApprove = async (bookingId: string) => {
    setLoading(bookingId)
    try {
      const result = await approveBooking(bookingId)
      if (result.success && result.booking) {
        setBookings(bookings.map((booking) => (booking.id === bookingId ? result.booking! : booking)))
      }
    } catch (error) {
      console.error("Error approving booking:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleDecline = async (bookingId: string) => {
    setLoading(bookingId)
    try {
      const result = await declineBooking(bookingId)
      if (result.success && result.booking) {
        setBookings(bookings.map((booking) => (booking.id === bookingId ? result.booking! : booking)))
      }
    } catch (error) {
      console.error("Error declining booking:", error)
    } finally {
      setLoading(null)
    }
  }

  const generateWhatsAppMessage = (booking: BookingWithPackage) => {
    const message = `Halo ${booking.customerName}! 

Selamat! Pemesanan trip Anda telah *DISETUJUI* ✅

*Detail Pemesanan:*
📋 ID: ${booking.id}
🎯 Paket: ${booking.package.name}
📍 Lokasi: ${booking.package.location}
👥 Jumlah: ${booking.people} orang
📅 Tanggal: ${new Date(booking.tripDate).toLocaleDateString("id-ID")}
💰 Total Harga: Rp ${booking.totalPrice.toLocaleString("id-ID")}

${booking.notes ? `📝 Catatan: ${booking.notes}` : ""}

*Langkah Selanjutnya:*
1️⃣ Konfirmasi ketersediaan Anda untuk tanggal tersebut
2️⃣ Kami akan kirim detail pembayaran
3️⃣ Setelah pembayaran, trip Anda akan dikonfirmasi final

Silakan balas pesan ini untuk konfirmasi. Terima kasih! 🙏

_Tim MataRaung_`

    return encodeURIComponent(message)
  }

  const openWhatsApp = (booking: BookingWithPackage) => {
    const message = generateWhatsAppMessage(booking)
    const whatsappUrl = `https://wa.me/${booking.whatsapp.replace(/^0/, "62")}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus.toUpperCase()
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.package.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pemesanan</h1>
        <p className="text-muted-foreground">Kelola semua pemesanan trip dari pelanggan</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Persetujuan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dikonfirmasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari nama pelanggan atau paket..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Menunggu</SelectItem>
            <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
            <SelectItem value="declined">Ditolak</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings List */}
      <div className="grid gap-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{booking.customerName}</h3>
                      <p className="text-sm text-gray-600">{booking.package.name}</p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {booking.people} orang
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(booking.tripDate).toLocaleDateString("id-ID")}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {booking.package.location}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {booking.whatsapp}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-green-600">
                      Rp {booking.totalPrice.toLocaleString("id-ID")}
                    </div>
                    <div className="text-xs text-gray-500">
                      Dipesan: {new Date(booking.createdAt).toLocaleDateString("id-ID")}
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Catatan:</strong> {booking.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Detail
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Detail Pemesanan</DialogTitle>
                      <DialogDescription>
                        Informasi lengkap pemesanan dari {selectedBooking?.customerName}
                      </DialogDescription>
                    </DialogHeader>
                    {selectedBooking && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Nama:</strong>
                            <p>{selectedBooking.customerName}</p>
                          </div>
                          <div>
                            <strong>WhatsApp:</strong>
                            <p>{selectedBooking.whatsapp}</p>
                          </div>
                          <div>
                            <strong>Paket:</strong>
                            <p>{selectedBooking.package.name}</p>
                          </div>
                          <div>
                            <strong>Jumlah:</strong>
                            <p>{selectedBooking.people} orang</p>
                          </div>
                          <div>
                            <strong>Tanggal Trip:</strong>
                            <p>{new Date(selectedBooking.tripDate).toLocaleDateString("id-ID")}</p>
                          </div>
                          <div>
                            <strong>Total Harga:</strong>
                            <p className="font-semibold text-green-600">
                              Rp {selectedBooking.totalPrice.toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                        {selectedBooking.notes && (
                          <div>
                            <strong>Catatan:</strong>
                            <p className="text-sm text-gray-600 mt-1">{selectedBooking.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                {booking.status === "CONFIRMED" && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => openWhatsApp(booking)}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Hubungi via WhatsApp
                  </Button>
                )}

                {booking.status === "PENDING" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                      onClick={() => handleDecline(booking.id)}
                      disabled={loading === booking.id}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Tolak
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(booking.id)}
                      disabled={loading === booking.id}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Setujui
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Tidak ada pemesanan yang ditemukan.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
