import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, User, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getPublishedBlogPosts } from "@/lib/actions/blog"

export default async function BlogPage() {
  const blogPosts = await getPublishedBlogPosts()

  // Get unique categories
  const categories = ["Semua", ...Array.from(new Set(blogPosts.map((post: any) => post.category)))]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Blog MataRaung</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tips, panduan, dan cerita menarik seputar petualangan di Indonesia
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Cari artikel..." className="pl-10" />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category: any) => (
                <Badge key={category} variant="outline" className="cursor-pointer hover:bg-green-600 hover:text-white">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post: any) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={post.image || "/placeholder.svg?height=200&width=300"}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-blue-600">{post.category}</Badge>
              </div>

              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-green-600">
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {post.author.name}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(post.createdAt).toLocaleDateString("id-ID")}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {blogPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada artikel yang dipublikasi.</p>
          </div>
        )}
      </div>
    </div>
  )
}
