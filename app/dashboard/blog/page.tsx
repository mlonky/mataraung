import { BlogClient } from "./blog-client"
import { getBlogPosts } from "@/lib/actions/blog"
import { getActiveTeamMembers } from "@/lib/actions/team"

export default async function BlogPage() {
  const [posts, authors] = await Promise.all([getBlogPosts(), getActiveTeamMembers()])

  return <BlogClient initialPosts={posts} authors={authors} />
}
