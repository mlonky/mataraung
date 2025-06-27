
"use server"

import { prisma } from "@/lib/prisma"
import type { BookingFormData } from "@/lib/types"
import { revalidatePath } from "next/cache"

export async function getBookings() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        package: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return bookings
  } catch (error) {
    console.error("Error fetching bookings:", error)
    throw new Error("Failed to fetch bookings")
  }
}

export async function getBookingById(id: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        package: true,
      },
    })
    return booking
  } catch (error) {
    console.error("Error fetching booking:", error)
    throw new Error("Failed to fetch booking")
  }
}

export async function createBooking(data: BookingFormData) {
  try {
    // Get package to calculate total price
    const package_ = await prisma.tripPackage.findUnique({
      where: { id: data.packageId },
    })

    if (!package_) {
      return { success: false, error: "Package not found" }
    }

    const totalPrice = package_.price * data.people

    const booking = await prisma.booking.create({
      data: {
        customerName: data.customerName,
        whatsapp: data.whatsapp,
        people: data.people,
        packageId: data.packageId,
        tripDate: new Date(data.tripDate),
        notes: data.notes,
        totalPrice: totalPrice,
        status: "PENDING",
      },
      include: {
        package: true,
      },
    })

    revalidatePath("/dashboard/bookings")
    return { success: true, booking }
  } catch (error) {
    console.error("Error creating booking:", error)
    return { success: false, error: "Failed to create booking" }
  }
}

export async function updateBookingStatus(id: string, status: "PENDING" | "CONFIRMED" | "DECLINED" | "CANCELLED") {
  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        package: true,
      },
    })

    revalidatePath("/dashboard/bookings")
    revalidatePath("/dashboard")
    return { success: true, booking }
  } catch (error) {
    console.error("Error updating booking status:", error)
    return { success: false, error: "Failed to update booking status" }
  }
}

export async function approveBooking(id: string) {
  return updateBookingStatus(id, "CONFIRMED")
}

export async function declineBooking(id: string) {
  return updateBookingStatus(id, "DECLINED")
}

export async function deleteBooking(id: string) {
  try {
    await prisma.booking.delete({
      where: { id },
    })

    revalidatePath("/dashboard/bookings")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting booking:", error)
    return { success: false, error: "Failed to delete booking" }
  }
}

export async function getBookingStats() {
  try {
    const [total, pending, confirmed, declined] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.booking.count({ where: { status: "DECLINED" } }),
    ])

    return {
      total,
      pending,
      confirmed,
      declined,
    }
  } catch (error) {
    console.error("Error fetching booking stats:", error)
    throw new Error("Failed to fetch booking stats")
  }
}
