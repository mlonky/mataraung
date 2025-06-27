import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { BlogPostWithAuthor } from "@/lib/types"

interface FeaturedBlogProps {
  posts: BlogPostWithAuthor[]
}

export function FeaturedBlog({ posts }: FeaturedBlogProps) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Blog Terbaru</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Baca tips, panduan, dan cerita menarik seputar petualangan di Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {posts.map((post) => (
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

        <div className="text-center">
          <Link href="/blog">
            <Button variant="outline" size="lg">
              Lihat Semua Blog
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
