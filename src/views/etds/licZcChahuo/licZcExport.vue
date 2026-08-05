<script setup>
import { ref, onMounted, watch } from 'vue'
import { getlicCustCodeList1, getlicCodeList3, getlicPortIdList1, exportZcReport, exportZcReport1 } from '@/api/etds'
import { excel } from '@/utils/excelExport'
import { defaultFormData, resultOptions } from './option'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  form: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const zcfxform = ref({ ...defaultFormData })
const resultlist = ref(resultOptions)
const custCodelist = ref([])
const liccodelist = ref([])
const licPortIdlist = ref([])
const step = ref([])
const isCustCodeDisabled = ref(false)
const isLicCodeDisabled = ref(false)
const showCustCodeSelect = ref(true)
const showLicCodeSelect = ref(true)

// 获取上个月日期
function getPreMonth (date) {
  const arr = date.split('-')
  const year = arr[0] // 获取当前日期的年份
  const month = arr[1] // 获取当前日期的月份
  const day = arr[2] // 获取当前日期的日
  let days = new Date(year, month, 0)
  days = days.getDate() // 获取当前日期中月的天数
  let year2 = year
  let month2 = Number.parseInt(month) - 1
  if (month2 === 0) {
    year2 = Number.parseInt(year2) - 1
    month2 = 12
  }
  let day2 = day
  let days2 = new Date(year2, month2, 0)
  days2 = days2.getDate()
  if (day2 > days2) {
    day2 = days2
  }
  if (month2 < 10) {
    month2 = `0${month2}`
  }
  const t2 = `${year2}-${month2}-${day2}`
  return t2
}

function fn_change1 () {
  if (zcfxform.value.custCode.includes('ALL')) {
    zcfxform.value.custCode = ['ALL']
  }
  console.log('进来了')
  fn_getLicCodeList()
}
function fn_change2 () {
  if (zcfxform.value.licCode.includes('ALL')) {
    zcfxform.value.licCode = ['ALL']
  }
  fn_getLicPortIdList()
}
function fn_change3 () {
  if (zcfxform.value.portId.includes('ALL')) {
    zcfxform.value.portId = ['ALL']
  }
}
const handleClose = () => {
  emit('update:modelValue', false)
}

const handleExportZC = async () => {
  // TODO: 实现导出逻辑
  // 对数据进行预处理
  const sdate1 = zcfxform.value.sdate
  const edate1 = zcfxform.value.edate
  const lj_sdate1 = zcfxform.value.lj_sdate
  const lj_edate1 = zcfxform.value.lj_edate
  let licCode1 = ''
  let custCode1 = ''
  let portId1 = ''
  let result1 = ''
  if (zcfxform.value.result.length === 0) {
    result1 = ''
  } else {
    zcfxform.value.result.forEach((item) => {
      result1 = `${result1 + item},`
    })
    // 去掉最后一个逗号
    result1 = result1.slice(0, -1)
  }
  const index1 = zcfxform.value.portId.findIndex((item) => {
    return item === 'ALL'
  })
  if (zcfxform.value.portId.length === 0 || index1 !== -1) {
    portId1 = ''
  } else {
    zcfxform.value.portId.forEach((item) => {
      portId1 = `${portId1 + item},`
    })
    // 去掉最后一个逗号
    portId1 = portId1.slice(0, -1)
  }
  const index2 = zcfxform.value.custCode.findIndex((item) => {
    return item === 'ALL'
  })
  if (zcfxform.value.custCode.length === 0 || index2 !== -1) {
    custCode1 = ''
  } else {
    zcfxform.value.custCode.forEach((item) => {
      custCode1 = `${custCode1 + item},`
    })
    // 去掉最后一个逗号
    custCode1 = custCode1.slice(0, -1)
  }
  const index3 = zcfxform.value.licCode.findIndex((item) => {
    return item === 'ALL'
  })
  if (zcfxform.value.licCode.length === 0 || index3 !== -1) {
    licCode1 = ''
  } else {
    zcfxform.value.licCode.forEach((item) => {
      licCode1 = `${licCode1 + item},`
    })
    // 去掉最后一个逗号
    licCode1 = licCode1.slice(0, -1)
  }
  console.log('sdate', sdate1)
  console.log('edate', edate1)
  console.log('lj_sdate', lj_sdate1)
  console.log('lj_edate', lj_edate1)
  console.log('licCode', licCode1)
  console.log('custCode', custCode1)
  console.log('portId', portId1)
  console.log('result', result1)
  await exportZcReport({
    sdate: sdate1,
    edate: edate1,
    lj_sdate: lj_sdate1,
    lj_edate: lj_edate1,
    licCode: licCode1,
    custCode: custCode1,
    portId: portId1,
    result: result1
  }).then(async (res) => {
    console.log('res', res.data)
    const base64 = res.data
    const name = res.name
    await excel.excelExport(name, base64, '.xlsx')
    // 导出成功
    ElMessage.success('导出成功')
  }).catch((err) => {
    console.log('err', err)
    ElMessage.error('导出失败')
  })
}

