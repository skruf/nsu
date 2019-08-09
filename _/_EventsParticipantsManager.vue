<i18n>
{
  "en": {
    "selectClub": "Select a club",
    "clubsSearchFormPlaceholder": "Search for clubs by name",
    "addClubsMembers": "Add members from selected club",
    "clubsMembersSearchFormPlaceholder": "Search for members by first or last name",
    "clubsMembersPlaceholderText": "Please select a club to add its members as participants",
    "currentParticipants": "Current participants",
    "participantsSearchFormPlaceholder": "Search for participants by first or last name",
    "eventsParticipantsRemoveOneSuccess": "Participant %{member} was removed from the event",
    "column1Label": "Participant",
    "column2Label": "Club",
    "column3Label": "Classes",
    "column4Label": "Calibres",
    "editParticipant": "Edit participant",
    "removeParticipant": "Remove participant",
    "tablePlaceholderText": "No participants yet."
  },
  "no": {
    "selectClub": "Velg en klubb",
    "clubsSearchFormPlaceholder": "Søk etter klubber med navn",
    "addClubsMembers": "Legg til medlemmer fra valgt klubb",
    "clubsMembersSearchFormPlaceholder": "Søk etter medlemmer med fornavn eller etternavn",
    "clubsMembersPlaceholderText": "Velg en klubb for å legge til deres medlemmer som deltakere",
    "currentParticipants": "Nåværende deltakere",
    "participantsSearchFormPlaceholder": "Søk etter deltakere med fornavn eller etternavn",
    "eventsParticipantsRemoveOneSuccess": "Deltakeren %{member} ble fjernet fra stevnet",
    "column1Label": "Deltaker",
    "column2Label": "Klubb",
    "column3Label": "Klasser",
    "column4Label": "Kalibre",
    "editParticipant": "Rediger deltaker",
    "removeParticipant": "Slett deltaker",
    "tablePlaceholderText": "Ingen deltakere enda."
  }
}
</i18n>

<style lang="stylus">
.events-participants-manager
  .el-table
    .h6, .small
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
</style>

