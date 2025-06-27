import { TeamClient } from "./team-client"
import { getTeamMembers } from "@/lib/actions/team"

export default async function TeamPage() {
  const teamMembers = await getTeamMembers()

  return <TeamClient initialMembers={teamMembers} />
}
