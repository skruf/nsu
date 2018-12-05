import { insert, find, findOne, remove } from "@/db"

const initialState = {
  listIsLoading: false,
  selectIsLoading: false,
  createIsLoading: false,
  removeIsLoading: false,
  list: [],
  selected: {},
  count: 0,
  searchFilter: ""
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
  SET_LIST_EVENTS(state, events) {
    state.list = events
    state.count = state.list.length
  },
  SET_SELECTED_EVENT(state, event) {
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
    state.searchFilter = search
  }
}

const actions = {
  async listAsync({ commit }) {
    commit("SET_LIST_LOADING", true)
    const events = await find("events")
    commit("SET_LIST_EVENTS", events)
    commit("SET_LIST_LOADING", false)
  },
  async selectAsync({ commit }, query) {
    commit("SET_SELECT_LOADING", true)
    const event = await findOne("events", query)
    commit("SET_SELECTED_EVENT", event)
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
  events: ({ list }) => list,
  count: ({ count }) => count,
  upcoming: ({ list }) => list.filter(filterByUpcoming),
  upcomingCount: ({ list }) => list.filter(filterByUpcoming).length,
  selected: ({ selected }) => selected,
  listIsLoading: ({ listIsLoading }) => listIsLoading,
  selectIsLoading: ({ selectIsLoading }) => selectIsLoading,
  createIsLoading: ({ createIsLoading }) => createIsLoading,
  removeIsLoading: ({ removeIsLoading }) => removeIsLoading
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
