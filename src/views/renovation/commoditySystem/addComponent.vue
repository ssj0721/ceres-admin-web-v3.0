<template>
  <div style="display: flex; width: 100%;">
    <el-card class="style-information-component">
      <!-- <template> -->
      <div slot="header" class="clearfix">
        <span style="font-size:18px;font-weight: bold;margin-bottom: 20px;">商品详情</span>
        <div class="el-upload__tip">
          使用说明：一级文件夹upload，里需要两个文件夹size、detail01分别存放尺寸描述、商品详情的图片文件。
          点击"选择文件"按钮，选择upload文件夹上传即可。
        </div>
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
            :data="uploadSetting.data" :fileList="form.fileList1" :fileidlist="form.fileid1"
            @getfileId="getfileId1" @delfileId="delfileId1"></Upload>
        </div>
        <div class="flex-container" style="margin-bottom: 20px;">
          <span style="margin-right:20px;">商品详情:</span>
          <Upload ref='uploadRef' :multiple="false" :action="uploadUrl" :limit="5" :maxSize="5" :accept="accept"
            :data="uploadSetting.data" :fileList="form.fileList2" :fileidlist="form.fileid2"
            @getfileId="getfileId2" @delfileId="delfileId2"></Upload>
        </div>
        <!-- <div class="flex-container" style="margin-bottom: auto;">
          <span style="margin-right:20px;">商品详情02:</span>
          <Upload ref='uploadRef' :multiple="false" :action="uploadUrl" :limit="5" :maxSize="5" :accept="accept"
            :data="uploadSetting.data" :fileList="form.fileList3" :fileidlist="form.fileid3"
            @getfileId="getfileId3" @delfileId="delfileId3"></Upload>
        </div> -->


        <!-- </el-form-item> -->
      </div>
    </el-card>

    <!-- 间隔占位 -->
    <div style="width: 20px"></div>

    <el-card class="style-information-component">
      <el-form-item label="选款图片" required/>
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
        <Upload ref='uploadRef' :multiple="true" :action="uploadUrl" :limit="10" :maxSize="5" :accept="accept"
          :file-list="form.formalimgs" :data="uploadSetting.data" :fileList="form.formalimgs" @getfileId="getformafileId"
          @delfileId="delformafileId">
        </Upload>
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
      <!-- <Upload ref='uploadRef' :multiple="true" :action="uploadUrl" :limit="10" :maxSize="5" :accept="accept"
          :file-list="form.imgs" :data="uploadSetting.data" :fileList="form.imgs" @getfileId="getfileId"
          @getimglist="getimglist"></Upload>
      </div> -->
      <el-form-item label="款式设置" required>
        <el-radio-group v-model="form.attrStyle">
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
                <el-input v-model="singleStyle.skuValue" :sss="scope" maxlength="10" />
              </template>
            </el-table-column>
            <el-table-column label="价格">
              <template #default="scope">
                <el-input-number v-model="scope.row.price" :controls="false" :max="999999999" :min="0" :precision="2"
                  :step="0.01" />
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
                />
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="库存" v-if="false">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.stockNumber"
                  :controls="false"
                  :max="999999999"
                  :min="0"
                  :precision="0"
                />
              </template>
            </el-table-column>
            <el-table-column label="重量(KG)" v-if="false">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.weight"
                  :controls="false"
                  :max="999"
                  :min="0"
                  :precision="2"
                  :step="0.01"
                />
              </template>
            </el-table-column>
            <el-table-column label="国际条码" v-if="false">
              <template #default="scope">
                <el-input v-model="scope.row.sku" maxlength="20" />
              </template>
            </el-table-column> -->
          </el-table>
        </div>
        <div v-else class="multiple-styles">
          <div v-for="(skuAttr, index) in form.skuAttrList" :key="index" class="sku-attr-list">
            <el-form-item label="规格名">
              <!-- <el-input v-model="skuAttr.skuName" maxlength="20" @change="val => noRepeatSku(val, index)"> -->
              <el-input v-model="skuAttr.skuName" disabled></el-input>
              <select-table :url="'/skulist/getColorTable'" v-model="form.selectColors" v-if="skuAttr.skuName == '颜色'"></select-table>
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
                :data="uploadSetting.data" :fileList="skuAttr.values" @getfileId="getfileIdguige"
                v-if="skuAttr.skuName === '图案'" @delfileId="delfileIdguige">
              </Upload>
              <div class="attr-value-list">
                <div v-for="(sku, index1) in skuAttr.values" :key="index + '-' + index1" class="main-diagram m-8">
                  <!-- <el-input v-model="sku.skuValue" maxlength="10" v-if="skuAttr.skuName !== '图案'">
                    <template #suffix>
                      <i v-if="index1 === 0"></i>
                      <el-icon v-else class="el-input__icon delImg" @click="delValue(index, index1)">
                        <Close />
                      </el-icon>
                    </template>
                  </el-input> -->
                  <el-select v-model="sku.skuValue" placeholder="请选择" clearable size="large" v-if="skuAttr.skuName == '颜色'" disabled>
                    <el-option v-for="(item, index) in colorlist" :key="index" :label="item.name" :value="item.id"></el-option>
                  </el-select>

                  <el-select v-model="sku.skuValue" placeholder="请选择" clearable size="large" v-if="skuAttr.skuName == '尺码'">
                    <el-option v-for="(item, index) in sizelist" :key="index" :label="item.name" :value="item.id"></el-option>
                  </el-select>

                  <i v-if="index1 === 0"></i>
                  <el-icon v-else-if="skuAttr.skuName == '尺码'" class="el-input__icon delImg" @click="delValue(index, index1)">
                    <Close />
                  </el-icon>

                  <!-- <i v-if="index === 0 && index1 === 0"></i>
                  <el-icon v-else class="delImg" @click="delValue(index, index1)">
                    <Close />
                  </el-icon> -->
                  <!-- <el-upload list-type="picture-card" :show-file-list="false" :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove" :headers="uploadSetting.headers" :data="uploadSetting.data"
                        :file-list="[sku]" :multiple="false" :on-success="handleImageSuccess1" :action="uploadUrl">
                        <div v-if="sku.image" class="attr-value-img">
                          <img class="attr-thumbnail" :src="sku.image" />
                        </div>
                        <el-icon v-else>
                          <Plus />
                        </el-icon>
                      </el-upload>
                      <div v-if="sku.image" class="attr-actions">
                        <span class="attr-preview" @click="
                          handlePictureCardPreview({ imgPath: sku.image })
                          ">
                          <el-icon>
                            <ZoomIn />
                          </el-icon>
                        </span>
                        <span class="attr-delete" @click="handleRemove1(sku)">
                          <el-icon>
                            <Delete />
                          </el-icon>
                        </span>
                      </div> -->
                </div>
                <el-button type="primary" link style="margin-left: 10px" @click="addAttrValue(index)"
                  v-if="skuAttr.skuName == '尺码'">添加</el-button>
              </div>
            </el-form-item>
          </div>
          <!-- <el-button class="add-attr-btn" type="primary" @click="addSkuAttrList">添加规格</el-button> -->

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
                <el-button type="text" @click="syncPrices" icon="el-icon-download"></el-button>
              </template>
              <template #default="scope">
                <el-input-number v-model="scope.row.price" :controls="false" :max="999999999" :min="0" :precision="2"
                  :step="0.01" style="width: 100%" @blur="validateOriPrice(scope.row.originalPrice,scope.row.price)"/>
              </template>
            </el-table-column>
            <el-table-column label="价格(工厂价)">
              <template #header>
                <span>价格(工厂价)</span>
                <el-button type="text" @click="syncOriginalPrices" icon="el-icon-download"></el-button>
              </template>
              <template #default="scope">
                <el-input-number v-model="scope.row.originalPrice" :controls="false" :max="999999999" :min="0" :precision="2"
                  :step="0.01" style="width: 100%" @blur="validateOriPrice(scope.row.originalPrice,scope.row.price)"/>
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
import { findimageurl } from '@/api/commodity';
import { getfileid } from '@/api/file';
import {
    getColorList,
    getSizeList
  } from '@/api/skuList'
