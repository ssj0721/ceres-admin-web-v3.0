<template>
  <basic-container class="container">
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm028</div>
  <div class="pending">
    <!-- 搜索 -->
    <!-- <div class="formSearch"> -->
      <mybottons>
      <el-form ref="searchRef" :inline="true" :model="searchData">
        <el-form-item label="用户名" prop="search">
          <el-input
            v-model="searchData.search"
            maxlength="20"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item label="是否禁用" prop="state" size="large" style="width: 200px" clearable>
          <el-select v-model="searchData.state" placeholder="请选择">
            <el-option label="是" value="0" />
            <el-option label="否" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="add">新增用户</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="primary" @click="addMerchants">新增审款联营商</el-button>
        </el-form-item>
      </el-form>
    </mybottons>
    <!-- </div> -->
    <!-- 表格 -->
    <div class="second-main-container">
    <div class="tableBox">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        :header-cell-style="{ 'background': '#EEF3FF', 'color': '#333333' }"
        tooltip-effect="dark"
        :style="{ 'width': '100%' }"
        class="dataTable"
        v-horizontal-scroll="'always'"
        height="520"
      >
        <el-table-column label="用户id" width="100">
          <template #default="scope">{{ scope.row.merchantsUserId }}</template>
        </el-table-column>
        <el-table-column prop="username" label="联营商" />
        <!-- <el-table-column prop="password" label="密码" /> -->
        <el-table-column label="头像">
          <template #default="scope">
            <img v-if="scope.row.avatar!=''" height="80" width="80" :src="scope.row.avatar" alt srcset />
            <img v-else height="80" width="80" :src="headpic" alt srcset />
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="state" label="是否禁用">
          <template #default="scope">
            <span v-if="scope.row.state == 0">是</span>
            <span v-if="scope.row.state == 1">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <div class="btnList">
              <el-button link type="primary" @click="edit(scope.row)">编辑</el-button>
              <el-popconfirm title="确认删除？" @confirm="del(scope.row)">
                <template #reference>
                  <el-button type="danger" link>删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="searchData.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="searchData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>

    <!-- *************对话框开始************* -->
    <el-dialog
      v-model="addFormDialog"
      :title="userState ? '新增用户' : '修改用户'"
      width="30%"
      center
      :close-on-click-modal="false"
      @closed="onClosed"
    >
      <!-- 新增用户 -->
      <div>
        <el-form
          ref="formRef"
          :model="formData"
          label-width="80px"
          :rules="rules"
        >
          <!-- <el-form-item label="用户id" prop="merchantsUserId">
            <el-input
              v-model="formData.merchantsUserId"
              maxlength="20"
              placeholder="请输入用户id"
            />
          </el-form-item> -->
          <el-form-item label="联营商" prop="username">
            <el-select v-model="formData.username" placeholder="请选择联营商">
              <el-option
                v-for="item in usernames"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="密码" prop="password">
            <el-input
              v-model="formData.password"
              maxlength="20"
              placeholder="请输入密码"
            />
          </el-form-item> -->
          <el-form-item label="头像">
            <div class="upload-wrap">
              <!-- <el-upload
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :before-upload="beforeUpload"
                :on-remove="handleRemove"
                :on-change="fileChange"
                :headers="uploadSetting.headers"
                :data="uploadSetting.data"
                :file-list="formData.avatar"
                :limit="1"
                :accept="accept"
                :on-success="handleImageSuccess"
                :action="uploadUrl"
                :multiple="false"
              >
                <el-icon><Plus /></el-icon>
              </el-upload> -->
              <Upload
                ref='uploadRef'
                :multiple="false"
                :action="uploadUrl"
                :limit="1"
                :maxSize="5"
                :accept="accept"
                :file-list="formData.avatar"
                :data="uploadSetting.data"
                :fileList="fileList"
                :imagelist="imagelist"
                @getfileId="getfileId"
              ></Upload>
              <!-- <Sysfile-Upload
                :noneUploadBtn="noneUploadBtn"
                :multiple="false"
                :limit="1"
                :maxSize="5"
                :fileList="mainfileList"
                :auto-upload="true"
                accept="accept"
                :on-success="handleImageSuccess"
                :subPath="subPath"
                :on-remove="handleRemove"
              ></Sysfile-Upload> -->
            </div>
            <!-- <el-input
              v-model="formData.avatar"
              maxlength="20"
              placeholder="请输入头像"
            /> -->
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-if="phoneShow"
              :model-value="hidden(formData.phone, 3, 4)"
              maxlength="11"
              placeholder="请输入手机号"
              @focus="focusPhoneInput"
            />
            <el-input
              v-else
              ref="phoneCls"
              v-model="formData.phone"
              maxlength="11"
              clearable
              placeholder="请输入手机号"
            />
            <!-- <div @click="inputPhone" v-else class="newPhone">
                <span>{{ hidePhone(formData.phone) }}</span>
              </div> -->
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <!-- <el-input
              v-if="emailShow"
              :model-value="hidden(formData.email, 3, 4)"
              maxlength="40"
              placeholder="请输入邮箱"
              @focus="focusEmailInput"
            /> -->
            <el-input
              ref="emailCls"
              v-model="formData.email"
              maxlength="40"
              clearable
              placeholder="请输入邮箱"
            />
            <!-- <el-input v-model="formData.email" placeholder="请输入邮箱" /> -->
          </el-form-item>
          <el-form-item label="是否禁用" prop="state">
            <el-select v-model="formData.state" placeholder="请选择">
              <el-option label="是" :value="0" />
              <el-option label="否" :value="1" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="选择角色" prop="roleIds">
            <el-select
              v-model="formData.roleIds"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              />
            </el-select>
          </el-form-item> -->
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addFormDialog = false">取 消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="addForm_enter(formRef)">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="visible.image"
      :append-to-body="true"
      class="check-image-dialog"
      title="查看图片"
      center="center"
    >
      <img width="100%" :src="detailImage" alt />
    </el-dialog>
  </div>
  </basic-container>
