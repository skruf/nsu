<i18n>
{
  "en": {
    "placeholderText": "No results were added yet.",
    "placeholderButton": "Input results"
  },
  "no": {
    "placeholderText": "Ingen resultater har blitt lagt til enda.",
    "placeholderButton": "Fyll inn resultater"
  }
}
</i18n>

<template>
  <div class="events-results flex h-full w-full">
    <div class="flex-1 overflow-y-auto">
      <div
        v-if="hasEventsDivisionsContestantsResultsList"
        v-loading="eventsDivisionsContestantsResultsStateListIsLoading"
      >
        <events-divisions-contestants-results-list-table
          :results="eventsDivisionsContestantsResultsStateList"
        />
      </div>

      <div
        v-else
        class="data-placeholder"
      >
        {{ $t("placeholderText") }}
        <el-button
          type="text"
          @click="eventsDivisionsContestantsResultsOpenCreateDialog"
        >
          {{ $t("placeholderButton") }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import EventsDivisionsContestantsResultsListTable from "@/components/EventsDivisionsContestantsResultsListTable"

export default {
  name: "EventsDivisionsContestantsResultsList",

  components: {
    EventsDivisionsContestantsResultsListTable
  },

  computed: {
    ...mapState("events/divisions/contestants/results", {
      eventsDivisionsContestantsResultsStateListIsLoading: "listIsLoading",
      eventsDivisionsContestantsResultsStateList: "list"
    }),
    ...mapState("events/divisions", {
      eventsDivisionsStateSelected: "selected"
    }),
    hasEventsDivisionsContestantsResultsList() {
      return this.eventsDivisionsContestantsResultsStateList.length > 0
    }
  },

  methods: {
    eventsDivisionsOpenCreateDialog() {
      this.$emit("eventsDivisionsOpenCreateDialog")
    },
    eventsDivisionsContestantsResultsOpenCreateDialog() {
      this.$emit("eventsDivisionsContestantsResultsOpenCreateDialog")
    },
    dispatchActions({ handler, payload }) {
      this[handler](payload)
    },
    eventsDivisionsContestantsResultsOpenPrintDialog() {
    }
  }
}
</script>
