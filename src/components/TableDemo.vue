<template>
  <el-card body-style="padding: 10px" class="no-box-shadow el-card-mini">
    <div slot="header" class="clearfix">
      <span>标题标题标题标题</span>
      <el-button @click="centerDialogVisible=true" class="pull-right" type="text">添加数据</el-button>
    </div>
    <div>
      <el-form :inline="true" size="mini" class="demo-form-inline">
        <el-row type="flex" justify="end">
          <el-col :span="5">
            <el-form-item label="审批人">
              <el-input placeholder="审批人"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="审批人">
              <el-date-picker
                type="datetime"
                style="width: 120px"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="审批人">
              <el-date-picker
                type="datetime"
                style="width: 120px"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="审批人">
              <el-input placeholder="审批人"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary">查询</el-button>
            </el-form-item>
          </el-col>
          <!--<el-col :span="4">
            <el-form-item label="活动区域">
              <el-select placeholder="活动区域">
                <el-option label="区域一" value="shanghai"/>
                <el-option label="区域二" value="beijing"/>
              </el-select>
            </el-form-item>
          </el-col>-->
        </el-row>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      size="mini"
      style="width: 100%;">
      <el-table-column
        prop="date"
        label="日期"
        sortable
        width="90"
        min-width="90"
        :filters="[{text: '2016-05-01', value: '2016-05-01'}, {text: '2016-05-02', value: '2016-05-02'}, {text: '2016-05-03', value: '2016-05-03'}, {text: '2016-05-04', value: '2016-05-04'}]"
        :filter-method="filterHandler"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        min-width="80"
        width="80">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        :formatter="formatter">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        :formatter="formatter">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        :formatter="formatter">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        :formatter="formatter">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        :formatter="formatter">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        :formatter="formatter">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        :formatter="formatter">
      </el-table-column>
      <el-table-column
        prop="tag"
        label="标签"
        width="60"
        :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="scope.row.tag === '家' ? 'primary' : 'success'"
            close-transition>{{scope.row.tag}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class="text-center" width="120" minWidth="120" label="操作">
        <template slot-scope="scope">
          <el-popover
            :ref="`popover${scope.row.id}`"
            placement="top"
            width="160">
            <p>这是一段内容这是一段内容确定删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[`popover${scope.row.id}`].doToggle()">取消</el-button>
              <el-button type="danger" size="mini" @click="onHandleRowDelete(scope, $refs[`popover${scope.row.id}`])">确定</el-button>
            </div>
          </el-popover>
          <el-button
            size="mini">编辑</el-button>
          <el-button
            size="mini"
            v-popover="`popover${scope.row.id}`"
            type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="text-right">
      <el-pagination
        class="mt-sm"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="4000">
      </el-pagination>
    </div>
    <el-dialog
      v-drag-dialog="{reset: true}"
      title="添加数据"
      :visible.sync="centerDialogVisible"
      width="500px"
      center>
      <el-form ref="form" :model="form" size="small" label-width="80px">
        <el-form-item label="活动名称1">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"/>
            <el-option label="区域二" value="beijing"/>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"/>
          </el-col>
          <el-col class="line text-center" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2"
                            style="width: 100%;"/>
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送">
          <el-switch v-model="form.delivery"/>
        </el-form-item>
        <el-form-item label="活动性质">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"/>
            <el-checkbox label="地推活动" name="type"/>
            <el-checkbox label="线下主题活动" name="type"/>
            <el-checkbox label="单纯品牌曝光" name="type"/>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源">
          <el-radio-group v-model="form.resource">
            <el-radio label="线上品牌商赞助"/>
            <el-radio label="线下场地免费"/>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式">
          <el-input type="textarea" v-model="form.desc"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">立即创建</el-button>
          <el-button @click="centerDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
import ElCard from 'element-ui/packages/card/src/main'
import utils from '../libs/utils'

export default {
  components: {ElCard},
  name: 'table-demo',
  data () {
    return {
      tableData: [],
      centerDialogVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      visible2: false
    }
  },
  methods: {
    formatter (row, column) {
      return row.address
    },
    filterTag (value, row) {
      return row.tag === value
    },
    filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    onHandleRowDelete({row}, popover){
      console.log(row)
      const loading = this.$loading({
        text: '正在删除',
        spinner: 'el-icon-loading'
      })
      setTimeout(() => {
        popover.doClose()
        loading.close()
        this.$showToast({
          message: '已删除选中的条目',
          type: 'success'
        })
      }, 2000)
    }
  },
  mounted(){
    this.tableData = utils.randomString().split('').map(() => ({
      id: (Math.random() * 1000).toString(16),
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄',
      tag: '家'
    }))
  }
}
</script>
