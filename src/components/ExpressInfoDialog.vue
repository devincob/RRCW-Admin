<template>
  <div class="express-dialog-component">
    <CPicker title="快递信息" :visible.sync="visibleDialog">
      <div>
        <div>
          <el-form :inline="true" size="mini" class="express-form">
            <el-form-item label="快递地址" label-width="70px">
              <el-input placeholder="请输入快递地址" v-model="form.address" style="width: 140px"/>
            </el-form-item>
            <el-form-item label="收件人" label-width="70px">
              <el-input placeholder="请输入收件人" v-model="form.receiver" style="width: 140px"/>
            </el-form-item>
            <el-form-item label="收件人电话" label-width="90px">
              <el-input placeholder="请输入收件人电话" v-model="form.phone" style="width: 140px"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loadDetail">搜索</el-button>
              <el-button type="danger" @click="clearQueryParams">清空</el-button>
            </el-form-item>
          </el-form>
          <table class="express-table" :class="['details-table', `info-item${index}`]" v-for="(item, index) in expressInfo" :key="index">
            <tr>
              <td class="td-label">快递地址</td>
              <td>
                <el-input v-model="item.address" size="mini" v-if="item.editMode"/>
                <span v-else>{{item.address}}</span>
              </td>
              <td class="td-label">收件人</td>
              <td>
                <el-input v-model="item.receiver" size="mini" v-if="item.editMode"/>
                <span v-else>{{item.receiver}}</span>
              </td>
            </tr>
            <tr>
              <td class="td-label">收件人电话</td>
              <td>
                <el-input v-model="item.phone" size="mini" v-if="item.editMode"/>
                <span v-else>{{item.phone}}</span>
              </td>
              <td class="td-label"></td>
              <td></td>
            </tr>
            <tr>
              <td class="td-label">备注</td>
              <td colspan="3">
                <el-input v-model="item.remark" size="mini" v-if="item.editMode"/>
                <span v-else>{{item.remark}}</span>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <el-button type="primary" size="mini" @click="onChoose(item, index)">选择</el-button>
                <el-popover
                  placement="top"
                  width="160"
                  v-model="item.showPop">
                  <p>确定删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="item.showPop = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="onDelect(item, index)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="text" size="mini" style="float: right">删除</el-button>
                </el-popover>
                <el-button type="text" size="mini" class="mr-sm" style="float: right" v-if="item.editMode" @click="onSave(item, index)">保存</el-button>
                <el-button type="text" size="mini" class="mr-sm" style="float: right" v-else @click="item.editMode = true">修改</el-button>
              </td>
            </tr>
          </table>
        </div>
        <el-row style="margin-top: 15px;">
          <el-col :span="24" style="text-align: center">
            <el-button size="mini" type="text" @click="addExpress"><i class="el-icon-circle-plus-outline"></i>添加快递信息</el-button>
          </el-col>
        </el-row>
      </div>
    </CPicker>
    <el-button type="text" size="mini" @click="visibleDialog=true">
      <slot></slot>
    </el-button>
  </div>
</template>

<script>
import CPicker from './CPicker'
export default {
  name: 'CompanyDetailsDialog',
  components: {CPicker},
  props: ['customerId'],
  watch: {
    visibleDialog(val){
      if (val) {
        if (!this.customerId) {
          this.visibleDialog = false
          this.$message.error('请先选择客户')
        } else {
          this.loadDetail()
        }
      }
    }
  },
  data(){
    return {
      visibleDialog: false,
      form: {
        address: '',
        receiver: '',
        phone: ''
      },
      editMode: false,
      expressInfo: [],
      expressForm: {
        customerId: '',
        addressId: '', // 地址编号
        address: '', // 地址
        receiver: '', // 收件人
        phone: '', // 电话
        remark: '', // 备注
        editMode: true,
        showPop: false
      },
      saveLoading: null
    }
  },
  methods: {
    clearQueryParams(){
      this.form = {
        address: '',
        receiver: '',
        phone: ''
      }
      this.loadDetail()
    },
    async loadDetail(){
      this.openLoading(null, '正在查询...')
      try {
        let list = await this.$$main.customerListAddress({
          ...this.form,
          customerId: this.customerId
        })
        list.forEach((i) => {
          i.customerId = this.customerId
          i.editMode = false
          i.showPop = false
        })
        this.expressInfo = list
      } catch (e){
        this.expressInfo = []
      } finally {
        this.closeLoading()
      }
    },
    onPreviewImageClick(img){
      window.open(this.getUploadImageUrl(img, null))
    },
    async onDelect(item, index){
      item.showPop = false
      if (!item.addressId || item.addressId === '') {
        this.expressInfo.splice(index, 1)
        return
      }
      try {
        this.openLoading(`.info-item${index}`, '正在删除...')
        await this.$$main.customerDeleteAddress({
          addressId: item.addressId
        })
        this.expressInfo.splice(index, 1)
      } catch (e){
        e.message && this.$message.error(e.message)
      } finally {
        this.closeLoading()
      }
    },
    addExpress(){
      this.expressForm.customerId = this.customerId
      this.expressInfo.push(JSON.parse(JSON.stringify(this.expressForm)))
    },
    async onSave(item, index, callback){
      if (!item.address || item.address === '') {
        this.$message.error('地址是必填的')
        return
      }
      if (!item.receiver || item.receiver === '') {
        this.$message.error('收件人是必填的')
        return
      }
      if (!item.phone || item.phone === '') {
        this.$message.error('电话是必填的')
        return
      }
      try {
        this.openLoading(`.info-item${index}`)
        await this.$$main.customerModifyAddress(item)
        this.closeLoading()
        item.editMode = false
        this.loadDetail()
        callback && callback()
      } catch (e){
        this.closeLoading()
        e.message && this.$message.error(e.message)
      }
    },
    onChoose(item, index){
      if (!item.addressId || item.editMode) {
        this.onSave(item, index, () => {
          this.$emit('onChoose', item)
          this.visibleDialog = false
        })
      } else {
        this.$emit('onChoose', item)
        this.visibleDialog = false
      }
    },
    openLoading(target, text = '正在保存...') {
      this.saveLoading = this.$loading({
        lock: true,
        text: text,
        spinner: 'el-icon-loading',
        target: target
      })
    },
    closeLoading(){
      this.saveLoading.close()
    }
  }
}
</script>

<style lang="scss">
  .express-dialog-component{
    .express-form .el-form-item__content{
      display: inline-block;
    }
    .details-table,.details-table tr th, .details-table tr td {
      border:1px solid #e5e5e5;
    }
    .details-table {
      width: 100%;
      border-collapse:collapse;
      border-spacing:1px 1px;
      table-layout: fixed;
      word-break:break-all;
      margin-bottom: 10px;
    }
    .details-table td {
      border: 0;
      padding: 4px 6px;
      word-wrap: break-word;
      white-space: normal;
      vertical-align: baseline;
    }
    .el-input{
      width: 100%;
    }
    .td-label {
      text-align: right;
      width: 100px;
      font-size: 13px;
    }
  }
</style>
