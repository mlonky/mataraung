import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getBlogPostBySlug, incrementBlogPostViews, getPublishedBlogPosts } from "@/lib/actions/blog"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post || post.status !== "PUBLISHED") {
    notFound()
  }

  await incrementBlogPostViews(post.id)

  const allPosts = await getPublishedBlogPosts()
  const relatedPosts = allPosts.filter((p: any) => p.id !== post.id && p.category === post.category).slice(0, 2)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/blog" className="inline-flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Blog
          </Link>
        </div>

        <article>
          {/* Header */}
          <header className="mb-8">
            <Badge className="mb-4 bg-blue-600">{post.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {post.author.name}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(post.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="text-gray-400">{post.views + 1} views</div>
              </div>

              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Bagikan
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          {post.image && (
            <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
              <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Artikel Terkait</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost: any) => (
                <div key={relatedPost.id} className="flex space-x-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={relatedPost.image || "/placeholder.svg?height=96&width=96"}
                      alt={relatedPost.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      <Link href={`/blog/${relatedPost.slug}`} className="hover:text-green-600">
                        {relatedPost.title}
                      </Link>
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{relatedPost.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
