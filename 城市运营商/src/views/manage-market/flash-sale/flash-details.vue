<template>
  <div class="details">
    <div class="detailsInfo">
     <p>
      <span class="red">*</span>
      <span>活动名称：</span>
      <span>{{name}}</span>
     </p>
     <p>
      <span class="red">*</span>
      <span>开始时间：</span>
      <span>{{created_at}}</span>
     </p>
     <p>
      <span class="red">*</span>
      <span>结束时间：</span>
      <span>{{end_at}}</span>
     </p>
     <p>
      <span class="red">*</span>
      <span>活动图片：</span>
      <span>【限时抢购入口图】</span>
     </p>
    </div>
    <div class="imglist">
      <!-- <div class="pathImg" v-for="item in imgList" :key="item.index"> -->
        <img :src="imgList" alt="">
      <!-- </div> -->
    </div>
    <div class="bannerImg">
      <p>【抢购详情banner图】</p>
      <img :src="bannerimg" alt="">
    </div>
    <div class="addshop">
      <span class="red">*</span>
      <span>添加商品：</span>
      <div class="table">
        <test :total="2" :data="data" :columns="columns" :componentList="componentList" :columnType="indexx"></test>
      </div>
    </div>
  </div>
</template>
<script>
import test from 'components/table'
import Img from 'components/table-image'
const data = []
const columns = [
  {
    label: '商品ID',
    prop: 'product_code'
  },
  {
    label: '标题',
    prop: 'title'
  },
  {
    label: '店铺名称',
    prop: 'shop_name'
  },
  {
    label: '起批量',
    prop: 'minimum_quantity'
  },
  {
    label: '活动运费',
    prop: 'freight'
  },
  {
    label: '零售标价',
    prop: 'price'
  },
  {
    label: '直采价',
    prop: 'max_purchase_price'
  },
  {
    label: '活动价格',
    prop: 'active_price'
  },
  {
    label: '活动库存',
    prop: 'stock'
  },
  {
    label: '限购数/人',
    prop: 'number'
  }
]
const componentList = [
  {
    component: Img,
    label: '活动图标',
    insertIndex: 2
  }
]
export default {
  data () {
    return {
      data,
      columns,
      imgList: "",
      indexx: 'index',
      componentList,
      bannerimg: '',
      name: '',
      title: '',
      created_at: '',
      end_at: ''
    }
  },
  created () {
    this.getdata()
  },
  methods: {
    getdata () {
      this.$http('sale/getDetail', { id: this.$route.query.id }).then(res => {
        if (res.code === this.$ok) {
          this.imgList = res.data.image_path
          this.bannerimg = res.data.banner_path
          this.name = res.data.name
          this.title = res.data.title
          this.created_at = res.data.start_at
          this.end_at = res.data.end_at
          this.data = res.data.goods_list
          this.data.map(item => {
            item.src = item.image_path
            item.height = 50
            item.width = 50
          })
        }
      })
    }
  },
  components: {
    test
  }
}
</script>
<style lang='stylus' scoped>
.red
  color #f00
.detailsInfo
  p
    margin-top 30px
    span:nth-child(2)
      color #333
      font-size 14px
    span:last-child
      margin-left 50px
      color #999
      font-size 14px
.imglist
  overflow hidden
  margin-top 10px
  margin-left 115px
  .pathImg
    width 250px
    height 150px
    float left
    margin-left 10px
    img
      width 100%
      height 100%
      display block
.bannerImg
  margin-left 115px
  margin-top 20px
  p
    color #999
    font-size 14px
  img
    margin-top 10px
    width 250px
    height 150px
    display block
.addshop
  margin-top 30px
  .table
    margin-top 20px
</style>
