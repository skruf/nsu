<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for participants by first or last name",
    "column1Label": "Name",
    "column2Label": "Club",
    "column3Label": "Weapons",
    "column4Label": "Added On",
    "removeSelected": "Remove selected",
    "editParticipant": "Edit participant",
    "removeParticipant": "Remove participant",
    "tablePlaceholderText": "No participants yet.",
    "tablePlaceholderButton": "Add a member?",
    "eventsParticipantsRemoveOneConfirmation": "This will remove %{member} from the event permanently. Continue?",
    "eventsParticipantsActionsRemoveOneSuccess": "%{member} was removed from the event",
    "eventsParticipantsRemoveManyConfirmation": "This will remove %{members} participants from the event permanently. Continue?",
    "eventsParticipantsActionsRemoveManySuccess": "%{members} participants were removed from the event"
  },
  "no": {
    "searchFormPlaceholder": "Søk etter deltakere med fornavn eller etternavn",
    "column1Label": "Navn",
    "column2Label": "Klubb",
    "column3Label": "Våpen",
    "column4Label": "Lagt til",
    "removeSelected": "Slett valgte",
    "editParticipant": "Rediger deltaker",
    "removeParticipant": "Slett deltaker",
    "tablePlaceholderText": "Ingen deltakere enda",
    "tablePlaceholderButton": "Legg til ett medlem?",
    "eventsParticipantsRemoveOneConfirmation": "Dette vil fjerne %{member} fra stevnet permanent. Fortsett?",
    "eventsParticipantsActionsRemoveOneSuccess": "%{member} ble fjernet fra stevnet",
    "eventsParticipantsRemoveManyConfirmation": "Dette vil fjerne %{members} deltakere fra stevnet permanent. Fortsett?",
    "eventsParticipantsActionsRemoveManySuccess": "%{members} deltakere ble fjernet fra stevnet"  }
}
</i18n>

<style lang="stylus">
  .participant_attributes
    .small:not(:last-child):after
      content "•"
</style>

