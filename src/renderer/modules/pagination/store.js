const initialState = {
  pageSize: 15,
  pageCurrent: 1,
  sortBy: "_id",
  searchFilterValue: null,
  searchFilterFields: [ "title", "organizer" ]
}

const state = () => initialState

const mutations = {
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
  }
}

const actions = {
  async setSorting({ commit, dispatch }, options) {
    commit("SET_SORTING", options)
    // await dispatch("listAsync")
  },
  async setPageSize({ commit, dispatch }, pageSize) {
    commit("SET_PAGE_SIZE", pageSize)
    // await dispatch("listAsync")
  },
  async setPageCurrent({ commit, dispatch }, pageCurrent) {
    commit("SET_PAGE_CURRENT", pageCurrent)
    // await dispatch("listAsync")
  },
  resetView({ commit }) {
    commit("RESET_SEARCH_FILTER")
    commit("RESET_PAGINATION")
    commit("RESET_SORTING")
  }
}

const getters = {
  sortBy: ({ sortBy }) => sortBy,
  pageSize: ({ pageSize }) => pageSize,
  pageCurrent: ({ pageCurrent }) => pageCurrent
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
