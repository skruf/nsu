<style lang="stylus">
</style>

<template>
  <el-dialog
    title="Create a new range"
    custom-class="create-dialog"
    :visible.sync="visible"
    @close="close"
  >
    <div
      v-loading="rangesCreateIsLoading"
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
            placeholder="Enter a area"
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
              v-for="(country, index) in rangesCountries"
              :key="index"
              :label="country"
              :value="country"
            />
          </el-select>
        </el-form-item>

        <div class="flex">
          <div class="flex-1 mr-2">
            <el-form-item
              label="Latitude"
              prop="lat"
            >
              <el-input
                v-model="form.lat"
                placeholder="Enter coordinates"
              />
            </el-form-item>
          </div>

          <div class="flex-1 ml-2">
            <el-form-item
              label="Longitude"
              prop="lng"
            >
              <el-input
                v-model="form.lng"
                placeholder="Enter coordinates"
              />
            </el-form-item>
          </div>
        </div>

        <el-form-item
          label="Type"
          prop="type"
        >
          <el-select
            v-model="form.type"
            placeholder="Select a type"
          >
            <el-option
              v-for="(type, index) in [ 'Indoor', 'Outdoor' ]"
              :key="index"
              :label="type"
              :value="type"
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
import { rangesStub } from "@/stubs"

export default {
  name: "RangesCreateDialog",

  props: {
    shown: { type: Boolean, default: false }
  },

  data: function() {
    return {
      visible: this.shown,
      form: rangesStub,
      formRules: {
        name: { required: true, message: "Name is a required field" },
        area: { required: true, message: "Area is a required field" },
        country: { required: true, message: "Country is a required field" }
      }
    }
  },

  computed: mapState("ranges", {
    rangesCreateIsLoading: "createIsLoading",
    rangesCountries: "countries"
  }),

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    ...mapActions("ranges", {
      rangesCreateAsync: "createAsync"
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
        this.rangesCreateFormSubmit(this.form)
      })
    },

    async rangesCreateFormSubmit(form) {
      try {
        await this.rangesCreateAsync(form)
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
      this.form = { ...rangesStub }
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