<template>
  <div class="events-participants-list-table">
    <!-- <search-form
      v-model="eventsParticipantsSearchFilter"
      class="mb-5"
      :placeholder="$t('searchFormPlaceholder')"
      @submit="eventsParticipantsActionsSetSearchFilter"
    /> -->

    <div v-loading="eventsParticipantsIsLoading">
      <el-table
        :data="eventsParticipantsStateList"
        :sort-by="eventsParticipantsStateSortBy"
        row-key="id"
        class="table-clickable"
        empty-text
        @selection-change="eventsParticipantsSelectionChange"
        @row-click="eventsParticipantsRowClick"
        @sort-change="eventsParticipantsActionsSetSorting"
      >
        <el-table-column
          type="selection"
          width="40"
        />

        <el-table-column
          prop="number"
          label="Number"
          width="100px"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              67
            </h6>
          </template>
        </el-table-column>

        <el-table-column
          prop="member"
          width="50px"
        >
          <template slot-scope="scope">
            <avatar
              size="small"
              :first-name="scope.row.member.firstName"
              :last-name="scope.row.member.lastName"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="memberId"
          sortable="custom"
          :label="$t('column1Label')"
          :sort-orders="eventsParticipantsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.member.firstName }} {{ scope.row.member.lastName }}
            </h6>
          </template>
        </el-table-column>

        <el-table-column
          prop="memberId"
          sortable="custom"
          :label="$t('column2Label')"
          :sort-orders="eventsParticipantsSortOrders"
        >
          <template slot-scope="scope">
            {{ scope.row.member.club.name }}
          </template>
        </el-table-column>

        <el-table-column
          prop="weapons"
          :label="$t('column3Label')"
          :sort-orders="eventsParticipantsSortOrders"
        >
          <template slot-scope="scope">
            <el-tooltip placement="top">
              <ul slot="content">
                <li
                  v-for="(weapon, index) in scope.row.weapons"
                  :key="index"
                >
                  {{ weapon.class.name }} ({{ weapon.calibre }})
                </li>
              </ul>
              <el-tag size="mini">
                {{ scope.row.weapons.length }} {{ $t('column3Label') }}
              </el-tag>
            </el-tooltip>
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
              :class="{ 'disabled': !eventsParticipantsHasSelection }"
            >
              <el-dropdown
                trigger="click"
                @command="eventsParticipantsDispatchActions"
              >
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    class="dropdown-menu-delete"
                    :command="{
                      handler: 'eventsParticipantsRemoveMany'
                    }"
                  >
                    <i class="el-icon-delete el-icon--left" />
                    {{ $t("removeSelected") }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>

          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="eventsParticipantsDispatchActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{
                    handler: 'eventsParticipantsOpenEditDialog',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-edit el-icon--left" />
                  {{ $t("editParticipant") }}
                </el-dropdown-item>

                <el-dropdown-item
                  divided
                  class="dropdown-menu-delete"
                  :command="{
                    handler: 'eventsParticipantsRemoveOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-delete el-icon--left" />
                  {{ $t("removeParticipant") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          {{ $t("tablePlaceholderText") }}
          <el-button
            type="text"
            @click="eventsParticipantsOpenManageDialog"
          >
            {{ $t("tablePlaceholderButton") }}
          </el-button>
        </template>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-size="eventsParticipantsStatePageSize"
        :current-page="eventsParticipantsStatePageCurrent"
        :page-sizes="[ 15, 30, 45, 60 ]"
        :total="eventsParticipantsStateCount"
        @size-change="eventsParticipantsActionsSetPageSize"
        @current-change="eventsParticipantsActionsSetPageCurrent"
      />
    </div>

    <events-participants-view-dialog
      :shown.sync="eventsParticipantsShowViewDialog"
      :events-participants-id="eventsParticipantsViewId"
    />
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex"
// import SearchForm from "~/components/SearchForm"
import Avatar from "~/components/Avatar"
import EventsParticipantsViewDialog from "~/containers/EventsParticipantsViewDialog"

export default {
  name: "EventsParticipantsListTable",

  components: {
    // SearchForm,
    Avatar,
    EventsParticipantsViewDialog
  },

  props: {
    event: { type: Object, required: true }
  },

  data: () => ({
    eventsParticipantsSelection: [],
    eventsParticipantsSortOrders: [ "descending", "ascending" ],
    eventsParticipantsViewId: "",
    eventsParticipantsShowViewDialog: false
  }),

  computed: {
    ...mapState("events/participants", {
      eventsParticipantsStateList: "list",
      eventsParticipantsStateListIsLoading: "listIsLoading",
      eventsParticipantsStateRemoveOneIsLoading: "removeOneIsLoading",
      eventsParticipantsStateRemoveManyIsLoading: "removeManyIsLoading",
      eventsParticipantsStateCount: "count",
      eventsParticipantsStatePageSize: "pageSize",
      eventsParticipantsStatePageCurrent: "pageCurrent",
      eventsParticipantsStateSortBy: "sortBy"
    }),

    eventsParticipantsHasSelection() {
      return this.eventsParticipantsSelection.length > 0
    },

    // eventsParticipantsSearchFilter: {
    //   get() { return this.$store.state.clubs.searchFilterValue },
    //   set(search) { this.eventsParticipantsMutationsSetSearchFilter(search) }
    // },

    eventsParticipantsIsLoading() {
      return (
        this.eventsParticipantsStateListIsLoading ||
        this.eventsParticipantsStateRemoveOneIsLoading ||
        this.eventsParticipantsStateRemoveManyIsLoading
      )
    }
  },

  async created() {
    this.eventsParticipantsMutationsSetListFilter({ eventId: this.event.id })
    await this.eventsParticipantsActionsList()
  },

  methods: {
    ...mapMutations("events/participants", {
      eventsParticipantsMutationsSetListFilter: "SET_LIST_FILTER"
      // eventsParticipantsMutationsSetSearchFilter: "SET_SEARCH_FILTER"
    }),

    ...mapActions("events/participants", {
      eventsParticipantsActionsList: "list",
      eventsParticipantsActionsRemoveOne: "removeOne",
      eventsParticipantsActionsRemoveMany: "removeMany",
      eventsParticipantsActionsSetPageSize: "setPageSize",
      eventsParticipantsActionsSetPageCurrent: "setPageCurrent",
      eventsParticipantsActionsSetSorting: "setSorting",
      eventsParticipantsActionsSetSearchFilter: "setSearchFilter"
    }),

    eventsParticipantsOpenManageDialog() {
      this.$emit("eventsParticipantsOpenManageDialog")
    },

    eventsParticipantsSelectionChange(participants) {
      this.eventsParticipantsSelection = participants
    },

    eventsParticipantsRowClick(participant, column, e) {
      if(!e.target.className.includes("table-button")) {
        this.eventsParticipantsViewId = participant.id
        this.eventsParticipantsShowViewDialog = true
      }
    },

    eventsParticipantsDispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    eventsParticipantsOpenEditDialog(participant) {
      this.$emit("eventsParticipantsOpenEditDialog", participant)
    },

    async eventsParticipantsRemoveOne(participant) {
      const fullName = `${participant.member.firstName} ${participant.member.lastName}`

      try {
        await this.$confirm(
          this.$t("eventsParticipantsRemoveOneConfirmation", {
            member: fullName
          }),
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
        await this.eventsParticipantsActionsRemoveOne(participant)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsParticipantsActionsRemoveOneSuccess", {
            member: fullName
          })
        })
      } catch(e) {
        this.$notify({
          title: "Oops!",
          message: e.message,
          type: "error"
        })
      }
    },

    async eventsParticipantsRemoveMany() {
      const count = this.eventsParticipantsSelection.length

      try {
        await this.$confirm(
          this.$t("eventsParticipantsRemoveManyConfirmation", {
            members: count
          }),
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
        await this.eventsParticipantsActionsRemoveMany(this.eventsParticipantsSelection)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsParticipantsActionsRemoveManySuccess", {
            members: count
          })
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
