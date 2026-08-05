<template>
  <div style="display: flex; width: 100%;">
    <el-card class="style-information-component ">
      <!-- <template> -->
      <div slot="header" class="clearfix">
        <span style="font-size:18px;font-weight: bold;margin-bottom: 20px;">商品详情</span>
        <div class="select-files-btn" style="font-weight: bold;font-size: 18px;margin: 0 0 20px 40px;">
          <!-- <el-button type="primary" @click="choiceFiles">
                    		<i class="el-icon-folder-opened"></i>
                    	</el-button> -->
          <span>文件夹上传：</span>
          <input ref="filElem" type="file" multiple class="upload-file" webkitdirectory @change="getFile" />
        </div>

      </div>
      <!-- </template> -->

      <div>
        <!-- <el-form-item > -->
        <!-- <WangEditor v-model="form.productText" /> -->
        <div class="flex-container" style="margin-bottom: 20px;">
          <span style="margin-right:35px;">尺寸描述:</span>
          <Upload ref='uploadRef' :multiple="false" :action="uploadUrl" :limit="5" :maxSize="5" :accept="accept"
            :file-list="fList1" :data="uploadSetting.data" :fileList="form.fileList1" :fileidlist="form.fileid1"
            @getfileId="getfileId1" @delfileId="delfileId1" :isSee="isSee"></Upload>
        </div>
        <div class="flex-container" style="margin-bottom: 20px;">
          <span style="margin-right:20px;">商品详情:</span>
          <Upload ref='uploadRef' :multiple="false" :action="uploadUrl" :limit="5" :maxSize="5" :accept="accept"
            :file-list="fList2" :data="uploadSetting.data" :fileList="form.fileList2" :fileidlist="form.fileid2"
            @getfileId="getfileId2" @delfileId="delfileId2" :isSee="isSee"></Upload>
        </div>
        <!-- <div class="flex-container" style="margin-bottom: auto;">
                  <span style="margin-right:20px;">商品详情02:</span>
                  <Upload ref='uploadRef' :multiple="false" :action="uploadUrl" :limit="5" :maxSize="5" :accept="accept"
                    :file-list="fList3" :data="uploadSetting.data" :fileList="form.fileList3" :fileidlist="form.fileid3"
                    @getfileId="getfileId3" @delfileId="delfileId3" :isSee="isSee"></Upload>
                </div> -->


        <!-- </el-form-item> -->
      </div>
    </el-card>

    <!-- 间隔占位 -->
    <div style="width: 20px"></div>

    <el-card class="style-information-component">
      <el-form-item label="选款图片" />
      <div class="upload-wrap">
        <!-- <el-upload
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :before-upload="beforeUpload"
        :on-remove="handleRemove"
        :headers="uploadSetting.headers"
        :data="uploadSetting.data"
        :file-list="form.formalimgs"
        :limit="20"
        :accept="accept"
        :on-success="handleFormalImageSuccess"
        :action="uploadUrl"
      >
        <el-icon><Plus /></el-icon>
      </el-upload> -->
        <Upload ref='uploadRef' :multiple="false" :action="uploadUrl" :limit="1" :maxSize="5" :accept="accept"
          :file-list="form.formalimgs" :data="uploadSetting.data" :fileList="formafileList" @getfileId="getformafileId"
          :isSee="isSee"></Upload>
      </div>
      <!-- <el-form-item label="审款图片" />
      <div class="upload-wrap"> -->
      <!-- <el-upload
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :before-upload="beforeUpload"
        :on-remove="handleRemove"
        :headers="uploadSetting.headers"
        :data="uploadSetting.data"
        :file-list="form.imgs"
        :limit="20"
        :accept="accept"
        :on-success="handleImageSuccess"
        :action="uploadUrl"
      >
        <el-icon><Plus /></el-icon>
      </el-upload> -->
      <!-- <Upload ref='uploadRef' :multiple="false" :action="uploadUrl" :limit="1" :maxSize="5" :accept="accept"
          :file-list="form.imgs" :data="uploadSetting.data" :fileList="fileList" @getfileId="getfileId" :isSee="isSee">
        </Upload>
      </div> -->
      <el-form-item label="款式设置">
        <el-radio-group v-model="form.attrStyle" disabled>
          <!-- <el-radio :label="0">单规格</el-radio>
          <el-radio :label="1">多规格</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <div class="style-container">
        <div v-if="form.attrStyle === 0" class="single-style">
          <el-table :data="skuList" border style="width: 100%"
            :header-cell-style="{ background: '#EEF3FF', color: '#333333' }">
            <el-table-column label="规格">
              <template #default="scope">
                <el-input v-model="singleStyle.skuValue" :sss="scope" maxlength="10" disabled />
              </template>
            </el-table-column>
            <el-table-column label="价格">
              <template #default="scope">
                <el-input-number v-model="scope.row.price" :controls="false" :max="999999999" :min="0" :precision="2"
                  :step="0.01" disabled />
              </template>
            </el-table-column>
            <!-- <el-table-column label="原价">
            <template #default="scope">
              <el-input-number
                v-model="scope.row.originalPrice"
                :controls="false"
                :max="999999999"
                :min="0"
                :precision="2"
                :step="0.01"
                disabled
              />
            </template>
          </el-table-column> -->
            <el-table-column label="库存" v-if="false">
              <template #default="scope">
                <el-input-number v-model="scope.row.stockNumber" :controls="false" :max="999999999" :min="0"
                  :precision="0" disabled />
              </template>
            </el-table-column>
            <el-table-column label="重量(KG)" v-if="false">
              <template #default="scope">
                <el-input-number v-model="scope.row.weight" :controls="false" :max="999" :min="0" :precision="2"
                  :step="0.01" disabled />
              </template>
            </el-table-column>
            <el-table-column label="国际条码" v-if="false">
              <template #default="scope">
                <el-input v-model="scope.row.sku" maxlength="20" disabled />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else class="multiple-styles">
          <div v-for="(skuAttr, index) in form.skuAttrList" :key="index" class="sku-attr-list">
            <el-form-item label="规格名">
              <!-- <el-input v-model="skuAttr.skuName" maxlength="20" @change="val => noRepeatSku(val, index)"> -->
              <el-input v-model="skuAttr.skuName" disabled></el-input>
              <!-- <template #suffix>
                <el-icon v-if="index !== 0" class="el-input__icon delImg" @click="delSkuAttrList(index)">
                  <Close />
                </el-icon>
              </template> -->
              <!-- </el-input> -->
              <!-- <el-icon v-if="index !== 0" class="delImg" @click="delSkuAttrList(index)"><Close /></el-icon> -->
              <!-- <el-checkbox v-if="index === 0" v-model="skuAttr.needImg" style="margin-left: 20px">需要配图</el-checkbox> -->
            </el-form-item>
            <el-form-item label="规格值">
              <Upload ref='uploadRef' :multiple="true" :action="uploadUrl" :limit="10" :maxSize="5" :accept="accept"
                :data="uploadSetting.data" :fileList="skuAttr.values" v-if="index === 2" :isSee="isSee">
              </Upload>
              <div class="attr-value-list">
                <div v-for="(sku, index1) in skuAttr.values" :key="index + '-' + index1" class="main-diagram m-8">
                  <el-select v-model="sku.skuValue" placeholder="请选择" clearable size="large" v-if="skuAttr.skuName == '颜色'" disabled>
                    <el-option v-for="(item, index) in colorlist" :key="index" :label="item.name" :value="item.id"></el-option>
                  </el-select>

                  <el-select v-model="sku.skuValue" placeholder="请选择" clearable size="large" v-if="skuAttr.skuName == '尺码'" disabled>
                    <el-option v-for="(item, index) in sizelist" :key="index" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </div>
              </div>
            </el-form-item>
          </div>

          <el-table :data="skuList" style="width: 100%" :header-cell-style="{ background: '#EEF3FF', color: '#333333' }">
            <el-table-column v-for="(skuAttr, index) in skuAttrName" :key="index" :label="skuAttr.skuName">
              <template #default="scope">
                <span v-if="skuAttr.skuName == '颜色'">
                  {{
                    attrValueFilter(
                      scope.row.skuAttrCodeDTOList && scope.row.skuAttrCodeDTOList[index],
                      form.skuAttrList,"1"
                    )
                  }}
                </span>
                <span v-else-if="skuAttr.skuName == '尺码'">
                  {{
                    attrValueFilter(
                      scope.row.skuAttrCodeDTOList && scope.row.skuAttrCodeDTOList[index],
                      form.skuAttrList,"2"
                    )
                  }}
                </span>
                <img v-else :src="attrValueFilter2(
                      scope.row.skuAttrCodeDTOList && scope.row.skuAttrCodeDTOList[index],
                      form.skuAttrList
                    )" alt="加载失败" style="width:30px;height:auto;margin-bottom: -7px;" />
              </template>
            </el-table-column>
            <el-table-column label="价格(采购价)">
              <template #header>
                <span>价格(采购价)</span>
              </template>
              <template #default="scope">
                {{ scope.row.price }}
              </template>
            </el-table-column>
            <el-table-column label="价格(工厂价)">
              <template #header>
                <span>价格(工厂价)</span>
              </template>
              <template #default="scope">
                {{ scope.row.originalPrice }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-dialog v-model="visible.image" :append-to-body="true" class="check-image-dialog" title="查看图片" center="center">
        <img width="100%" :src="detailImage" alt />
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import Upload from '@/components/Upload/index.vue';
import { getToken } from '@/utils/auth';
import { uploadUrl } from '@/utils/request';
import { ElMessage } from 'element-plus';
import { computed, defineComponent, reactive, ref, shallowRef, toRefs, watch, onBeforeMount} from 'vue';
import {
    getColorList,
    getSizeList
  } from '@/api/skuList'

defineComponent({
  name: 'CommodityFormInfo'
})

const fileList = ref([])
const formafileList = ref([])
const alterFileList = ref([]) //存放fileid
const accept = import.meta.env.VITE_ACCEPT
const colorlist = ref([])
const sizelist = ref([])

const props = defineProps({
  form: {
    type: Object,
    default() {
      return {}
    },
  },
  isSee: {
    type: Boolean,
    default: false
  }
})

onBeforeMount(() => {
console.log('商品详情页面');
  if(colorlist.value.length == 0){
    getColors()
  }
  if(colorlist.value.length == 0){
    getSizes()
  }
})

function getColors() {
  getColorList().then((res) => {
      console.log('获取颜色列表',res.data);
      colorlist.value = res.data
  })
}

function getSizes() {
  getSizeList().then((res) => {
      console.log('获取尺码列表',res.data);
      sizelist.value = res.data
  })
}

let { form, isSee } = toRefs(props);
for (let i = 0; i < form.value.imgs.length; i++) {
  form.value.imgs[i].url = form.value.imgs[i].imgPath;
  fileList.value = form.value.imgs;
}

for (let i = 0; i < form.value.formalimgs.length; i++) {
  form.value.formalimgs[i].url = form.value.formalimgs[i].imgPath;
  formafileList.value = form.value.formalimgs;
}

// const getimglist = (val) =>{
//   formData.value.avatar=[]
//   for(let i=0;i<val.value.length;i++){
//     const url =val.value[i].url
//   // formData.value.avatar = url
//   formData.value.avatar.push({
//     imgPath: url,
//     url: url
//   })
//   }
//   console.log("getimglist",formData.value.avatar,val.value)
// }

const getformafileId = (val) => {
  alterFileList.value.push(val)
  form.value.formafileId = []
  form.value.formafileId.push(val)
  console.log("getformafileId", alterFileList.value, form.value.formafileId)
}

const getfileId = (val) => {
  alterFileList.value.push(val)
  form.value.fileId = []
  form.value.fileId.push(val)
  console.log("getfileId", alterFileList.value, form.value.fileId)
}


let uploadSetting = reactive({
  headers: {
    'Authorization-admin': getToken(),
    tenant: 'MDAwMA=='
  },
  data: {
    folderId: 1,
  }
})

function attrValueFilter(map, list, type) {
  const hasChilds =
    list &&
    list.filter((skuAttr) => {
      const hasChild = skuAttr.values.some((attr) => {
        return attr.skuValue
      })
      return skuAttr.skuName && hasChild
    })
  if (!map) {
    return ''
  }
  const { code, valueCode } = map
  let codeStr = ''
  hasChilds.map((item) => {
    const { values } = item
    values &&
      values.some((attr) => {
        const isSome = item.code === code && attr.valueCode === valueCode
        if (isSome) {
          codeStr = attr.skuValue
        }
        return isSome
      })
  })
  if(type=="1"){
    console.log('colorlist.value[colorlist.value.indexOf(codeStr)]',codeStr,colorlist.value.find(item => item.id == codeStr)?.name);
    codeStr = colorlist.value.find(item => item.id == codeStr)?.name
  }else{
    codeStr = sizelist.value.find(item => item.id == codeStr)?.name
  }
  return codeStr
}
function attrValueFilter2(map, list) {
  console.log("图案", map)
  const hasChilds =
    list &&
    list.filter((skuAttr) => {
      const hasChild = skuAttr.values.some((attr) => {
        return attr.skuValue
      })
      return skuAttr.skuName && hasChild
    })
  if (!map) {
    return ''
  }
  const { code, valueCode } = map
  let codeStr = ''
  hasChilds.map((item) => {
    const { values } = item
    values &&
      values.some((attr) => {
        const isSome = item.code === code && attr.valueCode === valueCode
        if (isSome) {
          codeStr = attr.url
        }
        return isSome
      })
  })
  return codeStr
}
function noRepeatSku(val, index) {
  let isRepeat = false
  form.value.skuAttrList.forEach((sku, skuIndex) => {
    if (sku.skuName === val && skuIndex !== index) {
      isRepeat = true
    }
  })
  if (isRepeat) {
    ElMessage.warning('已存在相同规格')
    form.value.skuAttrList[index].skuName = ''
  }
  // return isRepeat ? '' : val
}

let skuAttrName = computed(() => {
  return (
    form.value.skuAttrList &&
    form.value.skuAttrList.filter((skuAttr) => {
      const hasChilds = skuAttr.values.some((attr) => {
        return attr.skuValue
      })
      return skuAttr.skuName && hasChilds
    })
  )
})

let singleStyle = computed(() => {
  if (form.value.skuAttrList && form.value.skuAttrList[0]) {
    return form.value.skuAttrList && form.value.skuAttrList[0].values[0]
  }
  return {
    skuValue: '',
  }
})

let skuList = computed(() => {
  if (form.value.attrStyle === 0) {
    return form.value.skuList.slice(0, 1)
  }
  return form.value.skuList
})

let visible = reactive({
  image: false,
})

let detailImage = shallowRef('');

function isImage(fileName) {
  return /\.(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIT|BMP)$/.test(fileName);
}

// 图片上传前对图片大小进行检测
function beforeUpload(file) {
  console.log("file", file);
  const fileSize = file.size;
  const Size = import.meta.env.VITE_IMAGE_SIZE;
  // 转换为字节进行比较
  const limitSize = Size * 1024 * 1024;
  console.log("limitSize", limitSize);
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
    if (isImage(file.name)) {
      console.log("开始检测分辨率")
      let width = imageMaxWidth;
      let height = imageMaxHeight;
      let width2 = imageMinWidth;
      let height2 = imageMinHeight;
      let image = new Image();
      image.onload = function () {
        console.log("image.onload");
        let valid = width2 <= image.width && image.width <= width && height2 <= image.height && image.height <= height;
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
    }
  })
  return acceptPromise;
}

