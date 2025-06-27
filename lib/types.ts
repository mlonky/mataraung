
import type { Prisma } from "@prisma/client"

export type TripPackage = Prisma.TripPackageGetPayload<{}>
export type TripPackageWithBookings = Prisma.TripPackageGetPayload<{
  include: { bookings: true }
}>

export type Booking = Prisma.BookingGetPayload<{}>
export type BookingWithPackage = Prisma.BookingGetPayload<{
  include: { package: true }
}>

export type BlogPost = Prisma.BlogPostGetPayload<{}>
export type BlogPostWithAuthor = Prisma.BlogPostGetPayload<{
  include: { author: true }
}>

export type TeamMember = Prisma.TeamMemberGetPayload<{}>
export type TeamMemberWithPosts = Prisma.TeamMemberGetPayload<{
  include: { blogPosts: true }
}>

export type Settings = Prisma.SettingsGetPayload<{}>

export interface BookingFormData {
  customerName: string
  whatsapp: string
  people: number
  packageId: string
  tripDate: string
  notes?: string
}

export interface TripPackageFormData {
  name: string
  description: string
  image?: string
  location: string
  price: number
  duration: string
  maxPeople: number
  status: "ACTIVE" | "INACTIVE"
}

export interface BlogPostFormData {
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string
  category: string
  authorId: string
  status: "DRAFT" | "PUBLISHED"
}

export interface TeamMemberFormData {
  name: string
  role: string
  specialization: string
  experience: string
  location: string
  image?: string
  bio: string
  achievements: string[]
  rating: number
  status: "ACTIVE" | "INACTIVE"
}
