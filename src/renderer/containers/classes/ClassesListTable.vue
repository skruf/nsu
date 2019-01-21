<style lang="stylus">
</style>

<template>
  <div class="classes-list-table">
    <search-form
      v-model="classesSearchFilter"
      placeholder="Search for a class by name"
      @submit="classesSetSearchFilterAsync"
    />

    <div v-loading="classesListIsLoading || classesRemoveIsLoading">
      <el-table
        :data="classesList"
        :sort-by="classesSortBy"
        row-key="_id"
        class="table-clickable"
        empty-text
        @selection-change="classesSelectionChange"
        @row-click="classesRowClick"
        @sort-change="classesSetSortingAsync"
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
          prop="category"
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
                @command="classesTableDispatchActions"
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
              @command="classesTableRowDispatchActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item :command="{ handler: 'edit', payload: scope.row }">
                  <i class="el-icon-edit el-icon--left"></i> Rediger
                </el-dropdown-item> -->
                <el-dropdown-item :command="{ handler: 'classesDelete', payload: scope.row }">
                  <i class="el-icon-delete el-icon--left" /> Slett
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
        :page-size="classesPageSize"
        :current-page="classesPageCurrent"
        :page-sizes="[ 15, 30, 45, 60 ]"
        :total="classesCount"
        @size-change="classesSetPageSizeAsync"
        @current-change="classesSetPageCurrentAsync"
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
      classesListIsLoading: "listIsLoading",
      classesRemoveIsLoading: "removeIsLoading",
      classesSortBy: "sortBy",
      classesPageSize: "pageSize",
      classesPageCurrent: "pageCurrent",
      classesCount: "count",
      classesList: "list"
    }),
    classesHasSelection() {
      return this.classesSelection.length > 0
    },
    classesSearchFilter: {
      get() { return this.$store.state.classes.searchFilterValue },
      set(search) { this.classesSetSearchFilter(search) }
    }
  },

  async created() {
    await this.classesListAsync()
  },

  methods: {
    ...mapMutations("classes", {
      classesSetSearchFilter: "SET_SEARCH_FILTER"
    }),

    ...mapActions("classes", {
      classesListAsync: "listAsync",
      classesRemoveAsync: "removeAsync",
      classesSetSortingAsync: "setSortingAsync",
      classesSetPageSizeAsync: "setPageSizeAsync",
      classesSetPageCurrentAsync: "setPageCurrentAsync",
      classesSetSearchFilterAsync: "setSearchFilterAsync"
    }),

    classesOpenCreateDialog() {
      this.$emit("classesOpenCreateDialog")
    },

    classesTableRowDispatchActions({ handler, payload }) {
      switch(handler) {
        case "classesDelete":
          this.classesDeleteAsync(payload)
          break
      }
    },

    async classesDeleteAsync(weaponClass) {
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
        await this.classesRemoveAsync(weaponClass)
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
    },

    classesRowClick(weaponClass, e) {
      if(e.target.className.includes("table-button")) {
        return
      }
      this.$router.push(`/classes/${weaponClass._id}`)
    },

    classesSelectionChange(classes) {
      this.classesSelection = classes
    },

    classesTableDispatchActions({ handler, payload }) {}
  }
}
</script>
