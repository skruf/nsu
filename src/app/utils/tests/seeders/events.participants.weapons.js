import { eventsParticipantsWeaponsFixture } from "~/fixtures"
import { seedArray } from "~/utils/tests/seed"

export default async (relations = {}) => {
  const weapons = await seedArray(
    "events_participants_weapons",
    eventsParticipantsWeaponsFixture.map(
      (weapon) => ({ ...weapon, ...relations })
    )
  )

  return weapons
}
