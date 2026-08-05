<template>
  <div>
    <br>
    <div class="top">
        <div style="font-weight:bold; font-size:large">上传图片</div>
        <div style="font-weight:bold; font-size:large" v-if="productId!=0">
          上次搜图时间：{{change=='1'&&rslist.length>0 ? rslist[0][0].created : change=='2'&&sklist.length>0 ? sklist[0].created : ""}}
        </div>
        <el-button @click="closeSearch" type="primary">关闭</el-button>
    </div>
    <br>
    <div>
      <div style="display: flex; flex:10;">
        <div style="flex:9">
          <Upload
            ref='uploadRef'
            :multiple="true"
            :action="uploadUrl"
            :limit="15"
            :accept="accept"
            :auto-upload="false"
            :file-list="fileList"
            :data="uploadSetting.data"
            :fileList="fileList"
            :disabled="isdisabled"
            :isSee="isSee"
            :previewlist="previewlist"
            @getfileId="getfileId"
            @delfileId="delfileId"
            @getImgPath="getImgPath"
            @finish="isfinish"
        >
          </Upload>
          <el-checkbox-group v-model="checkList">
            <span v-for="(item,index) in fileids" :key="index">
              <el-checkbox style="width: 128px; margin:0; position: relative; left: 100px;" :value="item" @change="checked(item)"></el-checkbox>
            </span>
          </el-checkbox-group>  
          <!-- <el-checkbox-group v-model="checkList">
            <span v-for="(item,index) in fileids" :key="index">
              <el-checkbox style="width: 155px; margin:0; position: relative; left: 130px;" :value="item" @change="checked(item)"></el-checkbox>
            </span>
          </el-checkbox-group>   -->
        </div>
        <div style="flex:1">
          <div style="width: 90%;height:110px;font-size:15px;display: flex;flex-wrap: wrap;align-content: space-between;" v-if="productId!=0">
            <h3 style="width:100%;font-weight:bold">款式信息</h3>
            <p><el-icon color="#409efc"><Goods /></el-icon>&nbsp;平台：{{ platformlist.join() }}</p>
            <p><el-icon color="#409efc"><QuartzWatch /></el-icon>&nbsp;销售季期：{{ plansaledate }}</p>
          </div>
        </div>
      </div>
      <br>
      <div style="display: flex;justify-content: flex-start; align-items: center; width: 100%; height: 32px;">
        <el-button class="search" type="primary" @click="imageSearch" v-loading.fullscreen.lock="Loading" style="margin-right: 10px;">点击搜索</el-button>
        <el-radio-group v-model="change" @change="handleSearch(change)">
          <el-radio-button label="真维斯图库" value="2" />
          <!-- <el-radio-button label="联营商私有图库" value="1" /> -->
        </el-radio-group>
        <!-- 真维斯图库--查询条件 -->
        <el-form style="display: flex; height: 100%; padding-left: 20px;" v-if="change=='2'&&sklist.length>0">
          <el-form-item label="平台">
            <el-select v-model="search.platformlist" placeholder="请选择" class="size" filterable clearable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" style="width: 200px;">
              <el-option v-for="item in platformList" :key="item.id" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="销售季期" style="margin:0 10px;">
            <el-select v-model="search.plansaledatelist" placeholder="请选择" class="size" filterable clearable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" style="width: 200px;">
              <el-option v-for="item in plansaledateList" :key="item.id" :label="item.id" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="保护期" v-if="productId!=0 && ireState!=null">
            <el-select v-model="search.inProtectDate" placeholder="请选择" class="size" filterable clearable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" style="width: 200px;">
              <el-option v-for="item in protectDates" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="联营商" style="margin:0 10px;">
            <el-select v-model="search.corgcodelist" placeholder="请选择" class="size" filterable clearable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" style="width: 200px;">
              <el-option v-for="item in corgcodeList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 10px">
            <el-button type="primary" @click="handleSearch(change)">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 联营商私有图库--查询条件 -->
        <el-form style="display: flex; height: 100%; padding-left: 20px;" v-if="change=='1'&&rslist.length>0">
          <el-form-item label="销售季期" style="margin:0 10px;">
            <el-select v-model="search.plansaledatelist" placeholder="请选择" class="size" filterable clearable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" style="width: 200px;">
              <el-option v-for="item in plansaledateList" :key="item.id" :label="item.id" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="保护期" v-if="productId!=0 && ireState!=null">
            <el-select v-model="search.inProtectDate" placeholder="请选择" class="size" filterable clearable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" style="width: 200px;">
              <el-option v-for="item in protectDates" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 10px">
            <el-button type="primary" @click="handleSearch(change)">查询</el-button>
          </el-form-item>
        </el-form>
        <el-button class="search" type="primary" @click="createNewBySearchPic" style="margin-left: 10px;" v-if="productId==0" :disabled="!finishUpload">生成商品</el-button>
      </div>
    </div>
    <br />
    <!-- 联营商私有图库搜索（供易连图库） -->
    <div v-if="change=='1'">
      <!-- <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="menuSelect"
      >
      <el-menu-item index="1">供应链图片</el-menu-item>
      <el-menu-item index="2">审款图片</el-menu-item>
      </el-menu> -->
      <!-- 统计 -->
      <div v-if="productId==0">
        <el-row :gutter="16" style="height: 70px; padding-top: 10px;">
          <el-col :xs="24" :sm="12" :md="6" class="text-center mb-4" v-for="(card,index) in countRS" :key="index">
            <el-statistic :value="card.value">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  {{ card.label }}
                </div>
              </template>
              <template #suffix>({{ Math.round((card.value / card.total) * 100) +"%" }})</template>
            </el-statistic>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <el-table :data="countRS" style="padding-top: 10px; font-weight: bold;;">
          <el-table-column prop="type" label="分类" width="180" />
          <el-table-column prop="count1" label="相似度99%~100%" />
          <el-table-column prop="count2" label="相似度95%~99%" />
          <el-table-column prop="count3" label="相似度90%~95%" />
          <el-table-column prop="count4" label="相似度90%以下" />
        </el-table>
      </div>
      <!-- 分割线 -->
      <el-divider style="margin: 15px 0;"/>
      <!-- 供应链图片 -->
      <el-row :gutter="20" class="column" v-if="activeIndex=='1' && rslist.length>0">
        <el-col
          v-for="(item, index) in (isfillterrs ? filledlist:rslist)"
          :key="index"
          :span="24/(viewportWidth/150)"
        >
          <el-card class="box-card" v-if="item[0].intattr==1" @dblclick="editAudit(item[0].itemCode)">
            <template #header>
              <div class="card-header">
                <!-- <span>商品名称：{{ item[0].productName != undefined ?  item[0].productName : ""}}</span>
                &nbsp;&nbsp;&nbsp;&nbsp; -->
                <span>款号：{{ item[0].itemCode != "" ?  item[0].itemCode : "暂未补充款号"}}</span>
              </div>
            </template>
            <el-row :gutter="30" class="row">
              <el-col
                :span="24 / item1.length"
                v-for="(item1, index) in item"
                :key="index"
              >
                <span
                  class="above"
                  @click="handlePictureCardPreview(item1)"
                >
                  <img
                    style="
                      display: inline-block;
                      width: 150px;
                      height: 150px;
                      margin-bottom: 15px;
                    "
                    :src="item1.image"
                    alt="小图加载"
                    @click="previewPic(item1.image)"
                  />
                  <div class="canvas-box"></div>
                </span>
                <!-- 维护一个preview 点击图片 ，将图片src赋值给preview，当preview有值，v-if = true ， 图片查看器显示出来， 关闭的时候，preview = “” -->
                <!-- <el-image-viewer :url-list="[item2.mainitemimageview]" :on-close="closeImageViewer" /> -->
                  <br style="user-select: text" />
                  <div class="text_content">
                  <span v-if="item1.score>=0.95" style="color: coral;font-weight: bold;">{{
                    "相似度:" +
                    (item1.score * 100).toFixed(2) +
                    "%"
                  }}</span>
                  <span v-else style="color: coral">{{
                    "相似度:" +
                    (item1.score * 100).toFixed(2) +
                    "%"
                  }}</span>
                  <br />
                  <span v-if="!greenPlansaledate.includes(item1.plansaledate.split(',').map(Number).sort((a, b) => a - b)[0])"
                    style="color: green">
                    {{ "销售季期:" + item1.plansaledate}}</span>
                  <span v-else>
                    {{ "销售季期:" + item1.plansaledate}}</span>
                  <br />
                  <span>{{ "图片名称:" + item1.fileName }}</span
                  ><br />
                  <!-- <span>{{ "商品编码:" + item1.productCode }}</span
                  ><br />
                  <span>{{ "供应商款号:" + item1.oldItemCode }}</span
                  ><br /> -->
                  <!-- <span
                    >{{ "品牌:" + item1.brandid}}
                  </span>
                  <br /> -->
                  <!-- <span style="color: coral">{{
                    "联营商:" + item1.username
                  }}</span>
                  <br /> -->
                  <!-- <span>{{ "供应商:" + item1.supplierName }}</span
                  ><br /> -->
                  </div>
              </el-col>
            </el-row>
          </el-card>

          <!-- 审款图片（2025.05.21从下方的审款图片整合到供应链图片集中显示） -->
          <el-card class="box-card" v-if="item[0].intattr==2">
            <el-row :gutter="30" class="row">
              <el-col
                :span="24 / item1.length"
                v-for="(item1, index) in item"
                :key="index"
              >
                <span v-if="item1.image != undefined && item1.image != null"
                  class="above"
                  @click="handlePictureCardPreview(item1)"
                >
                  <img
                    style="
                      display: inline-block;
                      width: 150px;
                      height: 150px;
                      margin-bottom: 15px;
                    "
                    :src="item1.image"
                    alt="小图加载"
                  />
                  <div class="canvas-box"></div>
                </span>
                <span v-else
                class="above"
              >
                <img
                  style="
                    display: inline-block;
                    width: 150px;
                    height: 150px;
                    margin-bottom: 15px;
                  "
                  src="https://www.5mku.com/content/templates/SY_theme/lib/img/default.jpg"
                  alt="小图加载"
                />
                <div class="canvas-box"></div>
                </span>
                <br style="user-select: text" />
                <div class="text_content">
                  <span>款号：{{ item1.itemCode }}</span>
                  <br />
                  <span style="color: coral">{{
                    "相似度:" +
                    (item1.score * 100).toFixed(2) +
                    "%"
                  }}</span>
                  <br />
                  <span>{{ "款式描述:" + item1.itemdescr }}</span>
                  <br />
                </div>
              </el-col>
            </el-row>
          </el-card>
          <br />
        </el-col>
      </el-row>
      <!-- 审款图片(2025.05.21以下代码暂停使用并整合到供应链图片中) -->
      <el-row :gutter="20" class="column" v-if="activeIndex=='2'">
      <el-col
        v-for="(item, index) in orgsklist"
        :key="index"
        :span="24/(viewportWidth/150)"
      >
      <el-card class="box-card">
        <!-- <template #header >
          <div class="card-header">
            <span>款号：{{ item.itemcode }}</span>
          </div>
        </template> -->
        <div class="text_content">
          <span v-if="item.url != undefined && item.url != null"
              class="above"
              @click="handlePictureCardPreview(item)"
            >
              <img
                style="
                  display: inline-block;
                  width: 150px;
                  height: 150px;
                  margin-bottom: 15px;
                "
                :src="item.url"
                alt="小图加载"
              />
              <div class="canvas-box"></div>
          </span>
          <span v-else
            class="above"
            @click="handlePictureCardPreview(item2)"
          >
            <img
              style="
                display: inline-block;
                width: 150px;
                height: 150px;
                margin-bottom: 15px;
              "
              src="https://www.5mku.com/content/templates/SY_theme/lib/img/default.jpg"
              alt="小图加载"
            />
            <div class="canvas-box"></div>
          </span>
          <span>款号：{{ item.itemcode }}</span>
          <br />
          <span v-if="item.score>=0.95" style="color: coral;font-weight: bold">{{
            "相似度:" +
            (item.score * 100).toFixed(2) +
            "%"
          }}</span>
          <span v-else style="color: coral">{{
            "相似度:" +
            (item.score * 100).toFixed(2) +
            "%"
          }}</span>
          <br />
          <span>{{ "所属联营商:" + item.orgname }}</span>
          <br /> 
          <span>{{ "款式描述:" + item.itemdescr }}</span>
          <br />
        </div>
      </el-card>
      <br />
    </el-col>
      </el-row>
    </div>

    <!-- 真维斯图库搜索（审款图库） -->
    <div v-else>
      <!-- 统计 -->
      <div v-if="productId==0">
        <el-row :gutter="16" style="height: 70px; padding-top: 10px;">
          <el-col :xs="24" :sm="12" :md="6" class="text-center mb-4" v-for="(card,index) in countSK" :key="index">
            <el-statistic :value="card.value">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  {{ card.label }}
                </div>
              </template>
              <template #suffix>({{ Math.round((card.value / card.total) * 100) +"%" }})</template>
            </el-statistic>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <el-table :data="countSK" style="padding-top: 10px; font-weight: bold;;">
          <el-table-column prop="type" label="分类" width="180"/>
          <el-table-column prop="count1" label="相似度99%~100%" />
          <el-table-column prop="count2" label="相似度95%~99%" />
          <el-table-column prop="count3" label="相似度90%~95%" />
          <el-table-column prop="count4" label="相似度90%以下" />
        </el-table>
      </div>
      <!-- 分割线 -->
      <el-divider style="margin: 15px 0;"/>
      <!-- 结果信息卡片遍历 -->
      <el-row :gutter="20">
        <el-col
          v-for="(item2, index) in (isfilltersk ? filledlist:sklist)"
          :key="index"
          :span="item2.length * 6"
        >
          <el-card class="boxCard">
            <!-- <div >
              <h2 style="font-size: 18px !important">
                  {{ "款号:" + item2.itemcode }}
              </h2>
            </div> -->
            <el-row :gutter="30">
              <!-- <el-col
                :span="24 / item1.length"
                v-for="(item2, index) in item1"
                :key="index"
              > -->
              <el-col>
                <!-- <span
                  class="above"
                  @click="handlePictureCardPreview(item2)"
                >
                  <img
                    style="
                      display: inline-block;
                      width: 150px;
                      height: 150px;
                      margin-bottom: 15px;
                    "
                    src="https://tse2-mm.cn.bing.net/th/id/OIP-C.GV3cbyDCDTj39Ph60a2bKQAAAA?rs=1&pid=ImgDetMain"
                    alt="小图加载"
                  />
                  <div class="canvas-box"></div>
                </span> -->
                  <!-- <br style="user-select: text" /> -->
                  <span>款式{{ index+1 }}</span
                  ><br />
                  <img v-if="corgcodes.includes(item2.orgcode) && corgcodes.every(item => acceptOrgcodes.includes(item))"
                    style="
                      display: inline-block;
                      width: 150px;
                      height: 150px;
                      margin-bottom: 15px;
                    "
                    :src="item2.url"
                    alt="小图加载"
                    @click="previewPic(item2.url)"
                  />
                  <!-- <img v-else
                    style="
                      display: inline-block;
                      width: 130px;
                      height: 130px;
                      margin-bottom: 15px;
                    "
                    src="https://tse2-mm.cn.bing.net/th/id/OIP-C.GV3cbyDCDTj39Ph60a2bKQAAAA?rs=1&pid=ImgDetMain"
                    alt="小图加载"
                  /> -->
                  <br v-if="corgcodes.includes(item2.orgcode) && corgcodes.every(item => acceptOrgcodes.includes(item))" />
                  <span v-if="item2.score2>=0.95" style="color: coral;font-weight: bold">{{
                    "相似度:" +
                    (item2.score2 * 100).toFixed(2) +
                    "%"
                  }}</span>
                  <span v-else style="color: coral">{{
                    "相似度:" +
                    (item2.score2 * 100).toFixed(2) +
                    "%"
                  }}</span>
                  <br />
                  <!-- <span>{{ "款字头:" + item2.bndid }}</span
                  ><br />
                  <span v-if="item2.filemodifier === 'Excel20230427'"
                    >{{ "款号:" + item2.itemcode + "(***)" }}
                  </span>
                  <span v-else>{{ "款号:" + item2.itemcode }} </span
                  ><br />

                  <span
                    v-if="
                      item2.gskItemCode != null &&
                      item2.picItemCode != null
                    "
                  >
                    ({{ item2.gskItemCode }} +
                    {{ item2.picItemCode }})
                    <br />
                  </span>
                  <span>{{ "品牌:" + item2.rbndname }}</span
                  ><br /> -->
                  <span v-if="corgcodes.includes(item2.orgcode)">{{ "款号:" + item2.itemcode }}</span>
                  <br v-if="corgcodes.includes(item2.orgcode)"/>
                  <span v-if="corgcodes.includes(item2.orgcode)">{{ "联营商:" + item2.orgname }}</span>
                  <br v-if="corgcodes.includes(item2.orgcode)"/>
                  <span>{{ "平台:" + item2.platform }}</span
                  ><br />
                  <!-- <span>{{ "季度:" + item2.yeaid }}</span
                  ><br /> -->
                  <!-- <span>{{ "年季:" + item2.yeaid + "0" + item2.seaid }}</span
                  ><br /> -->
                  <!-- <span>{{ "年份季度:" + getSeasonLabel(item2.yeaid,item2.seaid)}}</span
                  ><br /> -->
                  <span v-if="!greenPlansaledate.includes(item2.plansaledate.split(',').map(Number).sort((a, b) => a - b)[0])"
                    style="color: green">
                    {{ "销售季期:" + item2.plansaledate}}</span>
                  <span v-else>
                    {{ "销售季期:" + item2.plansaledate}}</span>
                  <br />
                  <span
                    v-if="
                      item2.state != 'ACCECTED'
                    "
                    >{{ "通过时间:"}}</span>
                  <span
                    v-else-if="
                      item2.state == 'ACCECTED'
                    "
                    >{{ "通过时间:" + item2.accectedTime }}</span>
                  <!-- <span
                    v-else-if="
                      item2.state == 'ACCECTED' &&
                      item2.accectedTimeStatus == 0
                    "
                    >{{ "通过时间:" + item2.accectedTime }}</span>
                  <span
                    v-else-if="
                      item2.state == 'ACCECTED' &&
                      item2.accectedTimeStatus == 1
                    "
                    style="color: red"
                    >{{ "通过时间:" + item2.accectedTime }}</span> -->
              </el-col>
            </el-row>
          </el-card>
          <br />
        </el-col>
      </el-row>

    </div>
  </div>

  <!--查看详细资料-->
  <EditDialog 
    v-model:editVisible="editVisible" 
    v-model:editloading="editloading" 
    :editRow="editRow" 
    :picproductId="productId" 
    :picitemcode="itemcode" 
    :picplansaledate="plansaledate"
    :permission="true" 
    :quickNeed="true" 
    :type="type"
    @close="closeSearch"
    >
  </EditDialog>

  <!-- 图片预览 -->
  <el-image-viewer
    v-if="imgViewerVisible"
    @close="closeImgViewer"
    width="20%"
    :url-list="previewPiclist"
    alt="非图片不能预览"
  />
