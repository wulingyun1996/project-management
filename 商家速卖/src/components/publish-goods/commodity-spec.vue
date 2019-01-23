<template>
  <div class="commodity-spec">
    <div class="spec-main">
      <scroll ref="scroll" class="spec-scroll">
        <div>
          <div class="main-top" v-for="(type, index) in goodSku">
            <div class="spe-li">
              <h5>{{ type.name }}</h5>
              <ul ref="specDom">
                <li class="spec_item_dom" v-for="(item, itemIndex) in type.sku" @click="choose(index, itemIndex, item, type.require, $event)">
                  {{ item.val }}
                </li>
              </ul>
            </div>
          </div>
          <div class="split-div"></div>
          <div class="main-sec">
            <div class="null-top" v-if="combSku && combSku.length === 0">
              <h5>价格/库存</h5>
              <p class="mess-show">您需要选择相应的销售属性，才能组合成完整的规格信息</p>
            </div>
            <div v-else>
              <div class="sec-top">
                <div class="left"><span v-show="!isChooseSec">价格/</span>库存</div>
                <div class="right" @click="showConfirm">批量设定</div>
              </div>
              <div class="commission-introduce">
                <div class="commisson-icon"></div>
                <div class="commission-content">
                  <p>零售标价：商品标价</p>
                  <p>零售底价：采购师推荐给用户，用户的购买价格</p> 
                  <p>直采价：采购师自购价格</p>
                  <p>佣金：采购师推荐商品给用户，用户购买后采购师赚取的金额</p>
                </div>
              </div>
              <div class="spe-input" v-for="(item, index) in combSku">
                <h5>
                  <span v-for="(value, key, itemIndex) in goodsAttrVal[index]">
                    {{ value.attr_value }}
                    <span v-if="itemIndex < Object.keys(goodsAttrVal[index]).length-1"> / </span>
                  </span>
                </h5>
                <div class="input-li">
                  <group v-show="!isChooseSec">
                    <x-input placeholder="输入零售标价" title="" v-model="item.price" class="text-left"></x-input>
                    <p v-show="errorArr[index][0].isShow">{{errorArr[index][0].msg}}</p>
                  </group>
                  <group v-show="!isChooseSec">
                    <x-input placeholder="输入零售底价" title="" v-model="item.promotionPrice" class="text-left"></x-input>
                    <p v-show="errorArr[index][1].isShow">{{errorArr[index][1].msg}}</p>
                  </group>
                  <group v-show="!isChooseSec">
                    <x-input placeholder="输入直采价" title="" v-model="item.purchasePrice" class="text-left"></x-input>
                    <p v-show="errorArr[index][2].isShow">{{errorArr[index][2].msg}}</p>
                  </group>
                  <group>
                    <x-input placeholder="输入库存" title="" v-model="item.stock" class="text-left"></x-input>
                    <p v-show="errorArr[index][3].isShow">{{errorArr[index][3].msg}}</p>
                  </group>
                </div>
                <div class="input-li">
                  <group>
                    <x-input placeholder="输入商品编码" title="" v-model="item.sellerCode" :max="13" class="text-left inp-seller-code"></x-input>
                    <p v-show="errorArr[index][4].isShow">{{errorArr[index][4].msg}}</p>
                  </group>
                </div>
                <div class="input-li">
                  <h2>佣金：
                    <span :class="{active: item.promotionPrice - item.purchasePrice > 0}">{{ splitMoney(item.promotionPrice - item.purchasePrice) }}</span>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <div class="foot">
      <foot-btn text="确定" @footBtnClick="setSave"></foot-btn>
    </div>
    <confirm ref="confirm" text="批量设定价格/库存" :isChooseSec="isChooseSec" @confirm="setAllPrice" cancelBtnText="取消" confirmBtnText="确定"></confirm>
    <pop ref="pop" :title="showMess"></pop>
    <router-view></router-view>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import { Group, XInput } from 'vux'
  import FootBtn from 'base/foot-btn/foot-btn-two'
  import Pop from 'base/pop/pop'
  import { nativeBackBase } from 'api/init'
  import Confirm from 'base/confirm/confirm-spec'
  import { hasClass, addClass, removeClass } from 'assets/util/dom'
  import util from 'common/js/util'
  import { splitMoney } from 'commons'

  export default {
    data() {
      return {
        goodSku: [],
        selectArr: [],
        combSku: [],
        errorArr: [],
        newArr: [],
        showMess: ''
      }
    },
    props: {
      specCombData: Array, // 组合的规格数据
      isChooseSec: Boolean,
      specList: Array // 渲染的规格
    },
    created() {
      this.goodSku = JSON.parse(JSON.stringify(this.specList))
      this.combSku = JSON.parse(JSON.stringify(this.specCombData))
      // 对应 goodsSku 中选中项，添加上相应的类名
      this.$nextTick(function() {
        this.combSku.forEach((combObj, combIndex) => {
          this.goodsAttrKey.forEach((key, index) => {
            this.specList[index].sku.forEach((item, speIndex) => {
              if ((item.id === combObj[key].id && item.val === combObj[key].attr_value)) {
                addClass(this.$refs.specDom[index].children[speIndex], 'active')
                this.selectArr[index][speIndex] = {id: item.id, attr_value: item.val}
              }
            })
          })
        })
      })
      this.combSku.forEach((combObj) => {
        this.errorArr.push([{isShow: false, msg: ''}, {isShow: false, msg: ''}, {isShow: false, msg: ''}, {isShow: false, msg: ''}, {isShow: false, msg: ''}])
      })
      this.goodSku.forEach(() => {
        this.selectArr.push([])
        this.newArr.push([])
      })
    },
    beforeRouteEnter (to, from, next) {
      nativeBackBase()
      next()
    },
    computed: {
      // 内含 crux 和 sku 属性的数组
      goodsAttrKey() {
        let arr = []
        for (let i = 0; i < this.goodSku.length; i++) {
          arr.push(this.goodSku[i].require)
        }
        return arr
      },
      // 内含 sku 以及 crux 属性的对象数组
      goodsAttrVal() {
        let arr = []
        this.combSku.forEach((item) => {
          let obj = {}
          Object.keys(item).forEach((value) => {
            if (item[value].id !== undefined) {
              obj[value] = item[value]
            }
          })
          arr.push(obj)
        })
        return arr
      }
      // TODO
      // postData() {
      //   let postArr = []
      //   // if (this.combSku.length.length < 1) return {}
      //   if (this.combSku.length < 1) return {}
      //   for (let i = 0; i < this.combSku.length; i++) {
      //     let specObj = this.combSku[i].spec
      //     let obj = Object.assign({}, this.combSku[i], specObj)
      //     postArr.push(obj)
      //   }
      //   return postArr
      // }
    },
    methods: {
      splitMoney (val) {
        let {init, zero} = splitMoney(val)
        return `${init}.${zero}`
      },
      choose(index, itemIndex, item, required, $event) {
        let dom = $event.currentTarget
        let isHas = hasClass(dom, 'active')
        if (isHas === false) {
          this.selectArr[index][itemIndex] = {id: item.id, attr_value: item.val}
          this.newArr = [{id: item.id, attr_value: item.val}]
          this.initPriceList(index)
          addClass(dom, 'active')
        } else {
          this.selectArr[index].splice(itemIndex, 1, undefined)
          for (let i = 0; i < this.combSku.length; i++) {
            if (item.id === this.combSku[i][required].id) {
              this.combSku.splice(i, 1)
              this.errorArr.splice(i, 1)
              i -= 1
            }
          }
          removeClass(dom, 'active')
        }
      },
      initPriceList(index) {
        if (this.goodSku.length < 2) {
          let obj = {}
          obj[this.goodSku[0].require] = {'id': this.newArr[0].id, 'attr_value': this.newArr[0].attr_value}
          obj = Object.assign(obj, {price: '', promotionPrice: '', purchasePrice: '', stock: '', sellerCode: ''})
          this.errorArr.push([{isShow: false, msg: ''}, {isShow: false, msg: ''}, {isShow: false, msg: ''}, {isShow: false, msg: ''}, {isShow: false, msg: ''}])
          this.combSku.push(obj)
          return false
        }
        // 去除子数组中 undefined 属性
        let removeEmpty = this.selectArr.map((item, index) => {
          let arr = []
          item.forEach((value, i) => {
            if (value) {
              arr.push(value)
            }
          })
          return arr
        })
        removeEmpty[index] = this.newArr
        var newArr = this.handleCombine(removeEmpty)
        // 生成 combSku 数组项中的数据结构
        for (let i = 0; i < newArr.length; i++) {
          if (newArr[i].indexOf(undefined) !== -1) {
            continue
          }
          let obj = {}
          for (let m = 0; m < newArr[i].length; m++) {
            obj[this.goodsAttrKey[m]] = {'id': newArr[i][m].id, 'attr_value': newArr[i][m].attr_value}
          }
          obj = Object.assign(obj, {price: '', promotionPrice: '', purchasePrice: '', stock: '', sellerCode: ''})
          this.combSku.push(obj)
          this.errorArr.push([{isShow: false, msg: ''}, {isShow: false, msg: ''}, {isShow: false, msg: ''}, {isShow: false, msg: ''}, {isShow: false, msg: ''}])
        }
      },
      // 传入多维数组返回不同的组合
      handleCombine(arr) {
        var len = arr.length
        if (len >= 2) {
          var len1 = arr[0].length
          var len2 = arr[1].length
          var lenBoth = len1 * len2
          var items = new Array(lenBoth)  // 3
          var index = 0
          for (var i = 0; i < len1; i++) {
            for (var j = 0; j < len2; j++) {
              if (arr[0][i] instanceof Array) {
                items[index] = arr[0][i].concat(arr[1][j])
              } else {
                items[index] = [arr[0][i]].concat(arr[1][j])
              }
              index++
            }
          }
          var newArr = new Array(len - 1)
          for (var n = 2; n < arr.length; n++) {
            newArr[n - 1] = arr[n]
          }
          newArr[0] = items
          return this.handleCombine(newArr)
        } else {
          return arr[0]
        }
      },
      // 弹窗
      showConfirm() {
        this.$refs.confirm.show()
      },
      showPop(title) {
        this.showMess = title
        this.$refs.pop.show()
        this.$refs.pop.hide()
        return
      },
      // 提交信息到父组件
      setSave() {
        let checkSuc = true
        let checkRepeat = {}
        if (this.combSku.length > 0) {
          this.combSku.map((val, index) => {
            if (!this.isChooseSec) {
              // 零售标价校验
              if (util.checkPrice(val.price, '零售').is === 'N') {
                this.errorArr[index][0].isShow = true
                this.errorArr[index][0].msg = util.checkPrice(val.price, '零售').msg
                checkSuc = false
              } else {
                this.errorArr[index][0].isShow = false
              }
              // 零售底价校验
              if (util.checkPrice(val.promotionPrice, '推荐').is === 'N') {
                this.errorArr[index][1].isShow = true
                this.errorArr[index][1].msg = util.checkPrice(val.promotionPrice, '推荐').msg
                checkSuc = false
              } else {
                this.errorArr[index][1].isShow = false
                if (val.price && Number(val.promotionPrice) >= Number(val.price)) {
                  this.errorArr[index][1].isShow = true
                  checkSuc = false
                  this.errorArr[index][1].msg = '零售底价必须小于零售标价'
                }
              }
              // 直采价校验
              if (util.checkPrice(val.purchasePrice, '采购').is === 'N') {
                this.errorArr[index][2].isShow = true
                this.errorArr[index][2].msg = util.checkPrice(val.purchasePrice, '采购').msg
                checkSuc = false
              } else {
                this.errorArr[index][2].isShow = false
                if (val.price && Number(val.purchasePrice) >= Number(val.promotionPrice)) {
                  this.errorArr[index][2].isShow = true
                  checkSuc = false
                  this.errorArr[index][2].msg = '直采价必须小于零售底价'
                }
              }
            }
            // 库存合法性
            if (util.checkStock(val.stock).is === 'N') {
              this.errorArr[index][3].isShow = true
              this.errorArr[index][3].msg = util.checkStock(val.stock).msg
              checkSuc = false
            } else {
              this.errorArr[index][3].isShow = false
            }
            // 商品编码合法性
            if (util.checkGoodsCode(val.sellerCode).is === 'N') {
              this.errorArr[index][4].isShow = true
              this.errorArr[index][4].msg = util.checkGoodsCode(val.sellerCode).msg
              checkSuc = false
            } else {
              if (checkRepeat[val.sellerCode] && val.sellerCode !== '') {
                this.errorArr[index][4].isShow = true
                this.errorArr[index][4].msg = '同一商品不同规格编码不能重复'
                checkSuc = false
              } else {
                this.errorArr[index][4].isShow = false
                checkRepeat[val.sellerCode] = true
              }
            }
          })
        }
        if (!checkSuc) {
          return false
        }
        this.$emit('emitCombSpec', this.combSku)
        this.$router.back()
      },
      setAllPrice(price, promotionPrice, purchasePrice, stock) {
        for (let i = 0; i < this.combSku.length; i++) {
          this.combSku[i].price = price
          this.combSku[i].promotionPrice = promotionPrice
          this.combSku[i].purchasePrice = purchasePrice
          this.combSku[i].stock = stock
        }
      }
    },
    components: {
      Group,
      XInput,
      FootBtn,
      Pop,
      Scroll,
      Confirm
    }
  }
