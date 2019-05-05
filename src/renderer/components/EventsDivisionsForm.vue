<i18n>
{
  "en": {
    "eventsDivisionsFormItem1Label": "Name",
    "eventsDivisionsFormItem1Placeholder": "Enter a name",
    "eventsDivisionsFormItem1Error": "Name is a required field",
    "eventsDivisionsFormItem2Label": "Choose a Day",
    "eventsDivisionsFormItem2Placeholder": "Pick a day",
    "eventsDivisionsFormItem2Error": "Day is a required field",
    "eventsDivisionsFormItem3Label": "Starts At",
    "eventsDivisionsFormItem3Placeholder": "Pick a start time",
    "eventsDivisionsFormItem3Error": "Starts At is a required field",
    "eventsDivisionsFormItem4Label": "Shooting Interval",
    "eventsDivisionsFormItem4Placeholder": "Select an interval",
    "eventsDivisionsFormItem4Error": "Shooting Interval is a required field",
    "eventsDivisionsFormButton": "Generate list"
  },
  "no": {
    "eventsDivisionsFormItem1Label": "Navn",
    "eventsDivisionsFormItem1Placeholder": "Skriv ett navn",
    "eventsDivisionsFormItem1Error": "Navn er et påkrevd felt",
    "eventsDivisionsFormItem2Label": "Velg en dag",
    "eventsDivisionsFormItem2Placeholder": "Velg en dag",
    "eventsDivisionsFormItem2Error": "Dag er et påkrevd felt",
    "eventsDivisionsFormItem3Label": "Starter",
    "eventsDivisionsFormItem3Placeholder": "Velg en start tid",
    "eventsDivisionsFormItem3Error": "Starter er et påkrevd felt",
    "eventsDivisionsFormItem4Label": "Skytteinterval",
    "eventsDivisionsFormItem4Placeholder": "Velg ett interval",
    "eventsDivisionsFormItem4Error": "Skytteinterval er et påkrevd felt",
    "eventsDivisionsFormButton": "Generer listen"
  }
}
</i18n>

<template>
  <el-form
    ref="eventsDivisionsForm"
    label-position="top"
    :model="eventsDivisionsForm"
    :rules="eventsDivisionsFormRules"
  >
    <el-form-item
      prop="name"
      :label="$t('eventsDivisionsFormItem1Label')"
    >
      <el-input
        v-model="eventsDivisionsForm.name"
        :placeholder="$t('eventsDivisionsFormItem1Placeholder')"
      />
    </el-form-item>

    <el-form-item
      prop="day"
      :label="$t('eventsDivisionsFormItem2Label')"
    >
      <el-date-picker
        v-model="eventsDivisionsForm.day"
        type="date"
        :placeholder="$t('eventsDivisionsFormItem2Placeholder')"
      />
      <!-- :picker-options="eventsDivisionsFormDayPickerOptions" -->
    </el-form-item>

    <el-form-item
      prop="startsAt"
      :label="$t('eventsDivisionsFormItem3Label')"
    >
      <el-time-select
        v-model="eventsDivisionsForm.startsAt"
        :placeholder="$t('eventsDivisionsFormItem3Placeholder')"
        :picker-options="eventsDivisionsFormTimePickerOptions"
      />
    </el-form-item>

    <el-form-item
      prop="interval"
      :label="$t('eventsDivisionsFormItem4Label')"
    >
      <el-select
        v-model="eventsDivisionsForm.interval"
        :placeholder="$t('eventsDivisionsFormItem4Placeholder')"
      >
        <el-option
          v-for="(i, index) in intervals"
          :key="index"
          :label="i.label"
          :value="i.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      prop="distance"
      label="Distance"
    >
      <el-input
        v-model="eventsDivisionsForm.distance"
        placeholder="Enter a distance"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import { eventsDivisionsStub } from "@/stubs"

export default {
  name: "EventsDivisionsForm",

  props: {
    form: { type: Object, required: true }
  },

  data: function() {
    return {
      eventsDivisionsForm: {},
      eventsDivisionsFormRules: {
        name: { required: true, message: this.$t("eventsDivisionsFormItem1Error") },
        day: { required: true, message: this.$t("eventsDivisionsFormItem2Error") },
        startsAt: { required: true, message: this.$t("eventsDivisionsFormItem3Error") },
        interval: { required: true, message: this.$t("eventsDivisionsFormItem4Error") }
      },
      eventsDivisionsFormTimePickerOptions: {
        start: "08:00",
        step: "00:05",
        end: "23:59"
      },
      intervals: [
        { label: '5 min', value: '00:05' },
        { label: '10 min', value: '00:10' },
        { label: '15 min', value: '00:15' },
        { label: '20 min', value: '00:20' },
        { label: '25 min', value: '00:25' },
        { label: '30 min', value: '00:30' },
        { label: '45 min', value: '00:45' },
        { label: '60 min', value: '01:00' }
      ],
      eventsDivisionsFormDayPickerOptions: {
        disabledDate: this.eventsDivisionsFormDayPickerOptionsDisabledDate
      }
    }
  },

  computed: {
    eventsDivisionsContestantsIsConfigured() {
      return this.eventsDivisionsForm.startsAt && this.eventsDivisionsForm.interval
    }
  },

  watch: {
    eventsDivisionsForm: {
      deep: true,
      handler(form) {
        this.$emit("update:form", form)
      }
    }
  },

  created() {
    this.eventsDivisionsForm = {
      ...eventsDivisionsStub,
      ...this.form
    }
  },

  methods: {
    eventsDivisionsFormDayPickerOptionsDisabledDate(day) {
      const time = day.getTime()
      return time < this.event.startsAt || time > this.event.endsAt
    },
    clear() {
      this.eventsDivisionsForm = this.form
      // this.eventsDivisionsForm = { ...eventsDivisionsStub }
    },
    validate(cb) {
      this.$refs.eventsDivisionsForm.validate((isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: this.$t("validationError")
          })
        }

        cb(isValid)
      })
    }
  }
}
</script>
