<style lang="stylus">
ul
  padding 0
li
  list-style-type none

.events-participants-create-or-add-dialog
  position relative
  padding-bottom 80px
  display flex
  flex-direction column

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
    :title="`Add / create participants to ${eventTitle}`"
    custom-class="events-participants-create-or-add-dialog"
    :fullscreen="true"
    :visible.sync="visible"
    @close="close"
  >
    <div class="flex min-h-full w-full">
      <div class="column">
        <h4 class="h4">Clubs</h4>

        <search-form
          v-model="clubsSearch"
          @submit="clubsSearchSubmit"
          placeholder="Search for a club by name"
        />

        <ul class="">
          <li
            v-for="club in clubs"
            :key="club._id"
            @click="selectClub(club)"
            class="py-4"
          >
            {{ club.name }}
          </li>
        </ul>
      </div>

      <div class="column">
        <template v-if="showClubMembers">
          <h4 class="h4">{{ selectedClub.name }}'s members</h4>
          <search-form
            v-model="membersSearch"
            @submit="membersSearchSubmit"
            placeholder="Search for a member by name"
          />
          <ul class="">
            <li
              v-for="member in membersInSelectedClub"
              :key="member._id"
              @click="selectParticipant(member)"
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

      <div class="column">
        <h4 class="h4">Added participants</h4>
        <search-form
          v-model="participantsSearch"
          @submit="participantsSearchSubmit"
          placeholder="Search for a participant by name"
        />
        <ul class="">
          <li
            v-for="participant in selectedParticipants"
            :key="participant._id"
            @click="selectParticipant(participant)"
            class="py-4"
          >
            {{ participant.firstName }} {{ participant.lastName }}
          </li>
        </ul>
      </div>
    </div>

    <template slot="footer">
      <div class="dialog-footer flex">
        <el-button class="block" type="primary" @click="clubsMembersOpenCreateOrAddDialog">
          <i class="el-icon-plus el-icon--right"></i> Create club member
        </el-button>
        <el-button class="block" type="default" @click="close">Cancel</el-button>
        <el-button class="block" type="primary" @click="submit">Save</el-button>
      </div>
    </template>

    <clubs-members-create-or-add-dialog
      :shown.sync="clubsMembersShowCreateOrAddDialog"
    />
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { clubs, members } from "@/../../mocks"
import SearchForm from "@/components/SearchForm"
import ClubsMembersCreateOrAddDialog from "@/containers/clubs/members/ClubsMembersCreateOrAddDialog"

export default {
  name: "EventsParticipantsCreateOrAddDialog",

  components: {
    SearchForm,
    ClubsMembersCreateOrAddDialog
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

  computed: {
    ...mapState("events", {
      eventsParticipantsCreateIsLoading: "createIsLoading"
    }),
    showClubMembers() {
      return Object.keys(this.selectedClub).length > 0
    },
    membersInSelectedClub() {
      return members.filter((member) => {
        return (member.clubId === this.selectedClub._id) && (this.selectedParticipants.indexOf(member) === -1)
      })
    }
  },

  data: function() {
    return {
      visible: this.shown,
      clubsMembersShowCreateOrAddDialog: false,

      selectedClub: {},
      selectedParticipants: [],
      clubs: clubs,
      members: members,
      clubsSearch: "",
      membersSearch: "",
      participantsSearch: ""
    }
  },

  methods: {
    ...mapActions("events/participants", {
      eventsParticipantsCreateAsync: "createAsync"
    }),
    clubsMembersOpenCreateOrAddDialog() {
      this.clubsMembersShowCreateOrAddDialog = true
    },
    close() {
      this.visible = false
      this.$emit("update:shown", false)
    },

    submit() {
      this.$notify({
        type: "success",
        title: "Ehueuhe",
        message: "todo..."
      })
      this.close()
    },

    selectClub(club) {
      this.selectedClub = club
    },
    selectParticipant(member) {
      this.selectedParticipants.push(member)
    },
    clubsSearchSubmit() {},
    membersSearchSubmit() {},
    participantsSearchSubmit() {}
  }
}
</script>
