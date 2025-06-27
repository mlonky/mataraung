
"use server"

import { prisma } from "@/lib/prisma"

export async function getDashboardStats() {
  try {
    const [
      totalPackages,
      activePackages,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalBlogPosts,
      publishedBlogPosts,
      totalTeamMembers,
      activeTeamMembers,
    ] = await Promise.all([
      prisma.tripPackage.count(),
      prisma.tripPackage.count({ where: { status: "ACTIVE" } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
      prisma.teamMember.count(),
      prisma.teamMember.count({ where: { status: "ACTIVE" } }),
    ])

    // Calculate monthly revenue from confirmed bookings
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    const monthlyBookings = await prisma.booking.findMany({
      where: {
        status: "CONFIRMED",
        createdAt: {
          gte: currentMonth,
          lt: nextMonth,
        },
      },
    })

    const monthlyRevenue = monthlyBookings.reduce((sum: any, booking: any) => sum + booking.totalPrice, 0)

    // Get recent bookings
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      include: {
        package: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get top packages by bookings
    const topPackages = await prisma.tripPackage.findMany({
      include: {
        bookings: {
          where: {
            status: "CONFIRMED",
          },
        },
      },
    })

    const topPackagesWithStats = topPackages
      .map((pkg) => ({
        name: pkg.name,
        bookings: pkg.bookings.length,
        revenue: pkg.bookings.reduce((sum, booking) => sum + booking.totalPrice, 0),
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 3)

    return {
      totalPackages,
      activePackages,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalBlogPosts,
      publishedBlogPosts,
      totalTeamMembers,
      activeTeamMembers,
      monthlyRevenue,
      recentBookings,
      topPackages: topPackagesWithStats,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    throw new Error("Failed to fetch dashboard stats")
  }
}
