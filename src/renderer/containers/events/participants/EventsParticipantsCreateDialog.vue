<style lang="stylus">
</style>

<template>
  <el-dialog
    :title="`Add ${memberFullName} to the event`"
    custom-class="create-dialog"
    :append-to-body="true"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <div
      v-loading="eventsParticipantsStateCreateIsLoading"
      class="dialog_content"
    >
      <el-form
        ref="eventsParticipantsCreateForm"
        label-position="top"
        :model="eventsParticipantsCreateForm"
        :rules="eventsParticipantsCreateFormRules"
      >
        <el-form-item
          label="Class(es)"
          prop="classes"
        >
          <el-select
            v-model="eventsParticipantsCreateForm.classes"
            placeholder="Select one or more class(es)"
            :loading="classesStateListIsLoading"
            multiple
          >
            <el-option
              v-for="classItem in classesStateList"
              :key="classItem.id"
              :label="classItem.name"
              :value="classItem.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="Calibre(s)"
          prop="calibres"
        >
          <el-select
            v-model="eventsParticipantsCreateForm.calibres"
            placeholder="Select one or more calibre(s)"
            multiple
          >
            <el-option
              v-for="(calibre, index) in [
                '5mm', '10mm', '15mm', '20mm', '25mm', '30mm', '35mm'
              ]"
              :key="index"
              :label="calibre"
              :value="calibre"
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
import { eventsParticipantsStub } from "@/stubs"

export default {
  name: "EventsParticipantsCreateDialog",

  props: {
    shown: { type: Boolean, default: false },
    event: { type: Object, required: true },
    member: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: false,
      eventsParticipantsCreateForm: { ...eventsParticipantsStub },
      eventsParticipantsCreateFormRules: {
        memberId: { required: true, message: "Member is a required field" },
        eventId: { required: true, message: "Event is a required field" },
        classes: { required: true, message: "Choose at least one class" },
        calibres: { required: true, message: "Choose at least one calibre" }
      }
    }
  },

  computed: {
    ...mapState("events/participants", {
      eventsParticipantsStateCreateIsLoading: "createIsLoading"
    }),

    ...mapState("classes", {
      classesStateListIsLoading: "listIsLoading",
      classesStateList: "list"
    }),

    memberFullName() {
      if(!this.member) return ""
      return `${this.member.firstName} ${this.member.lastName}`
    }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    ...mapActions("events/participants", {
      eventsParticipantsActionsCreate: "create"
    }),

    ...mapActions("classes", {
      classesActionsList: "list"
    }),

    async open() {
      await this.classesActionsList()
      this.eventsParticipantsCreateForm.memberId = this.member.id
      this.eventsParticipantsCreateForm.eventId = this.event.id
    },

    async submit() {
      this.$refs.eventsParticipantsCreateForm.validate(async (isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: "Please fill in all required fields before saving"
          })
        }

        try {
          await this.eventsParticipantsActionsCreate(this.eventsParticipantsCreateForm)

          this.$notify({
            type: "success",
            title: "Success",
            message: `${this.memberFullName} was added to the event`
          })

          // await this.eventsParticipantsActionsList()

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
      this.eventsParticipantsCreateForm = { ...eventsParticipantsStub }
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
