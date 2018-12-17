<style lang="stylus">
</style>

<template>
  <el-container class="screen" id="classes-list-screen">
    <el-header height="auto">
      <h1 class="h1 text-4xl">Classes</h1>
    </el-header>

    <div class="breadcrumb-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/classes' }">Classes</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/classes' }">All</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-main>
      <classes-list-table
        @classesOpenCreateDialog="classesOpenCreateDialog"
      />

      <div class="page-actions">
        <el-button @click="classesOpenCreateDialog" type="primary">
          <i class="el-icon-plus el-icon--left"></i> Create class
        </el-button>
      </div>
    </el-main>

    <classes-create-dialog
      :shown.sync="classesShowCreateDialog"
    />
  </el-container>
</template>

<script>
import ClassesListTable from "@/containers/classes/ClassesListTable"
import ClassesCreateDialog from "@/containers/classes/ClassesCreateDialog"

export default {
  name: "ClassesListScreen",

  components: {
    ClassesListTable,
    ClassesCreateDialog
  },

  data: () => ({
    classesShowCreateDialog: false
  }),

  methods: {
    classesOpenCreateDialog() {
      this.classesShowCreateDialog = true
    }
  }
}
</script>
