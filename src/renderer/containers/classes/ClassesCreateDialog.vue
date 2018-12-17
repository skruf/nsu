<style lang="stylus">
</style>

<template>
  <el-dialog
    title="Create a new class"
    custom-class="create-dialog"
    :visible.sync="visible"
    @close="close"
  >
    <div v-loading="classesCreateIsLoading">
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="formRules"
      >
        <el-form-item label="Number" prop="number">
          <el-input placeholder="Enter a class number" v-model="form.number" />
        </el-form-item>

        <el-form-item label="Name" prop="name">
          <el-input placeholder="Enter a name" v-model="form.name" />
        </el-form-item>

        <el-form-item label="Category" prop="category">
          <el-select v-model="form.category" placeholder="Select a category">
            <el-option
              v-for="(category, index) in classesCategories"
              :key="index"
              :label="category"
              :value="category"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Condition" prop="condition">
          <el-select v-model="form.condition" placeholder="Select a condition">
            <el-option
              v-for="(condition, index) in classesConditions"
              :key="index"
              :label="condition"
              :value="condition"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Target" prop="target">
          <el-input placeholder="Enter target rules" v-model="form.target" />
        </el-form-item>

        <el-form-item label="Position" prop="position">
          <el-input placeholder="Enter position rules" v-model="form.position" />
        </el-form-item>

        <el-form-item label="Distance" prop="distance">
          <el-input placeholder="Enter distance rules" v-model="form.distance" />
        </el-form-item>

        <el-form-item label="Type" prop="type">
          <el-input placeholder="Enter a type" v-model="form.type" />
        </el-form-item>

        <el-form-item label="Sight" prop="sight">
          <el-input placeholder="Enter sight rules" v-model="form.sight" />
        </el-form-item>

        <el-form-item label="Trigger" prop="trigger">
          <el-input placeholder="Enter trigger rules" v-model="form.trigger" />
        </el-form-item>

        <el-form-item label="Calibre" prop="calibre">
          <el-input placeholder="Enter calibre rules" v-model="form.calibre" />
        </el-form-item>

        <el-form-item label="Bullet Type" prop="bulletType">
          <el-input placeholder="Enter bullet type rules" v-model="form.bulletType" />
        </el-form-item>

        <el-form-item label="Loading Rod" prop="loadingRod">
          <el-input placeholder="Enter loading rod rules" v-model="form.loadingRod" />
        </el-form-item>

        <el-form-item label="Cleaning" prop="cleaning">
          <el-input placeholder="Enter cleaning rules" v-model="form.cleaning" />
        </el-form-item>

        <el-form-item label="Team" prop="team">
          <el-input placeholder="Enter a team" v-model="form.team" />
        </el-form-item>

        <el-form-item label="Picture URL" prop="pictureUrl">
          <el-input placeholder="Enter a URL to a picture" v-model="form.pictureUrl" />
        </el-form-item>

        <el-form-item label="Remarks" prop="remarks">
          <el-input
            v-model="form.remarks"
            :autosize="{ minRows: 3 }"
            type="textarea"
            placeholder="Enter remarks"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <div class="flex justify-end">
          <el-button class="block" type="default" @click="close">Cancel</el-button>
          <el-button class="block" type="primary" @click="submit">Save</el-button>
        </div>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { stub } from "@/db/classes"

export default {
  name: "ClassesCreateDialog",

  props: {
    shown: { type: Boolean, default: false }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  computed: mapState("classes", {
    classesCreateIsLoading: "createIsLoading",
    classesCategories: "categories",
    classesConditions: "conditions"
  }),

  data: function() {
    return {
      visible: this.shown,
      form: stub,
      formRules: {
        number: { required: true, message: "Number is a required field" },
        name: { required: true, message: "Name is a required field" },
        category: { required: true, message: "Category is a required field" },
        condition: { required: true, message: "Condition is a required field" },
        target: { required: true, message: "Target is a required field" },
        position: { required: true, message: "Position is a required field" },
        distance: { required: true, message: "Distance is a required field" },
        type: { required: true, message: "Type is a required field" },
        sight: { required: true, message: "Sight is a required field" },
        trigger: { required: true, message: "Trigger is a required field" },
        calibre: { required: true, message: "Calibre is a required field" },
        bulletType: { required: true, message: "Bullet Type is a required field" }
      }
    }
  },

  methods: {
    ...mapActions("classes", {
      classesCreateAsync: "createAsync"
    }),

    submit() {
      this.$refs.form.validate((isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: "Please fill in all required fields before saving"
          })
        }
        this.classesCreateFormSubmit(this.form)
      })
    },

    async classesCreateFormSubmit(form) {
      try {
        await this.classesCreateAsync(form)
        this.$notify({
          type: "success",
          title: "Great success",
          message: `${form.name} was successfully added to the database`
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
    },

    clear() {
      this.form = { ...stub }
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
