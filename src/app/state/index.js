import Vue from "vue"
import Vuex from "vuex"
import {
  eventsStore,
  eventsParticipantsStore,
  eventsDivisionsStore,
  eventsDivisionsContestantsStore,
  eventsDivisionsContestantsResultsStore,
  clubsStore,
  clubsMembersStore,
  classesStore,
  rangesStore
} from "~/state/stores"

const stores = {
  events: {
    ...eventsStore,
    modules: {
      participants: eventsParticipantsStore,
      divisions: {
        ...eventsDivisionsStore,
        modules: {
          contestants: {
            ...eventsDivisionsContestantsStore,
            modules: {
              results: eventsDivisionsContestantsResultsStore
            }
          }
        }
      }
    }
  },
  clubs: {
    ...clubsStore,
    modules: {
      members: clubsMembersStore
    }
  },
  classes: classesStore,
  ranges: rangesStore
}

Vue.config.devtools = true
Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  modules: stores
})

export default store
