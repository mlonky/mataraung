
"use server"

import { prisma } from "@/lib/prisma"
import type { BlogPostFormData } from "@/lib/types"
import { revalidatePath } from "next/cache"

export async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return posts
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    throw new Error("Failed to fetch blog posts")
  }
}

export async function getPublishedBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return posts
  } catch (error) {
    console.error("Error fetching published blog posts:", error)
    throw new Error("Failed to fetch published blog posts")
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: true,
      },
    })
    return post
  } catch (error) {
    console.error("Error fetching blog post:", error)
    throw new Error("Failed to fetch blog post")
  }
}

export async function createBlogPost(data: BlogPostFormData) {
  try {
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image,
        category: data.category,
        authorId: data.authorId,
        status: data.status,
      },
      include: {
        author: true,
      },
    })

    revalidatePath("/dashboard/blog")
    revalidatePath("/blog")
    return { success: true, post }
  } catch (error) {
    console.error("Error creating blog post:", error)
    return { success: false, error: "Failed to create blog post" }
  }
}

export async function updateBlogPost(id: string, data: BlogPostFormData) {
  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image,
        category: data.category,
        authorId: data.authorId,
        status: data.status,
      },
      include: {
        author: true,
      },
    })

    revalidatePath("/dashboard/blog")
    revalidatePath("/blog")
    return { success: true, post }
  } catch (error) {
    console.error("Error updating blog post:", error)
    return { success: false, error: "Failed to update blog post" }
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({
      where: { id },
    })

    revalidatePath("/dashboard/blog")
    revalidatePath("/blog")
    return { success: true }
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return { success: false, error: "Failed to delete blog post" }
  }
}

export async function incrementBlogPostViews(id: string) {
  try {
    await prisma.blogPost.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    })
  } catch (error) {
    console.error("Error incrementing blog post views:", error)
  }
}

export async function toggleBlogPostStatus(id: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!post) {
      return { success: false, error: "Post not found" }
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        status: post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
      },
      include: {
        author: true,
      },
    })

    revalidatePath("/dashboard/blog")
    revalidatePath("/blog")
    return { success: true, post: updatedPost }
  } catch (error) {
    console.error("Error toggling blog post status:", error)
    return { success: false, error: "Failed to toggle blog post status" }
  }
}
