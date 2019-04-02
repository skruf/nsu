<i18n>
{
  "en": {
    "title": "Create range",
    "formItem1Label": "Name",
    "formItem1Placeholder": "Enter a name",
    "formItem1Error": "Name is a required field",
    "formItem2Label": "Address",
    "formItem2Placeholder": "Enter a address",
    "formItem3Label": "Area",
    "formItem3Placeholder": "Enter an area",
    "formItem3Error": "Area is a required field",
    "formItem4Label": "Country",
    "formItem4Placeholder": "Select a country",
    "formItem4Error": "Country is a required field",
    "formItem5Label": "Latitude",
    "formItem5Placeholder": "Enter coordinates",
    "formItem6Label": "Longitude",
    "formItem6Placeholder": "Enter coordinates",
    "formItem7Label": "Type",
    "formItem7Placeholder": "Select a type",
    "formItem7Error": "Type is a required field",
    "rangesActionsCreateSuccess": "%{range} was successfully added to the database"
  },
  "no": {
    "title": "Opprett skyttebane",
    "formItem1Label": "Navn",
    "formItem1Placeholder": "Skriv et navn",
    "formItem1Error": "Navn er et påkrevd felt",
    "formItem2Label": "Adresse",
    "formItem2Placeholder": "Skriv en adresse",
    "formItem3Label": "Område",
    "formItem3Placeholder": "Skriv et område",
    "formItem3Error": "Område er et påkrevd felt",
    "formItem4Label": "Land",
    "formItem4Placeholder": "Velg et land",
    "formItem4Error": "Land er et påkrevd felt",
    "formItem5Label": "Breddegrad",
    "formItem5Placeholder": "Skriv inn koordinater",
    "formItem6Label": "Lengdegrad",
    "formItem6Placeholder": "Skriv inn koordinater",
    "formItem7Label": "Type",
    "formItem7Placeholder": "Velg en type",
    "formItem7Error": "Type er et påkrevd felt",
    "rangesActionsCreateSuccess": "%{range} ble lagt til i databasen"
  }
}
</i18n>

<template>
  <el-dialog
    :title="$t('title')"
    custom-class="create-dialog"
    :visible.sync="visible"
    @close="close"
  >
    <div
      v-loading="rangesStateCreateIsLoading"
      class="dialog_content"
    >
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="formRules"
      >
        <el-form-item
          prop="name"
          :label="$t('formItem1Label')"
        >
          <el-input
            v-model="form.name"
            :placeholder="$t('formItem1Placeholder')"
          />
        </el-form-item>

        <el-form-item
          prop="address"
          :label="$t('formItem2Label')"
        >
          <el-input
            v-model="form.address"
            :placeholder="$t('formItem2Placeholder')"
          />
        </el-form-item>

        <el-form-item
          prop="area"
          :label="$t('formItem3Label')"
        >
          <el-input
            v-model="form.area"
            :placeholder="$t('formItem3Placeholder')"
          />
        </el-form-item>

        <el-form-item
          prop="country"
          :label="$t('formItem4Label')"
        >
          <el-select
            v-model="form.country"
            :placeholder="$t('formItem4Placeholder')"
          >
            <el-option
              v-for="(country, index) in rangesStateCountries"
              :key="index"
              :label="country"
              :value="country"
            />
          </el-select>
        </el-form-item>

        <div class="flex">
          <div class="flex-1 mr-2">
            <el-form-item
              prop="lat"
              :label="$t('formItem5Label')"
            >
              <el-input
                v-model="form.lat"
                :placeholder="$t('formItem5Placeholder')"
              />
            </el-form-item>
          </div>

          <div class="flex-1 ml-2">
            <el-form-item
              prop="lng"
              :label="$t('formItem6Label')"
            >
              <el-input
                v-model="form.lng"
                :placeholder="$t('formItem6Placeholder')"
              />
            </el-form-item>
          </div>
        </div>

        <el-form-item
          prop="type"
          :label="$t('formItem7Label')"
        >
          <el-select
            v-model="form.type"
            :placeholder="$t('formItem7Placeholder')"
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
        name: { required: true, message: this.$t("formItem1Error") },
        area: { required: true, message: this.$t("formItem3Error") },
        country: { required: true, message: this.$t("formItem4Error") },
        type: { required: true, message: this.$t("formItem7Error") }
      }
    }
  },

  computed: mapState("ranges", {
    rangesStateCreateIsLoading: "createIsLoading",
    rangesStateCountries: "countries"
  }),

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    ...mapActions("ranges", {
      rangesActionsCreate: "create"
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

        try {
          await this.rangesActionsCreate(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("rangesActionsCreateSuccess", {
              range: this.form.name
            })
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
      this.form = { ...rangesStub }
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
