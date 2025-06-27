"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog"
import type { BlogPost, TeamMember } from "@/lib/types"

interface BlogFormProps {
  post?: BlogPost
  authors: TeamMember[]
  onSuccess?: () => void
  onCancel?: () => void
}

export function BlogForm({ post: existingPost, authors, onSuccess, onCancel }: BlogFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: existingPost?.title || "",
    slug: existingPost?.slug || "",
    excerpt: existingPost?.excerpt || "",
    content: existingPost?.content || "",
    image: existingPost?.image || "",
    category: existingPost?.category || "",
    authorId: existingPost?.authorId || "",
    status: (existingPost?.status || "DRAFT") as "DRAFT" | "PUBLISHED",
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = existingPost ? await updateBlogPost(existingPost.id, formData) : await createBlogPost(formData)

      if (result.success) {
        onSuccess?.()
      } else {
        alert(result.error || "Terjadi kesalahan")
      }
    } catch (error) {
      console.error("Error saving blog post:", error)
      alert("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const categories = ["Tips & Tricks", "Destinasi", "Budaya", "Kuliner", "Fotografi", "Adventure", "Travel Guide"]

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>{existingPost ? "Edit Artikel" : "Tulis Artikel Baru"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Judul Artikel</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="Judul artikel yang menarik..."
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug URL</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              placeholder="url-friendly-slug"
            />
            <p className="text-sm text-gray-500 mt-1">URL: /blog/{formData.slug}</p>
          </div>

          <div>
            <Label htmlFor="excerpt">Ringkasan</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
              placeholder="Ringkasan singkat artikel..."
              rows={3}
            />
          </div>

          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            onRemove={() => setFormData({ ...formData, image: "" })}
            folder="blog"
            label="Gambar Artikel"
            disabled={loading}
          />

          <div>
            <Label htmlFor="content">Konten Artikel</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              placeholder="Tulis konten artikel lengkap di sini..."
              rows={12}
              className="font-mono"
            />
            <p className="text-sm text-gray-500 mt-1">Mendukung HTML tags untuk formatting</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="authorId">Penulis</Label>
              <Select
                value={formData.authorId}
                onValueChange={(value) => setFormData({ ...formData, authorId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih penulis" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "DRAFT" | "PUBLISHED") => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Dipublikasi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? "Menyimpan..." : existingPost ? "Update Artikel" : "Simpan Artikel"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Batal
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
