import { eventsFixture } from "@/fixtures"
import { seedArray } from "@/utils/tests/seed"

export default async (relations = {}) => {
  const events = await seedArray("events", eventsFixture.map(
    (event) => ({ ...event, ...relations })
  ))

  return events
}
