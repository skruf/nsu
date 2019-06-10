<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for an event by title or club",
    "column1Label": "Starts/Ends",
    "column2Label": "Title/Approbated",
    "column2LabelIsApprobated": "Is approbated",
    "column2LabelIsntApprobated": "Isn't approbated",
    "column3Label": "Range/Organizer",
    "column4Label": "Category",
    "removeSelected": "Remove selected",
    "editEvent": "Edit event",
    "removeEvent": "Remove event",
    "tablePlaceholderText": "No events yet.",
    "tablePlaceholderButton": "Create new?",
    "eventsRemoveOneConfirmation": "This will remove %{event} permanently. Continue?",
    "eventsActionsRemoveOneSuccess": "%{event} was removed from the database",
    "eventsRemoveManyConfirmation": "This will remove %{events} events permanently. Continue?",
    "eventsActionsRemoveManySuccess": "%{events} events were removed from the database"
  },
  "no": {
    "searchFormPlaceholder": "Søk etter et stevne med tittel eller klubb",
    "column1Label": "Starter/Slutter",
    "column2Label": "Tittel/Approbert",
    "column2LabelIsApprobated": "Er approbert",
    "column2LabelIsntApprobated": "Ikke approbert",
    "column3Label": "Skyttebane/Arrangør",
    "column4Label": "Kategori",
    "removeSelected": "Slett valgte",
    "editEvent": "Rediger stevne",
    "removeEvent": "Slett stevne",
    "tablePlaceholderText": "Ingen stevner enda.",
    "tablePlaceholderButton": "Opprett ny?",
    "eventsRemoveOneConfirmation": "Dette vil fjerne %{event} permanent. Fortsett?",
    "eventsActionsRemoveOneSuccess": "%{event} ble fjernet fra databasen",
    "eventsRemoveManyConfirmation": "Dette vil fjerne %{events} stevner permanent. Fortsett?",
    "eventsActionsRemoveManySuccess": "%{events} stevner ble fjernet fra databasen"
  }
}
</i18n>

<template>
  <div class="events-list-table">
    <search-form
      v-model="eventsSearchFilter"
      class="mb-5"
      :placeholder="$t('searchFormPlaceholder')"
      @submit="eventsActionsSetSearchFilter"
    />

    <div v-loading="eventsIsLoading">
      <el-table
        :data="eventsStateList"
        :sort-by="eventsStateSortBy"
        row-key="id"
        class="table-clickable"
        empty-text
        @selection-change="eventsSelectionChange"
        @row-click="eventsRowClick"
        @sort-change="eventsActionsSetSorting"
      >
        <el-table-column
          type="selection"
          width="40"
        />

        <el-table-column
          prop="startsAt"
          width="150px"
          sortable="custom"
          :label="$t('column1Label')"
          :sort-orders="eventsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.startsAt | moment("MMM, D") }}
            </h6>
            <small class="small">
              {{ scope.row.endsAt | moment("MMM, D") }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="title"
          sortable="custom"
          :label="$t('column2Label')"
          :sort-orders="eventsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.title }}
            </h6>
            <small class="small">
              <template v-if="scope.row.approbated">
                <i class="el-icon-star-on" />
                {{ $t("column2LabelIsApprobated") }}
              </template>
              <template v-else>
                <i class="el-icon-star-off" />
                {{ $t("column2LabelIsntApprobated") }}
              </template>
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="rangeId"
          sortable="custom"
          :label="$t('column3Label')"
          :sort-orders="eventsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.range ? scope.row.range.name : "N/A" }}
            </h6>
            <small class="small">
              {{ scope.row.club ? scope.row.club.name : "N/A" }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="category"
          sortable="custom"
          :label="$t('column4Label')"
          :sort-orders="eventsSortOrders"
        />

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
              :class="{ 'disabled': !eventsHasSelection }"
            >
              <el-dropdown
                trigger="click"
                @command="dispatchActions"
              >
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    class="dropdown-menu-delete"
                    :command="{
                      handler: 'eventsRemoveMany'
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
              @command="dispatchActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{
                    handler: 'eventsOpenEditDialog',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-edit el-icon--left" />
                  {{ $t("editEvent") }}
                </el-dropdown-item>
                <el-dropdown-item
                  divided
                  class="dropdown-menu-delete"
                  :command="{
                    handler: 'eventsRemoveOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-delete el-icon--left" />
                  {{ $t("removeEvent") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          {{ $t("tablePlaceholderText") }}
          <el-button
            type="text"
            @click="eventsOpenCreateDialog"
          >
            {{ $t("tablePlaceholderButton") }}
          </el-button>
        </template>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-size="eventsStatePageSize"
        :current-page="eventsStatePageCurrent"
        :page-sizes="[ 15, 30, 45, 60 ]"
        :total="eventsStateCount"
        @size-change="eventsActionsSetPageSize"
        @current-change="eventsActionsSetPageCurrent"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapMutations, mapState } from "vuex"
import SearchForm from "~/components/SearchForm"

export default {
  name: "EventsListTable",

  components: {
    SearchForm
  },

  data: () => ({
    eventsSelection: [],
    eventsSortOrders: [ "descending", "ascending" ]
  }),

  computed: {
    ...mapState("events", {
      eventsStateListIsLoading: "listIsLoading",
      eventsStateRemoveOneIsLoading: "removeOneIsLoading",
      eventsStateRemoveManyIsLoading: "removeManyIsLoading",
      eventsStateSortBy: "sortBy",
      eventsStatePageSize: "pageSize",
      eventsStatePageCurrent: "pageCurrent",
      eventsStateCount: "count",
      eventsStateList: "list"
    }),

    eventsHasSelection() {
      return this.eventsSelection.length > 0
    },

    eventsSearchFilter: {
      get() { return this.$store.state.events.searchFilterValue },
      set(search) { this.eventsMutationsSetSearchFilter(search) }
    },

    eventsIsLoading() {
      return (
        this.eventsStateListIsLoading ||
        this.eventsStateRemoveOneIsLoading ||
        this.eventsStateRemoveManyIsLoading
      )
    }
  },

  methods: {
    ...mapMutations("events", {
      eventsMutationsSetSearchFilter: "SET_SEARCH_FILTER"
    }),
    ...mapActions("events", {
      eventsActionsList: "list",
      eventsActionsRemoveOne: "removeOne",
      eventsActionsRemoveMany: "removeMany",
      eventsActionsSetSorting: "setSorting",
      eventsActionsSetPageSize: "setPageSize",
      eventsActionsSetPageCurrent: "setPageCurrent",
      eventsActionsSetSearchFilter: "setSearchFilter"
    }),

    eventsOpenCreateDialog() {
      this.$emit("eventsOpenCreateDialog")
    },

    eventsOpenEditDialog(event) {
      this.$emit("eventsOpenEditDialog", event)
    },

    eventsRowClick(event, column, e) {
      if(!e.target.className.includes("table-button")) {
        this.$router.push(`/events/${event.id}`)
      }
    },

    eventsSelectionChange(events) {
      this.eventsSelection = events
    },

    dispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    async eventsRemoveOne(event) {
      try {
        await this.$confirm(
          this.$t("eventsRemoveOneConfirmation", { event: event.title }),
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
        await this.eventsActionsRemoveOne(event)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsActionsRemoveOneSuccess", {
            event: event.title
          })
        })
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    async eventsRemoveMany() {
      const count = this.eventsSelection.length
      try {
        await this.$confirm(
          this.$t("eventsRemoveManyConfirmation", { events: count }),
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
        await this.eventsActionsRemoveMany(this.eventsSelection)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsActionsRemoveManySuccess", {
            events: count
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
