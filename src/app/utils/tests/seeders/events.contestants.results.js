import { eventsContestantsResultsFixture } from "~/fixtures"
import { seedArray } from "~/utils/tests/seed"

export default async (relations = {}) => {
  const results = await seedArray(
    "events_contestants_results",
    eventsContestantsResultsFixture.map(
      (result) => ({ ...result, ...relations })
    )
  )

  return results
}
