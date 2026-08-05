import { init } from 'echarts';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  getGcZcCheckReportGcCheckData,
  getGcDetailsData,
  getGcProblemData,
  getGcUploadData,
} from '@/api/etds';

export const useGcZcStore = defineStore('counter', () => {
  // State
  const GcCheckData = ref({
    bc_pono: '',
    bc_qs: '',
    bc_batchNo: '',
    bc_num: '',
    bc_date: '',
    bc_qs_name: '',
    bc_result: '',
    lic_type: '',
    lic_typename: '',
  });
  const GcDetailsList = ref([]);
  const GcDetailsData = ref({
    accNum: 0,
    checkNum: 0,
    checkScrit: '',
    color: '',
    disaAccNum: 0,
    totalNum: 0,
  });
  const GcProblem = ref({ bq_question: '' });
  const GcUploadData = ref([]);

  // Getters
  // const doubleCount = computed(() => count.value * 2)

  // Actions
  // 重置全部state
  function resetState () {
    GcCheckData.value = {
      bc_pono: '',
      bc_qs: '',
      bc_batchNo: '',
      bc_num: '',
      bc_date: '',
      bc_qs_name: '',
      bc_result: '',
      lic_type: '',
      lic_typename: '',
    };
    GcDetailsList.value = [];
    GcDetailsData.value = {
      accNum: 0,
      checkNum: 0,
      checkScrit: '',
      color: '',
      disaAccNum: 0,
      totalNum: 0,
    };
    GcProblem.value = { bq_question: '' };
    GcUploadData.value = [];
  }

  async function initState (oid) {
    await resetState();
    await initCheckData({ oid: oid });
    await initDetailsData({ oid: oid });
    await initProblemData({ oid: oid });
    await initUploadData({ oid: oid });
  }

  async function initCheckData (data) {
    const res = await getGcZcCheckReportGcCheckData(data);
    updateGcCheckData(res.data);
  }

  async function initDetailsData (data) {
    const res = await getGcDetailsData(data);
    updateGcDetailsData(res.data.formData);
    let defectList = res.data.defectList;
    if (defectList.length > 0) {
      for (let i = 0; i < defectList.length; i++) {
        // src1 = "" 的话赋值 src1 = null
        if (defectList[i].src1 === '') {
          defectList[i].src1 = null;
        }
        if (defectList[i].src2 === '') {
          defectList[i].src2 = null;
        }
        defectList[i].file1 = null;
        defectList[i].file2 = null;
        defectList[i]._status1 = 'initial'; // 表示这个数据是初始状态，后续改过就会变成add那些状态
        defectList[i]._status2 = 'initial'; // 表示这个数据是初始状态，后续改过就会变成add那些状态
      }
    } else if (defectList.length === 0) {
      defectList = [];
    }
    updateGcDetailsList(defectList);
  }

  async function initProblemData (data) {
    const res = await getGcProblemData(data);
    updateGcProblem(res.data);
  }

  async function initUploadData (data) {
    const res = await getGcUploadData(data);
    let uploadForm = res.data.map((item) => {
      return {
        preview: item.preview,
        name: '',
        size: item.size,
        file: null,
        path: item.path,
        oid: item.oid,
      };
    });
    updateGcUploadData(uploadForm);
  }

  // 更新GcCheckData
  function updateGcCheckData (data) {
    GcCheckData.value = data;
  }

  // 更新GcDetailsList
  function updateGcDetailsList (data) {
    GcDetailsList.value = data;
  }
  // 更新GcDetailsData
  function updateGcDetailsData (data) {
    GcDetailsData.value = data;
  }
  // 更新GcProblem
  function updateGcProblem (data) {
    GcProblem.value = data;
  }
  // 更新GcUploadData
  function updateGcUploadData (data) {
    GcUploadData.value = data;
  }

  return {
    // State
    GcCheckData,
    GcDetailsList,
    GcDetailsData,
    GcProblem,
    GcUploadData,
    // Getters

    // Actions
    resetState, // 重置state
    initState, // 初始化state
    updateGcCheckData, // 更新GcCheckData
    updateGcDetailsList, // 更新GcDetailsList
    updateGcDetailsData, // 更新GcDetailsData
    updateGcProblem, // 更新GcProblem
    updateGcUploadData, // 更新GcUploadData
  };
});
