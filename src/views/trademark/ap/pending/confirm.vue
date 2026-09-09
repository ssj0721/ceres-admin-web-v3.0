<template>
  <div class="form-page">
    <h1 class="page-title">编制确认表</h1>

    <div class="topBtn">
      <el-button class="btn-cancel" @click="handleCancel">取消</el-button>
      <el-button class="btn-save" @click="handleSave">保存</el-button>
      <el-button class="btn-submit" @click="handleSaveAndSubmit">保存并提交</el-button>
    </div>

    <el-form ref="formRef" :model="form" class="mainForm">
      <!-- 商标信息 -->
      <div class="section">
        <div class="section-header"><span class="section-bar"></span>商标信息</div>
        <div class="form-grid">
          <div class="form-row">
            <label class="form-label">商标首次注册期限起始日：</label>
            <div class="form-input">
              <el-date-picker v-model="form.firstRegStartDate" type="date" placeholder="请选择" value-format="YYYY-MM-DD" style="width: 100%" />
            </div>
          </div>
          <div class="form-row">
            <label class="form-label">申请日期：</label>
            <div class="form-input"><el-input :value="form.applyDate" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">商标注册日期：</label>
            <div class="form-input">
              <el-date-picker v-model="form.regDate" type="date" placeholder="请选择" value-format="YYYY-MM-DD" style="width: 100%" />
            </div>
          </div>
          <div class="form-row">
            <label class="form-label">最新注册期限：</label>
            <div class="form-input">
              <el-date-picker v-model="regPeriodRange" type="daterange" range-separator="～" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" style="width: 100%" />
            </div>
          </div>
          <div class="form-row">
            <label class="form-label">所属地区/国家：</label>
            <div class="form-input"><el-input :value="form.countryRegionName" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 商标所属国家/地区：</label>
            <div class="form-input">
              <el-select v-model="form.countryRegionId" placeholder="请选择" filterable style="width: 100%">
                <el-option v-for="item in options.countryRegion" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>
          </div>
          <div class="form-row">
            <label class="form-label">商标申请人：</label>
            <div class="form-input"><el-input :value="form.applyPerson" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 商标注册人：</label>
            <div class="form-input"><el-input v-model="form.registrant" placeholder="请输入" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">商标申请人地址：</label>
            <div class="form-input"><el-input :value="form.applyAddress" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 注册人地址：</label>
            <div class="form-input"><el-input v-model="form.registrantAddress" placeholder="请输入" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">商标申请编号：</label>
            <div class="form-input"><el-input :value="form.applyNumber" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 商标注册编号：</label>
            <div class="form-input"><el-input v-model="form.regNumber" placeholder="请输入" /></div>
          </div>
          <div class="form-row required">
            <label class="form-label"><span class="req">*</span> 商标：</label>
            <div class="form-input">
              <el-upload class="brand-uploader" :auto-upload="false" :limit="1" accept=".jpg,.jpeg" :on-change="handleBrandChange">
                <el-button class="btn-upload" plain>上传图片</el-button>
                <template #tip><div class="upload-tip">注：图片限制JPG格式、像素246*43、英文文件名</div></template>
              </el-upload>
            </div>
          </div>
          <div class="form-row">
            <label class="form-label">商标系列：</label>
            <div class="form-input"><el-input :value="form.seriesName" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">类别数量：</label>
            <div class="form-input"><el-input :value="form.categories.length" disabled class="input-disabled" /></div>
          </div>
        </div>
      </div>

      <!-- 申请信息 -->
      <div class="section">
        <div class="section-header"><span class="section-bar"></span>申请信息</div>
        <div class="categoryTable">
          <el-table :data="form.categories" border size="small" :header-cell-style="{ background: '#FAFAFA' }">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="categoryNo" label="类别编号" width="120" align="center" />
            <el-table-column prop="productService" label="申请使用商品/服务项目" min-width="200" show-overflow-tooltip />
            <el-table-column label="核定使用商品/服务项目" min-width="200">
              <template #default="scope"><el-input v-model="scope.row.approvedService" placeholder="请输入" /></template>
            </el-table-column>
            <el-table-column label="受理结果" width="140" align="center">
              <template #default="scope">
                <el-select v-model="scope.row.acceptResult" placeholder="请选择" style="width: 100%">
                  <el-option label="通过" value="1" />
                  <el-option label="不通过" value="0" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template #default="scope">
                <el-button type="primary" link @click="addCategory(scope.$index)">+</el-button>
                <el-button type="danger" link @click="removeCategory(scope.$index)" :disabled="form.categories.length <= 1">-</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 基本信息（只读） -->
      <div class="section">
        <div class="section-header"><span class="section-bar"></span>基本信息</div>
        <div class="form-grid">
          <div class="form-row">
            <label class="form-label">申请类型：</label>
            <div class="form-input"><el-input :value="typeName" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">申请编号：</label>
            <div class="form-input"><el-input :value="form.applyNumber" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">单据申请人：</label>
            <div class="form-input"><el-input :value="form.applyPerson" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">申请日期：</label>
            <div class="form-input"><el-input :value="form.applyDate" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">境内/境外：</label>
            <div class="form-input"><el-input :value="scopeMap[form.applyScope]" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">申请部门：</label>
            <div class="form-input"><el-input :value="form.applyDepartment" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">注册商标业务：</label>
            <div class="form-input"><el-input :value="registerTypeName" disabled class="input-disabled" /></div>
          </div>
          <div class="form-row">
            <label class="form-label">备注：</label>
            <div class="form-input"><el-input :value="form.remarks" disabled class="input-disabled" /></div>
          </div>
        </div>
      </div>

      <!-- 批件与意见信息 -->
      <div class="section">
        <div class="section-header"><span class="section-bar"></span>批件与意见信息</div>
        <div class="form-grid-single">
          <div class="form-row-full">
            <label class="form-label">代理人意见：</label>
            <div class="form-input"><el-input v-model="form.agensecOpinion" type="textarea" :rows="2" placeholder="请输入" /></div>
          </div>
          <div class="form-row-full">
            <label class="form-label">秘书处意见：</label>
            <div class="form-input"><el-input v-model="form.secretaryOpinion" type="textarea" :rows="2" placeholder="请输入" /></div>
          </div>
          <div class="form-row-full">
            <label class="form-label">旭日内部法律意见：</label>
            <div class="form-input"><el-input v-model="form.legalOpinion" type="textarea" :rows="2" placeholder="请输入" /></div>
          </div>
          <div class="form-row-full">
            <label class="form-label">旭日内部业务意见：</label>
            <div class="form-input"><el-input v-model="form.businessOpinion" type="textarea" :rows="2" placeholder="请输入" /></div>
          </div>
        </div>
      </div>

      <!-- 附件信息 -->
      <div class="section">
        <div class="section-header"><span class="section-bar"></span>附件信息</div>
        <div class="form-grid">
          <div class="form-row">
            <label class="form-label">附件：</label>
            <div class="form-input">
              <el-upload :auto-upload="false" :limit="5" :on-change="handleAttachmentChange">
                <el-button class="btn-upload" plain>上传文件</el-button>
              </el-upload>
            </div>
          </div>
          <div class="form-row">
            <label class="form-label">备注：</label>
            <div class="form-input"><el-input v-model="form.remark" placeholder="请输入" /></div>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { registerConfirm, registerGetDetail } from '@/api/trademark/ap/register'
