<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for categories",
    "column1Label": "Name",
    "removeSelected": "Remove selected",
    "edit": "Edit category",
    "remove": "Remove category",
    "tablePlaceholderText": "No categories yet.",
    "tablePlaceholderButton": "Create category?",
    "removeOneConfirmation": "This will remove %{category} and all its events permanently. Continue?",
    "removeOneSuccess": "%{category} was removed",
    "removeManyConfirmation": "This will remove %{categories} and all their events permanently. Continue?",
    "removeManySuccess": "%{categories} was removed"
  },
  "no": {
    "searchFormPlaceholder": "Søk etter kategorier",
    "column1Label": "Navn",
    "removeSelected": "Slett valgte",
    "edit": "Rediger kategori",
    "remove": "Slett kategori",
    "tablePlaceholderText": "Ingen kategorier enda",
    "tablePlaceholderButton": "Legg til kategori?",
    "removeOneConfirmation": "Dette vil fjerne %{category} og alle stevner i denne kategorien permanent. Fortsett?",
    "removeOneSuccess": "%{category} ble fjernet",
    "removeManyConfirmation": "Dette vil fjerne %{categories} og alle stevner i disse kategoriene permanent. Fortsett?",
    "removeManySuccess": "%{categories} ble fjernet"  }
}
</i18n>

<template>
  <div class="events-categories-list-table">
    <search-form
      v-model="searchFilter"
      class="mb-5"
      :placeholder="$t('searchFormPlaceholder')"
      @submit="submitSearchFilter"
    />

    <div v-loading="isLoading">
      <el-table
        :data="tableData"
        :default-sort="{ prop: tableSortField, order: tableSortOrder }"
        row-key="id"
        class="table-clickable"
        empty-text
        @selection-change="tableSelectionChange"
        @row-click="tableRowClick"
        @sort-change="tableSortChange"
      >
        <el-table-column
          type="selection"
          width="40"
        />

        <el-table-column
          prop="name"
          sortable="custom"
          label="Navn"
          :sort-orders="tableSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.name }}
            </h6>
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
              :class="{ 'disabled': !tableHasSelection }"
            >
              <el-dropdown
                trigger="click"
                @command="dispatchTableActions"
              >
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    class="dropdown-menu-delete"
                    :command="{
                      handler: 'removeMany'
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
              @command="dispatchTableActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{
                    handler: 'openEditDialog',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-edit el-icon--left" />
                  {{ $t("edit") }}
                </el-dropdown-item>

                <el-dropdown-item
                  divided
                  class="dropdown-menu-delete"
                  :command="{
                    handler: 'removeOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-delete el-icon--left" />
                  {{ $t("remove") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          {{ $t("tablePlaceholderText") }}
          <el-button
            type="text"
            @click="openCreateDialog"
          >
            {{ $t("tablePlaceholderButton") }}
          </el-button>
        </template>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-size="pageSize"
        :current-page="pageCurrent"
        :page-sizes="[ 15, 30, 45, 60, pageTotal ]"
        :total="pageTotal"
        @size-change="pageSizeChange"
        @current-change="pageCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { db } from "~/db"
import SearchForm from "~/components/SearchForm"

export default Vue.extend({
  name: "EvetsnCategoriesListTable",

  components: {
    SearchForm
  },

  data: () => ({
    tableData: [],
    tableSelection: [],
    tableSortOrders: [ "descending", "ascending" ],
    tableSortField: "createdAt",
    tableSortOrder: "descending",
    pageTotal: 0,
    pageSize: 15,
    pageCurrent: 1,
    searchFilter: "",
    isLoading: false,
    sub: null
  }),

  computed: {
    tableHasSelection() {
      return this.tableSelection.length > 0
    }
  },

  created() {
    const observer = async (categories) => {
      this.isLoading = true
      this.pageTotal = await db.events_categories.count()
      this.tableData = categories
      this.isLoading = false
    }

    const errorHandler = (e) => {
      this.$notify({ type: "error", title: "Oops!", message: e.message })
    }

    this.sub = db.events_categories
      .find()
      .$.subscribe(observer, errorHandler)
  },

  beforeDestroy() {
    if(this.sub) this.sub.unsubscribe()
  },

  methods: {
    async submitSearchFilter(value) {
      if(!value) {
        this.refresh()
        return
      }

      this.isLoading = true

      const regexp = new RegExp(`${value}`, "i")
      const categories = await db.events_categories
        .find({ name: { $regex: regexp } })
        .exec()

      this.sub.next(categories)
    },

    async refresh() {
      this.isLoading = true
      const sort = `${this.tableSortOrder === "descending" ? '-' : ''}${this.tableSortField}`
      const skip = (this.pageCurrent - 1) * this.pageSize

      const res = await db.events_categories
        .find()
        .sort(sort)
        .skip(skip)
        .limit(this.pageSize)
        .exec()

      this.sub.next(res)
      this.isLoading = false
    },

    pageCurrentChange(page) {
      this.pageCurrent = page
      this.refresh()
    },

    pageSizeChange(size) {
      this.pageCurrent = 1
      this.pageSize = size
      this.refresh()
    },

    tableSortChange({ prop, order }) {
      this.tableSortField = prop
      this.tableSortOrder = order
      this.refresh()
    },

    tableSelectionChange(selection) {
      this.tableSelection = selection
    },

    tableRowClick(category, column, e) {
      if(!e.target.className.includes("table-button")) {
        this.openEditDialog(category)
      }
    },

    dispatchTableActions({ handler, payload }) {
      this[handler](payload)
    },

    openCreateDialog() {
      this.$emit("openCreateDialog")
    },

    openEditDialog(category) {
      this.$emit("openEditDialog", category)
    },

    async removeOne(category) {
      try {
        await this.$confirm(
          this.$t("removeOneConfirmation", {
            category: category.name
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
        await category.remove()
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("removeOneSuccess", {
            category: category.name
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

    async removeMany() {
      const count = this.tableSelection.length

      try {
        await this.$confirm(
          this.$t("removeManyConfirmation", {
            categories: count
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
        await Promise.all(
          this.tableSelection.map((category) => category.remove())
        )
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("removeManySuccess", {
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
})
</script>
