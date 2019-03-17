import { eventsDivisionsFixture } from "@/fixtures"
import { seedArray } from "@/utils/tests/seed"

export default async (relations = {}) => {
  const divisions = await seedArray(
    "events_divisions",
    eventsDivisionsFixture.map(
      (division) => ({ ...division, ...relations })
    )
  )

  return divisions
}