</template>

<script setup>
import { searchImage,getLastSearchImageResult,getPlatformList,getPlanSaleDate,getCorgcodes } from '@/api/itemaudit/ait001'
import Upload from '@/components/Upload/index.vue'
import { getToken } from '@/utils/auth'
import { uploadUrl } from '@/utils/request'
import { number } from 'echarts'
import { onBeforeUnmount, onMounted, reactive, ref, toRefs, watch } from 'vue'
import getGreenPlansaledate from '@/utils/getGreenPlansaledate'

const props = defineProps({
  imagelist:{
    type: Array,
    default: () => [],
  },
  isClose:{
    type: Boolean,
    default: () => false,
  },
  isSee: {
    type: Boolean,
    default: () => false,
  },
  //为0表示是以图搜图，不为0为预审搜图
  productId: {
    type: number,
    default: () => 0,
  },
  itemcode: {
    type: String,
    default: () => "",
  },
  ireState: {
    type: Number,
    default: () => null,
  },
  plansaledate: {
    type: String,
    default: () => "",
  },
  platformlist: {
    type: Array,
    default: () => [],
  },
  lcdep: {
    type: String,
    default: () => "",
  },
  searchpicResult: {
    type: String,
    default: () => "",
  },
  searchpicTime: {
    type: String,
    default: () => "",
  },

});
const {imagelist,isClose,isSee,productId,itemcode,ireState,plansaledate,platformlist,lcdep,searchpicResult,searchpicTime} = toRefs(props);
const Loading = ref(false)

