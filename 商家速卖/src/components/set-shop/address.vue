<template>
  <div class="addresscontent">
    <div class="addressbox">
      <group>
        <x-address title="" @on-show="logShow" v-model="value4" :list="addressData" @on-shadow-change="shadowChange" placeholder="请选择地区"></x-address>
      </group>
    </div>
    <div class="address" @click="txt">
      <textarea placeholder="潮州路599号2楼" v-model="location">{{detail.address}}</textarea>
      <span><i>{{this.location.length}}</i>/50</span>
    </div>
    <div class="btn" @click="locationAddress" ref="btn" :class="isActive ? 'active' : ''">保存
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { cityList } from '../../../data/areaAddress'
  import { Group, XAddress, ToastPlugin } from 'vux'
  import { loadData, STATUS_OK } from 'api/common'
  Vue.use(ToastPlugin)
  import Vue from 'vue'
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        addressData: cityList,
        value4: [],
        location: '',
        isActive: false,
        detail: {}
      }
    },
    computed: {
      ...mapGetters(['addressId'])
    },
    created() {
      this.addressDetail()
    },
    mounted() {
      this.value4 = this.addressId
    },
    methods: {
      // 地址详情接口
      addressDetail() {
        let URL = '/shop/shopMange'
        loadData(URL).then((res) => {
          if (res.code === STATUS_OK) {
            this.detail = res.data
            console.log(this.detail, 2)
          } else {
            console.log(7)
          }
        })
      },
      shadowChange(ids) {
        console.log(ids)
      },
      txt() {
        this.isActive = true
      },
      // 保存按钮
      locationAddress() {
        this.shopAddress()
      },
      logShow () {
        console.log((this.value4), 5)
      },
      // 经营地址接口
      shopAddress() {
        let URL = 'shop/shopAddress'
        let obj = {
          province: this.value4[0],
          city: this.value4[1],
          area: this.value4[2],
          address: this.location,
          type: 2
        }
        loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            console.log(res, 9)
            this.$vux.toast.text('添加成功')
            this.$router.push('/set-shop')
          } else {
            console.log(7)
          }
        })
      }
    },
    components: {
      Group,
      XAddress
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  body
    background: $color-white