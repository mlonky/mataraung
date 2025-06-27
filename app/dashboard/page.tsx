import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Users, TrendingUp, Calendar } from "lucide-react"
import { getDashboardStats } from "@/lib/actions/dashboard"

export default async function DashboardPage() {
  const stats = await getDashboardStats()

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang di dashboard admin MataRaung</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paket</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPackages}</div>
            <p className="text-xs text-muted-foreground">{stats.activePackages} paket aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemesanan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">{stats.confirmedBookings} dikonfirmasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendapatan Bulan Ini</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {stats.monthlyRevenue.toLocaleString("id-ID")}</div>
            <p className="text-xs text-muted-foreground">Dari pemesanan terkonfirmasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Persetujuan</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">Perlu ditindaklanjuti</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Bookings */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Pemesanan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentBookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-semibold">{booking.customerName}</h4>
                    <p className="text-sm text-gray-600">{booking.package.name}</p>
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <span>{booking.people} orang</span>
                      <span>{new Date(booking.tripDate).toLocaleDateString("id-ID")}</span>
                      <span>Rp {booking.totalPrice.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    {getStatusBadge(booking.status)}
                    <p className="text-xs text-gray-500">{booking.whatsapp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Packages */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Paket Terpopuler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topPackages.map((pkg: any) => (
                <div key={pkg.name} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{pkg.name}</p>
                    <p className="text-xs text-muted-foreground">{pkg.bookings} pemesanan</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Rp {pkg.revenue.toLocaleString("id-ID")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
