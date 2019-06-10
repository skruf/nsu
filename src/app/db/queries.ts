import { RxQuery, RxQueryOptions } from "rxdb"
import { DatabaseCollections, DatabaseDocument } from "~/db/collections"
import { getId, getTimestamp } from "~/utils"
// import DB from "~/db"
import { db } from "~/db"

export type QueryFilter = {
  [k in string]: RxQueryOptions<any> | any
}

export type QueryOptions = {
  search?: {
    value: string
    fields: string[]
  },
  sort?: string
  skip?: number | boolean
  limit?: number | boolean
}

type BuildQuery = (
  collection: string,
  method: string,
  filter: QueryFilter,
  options?: QueryOptions
) => Promise<RxQuery<DatabaseCollections, DatabaseDocument[]>>

const buildQuery: BuildQuery = async (
  collection, method, filter, options = {}
) => {
  // const db: any = await DB.get()

  if(options.search && options.search.value) {
    const $or: any = []

    options.search.fields.forEach((field) => {
      $or.push({
        [field]: {
          $regex: new RegExp(`${ options.search ? options.search.value : ''}`, "i")
        }
      })
    })

    filter = {
      $and: [ filter, { $or } ]
    }
  }

  let operation = db[collection][method](filter)

  if(options.sort) {
    // @TODO: bugfix sorting while searching
    if(options.search && options.search.value) {
    } else {
      operation = operation.sort(options.sort)
    }
  }

  if(typeof options.skip === "number") {
    operation = operation.skip(options.skip)
  }

  if(typeof options.limit === "number") {
    operation = operation.limit(options.limit)
  }

  return operation
}

type CountQuery = (
  collection: string,
  filter: QueryFilter,
  options?: QueryOptions,
  json?: boolean
) => Promise<number>

export const count: CountQuery = async (
  collection, filter, defaultOptions = {}
) => {
  const options = { ...defaultOptions, skip: false, limit: false }
  const query = await buildQuery(collection, "find", filter, options)
  const docs = await query.exec()
  return docs.length
}

export type QueryResult = DatabaseDocument | object

type FindManyQuery = (
  collection: string,
  filter: QueryFilter,
  options?: QueryOptions,
  json?: boolean
) => Promise<{
  items: QueryResult[],
  count: number
}>

export const findMany: FindManyQuery = async (
  collection, filter, options = {}, json = false
) => {
  const query = await buildQuery(collection, "find", filter, options)
  let docs = await query.exec()
  const amount = await count(collection, filter, options)
  return {
    items: json ? docs.map((doc) => doc.toJSON()) : docs,
    count: amount
  }
}

type FindOneQuery = (
  collection: string,
  filter: QueryFilter,
  json?: boolean
) => Promise<DatabaseDocument | object | null | any>

export const findOne: FindOneQuery = async (
  collection, filter, json = false
) => {
  let doc = await db[collection].findOne(filter).exec()
  if(!doc) return null
  return json ? doc.toJSON() : doc
}

type InsertQuery = (
  collection: string,
  data: DatabaseDocument | any,
  json?: boolean
) => Promise<DatabaseDocument | object | any>

export const insert: InsertQuery = async (
  collection, data, json = false
) => {
  const timestamp = getTimestamp()
  data.id = getId()
  data.createdAt = timestamp
  data.updatedAt = timestamp
  let doc = await db[collection].insert(data)
  return json ? doc.toJSON() : doc
}

type InsertManyQuery = (
  collection: string,
  items: DatabaseDocument[] | any,
  json?: boolean
) => Promise<DatabaseDocument[] | object[]>

export const insertMany: InsertManyQuery = async (
  collection, items, json = false
) => {
  const docs = await Promise.all(
    items.map((item: any) => insert(collection, item, json))
  )
  return docs
}

type DestroyOneQuery = (
  collection: string,
  filter: QueryFilter
) => Promise<boolean | null>

export const destroyOne: DestroyOneQuery = async (
  collection, filter
) => {
  const doc = await db[collection].findOne(filter).exec()
  if(!doc) return null
  const result = await doc.remove()
  return result
}

type DestroyManyQuery = (
  collection: string,
  filter: QueryFilter,
  options?: QueryOptions
) => Promise<any>

export const destroyMany: DestroyManyQuery = async (
  collection, filter, options = {}
) => {
  const docs: any = await findMany(collection, filter, options, false)
  const result = await Promise.all(
    docs.items.map((doc: any) => doc.remove())
  )
  return result
}

type UpdateOneQuery = (
  collection: string,
  filter: QueryFilter,
  item: DatabaseDocument | any,
  json?: boolean
) => Promise<DatabaseDocument | object | null | any>

export const updateOne: UpdateOneQuery = async (
  collection, filter, item, json = false
) => {
  const doc = await db[collection].findOne(filter).exec()
  if(!doc) return null
  item.updatedAt = getTimestamp()
  await doc.atomicUpdate((old: any) => ({ ...old, ...item }))
  return json ? doc.toJSON() : doc
}

type UpdateManyQuery = (
  collection: string,
  items: DatabaseDocument[] | any,
  filterKey?: string,
  json?: boolean
) => Promise<any>

export const updateMany: UpdateManyQuery = async (
  collection, items, filterKey = "id", json = false
) => {
  const docs = await Promise.all(
    items.map((item: any) => updateOne(
      collection, { [filterKey]: item[filterKey] }, item, json
    ))
  )
  return docs
}