//允许真维斯搜图查看图片的联营商
const acceptOrgcodes = ref(['AVXS','AVDC','AVTP','AVYL','AVYY'
,'AVYS'
,'AVGL'
,'AVKX'
,'AVNB'
,'AVZL'
,'AVCE'
,'AVFF'
,'AVXW'
,'AVZD'])

const emit = defineEmits(['close','getAll']);

const imgViewerVisible = ref(false)
const previewPiclist = ref([]) //处理图片的预览列表

const previewlist = ref([]) //图片预览列表
const checkList = ref([])
const isdisabled = ref(false)
const accept = import.meta.env.VITE_ACCEPT

const countSK = ref([
  {
    label:"相似度99%~100%",
    value:0,
    total:1
  },
  {
    label:"相似度95%~99%",
    value:0,
    total:1
  },
  {
    label:"相似度90%~95%",
    value:0,
    total:1
  },
  {
    label:"相似度90%以下",
    value:0,
    total:1
  },
])

const countRS = ref([
  {
    label:"相似度99%~100%",
    value:0,
    total:1
  },
  {
    label:"相似度95%~99%",
    value:0,
    total:1
  },
  {
    label:"相似度90%~95%",
    value:0,
    total:1
  },
  {
    label:"相似度90%以下",
    value:0,
    total:1
  },
])

