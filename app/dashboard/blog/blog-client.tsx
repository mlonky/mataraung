"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Eye, Search, Calendar, User, BarChart3 } from "lucide-react"
import { deleteBlogPost, toggleBlogPostStatus } from "@/lib/actions/blog"
import { BlogForm } from "@/components/forms/blog-form"
import type { BlogPostWithAuthor, TeamMember } from "@/lib/types"

interface BlogClientProps {
  initialPosts: BlogPostWithAuthor[]
  authors: TeamMember[]
}

export function BlogClient({ initialPosts, authors }: BlogClientProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<BlogPostWithAuthor | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "PUBLISHED" ? "default" : "secondary"}>
        {status === "PUBLISHED" ? "Dipublikasi" : "Draft"}
      </Badge>
    )
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return

    setLoading(id)
    try {
      const result = await deleteBlogPost(id)
      if (result.success) {
        setPosts(posts.filter((post) => post.id !== id))
      }
    } catch (error) {
      console.error("Error deleting blog post:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleToggleStatus = async (id: string) => {
    setLoading(id)
    try {
      const result = await toggleBlogPostStatus(id)
      if (result.success && result.post) {
        setPosts(posts.map((post) => (post.id === id ? result.post! : post)))
      }
    } catch (error) {
      console.error("Error toggling blog post status:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedPost(null)
    // Refresh posts - in a real app, you might want to refetch data
    window.location.reload()
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || post.status === filterStatus.toUpperCase()
    return matchesSearch && matchesStatus
  })

  const publishedCount = posts.filter((p) => p.status === "PUBLISHED").length
  const draftCount = posts.filter((p) => p.status === "DRAFT").length
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground">Kelola semua artikel blog</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tulis Artikel
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dipublikasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{draftCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari artikel atau penulis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="published">Dipublikasi</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Blog Posts */}
      <div className="grid gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    {getStatusBadge(post.status)}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.excerpt}</p>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {post.author.name}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(post.createdAt).toLocaleDateString("id-ID")}
                    </div>
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      {post.views.toLocaleString()} views
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPost(post)
                      setShowDetail(true)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPost(post)
                      setShowForm(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(post.id)}
                    disabled={loading === post.id}
                  >
                    {post.status === "PUBLISHED" ? "Draft" : "Publish"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                    onClick={() => handleDelete(post.id)}
                    disabled={loading === post.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Tidak ada artikel yang ditemukan.</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <BlogForm
            post={selectedPost || undefined}
            authors={authors}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false)
              setSelectedPost(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview Artikel</DialogTitle>
            <DialogDescription>Preview artikel blog</DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{selectedPost.title}</h3>
                  {getStatusBadge(selectedPost.status)}
                </div>
                <p className="text-gray-600">{selectedPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Penulis: {selectedPost.author.name}</span>
                  <span>Kategori: {selectedPost.category}</span>
                  <span>Views: {selectedPost.views}</span>
                </div>
              </div>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