import Upload from '@/components/Upload/index.vue';
import { getToken } from '@/utils/auth';
import { uploadUrl } from '@/utils/request';
import { ElMessage } from 'element-plus';
import { validate } from 'uuid';
import { computed, defineComponent, reactive, ref, shallowRef, toRefs, watch, onBeforeMount } from 'vue';

defineComponent({
  name: 'CommodityFormInfo'
})

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
})

const emits = defineEmits(['saveDisabled']);

let { form } = toRefs(props);

onBeforeMount(() => {
console.log('商品详情页面');
  if(colorlist.value.length == 0){
    getColors()
  }
  if(colorlist.value.length == 0){
    getSizes()
  }
})

const syncPrices = () => {
  if (form.value.skuList.length > 0) {
    const firstPrice = form.value.skuList[0].price;
    form.value.skuList.forEach(sku => {
      sku.price = firstPrice;
    });
  }
}

const syncOriginalPrices = () => {
  if (form.value.skuList.length > 0) {
    const firstPrice = form.value.skuList[0].originalPrice;
    form.value.skuList.forEach(sku => {
      sku.originalPrice = firstPrice;
    });
  }
}

function validateOriPrice(oriprice,price){
  console.log('进来了吗2',oriprice,price);
  if(oriprice>=price&&price!=0){
    ElMessage.warning('商品工厂价不可以高于采购价')
    emits('saveDisabled', true); //禁用保存按钮
  }else{
    emits('saveDisabled', false); //开放保存按钮
  }
}

