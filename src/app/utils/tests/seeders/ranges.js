import { rangesFixture } from "~/fixtures"
import { seedArray } from "~/utils/tests/seed"

export default async () => {
  const ranges = await seedArray("ranges", rangesFixture)
  return ranges
}
