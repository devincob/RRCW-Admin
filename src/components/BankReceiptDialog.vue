<template>
  <span class="el-button" style="padding: 0;border: none;background: none;">
    <el-dialog
      title="收款信息"
      v-drag-dialog="{reset: true}"
      :visible.sync="bankReceiptDialogDisplay"
      :close-on-click-modal="false"
      class="bank-receipt-dialog"
      width="800px"
      append-to-body
      center>
      <el-form ref="bankReceiptForm" :model="bankReceiptForm" label-width="100px" size="small">
        <div style="border: 1px solid #cecece;padding: 15px 0;margin-bottom: 5px;" v-for="(item, index) in bankReceiptList" :key="index">
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="收款方式" prop="bankNo">
                <el-select v-model="item.bankType" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in bankTypeList"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="流水号" prop="bankBillNo">
                <el-input v-model="item.bankBillNo" placeholder="流水号"/>
              </el-form-item>
              <el-form-item label="到账时间" prop="inDate">
                <el-date-picker
                  style="width: 100%;"
                  v-model="item.inDate"
                  type="datetime"
                  value-format="yyyy/MM/dd HH:mm:ss"
                  placeholder="到账时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="收款金额" prop="inAmount">
                <el-input v-model="item.inAmount" placeholder="到账金额" style="width: 92%"/> 元
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="上传回单截图" prop="billImgUrl" class="account-upload">
                <div>
                  <paste-upload-image
                    @success="url => { item.billImgUrl = url }">
                    <x-image v-if="item.billImgUrl" :src="item.billImgUrl" class="avatar radius6"/>
                    <div v-else class="avatar-uploader">
                      <div class="el-upload">
                        <i class="el-icon-plus avatar-uploader-icon" style="display: block"></i>
                      </div>
                    </div>
                  </paste-upload-image>
                  <preview-button type="text" size="mini" always-show new-window-open :src="item.billImgUrl" v-if="item.billImgUrl">查看原文件</preview-button>
                  <preview-button type="text" size="mini" :src="item.billImgUrl" v-if="item.billImgUrl">预览原文件</preview-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23" class="text-right">
              <!--<el-button size="mini" type="primary" @click="editBankReceipt(item, index)">保存</el-button>-->
              <el-button size="mini" type="danger" @click="deleteBankReceipt(item, index)">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <el-row style="margin-top: 15px;">
          <el-col :span="24" style="text-align: center">
            <el-button size="mini" @click="addBankReceipt"><i class="el-icon-circle-plus-outline"></i>添加收款信息</el-button>
            <el-button size="mini" type="primary" @click="submitBankReceipt" style="margin-left: 20px">保  存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-button
      :type="btnType"
      :size="btnSize"
      v-show="showBtn"
      @click="show">
      <slot></slot>
    </el-button>
  </span>
</template>

<script>
import PreviewButton from './PreviewButton'
import PasteUploadImage from './PasteUploadImage'
export default {
  name: 'bank-receipt-dialog',
  components: {PreviewButton, PasteUploadImage},
  props: {
    showBtn: {default: true},
    btnType: {default: 'text'},
    btnSize: {default: 'mini'},
    bankReceipts: Array,
    type: String,
    orderId: [String, Number]
  },
  data() {
    return {
      uploadLoading: null,
      bankTypeList: [{
        key: 'B',
        value: '银行'
      }, {
        key: 'A',
        value: '支付宝'
      }, {
        key: 'W',
        value: '微信'
      }],
      bankReceiptDialogDisplay: false,
      bankReceiptList: [],
      bankReceiptForm: {
        bankReceiptId: '', // 银行收款Id
        orderId: '', // 订单Id
        bankName: '', // 收款银行名称
        bankNo: '', // 收款银行账户
        bankType: '',
        bankBillNo: '', // 银行回单号
        inDate: '', // 到账日期
        inAmount: '', // 到账金额
        billImgUrl: '', // 回单图片URL
        orderType: this.type // 订单类型(A/I)
      },
      bankReceiptRules: [],
      errTimes: 0
    }
  },
  methods: {
    async show(){
      this.bankReceiptList = []
      let list = await this.queryBankReceipt()
      if (list && list.length > 0) {
        list.forEach((item) => {
          this.bankReceiptList.push({
            bankType: item.bankType,
            bankReceiptId: item.bankReceiptId, // 银行收款Id
            orderId: this.orderId, // 订单Id
            bankName: item.bankName, // 收款银行名称
            bankNo: item.bankNo, // 收款银行账户
            bankBillNo: item.bankBillNo, // 银行回单号
            inDate: item.showInDate, // 到账日期
            inAmount: item.inAmount, // 到账金额
            billImgUrl: item.billImgUrl, // 回单图片URL
            orderType: this.type // 订单类型(A/I)
          })
        })
      } else {
        this.addBankReceipt()
      }
      this.bankReceiptDialogDisplay = true
    },
    async queryBankReceipt(){
      try {
        const res = await this.$$main.orderQueryBankReceiptList({
          orderId: this.orderId,
          orderType: this.type
        })
        if (res && res.bankReceipts) {
          return res.bankReceipts
        }
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
      return []
    },
    addBankReceipt(){
      this.bankReceiptList.push({
        bankReceiptId: '', // 银行收款Id
        orderId: this.orderId, // 订单Id
        bankName: '', // 收款银行名称
        bankNo: '', // 收款银行账户
        bankBillNo: '', // 银行回单号
        inDate: '', // 到账日期
        inAmount: '', // 到账金额
        billImgUrl: '', // 回单图片URL
        orderType: this.type // 订单类型(A/I)
      })
    },
    async editBankReceipt(form, index){
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        this.bankReceiptList[index].bankReceiptId = await this.$$main.orderAOEditBankReceipt(form)
        this.$message({
          message: `保存成功`,
          type: 'success'
        })
        this.$emit('editSuccess')
      } catch (e) {
        this.errTimes++
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async deleteBankReceipt(form, index){
      if (!form.bankReceiptId || form.bankReceiptId === '') {
        this.bankReceiptList.splice(index, 1)
        return
      }
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderAODeleteBankReceipt(form)
        this.bankReceiptList.splice(index, 1)
        this.$message({
          message: `操作成功`,
          type: 'success'
        })
        this.$emit('deleteSuccess')
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    openLoading(target) {
      this.uploadLoading = this.$loading({
        lock: true,
        text: '文件上传中',
        spinner: 'el-icon-loading',
        target: target
      })
    },
    closeLoading(){
      this.uploadLoading.close()
    },
    async submitBankReceipt(){
      this.errTimes = 0
      for (let i = 0; i < this.bankReceiptList.length; i++) {
        await this.editBankReceipt(this.bankReceiptList[i], i)
      }
    }
  },
  mounted() {}
}
</script>

<style lang="scss">
  .bank-receipt-dialog{
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      i{
        font-size: 23px;
      }
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .radius6{
      border-radius: 6px;
    }
  }
</style>
