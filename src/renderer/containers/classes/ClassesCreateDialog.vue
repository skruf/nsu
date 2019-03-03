<style lang="stylus">
</style>

<template>
  <el-dialog
    title="Create a new class"
    custom-class="create-dialog"
    :visible.sync="visible"
    @close="close"
  >
    <div
      v-loading="classesStateCreateIsLoading"
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

        <el-form-item
          label="Target"
          prop="target"
        >
          <el-input
            v-model="form.target"
            placeholder="Enter target rules"
          />
        </el-form-item>

        <el-form-item
          label="Position"
          prop="position"
        >
          <el-input
            v-model="form.position"
            placeholder="Enter position rules"
          />
        </el-form-item>

        <el-form-item
          label="Distance"
          prop="distance"
        >
          <el-input
            v-model="form.distance"
            placeholder="Enter distance rules"
          />
        </el-form-item>

        <el-form-item
          label="Type"
          prop="type"
        >
          <el-input
            v-model="form.type"
            placeholder="Enter a type"
          />
        </el-form-item>

        <el-form-item
          label="Sight"
          prop="sight"
        >
          <el-input
            v-model="form.sight"
            placeholder="Enter sight rules"
          />
        </el-form-item>

        <el-form-item
          label="Trigger"
          prop="trigger"
        >
          <el-input
            v-model="form.trigger"
            placeholder="Enter trigger rules"
          />
        </el-form-item>

        <el-form-item
          label="Calibre"
          prop="calibre"
        >
          <el-input
            v-model="form.calibre"
            placeholder="Enter calibre rules"
          />
        </el-form-item>

        <el-form-item
          label="Bullet Type"
          prop="bulletType"
        >
          <el-input
            v-model="form.bulletType"
            placeholder="Enter bullet type rules"
          />
        </el-form-item>

        <el-form-item
          label="Loading Rod"
          prop="loadingRod"
        >
          <el-input
            v-model="form.loadingRod"
            placeholder="Enter loading rod rules"
          />
        </el-form-item>

        <el-form-item
          label="Cleaning"
          prop="cleaning"
        >
          <el-input
            v-model="form.cleaning"
            placeholder="Enter cleaning rules"
          />
        </el-form-item>

        <el-form-item
          label="Team"
          prop="team"
        >
          <el-input
            v-model="form.team"
            placeholder="Enter a team"
          />
        </el-form-item>

        <el-form-item
          label="Picture URL"
          prop="pictureUrl"
        >
          <el-input
            v-model="form.pictureUrl"
            placeholder="Enter a URL to a picture"
          />
        </el-form-item>

        <el-form-item
          label="Remarks"
          prop="remarks"
        >
          <el-input
            v-model="form.remarks"
            :autosize="{ minRows: 3 }"
            type="textarea"
            placeholder="Enter remarks"
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
  name: "ClassesCreateDialog",

  props: {
    shown: { type: Boolean, default: false }
  },

  data: function() {
    return {
      visible: this.shown,
      form: classesStub,
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

  computed: mapState("classes", {
    classesStateCreateIsLoading: "createIsLoading",
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
      classesActionsCreate: "create"
    }),

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
          await this.classesActionsCreate(this.form)
          this.$notify({
            type: "success",
            title: "Great success",
            message: `${this.form.name} was successfully added to the database`
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
      this.form = { ...classesStub }
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
