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
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Choose from clubs" name="add">
        <div class="flex min-h-full">

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
      </el-tab-pane>

      <el-tab-pane label="Create new member" name="create">
        <el-form
          ref="form"
          label-position="top"
          :model="form"
          :rules="formRules"
          class="py-4"
        >
          <el-form-item label="First name" prop="firstName">
            <el-input placeholder="Enter a first name" v-model="form.firstName"></el-input>
          </el-form-item>

          <el-form-item label="Last name" prop="lastName">
            <el-input placeholder="Enter a last name" v-model="form.lastName"></el-input>
          </el-form-item>

          <el-form-item label="Email address" prop="emailAddress">
            <el-input placeholder="Enter a email address" v-model="form.emailAddress"></el-input>
          </el-form-item>

          <el-form-item label="Phone number" prop="phoneNumber">
            <el-input placeholder="Enter a phone number" v-model="form.phoneNumber"></el-input>
          </el-form-item>

          <el-form-item label="Country" prop="country">
            <el-input placeholder="Enter a country" v-model="form.country"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <template slot="footer">
      <div class="dialog-footer flex">
        <el-button class="block" type="default" @click="close">Cancel</el-button>
        <el-button class="block" type="primary" @click="submit">Save</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { clubs, members } from "@/../../mocks"
import SearchForm from "@/components/SearchForm"

const formStub = {
  firstName: "Ola",
  lastName: "Dunk",
  emailAddress: "ola@dunk.no",
  country: "Norway",
  phoneNumber: "34 342 414"
}

export default {
  name: "EventsParticipantsCreateOrAddDialog",
  components: { SearchForm },
  props: {
    shown: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false },
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
    showClubMembers() {
      return Object.keys(this.selectedClub).length > 0
    },
    membersInSelectedClub() {
      return members.filter((member) => {
        return (member.clubId === this.selectedClub._id) && (this.selectedParticipants.indexOf(member) === -1)
      })
    }
    // membersNotSelectedAsParticipant() {
    //   return this.membersInSelectedClub.filter((member) => {
    //     let include = true
    //     this.selectedParticipants.forEach((participant) => {
    //       if(participant._id === member._id) {
    //         include = false
    //       }
    //     })
    //     return include
    //   })
    // }
  },
  data: function() {
    return {
      clubs: clubs,
      members: members,
      visible: this.shown,
      form: formStub,
      formRules: {
        firstName: { required: true, message: "First name is a required field" },
        lastName: { required: true, message: "Last name is a required field" }
      },
      activeTab: "add",
      selectedClub: {},
      selectedParticipants: [],

      clubsSearch: "",
      membersSearch: "",
      participantsSearch: ""
    }
  },
  methods: {
    clubsSearchSubmit() {},
    membersSearchSubmit() {},
    participantsSearchSubmit() {},
    selectClub(club) {
      this.selectedClub = club
    },
    selectParticipant(member) {
      this.selectedParticipants.push(member)
    },
    submit() {
      this.$refs.form.validate((isValid) => {
        if(!isValid) {
          return this.$notify({
            title: "Oops!",
            message: "Please fill in all required fields before saving",
            type: "error"
          })
        }
        this.form.clubId = this.clubId
        this.$emit("submit", this.form)
      })
    },
    clear() {
      this.form = { ...formStub }
    },
    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
