<i18n>
{
  "en": {
    "column1Label": "Shooting Time/Day",
    "column2Label": "Name/Email",
    "column3Label": "Weapon",
    "tablePlaceholderText": "No participants yet.",
    "tablePlaceholderButton": "Add new?",
    "removeOneConfirmation": "This will remove %{fullName} from the division. Continue?",
    "removeOneSuccess": "%{fullName} was removed from the division",
    "removeManyConfirmation": "This will remove %{count} participants from the division. Continue?",
    "removeManySuccess": "%{count} participants was removed from the division"
  },
  "no": {
    "column1Label": "Skytte tid/dag",
    "column2Label": "Navn/epost",
    "column3Label": "Våpen",
    "tablePlaceholderText": "Ingen deltakere enda",
    "tablePlaceholderButton": "Legg til ny?",
    "removeOneConfirmation": "Dette vil fjerne %{fullName} fra standplasslisten. Fortsette?",
    "removeOneSuccess": "%{fullName} ble fjernet fra standplasslisten",
    "removeManyConfirmation": "Dette vil fjerne %{count} deltakere fra standplasslisten. Fortsette?",
    "removeManySuccess": "%{count} deltakere ble fjernet fra standplasslisten"
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
    v-loading="isLoading"
    class="events-divisions-contestants-list-table"
  >
    <el-table
      ref="eventsContestantsListTable"
      :data="eventsContestantsStateList"
      row-key="id"
      empty-text
      class="small no-hover"
      @selection-change="tableSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
      />

      <el-table-column
        prop="stand"
        width="70"
        label="Bane"
        :sort-orders="eventsContestantsSortOrders"
      />

      <el-table-column
        prop="participantId"
        width="70"
        label="Nr"
        :sort-orders="eventsContestantsSortOrders"
      >
        <template slot-scope="scope">
          <h6 class="h6">
            {{ scope.row.participant.number }}
          </h6>
        </template>
      </el-table-column>

      <el-table-column
        prop="participantId"
        width="60px"
      >
        <template slot-scope="scope">
          <avatar
            :first-name="scope.row.participant.member.firstName"
            :last-name="scope.row.participant.member.lastName"
            size="small"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="participantId"
        sortable="custom"
        label="Deltaker"
        :sort-orders="eventsContestantsSortOrders"
      >
        <template slot-scope="scope">
          <h6 class="h6">
            {{ scope.row.participant.member.firstName }} {{ scope.row.participant.member.lastName }}
          </h6>
        </template>
      </el-table-column>

      <el-table-column
        prop="participantId"
        sortable="custom"
        label="Klubb"
        :sort-orders="eventsContestantsSortOrders"
      >
        <template slot-scope="scope">
          {{ scope.row.participant.member.club.name }}
        </template>
      </el-table-column>

      <el-table-column
        prop="weapons"
        :label="$t('column3Label')"
        :sort-orders="eventsContestantsSortOrders"
      >
        <template slot-scope="scope">
          <h6 class="h6">
            {{ scope.row.weapon.class.number }} {{ scope.row.weapon.class.name }} ({{ scope.row.weapon.calibre }})
          </h6>
        </template>
      </el-table-column>

      <el-table-column
        width="50"
        align="right"
      >
        <template
          slot="header"
          slot-scope="scope"
        >
          <div
            class="table-actions"
            :class="{ 'disabled': !tableSelection.length }"
          >
            <el-dropdown
              trigger="click"
              @command="dispatchTableActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  class="dropdown-menu-delete"
                  :command="{
                    handler: 'eventsContestantsRemoveMany',
                    payload: tableSelection
                  }"
                >
                  <i class="el-icon-delete el-icon--left" />
                  Fjern valgte fra listen
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>

        <template slot-scope="scope">
          <el-dropdown
            trigger="click"
            @command="dispatchTableActions"
          >
            <span class="el-dropdown-link">
              <i class="table-button el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                class="dropdown-menu-delete"
                :command="{
                  handler: 'eventsContestantsRemoveOne',
                  payload: scope.row
                }"
              >
                <i class="el-icon-delete el-icon--left" />
                Slett fra listen
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>

      <template slot="empty">
        {{ $t("tablePlaceholderText") }}
        <el-button
          type="text"
          @click="openAssignmentDialog"
        >
          {{ $t("tablePlaceholderButton") }}
        </el-button>
      </template>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import Avatar from "~/components/Avatar"

export default {
  name: "EventsContestantsListTable",

  components: {
    Avatar
  },

  props: {
    division: { type: Object, required: true }
  },

  data: () => ({
    eventsContestantsSortOrders: [ "descending", "ascending" ],
    tableSelection: []
  }),

  computed: {
    ...mapState("events/contestants", {
      eventsContestantsStateListIsLoading: "listIsLoading",
      eventsContestantsStateList: "list",
      eventsContestantsStateRemoveOneIsLoading: "removeOneIsLoading",
      eventsContestantsStateRemoveManyIsLoading: "removeManyIsLoading"
    }),
    isLoading() {
      return (
        this.eventsContestantsStateListIsLoading ||
        this.eventsContestantsStateRemoveOneIsLoading ||
        this.eventsContestantsStateRemoveManyIsLoading
      )
    }
  },

  watch: {
    division: {
      immediate: true,
      handler: async function() {
        await this.eventsContestantsActionsList({
          divisionId: this.division.id
        })
      }
    }
  },

  methods: {
    ...mapActions("events/contestants", {
      eventsContestantsActionsList: "list",
      eventsContestantsActionsRemoveOne: "removeOne",
      eventsContestantsActionsRemoveMany: "removeMany"
    }),
    openAssignmentDialog() {
      this.$emit("openAssignmentDialog", this.division)
    },
    tableSelectionChange(selection) {
      this.tableSelection = selection
    },
    dispatchTableActions({ handler, payload }) {
      this[handler](payload)
    },
    async eventsContestantsRemoveOne(contestant) {
      const fullName = `${contestant.participant.member.firstName} ${contestant.participant.member.lastName}`

      try {
        await this.$confirm(
          this.$t("removeOneConfirmation", { fullName: fullName }),
          this.$t("warning"), {
            confirmButtonText: this.$t("confirmButtonText"),
            cancelButtonText: this.$t("cancel"),
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )
      } catch(e) {
        return
      }

      try {
        await this.eventsContestantsActionsRemoveOne(contestant)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("removeOneSuccess", { fullName })
        })
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },
    async eventsContestantsRemoveMany(contestants) {
      const count = contestants.length
      try {
        await this.$confirm(
          this.$t("removeManyConfirmation", { count }),
          this.$t("warning"), {
            confirmButtonText: this.$t("confirmButtonText"),
            cancelButtonText: this.$t("cancel"),
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )
      } catch(e) {
        return
      }

      try {
        await this.eventsContestantsActionsRemoveMany(contestants)
        this.tableSelectionChange([])
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("removeManySuccess", { count })
        })
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    }
  }
}
</script>