const handleExportZC1 = async () => {
  // TODO: 实现导出逻辑
  const sdate1 = zcfxform.value.sdate
  const edate1 = zcfxform.value.edate
  let licCode1 = ''
  let custCode1 = ''
  let portId1 = ''
  const index1 = zcfxform.value.custCode.findIndex((item) => {
    return item === 'ALL'
  })
  if (zcfxform.value.custCode.length === 0 || index1 !== -1) {
    custCode1 = ''
  } else {
    zcfxform.value.custCode.forEach((item) => {
      custCode1 = `${custCode1 + item},`
    })
    // 去掉最后一个逗号
    custCode1 = custCode1.slice(0, -1)
  }
  const index2 = zcfxform.value.licCode.findIndex((item) => {
    return item === 'ALL'
  })
  if (zcfxform.value.licCode.length === 0 || index2 !== -1) {
    licCode1 = ''
  } else {
    zcfxform.value.licCode.forEach((item) => {
      licCode1 = `${licCode1 + item},`
    })
    // 去掉最后一个逗号
    licCode1 = licCode1.slice(0, -1)
  }
  const index3 = zcfxform.value.portId.findIndex((item) => {
    return item === 'ALL'
  })
  if (zcfxform.value.portId.length === 0 || index3 !== -1) {
    portId1 = ''
  } else {
    zcfxform.value.portId.forEach((item) => {
      portId1 = `${portId1 + item},`
    })
    // 去掉最后一个逗号
    portId1 = portId1.slice(0, -1)
  }
  await exportZcReport1({
    sdate: sdate1,
    edate: edate1,
    licCode: licCode1,
    custCode: custCode1,
    portId: portId1,
  }).then(async (res) => {
    console.log('res', res.data)
    const base64 = res.data
    const name = res.name
    await excel.excelExport(name, base64, '.xlsx')
    // 导出成功
    ElMessage.success('导出成功')
  }).catch((err) => {
    console.log('err', err)
    ElMessage.error('导出失败')
  })
}

// 初始化客户
async function fn_getLicCustCodeList () {
  custCodelist.value = []
  const res = await getlicCustCodeList1({})
  const arr = res.data.result.Examples
  for (let i = 0; i < arr.length; i++) {
    custCodelist.value.push({
      label: arr[i].liccustcode + arr[i].liccustname,
      value: arr[i].liccustcode,
    })
  }
  // 等待客户列表加载完成后再调用获取联营商
  await fn_getLicCodeList()
}

// 获取联营商
async function fn_getLicCodeList () {
  const param = custCodelist.value
    .filter(item => item.value !== 'ALL')
    .map(item => item.value)
  console.log('param', param)
  let data = {
    custCode: zcfxform.value.custCode[0] === 'ALL' ? param : zcfxform.value.custCode,
  }
  console.log('data', data)
  liccodelist.value = []
  const res = await getlicCodeList3(data)
  console.log('返回数据', res)

  // 检查返回的数据结构
  if (res.data) {
    liccodelist.value = []

    // 判断返回的是单个对象还是数组
    if (Array.isArray(res.data)) {
      // 如果是数组，按原来的方式处理
      const arr = res.data
      console.log('数组长度', arr.length)
      for (let i = 0; i < arr.length; i++) {
        liccodelist.value.push({
          label: arr[i].liccode + arr[i].licname,
          value: arr[i].liccode,
        })
      }
      // 数组情况下，默认选择ALL
      zcfxform.value.licCode = ['ALL']
      
      // 显示客户和联营商选择框
      showCustCodeSelect.value = true
      showLicCodeSelect.value = true
    } else {
      // 如果是单个对象，直接添加到列表中
      liccodelist.value.push({
        label: res.data.liccode + res.data.licname,
        value: res.data.liccode,
      })
      // 单个对象情况下，默认选择该对象的值
      zcfxform.value.licCode = [res.data.liccode]
      
      // 隐藏客户和联营商选择框
      showCustCodeSelect.value = false
      showLicCodeSelect.value = false
    }

    console.log('liccodelist', liccodelist.value)
    await fn_getLicPortIdList()
  }
}

