import { Hero } from "@/components/hero"
import { TripPackages } from "@/components/trip-packages"
import { FeaturedBlog } from "@/components/featured-blog"
import { getTripPackages } from "@/lib/actions/packages"
import { getPublishedBlogPosts } from "@/lib/actions/blog"

export default async function HomePage() {
  const [packages, blogPosts] = await Promise.all([getTripPackages(), getPublishedBlogPosts()])

  return (
    <div>
      <Hero />
      <TripPackages packages={packages} />
      <FeaturedBlog posts={blogPosts.slice(0, 3)} />
    </div>
  )
}
