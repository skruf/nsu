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
    class="flex"
    label-position="top"
    :model="localForm"
  >
    <el-form-item
      label=""
      prop="time"
      class="w-32"
    >
      {{ localForm.time }}
    </el-form-item>

    <el-form-item
      label=""
      prop="participant"
      class="pl-2 w-full"
    >
      <el-select
        v-model="localForm.memberId"
        filterable
        :placeholder="$t('formItem1Placeholder')"
        @change="setWeapons(localForm.memberId)"
      >
        <el-option
          v-for="participant in participants"
          :key="participant.memberId"
          :label="`${participant.member.firstName} ${participant.member.lastName}`"
          :value="participant.memberId"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label=""
      prop="weapon"
      class="pl-2 w-full"
    >
      <el-select
        v-model="localForm.weapon"
        filterable
        value-key="id"
        :disabled="weapons.length < 1"
        :placeholder="$t('formItem2Placeholder')"
        @change="updateForm"
      >
        <el-option
          v-for="(weapon, index) in weapons"
          :key="index"
          :label="`${weapon.class.name} (${weapon.calibre})`"
          :value="weapon"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import { eventsDivisionsContestantsStub } from "@/stubs"

export default {
  name: "EventsDivisionsContestantsForm",

  props: {
    form: { type: Object, required: true },
    participants: { type: Array, required: true }
  },

  data: function() {
    return {
      localForm: { ...eventsDivisionsContestantsStub },
      weapons: []
    }
  },

  computed: {
    currentParticipant() {
      const memberId = this.localForm.memberId
      const index = this.participants.findIndex((p) => p.memberId === memberId)
      return this.participants[index]
    }
  },

  created() {
    this.localForm = { ...this.form }
    if(this.currentParticipant) this.setWeapons()
  },

  methods: {
    setWeapons() {
      this.weapons = this.currentParticipant.weapons
    },
    updateForm() {
      this.$emit("update:form", this.localForm)
    }
  }
}
</script>
