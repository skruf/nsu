<i18n>
{
  "en": {
    "title": "Edit divisjon",
    "subtitle": "For %{event}",
    "eventsDivisionsFormTitle": "Division settings",
    "eventsDivisionsFormItem1Label": "Name",
    "eventsDivisionsFormItem1Placeholder": "Enter a name",
    "eventsDivisionsFormItem1Error": "Name is a required field",
    "eventsDivisionsFormItem2Label": "Choose a Day",
    "eventsDivisionsFormItem2Placeholder": "Pick a day",
    "eventsDivisionsFormItem2Error": "Day is a required field",
    "eventsDivisionsFormItem3Label": "Starts At",
    "eventsDivisionsFormItem3Placeholder": "Pick a start time",
    "eventsDivisionsFormItem3Error": "Starts At is a required field",
    "eventsDivisionsFormItem4Label": "Shooting Interval",
    "eventsDivisionsFormItem4Placeholder": "Select an interval",
    "eventsDivisionsFormItem4Error": "Shooting Interval is a required field",
    "eventsDivisionsFormButton": "Generate list",
    "eventsDivisionsContestantsFormsTitle": "Assign participants to time slots",
    "eventsDivisionsContestantsFormsFormItem1Placeholder": "Select a participant",
    "eventsDivisionsContestantsFormsFormItem2Placeholder": "Select a weapon",
    "eventsDivisionsContestantsFormsFormItem3Placeholder": "Enter a calibre",
    "availableParticipants": "Available participants",
    "participants": "Participants",
    "endsAt": "Ends at",
    "saveSuccess": "%{division} was successfully updated to the database"
  },
  "no": {
    "title": "Rediger divisjon",
    "subtitle": "For %{event}",
    "eventsDivisionsFormTitle": "Divisjon innstillinger",
    "eventsDivisionsFormItem1Label": "Navn",
    "eventsDivisionsFormItem1Placeholder": "Skriv ett navn",
    "eventsDivisionsFormItem1Error": "Navn er et påkrevd felt",
    "eventsDivisionsFormItem2Label": "Velg en dag",
    "eventsDivisionsFormItem2Placeholder": "Velg en dag",
    "eventsDivisionsFormItem2Error": "Dag er et påkrevd felt",
    "eventsDivisionsFormItem3Label": "Starter",
    "eventsDivisionsFormItem3Placeholder": "Velg en start tid",
    "eventsDivisionsFormItem3Error": "Starter er et påkrevd felt",
    "eventsDivisionsFormItem4Label": "Skytteinterval",
    "eventsDivisionsFormItem4Placeholder": "Velg ett interval",
    "eventsDivisionsFormItem4Error": "Skytteinterval er et påkrevd felt",
    "eventsDivisionsFormButton": "Generer listen",
    "eventsDivisionsContestantsFormsTitle": "Tildel deltakere til listen",
    "eventsDivisionsContestantsFormsFormItem1Placeholder": "Velg en deltaker",
    "eventsDivisionsContestantsFormsFormItem2Placeholder": "Velg ett våpen",
    "eventsDivisionsContestantsFormsFormItem3Placeholder": "Skriv inn kaliber",
    "availableParticipants": "Tilgjengelige deltakere",
    "participants": "Deltakere",
    "endsAt": "Slutter",
    "saveSuccess": "%{division} ble oppdatert i databasen"
  }
}
</i18n>

