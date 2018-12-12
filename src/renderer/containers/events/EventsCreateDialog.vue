<style lang="stylus">
.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-select
  width 100%
.el-range-editor .el-range-input
  width 50%
</style>

<template>
  <el-dialog
    title="Opprett et nytt stevne"
    custom-class="create-dialog"
    :visible.sync="visible"
    @close="close"
  >
    <div v-loading="eventsCreateIsLoading">
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="formRules"
      >
        <el-form-item label="Title" prop="title">
          <el-input placeholder="Enter a title" v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="Start / End" prop="dates">
          <el-date-picker
            v-model="form.dates"
            type="daterange"
            range-separator="to"
            start-placeholder="Start date"
            end-placeholder="End date"
          ></el-date-picker>
        </el-form-item>

        <div class="flex">
          <el-form-item label="Category" prop="category" class="w-full mr-2">
            <el-select v-model="form.category" placeholder="Select a category">
              <el-option
                v-for="(category, index) in categories"
                :key="category._id"
                :label="category.title"
                :value="category.title"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Branch" prop="branch"  class="w-full ml-2">
            <el-input placeholder="Enter a branch" v-model="form.branch"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="Organizer" prop="organizer">
          <el-select v-model="form.organizer" placeholder="Select the organizer">
            <el-option
              v-for="(club, index) in clubs"
              :key="club._id"
              :label="club.title"
              :value="club.title"
            ></el-option>
          </el-select>
        </el-form-item>

        <div class="flex">
          <el-form-item label="Area" prop="area" class="w-full mr-2">
            <el-input placeholder="Enter a area" v-model="form.area"></el-input>
          </el-form-item>
          <div class="w-full ml-2 flex">
            <el-form-item label="Lat" prop="lat" class="w-full mr-2">
              <el-input placeholder="Enter latitude" v-model="form.lat"></el-input>
            </el-form-item>
            <el-form-item label="Lng" prop="lng" class="w-full mr-2">
              <el-input placeholder="Enter longitude" v-model="form.lng"></el-input>
            </el-form-item>
          </div>
        </div>

        <el-form-item label="Approbated" prop="approbated">
          <el-switch
            v-model="form.approbated"
            active-text="Is officially approbated?"
          ></el-switch>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <div class="flex justify-end">
          <el-button class="block" type="default" @click="close">Cancel</el-button>
          <el-button class="block" type="primary" @click="submit">Save</el-button>
        </div>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { stub } from "@/db/events"

const categories = [
  { _id: 0, title: "World Championship" },
  { _id: 1, title: "European Championship" },
  { _id: 2, title: "Norwegian Championship" },
  { _id: 3, title: "Club event" }
]

const clubs = [
  { _id: 0, title: "Skedsmo Civile Skydeselskab" },
  { _id: 1, title: "Norske Officerers Pistolklubb" },
  { _id: 2, title: "Oslo Vestre Sportsskyttere" },
  { _id: 3, title: "OKTS Svartkruttgruppa" }
]

export default {
  name: "EventsCreateDialog",

  props: {
    shown: { type: Boolean, default: false }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  computed: mapState("events", {
    eventsCreateIsLoading: "createIsLoading"
  }),

  data: function() {
    return {
      visible: this.shown,
      form: { ...stub, dates: [] },
      formRules: {
        title: { required: true, message: "Title is a required field" },
        dates: { required: true, message: "Dates is a required field" },
        category: { required: true, message: "Category is a required field" },
        branch: { required: true, message: "Branch is a required field" },
        organizer: { required: true, message: "Organizer is a required field" },
        area: { required: true, message: "Area is a required field" }
      },
      categories: categories,
      clubs: clubs
    }
  },

  methods: {
    ...mapActions("events", {
      eventsCreateAsync: "createAsync"
    }),

    submit() {
      this.$refs.form.validate((isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: "Please fill in all required fields before saving"
          })
        }

        const data = { ...this.form }
        data.startsAt = data.dates[0]
        data.endsAt = data.dates[1]
        delete data.dates
        this.eventsCreateFormSubmit(data)
      })
    },

    async eventsCreateFormSubmit(form) {
      try {
        await this.eventsCreateAsync(form)
        this.$notify({
          type: "success",
          title: "Great success",
          message: `${form.title} was successfully added to the database`
        })
        this.clear()
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
      this.form = { ...stub }
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
