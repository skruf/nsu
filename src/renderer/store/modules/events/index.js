import {
  findEventsAsync,
  findOneEventAsync,
  insertEventAsync,
  removeEventAsync
} from "@/db/events/index"
import { queryHelper } from "@/utils"
import extend from "@/store/extensions"

const state = {
  listIsLoading: false,
  selectedIsLoading: false,
  createIsLoading: false,
  removeIsLoading: false,
  list: [],
  selected: {},
  count: 0,
  fetchMode: "",
  sortBy: "-startsAt",
  searchFilterValue: null,
  searchFilterFields: [ "title", "organizer" ]
}

const mutations = {
  SET_LIST_LOADING(state, loading) {
    state.listIsLoading = loading
  },
  SET_SELECTED_LOADING(state, loading) {
    state.selectedIsLoading = loading
  },
  SET_CREATE_LOADING(state, loading) {
    state.createIsLoading = loading
  },
  SET_REMOVE_LOADING(state, loading) {
    state.removeIsLoading = loading
  },
  SET_LIST(state, items) {
    state.list = items
  },
  SET_COUNT(state, count) {
    state.count = count
  },
  SET_SELECTED(state, item) {
    state.selected = item
  },
  ADD_ONE(state, item) {
    state.list.push(item)
    state.count += 1
  },
  REMOVE_ONE(state, item) {
    state.list.splice(state.list.findIndex(({ _id }) => item._id === _id), 1)
    state.count -= 1
    if(state.selected && state.selected._id === item._id) {
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
  SET_FETCH_MODE(state, fetchMode) {
    state.fetchMode = fetchMode
  }
}

const actions = {
  async listAsync({ commit, state }, filter = {}) {
    commit("SET_LIST_LOADING", true)
    const options = queryHelper(state)
    const results = await findEventsAsync(filter, options, state.fetchMode)
    commit("SET_LIST", results.events)
    commit("SET_COUNT", results.count)
    commit("SET_LIST_LOADING", false)
  },
  async selectAsync({ commit }, filter = {}) {
    commit("SET_SELECTED_LOADING", true)
    const item = await findOneEventAsync(filter)
    commit("SET_SELECTED", item)
    commit("SET_SELECTED_LOADING", false)
  },
  async createAsync({ commit }, item) {
    commit("SET_CREATE_LOADING", true)
    delete item.dates
    const created = await insertEventAsync(item)
    commit("ADD_ONE", created)
    commit("SET_CREATE_LOADING", false)
  },
  async removeAsync({ commit }, item) {
    commit("SET_REMOVE_LOADING", true)
    await removeEventAsync({ _id: item._id })
    commit("REMOVE_ONE", item)
    commit("SET_REMOVE_LOADING", false)
  },
  async setSortingAsync({ commit, dispatch }, options) {
    commit("SET_SORTING", options)
    await dispatch("listAsync")
  },
  resetView({ commit }) {
    commit("RESET_SEARCH_FILTER")
    commit("RESET_PAGINATION")
    commit("RESET_SORTING")
  }
}

const getters = {}

const store = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

export default extend(store, [{
  module: "pagination",
  options: { action: "listAsync" }
}])
