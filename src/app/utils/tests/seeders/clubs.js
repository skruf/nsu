import { clubsFixture } from "~/fixtures"
import { seedArray } from "~/utils/tests/seed"

export default async (relations = {}) => {
  const clubs = await seedArray(
    "clubs",
    clubsFixture.map(
      (club) => ({ ...club, ...relations })
    )
  )
  return clubs
}
