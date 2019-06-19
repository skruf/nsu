import rangesCollection, {
  RangesCollection,
  RangesDocument
} from "./ranges.collection"
import classesCollection, {
  ClassesCollection,
  ClassesDocument
} from "./classes.collection"
import clubsCollection, {
  ClubsCollection,
  ClubsDocument
} from "./clubs.collection"
import clubsMembersCollection, {
  ClubsMembersCollection,
  ClubsMembersDocument
} from "./clubs.members.collection"
import eventsCollection, {
  EventsCollection,
  EventsDocument
} from "./events.collection"
import eventsCategoriesCollection, {
  EventsCategoriesCollection,
  EventsCategoriesDocument
} from "./events.categories.collection"

import eventsParticipantsWeaponsCollection, {
  EventsParticipantsWeaponsCollection,
  EventsParticipantsWeaponsDocument
} from "./events.participants.weapons.collection"
import eventsDivisionsCollection, {
  EventsDivisionsCollection,
  EventsDivisionsDocument
} from "./events.divisions.collection"
import eventsContestantsCollection, {
  EventsContestantsCollection,
  EventsContestantsDocument
} from "./events.contestants.collection"
import eventsContestantsResultsCollection, {
  EventsContestantsResultsCollection,
  EventsContestantsResultsDocument
} from "./events.contestants.results.collection"

import eventsDivisionsContestantsCollection from "./events.divisions.contestants"

import eventsParticipantsCollection, {
  EventsParticipantsCollection,
  EventsParticipantsDocument
} from "./events.participants.collection"

export interface DatabaseCollections {
  [x: string]: (
    RangesCollection |
    ClassesCollection |
    ClubsCollection |
    ClubsMembersCollection |
    EventsCollection |
    EventsCategoriesCollection |
    EventsParticipantsCollection |
    EventsParticipantsWeaponsCollection |
    EventsDivisionsCollection |
    EventsContestantsCollection |
    EventsContestantsResultsCollection
  )
}

export type DatabaseDocument = (
  RangesDocument |
  ClassesDocument |
  ClubsDocument |
  ClubsMembersDocument |
  EventsDocument |
  EventsCategoriesDocument |
  EventsParticipantsDocument |
  EventsParticipantsWeaponsDocument |
  EventsDivisionsDocument |
  EventsContestantsDocument |
  EventsContestantsResultsDocument
)

export default [
  rangesCollection,
  classesCollection,
  clubsCollection,
  clubsMembersCollection,
  eventsCollection,
  eventsCategoriesCollection,
  eventsParticipantsWeaponsCollection,
  eventsDivisionsCollection,
  eventsContestantsCollection,
  eventsContestantsResultsCollection,
  eventsDivisionsContestantsCollection,

  eventsParticipantsCollection
]
