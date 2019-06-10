<i18n>
{
  "en": {
    "title": "Assign stands",
    "subtitle": "For %{event}",
    "eventsContestantsFormsTitle": "Assign participants to time slots",
    "eventsContestantsFormsFormItem1Placeholder": "Select a participant",
    "eventsContestantsFormsFormItem2Placeholder": "Select a weapon",
    "eventsContestantsFormsFormItem3Placeholder": "Enter a calibre",
    "availableParticipants": "Available participants",
    "participants": "Participants",
    "endsAt": "Ends at",
    "saveSuccess": "%{division} was successfully added to the database"
  },
  "no": {
    "title": "Angi standplasser",
    "subtitle": "For %{event}",
    "eventsContestantsFormsTitle": "Tildel deltakere til listen",
    "eventsContestantsFormsFormItem1Placeholder": "Velg en deltaker",
    "eventsContestantsFormsFormItem2Placeholder": "Velg ett våpen",
    "eventsContestantsFormsFormItem3Placeholder": "Skriv inn kaliber",
    "availableParticipants": "Tilgjengelige deltakere",
    "participants": "Deltakere",
    "endsAt": "Slutter",
    "saveSuccess": "%{division} ble lagt til i databasen"
  }
}
</i18n>

<template>
  <el-dialog
    :fullscreen="true"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <template slot="title">
      <h3 class="h3">
        {{ $t("title") }}
      </h3>
      <!-- <small class="small">
        {{ $t("subtitle", { event: eventsStateSelected.title }) }}
      </small> -->
    </template>

    <div
      v-loading="isLoading"
      class="dialog_content flex flex-1 p-0"
    >
      <div class="w-full px-5 overflow-y-auto">
        <div class="flex items-center mt-4 mb-8">
          <h4 class="h4">
            {{ $t("eventsContestantsFormsTitle") }}
          </h4>
        </div>

        <div class="flex items-center mb-4">
          <div class="w-48">
            Bane
          </div>
          <div class="pl-2 w-full">
            Deltaker
          </div>
          <div class="pl-2 w-full">
            Våpen
          </div>
        </div>

        <div
          v-for="(contestantForm, index) in eventsContestantsForms"
          :key="contestantForm.id"
          class="flex items-center"
        >
          <events-contestants-form
            ref="eventsContestantsForms"
            class="w-full"
            :index="index + 1"
            :form.sync="eventsContestantsForms[index]"
            :participants="eventsParticipantsStateList"
          />
        </div>
      </div>

      <div class="px-5 dialog_sidebar">
        <h4 class="h4 my-4">
          {{ division.name }}
        </h4>

        <div class="flex my-4">
          <div class="font-semibold">
            <div>Dato</div>
            <div>Klokkeslett</div>
            <div>Distanse</div>
          </div>
          <div class="ml-4">
            <div>{{ division.day }}</div>
            <div>{{ division.time }}</div>
            <div>{{ division.distance }}</div>
          </div>
        </div>

        <div class="flex flex-col">
          <h6 class="h6 inline">
            {{ $t("availableParticipants") }} ({{ eventsParticipantsStateList.length }})
          </h6>
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
                {{ participant.weapons.length }} våpen
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
import { mapActions, mapState } from "vuex"
import { eventsContestantsStub } from "~/stubs"
import { parseTimeInput } from "~/utils/time"
import Avatar from "~/components/Avatar"
import EventsContestantsForm from "~/components/EventsContestantsForm"

export default {
  name: "EventsDivisionsAssignmentDialog",

  components: {
    Avatar,
    EventsContestantsForm
  },

  props: {
    shown: { type: Boolean, default: false },
    division: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown,
      eventsDivisionsForm: {},
      eventsContestantsForms: []
    }
  },

  computed: {
    ...mapState("events/contestants", {
      eventsContestantsStateCreateManyIsLoading: "createManyIsLoading",
      eventsContestantsStateEditManyIsLoading: "editManyIsLoading",
      eventsContestantsStateList: "list"
    }),
    ...mapState("events/participants", {
      eventsParticipantsStateListIsLoading: "listIsLoading",
      eventsParticipantsStateList: "list"
    }),
    showEventsContestantsForms() {
      return this.eventsContestantsForms.length > 0
    },
    starts() {
      return parseTimeInput(this.eventsDivisionsForm.startsAt)
    },
    isLoading() {
      return (
        this.eventsContestantsStateCreateManyIsLoading ||
        this.eventsContestantsStateEditManyIsLoading ||
        this.eventsParticipantsStateListIsLoading
      )
    }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    ...mapActions("events/contestants", {
      eventsContestantsActionsList: "list",
      eventsContestantsActionsCreateMany: "createMany",
      eventsContestantsActionsEditMany: "editMany"
    }),
    ...mapActions("events/participants", {
      eventsParticipantsActionsList: "list"
    }),

    async open() {
      await this.eventsContestantsActionsList({
        divisionId: this.division.id
      })
      await this.eventsParticipantsActionsList({
        eventId: this.division.eventId
      })

      this.eventsContestantsForms = []
      Array.apply(null, { length: this.division.stands }).forEach((_, index) => {
        let form = {}
        const stand = index + 1

        const existing = this.eventsContestantsStateList.find(
          (contestant) => contestant.stand === stand
        )

        if(existing) {
          form = { ...existing, existing: true }
        } else {
          form = { ...eventsContestantsStub }
          form.stand = stand
          form.divisionId = this.division.id
          form.eventId = this.division.eventId
        }

        this.eventsContestantsForms.push(form)
      })
    },

    async save() {
      try {
        const contestants = this.eventsContestantsForms
          .filter((contestant) => (!!contestant.participantId && !!contestant.weaponId))

        const toCreate = contestants.filter((contestant) => !contestant.existing)
        if(toCreate.length) {
          await this.eventsContestantsActionsCreateMany(toCreate)
        }

        const toEdit = contestants.filter((contestant) => !!contestant.existing)
        if(toEdit.length) {
          await this.eventsContestantsActionsEditMany(toEdit)
        }

        console.log(toCreate)
        console.log(toEdit)

        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("saveSuccess", {
            division: this.division.name
          })
        })
        this.close()
        // this.clear()
      } catch(e) {
        console.error(e)
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    // clear() {
    //   this.$refs.eventsDivisionsForm.clear()
    // },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
