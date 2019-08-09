import { filterInput } from "~/utils"

const data = {
  time: "",
  memberId: "",
  divisionId: "",
  weapon: {
    id: "",
    classId: "",
    calibre: ""
  }
}

const input = {
  ...data,
  someObject: {
    someArray: []
  },
  someArray: [{
    someValue: "value"
  }],
  someString: "someStringValue",
  someBoolean: true,
  someNumber: 123
}

describe("filterInput", () => {
  it("should filter object with data", () => {
    const result = filterInput(input, data)
    expect(result).toEqual(data)
  })

  it("should filter array with data", () => {
    const arrayInput = [ input, input ]
    const result = filterInput(arrayInput, data)
    expect(result).toEqual([ data, data ])
  })
})
