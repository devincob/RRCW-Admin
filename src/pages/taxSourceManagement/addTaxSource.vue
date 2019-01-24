<template>
  <x-page :breadcrumb="breadcrumb" :title="pageText">
    <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini" style="max-width:800px;min-width:600px;min-height:1000px">
        <div slot="header"><span
              style="font-size: 14px;"
              class="text-bold"
            >新增编辑税源地</span></div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="width: 460px;" label-width="160px" class="demo-ruleForm" size="mini">
          <el-form-item label="税源地编号">
            <el-col :span="6">
              <el-input disabled :placeholder="ruleForm.sourceTaxId > 0 ? ruleForm.sourceTaxId : '系统自动生成'" style="width:340px"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="税源地名称" prop="sourceTaxName">
            <el-col :span="6">
              <el-input v-model="ruleForm.sourceTaxName" placeholder="请输入税源地名称" style="width:340px"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="供应商" prop="supplierIds">
            <el-select v-model="supplierIds" multiple placeholder="请选择税源地供应商" @change="onSupplierChange" style="width:340px">
              <el-option
                v-for="item in supplierList"
                :key="item.supplierId"
                :label="item.supplierName"
                :value="item.supplierId">
              </el-option>
            </el-select>
          </el-form-item>
        <el-form-item label="税源地所属省份" prop="provinceId">
              <el-select v-model="ruleForm.provinceId" placeholder="请选择税源地所在省份" @change="selectProvince" style="width:340px">
                <el-option
                  v-for="(item, index) in arrProvince"
                  :key=index
                  :label="item.districtName"
                  :value="item.distictId">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="税源地所属城市" prop="cityId">
              <el-select v-model="ruleForm.cityId" placeholder="请选择税源地所在城市" @change="selectCity" style="width:340px">
                <el-option
                  v-for="(item, index) in arrCitys"
                  :key=index
                  :label="item.districtName"
                  :value="item.distictId">
                </el-option>
                </el-select>
          </el-form-item>
          <el-form-item label="增值税返税比率" prop="zzsRatio">
            <el-col :span="6">
              <el-input type="number" style="width:340px" v-model.number="ruleForm.zzsRatio" :min='0.001' :step="0.001" placeholder="增值税返税比率请填写0.0至1.0之间的小数"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="个税返税比率" prop="grsdsRatio">
            <el-col :span="6">
              <el-input type="number" style="width:340px" v-model.number="ruleForm.grsdsRatio" :min='0.001' :step="0.001" placeholder="个人所得税比率请填写0.0至1.0之间的小数"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="附加税返税比率" prop="fjsRatio">
            <el-col :span="6">
              <el-input type="number" style="width:340px" v-model.number="ruleForm.fjsRatio" :min='0.001' :step="0.001" placeholder="附加税返税比率请填写0.0至1.0之间的小数"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="印花税返税比率" prop="yhsRatio">
            <el-col :span="6">
              <el-input type="number" style="width:340px" v-model.number="ruleForm.yhsRatio" :min='0.001' :step="0.001" placeholder="印花税返税比率请填写0.0至1.0之间的小数"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="法人年龄上限"  prop="legalAge">
            <el-col :span="6">
              <el-input type="number" style="width:340px" v-model.number="ruleForm.legalAge" :min='1' placeholder="请输入法人年龄上限"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="财务身份复印件">
            <el-radio-group v-model="ruleForm.isNeedFinanceID">
              <el-radio label="Y" >是</el-radio>
              <el-radio label="N" >否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="园区联系人"  prop="contact">
            <el-col :span="6">
              <el-input style="width:340px" v-model="ruleForm.contact" placeholder="请输入税源地联系人"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="联系人电话" prop="phone">
            <el-col :span="6">
              <el-input style="width:340px" v-model="ruleForm.phone" placeholder="请输入税源地联系人电话"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="税源地状态">
            <el-select style="width:340px" v-model="ruleForm.status" placeholder="请选择税源地状态">
              <el-option label="正常" value="N"></el-option>
              <el-option label="禁用" value="D"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-loading.fullscreen.lock="fullScreenLoading" @click="submitForm('ruleForm')">保存</el-button>
          </el-form-item>
        </el-form>
    </el-card>
  </x-page>
