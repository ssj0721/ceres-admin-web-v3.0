import { useLicZcStore } from '@/stores/licZcStore'
import { checkItemFromLicPo } from '@/api/etds'

// 添加节流函数
const throttle = (fn, delay) => {
  let lastCall = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      return fn.apply(this, args)
    }
  }
}

// 节流包装的API调用
const throttledCheckItemFromLicPo = throttle(checkItemFromLicPo, 1000)

export const licSqCheckFormOption = {
  labelSpan: 12,
  valueSpan: 12,
  showHeader: false,
  columns: [
    {
      label: '业务类型',
      prop: 'lic_type',
      type: 'select',
      dicData: [
        { label: '联营业务', value: 0 },
        { label: '联营款', value: 1 }
      ],

    },
    {
      label: '查货日期',
      prop: 'bc_date',
      type: 'date',
      valueFormat: 'YYYY-MM-DD',

    },
    {
      label: '款号',
      prop: 'bc_pono',
      rules: {
        type: 'string',
        required: true,
        pattern: /^[0-9a-zA-Z]{2}-[0-9][12349]-[0-9a-zA-Z]{6}$/,
        async validator (rule, value, callback) {
          if (!value) {
            callback(new Error('款号为必填项'))
            return
          }

          // 检查是否在联营商款号列表中
          const licZcStore = useLicZcStore()
          const shopItemCodeList = licZcStore.shopItemCodeList ? licZcStore.shopItemCodeList : []
          const item = shopItemCodeList.find(item => item === value)
          if (!item) {
            callback(new Error('该款号不是本联营商款号/该款号不存在'))
            return
          }

          // 前面的校验都通过后，才检查查货系统
          // try {
          //   const resPo = await throttledCheckItemFromLicPo({
          //     bc_pono: value,
          //   })
          //   if (!resPo?.data?.result?.Examples?.licPo?.length) {
          //     callback(new Error('该款号在查货系统中不存在'))
          //     return
          //   }
          //   callback()
          // } catch (error) {
          //   callback(new Error('检查查货系统时发生错误'))
          // }
        },
        trigger: ['blur']
      },
      placeholder: '请输入款号（必填）',
    },
    {
      label: '送审状态',
      prop: 'sconfirm',
      disabled: true,
      placeholder: ' ',
    },
    {
      label: '出货批次',
      prop: 'batchNo',
    },
    {
      label: '查货次数',
      prop: 'bc_num',
    },
  ],
}

export const licSqDetailsFormOption = {
  labelSpan: 12,
  valueSpan: 12,
  showHeader: true,
  headerConfig: {
    labelText: '检查项目',
    valueText: '检查结果',
  },
  columns: [
    {
      label: '查货标准',
      prop: 'checkScrit',
      type: 'select',

      dicData: [
        { label: 'AQL2.5II', value: 'AQL2.5II' },
        { label: 'AQL1.0II', value: 'AQL1.0II' },
        { label: 'AQL1.5II', value: 'AQL1.5II' },
        { label: '100%', value: '100%' },
      ],
    },
    {
      label: '落货总数',
      prop: 'totalNum',
      type: 'number',
      input: (value) => {
        // 当落货总数变化时，自动获取查货标准
        if (value > 0) {
          const licZcStore = useLicZcStore()
          licZcStore.getInspectionStandardData()
        }
      },
    },
    {
      label: '查货数量',
      prop: 'checkNum',
      type: 'number'
    },
    {
      label: '接受数量',
      prop: 'accNum',
      type: 'number',
      disabled: true, // 接受数量始终不可编辑
    },
    {
      label: '不接受数量',
      prop: 'disAccNum',
      type: 'number',
      disabled: true, // 不接受数量始终不可编辑
    },
    {
      label: '颜色',
      prop: 'color',
      slot: 'color'
    },
    {
      label: '主唛标准',
      prop: 'standard1',
      slot: 'standard1',

    },
    {
      label: '洗水唛标准',
      prop: 'standard2',
      slot: 'standard2',

    },
    {
      label: '吊牌标准',
      prop: 'standard3',
      slot: 'standard3',

    }
  ]
}

export const licSqSaveFormOption = {
  // 基本资料配置
  baseFormConfig: {
    labelSpan: 12,
    valueSpan: 12,
    showHeader: true,
    disabled: true,
    headerConfig: {
      labelText: '字段',
      valueText: '内容',
    },
    columns: [
      {
        label: '款号',
        prop: 'bc_pono',
        disabled: true,
      },
      {
        label: '联营类型',
        prop: 'lic_type',
        type: 'select',
        dicData: [
          { label: '联营业务', value: 0 },
          { label: '联营款', value: 1 }
        ],
        disabled: true,

      },
      {
        label: '中/尾期',
        prop: 'bc_qs',
      },
      {
        label: '出货批次',
        prop: 'batchNo',
      },
      {
        label: '查货次数',
        prop: 'bc_num',
      },
      {
        label: '查货日期',
        prop: 'bc_date',
      },
    ],
  },
  // 详细资料配置
  detailFormConfig: {
    labelSpan: 12,
    valueSpan: 12,
    showHeader: true,
    headerConfig: {
      labelText: '检查项目',
      valueText: '检查结果',
    },
    columns: [
      {
        label: '查货标准',
        prop: 'checkScrit',
        disabled: true,
      },
      {
        label: '落货总数',
        prop: 'totalNum',
        type: 'number',
        disabled: true,
      },
      {
        label: '查货数量',
        prop: 'checkNum',
        type: 'number',
        disabled: true,
      },
      {
        label: '接受数',
        prop: 'accNum',
        type: 'number',
        disabled: true,
      },
      {
        label: '不接受数',
        prop: 'disAccNum',
        type: 'number',
        disabled: true,
      },
      {
        label: '颜色',
        prop: 'color',
        disabled: true,
      },
    ],
  },
  // 问题跟进配置
  problemFormConfig: {
    labelSpan: 12,
    valueSpan: 12,
    showHeader: true,
    headerConfig: {
      labelText: '问题类型',
      valueText: '问题描述',
    },
    columns: [
      {
        label: '问题及跟进',
        prop: 'foreign',
        type: 'textarea',
        disabled: true,
      },
    ],
  },
  // 查货结果选项
  resultOptions: [
    { label: '接受', value: '1' },
    { label: '不接受', value: '2' },
    { label: '不适用', value: '0' },
    { label: '联营商选择不上架', value: '3' },
  ],
}