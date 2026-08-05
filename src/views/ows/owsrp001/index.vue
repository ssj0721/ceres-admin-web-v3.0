<template>

  <div class="container">
    <mybottons :show-list="['check']" @handleCheck="exportToExcel" />
    <div class="second-main-container">
      <avue-form
        v-model="form"
        :option="option"
        @submit="validateAndSubmit"
        @reset-change="closeFrame"
      >
        <!-- <template #menu-form>
        <el-button type="primary" @click="exportToExcel">查询并导出</el-button>
      </template> -->
      </avue-form>
    </div>
    <div v-if="frameShow" class="po-frame">
      <iframe :src="frame_url" width="100%" height="550px" frameborder="0">
      </iframe>
      <!-- {{ params }}
      {{ frame_url }} -->
    </div>
  </div>
</template>
<script>
import { owsgoodsDataOptions } from './option';
import {
  goodsQuery,
  queryPogoods,
  submitToExcel,
  queryTempTest,
} from '@/api/owsrp001';

import { ElLoading } from 'element-plus';
export default {
  name: 'PoReport',
  components: {},
  mixins: [],
  props: {},
  data () {
    return {
      form: {
        cmp_id: 'E', // 联营商代号
        bnd_id: '', // 数字头
        col_id: '', // 颜色
        siz_id: '', // 尺码
        itemcode: '', // 联营款号
        ver: 1, // 版本
      },
      orgId: 0, // 公司号，不同的联营商 登录信息中的userInfo获取
      color_list: [],
      cmp_list: [], // 联营商代号
      po_list: [], // itemcode 联营款号
      size_list: [],
      bnd_list: [],
      frame_url: '', // finereport url
      test_url: 'http://localhost:8075/webroot/decision/view/report?viewlet=',
      base_url:
        'https://gsreport.gsitcloud.com/report/decision/view/report?viewlet=jwposys%252Fpo%25E5%2585%25A5%25E5%25BA%2593%25E5%25B7%25AE%25E5%25BC%2582%25E8%25A1%25A8%25E6%25AD%25A3%25E5%25BC%258F.cpt',
      temp: [],
      goodsData: [],
      option: {},
      frameShow: false,
      params: {},
    };
  },
  async mounted () {
    /**
     * @description 2024.07.19 由于新的需求，所以之前写的很多方法都注释掉了
     */

    // await this.getEppoGoodsData();
    this.initOption();
  },

  /** @description 2024.07.19 由于新的需求，所以之前写的很多方法都注释掉了 以下很多代码是用不上的，但是以后说不定用的上*/
  methods: {
    /**
     * @description 获取po入仓的数据，如果需要使用字典的话
     */
    snakeToCamel (snakeCaseString) {
      // 判断有无下划线，有则转换成小驼峰，无则返回原字符串
      if (snakeCaseString.indexOf('_') !== -1) {
        const res = snakeCaseString.replace(/(_\w)/g, (str) =>
          str[1].toUpperCase()
        );
        return res;
      } else {
        return snakeCaseString;
      }
    },
    /**
     * @description 验证表单并提交获取finereport的url
     */
    async validateAndSubmit (form, done) {
      this.frameShow = true;
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });

      // 处理itemcode，如果有多个itemcode，以逗号,空格，换行符分割，
      // 变成itemcodelist，itemcode置空，如果只有一个itemcode，itemcodelist置空
      let itemcode = this.form.itemcode;
      let itemcodelist = itemcode.split(/[,\n ]/);
      if (itemcodelist.length > 1) {
        itemcode = undefined;
      } else {
        itemcodelist = [];
      }
      // 款字头，如果输入多个，以逗号,空格，换行符分割
      let bnd_id = this.form.bnd_id;
      let bnd_list = this.form.bnd_id.split(/[,\n ]/);
      if (bnd_list.length > 1) {
        bnd_id = undefined;
      } else {
        bnd_list = [];
      }
      // 向后端传递临时表的params
      let params = {
        itemcode: itemcode,
        itemcodelist: itemcodelist,
        bnd_id: bnd_id,
        bnd_list: bnd_list,
        cmp_id: this.form.cmp_id,
        orgId: this.orgId,
      };
      this.params = params;
      // queryPogoods(params).then((res) => {
      //   const tempTable = res.data.result.tempTable;
      //   this.frame_url = `${this.base_url}&tempTable=${tempTable.replace(
      //     /#/g,
      //     '%23'
      //   )}&cmp_id=${this.form.cmp_id}&orgId=${this.orgId}&itemcode=${
      //     itemcodelist.length ? itemcodelist : itemcode
      //   }&bnd_id=${bnd_list.length ? bnd_list : bnd_id}`;
      // })
      const temp = await queryTempTest(params);
      console.log('temp temmp!!', temp);
      loading.close();
      done();
    },
    /**
     * @description 关闭frame
     */
    closeFrame (form, done) {
      this.frameShow = false;
      done();
    },
    /**
     * @description 初始化avue-form的option
     */
    initOption () {
      this.option = owsgoodsDataOptions;
      // 获取联营商的组织id，在登录信息中获取
      this.orgId = this.$store.getters.userInfo.orgId;
    },
    /**
     * @description 导出到excel
     */
    async exportToExcel () {
      try {
        ElLoading.service({
          lock: true,
          text: '导出中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        let itemcode = this.form.itemcode;
        let itemcodelist = itemcode.split(/[,\n ]/);
        if (itemcodelist.length > 1) {
          itemcode = undefined;
        } else {
          itemcodelist = [];
        }
        // 款字头，如果输入多个，以逗号,空格，换行符分割
        let bnd_id = this.form.bnd_id;
        let bnd_list = this.form.bnd_id.split(/[,\n ]/);
        if (bnd_list.length > 1) {
          bnd_id = undefined;
        } else {
          bnd_list = [];
        }
        // 向后端传递临时表的params
        let params = {
          itemcode: itemcode,
          itemcodelist: itemcodelist,
          bnd_id: bnd_id,
          bnd_list: bnd_list,
          cmp_id: this.form.cmp_id,
          orgId: this.orgId,
        };
        console.log('params!!', params);
        const res = await submitToExcel(params);
        // console.log('excel111!!!!', res.data.result.body)
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
          link.setAttribute('download', 'po入库差异表.xls');
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(url);
        }
        ElLoading.service().close();
      } catch (error) {
        ElLoading.service().close();
        console.error('导出失败', error);
        throw new Error('导出Excel失败，请稍后重试');
      }
    },
  },
};
</script>
<style lang="scss" scoped>

.container{
  // padding:.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.second-main-container {
  width: 95%;
  background: $neutral-color-1;
  display: flex;
  flex-direction: column;
  margin: $container-margin;
  padding: $container-base-padding-2;
  border-radius: $border-radius-medium;
  .el-form .el-form-item {
    margin-bottom: 0px;
  }
  box-shadow: $shadow-1;
}

</style>
