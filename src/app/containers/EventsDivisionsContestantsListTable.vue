<i18n>
{
  "en": {
    "column1Label": "Shooting Time/Day",
    "column2Label": "Name/Email",
    "column3Label": "Weapon",
    "tablePlaceholderText": "No participants yet.",
    "tablePlaceholderButton": "Add new?"
  },
  "no": {
    "column1Label": "Skytte tid/dag",
    "column2Label": "Navn/epost",
    "column3Label": "Våpen",
    "tablePlaceholderText": "Ingen deltakere enda",
    "tablePlaceholderButton": "Legg til ny?"
  }
}
</i18n>

<style lang="stylus">
.events-divisions-contestants-list-table
  .el-table::before
    display none
</style>

<template>
  <div
    v-loading="eventsDivisionsContestantsStateListIsLoading"
    class="events-divisions-contestants-list-table"
  >
    <el-table
      ref="eventsDivisionsContestantsListTable"
      :data="eventsDivisionsContestantsStateList"
      row-key="id"
      empty-text
      class="small no-hover"
    >
      <el-table-column
        type="index"
        width="50"
        :sort-orders="eventsDivisionsContestantsSortOrders"
      />

      <el-table-column
        prop="time"
        width="160"
        :label="$t('column1Label')"
        :sort-orders="eventsDivisionsContestantsSortOrders"
      >
        <template slot-scope="scope">
          <h6 class="h6">
            {{ scope.row.time }}
          </h6>
          <small class="small">
            {{ eventsDivisionsStateSelected.day | moment("DD.MM") }}
          </small>
        </template>
      </el-table-column>

      <el-table-column
        prop="memberId"
        width="60px"
      >
        <template slot-scope="scope">
          <avatar
            :first-name="scope.row.member.firstName"
            :last-name="scope.row.member.lastName"
            size="small"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="memberId"
        sortable="custom"
        :label="$t('column2Label')"
        :sort-orders="eventsDivisionsContestantsSortOrders"
      >
        <template slot-scope="scope">
          <h6 class="h6">
            {{ scope.row.member.firstName }} {{ scope.row.member.lastName }}
          </h6>
          <small class="small">
            {{ scope.row.member.emailAddress }}
          </small>
        </template>
      </el-table-column>

      <el-table-column
        prop="weapons"
        :label="$t('column3Label')"
        :sort-orders="eventsDivisionsContestantsSortOrders"
      >
        <template slot-scope="scope">
          <h6 class="h6">
            {{ scope.row.weapon.class.name }}
          </h6>

          <small class="small">
            {{ scope.row.weapon.calibre }}
          </small>
        </template>
      </el-table-column>

      <template slot="empty">
        {{ $t("tablePlaceholderText") }}
        <el-button
          type="text"
          @click="eventsDivisionsContestantsOpenEditDialog"
        >
          {{ $t("tablePlaceholderButton") }}
        </el-button>
      </template>
    </el-table>
  </div>
</template>

<script>
import { mapState } from "vuex"
import Avatar from "~/components/Avatar"

export default {
  name: "EventsDivisionsContestantsListTable",

  components: {
    Avatar
  },

  data: () => ({
    eventsDivisionsContestantsSortOrders: [ "descending", "ascending" ]
  }),

  computed: {
    ...mapState("events/divisions", {
      eventsDivisionsStateSelected: "selected"
    }),
    ...mapState("events/divisions/contestants", {
      eventsDivisionsContestantsStateListIsLoading: "listIsLoading",
      eventsDivisionsContestantsStateList: "list"
    })
  },

  watch: {
    eventsDivisionsContestantsStateList: function() {
      this.$nextTick(function() {
        this.$refs.eventsDivisionsContestantsListTable.doLayout()
      })
    }
  },

  methods: {
    eventsDivisionsContestantsOpenEditDialog() {
      this.$emit("eventsDivisionsContestantsOpenEditDialog", this.division)
    }
  }
}
</script>
