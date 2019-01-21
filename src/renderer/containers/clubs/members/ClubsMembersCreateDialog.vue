<style lang="stylus">
</style>

<template>
  <el-dialog
    title="Create a club member"
    custom-class="create-dialog"
    :visible.sync="visible"
    :append-to-body="true"
    @open="open"
    @close="close"
  >
    <div
      v-loading="clubsMembersCreateIsLoading"
      class="dialog_content"
    >
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="formRules"
      >
        <el-form-item
          label="First Name"
          prop="firstName"
        >
          <el-input
            v-model="form.firstName"
            placeholder="Enter a first name"
          />
        </el-form-item>

        <el-form-item
          label="Last Name"
          prop="lastName"
        >
          <el-input
            v-model="form.lastName"
            placeholder="Enter a last name"
          />
        </el-form-item>

        <el-form-item
          label="Email Address"
          prop="emailAddress"
        >
          <el-input
            v-model="form.emailAddress"
            placeholder="Enter a email address"
          />
        </el-form-item>

        <el-form-item
          label="Phone Number"
          prop="phoneNumber"
        >
          <el-input
            v-model="form.phoneNumber"
            placeholder="Enter a phone number"
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
              v-for="(country, index) in clubsMembersCountries"
              :key="index"
              :label="country"
              :value="country"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="clubNotProvided"
          label="Club"
          prop="club"
        >
          <el-select
            v-model="form.clubId"
            placeholder="Select a club"
            :loading="clubsListIsLoading"
          >
            <el-option
              v-for="club in clubsList"
              :key="club._id"
              :label="club.name"
              :value="club._id"
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
import { clubsMembersStub } from "@/stubs"

export default {
  name: "ClubsMembersCreateDialog",

  props: {
    shown: { type: Boolean, default: false },
    clubId: { type: String, required: false, default: "" },
    clubName: { type: String, required: false, default: "" }
  },

  data: function() {
    return {
      visible: this.shown,
      form: clubsMembersStub,
      formRules: {
        firstName: { required: true, message: "First name is a required field" },
        lastName: { required: true, message: "Last name is a required field" },
        email: { required: true, message: "Email is a required field" }
      }
    }
  },

  computed: {
    ...mapState("clubs", {
      clubsListIsLoading: "listIsLoading",
      clubsList: "list"
    }),
    ...mapState("clubs/members", {
      clubsMembersCreateIsLoading: "createIsLoading",
      clubsMembersCountries: "countries"
    }),
    clubNotProvided() {
      return !(this.clubId && this.clubName)
    }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    async open() {
      if(this.clubNotProvided) {
        await this.clubsListAsync()
      }
    },

    ...mapActions("clubs/members", {
      clubsMembersCreateAsync: "createAsync"
    }),

    ...mapActions("clubs", {
      clubsListAsync: "listAsync"
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
      this.form = { ...clubsMembersStub }
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
