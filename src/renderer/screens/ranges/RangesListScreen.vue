<style lang="stylus">
</style>

<template>
  <el-container
    id="ranges-list-screen"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[
          { to: '/ranges', label: 'Ranges' },
          { to: '', label: 'All' }
        ]"
      />

      <div class="page-titles">
        <h1 class="h1">
          Ranges
        </h1>
      </div>
    </el-header>

    <el-main class="content">
      <ranges-list-table
        @rangesOpenCreateDialog="rangesOpenCreateDialog"
      />
    </el-main>

    <el-footer height="auto">
      <el-button
        type="primary"
        @click="rangesOpenCreateDialog"
      >
        <i class="el-icon-plus el-icon--left" /> Create range
      </el-button>
    </el-footer>

    <ranges-create-dialog
      :shown.sync="rangesShowCreateDialog"
    />
  </el-container>
</template>

<script>
import BreadcrumbBar from "@/components/BreadcrumbBar"
import RangesListTable from "@/containers/ranges/RangesListTable"
import RangesCreateDialog from "@/containers/ranges/RangesCreateDialog"

export default {
  name: "RangesListScreen",

  components: {
    BreadcrumbBar,
    RangesListTable,
    RangesCreateDialog
  },

  data: () => ({
    rangesShowCreateDialog: false
  }),

  methods: {
    rangesOpenCreateDialog() {
      this.rangesShowCreateDialog = true
    }
  }
}
</script>
