<style lang="stylus">
</style>

<template>
  <div class="classes-list-table">
    <search-form
      v-model="classesSearchFilter"
      @submit="classesSetSearchFilterAsync"
      placeholder="Search for a class by name"
    />

    <div class="table-actions" :class="{ 'disabled': !classesHasSelection }">
      <el-dropdown trigger="click" @command="classesTableDispatchActions">
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

    <div v-loading="classesListIsLoading || classesRemoveIsLoading">
      <el-table
        :data="classesList"
        @selection-change="classesSelectionChange"
        @row-click="classesRowClick"
        @sort-change="classesSetSortingAsync"
        :sort-by="classesSortBy"
        row-key="_id"
        class="table-clickable"
        empty-text
      >
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column prop="number" label="Number" width="130" sortable="custom" :sort-orders="classesSortOrders"></el-table-column>
        <el-table-column prop="name" label="Name" sortable="custom" :sort-orders="classesSortOrders"></el-table-column>
        <el-table-column prop="category" label="Category" sortable="custom" :sort-orders="classesSortOrders"></el-table-column>
        <el-table-column width="40">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="classesTableRowDispatchActions">
              <span class="el-dropdown-link">
                <i class="table-button el-icon-setting"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item :command="{ handler: 'edit', payload: scope.row }">
                  <i class="el-icon-edit el-icon--left"></i> Rediger
                </el-dropdown-item> -->
                <el-dropdown-item :command="{ handler: 'classesDelete', payload: scope.row }">
                  <i class="el-icon-delete el-icon--left"></i> Slett
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <template slot="empty">
          No classes yet.
          <el-button type="text" @click="classesOpenCreateDialog">
            Create new?
          </el-button>
        </template>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        @size-change="classesSetPageSizeAsync"
        @current-change="classesSetPageCurrentAsync"
        :page-size="classesPageSize"
        :current-page="classesPageCurrent"
        :page-sizes="[ 15, 30, 45, 60 ]"
        :total="classesCount"
      ></el-pagination>
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

  async created() {
    await this.classesListAsync()
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
