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

<style lang="stylus">
// .el-dialog.events-divisions-contestants-results-preview-dialog
//   display flex
//
//   .el-dialog__body
//     display flex
//     flex-grow 1
//     padding 0
//     overflow-y auto
</style>

<template>
  <el-dialog
    custom-class="events-divisions-contestants-results-preview-dialog"
    :fullscreen="false"
    :visible.sync="visible"
    :append-to-body="true"
    @open="open"
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
      <el-table
        :data="results"
        row-key="id"
        class="no-hover small"
        empty-text
      >
        <el-table-column
          type="index"
          width="40"
        />

        <el-table-column
          prop="total"
          label="Total"
          width="60px"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.total }}
            </h6>
          </template>
        </el-table-column>

        <el-table-column
          prop="contestantId"
          width="60px"
        >
          <template slot-scope="scope">
            <avatar
              size="small"
              :first-name="scope.row.contestant.member.firstName"
              :last-name="scope.row.contestant.member.lastName"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="contestantId"
          label="Participant"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.contestant.member.firstName }} {{ scope.row.contestant.member.lastName }}
            </h6>
            <small class="small">
              ({{ scope.row.contestant.weapon.class.name }}, {{ scope.row.contestant.weapon.calibre }})
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="hits"
          label="Hits"
        >
          <template slot-scope="scope">
            {{ scope.row.hits.join(" ") }}
          </template>
        </el-table-column>

        <template slot="empty">
          No results yet
        </template>
      </el-table>
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
import Avatar from "@/components/Avatar"

export default {
  name: "EventsDivisionsContestantsResultsPreviewDialog",

  components: {
    Avatar
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

  computed: {
    // showResults() {
    //   return Object.keys(this.results).length > 0
    // }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    open() {
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