import { typeMap, scopeMap, registerTypeOptions } from '../config'
import { countryRegionGetList } from '@/api/trademark/bd/countryRegion'
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const regPeriodRange = ref([])

const form = ref({
  id: route.query.id || null,
  type: 0,
  applyNumber: '', applyDate: '', applyPerson: '', applyScope: null, applyDepartment: '', remarks: '',
  registerType: null,
  countryRegionId: null,
  countryRegionName: '', applyAddress: '',
  registrant: '', registrantAddress: '', regNumber: '',
  firstRegStartDate: '', regDate: '',
  seriesName: '', brandUrl: '',
  agentFee: { agentId: null, address: '', outsideFee: null, domesticFee: null, agentFee: null, accountName: '', bankName: '', bankNumber: '', payCompany: '' },
  agensecOpinion: '', secretaryOpinion: '', legalOpinion: '', businessOpinion: '', remark: '',
  categories: [{ categoryNo: '', productService: '', approvedService: '', acceptResult: null }],
})

const typeName = computed(() => typeMap[form.value.type] || '-')
const registerTypeName = computed(() => {
  const item = registerTypeOptions.find(t => t.value === form.value.registerType)
  return item ? item.label : '-'
})

const options = ref({ countryRegion: [] })

onMounted(() => {
  loadOptions()
  if (form.value.id) loadDetail()
})

async function loadOptions() {
  try {
    const res = await countryRegionGetList({ page: 1, pageSize: 1000 })
    options.value.countryRegion = res.data.list || []
  } catch (e) { console.error(e) }
}

