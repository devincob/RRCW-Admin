<template>
  <el-dialog
    title="发票信息"
    v-drag-dialog="{reset: true}"
    :visible.sync="invoiceDialogDisplay"
    :close-on-click-modal="false"
    width="750px"
    center>
    <el-form ref="invoiceForm" :model="invoiceForm" label-width="120px" size="small">
      <div style="border: 1px solid #cecece;padding: 15px;margin-bottom: 5px;" v-for="(item, index) in invoiceList" :key="index">
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间" prop="createTime">
              <el-input v-model="item.createTime" placeholder="创建时间" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="快递单号" prop="expressNo">
              <el-input v-model="item.expressNo" placeholder="快递单号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="快递公司" prop="expressName">
              <el-input v-model="item.expressName" placeholder="快递公司"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="快递回单截图" prop="billImgUrl" class="account-upload">
              <div style="display: flex">
                <paste-upload-image
                  @success="url => { item.expressImgUrl = url }">
                  <el-button type="text" size="mini">上传材料</el-button>
                </paste-upload-image>
                <div class="el-upload el-upload--text" style="margin-left: 10px">
                  <preview-button type="text" size="mini" show-preview-dialog always-show :src="item.expressImgUrl" v-if="item.expressImgUrl">查看原文件</preview-button>
                  <preview-button type="text" size="mini" :src="item.expressImgUrl" v-if="item.expressImgUrl">预览</preview-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="录入发票总张数" prop="expressNo">
              <el-input v-model.number="item.invoiceCount" placeholder="录入发票总张数"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际开票总金额" prop="expressName">
              <el-input v-model.number="item.invoiceAmount" placeholder="实际开票总金额"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="实际税额" prop="expressNo">
              <el-input v-model.number="item.taxAmount" placeholder="实际税额"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传发票图片" prop="billImgUrl" class="account-upload">
              <div style="display: flex">
                <paste-upload-image
                  @success="url => { item.invoiceImgUrl = url }">
                  <el-button type="text" size="mini">上传材料</el-button>
                </paste-upload-image>
                <div class="el-upload el-upload--text" style="margin-left: 10px">
                  <preview-button type="text" size="mini" show-preview-dialog always-show :src="item.invoiceImgUrl" v-if="item.invoiceImgUrl">查看原文件</preview-button>
                  <preview-button type="text" size="mini" :src="item.invoiceImgUrl" v-if="item.invoiceImgUrl">预览</preview-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align: right">
            <el-button size="mini" type="primary" @click="editInvoice(item, index)">保存</el-button>
            <el-button size="mini" type="danger" @click="deleteInvoice(item, index)">删除</el-button>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <el-row style="margin-top: 15px;">
      <el-col :span="24" style="text-align: center">
        <el-button size="mini" type="text" @click="addInvoice"><i class="el-icon-circle-plus-outline"></i>添加发票信息</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import PasteUploadImage from '../../../components/PasteUploadImage'
import PreviewButton from '../../../components/PreviewButton'
export default {
  name: 'invoice-dialog',
  components: {PasteUploadImage, PreviewButton},
  props: ['info'],
  data(){
    return {
      invoiceDialogDisplay: false,
      invoiceList: [],
      invoiceForm: {
        createTime: '',
        orderId: '', // 订单Id
        expressId: '',
        expressNo: '', // 快递单号
        expressImgUrl: '', // 快递单回单截图URL
        expressName: '顺丰快递', // 快递公司
        invoiceImgUrl: '', // 发票图片URL
        invoiceCount: '', // 发票数量
        invoiceAmount: '', // 开票总额
        taxAmount: '' // 税额
      }
    }
  },
  methods: {
    show(){
      this.invoiceList = []
      if (this.info.invoiceInfos && this.info.invoiceInfos.length > 0) {
        this.info.invoiceInfos.forEach((item) => {
          this.invoiceList.push({
            createTime: item.createTime,
            orderId: this.info.orderInfo.orderId, // 订单Id
            expressId: item.expressId,
            expressNo: item.expressNo, // 快递单号
            expressImgUrl: item.expressImgUrl, // 快递单回单截图URL
            expressName: item.expressName, // 快递公司
            invoiceImgUrl: item.invoiceImgUrl, // 发票图片URL
            invoiceCount: item.invoiceCount, // 发票数量
            invoiceAmount: item.invoiceAmount, // 开票总额
            taxAmount: item.taxAmount // 税额
          })
        })
      } else {
        this.addInvoice()
      }
      this.invoiceDialogDisplay = true
    },
    async editInvoice(form, index){
      let amount = 0
      this.invoiceList.forEach((i) => {
        amount = amount + Number((i.invoiceAmount || 0).toFixed(2))
      })
      if (amount > this.info.orderInfo.invoiceAmount || 0) {
        this.$message.error('实际开票总金额的总和不能大于该订单的开票金额')
        return
      }
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        this.invoiceForm.orderId = this.info.orderInfo.orderId
        this.invoiceList[index].expressId = await this.$$main.orderIOEditInvoice(form)
        this.$message({
          message: `保存成功`,
          type: 'success'
        })
        this.$emit('saved')
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    async deleteInvoice(form, index){
      if (!form.expressId || form.expressId === '') {
        this.invoiceList.splice(index, 1)
        return
      }
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        await this.$$main.orderIODeleteInvoice({
          expressId: form.expressId || 0
        })
        this.invoiceList.splice(index, 1)
        this.$message({
          message: `操作成功`,
          type: 'success'
        })
        this.$emit('saved')
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    addInvoice(){
      this.invoiceList.push({
        orderId: this.info.orderInfo.orderId, // 订单Id
        expressId: '',
        expressNo: '', // 快递单号
        expressImgUrl: '', // 快递单回单截图URL
        expressName: '顺丰快递', // 快递公司
        invoiceImgUrl: '', // 发票图片URL
        invoiceCount: '', // 发票数量
        invoiceAmount: '', // 开票总额
        taxAmount: '' // 税额
      })
    }
  }
}
</script>

<style scoped>

</style>
