<template>
  <select-base :options="navList" v-model="chooseNav" @change="navLink"></select-base>
</template>
<script>
import SelectBase from 'base/select/select-base'
import {loadData, STATUS_OK} from 'api/common'
export default {
  components: {
    SelectBase
  },
  data() {
    return {
      navList: [
        {name: '提交资料数', value: 'data-count'},
        {name: '活动支付数', value: 'pay-count'},
        {name: '线下录入', value: 'line-submit'},
        {name: '签到成功', value: 'sign'},
        {name: '销售金额', value: 'sale-count'},
        {name: '定金金额', value: 'sale-count2'}
      ],
      chooseNav: 'data-count'
    }
  },
  created() {
    // let temp = this.navList[Number(this.$route.query.type)]
    // this.navList[Number(this.$route.query.type)] = this.navList[0]
    // this.navList[0] = temp
    this.navList.forEach((item) => {
      if (item.value === this.$route.name) {
        this.chooseNav = item.value
      }
    })
    this.getData()
  },
  methods: {
    getData() {
      loadData('analytics/getListCount', {
        actId: this.$route.params.id,
        distributor: this.$route.query.shopid === undefined ? '' : this.$route.query.shopid,
        salesman: this.$route.query.salesmanid === undefined ? '' : this.$route.query.salesmanid
      }).then((data) => {
        if (data.code === STATUS_OK) {
          this.navList.forEach((item, index) => {
            item.name = `${data.data[index].name}(${data.data[index].count})`
          })
        }
      })
    },
    navLink(data) {
      let shopid = this.$route.query.shopid === undefined ? '' : this.$route.query.shopid
      let salesmanid = this.$route.query.salesmanid === undefined ? '' : this.$route.query.salesmanid
      this.$router.replace(`/all-statistic/${data}/${this.$route.params.id}?shopid=${shopid}&salesmanid=${salesmanid}`)
    }
  }
}
</script>
<style lang="stylus" scoped>
.select_base_container
  font-size 28px;/*px*/
</style>


