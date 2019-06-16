<i18n>
{
  "en": {
    "formItem1Placeholder": "Select a participant",
    "formItem2Placeholder": "Select a weapon",
    "formItem3Placeholder": "Enter a calibre"
  },
  "no": {
    "formItem1Placeholder": "Velg en deltaker",
    "formItem2Placeholder": "Velg ett våpen",
    "formItem3Placeholder": "Skriv inn kaliber"
  }
}
</i18n>

<template>
  <el-form
    ref="form"
    class="flex items-center"
    label-position="top"
    :model="localForm"
  >
    <div class="w-48 mb-5">
      {{ form.stand }}
    </div>

    <el-form-item
      label=""
      prop="participant"
      class="pl-2 w-full"
    >
      <el-select
        v-model="localForm.participantId"
        filterable
        :placeholder="$t('formItem1Placeholder')"
        @change="changeParticipant"
      >
        <el-option
          v-for="participant in participants"
          :key="participant.id"
          :label="`${participant.member.firstName} ${participant.member.lastName}`"
          :value="participant.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label=""
      prop="weapon"
      class="pl-2 w-full"
    >
      <el-select
        v-model="localForm.weaponId"
        filterable
        :disabled="weapons.length < 1"
        :placeholder="$t('formItem2Placeholder')"
        @change="updateForm"
      >
        <el-option
          v-for="(weapon, i) in weapons"
          :key="weapon.id"
          :label="`${weapon.class.name} (${weapon.calibre})`"
          :value="weapon.id"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import { eventsContestantsStub } from "~/stubs"

export default {
  name: "EventsContestantsForm",

  props: {
    form: { type: Object, required: true },
    participants: { type: Array, required: true }
  },

  data: function() {
    return {
      localForm: { ...eventsContestantsStub },
      weapons: []
    }
  },

  computed: {
    currentParticipant() {
      const participantId = this.localForm.participantId
      const index = this.participants.findIndex((p) => p.id === participantId)
      return this.participants[index]
    }
  },

  created() {
    this.localForm = this.form
    if(this.currentParticipant) {
      this.changeParticipant()
    }
  },

  methods: {
    changeParticipant() {
      this.weapons = this.currentParticipant.weapons
      this.localForm.memberId = this.currentParticipant.memberId
    },
    updateForm() {
      this.$emit("update:form", this.localForm)
    }
  }
}
</script>
