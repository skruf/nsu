<style lang="stylus">
</style>

<template>
  <el-dialog
    title="Create a new club"
    custom-class="create-dialog"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <div
      v-loading="clubsStateCreateIsLoading"
      class="dialog_content"
    >
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="formRules"
      >
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
          label="Leader"
          prop="leader"
        >
          <el-input
            v-model="form.leader"
            placeholder="Enter a full name"
          />
        </el-form-item>

        <el-form-item
          label="Email"
          prop="emailAddress"
        >
          <el-input
            v-model="form.emailAddress"
            placeholder="Enter a email address"
          />
        </el-form-item>

        <el-form-item
          label="Address"
          prop="address"
        >
          <el-input
            v-model="form.address"
            placeholder="Enter a address"
          />
        </el-form-item>

        <el-form-item
          label="Area"
          prop="area"
        >
          <el-input
            v-model="form.area"
            placeholder="Enter an area"
          />
        </el-form-item>

        <el-form-item
          label="Country"
          prop="country"
        >
          <el-select
            v-model="form.country"
            placeholder="Select a country"
          >
            <el-option
              v-for="(country, index) in clubsStateCountries"
              :key="index"
              :label="country"
              :value="country"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="Range"
          prop="rangeId"
        >
          <el-select
            v-model="form.rangeId"
            placeholder="Select a shooting range"
            :loading="rangesStateListIsLoading"
          >
            <el-option
              v-for="range in rangesStateList"
              :key="range.id"
              :label="`${range.name} (${range.area})`"
              :value="range.id"
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
import { clubsStub } from "@/stubs"

export default {
  name: "ClubsCreateDialog",

  props: {
    shown: { type: Boolean, default: false }
  },

  data: function() {
    return {
      visible: this.shown,
      form: clubsStub,
      formRules: {
        name: { required: true, message: "Name is a required field" },
        area: { required: true, message: "Area is a required field" },
        country: { required: true, message: "Country is a required field" }
      }
    }
  },

  computed: {
    ...mapState("clubs", {
      clubsStateCreateIsLoading: "createIsLoading",
      clubsStateCountries: "countries"
    }),
    ...mapState("ranges", {
      rangesStateListIsLoading: "listIsLoading",
      rangesStateList: "list"
    })
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    ...mapActions("clubs", {
      clubsActionsCreate: "create"
    }),

    ...mapActions("ranges", {
      rangesActionsList: "list"
    }),

    async open() {
      await this.rangesActionsList()
    },

    async submit() {
      this.$refs.form.validate(async (isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: "Please fill in all required fields before saving"
          })
        }

        try {
          await this.clubsActionsCreate(this.form)
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
      this.form = { ...clubsStub }
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
