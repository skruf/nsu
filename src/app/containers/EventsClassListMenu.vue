<i18n>
{
  "en": {
    "title": "Select a class",
    "placeholderText": "No classes yet."
  },
  "no": {
    "title": "Velg en klasse",
    "placeholderText": "Ingen klasser enda."
  }
}
</i18n>

<template>
  <div
    v-loading="isLoading"
    class="dialog_sidebar p-5"
  >
    <h5 class="h5 pb-2">
      {{ $t("title") }}
    </h5>

    <ul>
      <li
        v-for="weaponClass in list"
        :key="weaponClass.id"
        class="mt-2 card card-clickable"
        :class="{ 'is-active': isActive(weaponClass) }"
        @click="selectClass(weaponClass)"
      >
        <div class="w-full">
          <h6 class="h6 inline mr-2">
            {{ weaponClass.name }}
          </h6>
          ({{ weaponClass.condition }})
        </div>
        <i class="el-icon-arrow-right" />
      </li>
    </ul>

    <div
      v-if="!list.length"
      class="data-placeholder"
    >
      {{ $t("placeholderText") }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { db } from "~/db"

export default Vue.extend({
  name: "EventsClassListMenu",

  props: {
    event: { type: Object, required: true }
  },

  data: () => ({
    isLoading: false,
    list: [],
    selected: null,
    sub: null
  }),

  created() {
    this.refresh()
  },

  beforeDestroy() {
    if(this.sub) this.sub.unsubscribe()
  },

  methods: {
    selectClass(weaponClass) {
      this.selected = weaponClass
      this.$emit("selectClass", weaponClass)
    },

    isActive(weaponClass) {
      return this.selected && this.selected.id === weaponClass.id
    },

    async refresh() {
      this.isLoading = true

      const observer = (list) => {
        this.list = list
        this.isLoading = false
      }

      const errorHandler = (e) => {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }

      const contestants = await db.events_contestants
        .find({ eventId: this.event.id })
        .exec()

      const weaponIds = contestants.map(({ weaponId }) => weaponId)
      const weapons = await db.events_participants_weapons.find()
        .where("id")
        .in(weaponIds)
        .exec()

      const classIds = weapons.map(({ classId }) => classId)
      this.sub = db.classes.find()
        .where("id")
        .in(classIds)
        .$.subscribe(observer, errorHandler)
    }
  }
})
</script>
