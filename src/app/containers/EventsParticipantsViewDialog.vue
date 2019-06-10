<i18n>
{
  "en": {
    "title": "Participant %{participant}",
    "country": "Country",
    "club": "Club",
    "weapons": "Weapons"
  },
  "no": {
    "title": "Deltaker %{participant}",
    "country": "Land",
    "club": "Klubb",
    "weapons": "Våpen"
  }
}
</i18n>

<template>
  <el-dialog
    custom-class="events-participants-view-dialog"
    :title="$t('title', { participant: eventsParticipantsFullName })"
    :visible.sync="visible"
    @open="eventsParticipantsViewDialogOpen"
    @close="eventsParticipantsViewDialogClose"
  >
    <el-alert
      title="Work in progress"
      description="Fremstillingen av denne visningen er ikke ferdig implementert. Feltene under er bare rå data printet ut."
      type="warning"
      show-icon
    />

    <template v-if="hasEventsParticipant">
      <div
        v-loading="isLoading"
        class="dialog_content flex flex-1"
      >
        <div class="info-grid">
          <div
            v-if="participant.member.country"
            class="info-grid_item"
          >
            <h6 class="h6 info-grid_item_key">
              {{ $t("country") }}:
            </h6>
            <p class="info-grid_item_value">
              {{ participant.member.country }}
            </p>
          </div>

          <div class="info-grid_item">
            <h6 class="h6 info-grid_item_key">
              {{ $t("club") }}:
            </h6>
            <p class="info-grid_item_value">
              {{ participant.member.club.name }}
            </p>
          </div>

          <div class="info-grid_item">
            <h6 class="h6 info-grid_item_key">
              {{ $t("weapons") }}:
            </h6>
            <ul class="info-grid_item_value">
              <li
                v-for="(weapon, index) in participant.weapons"
                :key="index"
              >
                {{ weapon.class.name }} ({{ weapon.calibre }})
              </li>
            </ul>
          </div>
        </div>
      </div>

      <template slot="footer">
        <el-button
          class="block"
          type="text"
          @click="eventsParticipantsViewDialogClose"
        >
          {{ $t("close") }}
        </el-button>
      </template>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import DB from "~/db"
import { mapActions, mapState } from "vuex"

export default {
  name: "EventsParticipantsViewDialog",

  props: {
    shown: { type: Boolean, default: false },
    eventsParticipantsId: { type: String, required: true }
  },

  data: function() {
    return {
      visible: this.shown,
      participant: {},
      isLoading: false
    }
  },

  computed: {
    ...mapState("events/participants", {
      eventsParticipantsStateSelectedIsLoading: "selectedIsLoading",
      eventsParticipantsStateSelected: "selected"
    }),

    hasEventsParticipant() {
      return Object.keys(this.participant).length > 0
    },

    eventsParticipantsFullName() {
      if(this.hasEventsParticipant) {
        return `${this.participant.member.firstName} ${this.participant.member.lastName}`
      }
      return ""
    }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    ...mapActions("events/participants", {
      eventsParticipantsActionsSelect: "select"
    }),

    async eventsParticipantsViewDialogOpen() {
      const db = await DB.get()
      const query = db.events_participants.findOne({ id: this.eventsParticipantsId })

      this.sub = query.$.subscribe(async (participant) => {
        participant.member = await participant.memberId_
        participant.member.club = await participant.member.clubId_

        participant.weapons = await db.events_participants_weapons.find({
          participantId: participant.id
        }).exec()

        participant.weapons = await Promise.all(
          participant.weapons.map(async (weapon) => {
            weapon.class = await weapon.classId_
            return weapon
          })
        )

        this.participant = participant
      })
    },

    eventsParticipantsViewDialogClose() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
