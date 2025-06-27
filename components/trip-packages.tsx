import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { TripPackageWithBookings } from "@/lib/types"

interface TripPackagesProps {
  packages: TripPackageWithBookings[]
}

export function TripPackages({ packages }: TripPackagesProps) {
  const activePackages = packages.filter((pkg) => pkg.status === "ACTIVE")

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Paket Trip Pilihan</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilih petualangan impian Anda dari berbagai destinasi menakjubkan di Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activePackages.map((trip) => (
            <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={trip.image || "/placeholder.svg?height=300&width=400"}
                  alt={trip.name}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-green-600">{trip.duration}</Badge>
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{trip.name}</CardTitle>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {trip.location}
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{trip.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Max {trip.maxPeople} orang
                  </div>
                  <div className="text-xs">{trip.bookings.length} pemesanan</div>
                </div>

                <div className="text-2xl font-bold text-green-600">
                  Rp {trip.price.toLocaleString("id-ID")}
                  <span className="text-sm text-gray-500 font-normal">/orang</span>
                </div>
              </CardContent>

              <CardFooter>
                <Link href={`/booking?package=${trip.id}`} className="w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Pesan Sekarang</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
