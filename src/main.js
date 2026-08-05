import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/styles/index.scss'; // global css
import * as echarts from 'echarts'
import 'element-plus/dist/index.css'


import App from './App.vue'
import router from './router'
import store from './store'

import Icon from '@/components/Icon/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'virtual:svg-icons-register'

import '@/permission'; // permission control

import Avue from '@smallwei/avue'



import '@smallwei/avue/lib/index.css'
import axios from 'axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//组件全局
import datePicker from '@/components/date/date-picker.vue'
import DroplistControl from '@/components/control/droplist-control.vue'
import iRetailDroplistControl from '@/components/control/droplist-control-iretail.vue'
import DroplistControlExt from '@/components/control/droplist-control-ext.vue'
import xvuefileimport from "@/components/control/file-import.vue"

import initView from "@/utils/viewUtil";
import dlg from "@/utils/dialog";
import excel from "@/utils/util";
import { httputil } from '@/utils/util';
import xiframe from "@/components/iframe/x-iframe.vue"
import selectAll from "@/components/Select/index.vue"

import i18n from "@/lang"
import dateutil from "@/utils/dateutil"

import mybottons from '@/components/mybottons/index.vue'
import horizontalScroll from 'el-table-horizontal-scroll'
import sysfileUpload from './components/control/sysfile-upload.vue';
import fileUploadDialog from './components/dialog/fileUpload-dialog.vue';
import Edit from './components/product/Edit/index.vue'
import Import from './components/product/Import/index.vue'
import UpdateImport from './components/product/updateImport/index.vue'
import OldImport from './components/product/OldImport/index.vue'
import Export from './components/product/Export/index.vue'
import easySelectTable from "@/components/SelectTable/easy-select-table.vue";
import selectTable from "@/components/SelectTable/select-table.vue";
import CancelApply from './components/product/CancelApply/index.vue';
import datePickerGyl from './components/date/datePickerGyl/index.vue'
import ShowErrorList from './components/product/ShowErrorList/index.vue';
import yearSelect from './components/date/year-select.vue';
import AppealBack from './components/product/AppealBack/index.vue';
import BackToTop from './components/backToTop/index.vue';

const app = createApp(App)
const pinia = createPinia()
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.config.globalProperties.$echarts = echarts
// app.use(ElementPlus)
app.use(ElementPlus, {
  i18n: (key, value) => i18n.t(key, value)
})

app.use(initView)
app.use(dlg)
app.use(excel)
app.use(httputil)

app.use(Avue)
app.use(Avue, { axios })

app.use(router).use(store).use(i18n).component('icon', Icon).mount('#app')

//组件全局使用
app.use(datePicker)
// app.component("avue-datePicker", datePicker)
app.component("datePicker", datePicker)
app.use(DroplistControl)
app.component("avue-DroplistControl", DroplistControl)
app.component("DroplistControl", DroplistControl)
app.component("iRetailDroplistControl", iRetailDroplistControl)
app.use(sysfileUpload)
app.component("Sysfile-Upload", sysfileUpload)
app.use(fileUploadDialog)
app.component("file-upload-dialog", fileUploadDialog)
app.component("DroplistControlExt", DroplistControlExt)
app.use(xvuefileimport)
app.component("xvue-file-import", xvuefileimport)
app.use(xiframe)
app.component("x-iframe", xiframe)
app.use(selectAll)
app.component("selectAll", selectAll)
app.use(easySelectTable)
app.component("easySelectTable", easySelectTable)
app.use(selectTable)
app.component("selectTable", selectTable)


app.use(dateutil)
app.use(pinia)
app.use(mybottons)
app.component("mybottons", mybottons)

app.use(Edit)
app.component("EditDialog", Edit)

app.use(Import)
app.component("ImportDialog", Import)

app.use(UpdateImport)
app.component("UpdateImportDialog", UpdateImport)

app.use(OldImport)
app.component("OldImportDialog", OldImport)

app.use(Export)
app.component("ExportDialog", Export)

app.use(CancelApply)
app.component("CancelApplyDialog", CancelApply)

app.use(datePickerGyl)
app.component("datePickerGyl", datePickerGyl)

app.use(ShowErrorList)
app.component("ShowErrorDialog", ShowErrorList)

app.use(yearSelect)
app.component("yearSelect", yearSelect)

app.use(AppealBack)
app.component("AppealBackDialog", AppealBack)

app.use(BackToTop)
app.component("BackToTop", BackToTop)

//视口下方固定出现滚动条
app.use(horizontalScroll)



