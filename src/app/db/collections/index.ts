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

import eventsDivisionsContestantsCollection, {
  EventsDivisionsContestantsDocument,
  EventsDivisionsContestantsCollection
} from "./events.divisions.contestants"

import eventsParticipantsCollection, {
  EventsParticipantsCollection,
  EventsParticipantsDocument
} from "./events.participants.collection"

export type DatabaseCollectionsNames = (
  "ranges" |
  "classes" |
  "clubs" |
  "clubs_members" |
  "events" |
  "events_categories" |
  "events_participants" |
  "events_participants_weapons" |
  "events_divisions" |
  "events_contestants" |
  "events_contestants_results"
)

export type DatabaseCollections = {
  ranges: RangesCollection,
  classes: ClassesCollection,
  clubs: ClubsCollection,
  clubs_members: ClubsMembersCollection,
  events: EventsCollection,
  events_categories: EventsCategoriesCollection,
  events_participants: EventsParticipantsCollection,
  events_participants_weapons: EventsParticipantsWeaponsCollection,
  events_divisions: EventsDivisionsCollection,
  events_contestants: EventsContestantsCollection,
  events_contestants_results: EventsContestantsResultsCollection,
  events_divisions_contestants: EventsDivisionsContestantsCollection
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
  EventsContestantsResultsDocument |
  EventsDivisionsContestantsDocument
)

export default [
  rangesCollection,
  classesCollection,
  clubsCollection,
  clubsMembersCollection,
  eventsCollection,
  eventsCategoriesCollection,
  eventsParticipantsCollection,
  eventsParticipantsWeaponsCollection,
  eventsDivisionsCollection,
  eventsContestantsCollection,
  eventsContestantsResultsCollection,
  eventsDivisionsContestantsCollection
]
