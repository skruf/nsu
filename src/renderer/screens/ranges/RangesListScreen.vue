<i18n>
{
  "en": {
    "breadcrumb1Label": "Ranges",
    "breadcrumb2Label": "All",
    "title": "Ranges",
    "rangesOpenCreateDialogButton": "Create range"
  },
  "no": {
    "breadcrumb1Label": "Skyttebaner",
    "breadcrumb2Label": "Alle",
    "title": "Skyttebaner",
    "rangesOpenCreateDialogButton": "Opprett skyttebane"
  }
}
</i18n>

<template>
  <el-container
    id="ranges-list-screen"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[
          { to: '/ranges', label: $t('breadcrumb1Label') },
          { to: '', label: $t('breadcrumb2Label') }
        ]"
      />

      <div class="page-titles">
        <h1 class="h1">
          {{ $t('title') }}
        </h1>
      </div>
    </el-header>

    <el-main class="content">
      <ranges-list-table
        @rangesOpenCreateDialog="rangesOpenCreateDialog"
        @rangesOpenEditDialog="rangesOpenEditDialog"
      />
    </el-main>

    <el-footer height="auto">
      <el-button
        type="primary"
        @click="rangesOpenCreateDialog"
      >
        <i class="el-icon-plus el-icon--left" /> {{ $t("rangesOpenCreateDialogButton") }}
      </el-button>
    </el-footer>

    <ranges-create-dialog
      :shown.sync="rangesShowCreateDialog"
    />

    <ranges-edit-dialog
      :shown.sync="rangesEditShowDialog"
      :item="rangesEditItem"
    />
  </el-container>
</template>

<script>
import BreadcrumbBar from "@/components/BreadcrumbBar"
import RangesListTable from "@/containers/RangesListTable"
import RangesCreateDialog from "@/containers/RangesCreateDialog"
import RangesEditDialog from "@/containers/RangesEditDialog"

export default {
  name: "RangesListScreen",

  components: {
    BreadcrumbBar,
    RangesListTable,
    RangesCreateDialog,
    RangesEditDialog
  },

  data: () => ({
    rangesShowCreateDialog: false,
    rangesEditShowDialog: false,
    rangesEditItem: {}
  }),

  methods: {
    rangesOpenCreateDialog() {
      this.rangesShowCreateDialog = true
    },
    rangesOpenEditDialog(item) {
      this.rangesEditShowDialog = true
      this.rangesEditItem = item
    }
  }
}
</script>
