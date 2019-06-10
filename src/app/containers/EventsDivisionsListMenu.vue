<i18n>
{
  "en": {
    "title": "Select a division",
    "divisionsListPlaceholderText": "No divisions yet.",
    "divisionsListPlaceholderButton": "Create division"
  },
  "no": {
    "title": "Velg en standplassliste",
    "divisionsListPlaceholderText": "Ingen standplasslister enda.",
    "divisionsListPlaceholderButton": "Opprett standplassliste"
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
    </div>

    <el-button
      class="mt-4 p-2"
      type="text"
      @click="eventsDivisionsOpenCreateDialog"
    >
      <i class="el-icon-plus mr-2" /> {{ $t("divisionsListPlaceholderButton") }}
    </el-button>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"

export default {
  name: "EventsDivisionsListMenu",

  data: () => ({
    selected: null
  }),

  computed: {
    ...mapState("events", {
      eventsStateSelected: "selected"
    }),
    ...mapState("events/divisions", {
      eventsDivisionsStateListIsLoading: "listIsLoading",
      eventsDivisionsStateList: "list"
    })
  },

  async created() {
    await this.eventsDivisionsActionsList({
      eventId: this.eventsStateSelected.id
    })
  },

  methods: {
    ...mapActions("events/divisions", {
      eventsDivisionsActionsList: "list"
    }),
    selectDivision(division) {
      this.selected = division
      this.$emit("selectDivision", division)
    },
    isActive(division) {
      return this.selected && this.selected.id === division.id
    },
    eventsDivisionsOpenCreateDialog() {
      this.$emit("eventsDivisionsOpenCreateDialog")
    }
  }
}
</script>
