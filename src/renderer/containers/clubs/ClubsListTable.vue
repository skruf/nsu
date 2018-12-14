<style lang="stylus">
</style>

<template>
  <div class="clubs-list-table">
    <search-form
      v-model="clubsSearchFilter"
      @submit="clubsSetSearchFilterAsync"
      placeholder="Search for a club by name"
    />

    <div class="table-actions" :class="{ 'disabled': !clubsHasSelection }">
      <el-dropdown @command="clubsTableDispatchActions">
        <el-button type="text" size="small">
          Actions <i class="el-icon-arrow-down el-icon--left"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="removeSelection">
            <i class="el-icon-delete el-icon--left"></i> Remove selected
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div v-loading="clubsListIsLoading || clubsRemoveIsLoading">
      <el-table
        :data="clubsList"
        @selection-change="clubsSelectionChange"
        @row-click="clubsRowClick"
        @sort-change="clubsSetSortingAsync"
        :sort-by="clubsSortBy"
        row-key="_id"
        class="table-clickable"
        empty-text
      >
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column prop="name" label="Name" sortable="custom" :sort-orders="clubsSortOrders"></el-table-column>
        <el-table-column prop="area" label="Area" sortable="custom" :sort-orders="clubsSortOrders"></el-table-column>
        <el-table-column prop="country" label="Country" sortable="custom" :sort-orders="clubsSortOrders"></el-table-column>
        <el-table-column prop="members" label="Members" sortable="custom" width="110px" :sort-orders="clubsSortOrders"></el-table-column>
        <el-table-column width="40">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="clubsTableRowDispatchActions">
              <span class="el-dropdown-link">
                <i class="table-button el-icon-setting"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item :command="{ handler: 'edit', payload: scope.row }">
                  <i class="el-icon-edit el-icon--left"></i> Rediger
                </el-dropdown-item> -->
                <el-dropdown-item :command="{ handler: 'clubsDelete', payload: scope.row }">
                  <i class="el-icon-delete el-icon--left"></i> Slett
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <template slot="empty">
          No clubs yet.
          <el-button type="text" size="small" @click="clubsOpenCreateDialog">
            Create new?
          </el-button>
        </template>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        @size-change="clubsSetPageSizeAsync"
        @current-change="clubsSetPageCurrentAsync"
        :page-size="clubsPageSize"
        :current-page="clubsPageCurrent"
        :page-sizes="[ 15, 30, 45, 60 ]"
        :total="clubsCount"
      ></el-pagination>
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

  async created() {
    await this.clubsListAsync()
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
