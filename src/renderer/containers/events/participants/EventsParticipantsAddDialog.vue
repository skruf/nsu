<style lang="stylus">
ul
  padding 0
li
  list-style-type none

.el-dialog.events-participants-add-dialog
  position relative
  padding-bottom 80px
  display flex
  flex-direction column
  margin 5% 5% 10% 5%
  height 85%
  width 90%

  .el-tabs,
  .el-tabs__content,
  .el-dialog__body
    display flex

  .el-dialog__body
    flex-grow 1
    padding-bottom 0
  .el-tabs
    flex-direction column
  .el-tabs,
  .el-tabs__content,
  .el-tab-pane
    flex-grow 1

  .column
    flex 1
    padding 1rem
    border-right 1px solid var(--border-color)
    &:last-child
      border-right none

  li
    border-bottom 1px solid var(--border-color)
    &:last-of-type
      border-bottom none

  .el-dialog__footer
    padding 0
  .dialog-footer
    position absolute
    left 0
    bottom 0
    height 80px
    width 100%
    border-top 1px solid var(--border-color)
    display flex
    align-items center
    padding-left 20px

  .search-form
    padding 0

</style>

<template>
  <el-dialog
    :title="`Manage participants for ${eventTitle}`"
    custom-class="events-participants-add-dialog"
    :fullscreen="true"
    :visible.sync="visible"
    @close="close"
  >
    <div class="flex min-h-full w-full">

      <div
        v-loading="clubsListIsLoading"
        class="column clubs"
      >
        <h4 class="h4">Clubs</h4>

        <search-form
          v-model="clubsSearch"
          @submit="clubsSearchSubmit"
          placeholder="Search for a club by name"
        />

        <ul class="">
          <li
            v-for="club in clubsList"
            :key="club._id"
            @click="fetchClubsMemebersListAsync(club)"
            class="py-4"
          >
            {{ club.name }}
          </li>
        </ul>
      </div>

      <div
        v-loading="clubsSelectedOrListIsLoading"
        class="column clubs_members"
      >
        <template v-if="showClubMembers">
          <h4 class="h4">{{ clubsSelected.name }}'s members</h4>

          <search-form
            v-model="membersSearch"
            @submit="membersSearchSubmit"
            placeholder="Search for a member by name"
          />

          <ul class="">
            <li
              v-for="member in clubsMembersListFilteredByEventsParticipants"
              :key="member._id"
              @click="eventsParticipantsAdd(member)"
              class="py-4"
            >
              {{ member.firstName }} {{ member.lastName }}
            </li>
          </ul>
        </template>

        <template v-else>
          <small class="small">Please select a club</small>
        </template>
      </div>

      <div
        v-loading="eventsParticipantsListOrRemoveIsLoading"
        class="column event_participants"
      >
        <h4 class="h4">Added participants</h4>

        <search-form
          v-model="participantsSearch"
          @submit="participantsSearchSubmit"
          placeholder="Search for a participant by name"
        />

        <ul class="">
          <li
            v-for="participant in eventsParticipantsList"
            :key="participant._id"
            @click="eventsParticipantsDeleteAsync(participant)"
            class="py-4"
          >
            {{ participant.member.firstName }} {{ participant.member.lastName }}
          </li>
        </ul>
      </div>

    </div>

    <template slot="footer">
      <div class="dialog-footer flex justify-end pr-8">
        <!-- <el-button class="block" type="primary" @click="submit">
          Add selected participants
        </el-button> -->
        <el-button class="block" type="default" @click="close">
          Close
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex"
import SearchForm from "@/components/SearchForm"

export default {
  name: "EventsParticipantsAddDialog",

  components: {
    SearchForm
  },

  props: {
    shown: { type: Boolean, default: false },
    eventId: { type: String, required: true },
    eventTitle: { type: String, required: true }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  async created() {
    await this.clubsListAsync()
  },

  computed: {
    ...mapState("events", {
      eventsParticipantsCreateIsLoading: "createIsLoading"
    }),
    ...mapState("clubs", {
      clubsListIsLoading: "listIsLoading",
      clubsList: "list",
      clubsSelectedIsLoading: "selectedIsLoading",
      clubsSelected: "selected"
    }),
    ...mapState("clubs/members", {
      clubsMembersList: "list",
      clubsMembersListIsLoading: "listIsLoading"
    }),
    ...mapState("events/participants", {
      eventsParticipantsList: "list",
      eventsParticipantsListIsLoading: "listIsLoading",
      eventsParticipantsRemoveIsLoading: "removeIsLoading"
    }),
    showClubMembers() {
      return Object.keys(this.clubsSelected).length > 0
    },
    clubsMembersListFilteredByEventsParticipants() {
      return this.clubsMembersList.filter((member) => {
        return !this.eventsParticipantsList.filter(
          (participant) => {
            return participant.memberId === member._id
          }
        ).length > 0
      })
    },
    clubsSelectedOrListIsLoading() {
      return (this.clubsSelectedIsLoading || this.clubsMembersListIsLoading)
    },
    eventsParticipantsListOrRemoveIsLoading() {
      return (this.eventsParticipantsListIsLoading || this.eventsParticipantsRemoveIsLoading)
    }
  },

  data: function() {
    return {
      visible: this.shown,
      clubsSearch: "",
      membersSearch: "",
      participantsSearch: ""
    }
  },

  methods: {
    ...mapActions("events/participants", {
      eventsParticipantsListAsync: "listAsync",
      eventsParticipantsCreateAsync: "createAsync",
      eventsParticipantsRemoveAsync: "removeAsync"
    }),

    ...mapActions("clubs", {
      clubsListAsync: "listAsync",
      clubsSelectAsync: "selectAsync"
    }),

    ...mapActions("clubs/members", {
      clubsMembersListAsync: "listAsync"
    }),

    ...mapMutations("clubs/members", {
      clubsMembersSetListFilter: "SET_LIST_FILTER"
    }),

    async fetchClubsMemebersListAsync(club) {
      try {
        await this.clubsSelectAsync({ _id: club._id })
        this.clubsMembersSetListFilter({ clubId: club._id })
        await this.clubsMembersListAsync()
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    async eventsParticipantsAdd(member) {
      const participant = { eventId: this.eventId, memberId: member._id }
      try {
        await this.eventsParticipantsCreateAsync(participant)
        this.$notify({
          type: "success",
          title: "Success",
          message: `${member.firstName} ${member.lastName} was added to the event`
        })
        await this.eventsParticipantsListAsync()
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    async eventsParticipantsDeleteAsync(participant) {
      try {
        // const filter = { eventId: this.eventId, memberId: participant._id }
        await this.eventsParticipantsRemoveAsync(participant)
        this.$notify({
          type: "success",
          title: "Success",
          message: `${participant.member.firstName} ${participant.member.lastName} was removed from the event`
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
    participantsSearchSubmit() {},

    submit() {
      this.$notify({
        type: "success",
        title: "Ehueuhe",
        message: "todo..."
      })
      this.close()
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
