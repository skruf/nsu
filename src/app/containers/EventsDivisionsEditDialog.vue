<i18n>
{
  "en": {
    "title": "Edit division",
    "subtitle": "For %{event}",
    "formItem1Label": "Name",
    "formItem1Placeholder": "Enter a name",
    "formItem1Error": "Name is a required field",
    "formItem2Label": "Choose a Day",
    "formItem2Placeholder": "Pick a day",
    "formItem2Error": "Day is a required field",
    "formItem3Label": "Time",
    "formItem3Placeholder": "Pick a time",
    "formItem3Error": "Time is a required field",
    "formItem4Label": "Distance",
    "formItem4Placeholder": "Enter distance",
    "formItem4Error": "Distance is a required field",
    "formItem5Label": "Number of lanes",
    "formItem5Placeholder": "Enter number",
    "formItem5Error": "Number of lanes is a required field",
    "saveSuccess": "%{division} was successfully edited"
  },
  "no": {
    "title": "Rediger standplassliste",
    "subtitle": "For %{event}",
    "formItem1Label": "Navn",
    "formItem1Placeholder": "Skriv ett navn",
    "formItem1Error": "Navn er et påkrevd felt",
    "formItem2Label": "Velg en dato",
    "formItem2Placeholder": "Velg en dato",
    "formItem2Error": "Dato er et påkrevd felt",
    "formItem3Label": "Klokkeslett",
    "formItem3Placeholder": "Velg eller skriv et klokkeslett",
    "formItem3Error": "Klokkeslett er et påkrevd felt",
    "formItem4Label": "Distanse",
    "formItem4Placeholder": "Skriv inn en distanse",
    "formItem4Error": "Distanse er et påkrevd felt",
    "formItem5Label": "Antall baner",
    "formItem5Placeholder": "Skriv inn antall",
    "formItem5Error": "Antall baner er et påkrevd felt",
    "saveSuccess": "%{division} ble redigert"
  }
}
</i18n>

<template>
  <el-dialog
    custom-class="events-divisions-edit-dialog"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <template slot="title">
      <h3 class="h3">
        {{ $t("title") }}
      </h3>
      <small class="small">
        {{ $t("subtitle", { event: eventsStateSelected.title }) }}
      </small>
    </template>

    <div
      v-loading="eventsDivisionsStateEditOneIsLoading"
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
          prop="day"
          :label="$t('formItem2Label')"
        >
          <el-date-picker
            v-model="form.day"
            type="date"
            :placeholder="$t('formItem2Placeholder')"
          />
        </el-form-item>

        <el-form-item
          prop="time"
          :label="$t('formItem3Label')"
        >
          <el-time-select
            v-model="form.time"
            :placeholder="$t('formItem3Placeholder')"
            :picker-options="formTimePickerOptions"
          />
        </el-form-item>

        <el-form-item
          :label="$t('formItem4Label')"
          prop="distance"
        >
          <el-input
            v-model="form.distance"
            :placeholder="$t('formItem4Placeholder')"
          />
        </el-form-item>

        <el-form-item
          :label="$t('formItem5Label')"
          prop="stands"
        >
          <el-input-number
            v-model="form.stands"
            controls-position="right"
            size="small"
            :min="1"
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
        @click="save"
      >
        {{ $t("save") }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import { eventsDivisionsStub } from "~/stubs"

export default Vue.extend({
  name: "EventsDivisionsEditDialog",

  props: {
    shown: { type: Boolean, default: false },
    division: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown,
      form: {},
      formRules: {
        name: { required: true, message: this.$t("formItem1Error") },
        day: { required: true, message: this.$t("formItem2Error") },
        time: { required: true, message: this.$t("formItem3Error") },
        distance: { required: true, message: this.$t("formItem4Error") },
        stands: { required: true, message: this.$t("formItem5Error") }
      },
      formTimePickerOptions: {
        start: "08:00",
        step: "00:15",
        end: "23:59"
      }
    }
  },

  computed: {
    ...mapState("events", {
      eventsStateSelected: "selected"
    }),
    ...mapState("events/divisions", {
      eventsDivisionsStateEditOneIsLoading: "editOneIsLoading"
    })
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    ...mapActions("events/divisions", {
      eventsDivisionsActionsEditOne: "editOne"
    }),

    open() {
      this.form = { ...this.division }
    },

    async save() {
      this.$refs.form.validate(async (isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: this.$t("validationError")
          })
        }

        const data = { ...this.form }
        data.eventId = this.eventsStateSelected.id
        if(typeof data.day !== "string") {
          data.day = data.day.toISOString().split("T")[0]
        }

        try {
          await this.eventsDivisionsActionsEditOne(data)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("saveSuccess", {
              division: data.name
            })
          })
          this.$emit("update:division", data)
          this.close()
          this.clear()
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
      this.form = { ...eventsDivisionsStub }
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
})
</script>
