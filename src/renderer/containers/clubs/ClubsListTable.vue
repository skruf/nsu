<style lang="stylus">
</style>

<template>
  <div class="clubs-list-table">
    <search-form
      v-model="clubsSearchFilter"
      placeholder="Search for a club by name"
      @submit="clubsActionsSetSearchFilter"
    />

    <div v-loading="clubsIsLoading">
      <el-table
        :data="clubsStateList"
        :sort-by="clubsStateSortBy"
        row-key="id"
        class="table-clickable"
        empty-text
        @selection-change="clubsSelectionChange"
        @row-click="clubsRowClick"
        @sort-change="clubsActionsSetSorting"
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
          prop="membersCount"
          label="Members"
          width="150px"
          :sort-orders="clubsSortOrders"
        />

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
          <template
            slot="header"
            slot-scope="scope"
          >
            <div
              class="table-actions"
              :class="{ 'disabled': !clubsHasSelection }"
            >
              <el-dropdown
                trigger="click"
                @command="clubsDispatchActions"
              >
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{ handler: 'clubsDeleteMany' }">
                    <i class="el-icon-delete el-icon--left" /> Remove selected
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>

          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="clubsDispatchActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item :command="{ handler: 'edit', payload: scope.row }">
                  <i class="el-icon-edit el-icon--left"></i> Rediger
                </el-dropdown-item> -->
                <el-dropdown-item
                  :command="{
                    handler: 'clubsRemoveOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-delete el-icon--left" /> Remove club
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
        :page-size="clubsStatePageSize"
        :current-page="clubsStatePageCurrent"
        :page-sizes="[ 15, 30, 45, 60 ]"
        :total="clubsStateCount"
        @size-change="clubsActionsSetPageSize"
        @current-change="clubsActionsSetPageCurrent"
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
      clubsStateListIsLoading: "listIsLoading",
      clubsStateRemoveOneIsLoading: "removeOneIsLoading",
      clubsStateRemoveManyIsLoading: "removeManyIsLoading",
      clubsStateSortBy: "sortBy",
      clubsStatePageSize: "pageSize",
      clubsStatePageCurrent: "pageCurrent",
      clubsStateCount: "count",
      clubsStateList: "list"
    }),
    clubsHasSelection() {
      return this.clubsSelection.length > 0
    },
    clubsSearchFilter: {
      get() { return this.$store.state.clubs.searchFilterValue },
      set(search) { this.clubsMutationsSetSearchFilter(search) }
    },
    clubsIsLoading() {
      return (
        this.clubsStateListIsLoading ||
        this.clubsStateRemoveOneIsLoading ||
        this.clubsStateRemoveManyIsLoading
      )
    }
  },

  async created() {
    await this.clubsActionsList()
  },

  methods: {
    ...mapMutations("clubs", {
      clubsMutationsSetSearchFilter: "SET_SEARCH_FILTER"
    }),

    ...mapActions("clubs", {
      clubsActionsList: "list",
      clubsActionsRemoveOne: "removeOne",
      clubsActionsRemoveMany: "removeMany",
      clubsActionsSetSorting: "setSorting",
      clubsActionsSetPageSize: "setPageSize",
      clubsActionsSetPageCurrent: "setPageCurrent",
      clubsActionsSetSearchFilter: "setSearchFilter"
    }),

    clubsOpenCreateDialog() {
      this.$emit("clubsOpenCreateDialog")
    },

    clubsRowClick(club, column, e) {
      if(e.target.className.includes("table-button")) {
        return
      }
      this.$router.push(`/clubs/${club.id}`)
    },

    clubsSelectionChange(clubs) {
      this.clubsSelection = clubs
    },

    clubsDispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    async clubsRemoveOne(club) {
      try {
        await this.$confirm(
          `This will remove ${club.name} and its ${club.membersCount} members permanently. Continue?`,
          "Warning!", {
            confirmButtonText: "Yes, I am sure",
            cancelButtonText: "Cancel",
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )

        try {
          await this.clubsActionsRemoveOne(club)
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
      } catch(e) {}
    },

    async clubsDeleteMany() {
      this.$notify({
        type: "warning",
        title: "Oops!",
        message: "Denne funksjonen er ikke implementert enda"
      })

      // try {
      //   const count = this.clubsSelection.length
      //   await this.$confirm(
      //     `This will remove ${count} clubs and their members permanently. Continue?`,
      //     "Warning!", {
      //       confirmButtonText: "Yes, I am sure",
      //       cancelButtonText: "Cancel",
      //       customClass: "dangerous-confirmation",
      //       type: "warning"
      //     }
      //   )
      //
      //   try {
      //     await this.clubsActionsRemoveMany(this.clubsSelection)
      //     this.$notify({
      //       type: "success",
      //       title: "Success",
      //       message: `${count} clubs were removed from the database`
      //     })
      //   } catch(e) {
      //     this.$notify({
      //       type: "error",
      //       title: "Oops!",
      //       message: e.message
      //     })
      //   }
      // } catch(e) {}
    }
  }
}
</script>