<template>
  <div class="events-participants-manager flex flex-1">
    <div class="flex flex-1">
      <div
        v-loading="clubsStateListIsLoading"
        class="p-5 dialog_sidebar"
      >
        <h5 class="h5 pb-2">
          {{ $t("selectClub") }}
        </h5>

        <!-- <search-form
          v-model="clubsSearch"
          class="small py-2"
          :placeholder="$t('clubsSearchFormPlaceholder')"
          @submit="clubsSearchSubmit"
        /> -->

        <ul>
          <li
            v-for="club in clubsStateList"
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
        v-loading="clubsIsLoading"
        class="flex-1 p-5 overflow-y-scroll"
      >
        <h5 class="h5 pb-2">
          {{ $t("addClubsMembers") }}
        </h5>

        <!-- <search-form
          v-model="membersSearch"
          class="small py-2"
          :placeholder="$t('clubsMembersSearchFormPlaceholder')"
          @submit="membersSearchSubmit"
        /> -->

        <ul v-if="showClubMembers">
          <li
            v-for="member in clubsMembersListFilteredByEventsParticipants"
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
            <i class="el-icon-plus el-icon--right" />
          </li>
        </ul>
        <template v-else>
          <div class="data-placeholder">
            {{ $t("clubsMembersPlaceholderText") }}
          </div>
        </template>
      </div>
    </div>

    <!-- <div
      v-loading="eventsParticipantsIsLoading"
      class="flex-1 p-5"
    >
      <h5 class="h5 pb-2">
        {{ $t("currentParticipants") }}
      </h5>

      <search-form
        v-model="participantsSearch"
        class="small py-2"
        style="display:none;"
        :placeholder="$t('participantsSearchFormPlaceholder')"
        :disabled="true"
        @submit="participantsSearchSubmit"
      />

      <el-table
        :data="eventsParticipantsStateList"
        row-key="id"
        class="no-hover small"
        empty-text
      >
        <el-table-column
          prop="member"
          width="48px"
        >
          <template slot-scope="scope">
            <avatar
              :first-name="scope.row.member.firstName"
              :last-name="scope.row.member.lastName"
              size="small"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="firstName"
          :label="$t('column1Label')"
          :sort-orders="clubsMembersSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.member.firstName }} {{ scope.row.member.lastName }}
            </h6>
            <small class="small">
              {{ scope.row.member.emailAddress }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="club"
          :label="$t('column2Label')"
          :sort-orders="clubsMembersSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.member.club.name }}
            </h6>
            <small class="small">
              {{ scope.row.member.club.area }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="classes"
          :label="$t('column3Label')"
          :sort-orders="clubsMembersSortOrders"
        >
          <template slot-scope="scope">
            <h6
              v-for="(weaponClass, index) in scope.row.classes"
              :key="index"
              class="h6"
            >
              {{ weaponClass.name }}
            </h6>
          </template>
        </el-table-column>

        <el-table-column
          prop="calibres"
          :label="$t('column4Label')"
          :sort-orders="clubsMembersSortOrders"
        >
          <template slot-scope="scope">
            <h6
              v-for="(calibre, index) in scope.row.calibres"
              :key="index"
              class="h6"
            >
              {{ calibre }}
            </h6>
          </template>
        </el-table-column>

        <el-table-column
          width="50"
          align="right"
        >
          <template
            slot="header"
            slot-scope="scope"
          >
            <div
              class="table-actions"
              :class="{ 'disabled': !clubsMembersHasSelection }"
            >
              <el-dropdown
                trigger="click"
                @command="dispatchActions"
              >
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="{
                      handler: 'clubsMembersRemoveMany'
                    }"
                  >
                    <i class="el-icon-delete el-icon--left" />
                    {{ $t("removeSelected") }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>

          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="dispatchActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{
                    handler: 'clubsMembersOpenEditDialog',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-edit el-icon--left" />
                  {{ $t("editParticipant") }}
                </el-dropdown-item>

                <el-dropdown-item
                  divided
                  class="dropdown-menu-delete"
                  :command="{
                    handler: 'eventsParticipantsRemoveOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-delete el-icon--left" />
                  {{ $t("removeParticipant") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          {{ $t("tablePlaceholderText") }}
          <el-button
            type="text"
            @click="clubsMembersOpenCreateDialog"
          >
            {{ $t("tablePlaceholderButton") }}
          </el-button>
        </template>
      </el-table>
    </div> -->

    <events-participants-create-dialog
      :event="event"
      :member="eventsParticipantsSelectedMember"
      :shown.sync="eventsParticipantsShowCreateDialog"
    />
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex"
import Avatar from "~/components/Avatar"
// import SearchForm from "~/components/SearchForm"
import EventsParticipantsCreateDialog from "~/containers/EventsParticipantsCreateDialog"

export default {
  name: "EventsParticipantsManager",

  components: {
    Avatar,
    // SearchForm,
    EventsParticipantsCreateDialog
  },

  props: {
    event: { type: Object, required: true }
  },

  data: function() {
    return {
      clubsMembersSortOrders: [ "descending", "ascending" ],
      eventsParticipantsShowCreateDialog: false,
      eventsParticipantsSelectedMember: {},
      clubsSearch: "",
      membersSearch: "",
      participantsSearch: ""
    }
  },

  computed: {
    clubsMembersHasSelection() {
      return false
    },

    ...mapState("clubs", {
      clubsStateListIsLoading: "listIsLoading",
      clubsStateList: "list",
      clubsStateSelectedIsLoading: "selectedIsLoading",
      clubsStateSelected: "selected"
    }),

    ...mapState("clubs/members", {
      clubsMembersStateList: "list",
      clubsMembersStateListIsLoading: "listIsLoading"
    }),

    ...mapState("events/participants", {
      eventsParticipantsStateList: "list",
      eventsParticipantsStateListIsLoading: "listIsLoading",
      eventsParticipantsStateRemoveOneIsLoading: "removeOneIsLoading"
    }),

    showClubMembers() {
      return Object.keys(this.clubsMembersListFilteredByEventsParticipants)
        .length > 0
    },

    clubsMembersListFilteredByEventsParticipants() {
      return this.clubsMembersStateList.filter((member) => {
        return !this.eventsParticipantsStateList.filter(
          (participant) => {
            return participant.memberId === member.id
          }
        ).length > 0
      })
    },

    clubsIsLoading() {
      return (
        this.clubsStateSelectedIsLoading ||
        this.clubsMembersStateListIsLoading
      )
    },

    eventsParticipantsIsLoading() {
      return (
        this.eventsParticipantsStateListIsLoading ||
        this.eventsParticipantsStateRemoveOneIsLoading
      )
    }
  },

  async created() {
    this.eventsParticipantsMutationsSetListFilter({ eventId: this.event.id })
    await this.eventsParticipantsActionsList()
    await this.clubsActionsList()
  },

  methods: {
    isClubActive(club) {
      if(this.clubsStateSelected && club.id === this.clubsStateSelected.id) {
        return true
      }
    },

    ...mapMutations("events/participants", {
      eventsParticipantsMutationsSetListFilter: "SET_LIST_FILTER"
    }),

    ...mapActions("events/participants", {
      eventsParticipantsActionsList: "list",
      eventsParticipantsActionsRemoveOne: "removeOne"
    }),

    ...mapActions("clubs", {
      clubsActionsList: "list",
      clubsActionsSelect: "select"
    }),

    ...mapActions("clubs/members", {
      clubsMembersActionsList: "list"
    }),

    ...mapMutations("clubs/members", {
      clubsMembersMutationsSetListFilter: "SET_LIST_FILTER"
    }),

    async fetchClubsMemebersList(club) {
      try {
        await this.clubsActionsSelect({ id: club.id })
        this.clubsMembersMutationsSetListFilter({ clubId: club.id })
        await this.clubsMembersActionsList()
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

    async eventsParticipantsRemoveOne(participant) {
      try {
        const fullName = `${participant.member.firstName} ${participant.member.lastName}`
        await this.eventsParticipantsActionsRemoveOne(participant)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsParticipantsRemoveOneSuccess", {
            member: fullName
          })
        })
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    dispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    clubsMembersOpenCreateDialog() {
      this.$emit("clubsMembersOpenCreateDialog")
    },

    clubsSearchSubmit() {},
    membersSearchSubmit() {},
    participantsSearchSubmit() {}
  }
}
</script>
