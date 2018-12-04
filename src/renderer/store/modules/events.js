import { insert, find } from "@/db"

// const upcomingFixture = [
//   {
//     _id: 0,
//     title: "Skedsmo Championships",
//     date: "10.12.19",
//     category: "Club",
//     branch: "50m",
//     organizer: "Skedsmo Civile Skydeselskab",
//     area: "Korpåsen, Lillestrøm",
//     participants: "5",
//     approbated: "Y"
//   },
//   {
//     _id: 1,
//     title: "NM skive 2018",
//     date: "30.03.18",
//     category: "NM",
//     branch: "25M + 50M",
//     organizer: "Norsksvartkruttunion",
//     area: "Finnsnes, Troms",
//     participants: "63",
//     approbated: "N"
//   },
//   {
//     _id: 2,
//     title: "NM Langhold 2018",
//     date: "14.11.18",
//     category: "NM",
//     branch: "100M",
//     organizer: "Norsksvartkruttunion",
//     area: "Tørrmoen, Brandval",
//     participants: "194",
//     approbated: "Y"
//   }
// ]

const initialState = {
  fetchIsLoading: false,
  createIsLoading: false,
  upcoming: [],
  upcomingCount: 0,
  upcomingSearchFilter: ""
}

const state = () => initialState

const mutations = {
  SET_FETCH_LOADING(state, loading) {
    state.fetchIsLoading = loading
  },
  SET_CREATE_LOADING(state, loading) {
    state.createIsLoading = loading
  },
  SET_UPCOMING_EVENTS(state, events) {
    state.upcoming = events
    state.upcomingCount = state.upcoming.length
  },
  ADD_UPCOMING_EVENT(state, event) {
    state.upcoming.push(event)
    state.upcomingCount = state.upcoming.length
  },
  SET_UPCOMING_SEARCH_FILTER(state, search) {
    state.upcomingSearchFilter = search
  }
}

const actions = {
  async setUpcomingAsync({ commit }) {
    commit("SET_FETCH_LOADING", true)
    const events = await find("events")
    commit("SET_UPCOMING_EVENTS", events)
    commit("SET_FETCH_LOADING", false)
  },

  async createEventAsync({ commit }, event) {
    commit("SET_CREATE_LOADING", true)
    await insert("events", event)
    commit("ADD_UPCOMING_EVENT", event)
    commit("SET_CREATE_LOADING", false)
  }
}

const getters = {
  upcoming: ({ upcoming }) => upcoming,
  upcomingCount: ({ upcomingCount }) => upcomingCount,
  fetchIsLoading: ({ fetchIsLoading }) => fetchIsLoading,
  createIsLoading: ({ createIsLoading }) => createIsLoading
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
