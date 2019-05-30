import { eventsContestantsFixture } from "~/fixtures"
import { seedArray } from "~/utils/tests/seed"

export default async (relations = {}) => {
  const contestants = await seedArray(
    "events_contestants",
    eventsContestantsFixture.map(
      (contestant) => ({ ...contestant, ...relations })
    )
  )

  return contestants
}
