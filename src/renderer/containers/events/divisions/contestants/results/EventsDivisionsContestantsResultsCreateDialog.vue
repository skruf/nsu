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
      v-loading="eventsDivisionsStateListIsLoading"
      class="flex min-h-full w-full p-6"
    >
      <div
        v-for="division in eventsDivisionsStateList"
        :key="division.id"
        class=""
      >
        <h2 class="h2 pb-4">
          {{ division.name }}
        </h2>

        <div
          v-for="divisionClass in division.classes"
          :key="divisionClass.id"
          class="division_class"
        >
          <h3 class="h3 py-4">
            {{ divisionClass.name }}
          </h3>
        </div>
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
      console.log(this.eventsDivisionsStateList)
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
