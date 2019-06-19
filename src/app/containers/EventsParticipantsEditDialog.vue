<i18n>
{
  "en": {
    "title": "Edit participant %{member}",
    "formItem1Label": "Class",
    "formItem1Placeholder": "Select a class",
    "formItem2Label": "Calibre(s)",
    "formItem2Placeholder": "Enter a calibre",
    "saveSuccess": "Participant %{member} was updated"
  },
  "no": {
    "title": "Rediger deltaker %{member}",
    "formItem1Label": "Klasse",
    "formItem1Placeholder": "Velg en klasser",
    "formItem2Label": "Kaliber",
    "formItem2Placeholder": "Skriv inn et kaliber",
    "saveSuccess": "Deltakeren %{member} ble oppdatert"
  }
}
</i18n>

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
      v-loading="isLoading"
      class="dialog_content"
    >
      <el-form
        class=""
        label-position="top"
        :model="participantNumberForm"
      >
        <el-form-item
          prop="participantNumberForm"
          label="Nr"
        >
          <el-input
            v-model="participantNumberForm"
            type="number"
            placeholder="Nr"
          />
        </el-form-item>
      </el-form>

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

      <div class="flex">
        <div class="w-2/3 mr-2">
          {{ $t('formItem1Label') }}
        </div>

        <div class="w-1/3 mr-2">
          {{ $t('formItem2Label') }}
        </div>

        <div class="w-10" />
      </div>

      <el-form
        v-for="(form, index) in weaponForms"
        :key="index"
        ref="weaponForms"
        label-position="top"
        class="flex"
        :model="form"
        :rules="weaponFormRules"
      >
        <el-form-item
          prop="classId"
          class="w-2/3 mr-2"
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
          class="w-1/3 mr-2"
        >
          <el-input
            v-model="form.calibre"
            :placeholder="$t('formItem2Label')"
          />
        </el-form-item>

        <el-button
          class="self-center text-center w-10"
          style="margin-bottom: 18px;"
          type="text"
          size="mini"
          @click="removeWeapon(form)"
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
        @click="save"
      >
        {{ $t("save") }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { db } from "~/db"
import _get from "lodash.get"
import { mapActions, mapState } from "vuex"
import { eventsParticipantsWeaponsStub } from "~/stubs"

export default {
  name: "EventsParticipantsEditDialog",

  props: {
    shown: { type: Boolean, default: false },
    event: { type: Object, required: true },
    participant: { type: Object, required: true }
  },

  data: () => ({
    visible: false,
    isLoading: false,
    participantNumberForm: 0,
    weaponForms: [],
    weaponFormRules: {
      classId: { required: true, message: "Choose a class" },
      calibre: { required: true, message: "Enter a calibre" }
    },
    weaponsToRemove: [],
    sub: null,
    weaponDocs: []
  }),

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

  beforeDestroy() {
    if(this.sub) this.sub.unsubscribe()
  },

  methods: {
    ...mapActions("classes", {
      classesActionsList: "list"
    }),

    addWeapon() {
      const form = { ...eventsParticipantsWeaponsStub }
      form.participantId = this.participant.id
      this.weaponForms.push(form)
    },

    removeWeapon(weapon) {
      if(this.weaponForms.length !== 1) {
        this.weaponForms.splice(
          this.weaponForms.findIndex((form) => form.id === weapon.id), 1
        )
        if(weapon.exists) {
          this.weaponsToRemove.push(weapon)
        }
      }
    },

    async open() {
      const query = db.events_participants_weapons.find({
        participantId: this.participant.id
      })

      this.participantNumberForm = this.participant.number

      this.sub = query.$.subscribe((weapons) => {
        this.weaponDocs = weapons
        this.weaponForms = weapons.map((doc) => {
          const weapon = doc.toJSON()
          weapon.existing = true
          return weapon
        })
      })

      if(this.weaponForms.length === 0) this.addWeapon()
      await this.classesActionsList()
    },

    validate() {
      return Promise.all(this.$refs.weaponForms.map(
        (form) => new Promise((resolve, reject) => {
          form.validate((isValid) => {
            isValid ? resolve() : reject(new Error())
          })
        })
      ))
    },

    async save() {
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
        const toCreate = this.weaponForms.filter((form) => !form.existing)
        const created = await Promise.all(toCreate.map(
          (weapon) => db.events_participants_weapons.insert(weapon)
        ))

        const toEdit = this.weaponForms.filter((form) => !!form.existing)
        const edited = await Promise.all(toEdit.map((weapon) => {
          delete weapon.existing
          const doc = this.weaponDocs.find((d) => d.id === weapon.id)
          return doc.atomicUpdate((data) => ({ ...data, ...weapon }))
        }))

        await Promise.all(this.weaponsToRemove.map(
          (weapon) => weapon.remove()
        ))

        this.sub.next([ ...created, ...edited ])

        const number = parseInt(this.participantNumberForm, 10)
        if(number !== this.participant.number) {
          await this.participant.atomicSet("number", number)
        }

        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("saveSuccess", {
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

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
