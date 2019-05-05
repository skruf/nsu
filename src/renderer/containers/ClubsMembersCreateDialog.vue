<i18n>
{
  "en": {
    "title": "Create member",
    "formItem1Label": "First Name",
    "formItem1Placeholder": "Enter a first name",
    "formItem1Error": "First name is a required field",
    "formItem2Label": "Last Name",
    "formItem2Placeholder": "Enter a last name",
    "formItem2Error": "Last name is a required field",
    "formItem3Label": "Email Address",
    "formItem3Placeholder": "Enter a email address",
    "formItem3Error": "Email is a required field",
    "formItem4Label": "Phone Number",
    "formItem4Placeholder": "Enter a phone number",
    "formItem5Label": "Country",
    "formItem5Placeholder": "Select a country",
    "formItem6Label": "Club",
    "formItem6Placeholder": "Please select a club",
    "formItem6Error": "Select a club",
    "clubsMembersActionsCreateSuccess": "%{fullName} was successfully added to the database"
  },
  "no": {
    "title": "Opprett ett medlem",
    "formItem1Label": "Fornavn",
    "formItem1Placeholder": "Skriv inn fornavn",
    "formItem1Error": "Fornavn er et påkrevd felt",
    "formItem2Label": "Etternavn",
    "formItem2Placeholder": "Skriv inn etternavn",
    "formItem2Error": "Etternavn er et påkrevd felt",
    "formItem3Label": "Epost adresse",
    "formItem3Placeholder": "Skriv inn en e-post adresse",
    "formItem3Error": "Epost adresse er et påkrevd felt",
    "formItem4Label": "Telefonnummer",
    "formItem4Placeholder": "Skriv inn et telefonnummer",
    "formItem5Label": "Land",
    "formItem5Placeholder": "Velg ett land",
    "formItem6Label": "Klubb",
    "formItem6Placeholder": "Velg en klubb",
    "formItem6Error": "Klubb er et påkrevd felt",
    "clubsMembersActionsCreateSuccess": "%{fullName} ble lagt til i databasen"
  }
}
</i18n>

<template>
  <el-dialog
    custom-class="create-dialog"
    :title="$t('title')"
    :visible.sync="visible"
    :append-to-body="true"
    @open="open"
    @close="close"
  >
    <div
      v-loading="clubsMembersStateCreateIsLoading"
      class="dialog_content"
    >
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="formRules"
      >
        <el-form-item
          :label="$t('formItem1Label')"
          prop="firstName"
        >
          <el-input
            v-model="form.firstName"
            :placeholder="$t('formItem1Placeholder')"
          />
        </el-form-item>

        <el-form-item
          :label="$t('formItem2Label')"
          prop="lastName"
        >
          <el-input
            v-model="form.lastName"
            :placeholder="$t('formItem2Placeholder')"
          />
        </el-form-item>

        <el-form-item
          :label="$t('formItem3Label')"
          prop="emailAddress"
        >
          <el-input
            v-model="form.emailAddress"
            :placeholder="$t('formItem3Placeholder')"
          />
        </el-form-item>

        <el-form-item
          :label="$t('formItem4Label')"
          prop="phoneNumber"
        >
          <el-input
            v-model="form.phoneNumber"
            :placeholder="$t('formItem4Placeholder')"
          />
        </el-form-item>

        <el-form-item
          :label="$t('formItem5Label')"
          prop="country"
        >
          <el-select
            v-model="form.country"
            filterable
            :placeholder="$t('formItem5Placeholder')"
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
          prop="clubId"
          :label="$t('formItem6Label')"
          :rules="{
            required: true,
            message: $t('formItem6Error')
          }"
        >
          <el-select
            v-model="form.clubId"
            filterable
            :placeholder="$t('formItem6Placeholder')"
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
        {{ $t("cancel") }}
      </el-button>
      <el-button
        class="block"
        type="primary"
        @click="submit"
      >
        {{ $t("save") }}
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
    club: { type: Object, required: false, default: () => {} }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...clubsMembersStub },
      formRules: {
        firstName: { required: true, message: this.$t('formItem1Error') },
        lastName: { required: true, message: this.$t('formItem2Error') },
        email: { required: true, message: this.$t('formItem3Error') }
      }
    }
  },

  computed: {
    ...mapState("clubs", {
      clubsStateListIsLoading: "listIsLoading",
      clubsStateList: "list"
    }),

    ...mapState("clubs/members", {
      clubsMembersStateCreateIsLoading: "createIsLoading",
      clubsMembersStateCountries: "countries"
    }),

    clubNotProvided() {
      return !(this.club && this.club.id)
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
        await this.clubsActionsList()
      }
    },

    ...mapActions("clubs/members", {
      clubsMembersActionsCreate: "create"
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
            message: this.$t("validationError")
          })
        }

        if(!this.clubNotProvided) {
          this.form.clubId = this.club.id
        }

        try {
          await this.clubsMembersActionsCreate(this.form)
          const fullName = `${this.form.firstName} ${this.form.lastName}`
          this.$notify({
            type: "success",
            title: this.$t("title"),
            message: this.$t("clubsMembersActionsCreateSuccess", {
              fullName
            })
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
