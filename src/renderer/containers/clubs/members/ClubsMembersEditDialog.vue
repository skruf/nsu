<style lang="stylus">
</style>

<template>
  <el-dialog
    title="Edit a club member"
    custom-class="edit-dialog"
    :visible.sync="visible"
    :append-to-body="true"
    @open="open"
    @close="close"
  >
    <div
      v-loading="clubsMembersStateEditIsLoading"
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
              v-for="(country, index) in clubsMembersStateCountries"
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
          :rules="{
            required: true,
            message: 'Please select a club'
          }"
        >
          <el-select
            v-model="form.clubId"
            placeholder="Select a club"
            :loading="clubsStateListIsLoading"
          >
            <el-option
              v-for="clubItem in clubsStateList"
              :key="clubItem.id"
              :label="clubItem.name"
              :value="clubItem.id"
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
  name: "ClubsMembersEditDialog",

  props: {
    shown: { type: Boolean, default: false },
    club: { type: Object, required: false, default: () => {} },
    clubMember: { type: Object, default: () => clubsMembersStub }
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
      clubsStateListIsLoading: "listIsLoading",
      clubsStateList: "list"
    }),

    ...mapState("clubs/members", {
      clubsMembersStateEditIsLoading: "editIsLoading",
      clubsMembersStateCountries: "countries"
    }),

    clubNotProvided() {
      return !this.club.id
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
      this.form = { ...this.clubMember }
      if(this.clubNotProvided) {
        await this.clubsActionsList()
      }
    },

    ...mapActions("clubs/members", {
      clubsMembersActionsEditOne: "editOne"
    }),

    ...mapActions("clubs", {
      clubsActionsList: "list"
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

        if(!this.clubNotProvided) {
          this.form.clubId = this.club.id
        }

        try {
          await this.clubsMembersActionsEditOne(this.form)
          const fullName = `${this.form.firstName} ${this.form.lastName}`
          this.$notify({
            type: "success",
            title: "Great success",
            message: `${fullName} was successfully updated in the database`
          })
          this.close()
        } catch(e) {
          this.$notify({
            title: "Oops!",
            type: "error",
            message: e.message
          })
        }
      })
    },

    clear() {
      this.form = { ...clubsMembersStub }
    },

    close() {
      this.clear()
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
