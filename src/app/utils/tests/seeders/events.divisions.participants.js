import { eventsDivisionsParticipantsFixture } from "~/fixtures"
import { seedArray } from "~/utils/tests/seed"

export default async (relations = {}) => {
  const participants = await seedArray(
    "events_divisions_participants",
    eventsDivisionsParticipantsFixture.map(
      (participant) => ({ ...participant, ...relations })
    )
  )

  return participants
}
