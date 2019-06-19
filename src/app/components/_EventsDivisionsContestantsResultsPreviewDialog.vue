<i18n>
{
  "en": {
    "title": "Preview results",
    "subtitle": "For %{event}"
  },
  "no": {
    "title": "Forhåndsvis resultater",
    "subtitle": "For %{event}"
  }
}
</i18n>

<template>
  <el-dialog
    custom-class="events-divisions-contestants-results-preview-dialog"
    :fullscreen="false"
    :visible.sync="visible"
    :append-to-body="true"
    @close="close"
  >
    <template slot="title">
      <h3 class="h3">
        {{ $t("title") }}
      </h3>
      <small class="small">
        For bla
        <!-- {{ $t("subtitle", { event: event.title }) }} -->
      </small>
    </template>

    <div class="flex min-h-full w-full px-6 py-3">
      <events-divisions-contestants-results-list-table
        :results="results"
      />
    </div>

    <template slot="footer">
      <el-button
        class="block"
        type="text"
        @click="close"
      >
        {{ $t("close") }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import EventsDivisionsContestantsResultsListTable from "~/components/EventsDivisionsContestantsResultsListTable"

export default {
  name: "EventsDivisionsContestantsResultsPreviewDialog",

  components: {
    EventsDivisionsContestantsResultsListTable
  },

  props: {
    shown: { type: Boolean, default: false },
    results: { type: Array, required: true }
  },

  data: function() {
    return {
      visible: this.shown
    }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
