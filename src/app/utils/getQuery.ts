import { RxQuery, RxQueryOptions } from "rxdb"
import { db } from "~/db"

type QueryFilter = {
  [k in string]: RxQueryOptions<any> | any
}

type QueryOptions = {
  sort?: {
    field: string,
    order: string
  },
  page?: number,
  size?: number,
  setCount?: boolean
}

export default (
  collection: string, filter: QueryFilter, options?: QueryOptions
): RxQuery<any, any> => {
  const query = db[collection].find(filter)

  options = {
    sort: {
      field: "createdAt",
      order: "descending"
    },
    page: 1,
    size: 15,
    ...options
  }

  if(options.sort) {
    const sort = `${options.sort.order === "descending" ? '-' : ''}${options.sort.field}`
    query.sort(sort)
  }

  if(options.page) {
    query.skip((options.page - 1) * options.size)
  }

  if(options.size) {
    query.limit(options.size)
  }

  // if(options.setCount) {
  //   db[collection]
  // }

  return query
}
