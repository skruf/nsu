<i18n>
{
  "en": {
    "title": "Edit event category",
    "formItem1Label": "Name",
    "formItem1Placeholder": "Enter a name",
    "formItem1Error": "Name is a required field",
    "saveSuccess": "%{category} was successfully updated to the database"
  },
  "no": {
    "title": "Rediger stevne kategori",
    "formItem1Label": "Navn",
    "formItem1Placeholder": "Skriv inn navn",
    "formItem1Error": "Navn er et påkrevd felt",
    "saveSuccess": "%{category} ble oppdatert i databasen"
  }
}
</i18n>

<template>
  <el-dialog
    custom-class="edit-dialog"
    :title="$t('title')"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <div
      v-loading="isLoading"
      class="dialog_content"
    >
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="formRules"
      >
        <el-form-item
          prop="name"
          :label="$t('formItem1Label')"
        >
          <el-input
            v-model="form.name"
            :placeholder="$t('formItem1Placeholder')"
          />
        </el-form-item>
      </el-form>
    </div>

    <template slot="footer">
      <el-button
        class="block"
        type="text"
        @click="close"
      >
        {{ $t("cancel") }}
      </el-button>
      <el-button
        class="block"
        type="primary"
        @click="save"
      >
        {{ $t("save") }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
// import { db } from "~/db"
import { eventsCategoriesStub } from "~/stubs"

export default {
  name: "EventsCategoriesCreateDialog",

  props: {
    shown: { type: Boolean, default: false },
    category: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...eventsCategoriesStub },
      formRules: {
        title: { required: true, message: this.$t("formItem1Error") }
      },
      isLoading: false
    }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    open() {
      this.form = { ...this.category.toJSON() }
    },

    save() {
      this.$refs.form.validate(async (isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: this.$t("validationError")
          })
        }

        try {
          await this.category.atomicSet("name", this.form.name)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("saveSuccess", {
              category: this.form.name
            })
          })
          this.close()
          this.clear()
        } catch(e) {
          this.$notify({
            type: "error",
            title: "Oops!",
            message: e.message
          })
        }
      })
    },

    clear() {
      this.form = { ...eventsCategoriesStub }
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
