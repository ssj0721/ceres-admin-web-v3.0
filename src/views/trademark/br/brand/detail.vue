<template>
  <div class="brand_detail">
    <el-dialog
      v-model="visible"
      class="viewDialog"
      :close-on-click-modal="false"
      title="商标详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="商标图样" :span="2">
          <img v-if="form.brandPicUrl" :src="form.brandPicUrl" class="brandPic" />
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="商标注册号">{{ text(form.brandNo) }}</el-descriptions-item>
        <el-descriptions-item label="商标申请号">{{ text(form.applyNo) }}</el-descriptions-item>
        <el-descriptions-item label="申请状态">{{ text(form.applyStatus, enumMaps.applyStatus) }}</el-descriptions-item>
        <el-descriptions-item label="商标状态">{{ text(form.brandStatus, enumMaps.brandStatus) }}</el-descriptions-item>
        <el-descriptions-item label="注册类型">{{ text(form.registerType, enumMaps.registerType) }}</el-descriptions-item>
        <el-descriptions-item label="境内境外">{{ text(form.scopeType, enumMaps.scopeType) }}</el-descriptions-item>
        <el-descriptions-item label="国家/地区">{{ text(form.countryRegionId, maps.countryRegion) }}</el-descriptions-item>
        <el-descriptions-item label="商标权利人">{{ text(form.companyId, maps.company) }}</el-descriptions-item>
        <el-descriptions-item label="商标系列">{{ text(form.seriesId, maps.series) }}</el-descriptions-item>
        <el-descriptions-item label="代理人">{{ text(form.agensecId, maps.agent) }}</el-descriptions-item>
        <el-descriptions-item label="商标品牌类别" :span="2">{{ text(form.producsecScopeId, maps.scope) }}</el-descriptions-item>
        <el-descriptions-item label="首次申请日期">{{ date(form.firssecApplyDate) }}</el-descriptions-item>
        <el-descriptions-item label="注册证下发日期">{{ date(form.registrationDate) }}</el-descriptions-item>
        <el-descriptions-item label="有效期开始日期">{{ date(form.validityStarsecDate) }}</el-descriptions-item>
        <el-descriptions-item label="有效期结束日期">{{ date(form.validityEndDate) }}</el-descriptions-item>
        <el-descriptions-item label="是否有效">{{ text(form.isValid, enumMaps.isValid) }}</el-descriptions-item>
        <el-descriptions-item label="续展状态">{{ text(form.renewalStatus, enumMaps.renewalStatus) }}</el-descriptions-item>
        <el-descriptions-item label="续展申请日期">{{ date(form.renewalDate) }}</el-descriptions-item>
        <el-descriptions-item label="转让状态">{{ text(form.transferStatus, enumMaps.transferStatus) }}</el-descriptions-item>
        <el-descriptions-item label="商标负责人">{{ text(form.manager) }}</el-descriptions-item>
        <el-descriptions-item label="正本存储位置">{{ text(form.storageId, maps.storage) }}</el-descriptions-item>
        <el-descriptions-item label="商标备注" :span="2">{{ text(form.brandRemarks) }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ date(form.createTime, true) }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ date(form.updateTime, true) }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <!-- <div class="dialog-footer">
          <el-button @click="visible = false">关 闭</el-button>
        </div> -->
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  applyStatusMap,
  brandStatusMap,
  registerTypeMap,
  scopeTypeMap,
  isValidMap,
  renewalStatusMap,
  transferStatusMap,
} from './config'
import { ref } from 'vue'

const visible = ref(false)
const form = ref({})
const maps = ref({})
const enumMaps = {
  applyStatus: applyStatusMap,
  brandStatus: brandStatusMap,
  registerType: registerTypeMap,
  scopeType: scopeTypeMap,
  isValid: isValidMap,
  renewalStatus: renewalStatusMap,
  transferStatus: transferStatusMap,
}

function text (val, map) {
  if (val === null || val === undefined || val === '') return '-'
  if (map) return map[val] !== undefined ? map[val] : val
  return val
}

function date (val, full) {
  if (!val) return '-'
  // Handle string dates
  if (typeof val === 'string') {
    const s = val.replace('T', ' ')
    return full ? s.substring(0, 19) : s.substring(0, 10)
  }
  // Handle Date objects or timestamps - avoid timezone shift
  const d = new Date(val)
  if (isNaN(d.getTime())) return String(val).substring(0, 10)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  if (full) {
    const hours = String(d.getHours()).padStart(2, '0')
    const mins = String(d.getMinutes()).padStart(2, '0')
    const secs = String(d.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${mins}:${secs}`
  }
  return `${year}-${month}-${day}`
}

function show (row, mapData) {
  form.value = JSON.parse(JSON.stringify(row))
  maps.value = mapData || {}
  visible.value = true
}

defineExpose({ show })
</script>

<style lang="scss" scoped>
.brand_detail {
  .brandPic {
    width: 120px;
    height: 90px;
    object-fit: contain;
    border-radius: 4px;
  }
  .viewDialog {
    :deep(.el-descriptions-item__label) {
      width: 130px;
    }
  }
  .dialog-footer {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
