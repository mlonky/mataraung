
"use server"

import { prisma } from "@/lib/prisma"
import type { TripPackageFormData } from "@/lib/types"
import { revalidatePath } from "next/cache"

export async function getTripPackages() {
  try {
    const packages = await prisma.tripPackage.findMany({
      include: {
        bookings: {
          where: {
            status: "CONFIRMED",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return packages
  } catch (error) {
    console.error("Error fetching trip packages:", error)
    throw new Error("Failed to fetch trip packages")
  }
}

export async function getTripPackageById(id: string) {
  try {
    const package_ = await prisma.tripPackage.findUnique({
      where: { id },
      include: {
        bookings: true,
      },
    })
    return package_
  } catch (error) {
    console.error("Error fetching trip package:", error)
    throw new Error("Failed to fetch trip package")
  }
}

export async function createTripPackage(data: TripPackageFormData) {
  try {
    const package_ = await prisma.tripPackage.create({
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        location: data.location,
        price: data.price,
        duration: data.duration,
        maxPeople: data.maxPeople,
        status: data.status,
      },
    })

    revalidatePath("/dashboard/packages")
    revalidatePath("/")
    return { success: true, package: package_ }
  } catch (error) {
    console.error("Error creating trip package:", error)
    return { success: false, error: "Failed to create trip package" }
  }
}

export async function updateTripPackage(id: string, data: TripPackageFormData) {
  try {
    const package_ = await prisma.tripPackage.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        location: data.location,
        price: data.price,
        duration: data.duration,
        maxPeople: data.maxPeople,
        status: data.status,
      },
    })

    revalidatePath("/dashboard/packages")
    revalidatePath("/")
    return { success: true, package: package_ }
  } catch (error) {
    console.error("Error updating trip package:", error)
    return { success: false, error: "Failed to update trip package" }
  }
}

export async function deleteTripPackage(id: string) {
  try {
    await prisma.tripPackage.delete({
      where: { id },
    })

    revalidatePath("/dashboard/packages")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting trip package:", error)
    return { success: false, error: "Failed to delete trip package" }
  }
}

export async function togglePackageStatus(id: string) {
  try {
    const package_ = await prisma.tripPackage.findUnique({
      where: { id },
    })

    if (!package_) {
      return { success: false, error: "Package not found" }
    }

    const updatedPackage = await prisma.tripPackage.update({
      where: { id },
      data: {
        status: package_.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      },
    })

    revalidatePath("/dashboard/packages")
    revalidatePath("/")
    return { success: true, package: updatedPackage }
  } catch (error) {
    console.error("Error toggling package status:", error)
    return { success: false, error: "Failed to toggle package status" }
  }
}
