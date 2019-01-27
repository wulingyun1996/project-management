<template>
  <div class="underVip">
    <div class="underButton">
       <!-- <base-button
        :type="2"
        text="创建品牌馆信息"
        @clickCurrentButton="searchGoodsList"
        v-show="isShow">
      </base-button> -->
      <span @click="searchGoodsList" v-show="isShow">创建品牌馆信息</span>
    </div>
    <test :data="data" :columns="columns" :componentList="componentList" :total="1" @bSubmit="buttonSubmit"></test>
    <!-- 新增弹框 -->
    <el-dialog title="新增品牌馆" :visible.sync="dialogVisible">
      <el-form :model="form" ref="form" status-icon :rules="rules">
        <el-form-item label="品牌馆名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌馆地址" :label-width="formLabelWidth" prop="address">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="buttonn">
            <el-button type="primary" @click="submit('form')">确认提交</el-button>
            <el-button @click="reset('form')">放弃</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑弹框 -->
    <el-dialog title="广告位编辑" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" status-icon :rules="rules">
        <el-form-item label="品牌馆名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌馆地址" :label-width="formLabelWidth" prop="address">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="buttonn">
            <el-button type="primary" @click="submitForm('form')">确认修改</el-button>
            <el-button @click="resetForm">放弃</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import test from 'components/table/index'
import BaseButton from 'components/table-button'
const data = []
const columns = [
  { label: '品牌馆名称', prop: 'brand_house_name' },
  { label: '品牌馆地址', prop: 'brand_house_address' }
]
const buttonList = [
  {
    text: '编辑广告',
    buttonType: 3
  },
  {
    text: '编辑',
    buttonType: 2
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
    insertIndex: 3,
    // 传入的自定义事件名称，默认是 buttonSubmit                                   --> String
    eventType: 'bSubmit'
  }
]
export default {
  data () {
    return {
      componentList,
      data,
      columns,
      dialogFormVisible: false,
      dialogVisible: false,
      checkId: '',
      isShow: true,
      formLabelWidth: '120px',
      form: {
        name: '',
        address: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入品牌馆名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入品牌馆地址名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.$http('adv/getList').then(res => {
        console.log(res)
        this.data = res.data
        if (this.data.length >=2) {
          this.isShow = false
        } else {
          this.isShow = true
        }
      })
    },
    buttonSubmit (row, type) {
      if (type === 2) {
        this.checkId = row.id
        this.dialogFormVisible = true
        let obj = {
          id: row.id
        }
        this.$http('adv/editDetail', obj).then(res => {
          if (res.code === this.$ok) {
            this.form.name = res.data.brand_house_name
            this.form.address = res.data.brand_house_address
          }
        })
      }
      if (type === 4) {
        this.$confirm('你确定要删除吗? 是否确定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            id: row.id
          }
          this.$http('adv/delBrandHouse', obj).then(res => {
            if (res.code === this.$ok) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getData()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
      if (type === 3) {
        this.$router.push({ path: '/manage-market/edit-advertising', query: { id: row.id } })
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let obj = {
            brand_house_name: this.form.name,
            brand_house_address: this.form.address,
            id: this.checkId
          }
          this.$http('adv/addBrandHouse', obj).then(res => {
            if (res.code === this.$ok) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.dialogFormVisible = false
              this.getData()
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm () {
      this.dialogFormVisible = false
    },
    searchGoodsList () {
      this.dialogVisible = true
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let obj = {
            brand_house_name: this.form.name,
            brand_house_address: this.form.address,
          }
          this.$http('adv/addBrandHouse', obj).then(res => {
            if (res.code === this.$ok) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.getData()
            }
          })
        } else {
          return false
        }
      })
      this.$refs[formName].resetFields()
    },
    reset (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    }
  },
  components: {
    test
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/mixins'
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
.underButton
  margin-bottom 20px
  span
    font-size 14px
    width 120px
    height 35px
    background-color #67c23a
    display block
    text-align center
    line-height 35px
    color #fff
    border-radius 5px
    cursor pointer
  .base-button-item
    width 120px
    height 40px
    .el-button
      span
        width 120px
        height 40px
</style>