let protectDates = ref([
  {
    label:"保护期内",
    value: 1
  },
  {
    label:"保护期外",
    value: 2
  }
])

const search = ref({
  platformlist:[],
  plansaledatelist:[],
  inProtectDate:[1],
  corgcodelist:[]
})

let uploadSetting = reactive({
  headers: {
    'Authorization-admin': getToken(),
    tenant: 'MDAwMA=='
  },
  data: {
    folderId: 1,
  }
})
const greenPlansaledate = ref([])

const type = ref(2)
const editRow = ref({})
const editloading = ref(false)
const editVisible = ref(false)

const viewportWidth = ref(0)
let resizeTimer = null
const finishUpload = ref(false)

onMounted(() => {
    getPlatform()
    getPlanSaleDateList()
    updateViewportSize();
    window.addEventListener('resize', handleResize);
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
});

function previewPic(url){
  imgViewerVisible.value = true
  previewPiclist.value = [url]
  console.log('预览图片的url和previewPiclist',url,previewPiclist.value);
}

function closeImgViewer(){
  console.log('关闭预览');
  imgViewerVisible.value = false
}

const createNewBySearchPic = () =>{
  //以图搜图新增
  type.value = 5
  editVisible.value = true
  //获取勾选的那张作为主图
  console.log('选择的图',checkList.value);
  let sysfile = imgpath.value.filter(item => checkList.value.includes(item.fileid)).map((item) => {return {url:item.path,fscode:item.path,fileid:item.fileid,id:item.fileid};});
  let sysfilefu = imgpath.value.filter(item => !checkList.value.includes(item.fileid)).map((item) => {return {url:item.path,fscode:item.path,fileid:item.fileid,id:item.fileid};});
  editRow.value = {
    itemcode:"",
    productId:0,
    sysfile:sysfile,
    sysfilefu:sysfilefu
  }
  console.log('以图搜图生成商品的editRow', editRow.value);
}

