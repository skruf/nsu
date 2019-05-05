<i18n>
{
  "en": {
    "breadcrumb1Label": "Classes",
    "breadcrumb2Label": "All",
    "title": "Classes",
    "classesOpenCreateDialogButton": "Create class"
  },
  "no": {
    "breadcrumb1Label": "Klasser",
    "breadcrumb2Label": "Alle",
    "title": "Klasser",
    "classesOpenCreateDialogButton": "Opprett klasse"
  }
}
</i18n>

<template>
  <el-container
    id="classes-list-screen"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[{
          to: '/classes', label: $t('breadcrumb1Label'),
        }, {
          to: '', label: $t('breadcrumb2Label')
        }]"
      />

      <div class="page-titles">
        <h1 class="h1">
          {{ $t('title') }}
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
        <i class="el-icon-plus el-icon--left" /> {{ $t("classesOpenCreateDialogButton") }}
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
import ClassesListTable from "@/containers/ClassesListTable"
import ClassesCreateDialog from "@/containers/ClassesCreateDialog"
import ClassesEditDialog from "@/containers/ClassesEditDialog"

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
