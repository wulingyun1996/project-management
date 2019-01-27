<template>
  <div class="channel-statistics-container">
    <div class="channel-button">
      <base-button :type="2" text="新增" @clickCurrentButton="addChannel"></base-button>
    </div>
    <div class="channel-content">
      <base-table
        :data="tableData"
        :columns="columns"
        :total="total"
        :componentList="choosedComponentList"
        @buttonSubmit="typeSubmit"
        @changePage="changePage"
        >
      </base-table>
      <!-- 新增弹框 -->
      <el-dialog title="新增渠道推广" :visible.sync="dialogVisible">
        <el-form :model="form" ref="form" status-icon :rules="rules">
          <el-form-item label="渠道推广名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="buttonn">
              <el-button type="primary" @click="giveUp('form')">确认提交</el-button>
              <el-button @click="reset('form')">放弃</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import BaseTableButton from 'components/table-button'
import BasePopup from 'components/popup'
import { mixins } from 'mixins'
const columns = [
  {
    label: '序号',
    prop: 'index',
    width: 150
  },
  {
    label: '名称',
    prop: 'name'
  },
  {
    label: '链接',
    prop: 'url'
  },
  {
    label: '创建时间',
    prop: 'created_at'
  }
]
const cityList = [
  {
    text: '下载二维码',
    buttonType: 3,
    type: 'warning',
    size: 'small'
  },
  {
    text: '查看报表',
    buttonType: 2,
    type: 'success',
    size: 'small'
  }
]
const buttonList = [
  {
    text: '下载二维码',
    buttonType: 3,
    type: 'warning',
    size: 'small'
  },
  {
    text: '查看报表',
    buttonType: 2,
    type: 'success',
    size: 'small'
  },
  {
    text: '删除',
    buttonType: 4,
    type: 'danger',
    size: 'small'
  }
]
const choosedComponentList = [
  {
    // 要插入的某一个组件。可以自定义一个组件                                      --> component
    component: BaseTableButton,
    // 当前列的表头的名称                                                        --> String
    label: '操作',
    // 当前列的宽度                                                              --> Number
    width: 300,
    // 如果当前列是带有按钮的列，需要指定该项，如果不是带有按钮的列，该项可以不填，    --> Array
    // 要插入的索引                                                              --> Number
    insertIndex: 5,
    // 传入的自定义事件名称，默认是 buttonSubmit                                   --> String
    eventType: 'buttonSubmit'
  }
]
export default {
  name: 'ChannelStatistics',
  mixins: [mixins],
  data () {
    return {
      columns,
      choosedComponentList,
      dialogVisible: false,
      // 城市ID
      cityId: '',
      formLabelWidth: '120px',
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入渠道推广名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在20个字符以内', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getCity().then(() => {
      this.getTableData()
    })
  },
  methods: {
    async getCity () {
      await this.$http('userInfo').then(res => {
        if (res.code === this.$ok) {
          this.cityId = res.data.service_city
        }
      })
    },
    getTableData () {
      let { page, pageSize } = this
      let url = 'analytics/channelList'
      let obj = {
        page,
        pageSize,
        op_city: this.cityId
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerTableData(res.data.data)
          this.tableData = res.data.data
          this.total = res.data.total
          return
        }
        this.$mes(res.message, 2)
      })
    },
    handlerTableData (data) {
      data.forEach((item, index, arr) => {
        item.index = (index + 1) + ((this.page - 1) * this.pageSize)
        if (item.creator === '城市运营商') {
          item.buttonList = JSON.parse(JSON.stringify(buttonList))
        } else {
          item.buttonList = JSON.parse(JSON.stringify(cityList))
        }
      })
    },
    typeSubmit (row, type) {
      if (type === 4) {
        this.$confirm('删除后，该渠道的数据统计也会被删除。您确定要删除该推广渠道吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = 'analytics/deleteChannel'
          let obj = {
            channel_id: row.id
          }
          this.$http(url, obj).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTableData()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
      if (type === 3) {
        let qrcodeUrl = process.env.VUE_APP_QRCODE_URL
        let url = `http://${qrcodeUrl}/v1/analytics/downloadChannelQrcode?channel_id=${row.id}`
        window.location.href = url
        this.$message({
          message: '下载成功',
          type: 'success'
        })
      }
      if (type === 2) {
        this.$router.push({ path: '/manage-statistics/channel-statistics-detaile', query: { id: row.id, dataTime: row.created_detail } })
      }
    },
    changePage (page) {
      this.page = page
      this.getTableData()
    },
    addChannel () {
      this.dialogVisible = true
    },
    // 新增渠道推广
    giveUp (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let obj = {
            channel_name: this.form.name,
            op_city: this.cityId,
            creator: '城市运营商'
          }
          this.$http('analytics/addChannel', obj).then(res => {
            if (res.code === this.$ok) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs[formName].resetFields()
              this.dialogVisible = false
              this.getTableData()
              return
            }
            this.$mes(res.message, 2)
          })
        } else {
          return false
        }
      })
    },
    reset (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    }
  },
  components: {
    BasePopup
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.channel-content
  margin-top 50px
  .el-dialog
    width 40%
  .el-input
    width 40%
  .buttonn
    margin-left 120px
    margin-top 50px
    .el-button
      width 100px
      height 40px
      text-align center
      line-height 15px
    .el-button + .el-button
      margin-left 60px
</style>
