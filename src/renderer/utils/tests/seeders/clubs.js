import { clubsFixture } from "@/fixtures"
import { seedArray } from "@/utils/tests/seed"

export default async () => {
  const clubs = await seedArray("clubs", clubsFixture)
  return clubs
}
