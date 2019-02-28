const defaultOptions = {
  action: "listAsync",
  fields: []
}

export default (options) => {
  const config = { ...defaultOptions, ...options }

  const state = {}
  const mutations = {}
  const actions = {}
  const getters = {}

  state.searchFilterValue = null
  state.searchFilterFields = config.fields

  mutations.SET_SEARCH_FILTER = (state, search) => {
    state.searchFilterValue = search
    state.pageCurrent = 1
  }

  actions.setSearchFilterAsync = async ({ dispatch, commit }, search) => {
    commit("SET_SEARCH_FILTER", search)
    await dispatch(config.action)
  }

  return {
    state,
    mutations,
    actions,
    getters
  }
}