function handleImageSuccess(response) {
  console.log("accept---", import.meta.env.VITE_ACCEPT);
  const url = response.data.url
  form.value.imgs.push({
    imgPath: url,
    url: url
  })
}

function handleFormalImageSuccess(response) {
  console.log("accept---", import.meta.env.VITE_ACCEPT);
  const url = response.data.url
  form.value.formalimgs.push({
    imgPath: url,
    url: url
  })
  console.log("formalimgs", form.value)
}

// 移除图片
function handleRemove(file) {
  const { uid } = file
  const urlIndex = form.value.imgs.findIndex(x => x.uid === uid)
  form.value.imgs.splice(urlIndex, 1)
}

function handleRemove1(file) {
  file.image = ''
}
function handlePictureCardPreview(file) {
  console.log("图片地址", file.imgPath)
  detailImage.value = file.imgPath
  visible.image = true
}
function handleImageSuccess1(response, file, fileList) {
  const url = response.data.url
  fileList[0].image = url
}

function addSkuAttrList() {
  form.value.skuAttrList.push({
    code: '',
    skuName: '',
    values: [
      {
        skuValue: '',
        valueCode: '',
        image: '',
        isDelete: 0,
        sortOrder: 0,
      },
    ],
    isDelete: 0,
    needImg: 0,
    sortOrder: 0,
  })
}
function addAttrValue(index) {
  form.value.skuAttrList[index].values.push({
    skuValue: '',
    valueCode: '',
    image: '',
  })
}
// 删除规格值
function delValue(index, index1) {
  const newList = JSON.parse(JSON.stringify(form.value.skuAttrList[index]))
  const valueObj = {
    code: newList.code,
    skuId: newList.skuId,
    valueCode: newList.values[index1].valueCode
  }
  form.value.deletes.push(valueObj)
  form.value.skuAttrList[index].values.splice(index1, 1)
}
// 删除规格名
function delSkuAttrList(index) {
  const newList = JSON.parse(JSON.stringify(form.value.skuAttrList[index]))
  newList.values.forEach(item => {
    const valueObj = {
      code: newList.code,
      skuId: newList.skuId,
      valueCode: ''
    }
    valueObj.valueCode = item.valueCode
    form.value.deletes.push(valueObj)
  })
  form.value.skuAttrList.splice(index, 1)
}
function skuFormat() {
  const skuListArray = []
  const result = {
    isDelete: 0,
    productId: '',
    skuAttrCodeDTOList: [
      {
        code: '',
        valueCode: '',
      },
    ],
    sku: '',
    skuImg: '',
    price: 0,
    originalPrice: 0,
    stockNumber: 0,
    weight: 0,
  }
  const doExchange = (arr, depth) => {
    const map = {
      arr: [],
    }
    for (var i = 0; i < arr[depth].length; i++) {
      map.arr.push(arr[depth][i])
      const { code, valueCode, attrId } = arr[depth][i]
      result.skuAttrCodeDTOList[depth] = {
        code,
        valueCode,
        attrId,
      }
      if (depth !== arr.length - 1) {
        doExchange(arr, depth + 1)
      } else {
        skuListArray.push(JSON.parse(JSON.stringify(result)))
      }
    }
  }
  // form.value.skuList  = skuListArray
  // 获取规格值的所有组合
  const values = []
  form.value.skuAttrList.map((skuItem, index) => {
    const attrList = []
    skuItem.code = skuItem.code || 'attr_code_' + index
    const { code } = skuItem
    skuItem.values &&
      skuItem.values.map((attrItem, index1) => {
        attrItem.valueCode = skuItem.valueCode || code + '_value_' + index1
        const skuId = attrItem.skuId
        const attrId = attrItem.attrId
        if (attrItem.skuValue) {
          attrList.push({
            skuId,
            attrId,
            code,
            valueCode: attrItem.valueCode,
          })
        }
      })
    if (attrList.length) {
      values.push(attrList)
    }
  })
  // 相互组合
  if (values.length) {
    doExchange(values, 0)
  }
  if (form.value.skuList.length === skuListArray.length) {
    for (let i = 0; i < skuListArray.length; i++) {
      skuListArray[i].price = form.value.skuList[i].price
      skuListArray[i].originalPrice = form.value.skuList[i].originalPrice
    }
  }
  form.value.skuList = skuListArray.map((sku1) => {
    const { skuAttrList, skuAttrCodeDTOList } = sku1
    const skuAttrList1 = skuAttrCodeDTOList || skuAttrList
    const skuMap = form.value.skuList.filter((sku2) => {
      const skuAttrList2 = sku2.skuAttrList
      sku2.skuAttrCodeDTOList = skuAttrList2
      if (!skuAttrList2) return false
      const ids = []
      skuAttrList1.filter((item) => ids.push(item.id))
      const result = skuAttrList2.every(
        (item) => ids.indexOf(item.attrValueId) !== -1
      )
      return result
    })
    let selectMap = sku1
    if (skuMap && skuMap.length) {
      selectMap = JSON.parse(JSON.stringify(skuMap[0]))
      selectMap.skuAttrCodeDTOList = skuAttrCodeDTOList
    }
    return selectMap
  })
}

