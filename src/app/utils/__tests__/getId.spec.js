import { getId } from "~/utils"

describe("getId", () => {
  it("should return a valid uuid of 36 characters", () => {
    const id = getId()
    expect(id).toHaveLength(36)
  })
})