<template>
  <el-dialog
    custom-class="events-divisions-edit-dialog"
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
        {{ $t("subtitle", { event: eventsStateSelected.title }) }}
      </small>
    </template>

    <div
      v-loading="stateIsLoading"
      class="dialog_content flex flex-1 p-0"
    >
      <div class="px-5 dialog_sidebar">
        <h4 class="h4 my-4">
          {{ $t("eventsDivisionsFormTitle") }}
        </h4>

        <events-divisions-form
          ref="eventsDivisionsForm"
          :form.sync="eventsDivisionsForm"
        />
      </div>

      <div class="w-full px-5 overflow-y-auto">
        <div class="flex items-center mt-4 mb-8">
          <h4 class="h4">
            {{ $t("eventsDivisionsContestantsFormsTitle") }}
          </h4>

          <el-button
            type="text"
            size="mini"
            :disabled="!eventsDivisionsContestantsIsConfigured"
            @click="eventsDivisionsContestantsAddForm"
          >
            <i class="el-icon-plus" />
          </el-button>
        </div>

        <div v-if="showEventsDivisionsContestantsForms">
          <div
            v-for="(contestantForm, index) in eventsDivisionsContestantsForms"
            :key="contestantForm.id"
            class="flex items-center"
          >
            <events-divisions-contestants-form
              ref="eventsDivisionsContestantsForms"
              class="w-full"
              :form.sync="eventsDivisionsContestantsForms[index]"
              :participants="eventsParticipantsStateList"
            />

            <el-button
              type="text"
              size="mini"
              class="mb-5"
              @click="eventsDivisionsContestantsRemoveForm(contestantForm, index)"
            >
              <i class="el-icon-minus" />
            </el-button>
          </div>
        </div>

        <div
          v-else
          class="data-placeholder"
        >
          Set start time and interval to assign shooters
        </div>
      </div>

      <div class="px-5 dialog_sidebar">
        <h4 class="h4 my-4">
          {{ $t("availableParticipants") }}
        </h4>

        <div class="flex flex-col">
          <div>
            <h6 class="h6 inline">
              {{ $t("participants") }}:
            </h6> {{ eventsParticipantsStateList.length }}
          </div>
          <div>
            <h6 class="h6 inline">
              {{ $t("endsAt") }}:
            </h6> {{ eventsDivisionsEndsAt || 'TBD' }}
          </div>
        </div>

        <ul class="mt-4 mb-2">
          <li
            v-for="participant in eventsParticipantsStateList"
            :key="participant.id"
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

            <el-tooltip placement="top">
              <ul slot="content">
                <li
                  v-for="(weapon, index) in participant.weapons"
                  :key="index"
                >
                  {{ weapon.class.name }} ({{ weapon.calibre }})
                </li>
              </ul>
              <el-tag size="mini">
                {{ participant.weapons.length }} weapons
              </el-tag>
            </el-tooltip>
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
        {{ $t("cancel") }}
      </el-button>
      <el-button
        class="block"
        type="primary"
        @click="save"
      >
        {{ $t("save") }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex"
import { eventsDivisionsContestantsStub } from "~/stubs"
import { parseTimeInput, formatTime, toMinutes } from "~/utils/time"
import Avatar from "~/components/Avatar"
import EventsDivisionsContestantsForm from "~/components/EventsDivisionsContestantsForm"
import EventsDivisionsForm from "~/components/EventsDivisionsForm"

export default {
  name: "EventsDivisionsEditDialog",

  components: {
    Avatar,
    EventsDivisionsContestantsForm,
    EventsDivisionsForm
  },

  props: {
    shown: { type: Boolean, default: false }
  },

  data: function() {
    return {
      isLoading: true,
      visible: this.shown,
      eventsDivisionsForm: {},
      eventsDivisionsContestantsForms: [],
      eventsDivisionsContestantsToBeRemoved: []
    }
  },

  computed: {
    ...mapState("events", {
      eventsStateSelected: "selected"
    }),
    ...mapState("events/divisions", {
      eventsDivisionsStateEditIsLoading: "editIsLoading",
      eventsDivisionsStateSelected: "selected"
    }),
    ...mapState("events/divisions/contestants", {
      eventsDivisionsContestantsStateCreateManyIsLoading: "createManyIsLoading",
      eventsDivisionsContestantsStateEditManyIsLoading: "editManyIsLoading",
      eventsDivisionsContestantsStateCount: "count",
      eventsDivisionsContestantsStateList: "list",
      eventsDivisionsContestantsStateListIsLoading: "listIsLoading",
      eventsDivisionsContestantsStateRemoveManyIsLoading: "removeManyIsLoading"
    }),
    ...mapState("events/participants", {
      eventsParticipantsStateListIsLoading: "listIsLoading",
      eventsParticipantsStateCount: "count",
      eventsParticipantsStateList: "list"
    }),

    showEventsDivisionsContestantsForms() {
      return this.eventsDivisionsContestantsForms.length > 0 && !this.isLoading
    },

    eventsDivisionsContestantsIsConfigured() {
      return this.eventsDivisionsForm.startsAt && this.eventsDivisionsForm.interval
    },

    starts() {
      return parseTimeInput(this.eventsDivisionsForm.startsAt)
    },

    interval() {
      return parseTimeInput(this.eventsDivisionsForm.interval)
    },

    eventsDivisionsEndsAt() {
      if(!this.eventsDivisionsContestantsIsConfigured) return

      let amount = this.eventsDivisionsContestantsForms.length

      if(!amount) {
        amount = this.eventsParticipantsStateList.length
      }

      const starts = toMinutes(this.starts.hours, this.starts.minutes)
      const interval = toMinutes(this.interval.hours, this.interval.minutes)

      return formatTime(starts + (interval * amount))
    },

    stateIsLoading() {
      return (
        this.eventsDivisionsStateEditIsLoading ||
        this.eventsDivisionsContestantsStateEditManyIsLoading ||
        this.eventsDivisionsContestantsStateCreateManyIsLoading ||
        this.eventsDivisionsContestantsStateRemoveManyIsLoading
      )
    }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    },
    "eventsDivisionsForm.startsAt": function() {
      this.setOrUpdateContestantsList()
    },
    "eventsDivisionsForm.interval": function() {
      this.setOrUpdateContestantsList()
    }
  },

  methods: {
    ...mapActions("events/divisions", {
      eventsDivisionsActionsEditOne: "editOne"
    }),
    ...mapActions("events/divisions/contestants", {
      eventsDivisionsContestantsActionsList: "list",
      eventsDivisionsContestantsActionsEditMany: "editMany",
      eventsDivisionsContestantsActionsCreateMany: "createMany",
      eventsDivisionsContestantsActionsDeleteMany: "removeMany"
    }),
    ...mapMutations("events/divisions/contestants", {
      "eventsDivisionsContestantsMutationsSetListFilter": "SET_LIST_FILTER"
    }),
    ...mapMutations("events/participants", {
      eventsParticipantsMutationsSetListFilter: "SET_LIST_FILTER"
    }),
    ...mapActions("events/participants", {
      eventsParticipantsActionsList: "list"
    }),

    async open() {
      this.eventsDivisionsForm = { ...this.eventsDivisionsStateSelected }

      this.eventsParticipantsMutationsSetListFilter({ eventId: this.eventsStateSelected.id })
      await this.eventsParticipantsActionsList()

      this.eventsDivisionsContestantsMutationsSetListFilter({
        divisionId: this.eventsDivisionsStateSelected.id
      })
      await this.eventsDivisionsContestantsActionsList()

      this.setContestantList()

      for(let i = 0; this.eventsDivisionsContestantsStateList.length > i; i++) {
        this.eventsDivisionsContestantsForms[i] = {
          ...this.eventsDivisionsContestantsStateList[i]
        }
      }

      this.isLoading = false
    },

    getTime(index) {
      const starts = toMinutes(this.starts.hours, this.starts.minutes)
      const interval = toMinutes(this.interval.hours, this.interval.minutes)
      return formatTime(starts + (interval * index))
    },

    setOrUpdateContestantsList() {
      if(!this.eventsDivisionsContestantsIsConfigured) return
      this.eventsDivisionsContestantsForms.length
        ? this.updateContestantsList()
        : this.setContestantList()
    },

    updateContestantsList() {
      this.eventsDivisionsContestantsForms = this.eventsDivisionsContestantsForms.map(
        (form, index) => {
          form.time = this.getTime(index)
          return form
        }
      )
    },

    setContestantList() {
      this.eventsDivisionsContestantsForms = []
      this.eventsParticipantsStateList.forEach(
        () => { this.eventsDivisionsContestantsAddForm() }
      )
    },

    eventsDivisionsContestantsAddForm() {
      const stub = { ...eventsDivisionsContestantsStub }
      const index = this.eventsDivisionsContestantsForms.length
      stub.time = this.getTime(index)
      this.eventsDivisionsContestantsForms.push({ ...stub, id: index })
    },

    eventsDivisionsContestantsRemoveForm(contestant, index) {
      this.eventsDivisionsContestantsForms.splice(index, 1)
      if(this.contestantExists(contestant.id)) {
        this.eventsDivisionsContestantsToBeRemoved.push(contestant)
      }
    },

    contestantExists(id) {
      return this.eventsDivisionsContestantsStateList
        .map(({ id }) => id)
        .includes(id)
    },

    async save() {
      this.$refs.eventsDivisionsForm.validate(async () => {
        const division = { ...this.eventsDivisionsForm }
        division.endsAt = this.eventsDivisionsEndsAt
        division.day = typeof division.day === "string"
          ? division.day
          : division.day.toISOString()

        try {
          const createdDivision = await this.eventsDivisionsActionsEditOne(division)

          const contestants = this.eventsDivisionsContestantsForms
            .filter((contestant) => !!contestant.memberId && !!contestant.weapon.id)
            .map((contestant) => ({ ...contestant, divisionId: createdDivision.id }))

          const contestantsToBeCreated = contestants.filter(({ id }) => !this.contestantExists(id))
          const contestantsToBeUpdated = contestants.filter(({ id }) => this.contestantExists(id))

          await this.eventsDivisionsContestantsActionsCreateMany(contestantsToBeCreated)
          await this.eventsDivisionsContestantsActionsEditMany(contestantsToBeUpdated)
          await this.eventsDivisionsContestantsActionsDeleteMany(this.eventsDivisionsContestantsToBeRemoved)

          await this.eventsDivisionsContestantsActionsList()

          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("saveSuccess", {
              division: division.name
            })
          })
          this.close()
        } catch(e) {
          console.error(e)
          this.$notify({
            type: "error",
            title: "Oops!",
            message: e.message
          })
        }
      })
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
