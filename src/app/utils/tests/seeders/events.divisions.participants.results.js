import { eventsDivisionsParticipantsResultsFixture } from "~/fixtures"
import { seedArray } from "~/utils/tests/seed"

export default async (relations = {}) => {
  const results = await seedArray(
    "events_divisions_participants_results",
    eventsDivisionsParticipantsResultsFixture.map(
      (result) => ({ ...result, ...relations })
    )
  )

  return results
}
