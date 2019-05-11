<i18n>
{
  "en": {
    "title": "Edit club",
    "formItem1Label": "Name",
    "formItem1Placeholder": "Name",
    "formItem1Error": "Name is a required field",
    "formItem2Label": "Leader",
    "formItem2Placeholder": "Enter a name",
    "formItem3Label": "Email",
    "formItem3Placeholder": "Enter an email address",
    "formItem4Label": "Address",
    "formItem4Placeholder": "Enter an address",
    "formItem5Label": "Area",
    "formItem5Placeholder": "Enter an area",
    "formItem5Error": "Area is a required field",
    "formItem6Label": "Country",
    "formItem6Placeholder": "Select a country",
    "formItem6Error": "Country is a required field",
    "formItem7Label": "Range",
    "formItem7Placeholder": "Select a shooting range",
    "submitSuccess": "%{name} was successfully updated in the database"
  },
  "no": {
    "title": "Rediger klubb",
    "formItem1Label": "Navn",
    "formItem1Placeholder": "Navn",
    "formItem1Error": "Navn er et påkrevet felt",
    "formItem2Label": "Leder",
    "formItem2Placeholder": "Skriv inn et navn",
    "formItem3Label": "Epost",
    "formItem3Placeholder": "Skriv inn en epost adresse",
    "formItem4Label": "Adresse",
    "formItem4Placeholder": "Skriv inn en adresse",
    "formItem5Label": "Område",
    "formItem5Placeholder": "Skriv inn et område",
    "formItem5Error": "Område er et påkrevet felt",
    "formItem6Label": "Land",
    "formItem6Placeholder": "Velg et land",
    "formItem6Error": "Land er et påkrevet felt",
    "formItem7Label": "Skyttebane",
    "formItem7Placeholder": "Velg en skyttebane",
    "submitSuccess": "%{name} var oppdatert i databasen"
  }
}
</i18n>

<template>
  <el-dialog
    custom-class="edit-dialog"
    :title="$t('title')"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <div
      v-loading="clubsStateEditIsLoading"
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
          prop="name"
        >
          <el-input
            v-model="form.name"
            :placeholder="$t('formItem1Placeholder')"
          />
        </el-form-item>

        <el-form-item
          :label="$t('formItem2Label')"
          prop="leader"
        >
          <el-input
            v-model="form.leader"
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
          prop="address"
        >
          <el-input
            v-model="form.address"
            :placeholder="$t('formItem4Placeholder')"
          />
        </el-form-item>

        <el-form-item
          :label="$t('formItem5Label')"
          prop="area"
        >
          <el-input
            v-model="form.area"
            :placeholder="$t('formItem5Placeholder')"
          />
        </el-form-item>

        <el-form-item
          :label="$t('formItem6Label')"
          prop="country"
        >
          <el-select
            v-model="form.country"
            :placeholder="$t('formItem6Placeholder')"
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
          :label="$t('formItem7Label')"
          prop="rangeId"
        >
          <el-select
            v-model="form.rangeId"
            :placeholder="$t('formItem7Placeholder')"
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
import { clubsStub } from "~/stubs"

export default {
  name: "ClubsEditDialog",

  props: {
    shown: { type: Boolean, default: false },
    club: { type: Object, default: () => clubsStub }
  },

  data: function() {
    return {
      visible: this.shown,
      form: clubsStub,
      formRules: {
        name: { required: true, message: this.$t("formItem1Error") },
        area: { required: true, message: this.$t("formItem5Error") },
        country: { required: true, message: this.$t("formItem7Error") }
      }
    }
  },

  computed: {
    ...mapState("clubs", {
      clubsStateEditIsLoading: "editIsLoading",
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
      clubsActionsEditOne: "editOne"
    }),

    ...mapActions("ranges", {
      rangesActionsList: "list"
    }),

    async open() {
      this.form = { ...this.club }
      await this.rangesActionsList()
    },

    async submit() {
      this.$refs.form.validate(async (isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: this.$t("validationError")
          })
        }

        try {
          await this.clubsActionsEditOne(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("submitSuccess", {
              name: this.form.name
            })
          })
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
      this.clear()
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
