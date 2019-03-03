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
        v-loading="eventsParticipantsStateCreateIsLoading"
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
              :loading="classesStateListIsLoading"
            >
              <el-option
                v-for="classItem in classesStateList"
                :key="classItem.id"
                :label="classItem.name"
                :value="classItem.id"
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
      eventsParticipantsStateCreateIsLoading: "createIsLoading",
      eventsParticipantsStateRemoveOneIsLoading: "removeOneIsLoading"
    }),

    ...mapState("classes", {
      classesStateListIsLoading: "listIsLoading",
      classesStateList: "list"
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
    await this.classesActionsList()
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
      eventsParticipantsActionsCreate: "create",
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

    ...mapActions("classes", {
      classesActionsList: "list"
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
      this.eventsParticipantsCreateForm.memberId = member.id
      this.eventsParticipantsCreateForm.eventId = this.event.id
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
          const fullName = `${this.eventsParticipantsSelectedMember.firstName} ${this.eventsParticipantsSelectedMember.lastName}`
          await this.eventsParticipantsActionsCreate(this.eventsParticipantsCreateForm)
          this.$notify({
            type: "success",
            title: "Success",
            message: `${fullName} was added to the event`
          })
          await this.eventsParticipantsActionsList()
        } catch(e) {
          this.$notify({
            type: "error",
            title: "Oops!",
            message: e.message
          })
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

    async eventsParticipantsDeleteOne(participant) {
      try {
        // const filter = { eventId: this.event.id, memberId: participant.id }
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
