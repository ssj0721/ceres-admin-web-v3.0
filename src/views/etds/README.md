# ETDS 模块文档

## 联营商自查批量导入 (licZcPldr)

### 开发日志

#### 2024-03-xx

1. 完成基础界面迁移
   - 完成所有静态页面内容
   - 替换所有 uni-app 组件为 Element Plus 组件
   - 统一使用 custom-button 样式
   - 应用项目 scss 变量 在src\styles\variables.module.scss下
   - 将script setup 放在template前面

### 样式严格规范

- 完成所有静态页面内容
- 替换所有 uni-app 组件为 Element Plus 组件
- 统一使用 custom-button 样式
- 应用项目 scss 变量 在src\styles\variables.module.scss下
- 将script setup 放在template前面

#### 2024-03-xx

2. 添加基础交互功能
   - 实现图片选择和预览功能
     - 使用原生 input[type="file"] 实现图片选择
     - 使用 URL.createObjectURL 创建预览
     - 实现图片删除功能
   - 实现图片名称生成功能
     - 支持普通图片名称生成
     - 支持疵点图片名称生成
     - 添加输入验证
   - 实现导出功能基础框架
     - 添加日期选择验证
     - 添加成功反馈

#### 2024-03-xx (最新)

3. 优化界面样式
   - 优化图片预览区域布局
     - 改用 flex 布局替代 grid 布局
     - 实现自适应5列布局
     - 优化图片间距和对齐方式
   - 优化弹窗样式
     - 统一弹窗样式与系统规范
     - 优化弹窗标题、内容和底部样式
     - 改进表单布局和间距
   - 细节调整
     - 优化图片预览容器的间距
     - 统一使用scss变量控制样式

#### 2024-03-xx (最新)

4. 联营商自查功能迁移
   - 完成表格配置文件创建
     - 实现表单配置（搜索条件）
     - 实现表格配置（列定义）
   - 完成基础页面结构搭建
     - 实现搜索表单区域
     - 实现表格展示区域
     - 实现分页功能
   - 待实现功能
     - 查询功能对接
     - 导出功能实现
     - 查看/送审/审阅/预览功能实现

### 需求说明

将原uni-app系统的联营商自查批量导入功能迁移到Vue3版本，主要包括以下要求：

1. 遵循Vue3组合式API写法
2. 使用Element Plus替代uni-app的组件
3. 使用项目定义的scss变量（来自variables.module.scss）
4. 统一使用custom-button类作为按钮样式
5. 所有的表格使用@/components/etds/ZcDetailsForm

### 功能模块

#### 1. 基础布局 ✅

- 使用container和second-main-container作为基础布局容器
- 实现整体页面的居中对齐和样式

#### 2. 操作区域 ✅

- 文件操作按钮组（选择文件、EXCEL模版、导出自查数据、提交）
- 文件信息展示
- 选择图片按钮

#### 3. 图片命名规则说明 ✅

- 规则说明文本展示
- 重要提示和警告信息样式区分

#### 4. 输入区域 ✅

- 合同号输入框
- 疵点输入框
- 生成按钮
- 生成的图片名称列表展示

#### 5. 图片预览区域 ✅

- 图片网格布局
- 图片预览功能
- 删除功能
- 图片信息展示（名称、大小）

#### 6. 导出自查数据弹窗 ✅

- 日期范围选择
- 合同号输入
- 导出功能

#### 7. 联营商自查功能 ⚡

- [x] 基础页面结构
- [x] 搜索表单配置
- [x] 表格配置
- [ ] 数据接口对接
- [ ] 业务功能实现

### 组件替换对照表

| uni-app组件 | Element Plus组件 |
|------------|-----------------|
| u-button | el-button |
| u-input | el-input |
| u-icon | el-icon |
| u-calendar | el-date-picker |
| u-popup | el-dialog |
| u-toast | el-message |

### 样式变量使用

使用variables.module.scss中定义的变量：

- 间距：$container-margin, $container-base-padding-*
- 颜色：$neutral-color-*, $theme-color-*
- 字体：$font-size-*
- 圆角：$border-radius-*
- 阴影：$shadow-*

### 待完成功能

1. ~~文件上传功能实现~~ (进行中)
2. ~~图片上传功能实现~~ (基础功能已完成)
3. 各类交互功能的具体实现
   - [x] 图片选择和预览
   - [x] 图片名称生成
   - [x] 导出功能基础框架
   - [ ] 文件上传
   - [ ] 后端接口对接
