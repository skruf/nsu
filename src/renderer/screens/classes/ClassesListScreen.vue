<style lang="stylus">
</style>

<template>
  <el-container
    id="classes-list-screen"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[
          { to: '/classes', label: 'Classes' },
          { to: '', label: 'All' }
        ]"
      />

      <div class="page-titles">
        <h1 class="h1">
          Classes
        </h1>
      </div>
    </el-header>

    <el-main class="content">
      <classes-list-table
        @classesOpenCreateDialog="classesOpenCreateDialog"
        @classesOpenEditDialog="classesOpenEditDialog"
      />
    </el-main>

    <el-footer height="auto">
      <el-button
        type="primary"
        @click="classesOpenCreateDialog"
      >
        <i class="el-icon-plus el-icon--left" /> Create class
      </el-button>
    </el-footer>

    <classes-create-dialog
      :shown.sync="classesShowCreateDialog"
    />

    <classes-edit-dialog
      :shown.sync="classesEditShowDialog"
      :weapon-class="classesEditItem"
    />
  </el-container>
</template>

<script>
import BreadcrumbBar from "@/components/BreadcrumbBar"
import ClassesListTable from "@/containers/classes/ClassesListTable"
import ClassesCreateDialog from "@/containers/classes/ClassesCreateDialog"
import ClassesEditDialog from "@/containers/classes/ClassesEditDialog"

export default {
  name: "ClassesListScreen",

  components: {
    BreadcrumbBar,
    ClassesListTable,
    ClassesCreateDialog,
    ClassesEditDialog
  },

  data: () => ({
    classesShowCreateDialog: false,
    classesEditShowDialog: false,
    classesEditItem: {}
  }),

  methods: {
    classesOpenCreateDialog() {
      this.classesShowCreateDialog = true
    },
    classesOpenEditDialog(weaponClass) {
      this.classesEditShowDialog = true
      this.classesEditItem = weaponClass
    }
  }
}
</script>
