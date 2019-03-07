<style lang="stylus">
</style>

<template>
  <el-container
    id="events-create-screen"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[
          { to: '/events', label: 'Events' },
          { to: '/events/create', label: 'Create' }
        ]"
      />

      <div class="page-titles">
        <h1 class="h1">
          Create a new event
        </h1>
      </div>
    </el-header>

    <el-main v-loading="eventsStateCreateIsLoading">
      <el-tabs v-model="activeTab">
        <el-tab-pane
          label="Step 1: Event details"
          name="step1"
        >
          <el-form
            ref="eventDetailsForm"
            label-position="top"
            :model="eventDetailsForm"
            :rules="eventDetailsFormRules"
            class="content"
          >
            <div class="fieldset">
              <div class="fieldset_details">
                <legend class="h5 py-2">
                  Event details
                </legend>
                <p class="p block">
                  From its medieval origins to the digital era, learn everything there is to know about the ubiquitous lorem ipsum passage.
                </p>
              </div>

              <div class="fieldset_fields">
                <el-form-item
                  label="Title"
                  prop="title"
                >
                  <el-input
                    v-model="eventDetailsForm.title"
                    placeholder="Enter a title"
                  />
                </el-form-item>

                <el-form-item
                  label="Start / End"
                  prop="dates"
                >
                  <el-date-picker
                    v-model="eventDetailsForm.dates"
                    type="daterange"
                    range-separator="to"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                  />
                </el-form-item>

                <el-form-item
                  label="Category"
                  prop="category"
                >
                  <el-select
                    v-model="eventDetailsForm.category"
                    placeholder="Select a category"
                  >
                    <el-option
                      v-for="(category, index) in eventsStateCategories"
                      :key="index"
                      :label="category"
                      :value="category"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="Organizer"
                  prop="organizerId"
                >
                  <el-select
                    v-model="eventDetailsForm.organizerId"
                    placeholder="Select the organizer"
                    :loading="clubsStateListIsLoading"
                  >
                    <el-option
                      v-for="club in clubsStateList"
                      :key="club.id"
                      :label="club.name"
                      :value="club.id"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="Range"
                  prop="rangeId"
                >
                  <el-select
                    v-model="eventDetailsForm.rangeId"
                    placeholder="Select the range"
                    :loading="rangesStateListIsLoading"
                  >
                    <el-option
                      v-for="range in rangesStateList"
                      :key="range.id"
                      :label="range.name"
                      :value="range.id"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="Approbated"
                  prop="approbated"
                >
                  <el-switch
                    v-model="eventDetailsForm.approbated"
                    active-text="Is officially approbated?"
                  />
                </el-form-item>
              </div>
            </div>
          </el-form>

          <el-footer height="auto">
            <el-button
              type="text"
              @click="discard"
            >
              <i class="el-icon-close el-icon--left" /> Discard
            </el-button>
            <el-button
              type="primary"
              @click="eventDetailsFormSubmit"
            >
              Save & Continue <i class="el-icon-arrow-right el-icon--right" />
            </el-button>
          </el-footer>
        </el-tab-pane>

        <el-tab-pane
          label="Step 2: Add participants"
          :disabled="step2Disabled"
          name="step2"
        >
          <template v-if="!step2Disabled">
            <events-participants-manager :event="eventsStateSelected" />
          </template>

          <el-footer height="auto">
            <div class="flex justify-between w-full">
              <el-button
                type="text"
                @click="clubsMembersOpenCreateDialog"
              >
                <i class="el-icon-plus el-icon--left" /> Create club member
              </el-button>

              <div>
                <el-button
                  type="text"
                  @click="navToStep1"
                >
                  <i class="el-icon-arrow-left el-icon--left" /> Back
                </el-button>
                <el-button
                  type="primary"
                  @click="navToStep3"
                >
                  Continue <i class="el-icon-arrow-right el-icon--right" />
                </el-button>
              </div>
            </div>
          </el-footer>
        </el-tab-pane>

        <el-tab-pane
          label="Step 3: Create divisions"
          :disabled="step3Disabled"
          name="step3"
        >
          <div
            v-if="!step3Disabled"
            class="content"
          >
            <events-divisions-list :event="eventsStateSelected" />
          </div>

          <el-footer height="auto">
            <div class="flex justify-between w-full">
              <el-button
                type="text"
                @click="eventsDivisionsOpenCreateDialog"
              >
                <i class="el-icon-plus el-icon--left" /> Create division
              </el-button>

              <div>
                <el-button
                  type="text"
                  @click="navToStep2"
                >
                  <i class="el-icon-arrow-left el-icon--left" /> Back
                </el-button>
                <el-button type="primary">
                  Finish <i class="el-icon-check el-icon--right" />
                </el-button>
              </div>
            </div>
          </el-footer>
        </el-tab-pane>
      </el-tabs>
    </el-main>

    <clubs-members-create-dialog
      :shown.sync="clubsMembersShowCreateDialog"
    />

    <events-divisions-create-dialog
      :event="eventsStateSelected"
      :shown.sync="eventsDivisionsShowCreateDialog"
    />
  </el-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { eventsStub } from "@/stubs"
