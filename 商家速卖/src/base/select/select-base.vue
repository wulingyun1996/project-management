<template>
  <div class="select_base_container">
    <div class="modal_bg" v-if="state" @click="closeSelect"></div>
    <input type="text" class="inp_select_act mess-arrow" v-show="!state" v-model="chooseOpt" @click="openOption" readonly="readonly">
    <input type="text" class="inp_select_act02 mess-arrow" v-show="state" v-model="chooseOpt" @click="openOption" readonly="readonly">
    <div class="select_item" v-show="state" ref="options" @click="stopEvent">
      <div class="option" v-for="(item, index) in options" @click="change(item)" v-show="chooseOpt !== item.name">{{item.name}}</div>
    </div>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    options: {
      type: Array,
      default() {
        return []
      }
    },
    value: {
      type: [String, Number]
    }
  },
  data() {
    return {
      state: false
    }
  },
  created() {
    // console.log(this)
  },
  computed: {
    chooseOpt() {
      let str = ''
      if (this.options.length > 0) {
        this.options.forEach((item) => {
          if (item.value === this.value) {
            str = item.name
          }
        })
      }
      return str
    }
  },
  methods: {
    openOption() {
      this.state = !this.state
      document.documentElement.style.overflow = 'hidden'
    },
    stopEvent(event) {
      event.stopPropagation()
    },
    change(item) {
      // this.chooseOpt = item.name
      // this.chooseOpt.value = item.value
      this.$emit('change', item.value)
      this.state = false
      document.documentElement.style.overflow = 'visible'
    },
    closeSelect() {
      this.state = false
      document.documentElement.style.overflow = 'visible'
    }
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import "~common/stylus/variable.styl"
.select_base_container
  position relative
  // border-bottom #dfdfdf 1px solid;/*no*/
.modal_bg
  position: fixed;
  z-index: 98;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #000;
  opacity:0.6;
.inp_select_act,.inp_select_act02
  width 100%
  height 88px
  padding-left 25px
  border-radius 5px/*no*/
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
  font-size 28px/*px*/
.inp_select_act02
  position absolute
  left 0
  top 0
  z-index 99
.mess-arrow
  background: #ffffff url('./bottom_arrow.png') no-repeat right 20px center
  background-size: 12px auto;/*px*/
.select_item
  position absolute
  left 0
  top 88px
  width 100%
  max-height 440px
  overflow auto
  background $color-white
  border-radius 5px/*no*/
  z-index 99
  .option
    border-bottom #dfdfdf 1px solid
    line-height 88px;
    font-size 28px/*px*/
    padding 0 35px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
  .option:nth-last-of-type(1)
    border-bottom 0

</style>
