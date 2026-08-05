<template>
  <div v-if="sheetSwap===0" class="dashboard">
    <div class="header">
      <h1>
        AI 全品类成本预测系统
      </h1>
      <div class="sub">智能决策 · 精准预算 · 动态模拟采购波动</div>
    </div>

    <div class="grid-main">
      <!-- 左侧表单区 -->
      <div>
        <!-- 1. 品类选择 -->
        <div class="card">
          <div class="card-title">
            1.<span style="color: red;">*</span> 选择品类
          </div>
          <div class="form-group">
            <el-select v-model="formData.category" placeholder="请选择" size="large" clearable>
              <el-option v-for="item in categorylist" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </div>
        </div>

        <!-- 2. 财务指标 (零售价+毛利率模式) -->
        <div class="card">
          <div class="card-title">
            2.<span style="color: red;">*</span> 财务指标 (二选一)
          </div>
          <div class="three-cols" style="margin-top: 8px;">
            <div class="form-group">
              <label>目标成本 (￥)</label>
              <el-input-number :disabled="notTargetCost" controls-position="right" v-model="formData.targetCost" :precision="2" :step="0.01" placeholder="输入成本总价" style="font-weight:600; width: 90%;"/>
              <div class="inline-hint">或填写零售价+毛利率</div>
            </div>
            <div class="form-group">
              <label>零售价 (￥)</label>
              <el-input-number :disabled="notRetailPriceAndGrossMargin" controls-position="right" v-model="formData.retailPrice" :precision="2" :step="0.01" :min="0" placeholder="RMB售价" style="font-weight:600; width: 90%;"/>
            </div>
            <div class="form-group">
              <label>毛利率 (0~1)</label>
              <el-input-number :disabled="notRetailPriceAndGrossMargin" controls-position="right" v-model="formData.grossMargin" :precision="4" :step="0.0001" :min="0" :max="1" placeholder="如 0.6342" style="font-weight:600; width: 90%;"/>
            </div>
          </div>
        </div>

        <!-- 3. 采购波动范围 -->
        <div class="card">
          <div class="card-title">
            3. 采购波动范围
          </div>
          <div class="form-group">
            <div class="form-group">
              <label>采购范围 (+/- %)</label>
              <el-input-number controls-position="right" v-model="formData.baseVolatility" :precision="1" :step="0.5" placeholder="预期 3%" style="font-weight:600; width: 100%;"/>
              <div class="inline-hint">填写数字即可，如 3 代表 ±3%</div>
            </div>
          </div>
        </div>

        <!-- 4. 税务设定 -->
        <div class="card">
          <div class="card-title">
            4. 税务设定
          </div>
          <div class="form-group">
            <label><span style="color: red;">*</span> 税率</label>
            <el-select v-model="formData.taxRate" placeholder="请选择" size="large" clearable>
              <el-option v-for="item in taxRatelist" :key="item.value" :label="item.name"
                :value="item.value" />
            </el-select>
            <div class="inline-hint">默认13% (制造业标准)</div>
          </div>
        </div>

        <!-- 5. 产品特征 -->
        <div class="card">
          <div class="card-title">
            5. 产品特征
          </div>
          <div class="two-cols">
            <div class="form-group">
              <label><span style="color: red;">*</span> 性别</label>
              <el-select v-model="formData.genderCode" placeholder="请选择性别" clearable>
                <el-option label="男" value="M" />
                <el-option label="女" value="F" />
                <el-option label="中性" value="N" />
              </el-select>
              </div>
            <div class="form-group">
              <label><span style="color: red;">*</span> 季节</label>
              <el-select v-model="formData.seasonCode" placeholder="请选择季节" clearable multiple
                collapse-tags collapse-tags-tooltip :max-collapse-tags="4">
                <el-option label="春" value=1 />
                <el-option label="夏" value=2 />
                <el-option label="秋" value=3 />
                <el-option label="冬" value=4 />
              </el-select>
            </div>
          </div>
          <div class="two-cols">
            <div class="form-group mt-3">
              <label><span style="color: red;">*</span> 年龄组</label>
              <el-select v-model="formData.ageGroup" placeholder="请选择年龄组" clearable>
                <el-option label="成人" value="A" />
                <el-option label="童装" value="C" />
                <el-option label="不适用" value="N" />
              </el-select>
              </div>
            <div class="form-group mt-3">
              <label><span style="color: red;">*</span> 织造方式</label>
              <el-select v-model="formData.knittingType" placeholder="请选择织造方式" clearable>
                <el-option label="针织" value="knit" />
                <el-option label="梭织" value="woven" />
                <el-option label="毛织" value="sweater" />
              </el-select>
            </div>
          </div>
          <div class="two-cols">
            <!-- <div class="form-group">
              <label>面料克重 (g/m²)</label>
              <el-input-number controls-position="right" v-model="formData.fabricWeight" :precision="1" :step="1" placeholder="不知道可留空" style="font-weight:600; width: 100%;"/>
            </div> -->
            <div class="form-group mt-3">
            <label>做工复杂度</label>
              <el-select v-model="formData.laborComplexity" placeholder="做工复杂度" clearable>
                  <el-option label="低" value=1 />
                  <el-option label="中" value=2 />
                  <el-option label="高" value=3 />
              </el-select>
            </div>
            <div class="form-group mt-3">
              <label>产品描述</label>
              <el-input v-model="formData.styleDescription" placeholder="如 男装、童装"/>
            </div>
          </div>
          <!-- <div class="form-group mt-4">
            <label>做工复杂度</label>
            <el-select v-model="formData.laborComplexity" placeholder="做工复杂度" clearable>
                <el-option label="低" value=1 />
                <el-option label="中" value=2 />
                <el-option label="高" value=3 />
            </el-select>
          </div> -->
        </div>

        <!-- 6. 分项指定 (成本结构%) + 预算工资利率 -->
        <div class="card">
          <div class="card-title">
            6. 分项指定 (可选)
          </div>
          <div class="form-group mt-4">
            <label>预留工厂利率 (%) (0~10)</label>
            <el-input-number controls-position="right" v-model="formData.factoryProfitRate" :precision="1" :step="0.1" :min="0" :max="100" placeholder="推荐0-10，预设为0%" style="font-weight:600; width: 100%;"/>
            <div class="inline-hint">系统将按扣除利润后的净成本进行分配</div>
          </div>
          <div class="form-group  mt-4">
            <label>佣金率</label>
            <el-input-number controls-position="right" v-model="formData.commissionRate" :precision="2" :step="0.01" :min="0" :max="1" placeholder="默认0.04" style="font-weight:600; width: 100%;"/>
          </div>
            <el-row :gutter="20">
              <el-col
                v-for="item in availableItems"
                :key="item.itemCode"
                :xs="24"
                :sm="12"
                :md="12"
                :lg="8"
              >
                <div class="costitem">
                  <el-checkbox v-model="item.checked" :label="item.itemName" size="large" class="costcheck"/>
                  <el-input-number
                    v-model="item.amount"
                    :disabled="!item.checked"
                    :min="item.price_min || 0"
                    :max="item.price_max || Infinity"
                    :precision="2"
                    :step="0.01"
                    controls-position="right"
                    class="costinput"
                    placeholder="请输入金额"
                  />
                </div>
              </el-col>
            </el-row>
          <div class="form-group mt-4">
            <label>其他自定义项 (￥)</label>
            <el-input-number controls-position="right" v-model="formData.customCost" :precision="2" :step="0.01" style="font-weight:600; width: 100%;"/>
          </div>
          <!-- <div class="info-note">
            分项占比之和当前为 {{ sumPercentages }}% 。若低于100%，剩余比例自动归为“其他杂项成本”；若高于100%，将等比压缩至100%以保持成本模型合理。
          </div> -->
        </div>

        <!-- 开始预测按钮 -->
        <div style="display: flex; justify-content: flex-end; margin-top: 8px; margin-bottom: 28px;">
          <button @click="runPrediction">
            开始预测
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="sheetSwap===1" class="prediction-container">
    <el-card class="main-card" shadow="hover">
      <!-- 头部切换区（模拟标签页） -->
      <div class="tabs-header">
        <el-button type="primary" @click="goback">返回</el-button>
        <el-button type="primary" @click="newPredict">新的预测</el-button>
        <!-- <el-button type="primary" @click="jumpFap">测试</el-button> -->
      </div>

      <!-- 品类信息 -->
      <div class="info-bar">
        <span>品类: <strong>{{ formData3.categoryName }}</strong></span>
        <!-- <span class="divider">|</span>
        <span>计算克重: <strong>{{ typeof formData3.fabricWeight === 'object' ? "" : formData3.fabricWeight }} g</strong></span> -->
      </div>

      <!-- AI 推荐标题 -->
      <div class="section-title">
        <div>
          <span class="badge">AI 推荐 BOM 清单</span>
          <span class="range-note">(含采购波动范围)</span>
        </div>
        <div>
          <span class="click-note" style="margin-right: 5px;" @click="scrollToTarget(1)">点击快速查看面料</span>
          <span class="click-note" @click="scrollToTarget(2)">点击快速查看辅料</span>
        </div>
      </div>

      <!-- 数据表格 -->
      <el-table :data="bomData" border stripe class="bom-table" style="width: 100%">
        <el-table-column prop="item_name" label="项目" />
        <el-table-column prop="amount" label="预估成本">
          <template #default="{ row }">
            {{ row.amount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="unit_price" label="单价">
          <template #default="{ row }">
            {{ row.unit_price.toFixed(2) }}/{{ units.find(item => item.id === row.unit)?.name ?? row.unit }}
            <span v-if="row.unit==='m'">（{{ (row.unit_price/0.9144).toFixed(2) }}/码）</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template v-slot:header>
              采购范围 (±{{baseVolatility*100}}%)
          </template>
          <template #default="{ row }">
            <span v-if="row.item_code=='fabric_cost'">{{ (row.unit_price - row.unit_price * fabricVolatility).toFixed(2) }} ~ {{ (row.unit_price + row.unit_price * fabricVolatility).toFixed(2) }}</span>
            <span v-else-if="row.range_applied">{{ (row.unit_price - row.unit_price * baseVolatility).toFixed(2) }} ~ {{ (row.unit_price + row.unit_price * baseVolatility).toFixed(2) }}</span>
            <span v-else>{{ row.unit_price .toFixed(2) }} ~ {{ row.unit_price.toFixed(2) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 损耗 & 合计 -->
      <div class="summary-lines">
        <!-- <div class="summary-item">
          <span class="label">损耗</span>
          <span class="value">{{finalData.wastageData.toFixed(2)}}</span>
          <span class="range">{{(finalData.wastageData - finalData.wastageData * baseVolatility).toFixed(2)}} ~ {{(finalData.wastageData + finalData.wastageData * baseVolatility).toFixed(2)}}</span>
        </div> -->
        <div class="summary-item">
          <span class="label">工厂利润</span>
          <span class="value">{{finalData.factoryAmount.toFixed(2)}}</span>
          <span class="range">-</span>
        </div>
        <div class="summary-item total">
          <span class="label">合计(不含税)</span>
          <span class="value">{{finalData.totalWithNoRate.toFixed(2)}}</span>
          <span class="range">-</span>
        </div>
        <div class="summary-item">
          <span class="label">税金</span>
          <span class="value">{{finalData.taxAmount.toFixed(2)}}</span>
          <span class="range">-</span>
        </div>
        <div class="summary-item">
          <span class="label">佣金</span>
          <span class="value">{{finalData.commissionAmount.toFixed(2)}}</span>
          <span class="range">-</span>
        </div>
        <div class="summary-item">
          <span class="label">货品成本</span>
          <span class="value">{{finalData.goods.toFixed(2)}}</span>
          <span class="range">-</span>
        </div>
      </div>

      <!-- 最终报价 -->
      <div class="final-price">
        <span class="label">最终报价(含税含佣金)</span>
        <span class="price">¥ {{finalData.predictAmount.toFixed(2)}}</span>
      </div>

      <div class="evaluation-card">
        <div class="title">请为此次预测评价</div>

        <div class="rate-section">
          <el-rate
            v-model="commentData.star"
            :texts="['很差', '较差', '一般', '较好', '极好']"
            show-text
            :colors="['#F56C6C', '#E6A23C', '#67C23A']"
          />
        </div>
      
        <div class="comment-section">
          <el-input
            v-model="commentData.evaluate"
            type="textarea"
            :rows="4"
            placeholder="请分享您对此次预测结果的看法或建议..."
            maxlength="500"
            show-word-limit
          />
        </div>
      
        <div class="action-buttons">
          <el-button type="primary" @click="handleSubmit">提交评价</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
    </el-card>
    <!-- 面料信息 -->
    <el-card class="secound-card" shadow="hover" v-if="fapData.length>0">
      <template #header><span ref="fap1Ref" style="font-size: large;font-weight: bold;">面料信息</span></template>
      <div class="product-gallery">
        <el-row :gutter="20">
          <el-col
            v-for="fap in fapData"
            :key="fap.productId"
            :xs="12"
            :sm="8"
            :md="6"
            :lg="4"
            class="product-col"
          >
            <el-card class="product-card" shadow="hover">
              <div class="image-wrapper">
                <el-image :src="fap.image" fit="cover" lazy @click="previewPic(fap.image)">
                  <template #placeholder>
                    <div class="image-placeholder">加载中...</div>
                  </template>
                  <template #error>
                    <div class="image-error">暂无图片</div>
                  </template>
                </el-image>
              </div>
              <div class="product-info" @click="jumpFap(fap,1)">
                <div class="product-name">{{ fap.productName }}</div>
                <div class="product-code">编号：{{ fap.productNumber }}</div>
                <div class="product-price">¥{{ fap.price }}/{{ fap.measurement }}</div>
                <div class="product-supplier">季节：{{ fap.season }}</div>
                <div class="product-supplier">织造方式：{{ fap.weavingMethod }}</div>
                <div class="product-supplier">目标人群：{{ fap.crowd }}</div>
                <div class="product-supplier">供应商：{{ fap.shopName }}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 辅料信息 -->
    <el-card class="secound-card" shadow="hover" v-if="fapData2.length>0">
      <template #header>
        <span ref="fap2Ref" style="font-size: large;font-weight: bold;">辅料信息</span>
        <div>
          <el-form ref="searchRef" :inline="true" :model="fuquery" style="padding-top: 15px;">
            <el-form-item label="品类">
              <el-select v-model="fuquery.category" placeholder="请选择品类" clearable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="maxtag" style="width:200px">
                <el-option v-for="item in availableItems" :key="item.itemCode" :label="item.itemName" :value="item.itemCode" />
              </el-select>
            </el-form-item>
            <el-form-item label="价格区间">
              <el-input
                v-model="fuquery.lowprice"
                style="width: 150px"
                placeholder="Please input"
                :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(value) => value.replace(/\￥\s?|(,*)/g, '')"
              />
              &nbsp;--&nbsp;
              <el-input
                v-model="fuquery.highprice"
                style="width: 150px"
                placeholder="Please input"
                :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(value) => value.replace(/\￥\s?|(,*)/g, '')"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="fapData2Select">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <div class="product-gallery">
        <el-row :gutter="20">
          <el-col
            v-for="fap in (isfillterfap2 ? fillterfapData2 :fapData2)"
            :key="fap.productId"
            :xs="12"
            :sm="8"
            :md="6"
            :lg="4"
            class="product-col"
          >
            <el-card class="product-card" shadow="hover">
              <div class="image-wrapper">
                <el-image :src="fap.image" fit="cover" lazy @click="previewPic(fap.image)">
                  <template #placeholder>
                    <div class="image-placeholder">加载中...</div>
                  </template>
                  <template #error>
                    <div class="image-error">暂无图片</div>
                  </template>
                </el-image>
              </div>
              <div class="product-info" @click="jumpFap(fap,2)">
                <div class="product-name">{{ fap.productName }}</div>
                <div class="product-code">编号：{{ fap.productNumber }}</div>
                <div class="product-price">¥{{ fap.price }}/{{ fap.measurement }}</div>
                <div class="product-supplier">{{ fap.shopName }}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 回到顶部按钮 -->
    <BackToTop />
    <!-- 图片预览 -->
    <el-image-viewer
      v-if="imgViewerVisible"
      @close="closeImgViewer"
      width="20%"
      :url-list="previewlist"
      alt="非图片不能预览"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { getCategorylist,getByCategory,predict,getFapData,getFapToken,getFapAppUrl,updateComment } from '@/api/aiCostPrediction'

// 表单数据
const formData = ref({
  category: null,
  targetCost: null,
  retailPrice: null,
  grossMargin: null,
  baseVolatility: null,
  volatilityRange: 3.0,
  activeVolatility: 3.0,
  commissionRate: 0.04,
  taxRate: 0.13,
  fabricWeight: null,
  styleDescription: null,
  fabricPct: null,
  laborPct: null,
  printPct: null,
  otherMaterialPct: null,
  threeFabricPct: null,
  packingPct: null,
  testingPct: null,
  drivingPct: null,
  factoryProfitRate: null,
  customCost: null,
  genderCode:null,
  seasonCode:[],
  ageGroup:null,
  knittingType:null,
  laborComplexity:null
})
const availableItems = ref([])

const formData3 = ref({
  categoryName:"",
  fabricWeight: null,
})

const commentData = ref({
  id:0,//数据库记录的id
  star: null,      // 评分 (1-5)
  evaluate: ''      // 评语
})

const categorylist = ref([])

const taxRatelist = ref([
{
  name:"13%(默认)",
  value:0.13
},
{
  name:"3%",
  value:0.03
}])

// 预测结果
const predictionResult = ref([])
const sheetSwap = ref(0)
const baseVolatility = ref(null)
const fabricVolatility = ref(0.05)
const bomData = ref([])
const metadata = ref({
  final_quote:0,
  prediction_time:"",
  subtotal:0,
  tax_amount:0,
  wastage_rate:0,
  wastage_type:""
})
const finalData = ref({
  wastageData:0,//损耗
  totalWithNoRate:0,//合计（不含税）
  taxAmount:0,//税金
  predictAmount:0,//报价
  commissionAmount:0,//佣金
  goods:0,//货品成本
  factoryAmount:0,//工厂利润
})
const units = ref([
  {
    id:"pcs",
    name:"件"
  },
  {
    id:"m",
    name:"米"
  },
  {
    id:"kg",
    name:"千克"
  },
  {
    id:"set",
    name:"套"
  },
  {
    id:"yd",
    name:"码"
  },
  {
    id:"rate",
    name:"率"
  },
])
const fap1Ref = ref(null)
const fap2Ref = ref(null)
const fapData = ref([]) //面料信息
const fapData2 = ref([]) //辅料信息
const fillterfapData2 = ref([]) //筛选后的辅料信息
const isfillterfap2 = ref(false) //是否有进行辅料筛选
const imgViewerVisible = ref(false)
const previewlist = ref([])
const notTargetCost = ref(false)
const notRetailPriceAndGrossMargin = ref(false)

const fuquery=ref({
  category:null,
  lowprice:null,
  highprice:null,
})

const getCategories = async () => {
  await getCategorylist().then(res => {
    categorylist.value = res.data
  })
}

const getElseByCategory = async () => {
  let param = {
    categoryCode:formData.value.category
  }
  await getByCategory(param).then(res => {
    console.log('根据品类获取分项的res',res);
    if(res.code == "" && res.data != undefined){
      availableItems.value = res.data.available_items
      console.log('availableItems',availableItems.value);
    }
  })
}

// 预测主逻辑
const runPrediction = async () => {
  if(formData.value.category==null){
    ElMessage.error("未选择品类")
    return;
  }
  if(formData.value.targetCost==null&&formData.value.retailPrice==null&&formData.value.grossMargin==null){
    ElMessage.error("未填写财务指标")
    return;
  }
  if(formData.value.genderCode==null){
    ElMessage.error("未选择性别")
    return;
  }
  if(formData.value.seasonCode==null||formData.value.seasonCode.length==0){
    ElMessage.error("未选择季节")
    return;
  }
  if(formData.value.ageGroup==null){
    ElMessage.error("未选择年龄组")
    return;
  }
  if(formData.value.knittingType==null){
    ElMessage.error("未选择织造方式")
    return;
  }
  var loading = ElLoading.service({ fullscreen: true })
  let param = {
    categoryCode:formData.value.category,
    targetCost:formData.value.targetCost,
    retailPrice:formData.value.retailPrice,
    grossMargin:formData.value.grossMargin,
    factoryProfitRate:formData.value.factoryProfitRate/100,
    taxRate:formData.value.taxRate,
    commissionRate:formData.value.commissionRate,
    fabricWeight:formData.value.fabricWeight,
    styleDescription:formData.value.styleDescription,
    genderCode:formData.value.genderCode,
    seasonCode:formData.value.seasonCode,
    ageGroup:formData.value.ageGroup,
    knittingType:formData.value.knittingType,
    laborComplexity:formData.value.laborComplexity,
    userInputs:availableItems.value
  }
  console.log('预测的参数',param);
  await predict(param).then(res => {
    console.log('预测的res',res);
    sheetSwap.value = 1
    formData3.value.categoryName = categorylist.value.find(item => item.code === res.data.category_code)?.name;
    formData3.value.fabricWeight = res.data.fabric_weight
    predictionResult.value = res.data.predicted_items
    bomData.value = predictionResult.value.filter(item => item.amount !== 0);
    metadata.value = res.data.metadata
    // finalData.value.wastageData = metadata.value.subtotal * metadata.value.wastage_rate
    // finalData.value.totalWithNoRate = (metadata.value.subtotal + finalData.value.wastageData)/(1-res.data.factory_profit_rate)
    // finalData.value.taxAmount = metadata.value.tax_amount
    // finalData.value.commissionAmount = finalData.value.totalWithNoRate * formData.value.commissionRate
    // finalData.value.goods = finalData.value.totalWithNoRate + finalData.value.taxAmount + finalData.value.commissionAmount
    // finalData.value.predictAmount = finalData.value.totalWithNoRate + finalData.value.taxAmount + finalData.value.commissionAmount
    // finalData.value.factoryAmount = finalData.value.totalWithNoRate - (metadata.value.subtotal + finalData.value.wastageData)
    finalData.value.wastageData = metadata.value.wastage_amount
    finalData.value.totalWithNoRate = metadata.value.pre_tax_total
    finalData.value.taxAmount = metadata.value.tax_amount
    finalData.value.commissionAmount = metadata.value.commission_amount
    finalData.value.goods = metadata.value.production_cost
    finalData.value.predictAmount = metadata.value.final_quote
    finalData.value.factoryAmount = metadata.value.factory_profit_amount
    commentData.value.id = res.data.recordId
    console.log('finalData',finalData.value);
    baseVolatility.value = formData.value.baseVolatility!=null?formData.value.baseVolatility/100:0.03
  }).finally(() => {
    loading.close();
  })
  await getFapDetails();
}

const goback = () => {
  sheetSwap.value = 0
  commentData.value = {
    id:0,//数据库记录的id
    star: null,      // 评分 (1-5)
    evaluate: ''      // 评语
  }
  fapData.value = []
  fapData2.value = []
  isfillterfap2.value = false
  fuquery.value = {
    category:null,
    lowprice:null,
    highprice:null,
  }
}

const newPredict = () =>{
  sheetSwap.value = 0
  formData.value = {
    category: null,
    targetCost: null,
    retailPrice: null,
    grossMargin: null,
    baseVolatility: null,
    volatilityRange: 3.0,
    activeVolatility: 3.0,
    commissionRate: 0.04,
    taxRate: 0.13,
    fabricWeight: null,
    styleDescription: null,
    fabricPct: null,
    laborPct: null,
    printPct: null,
    otherMaterialPct: null,
    threeFabricPct: null,
    packingPct: null,
    testingPct: null,
    drivingPct: null,
    factoryProfitRate: null,
    customCost: null,
    genderCode:null,
    seasonCode:[],
    ageGroup:null,
    knittingType:null,
    laborComplexity:null
  }
  formData3.value = {
    categoryName:"",
    fabricWeight: null,
  }
  bomData.value = []
  metadata.value = {}
  baseVolatility.value = null
  fapData.value = []
  fapData2.value = []
  commentData.value = {
    id:0,//数据库记录的id
    star: null,      // 评分 (1-5)
    evaluate: ''      // 评语
  }
  fapData.value = []
  fapData2.value = []
  isfillterfap2.value = false
  fuquery.value = {
    category:null,
    lowprice:null,
    highprice:null,
  }
}

const getFapDetails = async () => {
  let datas = []
  bomData.value.forEach(b => {
    let map
    if(b.item_code==='fabric_cost'){
      map = {
        originalPrice:b.unit_price - b.unit_price * fabricVolatility.value,
        price:b.unit_price + b.unit_price * fabricVolatility.value,
        classfyName:b.item_name,
        classfyCode:b.item_code
      }
    }else{
      map = {
        originalPrice:b.unit_price - b.unit_price * baseVolatility.value,
        price:b.unit_price + b.unit_price * baseVolatility.value,
        classfyName:b.item_name,
        classfyCode:b.item_code
      }
    }
    datas.push(map)
  })
  let param = {
    datas,
    seasonCode:formData.value.seasonCode,
    ageGroup:formData.value.ageGroup,
    genderCode:formData.value.genderCode,
    knittingType:formData.value.knittingType,
    categoryName:formData3.value.categoryName
  }
  await getFapData(param).then(res => {
    console.log('面料信息的res',res);
    fapData.value = res.data.finallist
    fapData2.value = res.data.finallist2
  })
}

function closeImgViewer(){
  console.log('关闭预览');
  imgViewerVisible.value = false
}

function previewPic(url){
  imgViewerVisible.value = true
  if(url != undefined){
    previewlist.value = [url]
  }
  console.log('预览图片的url和previewlist',url,previewlist.value);
}

const jumpFap = async (param,type) => {
  let fapToken
  let url
  let obj = {
    productId:param.productId,
    skuId:param.skuId,
    shopId:param.shopId
  }
  let paramstr = JSON.stringify(obj);
  console.log('paramstr',paramstr);
  const urlres = await getFapAppUrl()
  let path = urlres.data
  await getFapToken().then(res => {
    console.log('fap的token',res);
    fapToken = res.data
    if(type==1){
      //说明是面料
      url = path + "/#/productDetail" + "?proData=" + paramstr + "&maxkey=" + fapToken;
    }else if(type==2){
      //说明是辅料
      url = path + "/#/accessoryDetail" + "?proData=" + paramstr + "&maxkey=" + fapToken;
    }
    console.log('跳转的url',url);
  }).finally(() => {
    window.open(url);
  })
}

// 提交评价处理
const handleSubmit = async () => {
  if (!commentData.value.star) {
    ElMessage.warning('请先选择星级评分')
    return
  }
  // 这里可以调用接口提交数据
  console.log('提交的评价数据：', {
    star: commentData.value.star,
    evaluate: commentData.value.evaluate
  })

  await updateComment(commentData.value)
  ElMessage.success('感谢你的评价！')
}

// 重置评价
const handleReset = () => {
  commentData.value.star = null
  commentData.value.evaluate = ''
  ElMessage.info('已清空填写内容')
}

const fapData2Select = () => {
  if(fapData2.value.length>0){
    console.log('辅料的筛选条件',fuquery.value);
    if((fuquery.value.category!=null&&fuquery.value.category.length>0)
    || (fuquery.value.lowprice!=null&&fuquery.value.lowprice!="")
    || (fuquery.value.highprice!=null&&fuquery.value.highprice!="")){
      isfillterfap2.value = true
      fillterfapData2.value = []
      fillterfapData2.value = fapData2.value.filter((f) => {
        let categoryValidate = false
        let lowpriceValidate = false
        let highpriceValidate = false
        if(fuquery.value.category!=null&&fuquery.value.category.length>0){
          categoryValidate = fuquery.value.category.includes(f.categoryCode)
        }else{
          categoryValidate = true
        }

        if(fuquery.value.lowprice!=null&&fuquery.value.lowprice!=""){
          lowpriceValidate = f.price >= fuquery.value.lowprice
        }else{
          lowpriceValidate = true
        }

        if(fuquery.value.highprice!=null&&fuquery.value.highprice!=""){
          highpriceValidate = f.price <= fuquery.value.highprice
        }else{
          highpriceValidate = true
        }

        return categoryValidate && lowpriceValidate && highpriceValidate
      })
    }else{
      isfillterfap2.value = false
      fillterfapData2.value = []
    }
  }
}

const scrollToTarget = (type) => {
  console.log('跳转的type',type,fap1Ref.value,fap2Ref.value);
  if(type===1){
    if (fap1Ref.value) {
      fap1Ref.value.scrollIntoView({
        behavior: 'smooth',    // 'auto' = 立即跳转（无动画），'smooth' = 平滑滚动
        block: 'start',      // 元素顶部对齐视口顶部
        inline: 'nearest'
      })
    }
  }else if(type===2){
    if (fap2Ref.value) {
      fap2Ref.value.scrollIntoView({
        behavior: 'smooth',    // 'auto' = 立即跳转（无动画），'smooth' = 平滑滚动
        block: 'start',      // 元素顶部对齐视口顶部
        inline: 'nearest'
      })
    }
  }
}

onMounted(() => {
  getCategories()
  getElseByCategory()
})

watch(() => formData.value.category, (nVal, oVal) => {
  console.log('触发了category的监听', nVal);
  if (nVal) {
    availableItems.value = []
    getElseByCategory()
  }
});

watch(() => formData.value.targetCost, (nVal, oVal) => {
  console.log('触发了targetCost的监听', nVal);
  if (nVal) {
    notRetailPriceAndGrossMargin.value = true
    formData.value.retailPrice = null
    formData.value.grossMargin = null
  }else{
    notRetailPriceAndGrossMargin.value = false
  }
});

watch(() => formData.value.retailPrice, (nVal, oVal) => {
  console.log('触发了retailPrice的监听', nVal);
  if (nVal) {
    notTargetCost.value = true
    formData.value.targetCost = null
  }else{
    notTargetCost.value = false
  }
});

watch(() => formData.value.grossMargin, (nVal, oVal) => {
  console.log('触发了grossMargin的监听', nVal);
  if (nVal) {
    notTargetCost.value = true
    formData.value.targetCost = null
  }else{
    notTargetCost.value = false
  }
});
</script>

<!-- 页面1的样式 -->
<style scoped>

.dashboard {
  max-width: 1600px;
  margin: 0 auto;
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background: #f0f2f8;
  padding: 32px 24px;
  color: #1e293b;
}

/* 引入 Inter 字体 */
@import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap');

/* 头部 */
.header {
  margin-bottom: 28px;
}
.header h1 {
  font-size: 1.9rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1f2b3c, #2c3e66);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: -0.3px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.sub {
  color: #5b6e8c;
  margin-top: 8px;
  font-weight: 500;
  border-left: 4px solid #3b82f6;
  padding-left: 16px;
}

/* 双栏布局 */
.grid-main {
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
}

/* 卡片通用样式 */
.card {
  background: white;
  border-radius: 28px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.03), 0 2px 6px rgba(0,0,0,0.05);
  padding: 24px 28px;
  margin-bottom: 24px;
  border: 1px solid #eef2f9;
}
.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: 4px solid #3b82f6;
  padding-left: 14px;
  color: #0f172a;
}
.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}
.form-group {
  flex: 1;
  min-width: 160px;
}
.form-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #5b6e8c;
  margin-bottom: 8px;
}
input, select, textarea {
  width: 100%;
  padding: 12px 14px;
  font-size: 0.95rem;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
  transition: 0.2s;
  font-family: 'Inter', monospace;
  font-weight: 500;
}
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.2);
}
.inline-hint {
  font-size: 0.7rem;
  color: #7e8aa2;
  margin-top: 6px;
}
.three-cols {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 3fr;
  gap: 16px;
}