const editAudit = (code) => {
  console.log('款号款式',ireState.value);
  if(productId.value!=0&&itemcode.value!=''
    &&code.split('-')[2].slice(0, 3)==itemcode.value.split('-')[2].slice(0, 3)
    &&(ireState.value==null||ireState.value==11)){
    //只有款号的后六位的前三位，也就是大类品种类别相同以及品牌方状态为待补充资料或已补充资料,因为其他状态不能复制，都已经送批了，送批的商品不能修改补充资料，并且不是以图搜图
    //预审搜图可复制
    type.value = 2
  }else if(productId.value==0){
    //以图搜图
    type.value = 3
  }else{
    //预审搜图不可复制
    type.value = 0
  }
  editVisible.value = true
  editloading.value = true
  editRow.value = {
    itemcode:code,
    productId:0,
    ireState:3//默认都是通过不给予编辑权限，只读
  }
}

const checked = (val) => {
  checkList.value = [val] //改为单选
  if(productId.value!=0){
    getLastSearchpicResult()
  }
  console.log('修改后的checkList.value',checkList.value,val);
}

const getSeasonLabel = (yeaid,seaid) => {
  console.log('销售季期',yeaid,seaid);
    
    const yearCode = String(yeaid).slice(2)
    const seasonCode = seaid; // 获取后两位
    const seasonMap = {
      1: '[春季]',
      2: '[夏季]',
      3: '[秋季]',
      4: '[冬季]'
    };
    
    return yearCode + seasonMap[seasonCode] || '暂无季期';
  }

