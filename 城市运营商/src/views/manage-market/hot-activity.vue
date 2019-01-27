<template>
  <div class="activities">
    <el-button type="primary" size="mini" @click="add">新增</el-button>
    <el-button type="primary" size="mini" @click="advsitiong">广告位</el-button>
    <div class="shop-list">
      <test :data="data" :total="2" :columns="columns" :componentList="componentList" :pageSize="3" @bSubmit="pop" ></test>
    </div>
    <div class="activity">
      <el-dialog title="选择活动" :visible.sync="dialogTableVisible" width="60%">
        <div class="choose-goods-header">
          <base-select
            placeholder="请选择"
            :options="options"
            @changeCurrentOption="changeCurrentOption">
          </base-select>
          <base-input
            placeholder="请输入关键字查找"
            @changeInputValue="getSearchKeyWords"
            class="search-input">
          </base-input>
          <base-button
            :type="1"
            text="搜索"
            @clickCurrentButton="searchGoodsList">
          </base-button>
        </div>
      <test :data="checkDate" :total="Number(checkTotal)" :columnType="chbox" :columns="columns"  :limitTotal="1" @selectionChange="check" @changePage="getGoodsListByPage"></test>
      <div class="addmit">
        <el-button type="primary" @click="addMit">确定</el-button>
      </div>
    </el-dialog>
    </div>
    </div>
