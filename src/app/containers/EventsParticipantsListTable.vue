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
    "tablePlaceholderText": "No participants yet.",
    "tablePlaceholderButton": "Add a member?",
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
    "tablePlaceholderText": "Ingen deltakere enda",
    "tablePlaceholderButton": "Legg til ett medlem?",
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
  <div class="events-participants-list-table">
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
          prop="number"
          sortable="custom"
          label="Nr"
          width="80px"
          :sort-orders="tableSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.number }}
            </h6>
          </template>
        </el-table-column>

        <el-table-column
          prop="member"
          width="50px"
        >
          <template slot-scope="scope">
            <avatar
              size="small"
              :first-name="scope.row.member.firstName"
              :last-name="scope.row.member.lastName"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="memberId"
          sortable="custom"
          :label="$t('column1Label')"
          :sort-orders="tableSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.member.firstName }} {{ scope.row.member.lastName }}
            </h6>
          </template>
        </el-table-column>

        <el-table-column
          prop="memberId"
          sortable="custom"
          :label="$t('column2Label')"
          :sort-orders="tableSortOrders"
        >
          <template slot-scope="scope">
            {{ scope.row.member.club.name }}
          </template>
        </el-table-column>

        <el-table-column
          prop="weapons"
          :label="$t('column3Label')"
          :sort-orders="tableSortOrders"
        >
          <template slot-scope="scope">
            <el-tooltip placement="top">
              <ul slot="content">
                <li
                  v-for="(weapon, index) in scope.row.weapons"
                  :key="index"
                >
                  {{ weapon.class.name }} ({{ weapon.calibre }})
                </li>
              </ul>
              <el-tag size="mini">
                {{ scope.row.weapons.length }} {{ $t('column3Label') }}
              </el-tag>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          width="50"
          align="right"
        >
          <template
            slot="header"
            slot-scope="scope"
          >
            <div
              class="table-actions"
              :class="{ 'disabled': !eventsParticipantsHasSelection }"
            >
              <el-dropdown
                trigger="click"
                @command="dispatchTableActions"
              >
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    class="dropdown-menu-delete"
                    :command="{
                      handler: 'eventsParticipantsRemoveMany'
                    }"
                  >
                    <i class="el-icon-delete el-icon--left" />
                    {{ $t("removeSelected") }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>

          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="dispatchTableActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{
                    handler: 'eventsParticipantsOpenEditDialog',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-edit el-icon--left" />
                  {{ $t("editParticipant") }}
                </el-dropdown-item>

                <el-dropdown-item
                  divided
                  class="dropdown-menu-delete"
                  :command="{
                    handler: 'eventsParticipantsRemoveOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-delete el-icon--left" />
                  {{ $t("removeParticipant") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          {{ $t("tablePlaceholderText") }}
          <el-button
            type="text"
            @click="eventsParticipantsOpenManageDialog"
          >
            {{ $t("tablePlaceholderButton") }}
          </el-button>
        </template>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-size="pageSize"
        :current-page="pageCurrent"
        :page-sizes="[ 15, 30, 45, 60, pageTotal ]"
        :total="pageTotal"
        @size-change="pageSizeChange"
        @current-change="pageCurrentChange"
      />
    </div>

    <events-participants-view-dialog
      :shown.sync="eventsParticipantsShowViewDialog"
      :events-participants-id="eventsParticipantsViewId"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { db } from "~/db"
import SearchForm from "~/components/SearchForm"
import Avatar from "~/components/Avatar"
import EventsParticipantsViewDialog from "~/containers/EventsParticipantsViewDialog"

export default Vue.extend({
  name: "EventsParticipantsListTable",

  components: {
    SearchForm,
    Avatar,
    EventsParticipantsViewDialog
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
    sub: null
  }),

  computed: {
    eventsParticipantsHasSelection() {
      return this.tableSelection.length > 0
    }
  },

  created() {
    const observer = async (results) => {
      this.isLoading = true
      // this.pageTotal = await db.events_participants.count()
      this.tableData = await Promise.all(
        results.map(async (participant) => {
          participant.member = await participant.memberId_
          participant.member.club = await participant.member.clubId_
          participant.weapons = await db.events_participants_weapons.find({
            participantId: participant.id
          }).exec()
          participant.weapons = await Promise.all(
            participant.weapons.map(async (weapon) => {
              weapon.class = await weapon.classId_
              return weapon
            })
          )
          return participant
        })
      )
      this.isLoading = false
    }

    const errorHandler = (e) => {
      this.$notify({ type: "error", title: "Oops!", message: e.message })
    }

    this.sub = db.events_participants.find({ eventId: this.event.id })
      .$.subscribe(observer, errorHandler)
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

      const participants = await db.events_participants
        .find({ eventId: this.event.id })
        .exec()

      const regexp = new RegExp(`${value}`, "i")
      const participantMemberIds = participants.map(({ memberId }) => memberId)
      const members = await db.clubs_members
        .find({
          $or: [
            { firstName: { $regex: regexp } },
            { lastName: { $regex: regexp } }
          ]
        })
        .where("id")
        .in(participantMemberIds)
        .exec()

      const memberIds = members.map(({ id }) => id)
      const filteredParticipants = await db.events_participants
        .find({ eventId: this.event.id })
        .where("memberId")
        .in(memberIds)
        .exec()

      this.sub.next(filteredParticipants)
    },

    async refresh() {
      this.isLoading = true
      const filter = { eventId: this.event.id }
      const sort = `${this.tableSortOrder === "descending" ? '-' : ''}${this.tableSortField}`
      const skip = (this.pageCurrent - 1) * this.pageSize

      const res = await db.events_participants
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(this.pageSize)
        .exec()

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
    },

    async eventsParticipantsRemoveOne(participant) {
      const fullName = `${participant.member.firstName} ${participant.member.lastName}`

      try {
        await this.$confirm(
          this.$t("eventsParticipantsRemoveOneConfirmation", {
            member: fullName
          }),
          this.$t("warning"), {
            confirmButtonText: this.$t("confirmButtonText"),
            cancelButtonText: this.$t("cancel"),
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )
      } catch(e) {
        return
      }

      try {
        await participant.remove()
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsParticipantsActionsRemoveOneSuccess", {
            member: fullName
          })
        })
      } catch(e) {
        this.$notify({
          title: "Oops!",
          message: e.message,
          type: "error"
        })
      }
    },

    async eventsParticipantsRemoveMany() {
      const count = this.tableSelection.length

      try {
        await this.$confirm(
          this.$t("eventsParticipantsRemoveManyConfirmation", {
            members: count
          }),
          this.$t("warning"), {
            confirmButtonText: this.$t("confirmButtonText"),
            cancelButtonText: this.$t("cancel"),
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )
      } catch(e) {
        return
      }

      try {
        await Promise.all(
          this.tableSelection.map((participant) => participant.remove())
        )
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsParticipantsActionsRemoveManySuccess", {
            members: count
          })
        })
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    }
  }
})
</script>
