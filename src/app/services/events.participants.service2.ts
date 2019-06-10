import { RxQuery } from "rxdb"
import { PartialObserver } from "rxjs"
import { db } from "~/db"

export default (observer: PartialObserver<any>, config: any) => {
  const state = {
    filter: config.filter || {},
    sort: config.sort || "createdAt",
    page: config.page || 1,
    size: config.size || 15,
    isLoading: false
  }

  // let filter = config.filter || {}
  // let sort = config.sort || "createdAt"
  // let page = config.page || 1
  // let size = config.size || 15

  const getQuery = (): RxQuery<any, any> => {
    return db.events_participants
      .find(state.filter)
      .sort(state.sort)
      .skip((state.page - 1) * state.size)
      .limit(state.size)
  }

  const query = getQuery()
  const sub = query.$.subscribe(observer)

  const refresh = async (): Promise<void> => {
    state.isLoading = true
    const query = getQuery()
    const res = await query.exec()
    sub.next(res)
    state.isLoading = false
  }

  const setFilter = async (value: object): Promise<void> => {
    state.filter = value
    await refresh()
  }

  const setPage = async (value: number): Promise<void> => {
    state.page = value
    await refresh()
  }

  const setSize = async (value: number): Promise<void> => {
    state.page = 1
    state.size = value
    await refresh()
  }

  const setSort = async (key: string, order: string): Promise<void> => {
    state.sort = `${order === "descending" ? '-' : ''}${key}`
    await refresh()
  }

  return {
    setFilter,
    setPage,
    setSize,
    setSort,
    refresh,
    sub,
    state
  }
}
