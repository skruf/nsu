import { rangesFixture } from "@/fixtures"

export default {
  list: jest.fn().mockResolvedValue({
    items: rangesFixture, count: rangesFixture.length
  }),
  select: jest.fn().mockResolvedValue(rangesFixture[0]),
  create: jest.fn().mockResolvedValue(rangesFixture[0]),
  removeOne: jest.fn().mockResolvedValue(true),
  removeMany: jest.fn().mockResolvedValue(true)
}
