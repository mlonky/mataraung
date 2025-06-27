import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Award } from "lucide-react"
import Image from "next/image"
import { getActiveTeamMembers } from "@/lib/actions/team"

export default async function TeamsPage() {
  const teamMembers = await getActiveTeamMembers()

  // Calculate stats
  const totalTrips = teamMembers.reduce((sum: any, member: any) => sum + member.trips, 0)
  const avgRating =
    teamMembers.length > 0 ? teamMembers.reduce((sum: any, member: any) => sum + member.rating, 0) / teamMembers.length : 0
  const totalExperience = teamMembers.reduce((sum: any, member: any) => {
    const years = Number.parseInt(member.experience.replace(/\D/g, "")) || 0
    return sum + years
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tim MataRaung</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kenali tim profesional kami yang siap memandu petualangan tak terlupakan Anda di seluruh Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member: any) => (
            <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-64">
                <Image
                  src={member.image || "/placeholder.svg?height=300&width=300"}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-green-600">{member.experience}</Badge>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-green-600 font-semibold mb-2">{member.role}</p>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {member.location}
                  </div>
                </div>

                <div className="mb-4">
                  <Badge variant="outline" className="mb-2">
                    {member.specialization}
                  </Badge>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Sertifikasi:</h4>
                  <div className="flex flex-wrap gap-1">
                    {member.achievements.map((achievement: any, index: any) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-semibold">{member.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-blue-500 mr-1" />
                    <span>{member.trips} trips</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Stats */}
        <div className="mt-16 bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Mengapa Memilih Tim MataRaung?</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">{totalExperience}+</div>
              <p className="text-gray-600">Tahun Pengalaman Gabungan</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">{totalTrips}+</div>
              <p className="text-gray-600">Trip Berhasil</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">{avgRating.toFixed(1)}</div>
              <p className="text-gray-600">Rating Rata-rata</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <p className="text-gray-600">Kepuasan Pelanggan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