watch(() => form.value.skuAttrList, (_newVal, _oldVal) => {
  console.log("开始构建333")
  // 判断是否有规格值
  const hasChilds =
    form.value.skuAttrList &&
    form.value.skuAttrList.filter((skuAttr) => {
      const hasChild = skuAttr.values.some((attr) => {
        return attr.skuValue
      })
      return skuAttr.skuName && hasChild
    })
  if (form.value.attrStyle === 1 && hasChilds.length) {
    skuFormat()
  }
}, { deep: true })
</script>

<style lang="scss" scoped>
.style-information-component {
  width: 100%;
  min-height: 300px;

  // padding: 24px;
  // background-color: rgb(255, 255, 255);
  .el-form-item {
    margin-bottom: 10px;
  }

  .attr-value-list {
    display: flex;
    flex-wrap: wrap;

    .main-diagram {
      width: 180px;

      .span-wrap {
        position: relative;
        display: inline-block;
        margin-top: 10px;

        .attr-actions {
          line-height: 100px;
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          cursor: default;
          text-align: center;
          color: #fff;
          opacity: 0;
          font-size: 20px;
          background-color: rgba(0, 0, 0, 0.5);
          -webkit-transition: opacity 0.3s;
          transition: opacity 0.3s;
          z-index: 1;

          &:hover {
            opacity: 1;

            .attr-preview {
              display: inline-block;
            }

            i {
              color: #fff;
              font-size: 20px;
            }
          }
        }

        .attr-preview {
          display: none;
          cursor: pointer;
          font-size: 20px;
          color: #fff;
        }

        .attr-delete {
          margin-left: 15px;
          color: #fff;
        }
      }

      .attr-value-img {
        width: 100%;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }

  .m-8 {
    margin-right: 8px;
  }

  .upload-btn {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 110px;
    cursor: pointer;
    border: 2px dashed #2e60f8;
    border-radius: 2px;
    background-color: #f8f9fb;
    text-align: center;
    font-size: 20px;
    color: #2e60f8;

    i {
      color: #2e60f8;
      font-size: 20px;
    }

    .upload-title {
      margin-left: 10px;
      font-size: 14px;
    }
  }

  .upload-wrap {
    margin-bottom: 25px;

    .el-upload-list__item {
      transition: none !important;
    }

    .el-upload,
    .el-upload-list__item {
      width: 100px;
      height: 100px;
      line-height: 100px;
    }

    .el-progress,
    .el-progress-circle {
      width: 80px !important;
      height: 80px !important;
    }
  }

  .sku-attr-list {
    .el-input {
      width: 180px;
    }
  }

  .single-style {
    .el-input {
      max-width: 180px;
    }
  }

  .add-attr-btn {
    margin-bottom: 25px;
  }

  .check-image-dialog {
    .el-dialog {
      margin-top: 25px;

      .el-dialog__body {
        img {
          max-width: 100%;
          max-height: 100%;
          height: 500px;
          object-fit: contain;
        }
      }
    }
  }

  // .delImg {
  //   position: absolute;
  //   top: 12px;
  //   margin-left: -24px;
  // }
  .delImg:hover {
    // border-radius: 50%;
    color: #ffffff;
    background: #2e60f8;
    cursor: pointer;
  }
}
</style>
