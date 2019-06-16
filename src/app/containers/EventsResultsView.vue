<template>
  <div class="events-results-view flex h-full w-full">
    <events-class-list-menu
      ref="eventsClassListMenu"
      :event="event"
      @selectClass="setSelectedClass"
    />

    <div class="flex-1 flex flex-col">
      <template v-if="selectedClass">
        <div class="content">
          <events-results-list-table
            :event="event"
            :weapon-class="selectedClass"
            @openEventsResultsManageDialog="openEventsResultsManageDialog"
          />
        </div>

        <el-footer height="auto">
          <el-button
            type="primary"
            @click="openEventsResultsManageDialog"
          >
            <i class="ion-ios-keypad el-icon--left" />
            Håndter resultater
          </el-button>
        </el-footer>
      </template>

      <div
        v-else
        class="data-placeholder"
      >
        Velg en klasse først
      </div>
    </div>

    <events-results-manage-dialog
      :shown.sync="showEventsResultsManageDialog"
      :weapon-class="selectedClass"
      :event="event"
    />
  </div>
</template>

<script>
import Vue from "vue"
import EventsResultsListTable from "~/containers/EventsResultsListTable"
import EventsResultsManageDialog from "~/containers/EventsResultsManageDialog"
import EventsClassListMenu from "~/containers/EventsClassListMenu"

export default Vue.extend({
  name: "EventsResultsView",

  components: {
    EventsResultsListTable,
    EventsResultsManageDialog,
    EventsClassListMenu
  },

  props: {
    event: { type: Object, required: true }
  },

  data: () => ({
    showEventsResultsManageDialog: false,
    selectedClass: null
  }),

  methods: {
    setSelectedClass(weaponClass) {
      this.selectedClass = weaponClass
    },
    openEventsResultsManageDialog() {
      this.showEventsResultsManageDialog = true
    },
    refresh() {
      this.$refs.eventsClassListMenu.refresh()
    }
  }
})
</script>
