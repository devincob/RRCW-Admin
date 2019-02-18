<template>
  <x-page
    breadcrumb="auto"
    title="发布订单"
  >
    <el-card
      class="box-card"
      style="max-width:1024px;min-width:580px"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        size="small"
      >
        <el-form-item
          label="选择企业"
          prop="companyName"
        >
          <el-select
            v-model="form.companyName"
            filterable
            placeholder="请选择发单企业"
            @change="onCompanySelected"
          >
            <el-option
              v-for="(company,index) in companys"
              :key="company.companyUserId"
              :label="company.shortName+'('+company.companyUserName+')'"
              :value="index"
            >
              <span style="float: left">{{ company.shortName }}</span>
              <span style="float: right; color: #888888; font-size: 12px">{{ company.companyUserName }}</span>
            </el-option>
          </el-select>
          <div>
            <span
              style="color:#888888;font-size:12px"
              v-if="(form.companyAmount || form.companyAmount === 0) && form.companyStatus"
            >账户状态：{{form.companyStatus === 'D' ? '禁用' : '正常'}}，可用余额：{{form.companyAmount|currency('', 2)}}元，授信余额：{{form.residualCreditLine|currency('', 2)}}元</span>
          </div>
        </el-form-item>
        <!-- <el-form-item
          label="选择企业"
          prop="companyName"
        >
          <company-select
            ref="bSearch"
            @onCompanySelected="onCompanySelected"
            style="width: 400px"
          >
            <el-input
              slot="search"
              v-model="form.searchCompanyName"
              @input="onBSearch"
              @blur="onBSearchBlur"
              type="text"
              placeholder="请输入公司名称进行搜索"
            />
          </company-select>
          <span
            style="color:#888888;font-size:12px"
            v-if="(form.companyAmount || form.companyAmount === 0) && form.companyStatus"
          >账户状态：{{form.companyStatus === 'D' ? '禁用' : '正常'}}，可用余额：{{form.companyAmount|currency('', 2)}}元，授信余额：{{form.residualCreditLine|currency('', 2)}}元</span>
        </el-form-item> -->
        <el-form-item label="工作标题">
          {{form.orderTitle}}
          <el-input
            v-model="form.orderTitleExpand"
            placeholder="输入自定义工作标题"
            :style="'width:'+(form.orderTitle?'340px':'400px')"
          />
        </el-form-item>
        <el-form-item
          label="工作城市"
          prop="address"
        >
          <el-row>
            <el-col :span="8">
              <city-select
                customBoxClass="cityBoxClass"
                customClass="citySelectClass"
                ref="citySelect"
                @onProvinceSelected="onProvinceSelected"
                @onCitySelected="onCitySelected"
              />
            </el-col>
            <el-col
              :span="6"
              style="margin-left: 5px;"
            >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          label="工作地址"
          prop="address"
        >
          <el-input
            v-model="form.address"
            @click.native="form.cityName ? $refs['searchMapModal'].open() : ''"
            :placeholder="form.cityName ? '输入详细工作地址' : '请先选择城市'"
            readonly
          />
          <search-map-modal
            :cityName="form.cityName"
            @searchDone="onSearchDone"
            ref="searchMapModal"
          />
        </el-form-item>
        <el-form-item
          label="工作岗位"
          prop="jobTagId"
        >
          <span
            v-if="jobTagNull"
            style="color: red;font-size:12px"
          >该城市暂无岗位</span>
          <el-select
            v-else
            v-model="form.jobTagId"
            :placeholder="form.cityName ? '请选择工作岗位' : '请先选择城市'"
            @change="onJobTagSelect"
          >
            <el-option
              v-for="item in jobTagList"
              :key="item.jobTagId"
              :label="item.jobTagName"
              :value="item.jobTagId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="岗位名称"
          prop="jobTagName"
          v-if="form.jobTagId === 0"
        >
          <el-input
            v-model="form.jobTagName"
            placeholder="自定义岗位名称"
          />
        </el-form-item>
        <el-form-item
          label="工作日期"
          prop="showWorkDays"
        >
          <el-popover
            ref="pop-date-picker"
            placement="top"
            width="360"
            v-model="popDatePickerDisplay"
          >
            <date-picker
              @change="onDateChange"
              ref="publishDatePicker"
            ></date-picker>
          </el-popover>
          <el-input
            v-model="form.showWorkDays"
            type="text"
            v-popover:pop-date-picker
            placeholder="请选择工作日期"
          />
          <el-checkbox
            v-show="form.workDays && form.workDays.length > 1"
            style="margin-left: 5px"
            v-model="form.isContinuity"
            true-label="1"
            false-label="0"
          >连续订单</el-checkbox>
        </el-form-item>
        <el-form-item
          label="工作时间"
          prop="beginTime"
        >
          <el-time-select
            :editable="false"
            style="width: 195px"
            placeholder="开始时间"
            v-model="form.beginTime"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '23:30'
            }"
          >
          </el-time-select>
          -
          <el-time-select
            :editable="false"
            style="width: 195px"
            placeholder="结束时间"
            v-model="form.endTime"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '23:30'
            }"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item
          label="年龄"
          prop="age"
        >
          <el-slider
            v-model="form.age"
            range
            show-stops
            :min="0"
            :max="70"
            style="width: 380px;margin:-3px 0 0 10px;"
          />
          <span style="color:#888888;font-size:12px">{{showAge}}</span>
        </el-form-item>
        <el-form-item
          label="性别"
          prop="sex"
        >
          <el-radio
            v-model="form.sex"
            label="N"
          >不限</el-radio>
          <el-radio
            v-model="form.sex"
            label="M"
          >男</el-radio>
          <el-radio
            v-model="form.sex"
            label="F"
          >女</el-radio>
          <el-radio
            v-model="form.sex"
            label="Z"
          >指定</el-radio>
        </el-form-item>
        <el-form-item
          v-if="form.sex === 'Z' || form.sex === 'M'"
          label="男性人数"
          prop="maleWorkerNum"
        >
          <el-input
            v-model="form.maleWorkerNum"
            placeholder="男性人数"
          />
        </el-form-item>
        <el-form-item
          v-if="form.sex === 'Z' || form.sex === 'M'"
          label="男性身高"
          prop="maleBeginHeight"
        >
          <el-input
            v-model="form.maleBeginHeight"
            placeholder="最小身高"
            style="width: 200px"
          /> -
          <el-input
            v-model="form.maleEndHeight"
            placeholder="最大身高"
            style="width: 200px"
          /> cm
        </el-form-item>
        <el-form-item
          v-if="form.sex === 'Z' || form.sex === 'M'"
          label="男性体重"
          prop="maleBeginWeight"
        >
          <el-input
            v-model="form.maleBeginWeight"
            placeholder="最小体重"
            style="width: 200px"
          /> -
          <el-input
            v-model="form.maleEndWeight"
            placeholder="最大体重"
            style="width: 200px"
          /> kg
        </el-form-item>
        <el-form-item
          v-if="form.sex === 'Z' || form.sex === 'F'"
          label="女性人数"
          prop="femaleWorkerNum"
        >
          <el-input
            v-model="form.femaleWorkerNum"
            placeholder="女性人数"
          />
        </el-form-item>
        <el-form-item
          v-if="form.sex === 'N'"
          label="人数"
          prop="workerNum"
        >
          <el-input
            v-model="form.workerNum"
            placeholder="人数"
          />
        </el-form-item>
        <el-form-item
          v-if="form.sex === 'Z' || form.sex === 'F'"
          label="女性身高"
          prop="femaleBeginHeight"
        >
          <el-input
            v-model="form.femaleBeginHeight"
            placeholder="最小身高"
            style="width: 200px"
          /> -
          <el-input
            v-model="form.femaleEndHeight"
            placeholder="最大身高"
            style="width: 200px"
          /> cm
        </el-form-item>
        <el-form-item
          v-if="form.sex === 'Z' || form.sex === 'F'"
          label="女性体重"
          prop="femaleBeginWeight"
        >
          <el-input
            v-model="form.femaleBeginWeight"
            placeholder="最小体重"
            style="width: 200px"
          /> -
          <el-input
            v-model="form.femaleEndWeight"
            placeholder="最大体重"
            style="width: 200px"
          /> kg
        </el-form-item>
        <el-form-item label="详情">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 10}"
            v-model="form.description"
            placeholder="详情"
          />
        </el-form-item>
        <el-form-item
          label="联系人"
          prop="orderContact"
        >
          <el-input
            v-model="form.orderContact"
            placeholder="联系人"
          />
        </el-form-item>
        <el-form-item
          label="联系电话"
          prop="orderPhone"
        >
          <el-input
            v-model="form.orderPhone"
            placeholder="联系电话"
          />
        </el-form-item>
        <el-form-item label="福利要求">
          <el-checkbox
            v-model="form.hasEating"
            true-label="Y"
            false-label="N"
          >包水饭</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
          >发布</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog
      title="提示"
      :close-on-click-modal="false"
      :visible.sync="createConfirmDialog"
      width="400px"
      customClass="create-confirm-dialog"
      v-drag-dialog="{reset: true}"
      close-on-press-escape
      center
    >
      <el-form
        ref="salaryForm"
        :model="form"
        :rules="salaryRules"
        label-width="80px"
        size="small"
      >
        <el-form-item label="日薪">
          <el-input
            v-model="form.salary"
            placeholder="日薪"
          />
        </el-form-item>
        <el-form-item
          label="完工结"
          v-if="form.isContinuity"
        >
          <el-switch
            v-model="form.overPay"
            active-color="#13ce66"
            active-value="Y"
            inactive-value="N"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <span>是否需要添加培训信息？</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="onConfirmSend">直接发布</el-button>
        <el-button
          type="primary"
          @click="onConfirmTrain"
        >添加培训</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="培训信息"
      :visible.sync="trainFormDialog"
      :close-on-click-modal="false"
      width="500px"
      custom-class="train-dialog"
      v-drag-dialog="{reset: true}"
      close-on-press-escape
      center
    >
      <el-form
        ref="trainForm"
        :model="trainForm"
        :rules="trainRules"
        label-width="80px"
        size="small"
      >
        <el-form-item
          label="培训日期"
          prop="trainDate"
        >
          <el-date-picker
            v-model="trainForm.trainDate"
            type="date"
            value-format="yyyy/MM/dd"
            :picker-options="trainTimeOptions"
            placeholder="培训日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="培训时间"
          prop="trainBeginTime"
        >
          <el-time-select
            :editable="false"
            style="width: 150px"
            placeholder="开始时间"
            v-model="trainForm.trainBeginTime"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '23:30'
            }"
          >
          </el-time-select>
          -
          <el-time-select
            :editable="false"
            style="width: 150px"
            placeholder="结束时间"
            v-model="trainForm.trainEndTime"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '23:30',
              minTime: trainForm.trainBeginTime
            }"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item
          label="培训地址"
          prop="trainAddress"
        >
          <div>{{form.provinceName}} {{form.cityName}}</div>
          <el-input
            v-model="trainForm.trainAddress"
            @click.native="$refs['searchTrainMapModal'].open()"
            placeholder="请选择培训地点"
            readonly
          />
          <search-map-modal
            :appendToBody="true"
            :cityName="form.cityName"
            @searchDone="onTrainSearchDone"
            ref="searchTrainMapModal"
          />
        </el-form-item>
        <el-form-item
          label="培训价格"
          prop="trainAmount"
        >
          <el-input
            v-model="trainForm.trainAmount"
            placeholder="请填写培训价格"
          /> 元
        </el-form-item>
        <el-form-item label="培训详情">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5}"
            v-model="trainForm.trainDescription"
            placeholder="培训详情"
          />
        </el-form-item>
        <el-form-item
          label="联系人"
          prop="trainContact"
        >
          <el-input
            v-model="trainForm.trainContact"
            placeholder="联系人"
          />
        </el-form-item>
        <el-form-item
          label="联系电话"
          prop="trainPhone"
        >
          <el-input
            v-model="trainForm.trainPhone"
            placeholder="联系电话"
          />
        </el-form-item>
        <el-form-item label="费用合计">
          订单 {{showSumSalary|currency('', 2)}}元 + 培训 {{showTrainSalary|currency('', 2)}}元 = {{(showSumSalary + showTrainSalary)|currency('', 2)}}元
        </el-form-item>
        <div
          style="color: #ff0000"
          v-if="showTrainTips"
        >您选择的是多天工作，增加培训将会使订单变为连续订单，且不可取消连续状态。</div>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="trainFormDialog = false">取消</el-button>
        <el-button
          type="primary"
          @click="onTrainSubmit"
        >发布</el-button>
      </span>
    </el-dialog>
  </x-page>