</template>

<script setup>
import { ref, onBeforeMount, nextTick, reactive, shallowRef, toRefs } from 'vue'
// import Upload from '@/../../ceres-admin-web-v3.0/canvas/components/Upload/index.vue';
import Upload from '@/components/Upload/index.vue'
import {getfileid} from '@/api/file'
import { getToken } from '@/utils/auth'
import {
  getList,
  userAdd,
  roleGetall,
  userGetById,
  userUpdate,
  userDelete,
  getMerchants,
  getShenKuanMerchants
} from '@/api/merchants/merchantsList'
import { uploadUrl } from '@/utils/request'
import { ElLoading,ElMessage } from 'element-plus'
import headpic from '@/assets/images/avatar.png'

// const PhoneRule = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
const searchRef = ref(null)
const searchData = ref({
  search: '', // 搜索字段
  state: '', // 是否禁用 0-是 1-否
  page: 1, // 当前页
  pageSize: 10 // 每页记录数
})
let batchFileList = ref([]) //上传文件
let visible = reactive({
  image: false,
})
let detailImage = shallowRef('');
let uploadSetting = reactive({
  headers: {
    'Authorization-admin': getToken(),
    tenant: 'MDAwMA=='
  },
  data: {
    folderId: 1,
  }
})
let usernames = ref([])
// const props = defineProps({
//   form: {
//     type: Object,
//     default () {
//       return {}
//     },
//   },
// })
// let { form } = toRefs(props);

const accept = import.meta.env.VITE_ACCEPT
let form = []
const total = ref(1)
const tableLoading = ref(false)
const submitLoading = ref(false)
const tableData = ref([])
const userState = ref(1)
const formRef = ref(null)
const phoneCls = ref(null)
const emailCls = ref(null)
const formData = ref({
  merchantsUserId:'',
  username: '', // 昵称
  phone: '', // 电话
  password: '', // 密码
  email: '', // 邮箱
  state: 1, // 是否禁用 0-是 1-否
  roleIds: [], // 角色id
  avatar: [{
    url:'',
    imgPath:''
  }],
  code:'',//账号对应的code
  fileId:0
})
// el-upload里的file-list的属性值里面一定要有'url'为键名的键值对，这样点击编辑时才能看到图片。

for (let i = 0; i < formData.value.avatar.length; i++) {
  formData.value.avatar[i].url = formData.value.avatar[i].imgPath;
}

