<i18n>
{
  "en": {
    "title": "Add %{member} to the event",
    "formItem1Label": "Class",
    "formItem1Placeholder": "Choose a class",
    "formItem2Label": "Calibre",
    "formItem2Placeholder": "Enter a calibre"
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
    <div class="dialog_content">
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
            :loading="classesIsLoading"
            filterable
          >
            <el-option
              v-for="classItem in classes"
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
import DB from "~/db"
import _get from "lodash.get"
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
      },

      classesIsLoading: false,
      classes: []
    }
  },

  computed: {
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
    addWeapon() {
      this.forms.push({ ...eventsParticipantsStub })
    },

    removeWeapon(i) {
      if(this.forms.length !== 1) this.forms.splice(i, 1)
    },

    async open() {
      if(this.forms.length === 0) this.addWeapon()
      this.classesIsLoading = true
      const db = await DB.get()
      db.classes.find().$.subscribe((classes) => {
        this.classes = classes
      })
      this.classesIsLoading = false
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

      const weapons = this.forms.map((weapon) => ({
        ...weapon,
        class: this.classes.filter(
          ({ id }) => id === weapon.classId
        )[0]
      }))

      this.$emit("add", {
        weapons,
        memberId: this.member.id,
        eventId: this.event.id,
        member: this.member
      })

      this.close()
      this.clear()
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
