import { eventsDivisionsContestantsFixture } from "@/fixtures"
import { seedArray } from "@/utils/tests/seed"

export default async (relations = {}) => {
  const contestants = await seedArray(
    "events_divisions_contestants",
    eventsDivisionsContestantsFixture.map(
      (contestant) => ({ ...contestant, ...relations })
    )
  )

  return contestants
}
