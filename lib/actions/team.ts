
"use server"

import { prisma } from "@/lib/prisma"
import type { TeamMemberFormData } from "@/lib/types"
import { revalidatePath } from "next/cache"

export async function getTeamMembers() {
  try {
    const members = await prisma.teamMember.findMany({
      include: {
        blogPosts: {
          where: {
            status: "PUBLISHED",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return members
  } catch (error) {
    console.error("Error fetching team members:", error)
    throw new Error("Failed to fetch team members")
  }
}

export async function getActiveTeamMembers() {
  try {
    const members = await prisma.teamMember.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return members
  } catch (error) {
    console.error("Error fetching active team members:", error)
    throw new Error("Failed to fetch active team members")
  }
}

export async function getTeamMemberById(id: string) {
  try {
    const member = await prisma.teamMember.findUnique({
      where: { id },
      include: {
        blogPosts: true,
      },
    })
    return member
  } catch (error) {
    console.error("Error fetching team member:", error)
    throw new Error("Failed to fetch team member")
  }
}

export async function createTeamMember(data: TeamMemberFormData) {
  try {
    const member = await prisma.teamMember.create({
      data: {
        name: data.name,
        role: data.role,
        specialization: data.specialization,
        experience: data.experience,
        location: data.location,
        image: data.image,
        bio: data.bio,
        achievements: data.achievements,
        rating: data.rating,
        status: data.status,
      },
    })

    revalidatePath("/dashboard/team")
    revalidatePath("/teams")
    return { success: true, member }
  } catch (error) {
    console.error("Error creating team member:", error)
    return { success: false, error: "Failed to create team member" }
  }
}

export async function updateTeamMember(id: string, data: TeamMemberFormData) {
  try {
    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        specialization: data.specialization,
        experience: data.experience,
        location: data.location,
        image: data.image,
        bio: data.bio,
        achievements: data.achievements,
        rating: data.rating,
        status: data.status,
      },
    })

    revalidatePath("/dashboard/team")
    revalidatePath("/teams")
    return { success: true, member }
  } catch (error) {
    console.error("Error updating team member:", error)
    return { success: false, error: "Failed to update team member" }
  }
}

export async function deleteTeamMember(id: string) {
  try {
    await prisma.teamMember.delete({
      where: { id },
    })

    revalidatePath("/dashboard/team")
    revalidatePath("/teams")
    return { success: true }
  } catch (error) {
    console.error("Error deleting team member:", error)
    return { success: false, error: "Failed to delete team member" }
  }
}

export async function toggleTeamMemberStatus(id: string) {
  try {
    const member = await prisma.teamMember.findUnique({
      where: { id },
    })

    if (!member) {
      return { success: false, error: "Team member not found" }
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id },
      data: {
        status: member.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      },
    })

    revalidatePath("/dashboard/team")
    revalidatePath("/teams")
    return { success: true, member: updatedMember }
  } catch (error) {
    console.error("Error toggling team member status:", error)
    return { success: false, error: "Failed to toggle team member status" }
  }
}