const updateViewportSize = () => {
  viewportWidth.value = window.innerWidth;
};

const handleResize = () => {
  // 清除之前的定时器
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  // 设置新的定时器
  resizeTimer = setTimeout(() => {
    updateViewportSize();
  }, 0); // 防抖时间设置为200毫秒
};

let change = ref('2')

const fileList = ref([])
const fileids = ref([])
const rslist = ref([])
const sklist = ref([])
const orgsklist = ref([])
const imgpath = ref([]) //存放图片上传成功后路径的数组

const activeIndex = ref('1')

const getfileId = (val) =>{
  // fileids.value.unshift(val) //以图搜图为了能让fileid跟图片一对一对应，每新增一张图，应该是往数组前面增
  fileids.value.push(val)
  console.log("getfileId123456",fileids.value)
}

const delfileId = (val) =>{
  // fileid1.value=[]
  // fileid1.value.splice(fileid1.value.indexOf(val),1)
  fileids.value = val
  imgpath.value = imgpath.value.filter(item => fileids.value.includes(item.fileid))
  console.log("delfileId123456",fileids.value,imgpath.value)
}

const getImgPath = (val) => {
  imgpath.value.push(val);
  console.log("图片路径", imgpath.value)
}

const isfinish = (val) => {
  finishUpload.value = val //上传完图片开启生成商品功能
    if(val){
      //当全部图片上传完，默认勾选第一个
      if(checkList.value.length==0){
        checkList.value = [fileids.value[0]];
        console.log('勾选的图片',checkList.value);
      }
    }
  }

const closeSearch = () =>{
  emit('close');
  if(productId.value==0){
    emit('getAll');
  }
  isfilltersk.value = false
  isfillterrs.value = false
  finishUpload.value = false  
  rslist.value = []
  sklist.value = []
  orgsklist.value = []
  imgpath.value = []
  activeIndex.value = '1'
  countSK.value = ([
  {
    label:"相似度99%~100%",
    value:0,
    total:1
  },
  {
    label:"相似度95%~99%",
    value:0,
    total:1
  },
  {
    label:"相似度90%~95%",
    value:0,
    total:1
  },
  {
    label:"相似度90%以下",
    value:0,
    total:1
  },
])
  countRS.value = ([
  {
    label:"相似度99%~100%",
    value:0,
    total:1
  },
  {
    label:"相似度95%~99%",
    value:0,
    total:1
  },
  {
    label:"相似度90%~95%",
    value:0,
    total:1
  },
  {
    label:"相似度90%以下",
    value:0,
    total:1
  },
])
  resetSearch()
}

function resetSearch(){
  search.value = {
    platformlist:[],
    plansaledatelist:[],
    inProtectDate:[],
    corgcodelist:[]
  }
  previewlist.value = []
}

const getLastSearchpicResult = async () => {
  if(searchpicResult!=""){
    Loading.value = true
    let param = {
      productId:productId.value,
      fileids:checkList.value,
      protectdates:greenPlansaledate.value,
      ireState:ireState.value
    }
    if(ireState.value==null){
      resetSearch()
    }
    await getLastSearchImageResult(param).then((res)=>{
      console.log('获取之前搜图结果的res',res);
      filledlist.value = []
      countSK.value = []
      countSK.value = res.data.countSK
      countRS.value = []
      countRS.value = res.data.countRS
      sklist.value = res.data.sklist
      rslist.value = res.data.rslist

      // let searchPicResults = []
      // searchPicResults = res.data.searchPicResult
      //处理总计
      // if(sklist.value.length>0&&searchPicResults.length>0){
      //   let numbers = []
      //   searchPicResults.forEach(s=>{
      //     const parts = s.split('；').map(part => part.trim());
      //     let numbers1 = parts.map(part => {
      //       const num = part.match(/\d+/);
      //       return num ? parseInt(num[0], 10) : null;
      //     }).filter(num => num !== null);
      //     if(numbers.length>0){
      //       numbers = numbers.map((num, index) => num + numbers1[index]);
      //     }else{
      //       numbers = numbers1
      //     }
      //   })
      //   console.log('numbers',numbers);
      //   if(numbers.length>0){
      //     // 3. 计算总和
      //     const sum = numbers.reduce((total, num) => total + num, 0);
      //     const labelList = ["分类","相似度99%~100%","相似度95%~99%","相似度90%~95%","相似度90%以下"]
      //     for(let i = 0; i<numbers.length; i++){
      //       if(i==0){
      //         countSK.value.push({
      //           label:labelList[i],
      //           value:numbers[i],
      //           total:sum   
      //         })
      //       }else{
      //         countSK.value.push({
      //           label:labelList[i],
      //           value:numbers[i],
      //           total:sum   
      //         })
      //       }
      //     }
      //   }
      // }
      handleSearch(change.value)
      Loading.value = false
    }).catch((err) => {
      Loading.value = false
      console.error("获取之前搜图结果的错误",err)
    })
  }
}

