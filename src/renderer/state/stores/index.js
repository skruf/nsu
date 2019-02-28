import rangesStore from "./ranges.store"
import classesStore from "./classes.store"
import clubsStore from "./clubs.store"
import clubsMembersStore from "./clubs.members.store"
import eventsStore from "./events.store"
import eventsParticipantsStore from "./events.participants.store"
import eventsDivisionsStore from "./events.divisions.store"
import eventsDivisionsContestantsStore from "./events.divisions.contestants.store"

export default {
  events: {
    ...eventsStore,
    modules: {
      participants: eventsParticipantsStore,
      divisions: {
        ...eventsDivisionsStore,
        modules: {
          contestants: eventsDivisionsContestantsStore
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
