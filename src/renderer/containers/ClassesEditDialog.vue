<i18n>
{
  "en": {
    "title": "Edit class",
    "formItem1Label": "Number",
    "formItem1Placeholder": "Enter a class number",
    "formItem1Error": "Number is a required field",
    "formItem2Label": "Name",
    "formItem2Placeholder": "Enter a name",
    "formItem2Error": "Name is a required field",
    "formItem3Label": "Category",
    "formItem3Placeholder": "Select a category",
    "formItem3Error": "Category is a required field",
    "formItem4Label": "Condition",
    "formItem4Placeholder": "Select a condition",
    "formItem4Error": "Condition is a required field",
    "classesActionsEditOneSuccess": "%{weaponClass} was successfully updated in the database"
  },
  "no": {
    "title": "Rediger klasse",
    "formItem1Label": "Nummer",
    "formItem1Placeholder": "Skriv et nummer",
    "formItem1Error": "Nummer er et påkrevd felt",
    "formItem2Label": "Navn",
    "formItem2Placeholder": "Skriv et navn",
    "formItem2Error": "Navn er et påkrevd felt",
    "formItem3Label": "Kategori",
    "formItem3Placeholder": "Velg en kategori",
    "formItem3Error": "Kategori er et påkrevd felt",
    "formItem4Label": "Tilstand",
    "formItem4Placeholder": "Velg en tilstand",
    "formItem4Error": "Tilstand er et påkrevd felt",
    "classesActionsEditOneSuccess": "%{weaponClass} ble redigert i databasen"
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
      v-loading="classesStateEditOneIsLoading"
      class="dialog_content"
    >
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="formRules"
      >
        <el-form-item
          prop="number"
          :label="$t('formItem1Label')"
        >
          <el-input
            v-model="form.number"
            :placeholder="$t('formItem1Placeholder')"
          />
        </el-form-item>

        <el-form-item
          prop="name"
          :label="$t('formItem2Label')"
        >
          <el-input
            v-model="form.name"
            :placeholder="$t('formItem2Placeholder')"
          />
        </el-form-item>

        <el-form-item
          prop="category"
          :label="$t('formItem3Label')"
        >
          <el-select
            v-model="form.category"
            :placeholder="$t('formItem3Placeholder')"
          >
            <el-option
              v-for="(category, index) in classesStateCategories"
              :key="index"
              :label="category"
              :value="category"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          prop="condition"
          :label="$t('formItem4Label')"
        >
          <el-select
            v-model="form.condition"
            :placeholder="$t('formItem4Placeholder')"
          >
            <el-option
              v-for="(condition, index) in classesStateConditions"
              :key="index"
              :label="condition"
              :value="condition"
            />
          </el-select>
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
        @click="submit"
      >
        {{ $t("save") }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { classesStub } from "@/stubs"

export default {
  name: "ClassesEditDialog",

  props: {
    shown: { type: Boolean, default: false },
    weaponClass: { type: Object, default: () => classesStub }
  },

  data: function() {
    return {
      visible: this.shown,
      form: classesStub,
      formRules: {
        number: { required: true, message: this.$t("formItem1Error") },
        name: { required: true, message: this.$t("formItem2Error") },
        category: { required: true, message: this.$t("formItem3Error") },
        condition: { required: true, message: this.$t("formItem4Error") }
      }
    }
  },

  computed: mapState("classes", {
    classesStateEditOneIsLoading: "editOneIsLoading",
    classesStateCategories: "categories",
    classesStateConditions: "conditions"
  }),

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    ...mapActions("classes", {
      classesActionsEditOne: "editOne"
    }),

    open() {
      this.form = { ...this.weaponClass }
    },

    submit() {
      this.$refs.form.validate(async (isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: this.$t("validationError")
          })
        }

        try {
          await this.classesActionsEditOne(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("classesActionsEditOneSuccess", {
              weaponClass: this.form.name
            })
          })
          this.close()
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
      this.form = { ...classesStub }
    },

    close() {
      this.clear()
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