const addFormDialog = ref(false)
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  phone: [
    // { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
  ]
})
const roleList = ref([])
// const newPhone = ref('')
// const showPhone = ref(false)
const privacyTime = ref(0)
const phoneShow = ref(false) // 显示脱敏手机号
const emailShow = ref(false) // 显示脱敏邮箱
const alterFileList = ref([]) //存放fileid
const fileList = ref([])
const imagelist = ref([]) //用于清空组件imglist，解决imglist残留问题

onBeforeMount(() => {
  getAll(searchData.value)
  getRoleAll()
  privacyTime.value = localStorage.getItem('privacyTime')
})
// 方法集合
const focusEmailInput = () => {
  emailShow.value = false
  formData.value.email = ''
  // 自动获取焦点
  nextTick(() => {
    emailCls.value.focus()
  })
}
const focusPhoneInput = () => {
  phoneShow.value = false
  formData.value.phone = ''
  // 自动获取焦点
  nextTick(() => {
    phoneCls.value.focus()
  })
}
const handleSizeChange = (val) => {
  searchData.value.pageSize = val
  getAll(searchData.value)
}
const handleCurrentChange = (val) => {
  searchData.value.page = val
  getAll(searchData.value)
}

//没用
const getimglist = (val) =>{
  formData.value.avatar=[]
  for(let i=0;i<val.value.length;i++){
    const url =val.value[i].url
  // formData.value.avatar = url
  formData.value.avatar.push({
    imgPath: url,
    url: url
  })
  }
  console.log("getimglist",formData.value.avatar,val.value)
}

const getfileId = (val) =>{
  alterFileList.value.push(val)
  formData.value.fileId=val
  console.log("getfileId",alterFileList.value,formData.value.fileId)
}

// 头像
function handlePictureCardPreview (file) {
  console.log("图片地址",file)
  detailImage.value = file.imgPath
  visible.image = true
}
function handleImageSuccess (response) {
  console.log("accept---",import.meta.env.VITE_ACCEPT);
  console.log("formData.value.avatar",formData.value.avatar);
  console.log("成功response",response);
  const url = response.data.url
  // formData.value.avatar = url
  formData.value.avatar.push({
    imgPath: url,
    url: url
  })
}

// 文件状态改变时的钩子
// function fileChange (_file, _batchFileList) {
//   console.log("文件改变",_file, _batchFileList)
//   batchFileList.value=[]
//   batchFileList.value.push(_file.raw)
//   var date = new Date();
//   let year = date.getFullYear();
//   let month = (date.getMonth() + 1).toString().padStart(2, '0');
//   let subPath = "img/itemDraft/" + year+month;
//   console.log("subpath",subPath)
//   const formData2 = new FormData();
//   formData2.append('file', batchFileList.value[0])
//   formData2.append('subPath', subPath)
//   console.log("formData2---",formData2,batchFileList.value[0])
//   getfileid(formData2).then((res) => {
//       if (res.code === '') {
//         console.log('获取fileid成功的res',res);
//         ElMessage.success('获取fileid成功')
//       }
//       console.log();
//     })
// }

// 移除图片
function handleRemove (file) {
  // formData.value.avatar = [];
  console.log("图片移走了",file)
  const { uid } = file
  const urlIndex = formData.value.avatar.findIndex(x => x.uid === uid)
  formData.value.avatar.splice(urlIndex, 1)
}
function isImage(fileName) {
    return /\.(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIT|BMP)$/.test(fileName);
}
// 图片上传前对图片大小进行检测
const beforeUpload = (file) => {
  console.log("file",file);
  const fileSize = file.size;
  const Size = import.meta.env.VITE_IMAGE_SIZE;
  // 转换为字节进行比较
  const limitSize = Size * 1024 * 1024;
  console.log("limitSize",limitSize);
  if (fileSize > limitSize) {
    const message = `文件大小超过限制${Size}M，请重新选择`;
    ElMessage.warning(message);
    return false; // 取消上传操作
  }

  const acceptPromise = new Promise(function (resolve, reject) {
    // 从配置文件（.env.development）里获取最大最小像素值
    const imageMaxWidth = import.meta.env.VITE_MAX_WIDTH;
    const imageMaxHeight = import.meta.env.VITE_MAX_HEIGHT;
    const imageMinWidth = import.meta.env.VITE_MIN_WIDTH;
    const imageMinHeight = import.meta.env.VITE_MIN_HEIGHT;
    console.log("beforeUpload完成中");
  if (isImage(file.name)) {
    console.log("开始检测分辨率")
    let width = imageMaxWidth;
    let height = imageMaxHeight;
    let width2 = imageMinWidth;
    let height2 = imageMinHeight;
    let image = new Image();
    image.onload = function () {
      console.log("image.onload");
      let valid = width2 <= image.width && image.width<=width  && height2 <= image.height && image.height <= height;
      //let valid = image.width <=width && image.height <= height;
      if (!valid) {
        let width = imageMaxWidth;
        let height = imageMaxHeight;
        let width2 = imageMinWidth;
        let height2 = imageMinHeight;
        const message = `上传图片文件的需在分辨率${width2}x${height2}--${width}x${height}!`;
        // alert(message);
        ElMessage.warning(message);
        // return false; // 取消上传操作
      } 
      valid ? resolve() : reject();
    };
    image.src = URL.createObjectURL(file);
    console.log("beforeUpload已完成");
  }
})
  return acceptPromise;
}

