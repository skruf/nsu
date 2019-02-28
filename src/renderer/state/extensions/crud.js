import { queryHelper } from "@/utils"

const defaultOptions = {
  action: "listAsync"
}

export default (options) => {
  const config = { ...defaultOptions, ...options }

  const state = {}
  const mutations = {}
  const actions = {}
  const getters = {}

  if(config.listAsync || config.createAsync || config.removeAsync) {
    state.count = 0
  }

  if(config.listAsync) {
    state.listIsLoading = false
    state.listFilter = {}
    state.list = []

    mutations.SET_LIST_LOADING = (state, loading) => {
      state.listIsLoading = loading
    }
    mutations.SET_LIST = (state, items) => {
      state.list = items
    }
    mutations.SET_COUNT = (state, count) => {
      state.count = count
    }
    mutations.SET_LIST_FILTER = (state, listFilter) => {
      state.listFilter = listFilter
    }

    actions.listAsync = async function({ commit, state }) {
      commit("SET_LIST_LOADING", true)
      const cfg = queryHelper(state)
      const results = await config.listAsync(state.listFilter, cfg)
      commit("SET_LIST", results.items)
      commit("SET_COUNT", results.count)
      commit("SET_LIST_LOADING", false)
      return results
    }
  }

  if(config.selectAsync) {
    state.selectedIsLoading = false
    state.selected = {}

    mutations.SET_SELECTED_LOADING = (state, loading) => {
      state.selectedIsLoading = loading
    }
    mutations.SET_SELECTED = (state, item) => {
      state.selected = item
    }

    actions.selectAsync = async ({ commit }, filter = {}) => {
      commit("SET_SELECTED_LOADING", true)
      const item = await config.selectAsync(filter)
      commit("SET_SELECTED", item)
      commit("SET_SELECTED_LOADING", false)
      return item
    }
  }

  if(config.createAsync) {
    state.createIsLoading = false

    mutations.SET_CREATE_LOADING = (state, loading) => {
      state.createIsLoading = loading
    }

    mutations.ADD_ONE = (state, item) => {
      state.list.push(item)
      state.count += 1
    }

    actions.createAsync = async ({ commit }, item) => {
      commit("SET_CREATE_LOADING", true)
      const created = await config.createAsync(item)
      commit("ADD_ONE", created)
      commit("SET_CREATE_LOADING", false)
      return created
    }
  }

  if(config.removeAsync) {
    state.removeIsLoading = false

    mutations.SET_REMOVE_LOADING = (state, loading) => {
      state.removeIsLoading = loading
    }

    mutations.REMOVE_ONE = (state, item) => {
      state.list.splice(state.list.findIndex(({ id }) => item.id === id), 1)
      state.count -= 1
      if(state.selected && state.selected.id === item.id) {
        state.selected = {}
      }
    }

    actions.removeAsync = async ({ commit }, item) => {
      commit("SET_REMOVE_LOADING", true)
      await config.removeAsync({ id: item.id })
      commit("REMOVE_ONE", item)
      commit("SET_REMOVE_LOADING", false)
      return true
    }
  }

  return {
    state,
    mutations,
    actions,
    getters
  }
}
