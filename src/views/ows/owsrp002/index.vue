<template>
  <div class="container">
    <!-- <el-button type="primary" @click="query()">
      查询
    </el-button> -->
    <el-button type="primary" @click="exportToExcel">
      导出为Excel
    </el-button>
    <div style="margin: 0px 0px 10px 0px"></div>
    <avue-form
      ref="form"
      v-model="queryFormData"
      :option="formOption"
    />
    <div v-if="showIframe" class="po-frame">
      <iframe
        :src="frame_url"
        width="100%"
        height="450px"
        frameborder="0"
      >
      </iframe>
    </div>

  </div>
</template>
<script>
import { formOption } from './option';
import { query, submitToExcel } from '@/api/owsrp002';
import { ElButton, ElLoading } from 'element-plus';
export default {
  name: '',
  components: {},
  data () {
    return {
      queryFormData: {},
      formOption: formOption,
      showIframe: true,
      params: {},
      bndList: []
    };
  },
  computed: {},
  watch: {},
  mounted () {},
  methods: {
    query () {
      this.showIframe = false;
      let itemcode = this.queryFormData.itemcode;
      let itemcodelist = itemcode.split(/[,\n ]/);
      if (itemcodelist.length > 1) {
        itemcode = undefined;
      } else {
        itemcodelist = [];
      }
      let bndid = this.queryFormData.bndid
      let bnd_list = this.queryFormData.bndid.split(/[,\n ]/);
      if (bnd_list.length > 1) {
        bndid = bnd_list
      } else {
        bnd_list = [];
      }
      let params = {
        itemcode: itemcode,
        itemcodelist: itemcodelist,
        bndid,
      };
      this.params = params
      // query(params).then((res) => {
      //   this.showIframe = true;
      //   let tempTable = res.data.result.tempTable;
      //   // console.log('tempTable rp002!!', tempTable);
      //   // this.frame_url = `http://localhost:8075/webroot/decision/view/report?viewlet=PO_DA_Report.cpt&tempTable=${tempTable.replace(
      //   //   /#/g,
      //   //   "%23"
      //   // )}`;
      //   this.frame_url = `https://gsreport.gsitcloud.com/report/decision/view/report?viewlet=jwposys%252FPO_DA_Report.cpt&tempTable=${tempTable.replace(
      //     /#/g,
      //     '%23'
      //   )}`;
      // });
    },
    /**
    * @description: 导出为Excel，这里走的是easyPoi
    */
    async exportToExcel () {
      ElLoading.service({
        lock: true,
        text: '导出中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      let itemcode = this.queryFormData.itemcode;
      let itemcodelist = itemcode.split(/[,\n ]/);
      if (itemcodelist.length > 1) {
        itemcode = undefined;
      } else {
        itemcodelist = [];
      }
      let bndid = this.queryFormData.bndid
      let bnd_list = this.queryFormData.bndid.split(/[,\n ]/);
      if (bnd_list.length > 1) {
        bndid = bnd_list
      } else {
        bnd_list = [];
      }
      let params = {
        itemcode: itemcode,
        itemcodelist: itemcodelist,
        bndid,
      };
      this.params = params
      const res = await submitToExcel(params);
      if (res.data.body) {
        const base64String = res.data.body;
        const binaryString = atob(base64String);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', 'PO/订仓数/实际入仓数对比报表.xls');
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      }
      ElLoading.service().close();
    }
  },
};
</script>
<style lang="scss" scoped>
.po-frame {
  width: 100%;
  height: 100%;
}
</style>
