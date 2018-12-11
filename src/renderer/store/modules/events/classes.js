import { insert, find, findOne, remove } from "@/db"
import { queryHelper } from "@/utils"
import { classes } from "@/../../mocks"

const modelName = "classes"

export const stub = {
  number: 0,
  name: "",
  pictureUrl: "",
  target: "",
  position: "",
  loadingRod: "",
  cleaning: "",
  distance: "",
  team: "",
  condition: "",
  type: "",
  sights: "",
  trigger: "",
  calibre: "",
  bullet: "",
  contestants: []
}

const state = {
  listIsLoading: false,
  selectedIsLoading: false,
  createIsLoading: false,
  removeIsLoading: false,
  list: classes,
  selected: classes[0],
  count: 0,
  sortBy: "-createdAt",
  searchFilterValue: null,
  searchFilterFields: [ "name" ]
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
  }
}

const actions = {
  async listAsync({ commit, state }, filter = {}) {
    commit("SET_LIST_LOADING", true)
    const options = queryHelper(state)
    const results = await find(modelName, filter, options)
    commit("SET_LIST", results[modelName])
    commit("SET_COUNT", results.count)
    commit("SET_LIST_LOADING", false)
  },
  async selectAsync({ commit }, filter) {
    commit("SET_SELECTED_LOADING", true)
    const item = await findOne("items", filter)
    commit("SET_SELECTED", item)
    commit("SET_SELECTED_LOADING", false)
  },
  async createAsync({ commit }, item) {
    commit("SET_CREATE_LOADING", true)
    const created = await insert("items", item)
    commit("ADD_ONE", created)
    commit("SET_CREATE_LOADING", false)
  },
  async removeAsync({ commit }, item) {
    commit("SET_REMOVE_LOADING", true)
    await remove("items", { _id: item._id })
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

export default store