// 获取口岸仓库
async function fn_getLicPortIdList () {
  console.log('liccodelist22', liccodelist.value)
  const param = liccodelist.value.map(item => item.value).slice(1)
  console.log('param', param)
  let data = {
    licCode: zcfxform.value.licCode[0] === 'ALL' ? param : zcfxform.value.licCode
  }
  console.log('data2', data)
  licPortIdlist.value = []
  const res = await getlicPortIdList1(data)
  const arr = res.data.result.Examples
  for (let i = 0; i < arr.length; i++) {
    licPortIdlist.value.push({
      label: arr[i].portId + arr[i].portName,
      value: arr[i].portId,
    })
  }
  zcfxform.value.portId = ['ALL']
}
// 初始化搜索框的时间
function fn_time () {
  // 获取去年同月的日期
  let times = `${new Date().getFullYear() - 1}-${
    String(new Date().getMonth() + 1).padStart(2, '0')
  }-${
    String(new Date().getDate()).padStart(2, '0')
  }`
  times = getPreMonth(times)

  // 获取当前日期
  const times2 = `${new Date().getFullYear()}-${
    String(new Date().getMonth() + 1).padStart(2, '0')
  }-${
    String(new Date().getDate()).padStart(2, '0')
  }`

  // 设置默认值
  if (zcfxform.value.sdate === '' || zcfxform.value.sdate === null) {
    zcfxform.value.sdate = times
  }
  if (zcfxform.value.edate === '' || zcfxform.value.edate === null) {
    zcfxform.value.edate = times2
  }
  if (zcfxform.value.lj_sdate === '' || zcfxform.value.lj_sdate === null) {
    zcfxform.value.lj_sdate = times
  }
  if (zcfxform.value.lj_edate === '' || zcfxform.value.lj_edate === null) {
    zcfxform.value.lj_edate = times2
  }
}

// 监听弹窗打开状态
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    // 当弹窗打开时执行初始化
    fn_getLicCustCodeList()
    fn_time()
  }
})
</script>

<template>
  <el-dialog
    title="导出自查分析报表"
    :model-value="modelValue"
    fullscreen
    @close="handleClose"
  >
    <el-form
      :model="zcfxform"
      label-width="80px"
    >
      <el-row :gutter="20">
        <el-col :span="12" v-if="showCustCodeSelect">
          <el-form-item label="客户">
            <el-select
              v-model="zcfxform.custCode"
              placeholder="请选择"
              style="width: 100%"
              multiple
              filterable
              :clearable="false"
              @change="fn_change1"
            >
              <el-option v-for="item in custCodelist" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="showLicCodeSelect">
          <el-form-item label="联营商">
            <el-select
              v-model="zcfxform.licCode"
              placeholder="请选择"
              style="width: 100%"
              multiple
              filterable
              :clearable="false"
              @change="fn_change2"
            >
              <el-option v-for="item in liccodelist" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="自查日期">
            <el-date-picker
              v-model="zcfxform.sdate"
              type="date"
              placeholder="开始日期"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="至">
            <el-date-picker
              v-model="zcfxform.edate"
              type="date"
              placeholder="结束日期"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="复核日期">
            <el-date-picker
              v-model="zcfxform.lj_sdate"
              type="date"
              placeholder="开始日期"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="至">
            <el-date-picker
              v-model="zcfxform.lj_edate"
              type="date"
              placeholder="结束日期"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="口岸仓库">
            <el-select
              v-model="zcfxform.portId"
              placeholder="请选择"
              style="width: 100%"
              multiple
              filterable
              :clearable="false"
              @change="fn_change3"
            >
              <el-option v-for="item in licPortIdlist" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="二审结果">
            <el-select
              v-model="zcfxform.result"
              placeholder="请选择"
              style="width: 100%"
              multiple
              filterable
              :clearable="false"
              @change="fn_change3"
            >
              <el-option v-for="item in resultlist" :key="item.label" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <div class="footer-buttons">
          <el-button type="primary" class="custom-button" @click="handleExportZC">导出自查分析表</el-button>
          <el-button type="primary" class="custom-button" @click="handleExportZC1">导出自查分析表1</el-button>
          <el-button type="primary" class="custom-button" @click="handleClose">关闭</el-button>
        </div>
        <p class="footer-text">
          备注：<br />
          自查分析表查询条件为：客户、联营商、自查日期、口岸仓库、二审结果、复核日期<br />
          自查分析表1查询条件为：客户、联营商、自查日期、口岸仓库
        </p>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: center;
}

.footer-text {
  text-align: left;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.8;
}

.footer-buttons {
  display: flex;
  gap: 100px;
}
</style>