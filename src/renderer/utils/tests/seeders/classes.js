import { classesFixture } from "@/fixtures"
import { seedArray } from "@/utils/tests/seed"

export default async () => {
  const classes = await seedArray("classes", classesFixture)
  return classes
}
