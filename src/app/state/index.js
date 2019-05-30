import Vue from "vue"
import Vuex from "vuex"
import {
  eventsStore,
  eventsParticipantsStore,
  eventsDivisionsStore,
  eventsContestantsStore,
  eventsContestantsResultsStore,
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
      divisions: eventsDivisionsStore,
      contestants: {
        ...eventsContestantsStore,
        modules: {
          results: eventsContestantsResultsStore
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
