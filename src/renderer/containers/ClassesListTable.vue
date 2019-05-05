<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for a class by name",
    "column1Label": "Number",
    "column2Label": "Name",
    "column3Label": "Category",
    "column4Label": "Condition",
    "removeSelected": "Remove selected",
    "editClass": "Edit class",
    "removeClass": "Remove class",
    "tablePlaceholderText": "No classes yet.",
    "tablePlaceholderButton": "Create new?",
    "classesRemoveOneConfirmation": "This will remove %{weaponClass} and participants who used this class permanently. Continue?",
    "classesActionsRemoveOneSuccess": "%{weaponClass} was removed from the database",
    "classesRemoveManyConfirmation": "This will remove %{classes} classes and participants who used these classes permanently. Continue?",
    "classesActionsRemoveManySuccess": "%{classes} classes were removed from the database"
  },
  "no": {
    "searchFormPlaceholder": "Søk etter klasser med navn",
    "column1Label": "Nummer",
    "column2Label": "Navn",
    "column3Label": "Kategori",
    "column4Label": "Tilstand",
    "removeSelected": "Slett valgte",
    "editClass": "Rediger klasse",
    "removeClass": "Slett klasse",
    "tablePlaceholderText": "Ingen klasser enda.",
    "tablePlaceholderButton": "Opprett ny?",
    "classesRemoveOneConfirmation": "Dette vil fjerne %{weaponClass} og deltakere som brukte denne klassen permanent. Fortsett?",
    "classesActionsRemoveOneSuccess": "%{weaponClass} ble fjernet fra databasen",
    "classesRemoveManyConfirmation": "Dette vil fjerne %{classes} klasser og deltakere som brukte denne klassen permanent. Fortsett?",
    "classesActionsRemoveManySuccess": "%{classes} klasser ble fjernet fra databasen"
  }
}
</i18n>

<template>
  <div class="classes-list-table">
    <search-form
      v-model="classesSearchFilter"
      class="mb-5"
      :placeholder="$t('searchFormPlaceholder')"
      @submit="classesActionsSetSearchFilter"
    />

    <div v-loading="classesIsLoading">
      <el-table
        empty-text
        row-key="id"
        class="no-hover"
        :data="classesStateList"
        :sort-by="classesStateSortBy"
        @selection-change="classesSelectionChange"
        @sort-change="classesActionsSetSorting"
      >
        <el-table-column
          type="selection"
          width="40"
        />

        <el-table-column
          prop="number"
          sortable="custom"
          width="110px"
          :label="$t('column1Label')"
          :sort-orders="classesSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.number }}
            </h6>
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          sortable="custom"
          :label="$t('column2Label')"
          :sort-orders="classesSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.name }}
            </h6>
          </template>
        </el-table-column>

        <el-table-column
          prop="category"
          sortable="custom"
          :label="$t('column3Label')"
          :sort-orders="classesSortOrders"
        >
          <template slot-scope="scope">
            <small class="small">
              {{ scope.row.category }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="condition"
          sortable="custom"
          :label="$t('column4Label')"
          :sort-orders="classesSortOrders"
        >
          <template slot-scope="scope">
            <small class="small">
              {{ scope.row.condition }}
            </small>
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
                    class="dropdown-menu-delete"
                    :command="{
                      handler: 'classesRemoveMany'
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
              @command="classesDispatchActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{
                    handler: 'classesOpenEditDialog',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-edit el-icon--left" /> {{ $t("editClass") }}
                </el-dropdown-item>
                <el-dropdown-item
                  divided
                  class="dropdown-menu-delete"
                  :command="{
                    handler: 'classesRemoveOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-delete el-icon--left" /> {{ $t("removeClass") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          {{ $t("tablePlaceholderText") }}
          <el-button
            type="text"
            @click="classesOpenCreateDialog"
          >
            {{ $t("tablePlaceholderButton") }}
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

    classesOpenEditDialog(weaponClass) {
      this.$emit("classesOpenEditDialog", weaponClass)
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
          this.$t("classesRemoveOneConfirmation", {
            weaponClass: weaponClass.name
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
        await this.classesActionsRemoveOne(weaponClass)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("classesActionsRemoveOneSuccess", {
            weaponClass: weaponClass.name
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

    async classesRemoveMany() {
      const count = this.classesSelection.length

      try {
        await this.$confirm(
          this.$t("classesRemoveManyConfirmation", {
            classes: count
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
        await this.classesActionsRemoveMany(this.classesSelection)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("classesActionsRemoveManySuccess", {
            classes: count
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
