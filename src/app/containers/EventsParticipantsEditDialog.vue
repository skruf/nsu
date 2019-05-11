<i18n>
{
  "en": {
    "title": "Edit participant %{member}",
    "formItem1Label": "Class(es)",
    "formItem1Placeholder": "Select one or more class(es)",
    "formItem2Label": "Calibre(s)",
    "formItem2Placeholder": "Select one or more calibre(s)",
    "eventsParticipantsActionsEditOneSuccess": "Participant %{member} was updated"
  },
  "no": {
    "title": "Rediger deltaker %{member}",
    "formItem1Label": "Klasser",
    "formItem1Placeholder": "Velg en eller flere klasser",
    "formItem2Label": "Kaliber",
    "formItem2Placeholder": "Velg en eller flere kaliber",
    "eventsParticipantsActionsEditOneSuccess": "Deltakeren %{member} ble oppdatert"
  }
}
</i18n>

<style lang="stylus">
.calibre
  width calc(33.3333% - 0.67rem)
  margin-right 1rem
  &:nth-child(3n)
    margin-right 0
</style>

<template>
  <el-dialog
    custom-class="edit-dialog"
    :title="$t('title', { member: memberFullName })"
    :append-to-body="true"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <div
      v-loading="eventsParticipantsStateEditIsLoading"
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
import _get from "lodash.get"
import { mapActions, mapState } from "vuex"
// import _cloneDeep from "lodash.cloneDeep"
// import { eventsParticipantsStub } from "~/stubs"
const eventsParticipantsStub = { classId: "", calibre: "" }

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
      forms: [],
      formRules: {
        classId: { required: true, message: "Choose a class" },
        calibre: { required: true, message: "Enter a calibre" }
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
      const firstName = _get(this.participant, "member.firstName", "")
      const lastName = _get(this.participant, "member.lastName", "")
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

    addWeapon() {
      this.forms.push({ ...eventsParticipantsStub })
    },

    removeWeapon(i) {
      if(this.forms.length !== 1) this.forms.splice(i, 1)
    },

    async open() {
      this.forms = this.participant.weapons.map((weapon) => ({
        calibre: weapon.calibre, classId: weapon.class.id
      }))
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
        await this.eventsParticipantsActionsEditOne({
          ...this.participant,
          weapons: this.forms
        })
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsParticipantsActionsEditOneSuccess", {
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
