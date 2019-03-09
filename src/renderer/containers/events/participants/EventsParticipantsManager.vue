<style lang="stylus">
.events-participants-manager
  display flex
  flex 1
  padding-top 20px
  padding-bottom 20px

  .column
    border-left 1px solid var(--border-color)
    display flex
    flex-direction column
    padding-top 0
    padding-bottom 0
    // resize horizontal
    &:first-child
      border-left none

  .list
    margin-top 5px

  .list_item
    // border-bottom var(--border-width) solid var(--border-color)
    padding 10px
    display flex
    align-items center
    justify-content space-between
    border-radius var(--border-radius)
    &:hover
      color var(--primary-color)
      cursor pointer
    &.is-active
      background-color var(--bg-alt-color)
    &:last-of-type
      border-bottom none

  .list_item_member
    display flex
    align-items center
    line-height 1.2
  .avatar
    margin-right 10px

  .placeholder
    display flex
    align-items center
    justify-content center
    flex 1
    text-align center

  .participant_attributes
    .small:not(:last-child):after
      content "•"

  // .event_participants
  //   .list_item
  //     align-items flex-start

</style>

<template>
  <div class="events-participants-manager">
    <div
      v-loading="clubsStateListIsLoading"
      class="content column clubs"
    >
      <h5 class="h5 py-2">
        Select a club
      </h5>

      <search-form
        v-model="clubsSearch"
        class="small py-2"
        placeholder="Search clubs by name"
        :disabled="true"
        @submit="clubsSearchSubmit"
      />

      <ul class="list">
        <li
          v-for="club in clubsStateList"
          :key="club.id"
          :class="[ 'list_item', isClubActive(club) ]"
          @click="fetchClubsMemebersList(club)"
        >
          {{ club.name }} <i class="el-icon-arrow-right" />
        </li>
      </ul>
    </div>

    <div
      v-loading="clubsIsLoading"
      class="content column clubs_members"
    >
      <h5 class="h5 py-2">
        Add members from selected club
      </h5>

      <search-form
        v-model="membersSearch"
        class="small py-2"
        placeholder="Search members by name"
        :disabled="true"
        @submit="membersSearchSubmit"
      />

      <ul
        v-if="showClubMembers"
        class="list"
      >
        <li
          v-for="member in clubsMembersListFilteredByEventsParticipants"
          :key="member.id"
          class="list_item"
          @click="eventsParticipantsOpenCreateDialog(member)"
        >
          <div class="list_item_member">
            <avatar
              :first-name="member.firstName"
              :last-name="member.lastName"
              size="small"
            />
            {{ member.firstName }} {{ member.lastName }}
          </div>
          <i class="el-icon-plus el-icon--right" />
        </li>
      </ul>

      <template v-else>
        <small class="small placeholder">
          Please select a club to add members as participants
        </small>
      </template>
    </div>

    <div
      v-loading="eventsParticipantsIsLoading"
      class="content column event_participants"
    >
      <h5 class="h5 py-2">
        Current participants
      </h5>

      <search-form
        v-model="participantsSearch"
        class="small py-2"
        placeholder="Search participants by name"
        :disabled="true"
        @submit="participantsSearchSubmit"
      />

      <ul class="list">
        <li
          v-for="participant in eventsParticipantsStateList"
          :key="participant.id"
          class="list_item"
          @click="eventsParticipantsDeleteOne(participant)"
        >
          <div class="list_item_member">
            <avatar
              :first-name="participant.member.firstName"
              :last-name="participant.member.lastName"
              size="small"
            />

            <div>
              <div class="participant_name">
                {{ participant.member.firstName }} {{ participant.member.lastName }}
                <br>
                <small class="small">
                  ({{ participant.member.club.name }})
                </small>
              </div>

              <div class="participant_attributes">
                <small
                  v-for="(weaponClass, index) in participant.classes"
                  :key="weaponClass.id"
                  class="small"
                >
                  {{ weaponClass.name }}
                </small>

                <small
                  v-for="(calibre, index) in participant.calibres"
                  :key="index"
                  class="small"
                >
                  {{ calibre }}
                </small>
              </div>
            </div>
          </div>
          <i class="el-icon-close el-icon--right" />
        </li>
      </ul>
    </div>

    <events-participants-create-dialog
      :event="event"
      :member="eventsParticipantsSelectedMember"
      :shown.sync="eventsParticipantsShowCreateDialog"
    />
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex"
import Avatar from "@/components/Avatar"
import SearchForm from "@/components/SearchForm"
import EventsParticipantsCreateDialog from "@/containers/events/participants/EventsParticipantsCreateDialog"

export default {
  name: "EventsParticipantsManager",

  components: {
    Avatar,
    SearchForm,
    EventsParticipantsCreateDialog
  },

  props: {
    event: { type: Object, required: true }
  },

  data: function() {
    return {
      eventsParticipantsShowCreateDialog: false,
      eventsParticipantsSelectedMember: {},
      clubsSearch: "",
      membersSearch: "",
      participantsSearch: ""
    }
  },

  computed: {
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
      return Object.keys(this.clubsStateSelected).length > 0
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
        return "is-active"
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

    async eventsParticipantsDeleteOne(participant) {
      try {
        const fullName = `${participant.member.firstName} ${participant.member.lastName}`
        await this.eventsParticipantsActionsRemoveOne(participant)
        this.$notify({
          type: "success",
          title: "Success",
          message: `${fullName} was removed from the event`
        })
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    clubsSearchSubmit() {},
    membersSearchSubmit() {},
    participantsSearchSubmit() {}
  }
}
</script>