// 查询
const search = () => {
  total.value = 1
  searchData.value.page = 1
  getAll(searchData.value)
}
// 重置
const reset = () => {
  searchData.value = {
    search: '', // 搜索字段
    state: '', // 是否禁用 0-是 1-否
    page: 1, // 当前页
    pageSize: 10, // 每页记录数
  }
  getAll(searchData.value)
}
// 新增用户
const add = () => {
  formData.value.avatar = []
  fileList.value = []
  userState.value = 1
  console.log("add--",formData.value.avatar)
  // showPhone.value = true
  // addFormDialog.value = true
  // formData.value = {
  //   name: '', // 昵称
  //   phone: '', // 电话
  //   password: '', // 密码
  //   email: '', // 邮箱
  //   sex: '男', // 性别
  //   state: 1, // 是否禁用 0-是 1-否
  //   roleIds: [], // 角色id
  // }
  getMerchants().then((res) => {
    console.log("获取联营商",res)
    if (res.code === '') {
      // ElMessage({
      //   message: '新增成功',
      //   type: 'success',
      // })
      usernames.value=[]
      usernames.value=res.data
      console.log("联营商列表",usernames.value)
      addFormDialog.value = true
    }
  }).finally(() => {
    submitLoading.value = false
  })
}
// 确认新增用户
const addForm_enter = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      submitLoading.value = true
      // formData.value.avatar=formData.value.avatar[0].url
      console.log("formData.value---",formData.value)
      formData.value.code = usernames.value.filter((i)=>i.name===formData.value.username)[0].code
      if (userState.value) {
        // formData.value.avatar=formData.value.avatar[0].url
        console.log("新增formData.value---",formData.value)
        userAdd(formData.value).then((res) => {
          if (res.code === '') {
            ElMessage({
              message: '新增成功',
              type: 'success',
            })
          }
          formData.value.avatar=[]
          getAll(searchData.value)
          addFormDialog.value = false
        }).finally(() => {
          submitLoading.value = false
        })
      } else {
        userUpdate(formData.value).then((res) => {
          if (res.code === '') {
            ElMessage({
              message: '修改成功',
              type: 'success',
            })
          }
          console.log("修改成功",res)
          getAll(searchData.value)
          addFormDialog.value = false
          fileList.value=[]
          formData.value.avatar=[]
          imagelist.value=[]
          console.log('修改后的fileList',fileList.value);
        }).finally(() => {
          submitLoading.value = false
        })
      }
    } else {
      return false
    }
  })
}
// 编辑用户
const edit = (row) => {
  userState.value = 0
  // showPhone.value = false
  phoneShow.value = true
  emailShow.value = true
  addFormDialog.value = true
  getMerchants().then((res) => {
    console.log("获取联营商",res)
    if (res.code === '') {
      // ElMessage({
      //   message: '新增成功',
      //   type: 'success',
      // })
      usernames.value=[]
      usernames.value=res.data
      console.log("联营商列表",usernames.value)
      addFormDialog.value = true
    }
  }).finally(() => {
    submitLoading.value = false
  })
  userGetById({ merchantsUserId: row.merchantsUserId }).then((res) => {
    console.log("getbyid的res",res)
    formData.value = res.data
    // form = [res.data.avatar]
  //   form.push({
  //   imgPath: res.data.avatar.imgPath,
  //   url: res.data.avatar.imgPath
  // })
    // let avatar = res.data.avatar
    // formData.value.avatar.push({
    //     imgPath: avatar[0],
    //     url: avatar[0]
    //   })
    // for(let i=0;i<avatar.length;i++){
    // //   formData.value.avatar = [res.data.avatar[i]]
    //   formData.value.avatar.push({
    //     imgPath: avatar[i],
    //     url: avatar[i]
    //   })
    // }
    formData.value.avatar = [res.data.avatarobj]
    // fileList.value.pop()
    console.log('点击编辑之前的filelist和formData.value.avatar',fileList.value,formData.value.avatar);
    fileList.value=[]
    console.log('formData.value.avatar[0]',formData.value.avatar[0]);
    if(formData.value.avatar[0].url != undefined) fileList.value.push(formData.value.avatar[0])
    // formData.value.avatar
    console.log("点击编辑之后的formdata.avatar,fileList.value ",res.data.avatarobj[0],formData.value.avatar,fileList.value )
    // formData.value.roleIds = res.data.ids
  })
}
// 删除用户
const del = async (row) => {
  ElMessageBox.confirm(
    '此操作将永久删除该用户, 是否继续?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      userDelete({ merchantsUserId: row.merchantsUserId }).then((res) => {
        if (res.code === '') {
          ElMessage({
            type: 'success',
            message: '删除成功!',
          })
        }
        getAll(searchData.value)
      })
    })
    .catch(() => {})
}
// 初始化查询所有数据
const getAll = async (data) => {
  tableLoading.value = true
  try {
    const res = await getList(data)
    tableData.value = res.data.list
    total.value = res.data.total
    console.log("查询的data",tableData.value)
  } finally {
    tableLoading.value = false
  }
}
const getRoleAll = async () => {
  const res = await roleGetall({ search: '', page: 1, pageSize: 10 })
  roleList.value = res.data.list
}
// 隐藏中间号码
// const hidePhone = (phone) => {
//   // const reg = /^(\d{3})\d{4}(\d{4})$/
//   // phone = phone.replace(reg, '$1****$2')
//   return phone
// }
// 中间部分
const hidden = (str, frontLen, endLen) => {
  console.log('str',str,typeof str);
  if(typeof str == 'string'){
    let endLenData = 0
    if (str && str.length !== 2) {
      endLenData = endLen
    }
    const len = str.length - frontLen - endLenData
    let xing = ''
    for (let i = 0; i < len; i++) {
      xing += '*'
    }
    return (
      str.substring(0, frontLen) +
      xing +
      str.substring(str.length - endLenData)
    )
  }else return ""
}
// const inputPhone = () => {
//   showPhone.value = true
//   newPhone.value = ''
//   nextTick(() => {
//     phoneCls.value.focus()
//   })
// }
const uploadRef = ref(null);
const onClosed = () => {
  formData.value={
    merchantsUserId:'',
    username: '', // 昵称
    phone: '', // 电话
    password: '', // 密码
    email: '', // 邮箱
    state: 1, // 是否禁用 0-是 1-否
    roleIds: [], // 角色id
    avatar: [],
    code:''//账号对应的code
  }
  fileList.value=[]
  emailShow.value = false
  phoneShow.value = false
  formRef.value.resetFields()
}

const addMerchants = async () => {
  var loading = ElLoading.service({ fullscreen: true })
  const res = await getShenKuanMerchants()
  console.log('res',res);
  if (res.code === '') {
    ElMessage({
      message: '获取成功',
      type: 'success',
    })
    loading.close();
  }
  getAll(searchData.value)
}

</script>

<style lang="scss" scoped>


.container{
  // padding:.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.second-main-container{
  width: 95%;
  background: $neutral-color-1;
  display: flex;
  flex-direction: column;
  margin: $container-margin ;
  padding: $container-base-padding-2;
  border-radius: $border-radius-medium;
  .el-form .el-form-item {
    margin-bottom: 0px;
  }
  box-shadow: $shadow-1;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
}

.pending {
  padding: 16px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  // margin-top: 20px;
  // background-color: #FFFFFF;
  width: 100%;
  margin:24px;
  // margin-left:24px;
}


.userStyle {
  padding: 20px;
  margin-top: 20px;
  background-color: #FFFFFF;
  .newPhone {
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    cursor: text;
  }
}
</style>