const getfileId1 = (val) => {
  // form.value.fileid1=[]
  // let i = form.value.fileid1.indexOf(val)
  // if(i == -1){
  form.value.fileid1.push(val)
  // fileList1.value[form.value.fileid1.length-1].fileid = val
  // fileList1.value[fileList1.value.length].fileid = val
  // }
  // else form.value.fileid1.splice(i,1)
}

const getfileId2 = (val) => {
  // form.value.fileid2=[]
  // let i = form.value.fileid2.indexOf(val)
  // if(i == -1){
  form.value.fileid2.push(val)
  // }
  // else form.value.fileid2.splice(i,1)
}

const getfileId3 = (val) => {
  // form.value.fileid3=[]
  // let i = form.value.fileid3.indexOf(val)
  // if(i == -1){
  form.value.fileid3.push(val)
  // }
  // else form.value.fileid3.splice(i,1)
}

const delfileId1 = (val) => {
  // form.value.fileid1=[]
  // form.value.fileid1.splice(form.value.fileid1.indexOf(val),1)
  form.value.fileid1 = val
}

const delfileId2 = (val) => {
  // form.value.fileid1=[]
  // form.value.fileid2.splice(form.value.fileid2.indexOf(val),1)
  form.value.fileid2 = val
}

const delfileId3 = (val) => {
  // form.value.fileid1=[]
  // form.value.fileid3.splice(form.value.fileid3.indexOf(val),1)
  form.value.fileid3 = val
}
const getfileIdguige = (val) => {
  form.value.skuAttrList.forEach(item => {
    if (item.skuName == '图案') {
      findimageurl(val).then(res => {
        item.values.push({
          skuValue: val,
          valueCode: '',
          image: '',
          fileid: val,
          url: res.data
        })
      })
    }
  })
}
const delfileIdguige = (val) => {
  // 记录删除的图片相关数据，
  const newList = JSON.parse(JSON.stringify(form.value.initskuAttrList[2])) // 规格图片

  console.log("初始状态", form.value.initskuAttrList, val)
  newList.values.forEach(item => {
    if (val.indexOf(item.fileid) === -1) {    // 这样子会有重复的
      const valueObj = {
        code: newList.code,
        skuId: newList.skuId,
        valueCode: item.valueCode
      }
      form.value.deletes.push(valueObj)
    }
  })
}

const imglist = ref([])
let batchFileList = ref([])
function getFile(e) {
  let files = [...e.target.files];
  console.log("获取的文件夹", files, typeof files);

  files.forEach((file) => {
    let str = file.webkitRelativePath
    let folderstr = str.substring(0, str.lastIndexOf("/") + 1);
    console.log('文件地址', file.webkitRelativePath, folderstr);
    // if (file.status !== 'ready') return;
    console.log("文件改变", file)
    imglist.value.push({ url: file.url, fileid: 0 })
    // emits('getimglist', imglist)
    batchFileList.value = []
    batchFileList.value.push(file)
    // let f = file.raw
    // console.log("fffffffff",f)
    var date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let subPath = "img/itemDraft/" + year + month;
    console.log("subpath,batchFileList", subPath, batchFileList.value)
    const formData2 = new FormData();
    for (let i = 0; i < batchFileList.value.length; i++) {
      formData2.append('fileList', batchFileList.value[i])
    }
    formData2.append('subPath', subPath)
    console.log("formData2---", formData2.getAll("fileList"), batchFileList.value)
    getfileid(formData2).then((res) => {
      if (res.code === '') {
        console.log('获取fileid成功的res', res);
        if (folderstr === "upload/size/") {
          console.log('upload/size/的fileid', res.data.fileId);
          form.value.fileid1.push(res.data.fileId)
          console.log('尺码fileid1', form.value.fileid1);
        }
        if (folderstr === "upload/detail01/") {
          console.log('upload/detail01/的fileid', res.data.fileId);
          form.value.fileid2.push(res.data.fileId)
          console.log('商品详情01的fileid2', form.value.fileid2);
        }
        if (folderstr === "upload/detail02/") {
          console.log('upload/detail02/的fileid', res.data.fileId);
          form.value.fileid3.push(res.data.fileId)
          console.log('商品详情02的fileid3', form.value.fileid3);
        }
        // ElMessage.success('获取fileid成功')
        // filemap.value.push(res.data.fileMap)
        // emits('getfileId', res.data.fileId);
        // // f.fileid = res.data.fileId
        // // fileList.value.push(f)
        // imglist.value[imglist.value.length-1].fileid = res.data.fileId
        // file.fileid = res.data.fileId
        // isChange.value = true
        // console.log("filelist+++imglist",fileList.value,imglist.value)
        // return res.data.fileId
        // emits('getfileId', res.data.fileId);
        // emits('getimglist', imglist)
      }
    })
    // console.log("filelist+++imglist",fileList.value,imglist.value)
  })
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
  // form.value.formafileId = []
  form.value.formafileId.push(val)
}

