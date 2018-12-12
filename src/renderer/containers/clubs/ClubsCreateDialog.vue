<style lang="stylus">
</style>

<template>
  <el-dialog
    title="Create a new club"
    custom-class="create-dialog"
    :visible.sync="visible"
    @close="close"
  >
    <div v-loading="clubsCreateIsLoading">
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="formRules"
      >
        <el-form-item label="Title" prop="name">
          <el-input placeholder="Enter a name" v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="Leader" prop="leader">
          <el-input placeholder="Enter a leader" v-model="form.leader"></el-input>
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input placeholder="Enter a email" v-model="form.email"></el-input>
        </el-form-item>

        <el-form-item label="Address" prop="address">
          <el-input placeholder="Enter a address" v-model="form.address"></el-input>
        </el-form-item>

        <el-form-item label="Area" prop="area">
          <el-input placeholder="Enter a area" v-model="form.area"></el-input>
        </el-form-item>

        <el-form-item label="Country" prop="country">
          <el-input placeholder="Enter a country" v-model="form.country"></el-input>
        </el-form-item>

        <el-form-item label="Shooting Range" prop="range">
          <el-input placeholder="Enter a range" v-model="form.range"></el-input>
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
import { stub } from "@/db/clubs"

export default {
  name: "ClubsCreateDialog",

  props: {
    shown: { type: Boolean, default: false }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  computed: mapState("clubs", {
    clubsCreateIsLoading: "createIsLoading"
  }),

  data: function() {
    return {
      visible: this.shown,
      form: stub,
      formRules: {
        name: { required: true, message: "Name is a required field" },
        area: { required: true, message: "Area is a required field" },
        country: { required: true, message: "Country is a required field" }
      }
    }
  },

  methods: {
    ...mapActions("clubs", {
      clubsCreateAsync: "createAsync"
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
        this.clubsCreateFormSubmit(this.form)
      })
    },

    async clubsCreateFormSubmit(form) {
      try {
        await this.clubsCreateAsync(form)
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
