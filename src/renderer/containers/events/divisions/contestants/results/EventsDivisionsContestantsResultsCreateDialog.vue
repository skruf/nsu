<style lang="stylus">
</style>

<template>
  <el-dialog
    :title="`Input results for ${event.title}`"
    custom-class="events-divisions-contestants-results-create-dialog"
    :fullscreen="true"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <div
      v-loading="eventsDivisionsContestantsStateListIsLoading"
      class="flex min-h-full w-full"
    >
      <div
        v-for="contestant in eventsDivisionsContestantsStateList"
        :key="contestant.id"
      >
        {{ contestant.member.firstName }} {{ contestant.member.lastName }}
      </div>
    </div>

    <template slot="footer">
      <el-button
        class="block"
        type="text"
        @click="close"
      >
        Close
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex"

export default {
  name: "EventsDivisionsContestantsResultsCreateDialog",

  props: {
    shown: { type: Boolean, default: false },
    event: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown
    }
  },

  computed: {
    ...mapActions("events/divisions/contestants/results", {
      eventsDivisionsContestantsResultsActionsCreateManyIsLoading: "createManyIsLoading"
    }),

    ...mapState("events/divisions/contestants", {
      eventsDivisionsContestantsStateList: "list",
      eventsDivisionsContestantsStateListIsLoading: "listIsLoading"
    }),

    ...mapState("events/divisions", {
      eventsDivisionsStateList: "list",
      eventsDivisionsStateListIsLoading: "listIsLoading"
    })
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    ...mapActions("events/divisions/contestants/results", {
      eventsDivisionsContestantsResultsActionsCreateMany: "createMany"
    }),

    ...mapMutations("events/divisions/contestants", {
      "eventsDivisionsContestantsMutationsSetListFilter": "SET_LIST_FILTER"
    }),

    ...mapActions("events/divisions/contestants", {
      eventsDivisionsContestantsActionsList: "list"
    }),

    ...mapActions("events/divisions", {
      eventsDivisionsActionsList: "list"
    }),

    async open() {
      // this.eventsDivisionsContestantsMutationsSetListFilter({
      //   eventId: this.event.id
      // })
      // await this.eventsDivisionsContestantsActionsList()
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