import BreadcrumbBar from "@/components/BreadcrumbBar"
import EventsParticipantsManager from "@/containers/events/participants/EventsParticipantsManager"
import ClubsMembersCreateDialog from "@/containers/clubs/members/ClubsMembersCreateDialog"

import EventsDivisionsList from "@/containers/events/divisions/EventsDivisionsList"
import EventsDivisionsCreateDialog from "@/containers/events/divisions/EventsDivisionsCreateDialog"

const MOCK = {"title":"NM Felt","startsAt":{"$$date":1557007200000},"endsAt":{"$$date":1557093600000},"category":"Norwegian Championship","approbated":"","organizerId":"nkcq7eblPs4mGy68","rangeId":"vVsa8ZEKEjiprExt","createdAt":{"$$date":1546463725649},"updatedAt":{"$$date":1546463725649},"id":"8aZR53hJC3K3aQPv"} // eslint-disable-line

export default {
  name: "EventsCreateScreen",

  components: {
    BreadcrumbBar,
    EventsParticipantsManager,
    ClubsMembersCreateDialog,
    EventsDivisionsList,
    EventsDivisionsCreateDialog
  },

  data: function() {
    return {
      activeTab: "step1",
      step2Disabled: false,
      step3Disabled: true,
      eventDetailsForm: { ...eventsStub, dates: [] },
      eventDetailsFormRules: {
        title: { required: true, message: "Title is a required field" },
        dates: { required: true, message: "Dates is a required field" },
        category: { required: true, message: "Category is a required field" },
        organizerId: { required: true, message: "Organizer is a required field" },
        rangeId: { required: true, message: "Range is a required field" }
      },
      clubsMembersShowCreateDialog: false,
      eventsDivisionsShowCreateDialog: false
    }
  },

  computed: {
    eventsStateSelected: () => MOCK,

    ...mapState("events", {
      eventsStateCreateIsLoading: "createIsLoading",
      eventsStateCategories: "categories"
    }),
    ...mapState("clubs", {
      clubsStateListIsLoading: "listIsLoading",
      clubsStateList: "list"
    }),
    ...mapState("ranges", {
      rangesStateListIsLoading: "listIsLoading",
      rangesStateList: "list"
    })
  },

  async created() {
    await this.clubsActionsList()
    await this.rangesActionsList()
  },

  methods: {
    ...mapActions("events", {
      eventsActionsCreate: "create"
    }),
    ...mapActions("clubs", {
      clubsActionsList: "list"
    }),
    ...mapActions("ranges", {
      rangesActionsList: "list"
    }),

    navToStep1() {
      this.activeTab = "step1"
    },

    navToStep2() {
      if(this.step2Disabled) {
        this.step2Disabled = false
      }
      this.activeTab = "step2"
    },

    navToStep3() {
      if(this.step3Disabled) {
        this.step3Disabled = false
      }
      this.activeTab = "step3"
    },

    async eventDetailsFormSubmit() {
      this.$refs.eventDetailsForm.validate(async (isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: "Please fill in all required fields before saving"
          })
        }

        const data = { ...this.eventDetailsForm }
        data.startsAt = data.dates[0].toISOString()
        data.endsAt = data.dates[1].toISOString()
        delete data.dates

        try {
          await this.eventsActionsCreate(data)
          this.$notify({
            type: "success",
            title: "Great success",
            message: `${data.title} was successfully added to the database`
          })
          this.navToStep2()
          this.eventsDetailsFormClear()
        } catch(e) {
          console.log(e.message)
          this.$notify({
            type: "error",
            title: "Oops!",
            message: e.message
          })
        }
      })
    },

    eventsDetailsFormClear() {
      this.eventDetailsForm = { ...eventsStub }
    },

    discard() {
      this.eventsDetailsFormClear()
      this.$router.push("/events")
    },

    clubsMembersOpenCreateDialog() {
      this.clubsMembersShowCreateDialog = true
    },
    eventsDivisionsOpenCreateDialog() {
      this.eventsDivisionsShowCreateDialog = true
    }
  }
}
</script>
