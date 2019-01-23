<template>
  <div class="pic-manage-container">
    <base-header></base-header>
    <div class='picture' v-for="(item, index) in pic" :key='index'>
      <img class='pic-icon' src="./images/chosed-tag.png" alt="" v-show = 'active === item ? true : false'>
      <img :src="item" alt="" :class="{active:active === item}" @click='setPic(item)'>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pic: [],
      active: ''
    }
  },
  created () {
    this.getPic()
    console.log(this.imgPath)
  },
  computed: {
    imgPath () {
      return this.$route.query.img
    }
  },
  methods: {
    getPic() {
      const URL = 'shop/background'
      this.$http(URL).then(res => {
        if (res.code === 200) {
          this.pic = res.data
          res.data.forEach(item => {
            if (item === this.imgPath) {
              this.active = this.imgPath
            } else {
              this.active = res.data[0]
            }
          })
        }
      })
    },
    setPic(path) {
      const URL = 'shop/setBackground'
      let obj = {
        path: path
      }
      this.$http(URL, obj).then(res => {
        if (res.code === 200) {
          this.active = path
          this.$router.back()
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .pic-manage-container
    width 100%
    height 100%
    .picture
      position relative
      display flex
      flex-direction column
      align-items center
      .pic-icon
        width 60px
        height 60px
        position absolute 
        top 0
        left 30px
      img
        width 690px;
        height 368px;
        margin-top 32px
      .active
        border 4px solid #FF8100
</style>

  


