const defaultOptions = {
  action: "list"
}

export default (options) => {
  const config = { ...defaultOptions, ...options }

  const state = {}
  const mutations = {}
  const actions = {}
  const getters = {}

  state.sortBy = "-createdAt"

  mutations.SET_SORTING = (state, { prop, order }) => {
    state.sortBy = prop
    if(order === "ascending") {
      state.sortBy = `-${state.sortBy}`
    }
  }

  actions.setSorting = async ({ commit, dispatch }, sorting) => {
    commit("SET_SORTING", sorting)
    await dispatch(config.action)
  }

  return {
    state,
    mutations,
    actions,
    getters
  }
}
