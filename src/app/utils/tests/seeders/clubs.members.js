import { clubsMembersFixture } from "~/fixtures"
import { seedArray } from "~/utils/tests/seed"

export default async (relations = {}) => {
  const members = await seedArray(
    "clubs_members",
    clubsMembersFixture.map(
      (member) => ({ ...member, ...relations })
    )
  )

  return members
}
