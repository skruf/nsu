export default (options) => {
  const state = {
    pageSize: 15,
    pageCurrent: 1
  }

  const mutations = {
    SET_PAGE_SIZE(state, size) {
      state.pageSize = size
      state.pageCurrent = 1
    },
    SET_PAGE_CURRENT(state, pageCurrent) {
      state.pageCurrent = pageCurrent
    }
  }

  const actions = {
    async setPageSizeAsync({ commit, dispatch }, pageSize) {
      commit("SET_PAGE_SIZE", pageSize)
      await dispatch("listAsync")
    },
    async setPageCurrentAsync({ commit, dispatch }, pageCurrent) {
      commit("SET_PAGE_CURRENT", pageCurrent)
      await dispatch("listAsync")
    }
  }

  const getters = {}

  return {
    state,
    mutations,
    actions,
    getters
  }
}