</template>
<script>
import test from 'components/table/index'
import BaseButton from 'components/table-button'
import buttonn from 'components/button/index'
import { initTime } from 'utils/common'
const data = []
const checkDate = []
const columns = [
  { label: '活动主题', prop: 'title' },
  { label: '商圈名称', prop: 'union_name' },
  { label: '活动开始时间', prop: 'start_at' },
  { label: '活动结束时间', prop: 'end_at' },
  { label: '活动创建时间', prop: 'created_at' },
  { label: '状态', prop: 'status' }
]
const buttonList = [
  {
    text: '查看详情',
    buttonType: 1
  },
  {
    text: '删除',
    buttonType: 4
  }
]
const componentList = [
  {
    // 要插入的某一个组件。可以自定义一个组件                                      --> component
    component: BaseButton,
    // 当前列的表头的名称                                                        --> String
    label: '操作',
    // 当前列的宽度                                                              --> Number
    width: 300,
    // 如果当前列是带有按钮的列，需要指定该项，如果不是带有按钮的列，该项可以不填，    --> Array
    buttonList: buttonList,
    // 要插入的索引                                                              --> Number
    insertIndex: 6,
    // 传入的自定义事件名称，默认是 buttonSubmit                                   --> String
    eventType: 'bSubmit'
  }
]
const options = [
  {
    value: 1,
    label: '活动名称'
  }, {
    value: 2,
    label: '商圈名称'
  }
]
export default {
  data () {
    return {
      chbox: 'selection',
      dialogVisible: false,
      options,
      activityData: [],
      checkDate,
      data,
      columns,
      componentList,
      dialogTableVisible: false,
      dialogFormVisible: false,
      checkTotal: '',
      checkId: '',
      currentOption: 0, // 当前选择项
      keyWords: '', // 搜索关键字,
    }
  },
  created () {
    this.getDate()
  },
  methods: {
    getDate () {
      this.$http('adv/listHotAdv').then(res => {
        if (res.code === this.$ok) {
          this.data = res.data
        }
      })
    },
    check (rows) {
      rows.forEach(ele => {
        this.checkId = ele.id
      })
    },
    addMit () {
      let obj = {
        id: this.checkId
      }
      this.$http('adv/addHotAdv', obj).then(res => {
        if (res.code === this.$ok) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.getDate()
          this.dialogTableVisible = false
          this.checkId = []
        }
      })
    },
    pop (row, type) {
      if (type === 1) {
        // let obj = {
        //   id: row.id
        // }
        // this.$http('adv/detailHotAdv', obj).then(res => {
        //   this.activityData = res.data
        // })
        // this.dialogVisible = true
        this.$router.push({ path: '/manage-market/hot-activity-details', query: { id: row.id } })
      }
      if (type === 4) {
        this.$confirm('您确定要删除此活动吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            id: row.id
          }
          this.$http('adv/delHotAdv', obj).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDate()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    add () {
      this.$http('union/getUnionActList').then(res => {
        if (res.code === this.$ok) {
          this.checkDate = res.data.data
          this.checkTotal = res.data.total
          const nowTime = new Date() - 0
          res.data.data.forEach(ele => {
            if (ele.status === 0 && initTime(ele.end_at) >= nowTime) {
              ele.status = '进行中'
            } else {
              ele.status = '已结束'
            }
            if (ele.status === 1 && initTime(ele.end_at) <= nowTime) {
              ele.status = '已结束'
            }
          })
        }
      })
      this.dialogTableVisible = true
    },
    advsitiong () {
      this.$router.push('/manage-market/hot-advertising')
    },
    // 下拉框
    changeCurrentOption (value) {
      this.currentOption = value
    },
    // 关键字
    getSearchKeyWords (value) {
      this.keyWords = value
    },
    // 搜索按钮
    searchGoodsList () {
      let currentOption = this.currentOption
      let keyWords = this.keyWords
      let title = ''
      let union_name = ''
      switch (currentOption) {
        case 1:
          title = keyWords
          break
        case 2:
          union_name = keyWords
          break
      }
      let obj = {
        page: 1,
        pageSize: 5,
        title,
        union_name
      }
      this.$http('union/getUnionActList', obj).then(res => {
        if (res.code === this.$ok) {
          this.checkDate = res.data.data
          this.checkTotal = res.data.total
          const nowTime = new Date() - 0
          res.data.data.forEach(ele => {
            if (ele.status === 0 && initTime(ele.end_at) >= nowTime) {
              ele.status = '进行中'
            } else {
              ele.status = '已结束'
            }
            if (ele.status === 1 && initTime(ele.end_at) <= nowTime) {
              ele.status = '已结束'
            }
          })
        }
      })
    },
    // 根据页码加载
    getGoodsListByPage (page) {
      this.page = page
      this.$http('union/getUnionActList', { page: this.page, pageSize: 10 }).then(res => {
        if (res.code === this.$ok) {
          this.checkDate = res.data.data
          this.checkTotal = res.data.total
          const nowTime = new Date() - 0
          res.data.data.forEach(ele => {
            if (ele.status === 0 && initTime(ele.end_at) >= nowTime) {
              ele.status = '进行中'
            } else {
              ele.status = '已结束'
            }
            if (ele.status === 1 && initTime(ele.end_at) <= nowTime) {
              ele.status = '已结束'
            }
          })
        }
      })
    }
  },
  components: {
    test,
    buttonn
  }
}
</script>
<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.details
  overflow hidden
  .el-dialog
    width 600px
    margin-top 1vh
    height 100%
.addmit
  position relative
  left 50%
  margin-left -40px
  margin-top 20px
.buttonItem
  position absolute
  top 45px
  right 30px;
.serach
  position absolute
  right 120px
  top 40px
.el-input
  width 260px
  margin-left 10px
.el-button
  width 80px
  margin-left 20px
.shop-list
  margin-top 50px
h3
  color #000
  text-align center
  font-weight 600
.content
  width 450px
  margin-top 10px
  margin-left 40px
  p
    margin-top 10px
    color #000
  .addres
    margin-left 42px
.bigimg
  margin-top 10px
  width 450px
  height 100px
  margin-left 40px
  img
    width 100%
    height 100%
    display block
.prand
  margin-top 10px
  margin-left 40px
  height 80px
  ul
    margin-left: 65px;
    margin-top: -10px;
    li:nth-child(n+5)
      margin-top 10px
    li
      width 80px
      height 30px
      float left
      margin-left 10px
      img
        width 100%
        height 100%
        display block
.activity
  margin-top 10px
  margin-left 40px
  .actiImg
    margin-left 80px
    img
      width 300px
      height 100px
      display block
      margin-top 5px
    .activity-img
      width 300px
      height 400px
      border 1px solid #000
      margin-top 10px
      img
        width 100%
        height 100%
        display block
.choose-goods-header
  padding-bottom 20px
  flex-f-align()
  justify-content flex-end
  .search-input
    margin 0 10px
.choose-goods-body
  height 380px
.choos-goods-comfirm
  flex-f-align()
  justify-content flex-end
  padding 0 20px
  padding-bottom 20px
  margin-top -10px
  >div
    margin-right 10px
</style>
