import _merge from "lodash.merge"
import pagination from "./pagination"
import crud from "./crud"
import sorting from "./sorting"
import search from "./search"

const extenders = {
  pagination,
  crud,
  sorting,
  search
}

export default (store, extensions = []) => {
  extensions.forEach((extension) => {
    const extender = extenders[extension.module]
    const extended = extender(extension.options)
    store = _merge(extended, store)
  })

  return store
}
