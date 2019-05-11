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
        v-loading="eventsParticipantsStateSelectedIsLoading"
        class="dialog_content flex flex-1"
      >
        <div class="info-grid">
          <div
            v-if="eventsParticipantsStateSelected.member.country"
            class="info-grid_item"
          >
            <h6 class="h6 info-grid_item_key">
              {{ $t("country") }}:
            </h6>
            <p class="info-grid_item_value">
              {{ eventsParticipantsStateSelected.member.country }}
            </p>
          </div>

          <div class="info-grid_item">
            <h6 class="h6 info-grid_item_key">
              {{ $t("club") }}:
            </h6>
            <p class="info-grid_item_value">
              {{ eventsParticipantsStateSelected.member.club.name }}
            </p>
          </div>

          <div class="info-grid_item">
            <h6 class="h6 info-grid_item_key">
              {{ $t("weapons") }}:
            </h6>
            <ul class="info-grid_item_value">
              <li
                v-for="(weapon, index) in eventsParticipantsStateSelected.weapons"
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

<script>
import { mapActions, mapState } from "vuex"

export default {
  name: "EventsParticipantsViewDialog",

  props: {
    shown: { type: Boolean, default: false },
    eventsParticipantsId: { type: String, required: true }
  },

  data: function() {
    return {
      visible: this.shown
    }
  },

  computed: {
    ...mapState("events/participants", {
      eventsParticipantsStateSelectedIsLoading: "selectedIsLoading",
      eventsParticipantsStateSelected: "selected"
    }),

    hasEventsParticipant() {
      return Object.keys(this.eventsParticipantsStateSelected).length > 0
    },

    eventsParticipantsFullName() {
      if(this.hasEventsParticipant) {
        return `${this.eventsParticipantsStateSelected.member.firstName} ${this.eventsParticipantsStateSelected.member.lastName}`
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
      await this.eventsParticipantsActionsSelect({
        id: this.eventsParticipantsId
      })
    },

    eventsParticipantsViewDialogClose() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
