<style lang="stylus">
</style>

<template>
  <el-dialog
    title="Create a new club"
    custom-class="create-dialog"
    :visible.sync="visible"
    @close="close"
  >
    <div v-loading="isLoading">
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="formRules"
      >
        <el-form-item label="Title" prop="name">
          <el-input placeholder="Enter a name" v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="Leader" prop="leader">
          <el-input placeholder="Enter a leader" v-model="form.leader"></el-input>
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input placeholder="Enter a email" v-model="form.email"></el-input>
        </el-form-item>

        <el-form-item label="Address" prop="address">
          <el-input placeholder="Enter a address" v-model="form.address"></el-input>
        </el-form-item>

        <el-form-item label="Area" prop="area">
          <el-input placeholder="Enter a area" v-model="form.area"></el-input>
        </el-form-item>

        <el-form-item label="Country" prop="country">
          <el-input placeholder="Enter a country" v-model="form.country"></el-input>
        </el-form-item>

        <el-form-item label="Shooting Range" prop="range">
          <el-input placeholder="Enter a range" v-model="form.range"></el-input>
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
const formStub = {
  name: "Norske Officerers Pistolklubb",
  email: "svartkrutt@nop.no",
  address: "Postboks 92 Sentrum",
  area: "0101 Oslo",
  country: "Norway",
  range: "Løvenskioldbanen Dælimosen 50, 1359 Eiksmarka",
  leader: "Jens Berentzen"
}

export default {
  name: "ClubsCreateDialog",
  props: {
    shown: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false }
  },
  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },
  data: function() {
    return {
      visible: this.shown,
      form: formStub,
      formRules: {
        name: { required: true, message: "Name is a required field" },
        area: { required: true, message: "Area is a required field" },
        country: { required: true, message: "Country is a required field" }
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate((isValid) => {
        if(!isValid) {
          return this.$notify({
            title: "Oops!",
            message: "Please fill in all required fields before saving",
            type: "error"
          })
        }
        this.$emit("submit", this.form)
      })
    },
    clear() {
      this.form = { ...formStub }
    },
    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
