<template>
  <div class="detaills">
    <h3>{{data.title}}</h3>
    <div class="bannerBgImg">
      <img :src="data.image_path" alt="">
    </div>
    <div class="content">
      <p>时间：{{data.start_at}}至{{data.updated_at}}</p>
      <p>地点：{{data.province}}-{{data.city}}-{{data.area}}</p>
      <p>{{data.address}}</p>
      <p>费用：{{data.cost}}</p>
    </div>
    <div class="bannerImg">
      <span>参与品牌：</span>
      <ul>
        <li v-for="item in data.brands" :key="item.index">
          <img :src="item" alt="">
        </li>
      </ul>
    </div>
    <div class="activityImg">
      <span>活动详情：</span>
      <div class="actiImg" v-html="data.description">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      data: ''
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.$http('adv/detailHotAdv', { id: this.$route.query.id }).then(res => {
        if (res.code === this.$ok) {
          this.data = res.data
        }
      })
    }
  }
}
</script>
<style lang='stylus'>
.detaills
  text-align center
  width 800px
  margin-left 20px
  padding 20px
  h3
    color #333
    font-weight 600
  .bannerBgImg
    margin-top 10px
    width 100%
    height 300px
    img
      width 100%
      height 100%
      display block
  .content
    margin-top 20px
    color #333
    text-align left
    p
      margin-top 10px
    P:nth-child(3)
      margin-left 50px
  .bannerImg
    margin-top 20px
    text-align left
    ul
      overflow hidden
      margin-left: 65px;
      li:nth-child(n+7)
        margin-top 10px
      li
        width 100px
        height 40px
        float left
        margin-left 10px
        img
          width 100%
          height 100%
          display block
  .activityImg
    text-align left
    margin-top 20px
    .actiImg
      margin-left 80px
      img
        width 680px
        height 600px
        display block
        margin-top 10px
</style>
