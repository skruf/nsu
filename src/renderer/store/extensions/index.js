import merge from "lodash.merge"
import pagination from "./pagination"

const extenders = {
  pagination
}

export default (store, extensions = []) => {
  extensions.forEach((extension) => {
    const extender = extenders[extension.module]
    const extended = extender(extension)
    store = merge(extended, store)
  })

  return store
}
