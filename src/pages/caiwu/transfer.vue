<template>
  <x-page breadcrumb="auto" title="C端提现">
    <el-card body-style="padding: 30px 10px" class="el-card-mini no-box-shadow no-border-radius">
      <el-tabs tab-position="left" style="height: 280px;">
        <el-tab-pane label="C到B转账">
          <el-form label-width="80px">
            <el-form-item label="账号" style="width: 520px;">
              <el-col :span="11">
                <el-autocomplete
                  popper-class="my-autocomplete"
                  v-model="formData.fromUser"
                  :fetch-suggestions="querySearchCUser"
                  placeholder="输入C端用户编号"
                  @select="handleCSelect"
                >
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                    <span class="addr">{{ item.mobilePhone }}</span>
                  </template>
                </el-autocomplete>
              </el-col>
              <el-col class="line" :span="2">=></el-col>
              <el-col :span="11">
                <el-autocomplete
                  popper-class="my-autocomplete"
                  v-model="formData.toUser"
                  :fetch-suggestions="querySearchBUser"
                  placeholder="输入B端用户编号"
                  @select="handleBSelect"
                >
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                    <span class="addr">{{ item.mobilePhone }}</span>
                  </template>
                </el-autocomplete>
              </el-col>
            </el-form-item>
            <el-form-item label="金额">
              <el-input type="tel" v-model="formData.amount" placeholder="请输入转账金额" style="width:178px;"/>
              <span v-if="formData.fromUser" style="padding-left: 10px;font-size: 12px;color:#909399">可用余额: {{cAmount}}</span>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea"
                        v-model="formData.remark"
                        style="width: 417px"
                        placeholder="请输入备注"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="!fromUserId || !toUserId" @click="onSubmit('C2B')">确认转账</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="B到C转账">
          <el-form label-width="80px">
            <el-form-item label="账号" style="width: 520px;">
              <el-col :span="11">
                <el-autocomplete
                  popper-class="my-autocomplete"
                  v-model="formData.toUser"
                  :fetch-suggestions="querySearchBUser"
                  placeholder="输入B端用户编号"
                  @select="handleBSelect"
                >
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                    <span class="addr">{{ item.mobilePhone }}</span>
                  </template>
                </el-autocomplete>
              </el-col>
              <el-col class="line" :span="2">=></el-col>
              <el-col :span="11">
                <el-autocomplete
                  popper-class="my-autocomplete"
                  v-model="formData.fromUser"
                  :fetch-suggestions="querySearchCUser"
                  placeholder="输入C端用户编号"
                  @select="handleCSelect"
                >
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                    <span class="addr">{{ item.mobilePhone }}</span>
                  </template>
                </el-autocomplete>
              </el-col>
            </el-form-item>
            <el-form-item label="金额">
              <el-input v-model="formData.amount" type="tel" placeholder="请输入转账金额" style="width:178px;"/>
              <span v-if="formData.toUser" style="padding-left: 10px;font-size: 12px;color:#909399">可用余额: {{bAmount}}</span>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea"
                        v-model="formData.remark"
                        style="width: 417px"
                        placeholder="请输入备注"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="!fromUserId || !toUserId" @click="onSubmit('B2C')">确认转账</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </x-page>
</template>

<script>
export default {
  name: 'transfer',
  data(){
    return {
      formData: {
        fromUser: '',
        toUser: '',
        amount: '',
        remark: ''
      },
      fromUserId: 0,
      toUserId: 0,
      cAmount: 0,
      bAmount: 0
    }
  },
  methods: {
    querySearchCUser(queryString, cb){
      this.$$main.userCList({
        mobile: queryString
      }).then(res => {
        cb(res.datas.map(item => {
          return {
            value: item.userName,
            workerUserId: item.workerUserId,
            mobilePhone: item.mobilePhone
          }
        }))
      }).catch(e => {
        console.log(e)
      })
    },
    querySearchBUser(queryString, cb){
      this.$$main.userBList({
        contactPhone: queryString
      }).then(res => {
        cb(res.datas.map(item => {
          return {
            value: item.companyUserName,
            workerUserId: item.companyUserId,
            mobilePhone: item.contactPhone,
            amount: item.amount
          }
        }))
      }).catch(e => {
        console.log(e)
      })
    },
    async queryUserDetail(userId, type){
      let res
      if (type === 'B2C') {
        res = this.$$main.userBInfo({
          companyUserId: userId
        })
      } else {
        res = this.$$main.userCInfoDetails({workerUserId: userId})
      }
      return res
    },
    handleCSelect(item){
      this.fromUserId = item.workerUserId
      this.queryUserDetail(item.workerUserId, 'C2B').then(res => {
        if (res) this.cAmount = res.amount
      })
    },
    handleBSelect(item){
      this.toUserId = item.workerUserId
      this.queryUserDetail(item.workerUserId, 'B2C').then(res => {
        if (res) this.bAmount = res.amount
      })
    },
    async onSubmit(type){
      let res
      const r = await this.$confirm('确定要执行转账操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      console.log(r === 'confirm')
      if (r !== 'confirm') return
      const loader = this.$loading()
      try {
        if (type === 'B2C'){
          res = await this.$$main.salaryDoBTransToC({
            // 金额
            'amount': this.formData.amount,
            // 企业编号
            'companyUserId': this.toUserId,
            // 兼职编号
            'workerUserId': this.fromUserId,
            'remark': this.formData.remark
          })
        } else {
          res = await this.$$main.salaryDoCTransToB({
            // 金额
            'amount': this.formData.amount,
            // 企业编号
            'companyUserId': this.toUserId,
            // 兼职编号
            'workerUserId': this.fromUserId,
            'remark': this.formData.remark
          })
        }
        if (res) {
          this.$message.success('转账成功！')
          this.formData = {
            fromUser: '',
            toUser: '',
            amount: '',
            remark: ''
          }
          this.fromUserId = 0
          this.toUserId = 0
          this.cAmount = 0
          this.bAmount = 0
        }
        loader.close()
      } catch (e) {
        this.$message.error(e.message || '转账失败')
        loader.close()
      }
    }
  }
}
</script>

<style lang="scss">
  .my-autocomplete {
    li {
      line-height: normal;
      padding: 7px;

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
  }
</style>
