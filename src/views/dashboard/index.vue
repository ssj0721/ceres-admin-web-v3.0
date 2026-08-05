<template>
  <div v-show="false">
    <x-iframe :src="finalurl"></x-iframe>
  </div>
  <div class="home-page">
    <div class="total-data">
      <p class="p-title">
        <span>总数据</span>
        <!-- el-carousel 轮播组件 -->
        <span class="sound">
          <svg
            t="1706691814487"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1830"
            width="28"
            height="28"
          >
            <path
              d="M257.493333 322.4l215.573334-133.056c24.981333-15.413333 57.877333-7.914667 73.493333 16.746667 5.301333 8.373333 8.106667 18.048 8.106667 27.914666v555.989334C554.666667 819.093333 530.784 842.666667 501.333333 842.666667c-9.994667 0-19.786667-2.773333-28.266666-8L257.493333 701.6H160c-41.237333 0-74.666667-33.013333-74.666667-73.738667V396.138667c0-40.725333 33.429333-73.738667 74.666667-73.738667h97.493333z m26.133334 58.4a32.298667 32.298667 0 0 1-16.96 4.8H160c-5.888 0-10.666667 4.714667-10.666667 10.538667v231.733333c0 5.813333 4.778667 10.538667 10.666667 10.538667h106.666667c5.994667 0 11.872 1.664 16.96 4.8L490.666667 770.986667V253.013333L283.626667 380.8zM800.906667 829.653333a32.288 32.288 0 0 1-45.248-0.757333 31.317333 31.317333 0 0 1 0.768-44.693333c157.653333-150.464 157.653333-393.962667 0-544.426667a31.317333 31.317333 0 0 1-0.768-44.682667 32.288 32.288 0 0 1 45.248-0.757333c183.68 175.306667 183.68 460.010667 0 635.317333z m-106.901334-126.186666a32.288 32.288 0 0 1-45.248-1.216 31.328 31.328 0 0 1 1.237334-44.672c86.229333-80.608 86.229333-210.56 0-291.178667a31.328 31.328 0 0 1-1.237334-44.672 32.288 32.288 0 0 1 45.248-1.216c112.885333 105.546667 112.885333 277.418667 0 382.965333z"
              fill="#47a189"
              p-id="1831"
            />
          </svg>
          <div><p class="text">{{ text }}</p></div>
        </span>
      </p>
      <ul>
        <li v-for="(item, index) in totalDataList" :key="index" @click="getItemData(item)">
          <p>{{ item.value }}</p>
          <p>{{ item.name }}</p>
        </li>
      </ul>
    </div>

    <div class="sketch_map">
      <div class="tab_list">
        <ul>
          <li v-for="(item, index) in tabList" :key="index" :class="[{ active: item.show }]" @click="changeTab(item)">
            {{ item.name }}
          </li>
        </ul>
      </div>

      <div class="echart_list">
        <div class="echart_item product_echart_item">
          <p class="title">审核商品详情</p>
          <!-- <p class="title">访问用户数{{ info.count }} 次</p> -->
          <div id="check_detail" class="full-size"></div>
          <el-button type="success" class="exportBtn" plain @click="exportProductStats">导出</el-button>
        </div>

        <div class="echart_item order_echart_item">
          <!--          <p class="title">选款商品</p>-->
          <!--          <ul v-if="info.hotSellProducts && info.hotSellProducts.length">-->
          <!--            <li v-for="(item, index) in info.hotSellProducts" :key="index">-->
          <!--              <p style="font-size: 18px;">{{ index + 1 }}</p>-->
          <!--              <p :title="item.productName" style="font-size: 18px;">{{ item.productName }}</p>-->
          <!--              <p style="font-size: 18px;">{{ `选款 ${item.number} 件` }}</p>-->
          <!--            </li>-->
          <!--          </ul>-->
          <!--          <div v-else class="empty">-->
          <!--            <img :src="empty" alt />-->
          <!--            <p>暂无数据</p>-->
          <!--          </div>-->
          <!--          <el-button type="success" class="exportBtn" plain @click="exportHotProducts">导出</el-button>-->

          <!--  20250723功能变更： 统计不同状态采购单的数量  -->
          <div class="title">
            <ul class="order_tabs">
              <li v-for="(text, index) in ['采购单统计','追单统计']" :key="index" :class="{selected:index===chooseOrderTabIndex}" @click="changeOrderTab(index)">{{ text }}</li>
            </ul>
          </div>
          <div id="order_status_chart" class="full-size"></div>
          <el-button type="success" class="exportBtn" plain @click="exportPoOrderStats">导出</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  hotProductsExport,
  productStatsExport,
  indexTest,
  getNotice,
  getPoOrderStats,
  poOrderStatsExport
} from '@/api/dashboard';
import empty from '@/assets/images/empty.png';
import * as echarts from 'echarts';
import { nextTick, onBeforeMount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ireIframe from '@/utils/ireIframe';
import { ElLoading, ElMessage } from 'element-plus';

const router = useRouter();

const visitEchart = ref(null)
const convertEchart = ref(null)
const chooseOrderTabIndex = ref(0)
const form = ref({
  condition: 1
})
const totalDataList = ref([
  { name: '商品数量', value: 0, field: 'total', ifCredit: 'null' },
  { name: '未送批商品数量', value: 0, field: 'draftTotal', ifCredit: '0' },
  { name: '待联营商审核商品数量', value: 0, field: 'stayTotal', ifCredit: '2' },
  { name: '联营商审核商品通过数量', value: 0, field: 'passTotal', ifCredit: '1' },
  { name: '联营商审核商品否决数量', value: 0, field: 'rejectTotal', ifCredit: '3' }
])
const tabList = ref([
  { name: '最近30天', type: 4, date: '30' },
  { name: '最近7天', type: 3, date: '7' },
  { name: '昨天', type: 2, date: '1' },
  { name: '今天', type: 1, show: true, date: '0' }
])
const info = ref({})
const date = ref('0')
const orderData = ref({})

var xdata = ['草稿', '待审', '通过', '否决'];
var ydata = [
  { value: 0, name: '草稿' },
  { value: 0, name: '待审' },
  { value: 0, name: '通过' },
  { value: 0, name: '否决' }
]
var orderYdata = [
  { value: 0, name: '供货商已确认' },
  { value: 0, name: '待确认' },
  { value: 0, name: '草稿' },
  { value: 0, name: '完成' },
  { value: 0, name: '作废' },
]
onMounted(() => {
  console.log('首页的onMounted');
  getTotalData();
  setDataByCondition();
  setPoOrderStatisticsByCondition();
  getText();
  drawRight()
  completeIframeUrl()
})

const finalurl = ref("")
const url = ref("/wel/index")

async function completeIframeUrl() {
  console.log('sessionStorage.getItem("clickTime")',sessionStorage.getItem("clickTime"));
  if(sessionStorage.getItem("clickTime")==undefined || sessionStorage.getItem("clickTime")==null){
    var loading = ElLoading.service({ fullscreen: true, text: '加载中...' })
    finalurl.value = await ireIframe(url.value)
    // setTimeout(() => {
      loading.close();
    // }, 6000);
    sessionStorage.setItem('clickTime', 1)
  }
}

// 页面跳转
const getItemData = (item) => {
  console.log('item', item);
  if (item.field == 'stayTotal') {
    router.push({
      path: '/itemaudit/iat_001',
      query: {
        name: [...item.ifCredit]
      }
    })
  } else {
    router.push({
      path: '/renovation/commoditySystem',
      query: {
        name: item.ifCredit
      }
    })
  }
}

const getTotalData = async () => {
  // condition为null, 查询所有数据
  const res = await indexTest({})
  if (res.code === '') {
    const d = res.data
    totalDataList.value.map((item) => {
      item.value = d[item.field]
    })
  }
}

const setDataByCondition = async () => {
  const res = await indexTest(form.value)
  if (res.code === '') {
    const d = res.data
    ydata[0].value = d.draftTotal; // 草稿
    ydata[1].value = d.stayTotal; // 待审
    ydata[2].value = d.passTotal; // 通过
    ydata[3].value = d.rejectTotal; // 否决
    info.value = d
    drawLeft();
    // draw1();
  }
}

const setPoOrderStatisticsByCondition = async () => {
  const res = await getPoOrderStats({
    condition: form.value.condition,
    orderType: chooseOrderTabIndex.value,
  })
  if (res.code === '') {
    const d = res.data
    orderYdata[0].value = d.confirmed
    orderYdata[1].value = d.unconfirmed
    orderYdata[2].value = d.draft
    orderYdata[3].value = d.finished
    orderYdata[4].value = d.failed
    drawRight()
  }
}

let text = ref('')

const getText = async () => {
  const res = await getNotice()
  console.log('滚动消息栏的res', res);
  if (res.code === '') {
    text.value = res.data.text
  }
}

// const getDataList =

// onBeforeMount(() => {

//   // getTotalData()
// })
// const getTotalData = async () => {
//   const res = await dashIndex(form.value)
//   if (res.code === '') {
//     const d = res.data
//     // 小于100元，单位为 元
//     if (d.money < 10000) {
//       dataList.value[3].name = '成交金额 (元)'
//     }
//     dataList.value.map((item) => {
//       item.value = d[item.field]
//     })
//     draw(res.data.visitWeek)
//     // draws(res.data.conversion)
//     info.value = d
//   }
// }
// const turnTime = (v) => {
//   const t = v.split('-')
//   return `${Number(t[1])}/${Number(t[2])}`
// }
const changeTab = (v) => {
  console.log('启动changeTab');
  tabList.value.map((item) => {
    item.show = item.date === v.date
  })
  form.value.condition = v.type
  date.value = v.date
  setDataByCondition()
  setPoOrderStatisticsByCondition()
}

const changeOrderTab = (i) => {
  chooseOrderTabIndex.value = i;
  setPoOrderStatisticsByCondition()
}
// 导出用户访问数据
// const exportUserVisit = async () => {
//   ElMessage({
//     message: '数据导出中，请勿重复操作！',
//     type: 'success',
//   })
//   const res = await userVisitExport(form.value)
//   if (!res) {
//     return
//   }
//   doExportFile(res, '用户访问数据')
// }
// 导出订单统计数据
// const exportOrderConvert = async () => {
//   ElMessage({
//     message: '数据导出中，请勿重复操作！',
//     type: 'success',
//   })
//   const res = await orderConvertExport(form.value)
//   if (!res) {
//     return
//   }
//   doExportFile(res, '订单统计数据')
// }
// 导出热卖商品数据
const exportHotProducts = async () => {
  ElMessage({
    message: '数据导出中，请勿重复操作！',
    type: 'success',
  })
  const res = await hotProductsExport(form.value)
  if (!res) {
    return
  }

  // 获取具体的日期范围
  const dateRange = getDateRangeString()
  doExportFile(res, `${dateRange}热卖商品数据`)
}

// 导出审核商品统计数据
const exportProductStats = async () => {
  ElMessage({
    message: '数据导出中，请勿重复操作！',
    type: 'success',
  })
  const res = await productStatsExport(form.value)
  if (!res) {
    return
  }
  const dateRange = getDateRangeString()
  doExportFile(res, `${dateRange}审核商品统计数据`)
}

const exportPoOrderStats = async () => {
  ElMessage({
    message: '数据导出中，请勿重复操作！',
    type: 'success',
  })
  const res = await poOrderStatsExport({
    condition: form.value.condition,
    orderType: chooseOrderTabIndex.value,
  })
  if (!res) {
    return
  }
  const dateRange = getDateRangeString()
  const type = chooseOrderTabIndex.value === 0 ? '采购单' : '追单'
  doExportFile(res, `${dateRange}${type}统计数据`)
}

// 获取具体的日期范围字符串
const getDateRangeString = () => {
  const today = new Date()
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}${month}${day}`
  }

  const selectedTab = tabList.value.find(item => item.show)
  if (!selectedTab) return formatDate(today)

  const endDate = new Date(today)
  const startDate = new Date(today)

  switch (selectedTab.type) {
  case 1: // 今天
    return formatDate(today)
  case 2: // 昨天
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    return formatDate(yesterday)
  case 3: // 最近7天
    startDate.setDate(today.getDate() - 6)
    break
  case 4: // 最近30天
    startDate.setDate(today.getDate() - 29)
    break
  default:
    return '全部'
  }

  return `${formatDate(startDate)}-${formatDate(endDate)}`
}

const doExportFile = (res, fileName) => {
  const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
  if ('download' in document.createElement('a')) {
    // 非IE下载
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
  } else {
    // IE10+下载
    navigator.msSaveBlob(blob, fileName)
  }
}

const drawLeft = (arr) => {
  const option = {
    xAxis: {
      // type: 'category',
      // data: arr.time,
      // type: 'category',// 类目轴，即x轴上列出的是数据的分类，因此是需要data属性
      // data: xdata, // 明确指出x轴上需要列出的有哪些分类
      axisTick: {
        show: false, // 是否显示坐标轴刻度 默认显示
      },
      // 坐标轴轴线
      axisLine: {
        // 是否显示坐标轴轴线 默认显示
        show: false, // 是否显示坐标轴轴线 默认显示
      },
      // 坐标轴在图表区域中的分隔线
      splitLine: {
        show: false, // 是否显示分隔线。默认数值轴显示
      },
      // 坐标轴刻度标签
      axisLabel: {
        show: false, // 是否显示刻度标签 默认显示
      },
    },
    yAxis: {
      // type: 'value',
      // name: '次数',
      axisTick: {
        show: false, // 是否显示坐标轴刻度 默认显示
      },
      // 坐标轴轴线
      axisLine: {
        // 是否显示坐标轴轴线 默认显示
        show: false, // 是否显示坐标轴轴线 默认显示
      },
      // 坐标轴在图表区域中的分隔线
      splitLine: {
        show: false, // 是否显示分隔线。默认数值轴显示
      },
      // 坐标轴刻度标签
      axisLabel: {
        show: false, // 是否显示刻度标签 默认显示
      },
    },
    series: [
      {
        // data: arr.total,
        // type: 'line'

        radius: '50%',
        // 第一个值调整左右，第二个值调整上下，也可以设置具体数字像素值，center: [200, 300],
        center: ['50%', '50%'],
        data: ydata,
        type: 'pie', // 图形类型 bar柱状图，line拆线图，pie饼图
        label: {
          normal: {
            show: true,
            formatter: '{b}:{c}' + '\n\r' + '({d}%)', // 自定义显示格式(b:name, c:value, d:百分比)
            textStyle: { 'fontSize': 12 }
          }
        },
      }],
    tooltip: {
      trigger: 'item',
      formatter: '{b}:{c}' + '\n\r' + '({d}%)',
      textStyle: {
        'fontSize': 14
      }
    },
    legend: {
      'orient': 'vertical',
      'left': 'left',
      'data': ydata,
      'textStyle': {
        'fontSize': 14
      }
    },

  }
  const myEchart = echarts.init(document.getElementById('check_detail'), 'light')
  window.addEventListener('resize', function () {
    myEchart.resize();
  });

  myEchart.setOption(option)

  myEchart.on('click', function (params) {
    router.push({ path: '/renovation/commoditySystem', query: { name: params.name }})
  });
}

const drawRight = () => {
  const option = {
    xAxis: {
      // type: 'category',
      // data: arr.time,
      // type: 'category',// 类目轴，即x轴上列出的是数据的分类，因此是需要data属性
      // data: xdata, // 明确指出x轴上需要列出的有哪些分类
      axisTick: {
        show: false, // 是否显示坐标轴刻度 默认显示
      },
      // 坐标轴轴线
      axisLine: {
        // 是否显示坐标轴轴线 默认显示
        show: false, // 是否显示坐标轴轴线 默认显示
      },
      // 坐标轴在图表区域中的分隔线
      splitLine: {
        show: false, // 是否显示分隔线。默认数值轴显示
      },
      // 坐标轴刻度标签
      axisLabel: {
        show: false, // 是否显示刻度标签 默认显示
      },
    },
    yAxis: {
      // type: 'value',
      // name: '次数',
      axisTick: {
        show: false, // 是否显示坐标轴刻度 默认显示
      },
      // 坐标轴轴线
      axisLine: {
        // 是否显示坐标轴轴线 默认显示
        show: false, // 是否显示坐标轴轴线 默认显示
      },
      // 坐标轴在图表区域中的分隔线
      splitLine: {
        show: false, // 是否显示分隔线。默认数值轴显示
      },
      // 坐标轴刻度标签
      axisLabel: {
        show: false, // 是否显示刻度标签 默认显示
      },
    },
    series: [
      {
        // data: arr.total,
        // type: 'line'

        radius: '50%',
        // 第一个值调整左右，第二个值调整上下，也可以设置具体数字像素值，center: [200, 300],
        center: ['50%', '50%'],
        data: orderYdata,
        type: 'pie', // 图形类型 bar柱状图，line拆线图，pie饼图
        label: {
          normal: {
            show: true,
            formatter: '{b}:{c}' + '\n\r' + '({d}%)', // 自定义显示格式(b:name, c:value, d:百分比)
            textStyle: { 'fontSize': 12 }
          }
        },
      }],
    tooltip: {
      trigger: 'item',
      formatter: '{b}:{c}' + '\n\r' + '({d}%)',
      textStyle: {
        'fontSize': 14
      }
    },
    legend: {
      'orient': 'vertical',
      'left': 'left',
      'data': orderYdata,
      'textStyle': {
        'fontSize': 14
      }
    },

  }
  const myEchart = echarts.init(document.getElementById('order_status_chart'), 'light')
  window.addEventListener('resize', function () {
    myEchart.resize();
  });
  myEchart.setOption(option)
}

const draw1 = (arr) => {
  const myEchart = echarts.init(document.getElementById('all_check_detail'), 'light')
  window.addEventListener('resize', function () {
    myEchart.resize();
  });
  const option = {
    xAxis: {
      // type: 'category',
      // data: arr.time,
      // type: 'category',// 类目轴，即x轴上列出的是数据的分类，因此是需要data属性
      // data: xdata, // 明确指出x轴上需要列出的有哪些分类
      axisTick: {
        show: false, // 是否显示坐标轴刻度 默认显示
      },
      // 坐标轴轴线
      axisLine: {
        // 是否显示坐标轴轴线 默认显示
        show: false, // 是否显示坐标轴轴线 默认显示
      },
      // 坐标轴在图表区域中的分隔线
      splitLine: {
        show: false, // 是否显示分隔线。默认数值轴显示
      },
      // 坐标轴刻度标签
      axisLabel: {
        show: false, // 是否显示刻度标签 默认显示
      },
    },
    yAxis: {
      // type: 'value',
      // name: '次数',
      axisTick: {
        show: false, // 是否显示坐标轴刻度 默认显示
      },
      // 坐标轴轴线
      axisLine: {
        // 是否显示坐标轴轴线 默认显示
        show: false, // 是否显示坐标轴轴线 默认显示
      },
      // 坐标轴在图表区域中的分隔线
      splitLine: {
        show: false, // 是否显示分隔线。默认数值轴显示
      },
      // 坐标轴刻度标签
      axisLabel: {
        show: false, // 是否显示刻度标签 默认显示
      },
    },
    series: [
      {
        // data: arr.total,
        // type: 'line'

        radius: '100%',
        center: ['45%', '60%'],
        data: ydata,
        type: 'pie', // 图形类型 bar柱状图，line拆线图，pie饼图
        label: {
          normal: {
            show: true,
            formatter: '{b}:{c}' + '\n\r' + '({d}%)', // 自定义显示格式(b:name, c:value, d:百分比)
            textStyle: { 'fontSize': 14 }
          }
        },
      }],
    tooltip: {
      trigger: 'item',
      formatter: '{b}:{c}' + '\n\r' + '({d}%)',
      textStyle: {
        'fontSize': 14
      }
    },
    legend: {
      'orient': 'vertical',
      'left': 'left',
      'data': ydata,
      'textStyle': {
        'fontSize': 14
      }
    },

  }
  myEchart.setOption(option)
}

</script>

<style lang="scss" scoped>
ul {
  list-style: none;
}

.home-page {
  height: 100%;

  .total-data {
    .p-title {
      padding-left: 20px;
      font-size: 24px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 50px;
      height: 50px;
      margin: 0;
      display: flex;
      justify-content: space-between;
    }

    ul {
      overflow: hidden;
      display: flex;
      padding: 0;

      li {
        padding: 0;
        box-sizing: border-box;
        flex: 4;
        width: 400px;
        height: 140px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(224, 229, 235, 1);
        border-radius: 4px;
        margin: 20px;

        p {
          margin: 0;
          height: 70px;
          line-height: 70px;
          text-align: center;

          &:nth-child(1) {
            font-size: 48px;
            font-weight: 600;
          }

          &:nth-child(2) {
            font-size: 18px;
          }
        }

        &:nth-child(1) {
          p:nth-child(1) {
            color: #1acda1;
          }
        }

        &:nth-child(2) {
          p:nth-child(1) {
            color: #ffae11;
          }
        }

        &:nth-child(3) {
          p:nth-child(1) {
            color: #ff7911;
          }
        }

        &:nth-child(4) {
          p:nth-child(1) {
            color: #3a68f2;
          }
        }

        &:nth-child(5) {
          p:nth-child(1) {
            color: red;
          }
        }
      }
    }
  }

  .sketch_map {
    height: calc(100% - 260px);
    box-sizing: border-box;
    background: #fff;
    padding: 0 20px;

    .tab_list {
      border-bottom: 1px solid #e0e5eb;
      overflow: hidden;
      margin-bottom: 20px;

      ul {
        overflow: hidden;
        float: right;
        width: 60%;
        padding: 0;
        margin: 0;

        li {
          padding: 0 20px;
          margin: 0;
          float: right;
          height: 60px;
          line-height: 60px;
          color: #999999;
          font-size: 18px;

          &:hover {
            cursor: pointer;
          }

          &:nth-child(1) {
            padding-right: 0;
          }
        }

        .active {
          color: #3a68f2;
          border-bottom: 3px solid #3a68f2;
        }
      }
    }

    .echart_list {
      height: calc(100% - 100px);

      .echart_item {
        position: relative;
        padding-left: 20px;
        box-sizing: border-box;
        height: calc(100% - 30px);
        width: calc((100% - 40px) / 2);
        // width: calc((100% - 40px) / 2);
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(224, 229, 235, 1);
        box-shadow: 0px 5px 10px 0px rgba(51, 51, 51, 0.15);
        border-radius: 4px;
        float: left;

        .echart {
          height: calc(100% - 100px);
        }

        &:nth-child(-n + 2) {
          margin-right: 20px;
        }

        .title {
          margin: 0;
          height: 48px;
          line-height: 48px;
          font-size: 18px;
          color: #333333;
          border-bottom: 2px solid rgb(228, 231, 237);
          margin-bottom: 10px;

          &:nth-child(2) {
            text-align: center;
            color: #3a68f2;
            font-size: 14px;
          }
        }

        &.product_echart_item {
          ul {
            height: calc(100% - 50px);
            margin: 0;
            padding: 0;

            li {
              height: 10%;
              display: flex;
              margin-bottom: 20px;

              p {
                float: left;
                // text-align: center;
                text-indent: 2em;
                padding: 0;
                margin: 0;
                color: #333333;
                font-size: 14px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                &:nth-child(1) {
                  flex: 2;
                }

                &:nth-child(2) {
                  flex: 6;
                }

                &:nth-child(3) {
                  flex: 4;
                }
              }
            }
          }
        }

        .exportBtn {
          position: absolute;
          right: 10px;
          top: 10px;
        }
      }
    }
  }
}

.empty {
  height: 450px;

  img {
    width: 80px;
    height: 80px;
    margin: 100px auto 10px;
    display: block;
  }

  p {
    text-align: center;
    color: #333333;
  }
}

.full-size {
  height: 500px;
}

.sound{
    width: 90%;
    height: 50%;
    // background-color: #c5eee3;
    color: #47a189;
    border-radius: 20px;
    margin-top: 10px;
    display: flex;
    gap: 10px;
    overflow: hidden;
    line-height: 28px;
    align-items: center;
}
.sound .icon{
    width: 28px;
    height: 28px;
    padding-left: 10px;
}
.sound div{
    width: 100%;
    height: 28px;
    overflow: hidden;
}
.sound div p{
    font-size: 18px;
    font-weight: 500;
    width: 100%;
    transform: translateX(700px);
    white-space: nowrap;
}
.text {
    animation: slideLeft 20s linear infinite;

@keyframes slideLeft {
   0% {
       transform: translateX(100%);
   }
   100% {
       transform: translateX(-50%);
   }
}
}

.order_echart_item .order_tabs {
  height: 100%;
  display: flex;
  li {
    position: relative;
    height: 100%;
    display: block;
    padding: 0 10px;
    cursor: pointer;
  }
  li.selected {
    color: #3a68f2;
    border-bottom: 3px solid #3a68f2;
  }
}
</style>
