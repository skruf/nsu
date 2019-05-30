import { eventsParticipantsFixture } from "~/fixtures"
import { seedArray } from "~/utils/tests/seed"

export default async (relations = {}) => {
  const participants = await seedArray(
    "events_participants",
    eventsParticipantsFixture.map(
      (participant) => ({ ...participant, ...relations })
    )
  )

  return participants
}
