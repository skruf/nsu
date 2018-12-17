<style lang="stylus">
.el-dialog.events-divisions-create-dialog
  padding-bottom 80px
  display flex
  flex-direction column
  position fixed
  left 5%
  top 5%
  right 5%
  bottom 5%
  height 90%
  width 90%

  .el-tabs,
  .el-tabs__content,
  .el-dialog__body
    display flex

  .el-dialog__header
    border-bottom 1px solid var(--border-color)

  .el-dialog__body
    flex-grow 1
    padding 0
    overflow-y auto
  .el-tabs
    flex-direction column
  .el-tabs,
  .el-tabs__content,
  .el-tab-pane
    flex-grow 1

  .column
    flex 1
    border-left 1px solid var(--border-color)
    overflow-y auto
    display flex
    flex-direction column
    // resize horizontal
    &:first-child
      border-left none

  .h5
    padding 15px

  li
    border-top 1px solid var(--border-color)
    padding 10px 20px

  .el-dialog__footer
    padding 0
  .dialog-footer
    position absolute
    left 0
    bottom 0
    height 80px
    width 100%
    border-top 1px solid var(--border-color)
    display flex
    align-items center
    justify-content flex-end
    padding-left 20px
    padding-right 20px

  .search-form
    margin 0 10px 20px
    .el-button
      margin-left 10px

  .placeholder
    display flex
    align-items center
    justify-content center
    flex 1

.el-date-editor.el-input, .el-date-editor.el-input__inner
  width 100%

</style>

<template>
  <el-dialog
    :title="`Create a division for ${event.title}`"
    custom-class="events-divisions-create-dialog"
    :fullscreen="true"
    :visible.sync="visible"
    @open="eventsDivisionsCreateDialogOpen"
    @close="eventsDivisionsCreateDialogClose"
  >
    <div
      class="flex flex-1"
      v-loading="eventsDivisionsCreateIsLoading"
    >
      <div class="px-5 py-5 w-full">
        <h4 class="h4">Division meta</h4>

        <el-form
          class="my-3"
          ref="eventsDivisionsForm"
          label-position="top"
          :model="eventsDivisionsForm"
          :rules="eventsDivisionsFormRules"
        >
          <div class="flex">
            <el-form-item label="Name" prop="name" class="w-2/3 mr-3">
              <el-input placeholder="Enter a name" v-model="eventsDivisionsForm.name" />
            </el-form-item>

            <el-form-item label="Choose a Day" prop="day" class="w-1/3">
              <el-date-picker
                v-model="eventsDivisionsForm.day"
                type="date"
                placeholder="Pick a day"
                :picker-options="eventsDivisionsFormDayPickerOptions"
              />
            </el-form-item>
          </div>

          <div class="flex">
            <el-form-item class="w-full pr-3" label="Starts At" prop="startsAt">
              <el-time-select
                v-model="eventsDivisionsForm.startsAt"
                placeholder="Pick a start time"
                :picker-options="eventsDivisionsFormTimePickerOptions"
              />
            </el-form-item>

            <el-form-item class="w-full pr-3" label="Shooting Interval" prop="interval">
              <el-select
                v-model="eventsDivisionsForm.interval"
                placeholder="Select an interval"
              >
                <el-option
                  v-for="(interval, index) in intervals"
                  :key="index"
                  :label="interval.label"
                  :value="interval.value"
                />
              </el-select>
            </el-form-item>

            <el-button
              class="mb-6 self-end"
              type="primary"
              :disabled="!eventsDivisionsContestantsIsConfigured"
              @click="generateContestantList"
            >
              Generate list
            </el-button>
          </div>
        </el-form>

        <div
          class="border-t pt-5"
          v-if="eventsDivisionsContestantsForms.length > 0"
          v-loading="eventsParticipantsListIsLoading"
        >
          <h4 class="h4 mb-6">Assign contestants to time slots</h4>

          <el-form
            v-for="(contestantForm, index) in eventsDivisionsContestantsForms"
            :key="index"
            ref="eventsDivisionsContestantsForms"
            class="flex"
            label-position="top"
            :model="contestantForm"
          >
            <el-form-item label="" prop="time" class="pr-2">
              <!-- <el-time-select
                v-model="contestantForm.time"
                placeholder="Select time"
                :readonly="true"
                :picker-options="{
                  start: eventsDivisionsForm.startsAt,
                  step: eventsDivisionsForm.interval,
                  end: eventsDivisionsEndsAt
                }"
              /> -->
              {{ contestantForm.time }}
            </el-form-item>

            <el-form-item label="" prop="participant" class="px-2 w-full">
              <el-select
                v-model="contestantForm.memberId"
                placeholder="Select a participant"
                :loading="eventsParticipantsListIsLoading"
                @change="eventsParticipantsSetUnavailable"
                clearable
              >
              <!-- @clear="eventsParticipantsSetAavailable($event)" -->
                <el-option
                  v-for="participant in eventsParticipantsListAvailable"
                  :key="participant.memberId"
                  :label="`${participant.member.firstName} ${participant.member.lastName}`"
                  :value="participant.memberId"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="" prop="class" class="px-2 w-full">
              <el-select
                v-model="contestantForm.classId"
                placeholder="Select a class"
                :loading="classesListIsLoading"
              >
                <el-option
                  v-for="classItem in classesList"
                  :key="classItem._id"
                  :label="classItem.name"
                  :value="classItem._id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="" prop="calibre" class="pl-2 w-full">
              <el-input placeholder="Enter a calibre" v-model="contestantForm.calibre" />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="py-5 border-l" style="min-width: 235px;">
        <h4 class="h4 mb-2 px-5">Available participants</h4>

        <div class="flex flex-col px-5">
          <div class="">
            <h6 class="h6 inline">Contestants:</h6> {{ eventsParticipantsList.length }}
          </div>
          <div class="">
            <h6 class="h6 inline">Ends at:</h6> {{ eventsDivisionsEndsAt }}
          </div>
        </div>

        <ul class="mt-4">
          <li
            v-for="participant in eventsParticipantsListAvailable"
            :key="participant._id"
            class="px-5"
          >
            {{ participant.member.firstName }} {{ participant.member.lastName }}
          </li>
        </ul>
      </div>
    </div>

    <template slot="footer">
      <div class="dialog-footer">
        <el-button
          class="block"
          type="default"
          @click="eventsDivisionsCreateDialogClose"
        >
          Close
        </el-button>
        <el-button
          class="block"
          type="primary"
          @click="eventsDivisionsCreateDialogSave"
        >
          Save
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex"
import { stub } from "@/db/events/divisions"

