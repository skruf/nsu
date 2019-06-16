<i18n>
{
  "en": {
    "breadcrumb1Label": "Events",
    "breadcrumb2Label": "Categories",
    "title": "Events Categories",
    "openCreateDialogButton": "Create event category"
  },
  "no": {
    "breadcrumb1Label": "Stevner",
    "breadcrumb2Label": "Kategorier",
    "title": "Stevne kategorier",
    "openCreateDialogButton": "Opprett stevne kategori"
  }
}
</i18n>

<template>
  <el-container
    id="events-categories-list-screen"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[{
          to: '/events', label: $t('breadcrumb1Label'),
        }, {
          to: '/events/categories', label: $t('breadcrumb2Label')
        }]"
      />

      <div class="page-titles">
        <h1 class="h1">
          {{ $t('title') }}
        </h1>
      </div>
    </el-header>

    <el-main class="content">
      <events-categories-list-table
        @openCreateDialog="openCreateDialog"
        @openEditDialog="openEditDialog"
      />
    </el-main>

    <el-footer height="auto">
      <el-button
        type="primary"
        @click="openCreateDialog"
      >
        <i class="el-icon-plus el-icon--left" /> {{ $t("openCreateDialogButton") }}
      </el-button>
    </el-footer>

    <events-categories-create-dialog
      :shown.sync="showCreateDialog"
    />

    <events-categories-edit-dialog
      :shown.sync="editShowDialog"
      :category="editItem"
    />
  </el-container>
</template>

<script>
import BreadcrumbBar from "~/components/BreadcrumbBar"
import EventsCategoriesListTable from "~/containers/EventsCategoriesListTable"
import EventsCategoriesCreateDialog from "~/containers/EventsCategoriesCreateDialog"
import EventsCategoriesEditDialog from "~/containers/EventsCategoriesEditDialog"

export default {
  name: "EventsCategoriesListScreen",

  components: {
    BreadcrumbBar,
    EventsCategoriesListTable,
    EventsCategoriesCreateDialog,
    EventsCategoriesEditDialog
  },

  data: () => ({
    showCreateDialog: false,
    editShowDialog: false,
    editItem: {}
  }),

  methods: {
    openCreateDialog() {
      this.showCreateDialog = true
    },
    openEditDialog(category) {
      this.editShowDialog = true
      this.editItem = category
    }
  }
}
</script>
