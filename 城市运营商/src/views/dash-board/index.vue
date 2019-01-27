<template>
  <div class="dashboard-container">
    <div class="dashboard-bg">
      <img src="./images/bg.png"/>
    </div>
  </div>
</template>

<script>
import { setToken } from 'utils/token'
import { mapMutations } from 'vuex'
export default {
  computed: {
    token () {
      return this.$route.query.token
    }
  },
  created () {
    if (this.token) {
      // this.setItem('fromPlatform', 1)
      this.MODIFYENTRY(true)
      setToken(`Bearer ${this.token}`)
    }
  },
  methods: {
    ...mapMutations(['MODIFYENTRY'])
  }
}
</script>

<style lang="stylus" scoped>
.dashboard-container
  .bg
    img
      display block
      width 55%
      margin 15vh auto 0
</style>
