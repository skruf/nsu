<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for participants by first or last name",
    "column1Label": "Name",
    "column2Label": "Club",
    "column3Label": "Weapons",
    "column4Label": "Added On",
    "removeSelected": "Remove selected",
    "editParticipant": "Edit participant",
    "removeParticipant": "Remove participant",
    "tablePlaceholderText": "No participants yet. Add a division with participants first.",
    "eventsParticipantsRemoveOneConfirmation": "This will remove %{member} from the event permanently. Continue?",
    "eventsParticipantsActionsRemoveOneSuccess": "%{member} was removed from the event",
    "eventsParticipantsRemoveManyConfirmation": "This will remove %{members} participants from the event permanently. Continue?",
    "eventsParticipantsActionsRemoveManySuccess": "%{members} participants were removed from the event"
  },
  "no": {
    "searchFormPlaceholder": "Søk etter deltakere med fornavn eller etternavn",
    "column1Label": "Deltaker",
    "column2Label": "Klubb",
    "column3Label": "Våpen",
    "column4Label": "Lagt til",
    "removeSelected": "Slett valgte",
    "editParticipant": "Rediger deltaker",
    "removeParticipant": "Slett deltaker",
    "tablePlaceholderText": "Ingen deltakere enda. Legg til en standplassliste med deltakere først.",
    "eventsParticipantsRemoveOneConfirmation": "Dette vil fjerne %{member} fra stevnet permanent. Fortsett?",
    "eventsParticipantsActionsRemoveOneSuccess": "%{member} ble fjernet fra stevnet",
    "eventsParticipantsRemoveManyConfirmation": "Dette vil fjerne %{members} deltakere fra stevnet permanent. Fortsett?",
    "eventsParticipantsActionsRemoveManySuccess": "%{members} deltakere ble fjernet fra stevnet"  }
}
</i18n>

<style lang="stylus">
  .participant_attributes
    .small:not(:last-child):after
      content "•"
</style>

<template>
  <div class="events-startlist-list-table">
    <search-form
      v-model="searchFilter"
      class="mb-5"
      :placeholder="$t('searchFormPlaceholder')"
      @submit="submitSearchFilter"
    />

    <div v-loading="isLoading">
      <el-table
        :data="tableData"
        :default-sort="{ prop: tableSortField, order: tableSortOrder }"
        row-key="id"
        class="table-clickable"
        empty-text
        @selection-change="tableSelectionChange"
        @row-click="tableRowClick"
        @sort-change="tableSortChange"
      >
        <el-table-column
          type="selection"
          width="40"
        />

        <el-table-column
          width="70"
          label="Nr"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.participant.number }}
            </h6>
          </template>
        </el-table-column>

        <el-table-column
          prop="participantId"
          width="60px"
        >
          <template slot-scope="scope">
            <avatar
              :first-name="scope.row.participant.member.firstName"
              :last-name="scope.row.participant.member.lastName"
              size="small"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="participantId"
          label="Deltaker"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.participant.member.firstName }} {{ scope.row.participant.member.lastName }}
            </h6>
          </template>
        </el-table-column>

        <el-table-column
          prop="participantId"
          label="Klubb"
        >
          <template slot-scope="scope">
            {{ scope.row.participant.member.club.name }}
          </template>
        </el-table-column>

        <el-table-column
          prop="division.day"
          label="Dato"
        />

        <el-table-column
          prop="division.time"
          label="Tid"
        />

        <el-table-column
          prop="division.distance"
          label="Distanse"
        />

        <el-table-column
          prop="stand"
          width="70"
          label="Bane"
          :sort-orders="tableSortOrders"
        />

        <el-table-column
          prop="weapon"
          :label="$t('column3Label')"
          :sort-orders="tableSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.weapon.class.number }} {{ scope.row.weapon.class.name }} ({{ scope.row.weapon.calibre }})
            </h6>
          </template>
        </el-table-column>

        <template slot="empty">
          {{ $t("tablePlaceholderText") }}
        </template>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-size="pageSize"
        :current-page="pageCurrent"
        :page-sizes="[ 1, 2, 15, 30, 45, 60, pageTotal ]"
        :total="pageTotal"
        @size-change="pageSizeChange"
        @current-change="pageCurrentChange"
      />
    </div>

    <!-- <events-participants-view-dialog
      :shown.sync="eventsParticipantsShowViewDialog"
      :events-participants-id="eventsParticipantsViewId"
    /> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { db } from "~/db"
import SearchForm from "~/components/SearchForm"
import Avatar from "~/components/Avatar"
// import EventsParticipantsViewDialog from "~/containers/EventsParticipantsViewDialog"

