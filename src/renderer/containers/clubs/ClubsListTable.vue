<style lang="stylus">
</style>

<template>
  <div class="clubs-list-table">
    <search-form
      v-model="clubsSearchFilter"
      placeholder="Search for a club by name"
      @submit="clubsSetSearchFilterAsync"
    />

    <div v-loading="clubsListIsLoading || clubsRemoveIsLoading">
      <el-table
        :data="clubsList"
        :sort-by="clubsSortBy"
        row-key="_id"
        class="table-clickable"
        empty-text
        @selection-change="clubsSelectionChange"
        @row-click="clubsRowClick"
        @sort-change="clubsSetSortingAsync"
      >
        <el-table-column
          type="selection"
          width="40"
        />

        <el-table-column
          prop="name"
          label="Name/Area"
          sortable="custom"
          :sort-orders="clubsSortOrders"
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
          prop="name"
          label="Range Name/Area"
          sortable="custom"
          :sort-orders="clubsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.range.name }}
            </h6>
            <small class="small">
              {{ scope.row.range.area }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="members"
          label="Members"
          sortable="custom"
          width="150px"
          :sort-orders="clubsSortOrders"
        >
          23
        </el-table-column>

        <el-table-column
          prop="createdAt"
          label="Added On"
          sortable="custom"
          width="150px"
          :sort-orders="clubsSortOrders"
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
              :class="{ 'disabled': !clubsHasSelection }"
            >
              <el-dropdown
                trigger="click"
                @command="clubsTableDispatchActions"
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
              @command="clubsTableRowDispatchActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item :command="{ handler: 'edit', payload: scope.row }">
                  <i class="el-icon-edit el-icon--left"></i> Rediger
                </el-dropdown-item> -->
                <el-dropdown-item :command="{ handler: 'clubsDelete', payload: scope.row }">
                  <i class="el-icon-delete el-icon--left" /> Slett
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          No clubs yet.
          <el-button
            type="text"
            @click="clubsOpenCreateDialog"
          >
            Create new?
          </el-button>
        </template>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-size="clubsPageSize"
        :current-page="clubsPageCurrent"
        :page-sizes="[ 15, 30, 45, 60 ]"
        :total="clubsCount"
        @size-change="clubsSetPageSizeAsync"
        @current-change="clubsSetPageCurrentAsync"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex"
import SearchForm from "@/components/SearchForm"

export default {
  name: "ClubsListTable",

  components: {
    SearchForm
  },

  data: () => ({
    clubsSelection: [],
    clubsSortOrders: [ "descending", "ascending" ]
  }),

  computed: {
    ...mapState("clubs", {
      clubsListIsLoading: "listIsLoading",
      clubsRemoveIsLoading: "removeIsLoading",
      clubsSortBy: "sortBy",
      clubsPageSize: "pageSize",
      clubsPageCurrent: "pageCurrent",
      clubsCount: "count",
      clubsList: "list"
    }),
    clubsHasSelection() {
      return this.clubsSelection.length > 0
    },
    clubsSearchFilter: {
      get() { return this.$store.state.clubs.searchFilterValue },
      set(search) { this.clubsSetSearchFilter(search) }
    }
  },

  async created() {
    await this.clubsListAsync()
  },

  methods: {
    ...mapMutations("clubs", {
      clubsSetSearchFilter: "SET_SEARCH_FILTER"
    }),

    ...mapActions("clubs", {
      clubsListAsync: "listAsync",
      clubsRemoveAsync: "removeAsync",
      clubsSetSortingAsync: "setSortingAsync",
      clubsSetPageSizeAsync: "setPageSizeAsync",
      clubsSetPageCurrentAsync: "setPageCurrentAsync",
      clubsSetSearchFilterAsync: "setSearchFilterAsync"
    }),

    clubsOpenCreateDialog() {
      this.$emit("clubsOpenCreateDialog")
    },

    clubsTableRowDispatchActions({ handler, payload }) {
      switch(handler) {
        case "clubsDelete":
          this.clubsDeleteAsync(payload)
          break
      }
    },

    async clubsDeleteAsync(club) {
      await this.$confirm(
        `This will remove ${club.name} permanently. Continue?`,
        "Warning!", {
          confirmButtonText: "Yes, I am sure",
          cancelButtonText: "Cancel",
          customClass: "dangerous-confirmation",
          type: "warning"
        }
      )
      try {
        await this.clubsRemoveAsync(club)
        this.$notify({
          type: "success",
          title: "Success",
          message: `${club.name} was removed from the database`
        })
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    clubsRowClick(club, e) {
      if(e.target.className.includes("table-button")) {
        return
      }
      this.$router.push(`/clubs/${club._id}`)
    },

    clubsSelectionChange(clubs) {
      this.clubsSelection = clubs
    },

    clubsTableDispatchActions({ handler, payload }) {}
  }
}
</script>
