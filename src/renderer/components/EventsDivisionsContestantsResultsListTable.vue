<template>
  <el-table
    :data="results"
    row-key="id"
    class="no-hover small"
    empty-text
  >
    <el-table-column
      type="index"
      width="40"
    />

    <el-table-column
      prop="total"
      label="Total"
      width="60px"
    >
      <template slot-scope="scope">
        <h6 class="h6">
          {{ scope.row.total }}
        </h6>
      </template>
    </el-table-column>

    <el-table-column
      prop="contestantId"
      width="60px"
    >
      <template slot-scope="scope">
        <avatar
          size="small"
          :first-name="scope.row.contestant.member.firstName"
          :last-name="scope.row.contestant.member.lastName"
        />
      </template>
    </el-table-column>

    <el-table-column
      prop="contestantId"
      label="Participant"
    >
      <template slot-scope="scope">
        <h6 class="h6">
          {{ scope.row.contestant.member.firstName }} {{ scope.row.contestant.member.lastName }}
        </h6>
        <small class="small">
          ({{ scope.row.contestant.weapon.class.name }}, {{ scope.row.contestant.weapon.calibre }})
        </small>
      </template>
    </el-table-column>

    <el-table-column
      prop="hits"
      label="Hits"
    >
      <template slot-scope="scope">
        {{ scope.row.hits.join(" ") }}
      </template>
    </el-table-column>

    <template slot="empty">
      No results yet
    </template>
  </el-table>
</template>

<script>
import Avatar from "@/components/Avatar"

export default {
  name: "EventsDivisionsContestantsResultsListTable",
  components: {
    Avatar
  },
  props: {
    results: { type: Array, required: true }
  }
}
</script>