4. 响应式布局优化

### 注意事项

1. 所有按钮统一使用custom-button类
2. 图片上传相关功能已完成基础实现
3. 响应式布局相关的样式暂不处理
4. 目前使用的是前端模拟数据，后续需要对接实际接口
5. 图片预览使用了 Element Plus 的 el-image 组件，支持点击放大预览
6. 联营商自查功能使用了 Element Plus 的表格组件，支持以下特性：
   - 多选功能
   - 排序功能
   - 自定义列模板
   - 分页功能
   - 数据加载动画

# 联营商自查功能开发文档

## 开发日志

### 2024-03-xx 自查报告页面内容迁移

1. 页面结构调整
   - 保留原有的顶部导航栏设计
   - 在 content 区域实现详细的自查报告信息展示
   - 使用 avue-form 替代原有的表单组件

2. 数据展示区域
   - 订单状态栏：显示送审状态、出货批次、中尾期、计划时间
   - 订单基础信息：合同号、授权商、联营业务类型等
   - 详细表单信息：查货类型、授权商、品牌等字段
   - 写报告按钮

1. 路由结构调整
   - 将写报告页面从 licHomePage 子路由调整为独立路由
   - 优化路由跳转逻辑
   - 保持参数传递完整性

   ```js
   // 表单数据结构
   const formData = {
     pono: '',            // 合同号
     factName: '',        // 授权商
     pduName: '',         // 品牌
     custCode: '',        // 客户
     styleNo: '',         // 款号
     styleDesc: '',       // 款式描述
     checkStandard: '',   // 检查标准
     // ... 其他字段
   }

   // 订单状态数据结构
   const orderInfo = {
     bcBatchNo: '',       // 出货批次
     bcNum: '',           // 查货数量
     sconfirm: '',        // 送审状态
     pono: '',           // 合同号
     // ... 其他字段
   }
   ```

1. 底部 Tabs 导航栏样式调整
   - 固定在页面底部
   - 背景色设置为 #7996F8
   - 文字颜色设置为 #F5F7FA
   - 实现五个 tab 项均分布局
   - 添加激活状态白色下划线

### 2024-03-xx 查货信息页面迁移

1. ZcDetailsForm 组件迁移
   - 使用 Element Plus 的 Grid 系统替代原有的响应式类
     - 移除 col-md 等 Bootstrap 风格的类
     - 使用 el-row 和 el-col 组件实现布局
     - 简化配置，使用统一的 span 值控制列宽
   - 表单组件替换
     - 使用 el-input 替代原生 input
     - 统一输入框高度为 32px
     - 保持禁用状态样式一致性
   - 样式规范调整
     - 使用项目定义的阴影变量
     - 统一边框和圆角样式
     - 调整内边距和间距
   - 配置项简化
     - 移除复杂的响应式配置
     - 保持原有的插槽功能
     - 保持原有的数据处理逻辑

2. 使用示例

```js
const formConfig = {
  labelSpan: 12,        // 标签列宽度
  valueSpan: 12,        // 值列宽度
  showHeader: true,     // 是否显示表头
  headerConfig: {
    labelText: '字段',
    valueText: '内容'
  },
  columns: [
    {
      label: '查货标准',
      prop: 'checkScrit',
      type: 'select',
      disabled: true
    },
    // ... 其他列配置
  ]
}
```

### 前端界面要求

- 所有uni-app的组件使用elment-plus的代替
- 背景颜色使用#F5F7FA
- 涉及到表单的使用avue，并在./option文件中完全按照原系统的prop名称来配置表单的option
- 先不需要实现后端接口，可以生命函数用todo标记

### 待实现功能

2. 数据管理优化
   - 使用 Pinia store 管理表单数据
   - 实现计算属性双向绑定
   - 添加响应式布局支持

### 2024-03-xx 查货信息页面优化

1. 图片上传功能优化
   - 替换 el-upload 为原生文件选择实现
   - 使用 URL.createObjectURL 创建预览
   - 优化图片预览和删除功能
   - 添加资源释放处理

2. 疵点列表布局优化
   - 优化单行布局，减少空白空间
   - 使用 el-row 和 el-col 实现响应式布局
   - 统一控件大小为 small
   - 优化图片预览区域样式

3. 表单交互优化
   - 使用 el-input-number 替代普通输入框
   - 优化备注输入框宽度
   - 统一按钮样式使用 custom-button
   - 改进删除按钮位置和样式