const corgcodes = ref([])
const corgcodeList = ref([])
async function getCorgcodesList(){
  await getCorgcodes(productId.value).then(res => {
    console.log('合作联营商列表',res);
    corgcodes.value = res.data.corgcodes
    corgcodeList.value = res.data.corgcodeList
  }).finally(() => {
  })
}

const imageSearch = async (val) =>{
  Loading.value = true
  isfilltersk.value = false
  isfillterrs.value = false
  console.log('checkList',checkList.value);
  if(checkList.value.length==0){
    ElMessage.warning("没有选择图片");
    Loading.value=false
    return;
  }
  let param = {
      fileids:checkList.value,
      productId:productId.value,
      lcdep:lcdep.value
  }
  console.log('预审搜图的参数',param);
  await searchImage(param).then((res)=>{
      console.log('预审搜图的res',res);
      rslist.value = res.data.rslist
      sklist.value = res.data.sklist
      orgsklist.value = res.data.orgsklist
      countSK.value = res.data.countSK
      countRS.value = res.data.countRS
      if(productId.value!=0){
        getLastSearchpicResult()
      }
      console.log('rslist,sklist,orgsklist',rslist.value,sklist.value,orgsklist.value);
      Loading.value = false
  }).catch((err) => {
    Loading.value = false
    console.error("预审搜图的错误",err)
  })
}

const isfilltersk = ref(false)
const isfillterrs = ref(false)
const filledlist = ref([])
const handleSearch = (change) => {
  let handleList = change=="2" ? sklist.value : change=="1" ? rslist.value : []
  console.log('触发查询筛选',change,search.value,greenPlansaledate.value,handleList);
  if(handleList.length>0){
    if(search.value.platformlist.length>0 || search.value.plansaledatelist.length>0 || search.value.inProtectDate.length>0 || search.value.corgcodelist.length>0){
      if(change=="2"){
        isfilltersk.value = true
        isfillterrs.value = false
      }else if(change=="1"){
        isfillterrs.value = true
        isfilltersk.value = false
      }
      filledlist.value = []
      filledlist.value = handleList.filter((d) => {
        let platformValidate = false
        let plansaledateValidate = false
        let protectDateValidate = false
        let corgcodeValidate = false

        if(search.value.platformlist.length>0){
          //平台过滤
          if(d.platform.indexOf(',') !== -1){
            //处理多个平台
            const strArray = d.platform.split(',').filter(item => item.trim() !== '').map(item => item.trim());
            platformValidate = strArray.some(item => search.value.platformlist.includes(item))
          }else{
            platformValidate = search.value.platformlist.includes(d.platform)
          }
        }else{
          platformValidate = true
        }

        if(search.value.plansaledatelist.length>0){
          let saledate = change=="2" ? d.plansaledate : change=="1" ? d[0].plansaledate : ""
          //销售季期过滤
          if(saledate.indexOf(',') !== -1){
            //处理多个销售季期
            const strArray = saledate.split(',').filter(item => item.trim() !== '').map(item => item.trim());
            plansaledateValidate = strArray.some(item => search.value.plansaledatelist.includes(item))
          }else{
            plansaledateValidate = search.value.plansaledatelist.includes(saledate)
          }
        }else{
          plansaledateValidate = true
        }

        if(search.value.inProtectDate.length>0){
          let saledate = change=="2" ? d.plansaledate : change=="1" ? d[0].plansaledate : ""
          //销售季期按保护期过滤
          if(saledate.indexOf(',') !== -1){
            //处理多个销售季期，只取第一个，最小的一个
            const firstPlansaledate = saledate.split(',').map(Number).sort((a, b) => a - b)[0]
            if(search.value.inProtectDate.length==1 && search.value.inProtectDate.indexOf(1)!=-1){
              //只看保护期内
              protectDateValidate = greenPlansaledate.value.includes(firstPlansaledate)
            }else if(search.value.inProtectDate.length==1 && search.value.inProtectDate.indexOf(2)!=-1){
              //只看保护期外
              protectDateValidate = !greenPlansaledate.value.includes(firstPlansaledate)
            }else{
              //都看（全选或全不选）
              protectDateValidate = true
            }
          }else{
            //处理单个销售季期
            if(search.value.inProtectDate.length==1 && search.value.inProtectDate.indexOf(1)!=-1){
              //只看保护期内
              protectDateValidate = greenPlansaledate.value.includes(+saledate)
            }else if(search.value.inProtectDate.length==1 && search.value.inProtectDate.indexOf(2)!=-1){
              //只看保护期外
              protectDateValidate = !greenPlansaledate.value.includes(+saledate)
            }else{
              //都看（全选或全不选）
              protectDateValidate = true
            }
          }
        }else{
          protectDateValidate = true
        }

        if(search.value.corgcodelist.length>0){
          //合作联营商过滤
          corgcodeValidate = search.value.corgcodelist.includes(d.orgcode)
        }else{
          corgcodeValidate = true
        }

        return platformValidate && plansaledateValidate && protectDateValidate && corgcodeValidate
      })
    }else{
      isfilltersk.value = false
      isfillterrs.value = false
      filledlist.value = []
    }
  }else{
    ElMessage.warning("没有搜图结果");
  }
}

