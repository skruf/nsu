<i18n>
{
  "en": {
    "title": "Manage participants",
    "subtitle": "For %{event}",
    "selectClub": "Select a club",
    "clubsSearchFormPlaceholder": "Search for clubs by name",
    "addClubsMembers": "Add members from selected club",
    "clubsMembersSearchFormPlaceholder": "Search for members by first or last name",
    "clubsMembersPlaceholderText": "Please select a club to add its members as participants",
    "currentParticipants": "Current participants",
    "participantsSearchFormPlaceholder": "Search for participants by first or last name",
    "column1Label": "Participant",
    "column2Label": "Club",
    "column3Label": "Classes",
    "column4Label": "Calibres",
    "editParticipant": "Edit participant",
    "removeParticipant": "Remove participant",
    "tablePlaceholderText": "No participants yet.",
    "saveSuccess": "%{members} was added to the event"
  },
  "no": {
    "title": "Håndter deltakere",
    "subtitle": "For %{event}",
    "selectClub": "Velg en klubb",
    "clubsSearchFormPlaceholder": "Søk etter klubber med navn",
    "addClubsMembers": "Legg til medlemmer fra valgt klubb",
    "clubsMembersSearchFormPlaceholder": "Søk etter medlemmer med fornavn eller etternavn",
    "clubsMembersPlaceholderText": "Velg en klubb for å legge til deres medlemmer som deltakere",
    "currentParticipants": "Nåværende deltakere",
    "participantsSearchFormPlaceholder": "Søk etter deltakere med fornavn eller etternavn",
    "column1Label": "Deltaker",
    "column2Label": "Klubb",
    "column3Label": "Klasser",
    "column4Label": "Kalibre",
    "editParticipant": "Rediger deltaker",
    "removeParticipant": "Slett deltaker",
    "tablePlaceholderText": "Ingen deltakere enda.",
    "saveSuccess": "%{members} ble lagt til stevnet"
  }
}
</i18n>

<style lang="stylus">
.events-participants-manager-dialog
  .el-table
    .h6, .small
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
</style>

<template>
  <el-dialog
    custom-class="events-participants-manager-dialog"
    :fullscreen="true"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <template slot="title">
      <h3 class="h3">
        {{ $t("title") }}
      </h3>
      <small class="small">
        {{ $t("subtitle", { event: event.title }) }}
      </small>
    </template>

    <div class="flex min-h-full w-full">
      <div
        v-loading="clubsIsLoading"
        class="p-5 dialog_sidebar"
      >
        <h5 class="h5 pb-2">
          {{ $t("selectClub") }}
        </h5>

        <ul>
          <li
            v-for="club in clubs"
            :key="club.id"
            class="mt-2 card card-clickable"
            :class="{ 'is-active': isClubActive(club) }"
            @click="fetchClubsMemebersList(club)"
          >
            {{ club.name }} <i class="el-icon-arrow-right" />
          </li>
        </ul>
      </div>

      <div
        v-loading="membersIsLoading"
        class="flex-1 p-5 overflow-y-scroll"
      >
        <h5 class="h5 pb-2">
          {{ $t("addClubsMembers") }}
        </h5>

        <ul>
          <li
            v-for="member in filteredParticipants"
            :key="member.id"
            class="card card-clickable mt-2"
            @click="eventsParticipantsOpenCreateDialog(member)"
          >
            <div class="flex">
              <avatar
                :first-name="member.firstName"
                :last-name="member.lastName"
                size="small"
                class="mr-3"
              />
              {{ member.firstName }} {{ member.lastName }}
            </div>
            <i class="el-icon-arrow-right el-icon--right" />
          </li>
        </ul>

        <div
          v-if="!filteredParticipants.length"
          class="data-placeholder text-left leading-none"
        >
          {{ $t("clubsMembersPlaceholderText") }}
        </div>
      </div>

      <div class="p-5 dialog_sidebar">
        <h4 class="h5 pb-2">
          Legger til {{ participantsToAdd.length }} deltakere
        </h4>

        <ul class="mb-2">
          <li
            v-for="(participant, index) in participantsToAdd"
            :key="index"
            class="card mt-2 justify-between"
          >
            <div class="flex items-center">
              <avatar
                :first-name="participant.member.firstName"
                :last-name="participant.member.lastName"
                size="small"
                class="mr-3"
              />

              {{ participant.member.firstName }} {{ participant.member.lastName }}
            </div>

            <div>
              <el-tooltip placement="top">
                <ul slot="content">
                  <li
                    v-for="(weapon, i) in participant.weapons"
                    :key="i"
                  >
                    {{ weapon.class.name }} ({{ weapon.calibre }})
                  </li>
                </ul>
                <el-tag size="mini">
                  {{ participant.weapons.length }} weapons
                </el-tag>
              </el-tooltip>

              <i
                class="ml-2 el-icon-close"
                @click="removeParticipant(index)"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>

    <template slot="footer">
      <el-button
        class="block"
        type="text"
        @click="close"
      >
        {{ $t("close") }}
      </el-button>
      <el-button
        class="block"
        type="primary"
        @click="save"
      >
        {{ $t("save") }}
      </el-button>
    </template>

    <events-participants-add-dialog
      :event="event"
      :member="eventsParticipantsSelectedMember"
      :shown.sync="eventsParticipantsShowCreateDialog"
      @add="addParticipant"
    />
  </el-dialog>
