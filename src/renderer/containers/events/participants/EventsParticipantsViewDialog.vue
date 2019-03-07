<style lang="stylus">
</style>

<template>
  <el-dialog
    custom-class="events-participants-view-dialog"
    :title="`Participant ${eventsParticipantsFullName}`"
    :visible.sync="visible"
    @open="eventsParticipantsViewDialogOpen"
    @close="eventsParticipantsViewDialogClose"
  >
    <template v-if="hasEventsParticipant">
      <div
        v-loading="eventsParticipantsStateSelectedIsLoading"
        class="dialog_content flex flex-1"
      >
        <div class="info-grid">
          <div class="info-grid_item">
            <h6 class="h6 info-grid_item_key">
              Country:
            </h6>
            <p class="info-grid_item_value">
              {{ eventsParticipantsStateSelected.member.country }}
            </p>
          </div>

          <div class="info-grid_item">
            <h6 class="h6 info-grid_item_key">
              Club:
            </h6>
            <p class="info-grid_item_value">
              {{ eventsParticipantsStateSelected.member.club.name }}
            </p>
          </div>

          <div class="info-grid_item">
            <h6 class="h6 info-grid_item_key">
              Classes:
            </h6>
            <ul class="info-grid_item_value">
              <li
                v-for="(weaponClass) in eventsParticipantsStateSelected.classes"
                :key="weaponClass.id"
              >
                {{ weaponClass.name }}
              </li>
            </ul>
          </div>

          <div class="info-grid_item">
            <h6 class="h6 info-grid_item_key">
              Calibres:
            </h6>
            <ul class="info-grid_item_value">
              <li
                v-for="(calibre, index) in eventsParticipantsStateSelected.calibres"
                :key="index"
              >
                {{ calibre }}
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
          Close
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
