<style lang="stylus">
</style>

<template>
  <el-dialog
    :title="`Create or add member to ${clubName}`"
    custom-class="create-dialog"
    :visible.sync="visible"
    @close="close"
  >
    <div v-loading="isLoading">
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
const formStub = {
  firstName: "Ola",
  lastName: "Dunk",
  emailAddress: "ola@dunk.no",
  country: "Norway",
  phoneNumber: "34 342 414"
}

export default {
  name: "ClubsMembersCreateOrAddDialog",
  props: {
    shown: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false },
    clubId: { type: String, required: true },
    clubName: { type: String, required: true }
  },
  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },
  data: function() {
    return {
      visible: this.shown,
      form: formStub,
      formRules: {
        firstName: { required: true, message: "First name is a required field" },
        lastName: { required: true, message: "Last name is a required field" }
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate((isValid) => {
        if(!isValid) {
          return this.$notify({
            title: "Oops!",
            message: "Please fill in all required fields before saving",
            type: "error"
          })
        }
        this.form.clubId = this.clubId
        this.$emit("submit", this.form)
      })
    },
    clear() {
      this.form = { ...formStub }
    },
    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