export default Vue.extend({
  name: "EventsStartlistListTable",

  components: {
    SearchForm,
    Avatar
    // EventsParticipantsViewDialog
  },

  props: {
    event: { type: Object, required: true }
  },

  data: () => ({
    eventsParticipantsViewId: "",
    eventsParticipantsShowViewDialog: false,
    eventsParticipants: [],
    tableData: [],
    tableSelection: [],
    tableSortOrders: [ "descending", "ascending" ],
    tableSortField: "createdAt",
    tableSortOrder: "descending",
    pageTotal: 0,
    pageSize: 15,
    pageCurrent: 1,
    searchFilter: "",
    isLoading: false,
    sub: null,
    filter: null
  }),

  computed: {
    eventsParticipantsHasSelection() {
      return this.tableSelection.length > 0
    }
  },

  created() {
    this.filter = {
      eventId: this.event.id
    }

    const observer = async (contestants) => {
      this.isLoading = true

      const allContestants = await db.events_contestants.find(this.filter).exec()
      this.pageTotal = allContestants.length

      this.tableData = await Promise.all(
        contestants.map(async (contestant) => {
          contestant.participant = await contestant.participantId_
          contestant.participant.member = await contestant.participant.memberId_
          contestant.participant.member.club = await contestant.participant.member.clubId_
          contestant.weapon = await contestant.weaponId_
          contestant.division = await contestant.divisionId_
          return contestant
        })
      )

      this.isLoading = false
    }

    const errorHandler = (e) => {
      this.$notify({ type: "error", title: "Oops!", message: e.message })
    }

    this.sub = this.getQuery().$.subscribe(observer, errorHandler)
  },

  beforeDestroy() {
    this.sub.unsubscribe()
  },

  methods: {
    async submitSearchFilter(value) {
      if(!value) {
        this.refresh()
        return
      }

      this.isLoading = true

      const contestants = await db.events_contestants
        .find({ eventId: this.event.id })
        .exec()

      const contestantsMemberIds = await Promise.all(
        (contestants).map(async (contestant) => {
          const { memberId } = await contestant.participantId_
          return memberId
        })
      )

      const regexp = new RegExp(`${value}`, "i")
      const members = await db.clubs_members
        .find({
          $or: [
            { firstName: { $regex: regexp } },
            { lastName: { $regex: regexp } }
          ]
        })
        .where("id")
        .in(contestantsMemberIds)
        .exec()

      const memberIds = members.map(({ id }) => id)
      const participants = await db.events_participants
        .find()
        .where("memberId")
        .in(memberIds)
        .exec()

      const participantIds = participants.map(({ id }) => id)
      const filteredContestants = await db.events_contestants
        .find()
        .where("participantId")
        .in(participantIds)
        .exec()

      this.sub.next(filteredContestants)
    },

    getQuery() {
      const sort = `${this.tableSortOrder === "descending" ? '-' : ''}${this.tableSortField}`
      const skip = (this.pageCurrent - 1) * this.pageSize

      return db.events_contestants
        .find(this.filter)
        .sort(sort)
        .skip(skip)
        .limit(this.pageSize)
    },

    async refresh() {
      this.isLoading = true
      const res = await this.getQuery().exec()
      this.sub.next(res)
      this.isLoading = false
    },

    pageCurrentChange(page) {
      this.pageCurrent = page
      this.refresh()
    },

    pageSizeChange(size) {
      this.pageCurrent = 1
      this.pageSize = size
      this.refresh()
    },

    tableSortChange({ prop, order }) {
      this.tableSortField = prop
      this.tableSortOrder = order
      this.refresh()
    },

    tableSelectionChange(selection) {
      this.tableSelection = selection
    },

    tableRowClick(participant, column, e) {
      if(!e.target.className.includes("table-button")) {
        this.eventsParticipantsViewId = participant.id
        this.eventsParticipantsShowViewDialog = true
      }
    },

    dispatchTableActions({ handler, payload }) {
      this[handler](payload)
    },

    eventsParticipantsOpenManageDialog() {
      this.$emit("eventsParticipantsOpenManageDialog")
    },

    eventsParticipantsOpenEditDialog(participant) {
      this.$emit("eventsParticipantsOpenEditDialog", participant)
    }

    // async eventsParticipantsRemoveOne(participant) {
    //   const fullName = `${participant.member.firstName} ${participant.member.lastName}`
    //
    //   try {
    //     await this.$confirm(
    //       this.$t("eventsParticipantsRemoveOneConfirmation", {
    //         member: fullName
    //       }),
    //       this.$t("warning"), {
    //         confirmButtonText: this.$t("confirmButtonText"),
    //         cancelButtonText: this.$t("cancel"),
    //         customClass: "dangerous-confirmation",
    //         type: "warning"
    //       }
    //     )
    //   } catch(e) {
    //     return
    //   }
    //
    //   try {
    //     await participant.remove()
    //     this.$notify({
    //       type: "success",
    //       title: this.$t("success"),
    //       message: this.$t("eventsParticipantsActionsRemoveOneSuccess", {
    //         member: fullName
    //       })
    //     })
    //   } catch(e) {
    //     this.$notify({
    //       title: "Oops!",
    //       message: e.message,
    //       type: "error"
    //     })
    //   }
    // },

    // async eventsParticipantsRemoveMany() {
    //   const count = this.tableSelection.length
    //
    //   try {
    //     await this.$confirm(
    //       this.$t("eventsParticipantsRemoveManyConfirmation", {
    //         members: count
    //       }),
    //       this.$t("warning"), {
    //         confirmButtonText: this.$t("confirmButtonText"),
    //         cancelButtonText: this.$t("cancel"),
    //         customClass: "dangerous-confirmation",
    //         type: "warning"
    //       }
    //     )
    //   } catch(e) {
    //     return
    //   }
    //
    //   try {
    //     await Promise.all(
    //       this.tableSelection.map((participant) => participant.remove())
    //     )
    //     this.$notify({
    //       type: "success",
    //       title: this.$t("success"),
    //       message: this.$t("eventsParticipantsActionsRemoveManySuccess", {
    //         members: count
    //       })
    //     })
    //   } catch(e) {
    //     this.$notify({
    //       type: "error",
    //       title: "Oops!",
    //       message: e.message
    //     })
    //   }
    // }
  }
})
</script>
