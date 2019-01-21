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
  .avatar
    margin-right 10px

  .placeholder
    display flex
    align-items center
    justify-content center
    flex 1
    text-align center

  // .event_participants
  //   .list_item
  //     align-items flex-start

</style>

<template>
  <div class="events-participants-manager">
    <div
      v-loading="clubsListIsLoading"
      class="content column clubs"
    >
      <h5 class="h5 py-2">
        Select a club
      </h5>

      <search-form
        v-model="clubsSearch"
        class="small py-2"
        placeholder="Search clubs by name"
        @submit="clubsSearchSubmit"
      />

      <ul class="list">
        <li
          v-for="club in clubsList"
          :key="club._id"
          :class="[ 'list_item', isClubActive(club) ]"
          @click="fetchClubsMemebersListAsync(club)"
        >
          {{ club.name }} <i class="el-icon-arrow-right" />
        </li>
      </ul>
    </div>

    <div
      v-loading="clubsSelectedOrListIsLoading"
      class="content column clubs_members"
    >
      <h5 class="h5 py-2">
        Add members from selected club
      </h5>

      <search-form
        v-model="membersSearch"
        class="small py-2"
        placeholder="Search members by name"
        @submit="membersSearchSubmit"
      />

      <ul
        v-if="showClubMembers"
        class="list"
      >
        <li
          v-for="member in clubsMembersListFilteredByEventsParticipants"
          :key="member._id"
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
      v-loading="eventsParticipantsListOrRemoveIsLoading"
      class="content column event_participants"
    >
      <h5 class="h5 py-2">
        Current participants
      </h5>

      <search-form
        v-model="participantsSearch"
        class="small py-2"
        placeholder="Search participants by name"
        @submit="participantsSearchSubmit"
      />

      <ul class="list">
        <li
          v-for="participant in eventsParticipantsList"
          :key="participant._id"
          class="list_item"
          @click="eventsParticipantsDeleteAsync(participant)"
        >
          <div class="list_item_member">
            <avatar
              :first-name="participant.member.firstName"
              :last-name="participant.member.lastName"
              size="small"
            />
            <div>
              <div class="-mb-3">
                {{ participant.member.firstName }} {{ participant.member.lastName }}
              </div>
              <!-- <small class="small">{{ participant.member.clubName }}</small> -->
              <small class="small">
                Colt / 25m
              </small>
            </div>
          </div>
          <i class="el-icon-close el-icon--right" />
        </li>
      </ul>
    </div>

    <el-dialog
      v-if="eventsParticipantsShowCreateDialog"
      :title="`Add ${eventsParticipantsSelectedMember.firstName} ${eventsParticipantsSelectedMember.lastName} to the event`"
      custom-class="create-dialog"
      :visible.sync="eventsParticipantsShowCreateDialog"
      @close="eventsParticipantsOnCloseCreateDialog"
    >
      <div
        v-loading="eventsParticipantsCreateIsLoading"
        class="dialog_content"
      >
        <el-form
          ref="eventsParticipantsCreateForm"
          label-position="top"
          :model="eventsParticipantsCreateForm"
          :rules="eventsParticipantsCreateFormRules"
        >
          <el-form-item
            label="Class(es)"
            prop="classes"
          >
            <el-select
              v-model="eventsParticipantsCreateForm.classes"
              placeholder="Select one or more class(es)"
              :loading="classesListIsLoading"
            >
              <el-option
                v-for="classItem in classesList"
                :key="classItem._id"
                :label="classItem.name"
                :value="classItem._id"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="Calibre(s)"
            prop="calibres"
          >
            <el-select
              v-model="eventsParticipantsCreateForm.calibres"
              placeholder="Select one or more calibre(s)"
            >
              <el-option
                v-for="(calibre, index) in [ '5mm', '10mm', '15mm', '20mm', '25mm', '30mm', '35mm' ]"
                :key="index"
                :label="calibre"
                :value="calibre"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <template slot="footer">
        <el-button
          class="block"
          type="text"
          @click="eventsParticipantsCloseCreateDialog"
        >
          Cancel
        </el-button>
        <el-button
          class="block"
          type="primary"
          @click="eventsParticipantsSubmitCreateDialog"
        >
          Save
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex"
import Avatar from "@/components/Avatar"
import SearchForm from "@/components/SearchForm"
import { eventsParticipantsStub } from "@/stubs"

export default {
  name: "EventsParticipantsManager",

  components: {
    Avatar,
    SearchForm
  },

  props: {
    event: { type: Object, required: true }
  },

  data: function() {
    return {
      eventsParticipantsShowCreateDialog: false,
      eventsParticipantsSelectedMember: {},
      eventsParticipantsCreateForm: { ...eventsParticipantsStub },
      eventsParticipantsCreateFormRules: {
        memberId: { required: true, message: "Member is a required field" },
        eventId: { required: true, message: "Event is a required field" }
      },
      clubsSearch: "",
      membersSearch: "",
      participantsSearch: ""
    }
  },

  computed: {
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
      eventsParticipantsCreateIsLoading: "createIsLoading",
      eventsParticipantsRemoveIsLoading: "removeIsLoading"
    }),
    ...mapState("classes", {
      classesListIsLoading: "listIsLoading",
      classesList: "list"
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

  async created() {
    this.eventsParticipantsSetListFilter({ eventId: this.event._id })
    await this.eventsParticipantsListAsync()
    await this.clubsListAsync()
    await this.classesListAsync()
  },

  methods: {
    isClubActive(club) {
      if(this.clubsSelected && club._id === this.clubsSelected._id) {
        return "is-active"
      }
    },

    ...mapMutations("events/participants", {
      eventsParticipantsSetListFilter: "SET_LIST_FILTER"
    }),

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

    ...mapActions("classes", {
      classesListAsync: "listAsync"
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

    eventsParticipantsOpenCreateDialog(member) {
      this.eventsParticipantsSelectedMember = member
      this.eventsParticipantsCreateForm.memberId = member._id
      this.eventsParticipantsCreateForm.eventId = this.event._id
      this.eventsParticipantsShowCreateDialog = true
    },

    async eventsParticipantsSubmitCreateDialog() {
      this.$refs.eventsParticipantsCreateForm.validate(async (isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: "Please fill in all required fields before saving"
          })
        }

        try {
          await this.eventsParticipantsCreateAsync(this.eventsParticipantsCreateForm)
          this.$notify({
            type: "success",
            title: "Success",
            message: `${this.eventsParticipantsSelectedMember.firstName} ${this.eventsParticipantsSelectedMember.lastName} was added to the event`
          })
          await this.eventsParticipantsListAsync()
        } catch(e) {
          this.$notify({ type: "error", title: "Oops!", message: e.message })
        }
      })
    },

    eventsParticipantsOnCloseCreateDialog() {
      this.eventsParticipantsSelectedMember = {}
      this.eventsParticipantsCreateForm = { ...eventsParticipantsStub }
    },

    eventsParticipantsCloseCreateDialog() {
      this.eventsParticipantsShowCreateDialog = false
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
    participantsSearchSubmit() {}
  }
}
</script>
