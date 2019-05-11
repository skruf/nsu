<i18n>
{
  "en": {
    "title": "Add %{member} to the event",
    "formItem1Label": "Class",
    "formItem1Placeholder": "Choose a class",
    "formItem2Label": "Calibre",
    "formItem2Placeholder": "Enter a calibre",
    "eventsParticipantsActionsCreateSuccess": "%{member} was added to the event"
  },
  "no": {
    "title": "Legg %{member} til stevnet",
    "formItem1Label": "Klasse",
    "formItem1Placeholder": "Velg en klasse",
    "formItem2Label": "Kaliber",
    "formItem2Placeholder": "Skriv inn ett kaliber",
    "eventsParticipantsActionsCreateSuccess": "%{member} ble lagt til stevnet"
  }
}
</i18n>

<template>
  <el-dialog
    custom-class="create-dialog"
    :title="$t('title', { member: memberFullName })"
    :append-to-body="true"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <div
      v-loading="eventsParticipantsStateCreateIsLoading"
      class="dialog_content"
    >
      <div class="flex mb-2 justify-between">
        <h6 class="h6">
          Add weapons
        </h6>
        <el-button
          type="text"
          size="mini"
          @click="addWeapon"
        >
          <i class="el-icon-plus el-icon--left" /> New weapon
        </el-button>
      </div>

      <el-form
        v-for="(form, index) in forms"
        :key="index"
        ref="forms"
        label-position="top"
        class="flex"
        :model="form"
        :rules="formRules"
      >
        <el-form-item
          prop="classId"
          class="w-1/2 mr-2"
          :label="$t('formItem1Label')"
        >
          <el-select
            v-model="form.classId"
            :placeholder="$t('formItem1Placeholder')"
            :loading="classesStateListIsLoading"
            filterable
          >
            <el-option
              v-for="classItem in classesStateList"
              :key="classItem.id"
              :label="`${classItem.name} (${classItem.condition})`"
              :value="classItem.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          prop="calibre"
          class="w-1/2 mx-2"
          :label="$t('formItem2Label')"
        >
          <el-input
            v-model="form.calibre"
            :placeholder="$t('formItem2Label')"
          />
        </el-form-item>

        <el-button
          class="self-center mt-5"
          type="text"
          size="mini"
          @click="removeWeapon(index)"
        >
          <i class="el-icon-minus" />
        </el-button>
      </el-form>
    </div>

    <template slot="footer">
      <el-button
        class="block"
        type="text"
        size="small"
        @click="close"
      >
        {{ $t("cancel") }}
      </el-button>
      <el-button
        class="block"
        type="primary"
        size="small"
        @click="submit"
      >
        {{ $t("save") }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import _get from "lodash.get"
import { mapActions, mapState } from "vuex"
// import { eventsParticipantsStub } from "~/stubs"
const eventsParticipantsStub = { classId: "", calibre: "" }

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
      forms: [{ ...eventsParticipantsStub }],
      formRules: {
        classId: { required: true, message: "Choose a class" },
        calibre: { required: true, message: "Enter a calibre" }
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
      const firstName = _get(this.member, "firstName", "")
      const lastName = _get(this.member, "lastName", "")
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
      eventsParticipantsActionsCreate: "create"
    }),
    ...mapActions("classes", {
      classesActionsList: "list"
    }),

    addWeapon() {
      this.forms.push({ ...eventsParticipantsStub })
    },

    removeWeapon(i) {
      if(this.forms.length !== 1) this.forms.splice(i, 1)
    },

    async open() {
      if(this.forms.length === 0) this.addWeapon()
      await this.classesActionsList()
    },

    validate() {
      return Promise.all(this.$refs.forms.map(
        (form) => new Promise((resolve, reject) => {
          form.validate((isValid) => {
            isValid ? resolve() : reject(new Error())
          })
        })
      ))
    },

    async submit() {
      try {
        await this.validate()
      } catch(e) {
        return this.$notify({
          type: "error",
          title: "Oops!",
          message: this.$t("validationError")
        })
      }

      try {
        await this.eventsParticipantsActionsCreate({
          memberId: this.member.id,
          eventId: this.event.id,
          weapons: this.forms
        })
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsParticipantsActionsCreateSuccess", {
            member: this.memberFullName
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
    },

    clear() {
      this.forms = [{ ...eventsParticipantsStub }]
    },

    close() {
      this.clear()
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
