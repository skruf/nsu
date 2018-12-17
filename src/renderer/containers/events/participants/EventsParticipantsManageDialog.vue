<style lang="stylus">
.el-dialog.events-participants-manage-dialog
  padding-bottom 80px
  display flex
  flex-direction column
  position fixed
  left 5%
  top 5%
  right 5%
  bottom 5%
  height 90%
  width 90%

  .el-tabs,
  .el-tabs__content,
  .el-dialog__body
    display flex

  .el-dialog__header
    border-bottom 1px solid var(--border-color)

  .el-dialog__body
    flex-grow 1
    padding 0
  .el-tabs
    flex-direction column
  .el-tabs,
  .el-tabs__content,
  .el-tab-pane
    flex-grow 1

  .column
    flex 1
    border-left 1px solid var(--border-color)
    overflow-y auto
    display flex
    flex-direction column
    // resize horizontal
    &:first-child
      border-left none

  .h5
    padding 15px

  li
    border-bottom 1px solid var(--border-color)
    padding 10px 20px
    &:hover
      color var(--primary-color)
      cursor pointer
    &.is-active
      background-color var(--primary-alt-color)
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
    justify-content flex-end
    padding-left 20px
    padding-right 20px

  .search-form
    margin 0 10px 20px
    .el-button
      margin-left 10px

  .placeholder
    display flex
    align-items center
    justify-content center
    flex 1

</style>

<template>
  <el-dialog
    :title="`Manage participants for ${event.title}`"
    custom-class="events-participants-manage-dialog"
    :fullscreen="true"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <div class="flex min-h-full w-full">

      <div
        v-loading="clubsListIsLoading"
        class="column clubs"
      >
        <h5 class="h5">Select a club</h5>

        <search-form
          class="small"
          v-model="clubsSearch"
          @submit="clubsSearchSubmit"
          placeholder="Search clubs by name"
        />

        <ul class="">
          <li
            v-for="club in clubsList"
            :key="club._id"
            :class="isClubActive(club)"
            @click="fetchClubsMemebersListAsync(club)"
          >
            {{ club.name }}
          </li>
        </ul>
      </div>

      <div
        v-loading="clubsSelectedOrListIsLoading"
        class="column clubs_members"
      >
        <h5 class="h5">Select club members</h5>

        <search-form
          class="small"
          v-model="membersSearch"
          @submit="membersSearchSubmit"
          placeholder="Search members by name"
        />

        <template v-if="showClubMembers">
          <ul class="">
            <li
              v-for="member in clubsMembersListFilteredByEventsParticipants"
              :key="member._id"
              @click="eventsParticipantsAdd(member)"
            >
              {{ member.firstName }} {{ member.lastName }}
            </li>
          </ul>
        </template>

        <template v-else>
          <small class="small placeholder">Please select a club</small>
        </template>
      </div>

      <div
        v-loading="eventsParticipantsListOrRemoveIsLoading"
        class="column event_participants"
      >
        <h5 class="h5">Added participants</h5>

        <search-form
          class="small"
          v-model="participantsSearch"
          @submit="participantsSearchSubmit"
          placeholder="Search participants by name"
        />

        <ul class="">
          <li
            v-for="participant in eventsParticipantsList"
            :key="participant._id"
            @click="eventsParticipantsDeleteAsync(participant)"
          >
            {{ participant.member.firstName }} {{ participant.member.lastName }}
          </li>
        </ul>
      </div>
    </div>

    <template slot="footer">
      <div class="dialog-footer">
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
  name: "EventsParticipantsManageDialog",

  components: {
    SearchForm
  },

  props: {
    shown: { type: Boolean, default: false },
    event: { type: Object, required: true }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
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
    async open() {
      await this.clubsListAsync()
    },

    isClubActive(club) {
      if(this.clubsSelected && club._id === this.clubsSelected._id) {
        return "is-active"
      }
    },

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
      const participant = { eventId: this.event._id, memberId: member._id }
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
        // const filter = { eventId: this.event._id, memberId: participant._id }
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
