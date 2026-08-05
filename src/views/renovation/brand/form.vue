<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="80px">
        <el-form-item label="名称" prop="brandName">
          <el-input
            v-model="form.brandName"
            maxlength="20"
            placeholder="请输入品牌名称"
          />
        </el-form-item>
        <el-form-item label="logo">
          <Upload
            ref='uploadRef'
            :multiple="false"
            :action="uploadUrl"
            :limit="1"
            :maxSize="5"
            :accept="accept"
            :file-list="imgs"
            :data="uploadSetting.data"
            :fileList="fileList"
            @getfileId="getfileId"
            @delfileId="delfileId"
          ></Upload>
          <!-- <ImageUpload v-model:brandLogo="form.brandLogo" :limit="1" /> -->
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleSubmit"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { uploadUrl } from '@/utils/request'
import ImageUpload from '@/components/ImageUpload/index.vue'
import Upload from '@/components/Upload/index.vue'
import { addBrand, updateBrand } from '@/api/renovation'
import { ref, toRefs, watch, reactive } from 'vue';
import { getToken } from '@/utils/auth'
const Form = function () {
  this.id = null
  this.brandLogo = null
  this.brandName = null
  this.fileid = []
  this.image = []
//   this.imgs = [{
//   url:"",
//   imgPath:""
// }]
}
const props = defineProps({
  item: {
    // eslint-disable-next-line vue/require-prop-type-constructor
    type: Object || null,
    default: () => ({}),
  }
})
const { item } = toRefs(props)
const loading = ref(false)
const title = ref('新增品牌')
const formRules = {
  brandName: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' },
    { max: 20, message: '品牌名称应小于20个字符', trigger: 'blur' },
  ],
  brandLogo: [
    { required: true, message: '请上传品牌logo', trigger: 'blur' },
  ],
}
let imgs = ref([{
  url:"",
  imgPath:"",
  fileid:""
}])
const form = ref({
  fileid:[]
})
const dialogVisible = ref(false)
watch(item, () => {
  console.log('item.value',item.value);
  fileList.value = []
  if (item.value.id) {
    console.log('进入编辑了');
    form.value = JSON.parse(JSON.stringify(item.value))
    let fileids = []
    fileids.push(form.value.fileid)
    form.value.fileid = fileids
    console.log('打开弹窗后的form.value',form.value,imgs.value);
    imgs = ref([{
      url:"",
      imgPath:"",
      fileid:""
    }])
    for (let i = 0; i < imgs.value.length; i++) {
      console.log('imgs.value[i]',imgs.value[i]);
      imgs.value[i].url = form.value.image;
      imgs.value[i].imgPath = form.value.image;
      imgs.value[i].fileid = form.value.fileid;
      fileList.value = imgs.value;
    }
    // imgs.value.url = form.value.image
    // imgs.value.imgPath = form.value.image
    console.log('fileList.value----imgs.value',fileList.value , imgs.value);
    // fileList.value = imgs.value;
    if (form.value.id !== null && form.value.id !== undefined) {
      title.value = '修改品牌'
    } else {
      title.value = '新增品牌'
    }
  } else {
    console.log('进入新增了');
    form.value = new Form()
  }
})
const formRef = ref()

//upload上传
let uploadSetting = reactive({
  headers: {
    'Authorization-admin': getToken(),
    tenant: 'MDAwMA=='
  },
  data: {
    folderId: 1,
  }
})
// const alterFileList = ref([]) //存放fileid
const fileList = ref([])
// for (let i = 0; i < [...form.value.image].length; i++) {
//   form.value.image[i].url = form.value.image[i].imgPath;
//   fileList.value = form.value.image;
// }
const getfileId = (val) =>{
  // alterFileList.value.push(val)
  form.value.fileid=[]
  form.value.fileid.push(val)
  console.log("getfileId",form.value.fileid)
}
const delfileId = (val) =>{
  form.value.fileid = val
  console.log("delfileId",form.value.fileid,val)
}
//upload上传

function open () {
  dialogVisible.value = true
}
function handleSubmit () {
  formRef.value.validate(async (val) => {
    loading.value = true
    if (!val) return ElMessage.warning('请完善表单')
    console.log('新增和修改的参数',form.value);
  // if(form.value.fileId.length==0){
  //   return ElMessage.warning('图片还在上传')
  // }
    if (form.value.id != null) {
      await updateBrand(form.value)
    } else {
      await addBrand(form.value)
    }
    ElMessage.success('操作成功')
    loading.value = false
    handleClose()
  })
}
const $emit = defineEmits(['confirm'])
defineExpose({ open })
function handleClose () {
  $emit('confirm', form)
  formRef.value.resetFields()
  dialogVisible.value = false
  fileList.value = []
  form.value.fileid=[]
}
</script>
