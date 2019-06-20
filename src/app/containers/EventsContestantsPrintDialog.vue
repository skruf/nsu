<i18n>
{
  "en": {
    "title": "Print contestant label",
    "subtitle": "For %{event}",
    "print": "Print"
  },
  "no": {
    "title": "Skriv ut deltakerlapp",
    "subtitle": "For %{event}",
    "print": "Skriv ut"
  }
}
</i18n>

<style lang="stylus">
.events-contestants-print-dialog .el-dialog__body
  flex-direction column
</style>

<template>
  <el-dialog
    custom-class="events-contestants-print-dialog"
    :fullscreen="true"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <template slot="title">
      <h3 class="h3">
        {{ $t("title") }}
      </h3>
      <small class="small">
        {{ $t("subtitle", { event: eventsStateSelected.title }) }}
      </small>
    </template>

    <div
      v-for="contestant in contestants"
      :key="contestant.id"
      class="h-full flex flex-col items-start p-5"
    >
      <div class="flex">
        <div class="w-32">
          Dato:
        </div>
        <div>
          {{ contestant.division.day }}
        </div>
      </div>
      <div class="flex">
        <div class="w-32">
          Klokken:
        </div>
        <div>
          {{ contestant.division.time }}
        </div>
      </div>
      <div class="flex">
        <div class="w-32">
          Skytter nr:
        </div>
        <div>
          {{ contestant.participant.number }}
        </div>
      </div>
      <div class="flex">
        <div class="w-32">
          Standplass nr:
        </div>
        <div>
          {{ contestant.stand }}
        </div>
      </div>
      <div class="flex">
        <div class="w-32">
          Klasse:
        </div>
        <div>
          {{ contestant.weapon.class.name }}
        </div>
      </div>
    </div>

    <template slot="footer">
      <el-button
        class="block"
        type="text"
        @click="close"
      >
        {{ $t("close") }}
      </el-button>
      <el-button
        class="block"
        type="primary"
        @click="print"
      >
        {{ $t("print") }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex"
import kebabcase from "~/utils/kebabcase"

export default {
  name: "EventsContestantsPrintDialog",

  props: {
    shown: { type: Boolean, default: false },
    contestants: { type: Array, required: true }
  },

  data: function() {
    return {
      visible: this.shown
    }
  },

  computed: {
    ...mapState("events", {
      "eventsStateSelected": "selected"
    })
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    print() {
      const count = this.contestants.length
      const eventTitle = kebabcase(this.eventsStateSelected.title)
      let number
      if(count === 1) {
         number = `skyttenr-${this.contestants[0].participant.number}`
      } else {
        number = `${count}-deltakere`
      }
      const fileName = `${eventTitle}-${number}-deltakerlapp`
      window.electron.ipcRenderer.send("PRINT_WINDOW", fileName)
    },
    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
