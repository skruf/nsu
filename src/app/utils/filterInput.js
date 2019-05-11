export default (item, stub) => {
  let data

  if(Array.isArray(item)) {
    data = item.map((i) => filter(i, stub))
  } else {
    data = filter(item, stub)
  }

  return data
}

const filter = (item, stub) => {
  const data = {}

  for(let key in item) {
    if(stub.hasOwnProperty(key)) {
      let value = item[key]
      if(Array.isArray(value)) {
        data[key] = value.map(
          (v) => typeof v === "object" ? filter(v, stub[key]) : v
        )
      } else if(typeof value === "object") {
        data[key] = value = filter(value, stub[key])
      } else {
        data[key] = value
      }
    }
  }

  return data
}
