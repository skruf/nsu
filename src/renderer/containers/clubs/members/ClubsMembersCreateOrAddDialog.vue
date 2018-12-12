<style lang="stylus">
</style>

<template>
  <el-dialog
    title="Create or add member"
    custom-class="create-dialog"
    :visible.sync="visible"
    :append-to-body="true"
    @close="close"
  >
    <div v-loading="clubsMembersCreateIsLoading">
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="formRules"
      >
        <el-form-item label="First name" prop="firstName">
          <el-input placeholder="Enter a first name" v-model="form.firstName"></el-input>
        </el-form-item>

        <el-form-item label="Last name" prop="lastName">
          <el-input placeholder="Enter a last name" v-model="form.lastName"></el-input>
        </el-form-item>

        <el-form-item label="Email address" prop="emailAddress">
          <el-input placeholder="Enter a email address" v-model="form.emailAddress"></el-input>
        </el-form-item>

        <el-form-item label="Phone number" prop="phoneNumber">
          <el-input placeholder="Enter a phone number" v-model="form.phoneNumber"></el-input>
        </el-form-item>

        <el-form-item label="Country" prop="country">
          <el-input placeholder="Enter a country" v-model="form.country"></el-input>
        </el-form-item>

        <el-form-item label="Club" prop="club" v-if="clubNotProvided">
          <el-input placeholder="Select a club" v-model="form.clubId"></el-input>
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
import { stub } from "@/db/clubs/members"

export default {
  name: "ClubsMembersCreateOrAddDialog",

  props: {
    shown: { type: Boolean, default: false },
    clubId: { type: String, required: false },
    clubName: { type: String, required: false }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  computed: {
    ...mapState("clubs", {
      clubsMembersCreateIsLoading: "createIsLoading"
    }),
    clubNotProvided() {
      return !(this.clubId && this.clubName)
    }
  },

  data: function() {
    return {
      visible: this.shown,
      form: stub,
      formRules: {
        firstName: { required: true, message: "First name is a required field" },
        lastName: { required: true, message: "Last name is a required field" },
        email: { required: true, message: "Email is a required field" }
      }
    }
  },

  methods: {
    ...mapActions("clubs/members", {
      clubsMembersCreateAsync: "createAsync"
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
        if(!this.clubNotProvided) {
          this.form.clubId = this.clubId
        }
        this.clubsMembersCreateFormSubmit(this.form)
      })
    },

    async clubsMembersCreateFormSubmit(form) {
      try {
        await this.clubsMembersCreateAsync(form)
        this.$notify({
          type: "success",
          title: "Great success",
          message: `${form.firstName} ${form.lastName} was successfully added to the database`
        })
        this.clear()
        this.close()
      } catch(e) {
        this.$notify({
          title: "Oops!",
          type: "error",
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
