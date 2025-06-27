
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getSettings() {
  try {
    let settings = await prisma.settings.findFirst()

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          companyName: "MataRaung",
          companyEmail: "info@mataraung.com",
          companyPhone: "+62 812-3456-7890",
          companyWhatsapp: "6281234567890",
          companyAddress: "Jakarta, Indonesia",
          companyDescription: "Jelajahi keindahan Indonesia bersama MataRaung",
        },
      })
    }

    return settings
  } catch (error) {
    console.error("Error fetching settings:", error)
    throw new Error("Failed to fetch settings")
  }
}

export async function updateSettings(data: {
  companyName?: string
  companyEmail?: string
  companyPhone?: string
  companyWhatsapp?: string
  companyAddress?: string
  companyDescription?: string
  emailNotifications?: boolean
  whatsappNotifications?: boolean
  blogNotifications?: boolean
  maintenanceMode?: boolean
  autoApproveBooking?: boolean
  maxBookingPerDay?: number
}) {
  try {
    const settings = await prisma.settings.findFirst()

    if (!settings) {
      const newSettings = await prisma.settings.create({
        data: {
          companyName: data.companyName || "MataRaung",
          companyEmail: data.companyEmail || "info@mataraung.com",
          companyPhone: data.companyPhone || "+62 812-3456-7890",
          companyWhatsapp: data.companyWhatsapp || "6281234567890",
          companyAddress: data.companyAddress || "Jakarta, Indonesia",
          companyDescription: data.companyDescription || "Jelajahi keindahan Indonesia bersama MataRaung",
          emailNotifications: data.emailNotifications ?? true,
          whatsappNotifications: data.whatsappNotifications ?? true,
          blogNotifications: data.blogNotifications ?? false,
          maintenanceMode: data.maintenanceMode ?? false,
          autoApproveBooking: data.autoApproveBooking ?? false,
          maxBookingPerDay: data.maxBookingPerDay ?? 10,
        },
      })

      revalidatePath("/dashboard/settings")
      return { success: true, settings: newSettings }
    }

    const updatedSettings = await prisma.settings.update({
      where: { id: settings.id },
      data,
    })

    revalidatePath("/dashboard/settings")
    return { success: true, settings: updatedSettings }
  } catch (error) {
    console.error("Error updating settings:", error)
    return { success: false, error: "Failed to update settings" }
  }
}
