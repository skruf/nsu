export default (item, stub) => {
  let data

  if(Array.isArray(item)) {
    data = item.map((i) => filter(i, stub))
  } else {
    data = filter(item, stub)
  }

  return data
}

// const copy = (value, stubValue) => {
//   if(Array.isArray(value)) {
//   } else if(typeof value === "object") {
//   }
// }

const filter = (item, stub) => {
  const data = {}

  for(let key in item) {
    if(stub.hasOwnProperty(key)) {
      data[key] = item[key]
    }
  }

  return data
}