const menuSelect = (key,keyPath) => {
  console.log("点击菜单",key, keyPath)
  activeIndex.value = key
}

let platformList = ref([])
async function getPlatform(){
  await getPlatformList().then(res => {
    console.log('平台列表',res);
    platformList.value = res.data
  }).finally(() => {
  })
}

let plansaledateList = ref([])
async function getPlanSaleDateList(){
  await getPlanSaleDate().then((res) => {
    console.log('销售季期的res',res);
    plansaledateList.value = res.data
  })
}

async function handlePlansaledate(){
  // greenPlansaledate.value = []
  // if(plansaledate.value!=""){
  //   // 1. 按逗号分割字符串
  //   let arr = plansaledate.value.split(',');
  //   // 2. 将字符串数组转换为数字数组
  //   arr = arr.map(Number);
  //   // 3. 对数字数组进行升序排序
  //   arr.sort((a, b) => a - b);
  //   // 4. 将最小的以及前后两个月的销售季期存入数组
  //   let minplansaledate = arr[0].toString()

  //   const year = 2000 + parseInt(minplansaledate.substring(0,2));
  //   const month = parseInt(minplansaledate.substring(2)) - 1;
  //   const baseDate = new Date(year, month);
    
  //   for (let i = -2; i <= 2; i++) {
  //     const date = new Date(baseDate);
  //     date.setMonth(date.getMonth() + i);

  //     // 格式化为YYMM（自动处理跨年/跨月）
  //     const formattedYear = (date.getFullYear() - 2000).toString().padStart(2, '0');
  //     const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  //     let final = formattedYear + formattedMonth
  //     greenPlansaledate.value.push(+final);
  //   }
  // }
  // console.log('搜图的绿色销售季期列表',greenPlansaledate.value,plansaledate.value);
  greenPlansaledate.value = getGreenPlansaledate(plansaledate.value)
  console.log('搜图的绿色销售季期列表',greenPlansaledate.value,plansaledate.value);
}

watch(
  () => imagelist, (newVal) => {
    console.log("imagelist--newVal",newVal.value)
    fileList.value=newVal.value
    fileids.value=[]
    fileList.value.forEach(i => {
      fileids.value.push(i.fileid)
    });
    checkList.value = [fileids.value[0]]; //默认第一个，记住别用push，不然会出现能默认勾选第一个，但是点击勾选框想要取消勾选时第一次却无法取消勾选，点第二次才行，之后的第三次第四次都很正常的情况。
    previewlist.value = []
    fileList.value.forEach(f=>{previewlist.value.push(f.url)})
    // imageSearch()
    console.log('监听的fileList和fileids',fileList.value,fileids.value);
}, { immediate: false, deep: true })

watch(
  () => isClose, (newVal) => {
    console.log('isClose的监听',newVal);
    // if(newVal){
    console.log('关闭了弹窗');
    checkList.value = []
    rslist.value = []
    sklist.value = []
    orgsklist.value = []
    activeIndex.value = '1'
    change.value = '2'
    greenPlansaledate.value = []
    // }
}, { immediate: true, deep: true })

watch(
() => isSee, (newVal) => {
  console.log("isSee的newval",newVal.value)
  isdisabled.value=newVal.value
}, { immediate: true, deep: true },)

// watch(
// () => plansaledate, (newVal) => {
//   handlePlansaledate()
// }, { immediate: true, deep: true },)

watch(
() => productId, (newVal) => {
  console.log('传来的商品id',productId.value);
  getCorgcodesList()
  if(productId.value!=0){
    search.value.inProtectDate=[1]
    if(greenPlansaledate.value.length==0){
      handlePlansaledate()
      getLastSearchpicResult();
    }else{
      getLastSearchpicResult();
    }
  }else{
    resetSearch()
  }
}, { immediate: true, deep: true },)
</script>

<style lang="scss" scoped>
.top{
    display: flex;
    justify-content: space-between;
}
// .search{
//     background-color: rgb(114, 188, 238);
//     // font-weight: bold;
//     color: white;
// }
.card-header{
    display: flex;
    justify-content: center;
}
.column {
  display: flex;
  flex-wrap: wrap;
}
.row{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
}
.text_content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    span{
        text-align: center;
    }
}

:deep(.el-upload-list--picture-card .el-upload-list__item-status-label){
  visibility: hidden;
}

:deep(.el-upload-list) {
  --el-upload-picture-card-size: 120px;
}

:deep(.el-upload){
  --el-upload-picture-card-size: 120px;
}
</style>