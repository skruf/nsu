import { getTimestamp } from "~/utils"

describe("getTimestamp", () => {
  it("should return a valid ISO timestamp string", () => {
    const timestamp = getTimestamp()
    const t = Date.parse(timestamp)
    expect(Number.isNaN(t)).toBe(false)
  })
})
