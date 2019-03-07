<style lang="stylus">
</style>

<template>
  <div class="classes-list-table">
    <search-form
      v-model="classesSearchFilter"
      placeholder="Search for a class by name"
      @submit="classesActionsSetSearchFilter"
    />

    <div v-loading="classesIsLoading">
      <el-table
        :data="classesStateList"
        :sort-by="classesStateSortBy"
        row-key="id"
        class="table-clickable"
        empty-text
        @selection-change="classesSelectionChange"
        @row-click="classesRowClick"
        @sort-change="classesActionsSetSorting"
      >
        <el-table-column
          type="selection"
          width="40"
        />

        <el-table-column
          prop="name"
          label="Name/Number"
          sortable="custom"
          :sort-orders="classesSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.name }}
            </h6>
            <small class="small">
              {{ scope.row.number }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="category"
          label="Category/Condition"
          sortable="custom"
          :sort-orders="classesSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.category }}
            </h6>
            <small class="small">
              {{ scope.row.condition }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="distance"
          label="Distance/Position"
          sortable="custom"
          :sort-orders="classesSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.distance }}
            </h6>
            <small class="small">
              {{ scope.row.position }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          width="50"
          align="right"
        >
          <template slot="header">
            <div
              class="table-actions"
              :class="{ 'disabled': !classesHasSelection }"
            >
              <el-dropdown
                trigger="click"
                @command="classesDispatchActions"
              >
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="{
                      handler: 'classesRemoveMany'
                    }"
                  >
                    <i class="el-icon-delete el-icon--left" /> Remove selected
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>

          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="classesDispatchActions"
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
                    handler: 'classesRemoveOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-delete el-icon--left" /> Remove class
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          No classes yet.
          <el-button
            type="text"
            @click="classesOpenCreateDialog"
          >
            Create new?
          </el-button>
        </template>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-size="classesStatePageSize"
        :current-page="classesStatePageCurrent"
        :page-sizes="[ 15, 30, 45, 60 ]"
        :total="classesStateCount"
        @size-change="classesActionsSetPageSize"
        @current-change="classesActionsSetPageCurrent"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex"
import SearchForm from "@/components/SearchForm"

export default {
  name: "ClassesListTable",

  components: {
    SearchForm
  },

  data: () => ({
    classesSelection: [],
    classesSortOrders: [ "descending", "ascending" ]
  }),

  computed: {
    ...mapState("classes", {
      classesStateListIsLoading: "listIsLoading",
      classesStateRemoveOneIsLoading: "removeOneIsLoading",
      classesStateRemoveManyIsLoading: "removeManyIsLoading",
      classesStateSortBy: "sortBy",
      classesStatePageSize: "pageSize",
      classesStatePageCurrent: "pageCurrent",
      classesStateCount: "count",
      classesStateList: "list"
    }),
    classesHasSelection() {
      return this.classesSelection.length > 0
    },
    classesSearchFilter: {
      get() { return this.$store.state.classes.searchFilterValue },
      set(search) { this.classesMutationsSetSearchFilter(search) }
    },
    classesIsLoading() {
      return (
        this.classesStateListIsLoading ||
        this.classesStateRemoveOneIsLoading ||
        this.classesStateRemoveManyIsLoading
      )
    }
  },

  async created() {
    await this.classesActionsList()
  },

  methods: {
    ...mapMutations("classes", {
      classesMutationsSetSearchFilter: "SET_SEARCH_FILTER"
    }),

    ...mapActions("classes", {
      classesActionsList: "list",
      classesActionsRemoveOne: "removeOne",
      classesActionsRemoveMany: "removeMany",
      classesActionsSetSorting: "setSorting",
      classesActionsSetPageSize: "setPageSize",
      classesActionsSetPageCurrent: "setPageCurrent",
      classesActionsSetSearchFilter: "setSearchFilter"
    }),

    classesOpenCreateDialog() {
      this.$emit("classesOpenCreateDialog")
    },

    classesRowClick(weaponClass, column, e) {
      if(e.target.className.includes("table-button")) {
        return
      }
      this.$router.push(`/classes/${weaponClass.id}`)
    },

    classesSelectionChange(classes) {
      this.classesSelection = classes
    },

    classesDispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    async classesRemoveOne(weaponClass) {
      try {
        await this.$confirm(
          `This will remove ${weaponClass.name} permanently. Continue?`,
          "Warning!", {
            confirmButtonText: "Yes, I am sure",
            cancelButtonText: "Cancel",
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )

        try {
          await this.classesActionsRemoveOne(weaponClass)
          this.$notify({
            type: "success",
            title: "Success",
            message: `${weaponClass.name} was removed from the database`
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

    async classesRemoveMany() {
      try {
        const count = this.classesSelection.length
        await this.$confirm(
          `This will remove ${count} classes permanently. Continue?`,
          "Warning!", {
            confirmButtonText: "Yes, I am sure",
            cancelButtonText: "Cancel",
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )

        try {
          await this.classesActionsRemoveMany(this.classesSelection)
          this.$notify({
            type: "success",
            title: "Success",
            message: `${count} classes were removed from the database`
          })
        } catch(e) {
          this.$notify({
            type: "error",
            title: "Oops!",
            message: e.message
          })
        }
      } catch(e) {}
    }
  }
}
</script>
