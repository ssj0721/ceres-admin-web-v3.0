<template>
  <el-dialog
    v-model="visible"
    title="查货报告详情"
    width="100%"
    top="0"
    class="report-dialog"
    :fullscreen="true" 
    :lock-scroll="false"
  >
   <!-- 全屏加载动画 -->
    <div v-if="pageLoading" class="fullscreen-loading">
      <div class="loading-overlay"></div>
      <div class="loading-content">
        <div class="spinner">
          <div class="spinner-blade"></div>
          <div class="spinner-blade"></div>
          <div class="spinner-blade"></div>
          <div class="spinner-blade"></div>
          <div class="spinner-blade"></div>
          <div class="spinner-blade"></div>
          <div class="spinner-blade"></div>
          <div class="spinner-blade"></div>
          <div class="spinner-blade"></div>
          <div class="spinner-blade"></div>
          <div class="spinner-blade"></div>
          <div class="spinner-blade"></div>
        </div>
        <div class="loading-text">加载报告中，请稍候...</div>
      </div>
    </div>  
    <!-- 顶部合同号区域 -->
    <!--<div class="report-header">-->
      <!--<div class="contract-info">-->
        <!--<span>合同号: </span>-->
        <!--<el-link type="primary" >{{ rowData.po_no || contractNumber }}</el-link>-->
        <!--<el-link type="primary" @click="openContractDialog">{{ contractNumber }}</el-link> -->
        <!-- 将未查看标签移动到合同号右侧 -->
        <!--<span class="status-separator">|</span>
        <el-tag type="danger" class="status-tag">未查看: {{ unreportedCount }}</el-tag>-->
      <!--</div>-->
    <!--</div>-->
    
    
    <!-- 中部信息表格区域 -->
    <!-- 内容区域容器，添加滚动 -->
    <div class="report-content-container">
    <!-- 查货信息表格区域 - 添加锚点ID -->