.two-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.percentage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px,1fr));
  gap: 16px;
  margin-top: 8px;
}
.percentage-item {
  background: #fafcff;
  border-radius: 20px;
  padding: 6px 8px;
}
.mt-3 {
  margin-top: 16px;
}
.mt-4 {
  margin-top: 16px;
  margin-bottom: 16px;
}
button {
  background: linear-gradient(105deg, #1e2b3c, #0f1a2c);
  border: none;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 600;
  /* border-radius: 40px; */
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}
button:hover {
  background: linear-gradient(105deg, #2c3e5c, #14212e);
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(0,0,0,0.1);
}
/* 右侧结果卡片 */
.result-card {
  background: linear-gradient(145deg, #ffffff, #f8fafd);
  border-radius: 32px;
  padding: 24px;
  position: sticky;
  top: 24px;
  border: 1px solid #eef2ff;
  box-shadow: 0 20px 35px -12px rgba(0,0,0,0.08);
}
.result-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  border-bottom: 2px dashed #cbd5e1;
  padding-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.metric {
  background: #f1f5f9;
  border-radius: 24px;
  padding: 16px;
  margin-top: 20px;
}
.metric-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f2b3d;
}
.diff-positive {
  color: #10b981;
  font-weight: 700;
}
.diff-negative {
  color: #ef4444;
  font-weight: 700;
}
.cost-breakdown {
  font-size: 0.85rem;
  max-height: 400px;
  overflow-y: auto;
}
.break-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eef2f8;
}
.info-note {
  background: #fef9e3;
  border-radius: 16px;
  padding: 12px;
  font-size: 0.75rem;
  color: #b45309;
  margin-top: 16px;
}
input[type=number] {
  -moz-appearance: textfield;
}
.slider {
  padding: 0;
  height: 6px;
  -webkit-appearance: none;
  background: #e2e8f0;
  border-radius: 10px;
}
.slider:focus {
  outline: none;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.emoji-icon {
  font-size: 1.1em;
  display: inline-block;
}

@media (max-width: 1000px) {
  .grid-main {
    grid-template-columns: 1fr;
  }
  .result-card {
    position: relative;
    top: 0;
  }
  .dashboard {
    padding: 20px;
  }
}
</style>

<!-- 页面2的样式 -->
<style scoped>
.prediction-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  background: #f5f7fa;
  padding: 20px;
  flex-wrap: wrap;
}

.main-card {
  max-width: 90%;
  width: 100%;
  border-radius: 20px;
  background: white;
}

.secound-card {
  margin-top: 10px;
  max-width: 90%;
  width: 100%;
  /* max-height: 1200px;
  min-height: 300px; */
  overflow: auto;
  border-radius: 20px;
  background: white;
  overflow: auto;
}

.tabs-header {
  display: flex;
  /* gap: 24px; */
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 12px;
  margin-bottom: 20px;
}

.tab {
  font-size: 16px;
  font-weight: 500;
  color: #909399;
  cursor: default;
  padding-bottom: 8px;
}

.tab.active {
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
}

.info-bar {
  background: #f0f2f8;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 14px;
  margin-bottom: 24px;
  color: #1f2f3d;
}

.divider {
  margin: 0 12px;
  color: #c0c4cc;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
}

.badge {
  background: #ecf5ff;
  color: #3b82f6;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.range-note {
  font-size: 12px;
  color: #909399;
}

.click-note {
  font-size: 12px;
  color: #4b84f5;
  cursor: pointer;
}

.bom-table {
  margin-bottom: 24px;
}

:deep(.el-table th) {
  background-color: #fafbfd;
  font-weight: 600;
}

.summary-lines {
  background: #f8fafc;
  border-radius: 16px;
  padding: 12px 20px;
  margin-bottom: 24px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
  border-bottom: 1px dashed #e2e8f0;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item .label {
  width: 30%;
  font-weight: 500;
  color: #475569;
}

.summary-item .value {
  width: 30%;
  text-align: center;
  font-weight: 600;
  color: #1e293b;
}

.summary-item .range {
  width: 30%;
  text-align: right;
  font-family: monospace;
  color: #6c757d;
  font-size: 12px;
}

.total .value {
  font-size: 18px;
  font-weight: 700;
  color: #d97706;
}

.final-price {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  background: linear-gradient(135deg, #1e2b3c, #0f1a2c);
  padding: 16px 24px;
  border-radius: 40px;
  color: white;
}

.final-price .label {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 1px;
}

.final-price .price {
  font-size: 28px;
  font-weight: 800;
}

.costitem{
  display: flex;
  justify-content: space-between;
  width: 95%;
}

.costitem .costcheck{
  flex: 2;
}

.costitem .costinput{
  flex: 8;
  margin: 5px 0 5px 0;
}

:deep(.el-table__header){
  height: 40px;
}
</style>

<!-- 评价 -->
<style scoped>
.evaluation-card {
  max-width: 100%;
  margin: 10px auto;
  padding: 30px 24px 24px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 20px;
  font-weight: 500;
  color: #303133;
  text-align: center;
  margin-bottom: 28px;
}

.rate-section {
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
}

.comment-section {
  margin-bottom: 32px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style>

<!-- 面料信息展示 -->
<style scoped>
.product-gallery {
  padding: 20px;
  background-color: #f5f7fa;
  /* min-height: 100vh; */
}

.product-col {
  margin-bottom: 20px;
}

.product-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
}

.image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: #f0f2f5;
  position: relative;
}

.image-wrapper :deep(.el-image) {
  width: 100%;
  height: 100%;
}

.image-wrapper :deep(.el-image__inner) {
  object-fit: cover;
  width: 100%;
  height: 100%;
  transition: transform 0.3s;
}

.image-wrapper:hover :deep(.el-image__inner) {
  transform: scale(1.05);
}

.image-placeholder,
.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
  font-size: 14px;
  background: #fafbfc;
}

.product-info {
  padding: 12px 12px 16px;
  background: white;
}

.product-name {
  font-weight: 600;
  font-size: 18px;
  color: #1f2f3d;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-code {
  font-size: 15px;
  color: #909399;
  margin-bottom: 6px;
  font-family: monospace;
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: #e6a23c;
  margin-bottom: 6px;
}

.product-supplier {
  font-size: 15px;
  color: #8a8f99;
  /* white-space: nowrap; */
  /* overflow: hidden; */
  text-overflow: ellipsis;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .product-gallery {
    padding: 12px;
  }
  .image-wrapper {
    height: 160px;
  }
  .product-name {
    font-size: 13px;
  }
  .product-price {
    font-size: 14px;
  }
}
</style>