async function loadDetail() {
  try {
    const res = await registerGetDetail(form.value.id)
    const d = res.data
    if (d) {
      Object.assign(form.value, d)
      if (d.regStartDate && d.regEndDate) regPeriodRange.value = [d.regStartDate, d.regEndDate]
      if (d.categories && d.categories.length > 0) form.value.categories = d.categories
    }
  } catch (e) { console.error(e) }
}

function addCategory(i) { form.value.categories.splice(i+1, 0, {categoryNo:'', productService:'', approvedService:'', acceptResult:null}) }
function removeCategory(i) { if(form.value.categories.length>1) form.value.categories.splice(i,1) }
function handleBrandChange(file) { form.value.brandUrl = file.name }
function handleAttachmentChange() {}

function buildParam() {
  return {
    id: form.value.id,
    registrant: form.value.registrant,
    registrantAddress: form.value.registrantAddress,
    regNumber: form.value.regNumber,
    firstRegStartDate: form.value.firstRegStartDate,
    regDate: form.value.regDate,
    regStartDate: regPeriodRange.value[0] || null,
    regEndDate: regPeriodRange.value[1] || null,
    countryRegionId: form.value.countryRegionId,
    brandUrl: form.value.brandUrl,
    agensecOpinion: form.value.agensecOpinion,
    secretaryOpinion: form.value.secretaryOpinion,
    legalOpinion: form.value.legalOpinion,
    businessOpinion: form.value.businessOpinion,
    remark: form.value.remark,
    categories: form.value.categories.map(c => ({
      categoryNo: c.categoryNo,
      productService: c.productService,
      approvedService: c.approvedService,
      acceptResult: c.acceptResult,
    })),
  }
}

function handleSave() {
  registerConfirm(buildParam()).then(() => {
    ElMessage.success('保存成功')
  }).catch(e => { console.error(e) })
}

async function handleSaveAndSubmit() {
  try {
    await registerConfirm(buildParam())
    ElMessage.success('保存并提交成功')
    router.back()
  } catch (e) { console.error(e) }
}

function handleCancel() { router.back() }
</script>

<style lang="scss" scoped>
.form-page {
  background: #FFFFFF;
  padding: 24px 32px 40px;
  max-width: 960px;
  margin: 0 auto;

  .page-title {
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #333333;
    margin: 0 0 20px 0;
  }

  .topBtn {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-bottom: 24px;

    .btn-cancel {
      background: #FFFFFF;
      border: 1px solid #D9D9D9;
      border-radius: 6px;
      color: #333333;
      font-size: 14px;
    }
    .btn-save {
      background: #FFFFFF;
      border: 1px solid #1890FF;
      border-radius: 6px;
      color: #1890FF;
      font-size: 14px;
    }
    .btn-submit {
      background: #1890FF;
      border: none;
      border-radius: 6px;
      color: #FFFFFF;
      font-size: 14px;
    }
  }

  .section {
    margin-bottom: 32px;

    .section-header {
      display: flex;
      align-items: center;
      background: #E8F4FD;
      padding: 10px 16px;
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: 600;
      color: #333333;

      .section-bar {
        display: inline-block;
        width: 4px;
        height: 18px;
        background: #1890FF;
        margin-right: 8px;
        border-radius: 2px;
      }
    }
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 24px;
  }

  .form-grid-single {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-row {
    display: flex;
    align-items: flex-start;

    .form-label {
      flex: 0 0 150px;
      text-align: right;
      padding-right: 12px;
      color: #333333;
      font-family: 'Microsoft YaHei', sans-serif;
      font-size: 14px;
      line-height: 36px;
      white-space: nowrap;

      .req {
        color: #FF4D4F;
        margin-right: 2px;
        font-weight: 700;
      }
    }

    .form-input {
      flex: 1;
      min-width: 0;
    }
  }

  .form-row-full {
    display: flex;
    align-items: flex-start;

    .form-label {
      flex: 0 0 150px;
      text-align: right;
      padding-right: 12px;
      color: #333333;
      font-family: 'Microsoft YaHei', sans-serif;
      font-size: 14px;
      line-height: 36px;
      white-space: nowrap;
    }

    .form-input {
      flex: 1;
      min-width: 0;
    }
  }

  .categoryTable {
    margin-top: 16px;
  }

  .upload-tip {
    font-size: 12px;
    color: #999999;
    margin-top: 4px;
  }

  .btn-upload {
    border-radius: 6px;
    font-size: 14px;
  }

  :deep(.input-disabled .el-input__inner) {
    background-color: #F5F5F5;
    color: #999999;
    border-color: #D9D9D9;
  }
}
</style>
