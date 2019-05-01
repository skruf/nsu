<i18n>
{
  "en": {
    "title": "Edit event",
    "formItem1Label": "Title",
    "formItem1Placeholder": "Enter a title",
    "formItem1Error": "Title is a required field",
    "formItem2Label": "Start / End",
    "formItem2PickerStart": "Start date",
    "formItem2PickerEnd": "End date",
    "formItem2Error": "Dates is a required field",
    "formItem3Label": "Category",
    "formItem3Placeholder": "Select a category",
    "formItem3Error": "Category is a required field",
    "formItem4Label": "Organizer",
    "formItem4Placeholder": "Select the organizer",
    "formItem4Error": "Organizer is a required field",
    "formItem5Label": "Range",
    "formItem5Placeholder": "Select the range",
    "formItem5Error": "Range is a required field",
    "formItem6Label": "Approbated",
    "formItem6ActiveText": "Is officially approbated",
    "eventsActionsEditOneSuccess": "%{event} was successfully updated in the database"
  },
  "no": {
    "title": "Rediger stevnet",
    "formItem1Label": "Tittel",
    "formItem1Placeholder": "Skriv inn tittel",
    "formItem1Error": "Tittel er et påkrevd felt",
    "formItem2Label": "Start / Slutt",
    "formItem2PickerStart": "Start dato",
    "formItem2PickerEnd": "Slutt dato",
    "formItem2Error": "Dato er et påkrevd felt",
    "formItem3Label": "Kategori",
    "formItem3Placeholder": "Velg en kategori",
    "formItem3Error": "Kategori er et påkrevd felt",
    "formItem4Label": "Arrangør",
    "formItem4Placeholder": "Velg en klubb",
    "formItem4Error": "Arrangør er et påkrevd felt",
    "formItem5Label": "Skyttebane",
    "formItem5Placeholder": "Velg en skyttebane",
    "formItem5Error": "Skyttebane er et påkrevd felt",
    "formItem6Label": "Approbert",
    "formItem6ActiveText": "Er offisielt approbert",
    "eventsActionsEditOneSuccess": "%{event} var oppdatert i databasen"
  }
}
</i18n>

<style lang="stylus">
.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-select
  width 100%
.el-range-editor .el-range-input
  width 50%
</style>

<template>
  <el-dialog
    custom-class="edit-dialog"
    :title="$t('title')"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <div
      v-loading="eventsStateEditIsLoading"
      class="dialog_content"
    >
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="formRules"
      >
        <el-form-item
          prop="title"
          :label="$t('formItem1Label')"
        >
          <el-input
            v-model="form.title"
            :placeholder="$t('formItem1Placeholder')"
          />
        </el-form-item>

        <el-form-item
          prop="dates"
          :label="$t('formItem2Label')"
        >
          <el-date-picker
            v-model="form.dates"
            type="daterange"
            range-separator="to"
            :start-placeholder="$t('formItem2PickerStart')"
            :end-placeholder="$t('formItem2PickerEnd')"
          />
        </el-form-item>

        <el-form-item
          prop="category"
          :label="$t('formItem3Label')"
        >
          <el-select
            v-model="form.category"
            :placeholder="$t('formItem3Placeholder')"
          >
            <el-option
              v-for="(category, index) in eventsStateCategories"
              :key="index"
              :label="category"
              :value="category"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          prop="organizerId"
          :label="$t('formItem4Label')"
        >
          <el-select
            v-model="form.organizerId"
            :placeholder="$t('formItem4Placeholder')"
            :loading="clubsStateListIsLoading"
          >
            <el-option
              v-for="club in clubsStateList"
              :key="club.id"
              :label="`${club.name} (${club.area})`"
              :value="club.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          prop="rangeId"
          :label="$t('formItem5Label')"
        >
          <el-select
            v-model="form.rangeId"
            :placeholder="$t('formItem5Placeholder')"
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

        <el-form-item
          prop="approbated"
          :label="$t('formItem6Label')"
        >
          <el-switch
            v-model="form.approbated"
            :active-text="$t('formItem6ActiveText')"
          />
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
import { eventsStub } from "@/stubs"

export default {
  name: "EventsEditDialog",

  props: {
    shown: { type: Boolean, default: false },
    event: { type: Object, default: () => ({ ...eventsStub, dates: [] }) }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...eventsStub, dates: [] },
      formRules: {
        title: { required: true, message: this.$t("formItem1Error") },
        dates: { required: true, message: this.$t("formItem2Error") },
        category: { required: true, message: this.$t("formItem3Error") },
        organizerId: { required: true, message: this.$t("formItem4Error") },
        rangeId: { required: true, message: this.$t("formItem5Error") }
      }
    }
  },

  computed: {
    ...mapState("events", {
      eventsStateEditIsLoading: "editIsLoading",
      eventsStateCategories: "categories"
    }),

    ...mapState("clubs", {
      clubsStateListIsLoading: "editIsLoading",
      clubsStateList: "list"
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
    async open() {
      this.form = {
        ...this.event,
        dates: [
          this.event.startsAt,
          this.event.endsAt
        ]
      }
      await this.clubsActionsList()
      await this.rangesActionsList()
    },

    ...mapActions("events", {
      eventsActionsEditOne: "editOne"
    }),

    ...mapActions("clubs", {
      clubsActionsList: "list"
    }),

    ...mapActions("ranges", {
      rangesActionsList: "list"
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

        const data = { ...this.form }
        data.startsAt = data.dates[0].toISOString()
        data.endsAt = data.dates[1].toISOString()
        delete data.dates

        try {
          await this.eventsActionsEditOne(data)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("eventsActionsEditOneSuccess", {
              event: data.title
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
      this.form = { ...eventsStub, dates: [] }
    },

    close() {
      this.clear()
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
