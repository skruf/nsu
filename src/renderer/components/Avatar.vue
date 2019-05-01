<style lang="stylus">
.avatar
  border-radius 50%
  background-color #000
  color #fff !important
  display flex
  align-items center
  justify-content center
  font-size 0.8em
  font-weight 300
  text-transform uppercase
  letter-spacing 0.25px
  min-width 38px
  max-width 38px
  min-height 38px
  max-height 38px
  &.small
    min-width 28px
    max-width 28px
    min-height 28px
    max-height 28px
    font-size 0.75em
</style>

<template>
  <div
    ref="avatar"
    :class="[ 'avatar', size ]"
  >
    {{ value }}
  </div>
</template>

<script>
function getRandomColor() {
  const letters = "789ABCD"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 6)]
  }
  return color
}

export default {
  name: "Avatar",
  props: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    size: { type: String, required: false, default: "" }
  },
  computed: {
    value() {
      return this.firstName.charAt(0) + this.lastName.charAt(0)
    }
  },
  mounted() {
    const color = getRandomColor()
    this.$refs.avatar.style.backgroundColor = color
  }
}
</script>
