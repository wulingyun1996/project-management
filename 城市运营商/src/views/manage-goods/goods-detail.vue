<template>
  <div class="goods-detail-wrapper">
    <div class="form-group">
      <h1>商品交易信息</h1>
      <div class="group">
        <div class="left">
          <p>
            <b>计量单位：</b>
          </p>
          <p>
            <b>市场标价：</b>
          </p>
          <p>
            <b>特约采购师价：</b>
          </p>
          <p>
            <b>零售限价：</b>
          </p>
          <p>
            <b>供应总量：</b>
          </p>
          <p>
            <b>最小起订量：</b>
          </p>
          <p>
            <b>商品编码：</b>
          </p>
        </div>
        <div class="right">
          <p>
            <span>{{ goodsDetail.unit }}</span>
          </p>
          <p>
            <span>{{ goodsDetail.price }}</span>
          </p>
          <p>
            <span>{{ goodsDetail.purchase_price }}</span>
          </p>
          <p>
            <span>{{ goodsDetail.promotion_price }}</span>
          </p>
          <p>
            <span>{{ goodsDetail.stock }}</span>
          </p>
          <p>
            <span>{{ goodsDetail.minimum_quantity }}</span>
          </p>
          <p>
            <span>{{ goodsDetail.seller_code || '无' }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="form-group">
      <h1>图片和详细说明</h1>
      <p>商品图片：</p>
      <div class="goods-img">
        <img :src="goodsDetail.image_path" alt="">
      </div>
      <p>商品描述：</p>
      <div class="content" v-html="goodsDetail.content"></div>
    </div>
    <div class="form-group">
      <h1>图片和详细说明</h1>
      <div class="group">
        <div class="left">
          <p>
            <b>单位重量：</b>
          </p>
          <p>
            <b>发货日期：</b>
          </p>
          <p>
            <b>运费设置：</b>
          </p>
        </div>
        <div class="right">
          <p>
            <span>{{ goodsDetail.weight }}</span>
          </p>
          <p>
            <span>{{ goodsDetail.deliver_date }}</span>
          </p>
          <p>
            <span>{{ goodsDetail.freight }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="form-group">
      <h1>图片和详细说明</h1>
      <div class="group">
        <div class="left">
          <p>
            <b>所属商家：</b>
          </p>
          <p>
            <b>精品馆：</b>
          </p>
          <p>
            <b>材料馆：</b>
          </p>
          <p>
            <b>创建时间：</b>
          </p>
          <p>
            <b>商品状态：</b>
          </p>
        </div>
        <div class="right">
          <p>
            <span>{{ goodsDetail.shop_name }}</span>
          </p>
          <p>
            <span>{{ goodsDetail.boutique ? '是' : '否' }}</span>
          </p>
          <p>
            <span>{{ goodsDetail.material ? '是' : '否' }}</span>
          </p>
          <p>
            <span>{{ goodsDetail.created_at }}</span>
          </p>
          <p>
            <span>{{ goodsDetail.sale === 1 ? '下架' : '上架' }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsDetail',
  data () {
    return {
      goodsDetail: {}
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  created () {
    this.getGoodsDetail()
  },
  methods: {
    getGoodsDetail () {
      const url = 'sale/goodsDetail'
      const obj = {
        goods_id: this.id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.goodsDetail = res.data[0]
        }
      })
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.goods-detail-wrapper
  h1
    f16()
    color $color-orange
    border-left 4px solid $color-orange
    padding-left 20px
    margin 20px 0
  .group
    flex-f-align()
    p
      height 30px
      line-height 30px
    .right
      margin-left 50px
  .goods-img
    padding 10px
  .content
    padding 10px
  img
    display block
    width 200px!important
    height 200px!important
</style>