const contestantStub = {
  time: "",
  classId: "",
  memberId: ""
}

const parseTimeInput = (s) => {
  return {
    hours: parseInt(s.split(":")[0], 10),
    minutes: parseInt(s.split(":")[1], 10)
  }
}

const formatTime = (minutes) => {
  let endsAtHour = Math.floor(minutes / 60)
  let endsAtMinute = minutes % 60
  endsAtHour = (endsAtHour < 10) ? `0${endsAtHour}` : endsAtHour
  endsAtMinute = (endsAtMinute < 10) ? `0${endsAtMinute}` : endsAtMinute
  return `${endsAtHour}:${endsAtMinute}`
}

const toMinutes = (hours, minutes) => {
  return (hours * 60) + minutes
}

export default {
  name: "EventsDivisionsCreateDialog",

  props: {
    shown: { type: Boolean, default: false },
    event: { type: Object, required: true }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  computed: {
    ...mapState("events/divisions", {
      eventsDivisionsCreateIsLoading: "createIsLoading"
    }),
    ...mapState("events/participants", {
      eventsParticipantsListIsLoading: "listIsLoading",
      eventsParticipantsCount: "count",
      eventsParticipantsList: "list"
    }),
    ...mapState("classes", {
      classesListIsLoading: "listIsLoading",
      classesCount: "count",
      classesList: "list"
    }),
    eventsDivisionsContestantsIsConfigured() {
      return this.eventsDivisionsForm.startsAt && this.eventsDivisionsForm.interval
    },
    starts() {
      return parseTimeInput(this.eventsDivisionsForm.startsAt)
    },
    interval() {
      return parseTimeInput(this.eventsDivisionsForm.interval)
    },
    eventsDivisionsEndsAt() {
      if(!this.eventsDivisionsContestantsIsConfigured) {
        return
      }

      const amount = this.eventsParticipantsList.length
      const starts = toMinutes(this.starts.hours, this.starts.minutes)
      const interval = toMinutes(this.interval.hours, this.interval.minutes)

      return formatTime(starts + (interval * amount))
    }
  },

  data: function() {
    return {
      visible: this.shown,
      eventsDivisionsForm: { ...stub },
      eventsDivisionsFormRules: {
        name: { required: true, message: "Name is a required field" },
        day: { required: true, message: "Day is a required field" },
        startsAt: { required: true, message: "Starts At is a required field" },
        interval: { required: true, message: "Shooting Interval is a required field" }
      },

      eventsDivisionsFormTimePickerOptions: { start: "00:00", step: "00:05", end: "23:59" },
      intervals: [
        { label: '5 min', value: '00:05' },
        { label: '10 min', value: '00:10' },
        { label: '15 min', value: '00:15' },
        { label: '20 min', value: '00:20' },
        { label: '25 min', value: '00:25' },
        { label: '30 min', value: '00:30' }
      ],
      eventsDivisionsContestantsForms: [],

      eventsParticipantsListAvailable: [],

      eventsDivisionsFormDayPickerOptions: {
        disabledDate: this.eventsDivisionsFormDayPickerOptionsDisabledDate
      }
    }
  },

  methods: {
    eventsDivisionsFormDayPickerOptionsDisabledDate(day) {
      const time = day.getTime()
      return time < this.event.startsAt || time > this.event.endsAt
    },

    eventsParticipantsSetUnavailable(id) {
      this.eventsParticipantsListAvailable = this.eventsParticipantsListAvailable.filter(
        ({ memberId }) => memberId !== id
      )
    },

    // eventsParticipantsSetAavailable() {
    //   console.log(participantId)
    //
    //   // const participant = this.eventsParticipantsList.filter(
    //   //   ({ _id }) => _id === participantId
    //   // )[0]
    //
    //   // console.log(participant)
    //
    //   this.eventsParticipantsListAvailable = [
    //     ...this.eventsParticipantsListAvailable
    //     // { ...participant }
    //   ]
    // },

    async eventsDivisionsCreateDialogOpen() {
      this.eventsParticipantsSetListFilter({ eventId: this.event._id })
      await this.eventsParticipantsListAsync()
      await this.classesListAsync()
      this.eventsParticipantsListAvailable = [ ...this.eventsParticipantsList ]
    },

    generateContestantList() {
      const contestantsForm = []
      for(let i = 0; this.eventsParticipantsList.length > i; i++) {
        const stub = { ...contestantStub }

        const starts = toMinutes(this.starts.hours, this.starts.minutes)
        const interval = toMinutes(this.interval.hours, this.interval.minutes)
        stub.time = formatTime(starts + (interval * i))

        contestantsForm.push(stub)
      }
      this.eventsDivisionsContestantsForms = contestantsForm
    },

    ...mapMutations("events/participants", {
      eventsParticipantsSetListFilter: "SET_LIST_FILTER"
    }),
    ...mapActions("events/participants", {
      eventsParticipantsListAsync: "listAsync"
    }),
    ...mapActions("classes", {
      classesListAsync: "listAsync"
    }),
    ...mapActions("events/divisions", {
      eventsDivisionsCreateAsync: "createAsync"
    }),

    eventsDivisionsCreateDialogSave() {
      this.$refs.eventsDivisionsForm.validate((isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: "Please fill in all required fields before saving"
          })
        }
      })

      this.eventsDivisionsCreate(this.eventsDivisionsForm, this.eventsDivisionsContestantsForms)
    },

    async eventsDivisionsCreate(division, contestants) {
      division.eventId = this.event._id
      division.contestants = contestants
      division.endsAt = this.eventsDivisionsEndsAt

      try {
        await this.eventsDivisionsCreateAsync(division)
        this.$notify({
          type: "success",
          title: "Great success",
          message: `${division.name} was successfully added to the database`
        })
        this.eventsDivisionsFormClear()
        this.eventsDivisionsCreateDialogClose()
      } catch(e) {
        this.$notify({ type: "error", title: "Oops!", message: e.message })
      }
    },

    eventsDivisionsFormClear() {
      this.eventsDivisionsForm = { ...stub }
    },

    eventsDivisionsCreateDialogClose() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
