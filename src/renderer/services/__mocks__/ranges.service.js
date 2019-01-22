import { rangesFixture } from "@/fixtures"

export default {
  list: jest.fn().mockResolvedValue({
    items: rangesFixture, count: rangesFixture.length
  }),
  select: jest.fn().mockResolvedValue(rangesFixture[0]),
  create: jest.fn().mockResolvedValue(rangesFixture[0]),
  remove: jest.fn().mockResolvedValue(true)
}
