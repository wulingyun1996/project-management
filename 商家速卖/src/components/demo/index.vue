<template>
  <div class="demo">
    <div id="market-annnoucement">
    </div>
  </div>
</template>

<script>
import { patch, createVnode } from 'plugins/snabbdom'
import data from 'data/data'
export default {
  data () {
    return {
      //
    }
  },
  mounted () {
    this.$nextTick(() => {
      let wrapper = document.getElementById('market-annnoucement')
      let vnode = createVnode('div#market-annnoucement', data, '#ef6370', this.getGoodsId, this.getActivityId)
      patch(wrapper, vnode)
    })
  },
  methods: {
    getGoodsId (e) {
      let id = e.target.dataset.id
      console.log(id)
    },
    getActivityId (e) {
      let id = e.target.dataset.id
      console.log(id)
    }
  }
}
</script>

<style lang="stylus">
.demo
  height 100%
</style>