const delformafileId = (val) => {
  form.value.formafileId = val
}

const getfileId = (val) => {
  alterFileList.value.push(val)
  form.value.fileId = []
  form.value.fileId.push(val)
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
  //就是下面这条注释害的在本地没问题，在198线上就会报错skuAttrName是undefined
  // console.log("颜色尺码", this.skuAttrName)
  const hasChilds =
    list &&
    list.filter((skuAttr) => {  // 颜色 1， 尺码 2 , 图案 3
      const hasChild = skuAttr.values.some((attr) => {  // 颜色值， 尺码值，图案值
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
        // console.log('attr',attr);
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
  console.log("skuAttrName", skuAttrName)
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
  // fileList[0].image = url
}

function addSkuAttrList() {
  if (form.value.skuAttrList.length >= 3) {
    ElMessage.error("最多为三组规格值!")
    return false;
  }


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
      // {
      //   code: '',
      //   valueCode: '',
      // },
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
  console.log("form.value.skuAttrList", form.value.skuAttrList)
  form.value.skuAttrList.map((skuItem, index) => {  // 图案 1 ： 尺码 2 ： 颜色 3 ：
    const attrList = []
    skuItem.code = skuItem.code || 'attr_code_' + index
    const { code } = skuItem
    let index1 = 0
    skuItem.values &&
      skuItem.values.filter(item => item.skuValue).map((attrItem) => {
        if (!attrItem.valueCode || attrItem.valueCode === '') {
          attrItem.valueCode = code + '_value_' + index1
        }
        const skuId = attrItem.skuId
        const attrId = attrItem.attrId
        if (attrItem.skuValue) {
          attrList.push({
            skuId,
            attrId,
            code,
            valueCode: attrItem.valueCode,
          })
          index1 = Number(attrItem.valueCode.substring(attrItem.valueCode.lastIndexOf("_") + 1)) + 1
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

  // 通过判断两个对象的skuAttrCodeDTOList是否相等 来关联form.value.skuList和skuListArray
  console.log("skuListArray", skuListArray)
  console.log("form.value.skuList", form.value.skuList)
  form.value.skuList = skuListArray.map(sku => {
    form.value.skuList.forEach(item => {
      if (JSON.stringify(item.skuAttrCodeDTOList) === JSON.stringify(sku.skuAttrCodeDTOList)) {
        sku.price = item.price
        sku.skuId = item.skuId
        sku.originalPrice = item.originalPrice
      }
    })
    return sku;
  })
  console.log("变化", form.value.skuList)

  // 不知道这段代码是做什么的，根本没有skuAttrList，后面有遇到这种情况再看
  /*form.value.skuList = skuListArray.map((sku1) => {
    const { skuAttrList, skuAttrCodeDTOList } = sku1
    const skuAttrList1 = skuAttrCodeDTOList || skuAttrList
    const skuMap = form.value.skuList.filter((sku2) => {  //

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
    console.log("skuMap", skuMap)
    if (skuMap && skuMap.length) {
      selectMap = JSON.parse(JSON.stringify(skuMap[0]))
      selectMap.skuAttrCodeDTOList = skuAttrCodeDTOList
    }
    return selectMap
  })*/

}

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

// 使用 watch 监听 inputValue 的变化
// watch(priceAll, (newVal, oldVal) => {
//       handleInputChange(newVal);
//     });

// const handleInputChange = (newVal) => {
//       console.log('输入框的值变化了：', newVal);
//       // 在这里执行你需要的逻辑
//     };

watch(() => form.value.skuAttrList, (_newVal, _oldVal) => {
  console.log("监听skuAttrList", form.value.skuAttrList)
  // 判断是否有规格值
  const hasChilds =
    form.value.skuAttrList &&
    form.value.skuAttrList.filter((skuAttr) => {
      const hasChild = skuAttr.values.some((attr) => {
        return attr.skuValue
      })
      return skuAttr.skuName && hasChild
    })
  console.log(form.value.attrStyle)
  if (form.value.attrStyle == 1 && hasChilds.length) {
    skuFormat()
  }
}, { deep: true })

watch(() => form.value.selectColors, (_newVal, _oldVal) => {
  console.log("监听selectColors", form.value.selectColors,_newVal, _oldVal)
  form.value.skuAttrList[0].values = []
  form.value.selectColors.forEach(i=>{
    if(i!=0){
      form.value.skuAttrList[0].values.push({
        skuValue: i.toString(),
        valueCode: '',
        image: '',
      })
    }
  })
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
      display: flex;

      .delImg {
        height: 100%;
      }

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
