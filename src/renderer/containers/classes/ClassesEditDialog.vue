<style lang="stylus">
</style>

<template>
  <el-dialog
    title="Edit class"
    custom-class="edit-dialog"
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
          label="Number"
          prop="number"
        >
          <el-input
            v-model="form.number"
            placeholder="Enter a class number"
          />
        </el-form-item>

        <el-form-item
          label="Name"
          prop="name"
        >
          <el-input
            v-model="form.name"
            placeholder="Enter a name"
          />
        </el-form-item>

        <el-form-item
          label="Category"
          prop="category"
        >
          <el-select
            v-model="form.category"
            placeholder="Select a category"
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
          label="Condition"
          prop="condition"
        >
          <el-select
            v-model="form.condition"
            placeholder="Select a condition"
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
        Cancel
      </el-button>
      <el-button
        class="block"
        type="primary"
        @click="submit"
      >
        Save
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
    item: { type: Object, default: () => classesStub }
  },

  data: function() {
    return {
      visible: this.shown,
      form: classesStub,
      formRules: {
        number: { required: true, message: "Number is a required field" },
        name: { required: true, message: "Name is a required field" },
        category: { required: true, message: "Category is a required field" },
        condition: { required: true, message: "Condition is a required field" }
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
      this.form = { ...this.item }
    },

    submit() {
      this.$refs.form.validate(async (isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: "Please fill in all required fields before saving"
          })
        }

        try {
          await this.classesActionsEditOne(this.form)
          this.$notify({
            type: "success",
            title: "Great success",
            message: `${this.form.name} was successfully updated in the database`
          })
          this.clear()
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
      // this.form = { ...classesStub }
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
