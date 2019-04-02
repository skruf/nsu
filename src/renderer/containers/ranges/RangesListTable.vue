<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for a range by name or area",
    "column1Label": "Name/Type",
    "column2Label": "Area/Address",
    "column3Label": "Country",
    "removeSelected": "Remove selected",
    "editRange": "Edit range",
    "removeRange": "Remove range",
    "showRangeMap": "Show on map",
    "tablePlaceholderText": "No ranges yet.",
    "tablePlaceholderButton": "Create new?",
    "rangesRemoveOneConfirmation": "This will remove %{range} permanently. Continue?",
    "rangesActionsRemoveOneSuccess": "%{range} was removed from the database",
    "rangesRemoveManyConfirmation": "This will remove %{ranges} ranges permanently. Continue?",
    "rangesActionsRemoveManySuccess": "%{ranges} ranges were removed from the database"
  },
  "no": {
    "searchFormPlaceholder": "Søk etter en skyttebane med navn eller område",
    "column1Label": "Navn/Type",
    "column2Label": "Område/Adresse",
    "column3Label": "Land",
    "removeSelected": "Slett valgte",
    "editRange": "Rediger skyttebane",
    "removeRange": "Slett skyttebane",
    "showRangeMap": "Vis på kart",
    "tablePlaceholderText": "Ingen skyttebaner enda.",
    "tablePlaceholderButton": "Opprett ny?",
    "rangesRemoveOneConfirmation": "Dette vil fjerne %{range} permanent. Fortsett?",
    "rangesActionsRemoveOneSuccess": "%{range} ble fjernet fra databasen",
    "rangesRemoveManyConfirmation": "Dette vil fjerne %{ranges} skyttebaner permanent. Fortsett?",
    "rangesActionsRemoveManySuccess": "%{ranges} skyttebaner ble fjernet fra databasen"
  }
}
</i18n>

<template>
  <div class="ranges-list-table">
    <search-form
      v-model="rangesSearchFilter"
      :placeholder="$t('searchFormPlaceholder')"
      @submit="rangesActionsSetSearchFilter"
    />

    <div v-loading="rangesIsLoading">
      <el-table
        :data="rangesStateList"
        :sort-by="rangesStateSortBy"
        row-key="id"
        class="no-hover"
        empty-text
        @selection-change="rangesSelectionChange"
        @sort-change="rangesActionsSetSorting"
      >
        <el-table-column
          type="selection"
          width="40"
        />

        <el-table-column
          prop="name"
          sortable="custom"
          :label="$t('column1Label')"
          :sort-orders="rangesSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.name }}
            </h6>
            <small class="small">
              {{ scope.row.type }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="area"
          sortable="custom"
          :label="$t('column2Label')"
          :sort-orders="rangesSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.area }}
            </h6>
            <small class="small">
              {{ scope.row.address || "N/A" }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="country"
          sortable="custom"
          :label="$t('column3Label')"
          :sort-orders="rangesSortOrders"
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
              :class="{ 'disabled': !rangesHasSelection }"
            >
              <el-dropdown
                trigger="click"
                @command="rangesTableDispatchActions"
              >
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    class="dropdown-menu-delete"
                    :command="{
                      handler: 'rangesRemoveMany'
                    }"
                  >
                    <i class="el-icon-delete el-icon--left" /> {{ $t("removeSelected") }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>

          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="rangesTableDispatchActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :disabled="!(scope.row.lat && scope.row.lng)"
                  :command="{
                    handler: 'rangesOpenMap',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-location el-icon--left" /> {{ $t("showRangeMap") }}
                </el-dropdown-item>
                <el-dropdown-item
                  :command="{
                    handler: 'rangesOpenEditDialog',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-edit el-icon--left" /> {{ $t("editRange") }}
                </el-dropdown-item>
                <el-dropdown-item
                  divided
                  class="dropdown-menu-delete"
                  :command="{
                    handler: 'rangesRemoveOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-delete el-icon--left" />  {{ $t("removeRange") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          {{ $t("tablePlaceholderText") }}
          <el-button
            type="text"
            @click="rangesOpenCreateDialog"
          >
            {{ $t("tablePlaceholderButton") }}
          </el-button>
        </template>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-size="rangesStatePageSize"
        :current-page="rangesStatePageCurrent"
        :page-sizes="[ 15, 30, 45, 60 ]"
        :total="rangesStateCount"
        @size-change="rangesActionsSetPageSize"
        @current-change="rangesActionsSetPageCurrent"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex"
import SearchForm from "@/components/SearchForm"

export default {
  name: "RangesListTable",

  components: {
    SearchForm
  },

  data: () => ({
    rangesSelection: [],
    rangesSortOrders: [ "descending", "ascending" ]
  }),

  computed: {
    ...mapState("ranges", {
      rangesStateListIsLoading: "listIsLoading",
      rangesStateRemoveOneIsLoading: "removeOneIsLoading",
      rangesStateRemoveManyIsLoading: "removeManyIsLoading",
      rangesStateSortBy: "sortBy",
      rangesStatePageSize: "pageSize",
      rangesStatePageCurrent: "pageCurrent",
      rangesStateCount: "count",
      rangesStateList: "list"
    }),

    rangesHasSelection() {
      return this.rangesSelection.length > 0
    },

    rangesSearchFilter: {
      get() { return this.$store.state.ranges.searchFilterValue },
      set(search) { this.rangesMutationsSetSearchFilter(search) }
    },

    rangesIsLoading() {
      return (
        this.rangesStateListIsLoading ||
        this.rangesStateRemoveOneIsLoading ||
        this.rangesStateRemoveManyIsLoading
      )
    }
  },

  async created() {
    await this.rangesActionsList()
  },

  methods: {
    ...mapMutations("ranges", {
      rangesMutationsSetSearchFilter: "SET_SEARCH_FILTER"
    }),

    ...mapActions("ranges", {
      rangesActionsList: "list",
      rangesActionsRemoveOne: "removeOne",
      rangesActionsSetSorting: "setSorting",
      rangesActionsSetPageSize: "setPageSize",
      rangesActionsSetPageCurrent: "setPageCurrent",
      rangesActionsSetSearchFilter: "setSearchFilter",
      rangesActionsRemoveMany: "removeMany"
    }),

    rangesOpenCreateDialog() {
      this.$emit("rangesOpenCreateDialog")
    },

    rangesOpenEditDialog(range) {
      this.$emit("rangesOpenEditDialog", range)
    },

    rangesSelectionChange(ranges) {
      this.rangesSelection = ranges
    },

    rangesOpenMap(range) {
      window.open(`https://www.google.com/maps/@${range.lat},${range.lng},15z`)
    },

    rangesTableDispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    async rangesRemoveOne(range) {
      try {
        await this.$confirm(
          this.$t("rangesRemoveOneConfirmation", { range: range.name }),
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
        await this.rangesActionsRemoveOne(range)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("rangesActionsRemoveOneSuccess", {
            range: range.name
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

    async rangesRemoveMany() {
      const count = this.rangesSelection.length

      try {
        await this.$confirm(
          this.$t("rangesRemoveManyConfirmation", {
            ranges: count
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
        await this.rangesActionsRemoveMany(this.rangesSelection)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("rangesActionsRemoveManySuccess", {
            ranges: count
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
