<style lang="stylus">
</style>

<template>
  <div class="ranges-list-table">
    <search-form
      v-model="rangesSearchFilter"
      placeholder="Search for a range by name or area"
      @submit="rangesSetSearchFilterAsync"
    />

    <div v-loading="rangesListIsLoading || rangesRemoveIsLoading">
      <el-table
        :data="rangesList"
        :sort-by="rangesSortBy"
        row-key="_id"
        class="table-clickable"
        empty-text
        @selection-change="rangesSelectionChange"
        @row-click="rangesRowClick"
        @sort-change="rangesSetSortingAsync"
      >
        <el-table-column
          type="selection"
          width="40"
        />

        <el-table-column
          prop="name"
          label="Name/Area"
          sortable="custom"
          :sort-orders="rangesSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.name }}
            </h6>
            <small class="small">
              {{ scope.row.area }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="type"
          label="Type"
          sortable="custom"
          :sort-orders="rangesSortOrders"
        />

        <el-table-column
          prop="country"
          label="Country"
          sortable="custom"
          :sort-orders="rangesSortOrders"
        />

        <el-table-column
          prop="createdAt"
          label="Added On"
          sortable="custom"
          width="150px"
          :sort-orders="rangesSortOrders"
        >
          <template slot-scope="scope">
            {{ scope.row.createdAt | moment("MM.DD.YY") }}
          </template>
        </el-table-column>

        <el-table-column
          width="50"
          align="right"
        >
          <template slot="header">
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
                  <el-dropdown-item command="removeSelection">
                    <i class="el-icon-delete el-icon--left" /> Remove selected
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="rangesTableRowDispatchActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item :command="{ handler: 'edit', payload: scope.row }">
                  <i class="el-icon-edit el-icon--left"></i> Rediger
                </el-dropdown-item> -->
                <el-dropdown-item :command="{ handler: 'rangesDelete', payload: scope.row }">
                  <i class="el-icon-delete el-icon--left" /> Slett
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          No ranges yet.
          <el-button
            type="text"
            @click="rangesOpenCreateDialog"
          >
            Create new?
          </el-button>
        </template>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-size="rangesPageSize"
        :current-page="rangesPageCurrent"
        :page-sizes="[ 15, 30, 45, 60 ]"
        :total="rangesCount"
        @size-change="rangesSetPageSizeAsync"
        @current-change="rangesSetPageCurrentAsync"
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
      rangesListIsLoading: "listIsLoading",
      rangesRemoveIsLoading: "removeIsLoading",
      rangesSortBy: "sortBy",
      rangesPageSize: "pageSize",
      rangesPageCurrent: "pageCurrent",
      rangesCount: "count",
      rangesList: "list"
    }),
    rangesHasSelection() {
      return this.rangesSelection.length > 0
    },
    rangesSearchFilter: {
      get() { return this.$store.state.ranges.searchFilterValue },
      set(search) { this.rangesSetSearchFilter(search) }
    }
  },

  async created() {
    await this.rangesListAsync()
  },

  methods: {
    ...mapMutations("ranges", {
      rangesSetSearchFilter: "SET_SEARCH_FILTER"
    }),

    ...mapActions("ranges", {
      rangesListAsync: "listAsync",
      rangesRemoveAsync: "removeAsync",
      rangesSetSortingAsync: "setSortingAsync",
      rangesSetPageSizeAsync: "setPageSizeAsync",
      rangesSetPageCurrentAsync: "setPageCurrentAsync",
      rangesSetSearchFilterAsync: "setSearchFilterAsync"
    }),

    rangesOpenCreateDialog() {
      this.$emit("rangesOpenCreateDialog")
    },

    rangesTableRowDispatchActions({ handler, payload }) {
      switch(handler) {
        case "rangesDelete":
          this.rangesDeleteAsync(payload)
          break
      }
    },

    async rangesDeleteAsync(range) {
      await this.$confirm(
        `This will remove ${range.name} permanently. Continue?`,
        "Warning!", {
          confirmButtonText: "Yes, I am sure",
          cancelButtonText: "Cancel",
          customClass: "dangerous-confirmation",
          type: "warning"
        }
      )
      try {
        await this.rangesRemoveAsync(range)
        this.$notify({
          type: "success",
          title: "Success",
          message: `${range.name} was removed from the database`
        })
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    rangesRowClick(range, e) {
      if(e.target.className.includes("table-button")) {
        return
      }
      this.$router.push(`/ranges/${range._id}`)
    },

    rangesSelectionChange(ranges) {
      this.rangesSelection = ranges
    },

    rangesTableDispatchActions({ handler, payload }) {}
  }
}
</script>
