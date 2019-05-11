<i18n>
{
  "en": {
    "title": "Select a division",
    "divisionsListPlaceholderText": "No divisions yet.",
    "divisionsListPlaceholderButton": "Create one?"
  },
  "no": {
    "title": "Velg en divisjon",
    "divisionsListPlaceholderText": "Ingen divisjoner enda.",
    "divisionsListPlaceholderButton": "Opprett ny?"
  }
}
</i18n>

<template>
  <div
    v-loading="eventsDivisionsStateListIsLoading"
    class="dialog_sidebar p-5"
  >
    <h5 class="h5 pb-2">
      {{ $t("title") }}
    </h5>

    <ul>
      <li
        v-for="division in eventsDivisionsStateList"
        :key="division.id"
        class="mt-2 card card-clickable"
        :class="{ 'is-active': isActive(division) }"
        @click="selectDivision(division)"
      >
        <div class="w-full">
          <h6 class="h6 inline mr-2">
            {{ division.name }}
          </h6>
          {{ division.distance }}
        </div>
        <i class="el-icon-arrow-right" />
      </li>
    </ul>

    <div
      v-if="!eventsDivisionsStateList.length"
      class="data-placeholder"
    >
      {{ $t("divisionsListPlaceholderText") }}
      <el-button
        type="text"
        @click="eventsDivisionsOpenCreateDialog"
      >
        {{ $t("divisionsListPlaceholderButton") }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex"

export default {
  name: "EventsDivisionsListMenu",

  computed: {
    ...mapState("events", {
      eventsStateSelected: "selected"
    }),
    ...mapState("events/divisions", {
      eventsDivisionsStateListIsLoading: "listIsLoading",
      eventsDivisionsStateCount: "count",
      eventsDivisionsStateList: "list",
      eventsDivisionsStateSelected: "selected"
    })
  },

  async created() {
    this.eventsDivisionsMutationsSetListFilter({
      eventId: this.eventsStateSelected.id
    })
    await this.eventsDivisionsActionsList()
  },

  methods: {
    ...mapMutations("events/divisions", {
      "eventsDivisionsMutationsSetListFilter": "SET_LIST_FILTER"
    }),
    ...mapActions("events/divisions", {
      eventsDivisionsActionsList: "list",
      eventsDivisionsActionsSelect: "select"
    }),
    ...mapMutations("events/divisions/contestants", {
      "eventsDivisionsContestantsMutationsSetListFilter": "SET_LIST_FILTER"
    }),
    ...mapActions("events/divisions/contestants", {
      eventsDivisionsContestantsActionsList: "list"
    }),
    ...mapMutations("events/divisions/contestants/results", {
      "eventsDivisionsContestantsResultsMutationsSetListFilter": "SET_LIST_FILTER"
    }),
    ...mapActions("events/divisions/contestants/results", {
      eventsDivisionsContestantsResultsActionsList: "list"
    }),

    async selectDivision(division) {
      try {
        await this.eventsDivisionsActionsSelect({ id: division.id })
        this.eventsDivisionsContestantsMutationsSetListFilter({ divisionId: division.id })
        await this.eventsDivisionsContestantsActionsList()
        this.eventsDivisionsContestantsResultsMutationsSetListFilter({ divisionId: division.id })
        await this.eventsDivisionsContestantsResultsActionsList()
        this.$emit("select-division", division)
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },
    isActive(division) {
      return this.eventsDivisionsStateSelected.id === division.id
    },
    eventsDivisionsOpenCreateDialog() {
      this.$emit("eventsDivisionsOpenCreateDialog")
    }
  }
}
</script>
