<style lang="stylus">
</style>

<template>
  <el-dialog
    custom-class="edit-dialog"
    :title="`Edit participant ${memberFullName}`"
    :append-to-body="true"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <div
      v-loading="eventsParticipantsStateEditIsLoading"
      class="dialog_content"
    >
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="formRules"
      >
        <el-form-item
          label="Class(es)"
          prop="classes"
        >
          <el-select
            v-model="form.classes"
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
            v-model="form.calibres"
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
import _get from "lodash.get"
import { mapActions, mapState } from "vuex"
import { eventsParticipantsStub } from "@/stubs"

export default {
  name: "EventsParticipantsEditDialog",

  props: {
    shown: { type: Boolean, default: false },
    event: { type: Object, required: true },
    participant: { type: Object, default: () => eventsParticipantsStub }
  },

  data: function() {
    return {
      visible: false,
      form: { ...eventsParticipantsStub },
      formRules: {
        memberId: { required: true, message: "Member is a required field" },
        eventId: { required: true, message: "Event is a required field" },
        classes: { required: true, message: "Choose at least one class" },
        calibres: { required: true, message: "Choose at least one calibre" }
      }
    }
  },

  computed: {
    ...mapState("events/participants", {
      eventsParticipantsStateEditIsLoading: "editIsLoading"
    }),

    ...mapState("classes", {
      classesStateListIsLoading: "listIsLoading",
      classesStateList: "list"
    }),

    memberFullName() {
      const firstName = _get(this.participant, "participant.member.firstName", "")
      const lastName = _get(this.participant, "participant.member.lastName", "")
      return `${firstName} ${lastName}`
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
      eventsParticipantsActionsEditOne: "editOne"
    }),

    ...mapActions("classes", {
      classesActionsList: "list"
    }),

    async open() {
      this.form = { ...this.participant }
      await this.classesActionsList()
    },

    async submit() {
      this.$refs.form.validate(async (isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: "Please fill in all required fields before saving"
          })
        }

        try {
          await this.eventsParticipantsActionsEditOne(this.form)
          this.$notify({
            type: "success",
            title: "Success",
            message: `Was updated`
            // message: `${this.memberFullName} was updated`
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
      this.form = { ...eventsParticipantsStub }
    },

    close() {
      this.clear()
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
