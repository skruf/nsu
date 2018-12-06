import { insert, find, findOne, remove } from "@/db"

const initialState = {
  listIsLoading: false,
  selectIsLoading: false,
  createIsLoading: false,
  removeIsLoading: false,
  list: [],
  selected: {},
  count: 0,

  fetchMode: "",
  pageSize: 15,
  pageCurrent: 1,
  sortBy: "startsAt",
  searchFilterValue: null,
  searchFilterFields: [ "title", "organizer" ]
}

const state = () => initialState

const mutations = {
  SET_LIST_LOADING(state, loading) {
    state.listIsLoading = loading
  },
  SET_SELECT_LOADING(state, loading) {
    state.selectIsLoading = loading
  },
  SET_CREATE_LOADING(state, loading) {
    state.createIsLoading = loading
  },
  SET_REMOVE_LOADING(state, loading) {
    state.removeIsLoading = loading
  },
  SET_LIST(state, events) {
    state.list = events
  },
  SET_COUNT(state, count) {
    state.count = count
  },
  SET_SELECT(state, event) {
    state.selected = event
  },
  ADD_EVENT(state, event) {
    state.list.push(event)
    state.count += 1
  },
  REMOVE_EVENT(state, event) {
    state.list.splice(state.list.findIndex(({ _id }) => event._id === _id), 1)
    state.count -= 1
    if(state.selected && state.selected._id === event._id) {
      state.selected = {}
    }
  },

  SET_SEARCH_FILTER(state, search) {
    state.searchFilterValue = search
    state.pageCurrent = 1
  },
  SET_SORTING(state, { prop, order }) {
    state.sortBy = prop
    if(order === "ascending") {
      state.sortBy = `-${state.sortBy}`
    }
  },
  SET_PAGE_SIZE(state, size) {
    state.pageSize = size
    state.pageCurrent = 1
  },
  SET_PAGE_CURRENT(state, pageCurrent) {
    state.pageCurrent = pageCurrent
  },
  SET_FETCH_MODE(state, fetchMode) {
    state.fetchMode = fetchMode
  }
}

const actions = {
  async setSorting({ commit, dispatch }, options) {
    commit("SET_SORTING", options)
    await dispatch("listAsync")
  },
  async setPageSize({ commit, dispatch }, pageSize) {
    commit("SET_PAGE_SIZE", pageSize)
    await dispatch("listAsync")
  },
  async setPageCurrent({ commit, dispatch }, pageCurrent) {
    commit("SET_PAGE_CURRENT", pageCurrent)
    await dispatch("listAsync")
  },
  resetView({ commit }) {
    commit("RESET_SEARCH_FILTER")
    commit("RESET_PAGINATION")
    commit("RESET_SORTING")
  },

  async listAsync({ commit, state }, filter = {}) {
    if(state.fetchMode === "upcoming") {
      filter.startsAt = { $gte: new Date() }
    }
    if(state.fetchMode === "history") {
      filter.startsAt = { $lte: new Date() }
    }
    commit("SET_LIST_LOADING", true)
    const options = computeOptions(state)
    const { events, count } = await find("events", filter, options)
    commit("SET_LIST", events)
    commit("SET_COUNT", count)
    commit("SET_LIST_LOADING", false)
  },
  async selectAsync({ commit }, query) {
    commit("SET_SELECT_LOADING", true)
    const event = await findOne("events", query)
    commit("SET_SELECT", event)
    commit("SET_SELECT_LOADING", false)
  },
  async createAsync({ commit }, event) {
    commit("SET_CREATE_LOADING", true)
    delete event.dates
    const createdEvent = await insert("events", event)
    commit("ADD_EVENT", createdEvent)
    commit("SET_CREATE_LOADING", false)
  },
  async removeAsync({ commit }, event) {
    commit("SET_REMOVE_LOADING", true)
    await remove("events", { _id: event._id })
    commit("REMOVE_EVENT", event)
    commit("SET_REMOVE_LOADING", false)
  }
}

const filterByUpcoming = (event) => {
  // return event.startsAt > new Date()
  return true
}

const getters = {
  sortBy: ({ sortBy }) => sortBy,
  pageSize: ({ pageSize }) => pageSize,
  pageCurrent: ({ pageCurrent }) => pageCurrent,

  events: ({ list }) => list,
  count: ({ count }) => count,
  upcoming: ({ list }) => list.filter(filterByUpcoming),

  upcomingCount: ({ list }) => list.filter(filterByUpcoming).length,

  selected: ({ selected }) => selected,
  listIsLoading: ({ listIsLoading }) => listIsLoading,
  selectIsLoading: ({ selectIsLoading }) => selectIsLoading,
  createIsLoading: ({ createIsLoading }) => createIsLoading,
  removeIsLoading: ({ removeIsLoading }) => removeIsLoading,

  fetchMode: ({ fetchMode }) => fetchMode
}

export const computeOptions = (state) => ({
  limit: state.pageSize,
  skip: (state.pageCurrent - 1) * state.pageSize,
  sort: state.sortBy,
  search: {
    fields: state.searchFilterFields,
    value: state.searchFilterValue || null
  }
})

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
