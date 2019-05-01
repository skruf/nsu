import { queryHelper } from "@/utils"

const defaultOptions = {
  action: "list"
}

export default (options) => {
  const config = { ...defaultOptions, ...options }

  const state = {}
  const mutations = {}
  const actions = {}
  const getters = {}

  if(
    config.list ||
    config.create ||
    config.createMany ||
    config.removeOne ||
    config.removeMany ||
    config.editOne
  ) {
    state.count = 0
  }

  if(config.list || config.createMany || config.editMany) {
    mutations.SET_LIST = (state, items) => {
      state.list = items
    }
    mutations.SET_COUNT = (state, count) => {
      state.count = count
    }
  }

  if(config.list) {
    state.listIsLoading = false
    state.listFilter = {}
    state.list = []

    mutations.SET_LIST_LOADING = (state, loading) => {
      state.listIsLoading = loading
    }
    mutations.SET_LIST_FILTER = (state, listFilter) => {
      state.listFilter = listFilter
    }

    actions.list = async function({ commit, state }) {
      commit("SET_LIST_LOADING", true)
      const cfg = queryHelper(state)
      const results = await config.list(state.listFilter, cfg)
      commit("SET_LIST", results.items)
      commit("SET_COUNT", results.count)
      commit("SET_LIST_LOADING", false)
      return results
    }
  }

  if(config.select) {
    state.selectedIsLoading = false
    state.selected = {}

    mutations.SET_SELECTED_LOADING = (state, loading) => {
      state.selectedIsLoading = loading
    }
    mutations.SET_SELECTED = (state, item) => {
      state.selected = item
    }

    actions.select = async ({ commit }, filter = {}) => {
      commit("SET_SELECTED_LOADING", true)
      const item = await config.select(filter)
      commit("SET_SELECTED", item)
      commit("SET_SELECTED_LOADING", false)
      return item
    }
  }

  if(config.create) {
    state.createIsLoading = false

    mutations.SET_CREATE_LOADING = (state, loading) => {
      state.createIsLoading = loading
    }

    mutations.ADD_ONE = (state, item) => {
      state.list.push(item)
      state.count += 1
    }

    actions.create = async ({ commit }, item) => {
      commit("SET_CREATE_LOADING", true)
      const created = await config.create(item)
      commit("ADD_ONE", created)
      commit("SET_CREATE_LOADING", false)
      return created
    }
  }

  if(config.createMany) {
    state.createManyIsLoading = false

    mutations.SET_CREATE_MANY_LOADING = (state, loading) => {
      state.createManyIsLoading = loading
    }

    actions.createMany = async ({ commit }, items) => {
      commit("SET_CREATE_MANY_LOADING", true)
      const results = await config.createMany(items)
      commit("SET_LIST", results.items)
      commit("SET_COUNT", results.count)
      commit("SET_CREATE_MANY_LOADING", false)
      return results
    }
  }

  if(config.removeOne) {
    state.removeOneIsLoading = false

    mutations.SET_REMOVE_LOADING = (state, loading) => {
      state.removeOneIsLoading = loading
    }

    mutations.REMOVE_ONE = (state, item) => {
      state.list.splice(
        state.list.findIndex(({ id }) => item.id === id), 1
      )
      state.count -= 1
      if(state.selected && state.selected.id === item.id) {
        state.selected = {}
      }
    }

    actions.removeOne = async ({ commit }, item) => {
      commit("SET_REMOVE_LOADING", true)
      await config.removeOne(item)
      commit("REMOVE_ONE", item)
      commit("SET_REMOVE_LOADING", false)
      return true
    }
  }

  if(config.removeMany) {
    state.removeManyIsLoading = false

    mutations.SET_REMOVE_MANY_LOADING = (state, loading) => {
      state.removeManyIsLoading = loading
    }

    mutations.REMOVE_MANY = (state, items) => {
      items.forEach((item) => {
        state.list.splice(
          state.list.findIndex(({ id }) => item.id === id), 1
        )

        if(state.selected && state.selected.id === item.id) {
          state.selected = {}
        }
      })

      state.count -= items.length
    }

    actions.removeMany = async ({ commit }, items) => {
      commit("SET_REMOVE_MANY_LOADING", true)
      await config.removeMany(items)
      commit("REMOVE_MANY", items)
      commit("SET_REMOVE_MANY_LOADING", false)
      return true
    }
  }

  if(config.editOne) {
    state.editOneIsLoading = false

    mutations.SET_EDIT_ONE_LOADING = (state, loading) => {
      state.editOneIsLoading = loading
    }

    mutations.EDIT_ONE = (state, item) => {
      const index = state.list.findIndex(({ id }) => item.id === id)
      const list = state.list
      list[index] = item
      state.list = [ ...list ]
      if(state.selected && state.selected.id === item.id) {
        state.selected = item
      }
    }

    actions.editOne = async ({ commit }, item) => {
      commit("SET_EDIT_ONE_LOADING", true)
      const edited = await config.editOne(item)
      commit("EDIT_ONE", edited)
      commit("SET_EDIT_ONE_LOADING", false)
      return edited
    }
  }

  if(config.editMany) {
    state.editManyIsLoading = false

    mutations.SET_EDIT_MANY_LOADING = (state, loading) => {
      state.editManyIsLoading = loading
    }

    mutations.EDIT_MANY = (state, items) => {
      const list = state.list.map(
        (item) => items.filter((i) => i.id === item.id)[0] || item
      )
      state.list = [ ...list ]
    }

    actions.editMany = async ({ commit }, items) => {
      commit("SET_EDIT_MANY_LOADING", true)
      const edited = await config.editMany(items)
      commit("EDIT_MANY", edited.items)
      commit("SET_EDIT_MANY_LOADING", false)
      return edited
    }
  }

  return {
    state,
    mutations,
    actions,
    getters
  }
}