4. 性能优化
   - 添加图片资源的自动释放
   - 优化图片预览组件的条件渲染
   - 改进内存管理，防止内存泄漏

### 2024-03-xx 问题跟进页面迁移

1. licZcProblem 组件迁移
   - 使用 Element Plus 组件替换 uni-app 组件
   - 实现响应式布局
   - 保持与原有功能一致
   - 使用项目统一的样式变量

2. 样式优化
   - 统一使用项目 scss 变量
   - 优化移动端适配
   - 改进文本域交互体验
   - 保持与系统风格统一

### 2024-03-xx 保存页面迁移

1. 基础结构迁移
   - 使用 Element Plus 组件替换 uni-app 组件
   - 实现表单配置的迁移
   - 保持原有的业务逻辑不变
   - 优化页面布局和样式

2. 功能模块迁移
   - 查货结果选择
     - 使用 el-radio-group 替代 u-radio-group
     - 保持原有的选项和逻辑
   - 状态信息展示
     - 使用 el-row 和 el-col 实现布局
     - 优化状态项的样式
   - 操作按钮
     - 统一使用 custom-button 样式
     - 实现存档、取回、送审功能
   - 表单展示
     - 使用 ZcDetailForm 组件展示各类信息
     - 实现疵点的自定义展示和输入
     - 优化表单布局和间距

3. 样式优化
   - 使用项目定义的 scss 变量
   - 优化各个区域的间距和对齐
   - 统一按钮和输入框的大小
   - 改进表单的视觉层次

4. 数据管理
   - 使用 Pinia store 管理状态
   - 实现表单数据的双向绑定
   - 优化数据更新逻辑
   - 添加必要的数据验证

## 项目说明

### 目录结构

### 2024-03-xx 开始迁移后端接口

#### licHomepage/index.vue

1. 联营商自查相关接口迁移状态
   - [x] `GET_LICZC_REPORT`: '/etdsLicZcReport/getLicZcCheckReports' - 已完成
   - [x] `GET_LICZC_ROIDSTEP`: '/etdsLicZcReport/getLicZcRoidStep' - 已完成
   - [x] `GET_LICZC_CUSTCODE`: '/etdsLicZcReport/getlicCustCodeList1' - 已完成
   - [x] `GET_LICZC_CODELIST3`: '/etdsLicZcReport/getlicCodeList3' - 已完成
   - [x] `GET_LICZC_PORTIDLIST1`: '/etdsLicZcReport/getlicPortIdList1' - 已完成
   - [x] `GET_TABLE`: '/etdsLicZcReport/getReport1' - 已完成

2. 接口调用优化完成
   - [x] 统一使用 request 方法进行接口调用
   - [x] 保持原有的请求参数格式
   - [x] 统一错误处理机制
   - [x] 接口命名规范化

3. 数据存储迁移完成
   - [x] 将 uni.getStorageSync 替换为 localStorage
   - [x] 保持原有的数据结构和键名不变
   - [x] 'storage_key_etds' 数据结构保持一致

### 2024-03-xx 联营商自查页面接口迁移完成

1. 联营商自查列表页面接口迁移完成
   - [x] 替换 uni.getStorageSync 为 localStorage.getItem 并解析 JSON
   - [x] 实现查询数据方法 fn_getdata，正确处理参数和调用 getLicZcReport 接口
   - [x] 实现获取查货次数方法 fn_getZcRoid，调用 getLicZcRoidStep 接口
   - [x] 实现获取客户列表方法 fn_getLicCustCodeList，调用 getlicCustCodeList1 接口
   - [x] 实现获取联营商列表方法 fn_getLicCodeList，调用 getlicCodeList3 接口
   - [x] 实现获取口岸/仓库列表方法 fn_getLicPortIdList，调用 getlicPortIdList1 接口
   - [x] 实现预览报表方法 handleShowReport，调用 getReport1 接口
   - [x] 实现送审功能，调用 licZcStore 中的 handleSendAudit 方法

2. 数据处理优化
   - [x] 添加错误处理和加载状态管理
   - [x] 优化参数处理逻辑，保持与原系统一致
   - [x] 使用 Element Plus 的消息提示替代 uni-app 的 Toast
   - [x] 使用 Vue Router 替代 uni.navigateTo 进行页面导航

3. 后续优化计划
   - [ ] 添加数据缓存机制，减少重复请求
   - [ ] 实现批量审阅功能
   - [ ] 优化表格的排序和筛选功能
   - [ ] 完善报表预览页面