</script>

<style scoped lang="stylus">
@import '~common/stylus/mixin.styl';
@import '~common/stylus/variable.styl';
.commodity-spec {
  position: fixed;
  z-index: 200;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: $color-white;
  overflow-y: hidden;
  .spec-main {
    position: absolute
    width: 100%
    top: 0
    right: 0
    bottom: 89px;/*px*/
    .main-top {
      padding: 25px 15px 5px 15px;
    }
  }
  .foot {
    width 100%
    position: absolute
    left: 0
    bottom: 0
  }
  .spec-scroll {
    height 100%
    overflow hidden
  }
  .split-div {
    width: 100%;
    height: 20px; /* px */
    background: $color-body;
  }
  // .inp-seller-code{
  //   width: 31.3%;
  // }
  .spe-li {
    margin-top: 15px;

    h5 {
      font-size: 30px; /* px */
      padding-left: 10px;
    }

    .spec-dom {
      margin-top: 28px;
      display: flex;
      flex-wrap: wrap;
      .spce-dom-content {
        width 100%
        display flex
        flex-wrap wrap
      }
      .spec-dom-list {
        text-align: center;
        width: 30.5%;
        border: 1px solid $color-border; /* no */
        font-size: 26px; /* px */
        color: $color-6;
        padding: 16px 0;
        margin: 0 10px 22px 10px;
        &.active {
          border-color: $color-orange;
          color: $color-orange;
        }
        &.spec_item_dom {
          width 47.2%
        }
      }
    }
    ul {
      margin-top: 28px;
      display: flex;
      flex-wrap: wrap;

      li {
        text-align: center;
        width: 30.5%;
        border: 1px solid $color-border; /* no */
        font-size: 26px; /* px */
        color: $color-6;
        padding: 16px 0;
        margin: 0 10px 22px 10px;
        overflow hidden
        white-space nowrap 
        text-overflow ellipsis
        &.active {
          border-color: $color-orange;
          color: $color-orange;
        }
      }
    }
  }

  .main-sec {
    padding: 0 25px;

    .null-top {
      h5 {
        font-size: 30px; /* px */
        padding: 38px 0 22px;
      }

      p {
        font-size: 24px; /* px */
        color: $color-c;
        letter-spacing: 1px; /* no */
      }
    }

    .sec-top {
      padding: 38px 0;
      flex-between();
      border-bottom();

      .left {
        font-size: 30px; /* px */
      }

      .right {
        font-size: 26px; /* px */
        color: $color-9;
      }
    }

    .mess-show {
      font-size: 24px; /* px */
      color: $color-c;
    }
    .commission-introduce {
      display: flex;
      font-size: 24px; /* px */
      color $color-c
      line-height 40px
      .commisson-icon {
        width 26px
        height 26px
        background url('./i.png') no-repeat center
        background-size 100% 100%
        margin-right 10px
        margin-top 6px
      }
    }

    .spe-input {
      padding: 26px 0 10px;

      h5 {
        font-size: 28px; /* px */
      }

      .input-li {
        // margin-top: 22px;
        flex-between()
        flex-wrap wrap
        >div {
          width: 48%
          margin-top: 22px;
        }
        p {
          color: $color-red
          font-size: 22px;/*px*/
          padding-left: 26px;/*px*/
          background: url('iRed.png') no-repeat left 6px
          background-size: 20px 20px;/*px*/
        }
        h2 {
          font-size 28px;/*px*/
          margin-top 20px
          span {
            color $color-c
            &.active {
              color $color-red
            }
          }
        }
      }
    }
  }
}
</style>