</template>

<script>
import CompanySelect from '../../components/CompanySelect'
import CitySelect from '../../components/CitySelect'
import SearchMapModal from '../../components/SearchMapModal'
import DatePicker from '../../components/DatePicker'

export default {
  name: 'publish',
  components: { CompanySelect, CitySelect, SearchMapModal, DatePicker },
  data() {
    const mobile = (rule, value, callback) => {
      if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value)) {
        callback(new Error('联系电话格式不正确'))
      } else {
        callback()
      }
    }
    const salary = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写日薪'))
      } else if (value && value < this.form.computedSalary) {
        callback(new Error(`日薪必须大于${this.form.computedSalary}元`))
      } else if (value && value > (this.form.computedSalary * 2)) {
        callback(new Error(`日薪必须小于${this.form.computedSalary * 2}元`))
      } else {
        callback()
      }
    }
    const positiveInteger = (rule, value, callback) => {
      if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error('必须为正整数'))
      } else {
        callback()
      }
    }
    const workTime = (rule, value, callback) => {
      if (!this.form.beginTime || this.form.beginTime === '') {
        callback(new Error('请选择开始时间'))
      } else if (!this.form.endTime || this.form.endTime === '') {
        callback(new Error('请选择结束时间'))
      } else {
        callback()
      }
    }
    /* const workTimeDiff = (rule, value, callback) => {
      let begin = `2018/01/01 ${this.form.beginTime}`
      let end = `2018/01/01 ${this.form.endTime}`
      if (new Date(end) - new Date(begin) <= 0) {
        callback(new Error('结束时间必须晚于开始时间'))
      } else {
        callback()
      }
    } */
    const customJobTag = (rule, value, callback) => {
      if (this.form.jobTagId === 0 && value && value !== '') {
        callback()
      } else {
        callback(new Error('请填写自定义岗位名称'))
      }
    }
    const disableDate = (time) => {
      let date = new Date(this.form.workDays[0])
      this.form.workDays.forEach((i) => {
        if (date - new Date(i) > 0) {
          date = i
        }
      })
      return time.getTime() > new Date(date).getTime()
    }
    const trainTime = (rule, value, callback) => {
      if (!this.trainForm.trainBeginTime || this.trainForm.trainBeginTime === '') {
        callback(new Error('请选择开始时间'))
      } else if (!this.trainForm.trainEndTime || this.trainForm.trainEndTime === '') {
        callback(new Error('请选择结束时间'))
      } else {
        callback()
      }
    }
    const trainTimeDiff = (rule, value, callback) => {
      let begin = `2018/01/01 ${this.trainForm.trainBeginTime}`
      let end = `2018/01/01 ${this.trainForm.trainEndTime}`
      if (new Date(end) - new Date(begin) <= 0) {
        callback(new Error('结束时间必须晚于开始时间'))
      } else {
        callback()
      }
    }
    const trainTimeTruely = (rule, value, callback) => {
      if (!this.trainForm.trainDate) {
        callback(new Error('请先选择日期'))
        return
      }
      let date = new Date(this.form.workDays[0])
      this.form.workDays.forEach((i) => {
        if (date - new Date(i) > 0) {
          date = i
        }
      })
      let trainTime = `${this.trainForm.trainDate} ${this.trainForm.trainEndTime}`
      let workTime = `${this.$utils.dateFormat(date, 'yyyy/MM/dd')} ${this.form.beginTime}`
      if (new Date(trainTime) - new Date(workTime) > 0) {
        callback(new Error('培训时间必须早于上班时间'))
      } else {
        callback()
      }
    }
    const trainAmount = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写价格'))
      } else if (!/(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/.test(value)) {
        callback(new Error('必须为正数（最多两位小数）'))
      } else {
        callback()
      }
    }
    const maleHeight = (rule, value, callback) => {
      if (this.form.maleBeginHeight && this.form.maleEndHeight && (Number(this.form.maleBeginHeight) > Number(this.form.maleEndHeight))) {
        callback(new Error('最小身高不能大于最大身高'))
      } else {
        callback()
      }
    }
    const maleWeight = (rule, value, callback) => {
      if (this.form.maleBeginWeight && this.form.maleEndWeight && (Number(this.form.maleBeginWeight) > Number(this.form.maleEndWeight))) {
        callback(new Error('最小体重不能大于最大体重'))
      } else {
        callback()
      }
    }
    const femaleHeight = (rule, value, callback) => {
      if (this.form.femaleBeginHeight && this.form.femaleEndHeight && (Number(this.form.femaleBeginHeight) > Number(this.form.femaleEndHeight))) {
        callback(new Error('最小身高不能大于最大身高'))
      } else {
        callback()
      }
    }
    const femaleWeight = (rule, value, callback) => {
      if (this.form.femaleBeginWeight && this.form.femaleEndWeight && (Number(this.form.femaleBeginWeight) > Number(this.form.femaleEndWeight))) {
        callback(new Error('最小体重不能大于最大体重'))
      } else {
        callback()
      }
    }
    return {
      popDatePickerDisplay: false,
      jobTagList: [],
      jobTagNull: false,
      companys: [],
      selectCompanyIndex: -1,
      form: {
        orderTitle: '',
        orderTitleExpand: '',
        jobTagId: '',
        jobTagName: '',
        singleSalary: 0,
        salary: 0,
        computedSalary: 0,
        address: '',
        addressLat: '',
        addressLng: '',
        provinceName: '',
        cityName: '',
        distictId: '',
        beginTime: '',
        endTime: '',
        workDays: [],
        showWorkDays: '',
        isContinuity: 0,
        workerNum: '',
        maleWorkerNum: '',
        femaleWorkerNum: '',
        totalWorkNum: 0,
        description: '',
        orderContact: '',
        orderPhone: '',
        searchCompanyName: '',
        companyUserId: '',
        companyName: '',
        companyStatus: '',
        companyAmount: '',
        residualCreditLine: '',
        sex: 'N',
        beginAge: 0,
        endAge: 0,
        age: [0, 70],
        maleBeginHeight: '',
        maleEndHeight: '',
        maleBeginWeight: '',
        maleEndWeight: '',
        femaleBeginHeight: '',
        femaleEndHeight: '',
        femaleBeginWeight: '',
        femaleEndWeight: '',
        isTrain: 'N',
        hasEating: 'N',
        overPay: 'N'
      },
      showAge: '',
      rules: {
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'change' }
        ],
        showWorkDays: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        beginTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' },
          { validator: workTime, trigger: 'change' }
        ],
        jobTagId: [
          { required: true, message: '请选择工作岗位', trigger: 'change' }
        ],
        jobTagName: [
          { validator: customJobTag, message: '请填写自定义岗位名称', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        age: [
          { required: true, message: '请选择年龄', trigger: 'change' }
        ],
        maleBeginHeight: [
          { validator: maleHeight, trigger: 'change' }
        ],
        maleBeginWeight: [
          { validator: maleWeight, trigger: 'change' }
        ],
        femaleBeginHeight: [
          { validator: femaleHeight, trigger: 'change' }
        ],
        femaleBeginWeight: [
          { validator: femaleWeight, trigger: 'change' }
        ],
        workerNum: [
          { required: true, message: '请填写人数', trigger: 'change' },
          { validator: positiveInteger, trigger: 'change' }
        ],
        maleWorkerNum: [
          { required: true, message: '请填写男性人数', trigger: 'change' },
          { validator: positiveInteger, trigger: 'change' }
        ],
        femaleWorkerNum: [
          { required: true, message: '请填写女性人数', trigger: 'change' },
          { validator: positiveInteger, trigger: 'change' }
        ],
        orderContact: [
          { required: true, message: '请填写联系人', trigger: 'change' }
        ],
        orderPhone: [
          { required: true, message: '请填写联系电话', trigger: 'change' },
          { validator: mobile, trigger: 'change' }
        ]
      },
      salaryRules: {
        salary: [
          { required: true, message: '请填写日薪', trigger: 'change' },
          { validator: salary, trigger: 'change' }
        ]
      },
      createConfirmDialog: false,
      trainFormDialog: false,
      trainTimeOptions: {
        disabledDate(time) {
          return disableDate(time)
        }
      },
      trainForm: {
        isTrain: 'Y',
        trainDate: '',
        trainBeginTime: '',
        trainEndTime: '',
        trainAddress: '',
        trainAmount: '',
        trainLat: '',
        trainLng: '',
        trainDescription: '',
        trainContact: '',
        trainPhone: ''
      },
      trainRules: {
        trainDate: [
          { required: true, message: '请选择培训日期', trigger: 'change' }
        ],
        trainAddress: [
          { required: true, message: '请选择培训地址', trigger: 'change' }
        ],
        trainBeginTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' },
          { validator: trainTime, trigger: 'change' },
          { validator: trainTimeDiff, trigger: 'change' },
          { validator: trainTimeTruely, trigger: 'change' }
        ],
        trainAmount: [
          { required: true, message: '请填写价格', trigger: 'change' },
          { validator: trainAmount, trigger: 'change' }
        ],
        trainContact: [
          { required: true, message: '请填写联系人', trigger: 'change' }
        ],
        trainPhone: [
          { required: true, message: '请填写联系电话', trigger: 'change' },
          { validator: mobile, trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'form.distictId': {
      handler(val) {
        if (!val || val === '') {
          this.jobTagList = []
        } else {
          this.queryJobTagList()
        }
      },
      deep: true
    },
    'form.age': {
      handler(val) {
        if (val[0] === 0 && val[1] === 70) {
          this.form.beginAge = 0
          this.form.endAge = 0
          this.showAge = '年龄不限'
        } else {
          this.form.beginAge = val[0]
          this.form.endAge = val[1]
          this.showAge = `${val[0]} ~ ${val[1]} 岁`
        }
      },
      deep: true
    },
    trainFormDialog(val) {
      if (!val) return
      this.trainForm.trainContact = this.form.orderContact
      this.trainForm.trainPhone = this.form.orderPhone
    }
  },
  computed: {
    showSumSalary() {
      let days = (this.form.workDays && this.form.workDays.length) || 0
      let salary = this.form.salary || 0
      let workerNum = this.form.totalWorkNum || 0
      return days * salary * workerNum
    },
    showTrainSalary() {
      let salary = this.trainForm.trainAmount || 0
      let workerNum = this.form.totalWorkNum || 0
      return salary * workerNum
    },
    showTrainTips() {
      if (!this.form.workDays || this.form.workDays.length < 2) {
        return false
      } else {
        return this.form.isContinuity + '' !== '1'
      }
    }
  },
  methods: {
    async onPageShow() {
      this.$$main.companyCanUseList().then({
        status: 'N'
      }).then(res => {
        this.companys = res
      }, err => {
        err && err.message && this.$message.error(err.message)
      })
    },
    onBSearch() {
      // this.$refs['bSearch'].onSearchInput(this.form.searchCompanyName)
    },
    onBSearchBlur() {
      this.form.searchCompanyName = this.form.companyName
      // this.$refs['bSearch'].onInputBlur()
    },
    onCompanySelected(index) {
      if (this.selectCompanyIndex === index) {
        return
      }

      this.selectCompanyIndex = index
      const res = this.companys[index]
      this.form.searchCompanyName = res.companyUserName
      this.form.companyUserId = res.companyUserId
      this.form.companyName = res.shortName
      this.form.companyStatus = res.status
      this.form.companyAmount = res.amount
      this.form.residualCreditLine = res.residualCreditLine || 0
      this.form.orderContact = res.contact || ''
      this.form.orderPhone = res.contactPhone || ''
      this.form.orderTitle = (res && res.shortName) || res.companyUserName || ''
      this.form.orderTitleExpand = ''
    },
    onProvinceSelected(item) {
      this.form.provinceName = item.provinceName
    },
    onCitySelected(item) {
      this.form.cityName = item.districtName
      this.form.distictId = item.distictId
    },
    onSearchDone(res) {
      this.form.address = res.address
      this.form.addressLat = res.lat
      this.form.addressLng = res.lng
    },
    onDateChange(res) {
      this.form.workDays = res
      this.form.showWorkDays = res.join(',')
    },
    onJobTagSelect(res) {
      this.jobTagList && this.jobTagList.forEach((item) => {
        if (item.jobTagId === res && item.jobTagId !== 0) {
          this.form.jobTagName = item.jobTagName
          this.form.singleSalary = item.lowHourSalary
        } else if (item.jobTagId === res && item.jobTagId === 0) {
          this.form.jobTagName = ''
          this.form.singleSalary = item.lowHourSalary
        }
      })
    },
    async queryJobTagList() {
      try {
        let list = await this.$$main.tagOrderUse({
          districtId: this.form.distictId
        })
        if (list && list.length > 0) {
          this.jobTagList = list
          this.jobTagNull = false
        } else {
          this.jobTagNull = true
        }
      } catch (e) {
        e.message && this.$message.error(e.message)
      }
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.queryOrderSalary()
        }
      })
    },
    async queryOrderSalary() {
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        let data = await this.$$main.orderQuerySalary(this.form)
        this.form.salary = data.singleSalary
        this.form.computedSalary = data.singleSalary
        this.form.totalWorkNum = data.workerNum
        this.createConfirmDialog = true
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    onConfirmSend() {
      this.$refs['salaryForm'].validate((valid) => {
        if (valid) {
          this.createOrder()
          this.createConfirmDialog = false
        }
      })
    },
    onConfirmTrain() {
      this.$refs['salaryForm'].validate((valid) => {
        if (valid) {
          this.createConfirmDialog = false
          this.trainFormDialog = true
        }
      })
    },
    onTrainSubmit() {
      this.$refs['trainForm'].validate((valid) => {
        if (valid) {
          this.form = { ...this.trainForm, ...this.form }
          this.form.isTrain = 'Y'
          this.form.trainBeginTime = `${this.trainForm.trainDate} ${this.trainForm.trainBeginTime}`
          this.form.trainEndTime = `${this.trainForm.trainDate} ${this.trainForm.trainEndTime}`
          this.createOrder()
        }
      })
    },
    async createOrder() {
      const loading = this.$loading({
        text: '正在操作',
        spinner: 'el-icon-loading'
      })
      try {
        let mForm = Object.assign({}, this.form)
        mForm.orderTitle = mForm.orderTitle + ((mForm.orderTitleExpand && `-${mForm.orderTitleExpand}`) || '')
        await this.$$main.orderDoCreate(mForm)
        this.$message({
          message: `订单创建成功`,
          type: 'success'
        })
        this.trainFormDialog = false
        this.formClear()
        this.trainClear()
      } catch (e) {
        e.message && this.$message.error(e.message)
      } finally {
        loading.close()
      }
    },
    timeDiff(type, startTime, endTime) {
      let s = this.$utils.dateCreate(startTime)
      let e = this.$utils.dateCreate(endTime)
      const types = {
        s: 1,
        m: 60,
        h: 60 * 60,
        d: 60 * 60 * 24
      }
      return parseInt(e - s) / 1000 / types[type || 'm']
    },
    onTrainSearchDone(res) {
      this.trainForm.trainAddress = res.address
      this.trainForm.trainLat = res.lat
      this.trainForm.trainLng = res.lng
    },
    formClear() {
      this.form = {
        orderTitle: '',
        orderTitleExpand: '',
        jobTagId: '',
        jobTagName: '',
        singleSalary: 0,
        salary: 0,
        address: '',
        addressLat: '',
        addressLng: '',
        cityName: this.form.cityName,
        distictId: this.form.distictId,
        beginTime: '',
        endTime: '',
        workDays: [],
        showWorkDays: '',
        isContinuity: 0,
        workerNum: '',
        description: '',
        orderContact: '',
        orderPhone: '',
        searchCompanyName: '',
        companyUserId: '',
        companyName: '',
        companyStatus: '',
        companyAmount: '',
        residualCreditLine: '',
        sex: 'N',
        beginAge: 0,
        endAge: 0,
        age: [0, 70],
        maleBeginHeight: '',
        maleEndHeight: '',
        maleBeginWeight: '',
        maleEndWeight: '',
        femaleBeginHeight: '',
        femaleEndHeight: '',
        femaleBeginWeight: '',
        femaleEndWeight: '',
        isTrain: 'N',
        hasEating: 'N',
        overPay: 'N'
      }
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
        this.$refs['publishDatePicker'].clearChooseDates()
        // this.$refs['citySelect'].clear()
        // this.$refs['bSearch'].clear()
      })
    },
    trainClear() {
      this.trainForm = {
        isTrain: 'Y',
        trainDate: '',
        trainBeginTime: '',
        trainEndTime: '',
        trainAddress: '',
        trainAmount: '',
        trainLat: '',
        trainLng: '',
        trainDescription: '',
        trainContact: '',
        trainPhone: ''
      }
      this.$nextTick(() => {
        this.$refs['trainForm'] && this.$refs['trainForm'].clearValidate()
      })
    }
  },
  mounted() {
  }
}
</script>
