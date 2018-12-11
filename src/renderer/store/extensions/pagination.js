const defaultOptions = {
  action: "listAsync"
}

export default (options) => {
  const config = { ...defaultOptions, ...options }

  const state = {}
  const mutations = {}
  const actions = {}
  const getters = {}

  state.pageSize = 15
  state.pageCurrent = 1

  mutations.SET_PAGE_SIZE = (state, size) => {
    state.pageSize = size
    state.pageCurrent = 1
  }
  mutations.SET_PAGE_CURRENT = (state, pageCurrent) => {
    state.pageCurrent = pageCurrent
  }

  actions.setPageSizeAsync = async ({ commit, dispatch }, pageSize) => {
    commit("SET_PAGE_SIZE", pageSize)
    await dispatch(config.action)
  }
  actions.setPageCurrentAsync = async ({ commit, dispatch }, pageCurrent) => {
    commit("SET_PAGE_CURRENT", pageCurrent)
    await dispatch(config.action)
  }

  return {
    state,
    mutations,
    actions,
    getters
  }
}