</template>
<script>
export default {
  name: 'add_taxSource',
  data() {
    return {
      supplierList: [],
      fullScreenLoading: false,
      pageText: '新增税源地',
      arrProvince: [],
      arrCitys: [],
      supplierIds: [],
      ruleForm: { //  法人年龄上限LegalAge int
        sourceTaxId: 0,
        sourceTaxName: '',
        supplierIds: [],
        provinceName: '',
        provinceId: '',
        cityId: '',
        cityName: null, // 所属商务name
        zzsRatio: '',
        grsdsRatio: '',
        fjsRatio: '',
        yhsRatio: '',
        legalAge: '',
        isNeedFinanceID: 'N',
        contact: '',
        phone: '',
        status: 'N'
      },
      rules: {
        sourceTaxName: [
          {required: true, message: '请输入税源地名称', trigger: 'change'}
        ],
        provinceId: [
          {required: true, message: '请输入税源地所属省份', trigger: 'change'}
        ],
        cityId: [
          {required: true, message: '请输入税源地所属城市', trigger: 'change'}
        ],
        zzsRatio: [
          { type: 'number', required: true, min: 0.0, max: 1.0, message: '增值税返税比率为0.00-1.00之间', trigger: 'change' }
        ],
        grsdsRatio: [
          { type: 'number', required: true, min: 0.0, max: 1.0, message: '个人所得税返税比率为0.00-1.00之间', trigger: 'change' }
        ],
        fjsRatio: [
          { type: 'number', required: true, min: 0.0, max: 1.0, message: '附加税返税比率为0.00-1.00之间', trigger: 'change' }
        ],
        yhsRatio: [
          { type: 'number', required: true, min: 0.0, max: 1.0, message: '印花税返税比率为0.00-1.00之间', trigger: 'change' }
        ],
        isNeedFinanceID: [
          { required: true, message: '是否需要财务身份证复印件', trigger: 'change' }
        ],
        legalAge: [
          {required: true, message: '请法人年龄上限', trigger: 'change'},
          {type: 'integer', min: 1, max: 99, message: '法人年龄为1~99岁的整数', trigger: 'change'}
        ],
        phone: [
          {required: false, message: '请输入正确的电话号码', pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, trigger: 'change'}
        ],
        contact: [
          {required: false, message: '请法人年龄上限', trigger: 'change'}
        ],
        status: [
          {required: false, message: '请选择活动区域', trigger: 'change'}
        ],
        supplierIds: [
          {required: true, message: '请选择税源地所属供货商', trigger: 'change'}
        ]
      }
    }
  },
  computed: {
    breadcrumb(){
      return [
        {path: '', title: '税源地管理', id: 0},
        {path: '', title: this.ruleForm.sourceTaxId ? '编辑税源地' : '新增税源地', id: 1}
      ]
    }
  },
  watch: {
    supplierIds: {
      handler(val){
        this.ruleForm.supplierIds = val
      },
      deep: true
    }
  },
  methods: {
    onSupplierChange(){
      this.$nextTick(() => {
        this.$refs['ruleForm'].validateField('supplierIds', (res) => {})
      })
    },
    async loadSupplier(e) { // 所属商务人员列表
      try {
        const suppliers = await this.$$main.sourceTaxListSupplier({
          sourceTaxId: null
        })
        this.supplierList = suppliers
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
    },
    selectBelong(e) { // 所属商务人员列表
      this.ruleForm.belongAdminUserId = e
    },
    async selectProvince(e){
      this.ruleForm.provinceId = e
      this.ruleForm.cityName = ''
      this.ruleForm.cityId = ''
      try {
        const areaList = await this.$$main.commonListDistict({})
        let arrCitys = []
        areaList && areaList.forEach((item) => {
          if (item.level === 'C' && item.parentId === e){
            arrCitys.push(item)
          }
          this.arrCitys = arrCitys
        })
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
    },
    selectCity(e){
      this.ruleForm.cityId = e
    },
    async loadAreaList(){ // 获取select下拉区域，公司，部门列表
      try {
        const areaList = await this.$$main.commonListDistict({})
        let arrProvince = []
        areaList && areaList.forEach((item) => {
          if (item.level === 'P'){
            arrProvince.push(item)
          }
          this.arrProvince = arrProvince
        })
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      }
    },
    async loadDetails(sourceTaxId){
      try {
        this.fullScreenLoading = true
        const detialInfo = await this.$$main.sourceTaxDetail({
          sourceTaxId: sourceTaxId
        })
        let arr = []
        detialInfo.suppliers && detialInfo.suppliers.forEach((item) => {
          arr.push(item.supplierId)
        })
        detialInfo.supplierIds = arr
        this.ruleForm = detialInfo
        this.supplierIds = arr
        const areaList = await this.$$main.commonListDistict({})
        let arrCitys = []
        let parentId = null
        areaList && areaList.forEach((item) => {
          if (item.level === 'C' && item.distictId === detialInfo.cityId){
            parentId = item.parentId
          }
        })
        areaList && areaList.forEach((item) => {
          if (item.level === 'C' && item.parentId === parentId){
            arrCitys.push(item)
          }
        })
        this.arrCitys = arrCitys
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.fullScreenLoading = false
      }
    },
    async submitModify(){
      try {
        this.fullScreenLoading = true
        const data = await this.$$main.sourceTaxModify(this.ruleForm)
        this.fullScreenLoading = false
        if (data) {
          this.$message.success('保存成功！')
          if (!this.ruleForm.sourceTaxId){
            this.pageText = '编辑税源地'
            this.ruleForm.sourceTaxId = data
            this.loadSupplier(data)
          }
        }
      } catch (e) {
        e && e.message && this.$message.error(e.message)
      } finally {
        this.fullScreenLoading = false
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitModify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onPageShow(){
      this.supplierIds = []
      this.ruleForm = {
        sourceTaxId: 0,
        sourceTaxName: '',
        provinceName: '',
        provinceId: '',
        cityId: '',
        cityName: null, // 所属商务name
        zzsRatio: '',
        grsdsRatio: '',
        fjsRatio: '',
        yhsRatio: '',
        legalAge: '',
        isNeedFinanceID: 'N',
        contact: '',
        phone: '',
        status: 'N'
      }
      this.$refs.ruleForm.resetFields()
      if (this.$route.query.sourceTax_id) {
        const sourceTaxId = Number(this.$route.query.sourceTax_id || 0)
        this.loadDetails(sourceTaxId)
      }
    }
  },
  mounted(){
    const sourceTaxId = Number(this.$route.query.sourceTax_id || 0)
    this.loadAreaList()
    this.loadSupplier(sourceTaxId)
    if (sourceTaxId === 0){
      this.pageText = '新增税源地'
    } else {
      this.loadDetails(sourceTaxId)
      this.pageText = '编辑税源地'
    }
  }
}
</script>