<div id="inspection-info-section" class="info-section">
  <div class="info-title">查货信息</div>
  <div class="info-content">
    <div class="divider"></div>
    <div class="exit-info">
      <div class="info-grid">
        <!-- 出口查货 -->
        <template v-if="rowData.check_typenam === '出口查货'">
          <div class="info-row">
            <div class="info-label">合同号：</div>
            <div class="info-value">{{ rowData.po_no }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">业务类型：</div>
            <div class="info-value">{{ rowData.lic_typename }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">查货日期：</div>
            <div class="info-value">{{ rowData.bc_date }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">口岸地址：</div>
            <div class="info-value">{{ rowData.attachkport_name }}</div>
          </div>
        </template>

        <!-- 非出口查货 -->
        <template v-else>
          <div class="info-row">
            <div class="info-label">中/尾期：</div>
            <div class="info-value">{{ rowData.bc_qsname }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">出货批次：</div>
            <div class="info-value">{{ rowData.bc_seq }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">查货日期：</div>
            <div class="info-value">{{ rowData.bc_date }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</div>
    
<!-- 详细资料表格区域 -->
<div id="detail-info-section" class="info-section">
    <div class="info-title">详细资料</div>
    <div class="info-content">
        <div class="divider"></div>
        <div class="exit-info">
            <div class="info-grid">
                <!-- 信息行 -->
                <div class="info-row">
                    <div class="info-label">查货标准：</div>
                    <div class="info-value">{{ inspectionInfo1.chStandard }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">落货总数：</div>
                    <div class="info-value">{{ inspectionInfo1.lhStandard }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">查货数量：</div>
                    <div class="info-value">{{ rowData.bc_checknum }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">接受数量：</div>
                    <div class="info-value">{{ inspectionInfo1.jsQuantity }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">不接受数量：</div>
                    <div class="info-value">{{ inspectionInfo1.bjsQuantity }}</div>
                </div>
                
                <!-- 颜色和标准信息行 -->
                <div class="info-row">
                    <div class="info-label">颜色：</div>
                    <div class="info-value">
                        <el-tag 
                            v-for="(color, index) in inspectionInfo1.color" 
                            :key="index"
                            class="color-tag"
                        >
                            {{ color }}
                        </el-tag>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-label">主唛标准：</div>
                    <div class="info-value">
                        <el-link 
                            v-for="(item,index) in inspectionInfo1.mainStandards" 
                            :key="index" 
                            type="primary"
                            class="standard-link"
                            @click="openLabelDialog('主唛', item)"
                        >
                            {{ item }}
                        </el-link>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-label">洗水唛标准：</div>
                    <div class="info-value">
                        <el-link 
                            v-for="(item,index) in inspectionInfo1.washStandards" 
                            :key="index" 
                            type="primary"
                            class="standard-link"
                            @click="openLabelDialog('洗水唛', item)"
                        >
                            {{ item }}
                        </el-link>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-label">吊牌标准：</div>
                    <div class="info-value">
                        <el-link 
                            v-for="(item,index) in inspectionInfo1.tagStandards" 
                            :key="index" 
                            type="primary"
                            class="standard-link"
                            @click="openLabelDialog('合格证', item)"
                        >
                            {{ item }}
                        </el-link>
                    </div>
                </div>
            </div>
        </div>
        
<!-- 疵点部分 -->
<div id="defect-section" class="info-section">
    <div class="info-title">疵点信息</div>
    <div class="info-content">
        <div class="divider"></div>
        <div class="defect-container">
            <div class="defect-item" v-for="(add, index) in record" :key="index">
                <div class="defect-header">
                    {{ add.itemsName }}({{ add.item }}):
                </div>
                <div class="defect-content">
                    <div class="info-row">
                        <div class="info-label">件数:</div>
                        <div class="info-value">
                            <el-input 
                                type="text" 
                                v-model="add.bs_value"
                                class="defect-input"
                            />
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">备注:</div>
                        <div class="info-value">
                            <el-input 
                                type="text" 
                                v-model="add.remark"
                                class="defect-input"
                            />
                        </div>
                    </div>
                    <div class="defect-images">
                        <div class="image-wrapper">
                            <el-image
                                :src="add.pic1"
                                :preview-src-list="[add.pic1]"
                                fit="cover"
                                class="defect-image"
                                hide-on-click-modal
                            >
                                <template #error>
                                    <div class="image-slot">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </template>
                            </el-image>
                        </div>
                        <div class="image-wrapper">
                            <el-image
                                :src="add.pic2"
                                :preview-src-list="[add.pic2]"
                                fit="cover"
                                class="defect-image"
                                hide-on-click-modal
                            >
                                <template #error>
                                    <div class="image-slot">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </template>
                            </el-image>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
 </div>
</div>
</div>

    <!-- 问题跟进表格区域 - 添加锚点ID -->
    <div id="problem-follow-section" class="info-section">
        <div class="info-title">问题跟进</div>
        <div class="info-content">
          <div class="problem-label">洋行问题及跟进：</div>
          <el-input
            type="textarea"
            :rows="4"
            v-model="problemDescription"
            readonly
          ></el-input>
        </div>
    </div>

    <!-- 图片上传区域 - 添加锚点ID -->
    <div id="image-upload-section" class="info-section">
        <div class="info-title">图片上传</div>
        <div class="info-content">
          <div class="image-container">
            <el-image
              v-for="(image, index) in images"
              :key="index"
              :src="image.imgData"
              :preview-src-list="imageList"
              :initial-index="index"
              fit="cover"
              class="clothing-image"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              preview-teleported
            >
              <template #error>
                <div class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </template>
            </el-image>
          </div>
        </div>
    </div>

    <!-- 保存页区域 - 添加锚点ID -->
    <div id="save-page-section" class="info-section">
        <div class="info-title">保存页</div>
        <div class="info-content">
          <div class="result-container">
            <div class="result-label">查货结果：</div>
            <el-radio-group v-model="savevueform.radio1">
              <el-radio label="1" size="large" border>接受</el-radio>
              <el-radio label="2" size="large" border>不接受</el-radio>
              <el-radio label="0" size="large" border>不适用</el-radio>
              <el-radio label="3" size="large" border>联营商选择不上架</el-radio>
            </el-radio-group>
          </div>
          <div class="info-row" v-if="savevueform.iseshop === '不上架'">
            <div class="info-label">审款状态：</div>
              <div class="info-value">
                <strong style="color: red; font-size: 24px;">此款在审款系统中不上架</strong>
              </div>
          </div>
          <div class="info-row" v-if="showCuststatus">
            <div class="info-label">采购结果：</div>
              <div class="info-value">
              <el-radio-group v-model="savevueform.custstatus" :disabled="sdisnable1">
              <el-radio label="1" size="large" border>接受</el-radio>
              <el-radio label="2" size="large" border>不接受</el-radio>
              <el-radio label="0" size="large" border>不上架销售</el-radio>
             </el-radio-group>
            </div>
          </div>
          <div class="result-container">
            <div class="info-row">
                <div class="info-label">确认状态：</div>
                <div class="info-value">{{ statename }}</div>
              </div>
          </div>
          <div class="result-container">
            <div class="info-row">
                <div class="info-label">疵点总件数：</div>
                <div class="info-value">{{ savevueform.qdqty }}</div>
              </div>
          </div>
          <div class="result-container">
            <div class="info-row">
                <div class="info-label">不接受件数：</div>
                <div class="info-value">{{ inspectionInfo1.bjsQuantity }}</div>
              </div>
          </div>
          <div class="result-container">
            <div class="info-row">
                <div class="info-label">查货次数：</div>
                <div class="info-value">{{ rowData.bc_num }}</div>
              </div>
          </div>
        </div>
      </div>
    </div>


    <!-- 底部按钮区域 -->
    <div class="report-footer">
      <!-- <el-button type="primary" @click="scrollToSection('inspection-info-section')">查货信息</el-button>
      <el-button type="primary" @click="scrollToSection('detail-info-section')">详细资料</el-button>
      <el-button type="primary" @click="scrollToSection('problem-follow-section')">问题描述</el-button>
      <el-button type="primary" @click="scrollToSection('image-upload-section')">图片上传</el-button>
      <el-button type="primary" @click="scrollToSection('save-page-section')">保存页</el-button>
    </div> -->

    <span class="footer-bg-content" @click="scrollToSection('inspection-info-section')">查货信息</span>
    <span class="footer-bg-content" @click="scrollToSection('detail-info-section')">详细资料</span>
    <span class="footer-bg-content" @click="scrollToSection('problem-follow-section')">问题描述</span>
    <span class="footer-bg-content" @click="scrollToSection('image-upload-section')">图片上传</span>
    <span class="footer-bg-content" @click="scrollToSection('save-page-section')">保存页</span>
  </div>

<!-- 商品标签标准弹窗 -->
    <el-dialog
      v-model="labelDialogVisible"
      :title="labelDialogTitle"
      width="80%"
      top="5vh"
      class="label-standard-dialog"
      append-to-body
    >
      <div class="label-dialog-content">
  <!-- 左侧列 -->
  <div class="std-col-wrapper">
    <div class="std-col">
      <div class="row">
        <div class="label">标准类别</div>
        <el-select v-model="labeltypeid" placeholder="请选择">
          <el-option
            v-for="opt in labeltypeOpt"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </div>
      <div class="row">
        <div class="label">品牌</div>
        <el-input v-model="labelForm.name50" readonly />
      </div>
      <div class="row">
        <div class="label">位置</div>
        <el-input v-model="labelForm.position" readonly />
      </div>
      <div class="row">
        <div class="label">状态</div>
        <el-input v-model="labelForm.state" readonly />
      </div>
      <div class="row">
        <div class="label">描述</div>
        <el-input
          v-model="labelForm.describe"
          type="textarea"
          :rows="3"
          readonly
        />
      </div>
    </div>

    <!-- 右侧列 -->
    <div class="std-col">
      <div class="row">
        <div class="label">标准编号</div>
        <el-select v-model="number" placeholder="请选择" @change="changeNumber">
          <el-option
            v-for="opt in numberOpt"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </div>
      <div class="row">
        <div class="label">品种</div>
        <el-input v-model="labelForm.depname" readonly />
      </div>
      <div class="row">
        <div class="label">生效日期</div>
        <el-input v-model="labelForm.effectivedate" readonly />
      </div>
      <div class="row">
        <div class="label">失效日期</div>
        <el-input v-model="labelForm.expirationdate" readonly />
      </div>
    </div>
  </div>

  <!-- 图片独占一行 -->
  <div class="std-images-row">
    <div
      v-for="(item, index) in labelForm.img"
      :key="index"
      class="img-box"
    >
      <el-image
        :src="item.imgaddress"
        fit="cover"
        class="standard-image"
        :preview-src-list="labelForm.img.map(i => i.imgaddress)"
        :initial-index="index"
        preview-teleported
      >
        <template #error>
          <div class="image-slot"><i class="el-icon-picture-outline" /></div>
        </template>
      </el-image>
    </div>
  </div>
</div>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, defineProps, defineEmits, nextTick, watch, onMounted } from 'vue'
import {getlicDetails,licGetStandardData,getlicOrderDefective,
       getlicGM_CH_be_questions,getlicCheckImage,getlicContractStates,getIsEshop,
       formatTimeToStr
      }from './option'
const props = defineProps({
  modelValue: Boolean, // 控制弹窗显示/隐藏
  rowData: Object // 新增：接收行数据
})

const emit = defineEmits(['update:modelValue'])

// 计算属性，用于双向绑定
const visible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

// 从父组件接收的行数据
const rowData = computed(() => props.rowData )

// 查货信息
const unreportedCount = ref(2)
// 详细资料
const inspectionInfo1 = reactive({
  chStandard: '',
  lhStandard: '', 
  chQuantity: '',
  jsQuantity: '',
  bjsQuantity: '',
  color: [],
  mainStandards: [],
  washStandards: [],
  tagStandards: []
})
//标准信息存储
const standardData = ref([])

//详细资料获取
async function getDetail() {  
  try {
    const parms = {
      checkReportOId: rowData.value.checkoid,
      checkTypenam: rowData.value.check_typenam
    };
    const res = await getlicDetails(parms);
    const example = res.data || {};

    inspectionInfo1.chStandard = example.checkScrit || '';
    inspectionInfo1.lhStandard = example.totalNum?.toString() || '';
    inspectionInfo1.chQuantity = rowData.value.bc_checknum || '';
    inspectionInfo1.jsQuantity = example.accNum?.toString() || '';
    inspectionInfo1.bjsQuantity = example.disAccNum?.toString() || '';

    //把字符串拆成数组
    inspectionInfo1.color = (example.color || '')
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);
    
  } catch(err) {
    console.error('获取详情失败:', err);
    ElMessage.error('数据加载失败');
  }                            
}


//标准获取
const fetchStandardData = async () =>{
  try{
    const parms = {
        pono: rowData.value.po_no || "",
        bcqs: rowData.value.bc_qsname === "中期" ? "1" : "3",
        batchNo: rowData.value.bc_seq || "",
        num: rowData.value.bc_num || ""
        // "pono": "DE-31-919702",//测试用合同号
        // "bcqs":"1",//中1 尾3
        // "batchNo":"1",//出货批次
        // "num":"1",//出货次数        
    };

    const response = await licGetStandardData(parms);
    standardData.value = response.data || [];

        // 处理三种类型的标准
    const standards = { zm: [], xsm: [], dp: [] };
    
    standardData.value.forEach(item => {
      const standardType = 
        item.labeltypeid == 1 ? 'zm' : 
        item.labeltypeid == 2 ? 'xsm' : 
        item.labeltypeid == 3 ? 'dp' : null;
      
      if (standardType && item.number) {
        standards[standardType].push(item.number);
      }
    });

    // 更新到响应式数据
    inspectionInfo1.mainStandards = standards.zm;
    inspectionInfo1.washStandards = standards.xsm;
    inspectionInfo1.tagStandards = standards.dp;

    // 初始化选项
    initLabelOpt()
  }catch(err){
    console.error('获取详情失败:', err);
    ElMessage.error('数据加载失败');
  }
}



// 商品标签标准弹窗控制
const labelDialogVisible = ref(false)
const labelDialogTitle = ref("商品标签标准")
const labeltypeid = ref(null)
const number = ref(null)
const labelForm = reactive({
  name50: "",
  depname: "",
  position: "",
  effectivedate: "",
  state: "",
  expirationdate: "",
  describe: "",
  img: []
})

const labeltypeOpt = ref([])
const numberOpt = ref([])



// 打开标签标准弹窗
const openLabelDialog = async (type, itemNumber) => {
  labelDialogTitle.value = `${type}标准`

  if (!standardData.value || standardData.value.length === 0) {
    await fetchStandardData()
  }

  const matchedItem = standardData.value.find(
    i => i.number === itemNumber
  )

  if (!matchedItem) {
    ElMessage.warning('未找到对应标准信息')
    return
  }

  labeltypeid.value = matchedItem.labeltypeid
  number.value = matchedItem.number

  nextTick(() => {
    initLabelForm()
  })

  labelDialogVisible.value = true
}


// 初始化下拉选项
const initLabelOpt = () => {
  // 确保standardData有值
  if (standardData.value.length === 0) return
  
  // 获取所有唯一的labeltypeid
  const seen = new Set()
  labeltypeOpt.value = standardData.value.reduce((opts, item) => {
    if (!seen.has(item.labeltypeid)) {
      seen.add(item.labeltypeid)
      opts.push({
        label: item.labeltype,
        value: item.labeltypeid
      })
    }
    return opts
  }, [])
  // 更新标准编号选项
  updateNumberOpt()
}


// 更新标准编号下拉选项
const updateNumberOpt = () => {
  if (!labeltypeid.value || standardData.value.length === 0) {
    numberOpt.value = []
    return
  }
  numberOpt.value = standardData.value
    .filter(item => item.labeltypeid === labeltypeid.value)
    .map(item => ({
      label: item.number,
      value: item.number
    }))
}

// 初始化表单数据
const initLabelForm = () => {
  if (!number.value || !labeltypeid.value || standardData.value.length === 0) return
  
  const item = standardData.value.find(
    item => item.labeltypeid === labeltypeid.value && item.number === number.value
  )
  
  if (!item) return
  
  // 复制对象属性到labelForm
  Object.keys(labelForm).forEach(key => {
    if (key in item) {
      labelForm[key] = item[key]
    }
  })
  
  // 处理图片
  if (item.img && Array.isArray(item.img)) {
    labelForm.img = [...item.img].map(imgItem => {
      const newImg = {...imgItem}
      // 替换图片地址为匿名访问
      if (newImg.imgaddress && newImg.imgaddress.indexOf('downloadImageAnonymous') < 0) {
        newImg.imgaddress = newImg.imgaddress.replace('downloadImage', 'downloadImageAnonymous')
      }
      return newImg
    })
  }
  
  // 格式化日期
  labelForm.effectivedate = formatTimeToStr(labelForm.effectivedate, 'yyyy-MM-dd')
  labelForm.expirationdate = formatTimeToStr(labelForm.expirationdate, 'yyyy-MM-dd')
}

// 监听labeltypeid变化更新numberOpt
watch(labeltypeid, () => {
  updateNumberOpt()
  // 如果numberOpt有值，自动选择第一个
  if (numberOpt.value.length > 0) {
    number.value = numberOpt.value[0].value
    initLabelForm()
  }
})

// 监听number变化更新表单
const changeNumber = (val) => {
  number.value = val
  initLabelForm()
}



// 疵点
const loading = ref(false)
const record = ref([])

async function getOrder(){
  try {
    const parms = {
      checkReportOId: rowData.value.checkoid  
    };
    const res = await getlicOrderDefective(parms);
    record.value = res.data|| [];
  }catch(err) {
    console.error('获取详情失败:', err);
    ElMessage.error('数据加载失败');
  }      
}

// 添加问题描述
const problemDescription = ref()

async function fn_getdata(){
  try {
    const parms = {
      checkReportOId: rowData.value.checkoid,
      checkTypenam: rowData.value.check_typenam   
    };
    const res = await getlicGM_CH_be_questions(parms);
    problemDescription.value = res.data.question || [];
  }catch(err) {
    console.error('获取详情失败:', err);
    ElMessage.error('数据加载失败');
  }      
}


// 添加图片数据
const images = ref([])
async function getimages(){
    try {
    const parms = {
      checkReportOId: rowData.value.checkoid,
      checkTypenam: rowData.value.check_typenam   
    };
    const res = await getlicCheckImage(parms);
       // 转换数据结构：创建包含有效 src 字段的对象
    images.value = res.data || []
  }catch(err) {
    console.error('获取详情失败:', err);
    ElMessage.error('数据加载失败');
  }   
}
// 创建图片预览列表
const imageList = computed(() => {
  return images.value.map(img => img.imgData);
});

// 添加查货结果数据
const savevueform = ref({
  radio1: '',
  confirmstate: '',
  qdqty: ''
})
const statename = ref()
async function getsave(){
    try {
    const parms = {
      checkReportOId: rowData.value.checkoid,
      checkTypenam: rowData.value.check_typenam     
    };
    const res = await getlicContractStates(parms);
    let Examples = res.data;
    savevueform.value.radio1 = Examples.bc_result.toString();
    savevueform.value.confirmstate = Examples.confirm_state;
    if (savevueform.confirmstate == 1) statename.value = "已确认";
    else statename.value = "未确认";
      // 遍历疵点记录数组
    
let total = 0;
record.value.forEach(defect => {
  if (defect.bs_value) total += Number(defect.bs_value);
});
  
  // 将计算结果赋给 savevueform.qdqty
  savevueform.value.qdqty = total;
if (rowData.value.check_typenam === "出口查货") {
  savevueform.value.custstatus = Examples.custstatus?.toString() ?? '';
} else {
  const resoure = await getIsEshop({ pono: rowData.value.po_no });
  savevueform.value.iseshop = resoure.data ?? '';
}
  }catch(err) {
    console.error('获取详情失败:', err);
    ElMessage.error('数据加载失败');
  }   
}

const sdisnable1 = ref(false) // 是否禁用选择
const showCuststatus = computed(() => {
  return savevueform.value.custstatus !== undefined && savevueform.value.custstatus !== ''
})

// 添加滚动到指定区域的方法
function scrollToSection(sectionId) {
  nextTick(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// 监听弹窗打开状态和行数据
watch(
  () => props.modelValue && props.rowData,
  (shouldLoad) => {
    if (shouldLoad) {
      fetchAllData();
    }
  },
  { immediate: true }
);

const pageLoading = ref(true) // 新增页面加载状态

// 修改fetchAllData方法
const fetchAllData = async () => {
  if (!props.rowData?.checkoid) return;
  
  pageLoading.value = true  // 开始加载
  
  try {
    await Promise.all([
      getDetail(),
      fetchStandardData(),
      getOrder(),
      getsave(),
      getimages(),
      fn_getdata()
    ]);
    
    // 添加0.5秒延迟，让加载动画更明显
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log('数据加载完成');
  } catch (error) {
    console.error('数据加载失败:', error);
    ElMessage.error('报告加载失败');
  } finally {
    pageLoading.value = false  // 结束加载
  }
}


</script>

<style scoped>

.report-dialog {
  max-width: 100vw;
  height: 100vh;
  margin: 0;
}

/* 内容区域容器 - 添加滚动 */
.report-content-container {
  max-height: calc(100vh - 210px); /* 减去页眉和页脚高度 */
  overflow-y: auto;
  padding: 0 20px;
}


/* 修改顶部区域样式 */
.report-header {
  position: sticky;
  top: 0;
  background: white;
  z-index: 100;
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contract-info {
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-separator {
  color: #dcdfe6;
  margin: 0 10px;
}

.status-tag {
  margin-left: 10px;
}

.contract-info .el-link {
  font-size: 16px;
  margin-left: 8px;
}


.info-section {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 20px;
  background-color: #f8fafc;
  margin: 20px 0;
}

.info-container {
  display: flex;
  flex-direction: column;
}

.info-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #a8c7ff;
}

.divider {
  height: 1px;
  background-color: #ebeef5;
  margin: 15px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.info-label {
  width: 100px;
  font-weight: bold;
  color: #606266;
}

.info-value {
  flex: 1;
  color: #303133;
}

/* 调整底部按钮位置 */
.report-footer {
  position: fixed !important;
  bottom: 0;
  background: white;
  z-index: 100;
  width:98%;
  display: flex;
  justify-content: center;
  gap: 5px;
}

  .footer-bg-content {
    background: #a8c7ff;
    color:#FFF;
    font-size: 18px;
    line-height: 30px;
    width: 24%;
    padding: 5px;
    text-align: center;
    cursor: pointer;
  }

  .footer-bg-content:hover{
    background: #FFF;
    color:#a8c7ff;
    border:#a8c7ff 1px solid;
  }

/* 添加锚点跳转时的偏移补偿 */
.info-section {
  scroll-margin-top: 70px; /* 标题栏高度 */
}


.report-content {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  min-height: 300px;
}


/* 疵点部分样式 */
.defect-section {
  margin-top: 30px;
}



.defect-images {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}


.defect-image:hover {
  transform: scale(1.1);
}

/* 调整图片预览样式 */
:deep(.el-image-viewer__wrapper) {
  z-index: 9999 !important;
}

/* 添加图片容器样式 */
.image-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

/* 图片样式 */
.clothing-image {
  width: 100%;
  height: 150px;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.clothing-image:hover {
  transform: scale(1.05);
}

/* 图片加载失败时的占位样式 */
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}

/* 添加结果容器样式 */
.result-container {
  display: flex;
  align-items: center;
  margin-top: 15px;
}

.result-label {
  font-weight: bold;
  margin-right: 20px;
  min-width: 80px;
  color: #606266;
}

/* 调整单选按钮样式 */
.el-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.el-radio {
  margin-right: 0 !important;
}



/* 响应式调整 */
@media (max-width: 768px) {
  .image-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .result-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .result-label {
    margin-bottom: 10px;
  }
  
  .el-radio-group {
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }
  
  .el-radio {
    width: 100%;
  }
}

/* 标签链接样式 */
.tag-link {
  margin-right: 8px;
  margin-bottom: 5px;
  display: inline-block;
}

/* 颜色标签样式 */
.color-tag {
  margin-right: 8px;
  margin-bottom: 5px;
}

/* 标准链接样式 */
.standard-link {
  margin-right: 10px;
  display: inline-block;
}


/* 疵点部分样式 */
.defect-container {
    margin-top: 15px;
}

.defect-item {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    margin-bottom: 15px;
    overflow: hidden;
}

.defect-header {
    padding: 10px 15px;
    background-color: #f5f7fa;
    font-weight: bold;
    color: #606266;
    border-bottom: 1px solid #ebeef5;
}

.defect-content {
    padding: 15px;
}

.defect-input .el-input__inner {
    height: 32px;
}

.image-wrapper {
    flex: 1;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    overflow: hidden;
}

.info-row .el-radio-group {
  display: flex;
  gap: 10px;
}

.std-col-wrapper {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
}

.std-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.std-col .row {
  display: flex;
  align-items: center;
}



.std-col .el-select,
.std-col .el-input {
  flex: 1;
}

/* 图片独占一行 */
.std-images-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: flex-start;
}

.img-box {
  width: 30%;          /* 一行 3 张，剩余空间做 gap */
  aspect-ratio: 1 / 1; /* 正方形 */
  min-width: 220px;    /* 再小也不小于 220px */
}

.standard-image {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  transition: transform .25s;
}

.standard-image:hover {
  transform: scale(1.05);
}

/* 全屏加载动画样式 */
.fullscreen-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(5px);
}

.loading-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 2;
}

.loading-text {
  margin-top: 30px;
  font-size: 20px;
  color: #a8c7ff;
  font-weight: bold;
  letter-spacing: 2px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 旋转动画 */
.spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.spinner-blade {
  position: absolute;
  left: 44.5%;
  top: 37%;
  width: 10%;
  height: 25%;
  border-radius: 50%/20%;
  background-color: #a8c7ff;
  animation: spinner-fade 1s linear infinite;
}

@keyframes spinner-fade {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.25;
  }
}

/* 为每个叶片设置不同位置和延迟 */
.spinner-blade:nth-child(1) {
  animation-delay: 0s;
  transform: rotate(0deg) translate(0, -140%);
}

.spinner-blade:nth-child(2) {
  animation-delay: -0.9167s;
  transform: rotate(30deg) translate(0, -140%);
}

.spinner-blade:nth-child(3) {
  animation-delay: -0.833s;
  transform: rotate(60deg) translate(0, -140%);
}

.spinner-blade:nth-child(4) {
  animation-delay: -0.75s;
  transform: rotate(90deg) translate(0, -140%);
}

.spinner-blade:nth-child(5) {
  animation-delay: -0.667s;
  transform: rotate(120deg) translate(0, -140%);
}

.spinner-blade:nth-child(6) {
  animation-delay: -0.5833s;
  transform: rotate(150deg) translate(0, -140%);
}

.spinner-blade:nth-child(7) {
  animation-delay: -0.5s;
  transform: rotate(180deg) translate(0, -140%);
}

.spinner-blade:nth-child(8) {
  animation-delay: -0.4167s;
  transform: rotate(210deg) translate(0, -140%);
}

.spinner-blade:nth-child(9) {
  animation-delay: -0.333s;
  transform: rotate(240deg) translate(0, -140%);
}

.spinner-blade:nth-child(10) {
  animation-delay: -0.25s;
  transform: rotate(270deg) translate(0, -140%);
}

.spinner-blade:nth-child(11) {
  animation-delay: -0.1667s;
  transform: rotate(300deg) translate(0, -140%);
}

.spinner-blade:nth-child(12) {
  animation-delay: -0.0833s;
  transform: rotate(330deg) translate(0, -140%);
}
</style>