</template>

<script lang="ts">
import { eventsParticipantsStub, eventsParticipantsWeaponsStub } from "~/stubs"
import EventsParticipantsAddDialog from "~/containers/EventsParticipantsAddDialog"
import Avatar from "~/components/Avatar"
import { db } from "~/db"
import { filterInput } from "~/utils"

export default {
  name: "EventsParticipantsManagerDialog",

  components: {
    Avatar,
    EventsParticipantsAddDialog
  },

  props: {
    shown: { type: Boolean, default: false },
    event: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown,
      clubsMembersSortOrders: [ "descending", "ascending" ],
      eventsParticipantsShowCreateDialog: false,
      eventsParticipantsSelectedMember: {},
      participantsToAdd: [],
      clubId: null,
      sub: null,
      eventsParticipants: [],
      eventsParticipantsIsLoading: false,
      clubs: [],
      clubsIsLoading: false,
      members: [],
      membersIsLoading: false
    }
  },

  computed: {
    filteredParticipants() {
      return this.members.filter(
        ({ id }) => ![
          ...this.eventsParticipants.map(({ memberId }) => memberId),
          ...this.participantsToAdd.map(({ memberId }) => memberId)
        ].includes(id)
      )
    }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    async open() {
      try {
        this.eventsParticipantsIsLoading = true
        db.events_participants.find({
          eventId: this.event.id
        }).$.subscribe((eventsParticipants) => {
          this.eventsParticipants = eventsParticipants
          this.eventsParticipantsIsLoading = false
        })

        this.clubsIsLoading = true
        db.clubs.find().$.subscribe((clubs) => {
          this.clubs = clubs
          this.clubsIsLoading = false
        })
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    addParticipant(participant) {
      this.participantsToAdd.push(participant)
    },

    removeParticipant(i) {
      this.participantsToAdd.splice(i, 1)
    },

    isClubActive(club) {
      return club.id === this.clubId
    },

    async fetchClubsMemebersList(club) {
      this.clubId = club.id
      this.membersIsLoading = true
      try {
        db.clubs_members.find({
          clubId: club.id
        }).$.subscribe((members) => {
          this.members = members
          this.membersIsLoading = false
        })
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    eventsParticipantsOpenCreateDialog(member) {
      this.eventsParticipantsSelectedMember = member
      this.eventsParticipantsShowCreateDialog = true
    },

    async save() {
      try {
        const participants = await db.events_participants.find({
          eventId: this.event.id
        }).exec()
        const numbers = participants.map(({ number }) => number)
        let number = (Math.max(...numbers) | 0) + 1

        await Promise.all(
          this.participantsToAdd.map(async (input) => {
            const data = filterInput(input, eventsParticipantsStub)
            data.number = number
            number += 1
            const participant = await db.events_participants.insert(data)
            return Promise.all(
              input.weapons.map((weaponInput) => {
                const weaponData = filterInput(weaponInput, eventsParticipantsWeaponsStub)
                weaponData.participantId = participant.id
                return db.events_participants_weapons.insert(weaponData)
              })
            )
          })
        )
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("saveSuccess", {
            members: this.participantsToAdd.length
          })
        })
        this.close()
        this.participantsToAdd = []
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
