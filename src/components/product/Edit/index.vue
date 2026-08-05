<template>
    <div>
        <el-dialog v-model="editVisible" :align-center="true" width="1417px" center :close-on-click-modal="false"
            @close="closeModalEdit">
            <!-- 自定义标题插槽 -->
              <template #header>
                <div class="custom-dialog-header">
                  <!-- 左侧文字 -->
                  <div class="header-left">
                    <span>{{skform.itemcode}}</span>
                  </div>

                  <!-- 中间标题 -->
                  <div class="header-center">
                    编辑
                  </div>

                  <!-- 右侧文字 -->
                  <div class="header-right">
                  </div>
                </div>
              </template>
            <el-card style="margin-top: 1%;" v-loading="editloading">
                <div style="height:28vw;overflow-y:auto; overflow-x: hidden;">
                    <el-form :inline="true" :model="skform" label-width="200px" ref="formItem" class="elform"  :rules="rules">
                      <el-form-item label="商品id">
                        <el-input v-model="skform.productId" disabled v-if="type==1"></el-input>
                        <el-input disabled v-else></el-input>
                      </el-form-item>
                      <!-- <el-form-item label="品牌">
                      <el-input v-model="skform.brand" disabled></el-input>
                    </el-form-item> -->
                      <!-- <el-form-item label="品牌" required>
                        <el-select v-model="skform.brand" collapse-tags clearable placeholder="请选择品牌" size="large"
                          class="size">
                          <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.brandName" />
                        </el-select>
                      </el-form-item> -->
                      <el-form-item label="品牌" required>
                        <el-input v-model="skform.brand" disabled placeholder="系统生成"></el-input>
                        <!-- <el-select v-model="skform.bndId" collapse-tags clearable placeholder="系统生成" size="large"
                          class="size" disabled>
                          <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select> -->
                      </el-form-item>
                      <el-form-item label="供应商名称" required v-if="!quickNeed">
                        <el-input v-model="skform.supplierName" disabled></el-input>
                      </el-form-item>
                      <!-- <el-form-item label="公司">
                        <el-input v-model="skform.company" :disabled="isDisabled"></el-input>
                      </el-form-item> -->
                      <!-- <el-form-item label="组织">
                        <el-input v-model="skform.orgin" disabled></el-input>
                      </el-form-item> -->
                      <el-form-item label="组织" prop="orgin" required>
                        <el-select v-model="skform.orgin" placeholder="请选择" size="large" class="size" clearable :disabled="isDisabled" filterable @change="validateplansaledateChange">
                          <el-option v-for="item in orglist" :key="item.id" :label="item.name"
                            :value="item.id" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="款字头">
                        <el-input v-model="skform.bndId" disabled></el-input>
                      </el-form-item>
                      <!-- <el-form-item label="年份">
                        <el-input v-model="skform.year" :disabled="isDisabled"></el-input>
                      </el-form-item>
                      <el-form-item label="季度">
                        <el-input v-model="skform.quarter" :disabled="isDisabled"></el-input>
                      </el-form-item> -->
                      <el-form-item label="年份季度">
                        <el-input v-model="skform.yearquarter" :disabled="formdisabled"></el-input>
                      </el-form-item>
                      <el-form-item label="性别" required>
                        <el-select v-model="skform.sex" placeholder="请选择" size="large" class="size" clearable
                          :disabled="formdisabled">
                          <el-option label="男" value="男"></el-option>
                          <el-option label="女" value="女"></el-option>
                          <el-option label="不适用" value="不适用"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="大类" required>
                        <el-select v-model="skform.lcName" placeholder="请选择" size="large" class="size" clearable
                          :disabled="formdisabled">
                          <el-option v-for="item in lclist" :key="item.lcName" :label="item.lcName" :value="item.lcName" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="品种" required>
                        <el-select v-model="skform.depName" placeholder="请选择" size="large" class="size" clearable
                          :disabled="formdisabled">
                          <el-option v-for="item in deplist" :key="item.depName" :label="item.depName" :value="item.depName" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="类别" prop="scName" required>
                        <el-select v-model="skform.scName" placeholder="请选择" size="large" class="size" clearable
                          :disabled="isDisabled">
                          <el-option v-for="item in sclist" :key="item.scName" :label="item.scName" :value="item.scName" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="成人/童装" prop="isAdult" required>
                        <el-select v-model="skform.isAdult" placeholder="请选择" size="large" class="size" clearable
                        :disabled="isDisabled">
                          <el-option label="成人" value="成人"></el-option>
                          <el-option label="童装" value="童装"></el-option>
                          <el-option label="不適用" value="不適用"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="拍摄款">
                        <el-select v-model="skform.isshooting" placeholder="请选择" size="large" class="size" clearable disabled>
                          <el-option label="是" value="1"></el-option>
                          <el-option label="否" value="0"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="商品名称" prop="productName" required>
                        <el-input v-model="skform.productName" :disabled="!quickNeed || isDisabled"></el-input>
                      </el-form-item>
                      <el-form-item label="销售渠道" prop="salechannellist" required>
                        <el-select v-model="skform.salechannellist" placeholder="请选择" size="large" class="size" clearable :disabled="!quickNeed || isDisabled">
                          <el-option label="联营店" value="LYD"></el-option>
                          <el-option label="联营款" value="ZYD"></el-option>
                          <el-option label="联营专供" value="LYZG"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="款号" prop="itemcode" required>
                        <el-input v-model="skform.itemcode" @blur="validateInput" :disabled="isDisabled||skform.ireState==11"></el-input>
                      </el-form-item>
                      <el-form-item label="基本/非基本" prop="isBase" required>
                        <el-select v-model="skform.isBase" placeholder="请选择" size="large" class="size" clearable :disabled="isDisabled">
                          <el-option label="基本" value="基本"></el-option>
                          <el-option label="非基本" value="非基本"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="品种细分">
                        <el-input v-if="skform.ireState!=null&&skform.ireState!=''&&skform.ireState!=11" v-model="skform.priceName" disabled/>
                        <el-select v-else v-model="skform.priceName" placeholder="请选择" size="large" class="size" clearable :disabled="isDisabled">
                          <el-option v-for="item in pricelist" :key="item.priceName" :label="item.priceName"
                            :value="item.priceName" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="销售季期" prop="plansaledate">
                        <el-input v-model="skform.plansaledate" :disabled="isDisabled"></el-input>
                      </el-form-item>
                      <el-form-item label="平台" prop="platformlist" required>
                        <!-- <el-input v-model="skform.platformlist"></el-input> -->
                        <el-select v-model="skform.platformlist" placeholder="请选择" size="large" class="size" clearable multiple :disabled="isDisabled" 
                        collapse-tags collapse-tags-tooltip :max-collapse-tags="1" @change="validateplansaledateChange">
                          <el-option v-for="item in platformList" :key="item.id" :label="item.name"
                            :value="item.name" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="组合款/换款号" prop="isCombo" required>
                        <el-select v-model="skform.isCombo" placeholder="请选择" size="large" class="size" clearable disabled>
                          <el-option label="正常款" value="正常款" default></el-option>
                          <!-- <el-option label="组合款" value="组合款"></el-option> -->
                          <!-- <el-option label="换款号" value="换款号"></el-option> -->
                        </el-select>
                      </el-form-item>
                      <el-form-item label="开发渠道" prop="devChannelList" required>
                        <!-- <el-select v-model="skform.devChannelList" placeholder="请选择" size="large" class="size" clearable :disabled="isDisabled">
                          <el-option v-for="item in devChannelList" :key="item.id" :label="item.name"
                            :value="item.id" />
                        </el-select> -->
                        <el-cascader
                          class="size"
                          v-model="skform.devChannelList"
                          :options="devChannelList"
                          :props="dynamicProps"
                          placeholder="请选择"
                          ref="cascaderRef"
                          collapse-tags
                          clearable
                          :disabled="isDisabled"
                        />
                      </el-form-item>
                      <el-form-item label="分类二" prop="poitemclass" required>
                        <el-select v-model="skform.poitemclass" placeholder="请选择" size="large" class="size" clearable :disabled="isDisabled">
                          <el-option v-for="item in poItemClassList" :key="item.id" :label="item.name"
                            :value="item.name" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="图片编号">
                        <el-input v-model="skform.imgnumberlist" :disabled="isDisabled"></el-input>
                      </el-form-item>
                      <!-- <el-form-item label="印花大小/品種/位置是否有变" required>
                        <el-select v-model="skform.diff" placeholder="请选择" size="large" class="size" clearable>
                          <el-option label="是" value="是"></el-option>
                          <el-option label="否" value="否"></el-option>
                        </el-select>
                      </el-form-item> -->
                      <el-form-item label="光身款/原本款号" v-if="skform.isCombo!='正常款'">
                        <el-input v-model="skform.picitemcode" disabled></el-input>
                      </el-form-item>
                      <el-form-item label="图案款号1" v-if="skform.isCombo!='正常款'">
                        <el-input v-model="skform.picitemcode1" disabled></el-input>
                      </el-form-item>
                      <!-- <el-form-item label="图案款号2" v-if="skform.isCombo!='正常款'">
                        <el-input v-model="skform.picitemcode2" :disabled="isDisabled"></el-input>
                      </el-form-item>
                      <el-form-item label="图案款号3" v-if="skform.isCombo!='正常款'">
                        <el-input v-model="skform.picitemcode3" :disabled="isDisabled"></el-input>
                      </el-form-item>
                      <el-form-item label="图案款号4" v-if="skform.isCombo!='正常款'">
                        <el-input v-model="skform.picitemcode4" :disabled="isDisabled"></el-input>
                      </el-form-item> -->
                      <!-- <el-form-item label="副图">
                      <Upload ref='uploadRef' :multiple="false" :action="uploadUrl" :limit="5" :maxSize="5"
                        :accept="uploadSetting.accept" :file-list="batchFileList" :fileList="fileList" @getfileId="getfileId"
                        @delfileId="delfileId">
                        <template #tip>
                          <div class="el-upload__tip">
                            只能上传xlsx,.xls,.png,.jpg'文件，且不超过10M
                          </div>
                        </template>
                      </Upload>
                    </el-form-item> -->
                    <el-form-item label="店铺">
                        <el-input v-model="skform.shopname" :disabled="isDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="关键词">
                        <el-input v-model="skform.keywordlist" :disabled="isDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" style="width: 1255px;">
                        <el-input v-model="skform.remark" :disabled="isDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="主款号">
                        <el-input v-model="skform.masteritemcode" :disabled="isDisabled"></el-input>
                    </el-form-item>
                    <span v-if="skform.ireState!=null">
                      <el-form-item label="最后修改时间">
                        <el-input v-model="skform.skmodified" disabled></el-input>
                      </el-form-item>
                      <el-form-item label="特批原因">
                        <el-select v-model="skform.specialApprovalId" placeholder="" size="large" class="size" clearable disabled>
                          <el-option v-for="item in specialApprovalIdReasons" :key="item.id" :label="item.name"
                            :value="item.id" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="形象拍摄款">
                        <el-select v-model="skform.isImageshooting" placeholder="" size="large" class="size" clearable disabled>
                          <el-option v-for="item in isImageshootingOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="审批次数">
                        <el-input v-model="skform.isReview" disabled></el-input>
                      </el-form-item>
                      <el-form-item label="否决原因">
                        <el-select v-model="skform.rejectreasonid" placeholder="" size="large" class="size" clearable disabled>
                          <el-option v-for="item in rejectReasons" :key="item.id" :label="item.name"
                            :value="item.id" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="暂缓原因">
                        <el-select v-model="skform.suspendreasonid" placeholder="" size="large" class="size" clearable disabled>
                          <el-option v-for="item in suspendReasons" :key="item.id" :label="item.name"
                            :value="item.id" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="申诉原因">
                        <el-input v-model="skform.appealreasonid" disabled></el-input>
                      </el-form-item>
                      <el-form-item label="状态">
                        <el-select v-model="skform.ireState" placeholder="待补充资料" size="large" class="size" clearable disabled>
                          <el-option v-for="item in ireStateOptions" :key="item.id" :label="item.label"
                            :value="item.id" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="审批导出">
                        <el-select v-model="skform.endDerive" placeholder="" size="large" class="size" clearable disabled>
                          <el-option v-for="item in endDeriveOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="创建时间">
                        <el-input v-model="skform.createTime" disabled></el-input>
                      </el-form-item>
                      <el-form-item label="创建人">
                        <el-input v-model="skform.skcreater" disabled></el-input>
                      </el-form-item>
                      <el-form-item label="最后修改人">
                        <el-input v-model="skform.skmodifier" disabled></el-input>
                      </el-form-item>
                    </span>
                    <el-form-item label="主图" style="width:100%;font-weight:bold" required>
                      <Upload ref='uploadRef' :multiple="true" :action="uploadUrl" :limit="1" :accept="accept"
                        :file-list="zmfileList" :data="uploadSetting.data" v-model:fileList="zmfileList" @getfileId="getzmfileId"
                        @delfileId="delzmfileId" :type="['jpg', 'png', 'jpeg']" :imgtype=1 :previewlist="previewlist"
                        :isSee="isDisabled">
                      </Upload>
                    </el-form-item>
                    <el-form-item label="副图" style="width:100%;font-weight:bold">
                      <Upload ref='uploadRef' :multiple="true" :action="uploadUrl" :limit="14" :accept="accept"
                        :file-list="fmfileList" :data="uploadSetting.data" v-model:fileList="fmfileList" @getfileId="getfmfileId"
                        @delfileId="delfmfileId" :type="['jpg', 'png', 'jpeg']" :imgtype=2 :previewlist="previewlist"
                        :isSee="isDisabled">
                    </Upload>
                    </el-form-item>
                    <div style="width:200px;text-align:right;color:blue;cursor:pointer" @click="openHandlePic" v-if="!isDisabled"><u>AI处理图片</u></div>
                    </el-form>
                </div>
                <div style="height: 8vw; overflow:auto; padding-left:10%; font-size:large; line-height:24px" v-if="type==1&&(SKHistroy.length>0)">
                  <!-- <div style="margin-bottom: 15px;margin-top: 20px; font-weight:bold">审批历程:</div>
                  <li v-for="(item, index) of history" :key="index" style="font-size: smaller;">{{ item }}</li> -->
                  <div v-if="SKHistroy.length>0" style="margin-bottom: 15px;margin-top: 20px; font-weight: bold;">-- 品牌方审批历程:</div>
                  <li v-for="(item, index) of SKHistroy" :key="index" style="font-size: smaller;">{{ item }}</li>
                  <!-- <div>2023-12-19 ......</div> -->
                </div>
                <div v-if="type==3">
                  <el-card  style="margin:10px 0 10px 0">
                    <el-form :inline="true" :model="addform" label-width="200px">
                      <el-form-item label="新增款款号" required>
                          <el-input v-model="addform.itemcode"></el-input>
                      </el-form-item>
                      <el-form-item label="新增款商品名称" required>
                          <el-input v-model="addform.productName"></el-input>
                      </el-form-item>
                      <el-form-item label="新增款销售季期">
                          <el-input v-model="addform.plansaledate"></el-input>
                      </el-form-item>
                    </el-form>
                  </el-card>
                </div>
                <div class="auditbuttonmain">
                  <div>
                    <el-button type="primary" @click="editSaveWithMatchCheck" :disabled="!plansaledateVal" v-if="!isDisabled&&type!=5&&skform.ireState==null">保存</el-button>
                    <!-- <el-button type="primary" @click="editSaveAndConfirm" :disabled="!plansaledateVal" v-if="!isDisabled&&type!=5&&skform.ireState==null">保存后直接送批</el-button> -->
                    <el-button type="primary" @click="updateSave" :disabled="!plansaledateVal" v-if="!isDisabled&&type!=5&&skform.ireState==11">保存</el-button>
                    <el-button type="primary" @click="copySave(picproductId,picitemcode)" :disabled="!plansaledateVal" v-if="type==2">复制</el-button> <!--!greenPlansaledate.includes(skform.plansaledate.split(',').map(Number).sort((a, b) => a - b)[0])-->
                    <el-button type="primary" @click="addSave" :disabled="!plansaledateVal" v-if="type==3">新增</el-button>
                    <el-button type="primary" @click="createNew" :disabled="!plansaledateVal" v-if="type==5">生成商品</el-button>
                    <el-button type="primary" @click="closeModalEdit">关闭</el-button>
                  </div>
                </div>
            </el-card>
        </el-dialog>
    <!-- 展示错误信息 -->
    <ShowErrorDialog v-model:errorDialogVisable="errorDialogVisable" :tableData="errorList"></ShowErrorDialog>
    <!-- AI去背景图 -->
    <el-dialog
      v-model="HandlePicVisible"
      title="AI处理图片"
      center
      width="920"
      :before-close="HandlePicClose"
      :close-on-click-modal="false"
      >
      <div v-if="allPiclist.length>0" style="height: 550px;overflow: auto">
        <el-card style="margin:10px 0 10px 0; display:flex;justify-content: space-around;flex-wrap: wrap;height:220px">
          <el-row>
            <el-checkbox-group v-model="checkList" v-for="(item, index) in allPiclist" :key="index">
              <el-row>
                <el-checkbox :value="item.fileid" label="选择处理" @change="checked(item.fileid)"></el-checkbox>
              </el-row>
              <el-row>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="单击预览图片"
                  placement="bottom"
                >
                  <img
                    style="
                      display: inline-block;
                      width: 150px;
                      height: 150px;
                      margin: 10px 5px 10px 5px;
                      border:2px grey solid;
                    "
                    :src="item.url"
                    alt="小图加载"
                    @click="previewPic(item.url)"
                  />
                </el-tooltip>
              </el-row>
            </el-checkbox-group>
          </el-row>
        </el-card>
        <el-card style="display:flex;justify-content: space-around;flex-wrap: wrap;height:300px">
          <div style="display:flex;height:20px">
            <div style="width: 300px; text-align:center">原图</div>
            <div class="AIbutton"></div>
            <div style="width: 300px; text-align:center">结果图</div>
          </div>
          <el-row v-if="checkList.length>0" class="handleimg">
            <div style="width: 300px; text-align:center">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="单击预览原图"
                placement="left"
              >
                <img
                  ref="selectImage"
                  :style="{ transform: `rotate(${rotation}deg)` }"
                  style="
                    display: inline-block;
                    width: 220px;
                    height: 220px;
                    margin: 0px 5px 0px 5px;
                    border:2px grey solid;
                  "
                  :src="checkUrl"
                  alt="小图加载"
                  @click="previewPic(checkUrl)"
                />
              </el-tooltip>
              <div class="circle-action-bar">
                <el-button
                    type="text"
                    icon="el-icon-refresh-left"
                    @click.stop="turnLeftAndRight(-90)"
                ></el-button>
                <el-button
                    type="text"
                    icon="el-icon-refresh-right"
                    @click.stop="turnLeftAndRight(90)"
                ></el-button>
              </div>
            </div>
            <div class="AIbutton">
              <!-- <el-button class="button" type="success" @click="anglelePicByHand">保存手动矫正</el-button> -->
              <el-button class="button" type="success" @click="handlePic">AI去背景图</el-button>
            </div>
            <div style="width: 300px; text-align:center">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="单击预览新图"
                placement="bottom"
                v-if="handledUrl!=''"
              >
                <img
                  style="
                    display: inline-block;
                    width: 220px;
                    height: 220px;
                    margin: 0px 5px 0px 5px;
                    border:2px grey solid;
                  "
                  :src="handledUrl"
                  alt="小图加载"
                  @click="previewPic(handledUrl)"
                />
              </el-tooltip>
            </div>
          </el-row>
        </el-card>
      </div>
      <div style="display: flex; justify-content: center">
        <el-button type="primary" @click="confirmSwap" :disabled="handledFileid==0 && rotation==0">确定替换</el-button>
        <el-button type="primary" @click="HandlePicClose">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 图片预览 -->
    <el-image-viewer
      v-if="imgViewerVisible"
      @close="closeImgViewer"
      width="20%"
      :url-list="previewPiclist"
      alt="非图片不能预览"
    />
    </div>
</template>

<script setup>
import { searchResultAdd } from '@/api/commodity'
import { brandGetAll, editProduct, getById, getEdit, getSKimage, getdepName, getlcName, getpriceName, 
  getscName, productExport, stateAccept, stateReject, querySysDictData, getRejectReasons, queryitemcode, getPoItemClassList,
  getPlatformList,getSKBrandList,getDictList,getDevChannel,checkplansaledate,getOrglist,matchCurDateApi } from '@/api/itemaudit/ait001'
import { Submit, importProduct, productExport2, productExportErr } from '@/api/itemaudit/ait002'
import { handleImage,angleImage,angleImageByHand } from '@/api/file'
import { getToken } from '@/utils/auth'
import CommAdd from '@/views/itemaudit/iat_001/addCommodity.vue'
import { ElLoading, ElMessage } from 'element-plus'
import { dialog } from '@/utils/dialog'
import { nextTick, onBeforeMount, onMounted, toRefs, ref, watch, reactive } from 'vue'
import auditpic from '@/assets/images/audit.jpg'
import { useRoute } from 'vue-router'
import { excel } from '@/utils/excelExport'
import { uploadUrl } from '@/utils/request'
import { add } from '@/api/adCoverConfig'
import getGreenPlansaledate from '@/utils/getGreenPlansaledate'

const prop = defineProps({
    editVisible: {
        type: Object,
        default : () => false,
    },
    editloading: {
        type: Object,
        default : () => false,
    },
    editRow: {
        type: Object,
        default : () => {},
    },
    // 大投还是供应链,区分是供应连true还是大投false
    permission: {
        type: Boolean,
        default : () => true,
    },
    // 是否是快速送批页面
    quickNeed: {
        type: Boolean,
        default : () => false,
    },
    //商品id,从搜图结果对应的父商品id
    picproductId: {
        type: Number,
        default: () => "",
    },
    //款号,从搜图结果对应的父款号
    picitemcode: {
        type: String,
        default: () => "",
    },
     //款号,从搜图结果对应的父销售季期
     picplansaledate: {
        type: String,
        default: () => "",
    },
    // 类型，0:均无效；1：正常补充资料；2：预审搜图复制；3：以图搜图新增; 4:审图模式查看；5：以图搜图新增
    type: {
        type: Number,
        default : () => 1,
    },
    //一定要加这个，不然父组件的v-model就接收不到子组件传的数据，子组件通过"update:modelValue"去传。
    //vue3限定，vue可能是通过“input”来传。父组件记得写v-model就行，命名是啥无所谓。
    modelValue: {
        type: Array,
        default : () => []
    } 
});

const {editVisible,editloading,editRow,permission,quickNeed,type,picproductId,picitemcode,picplansaledate} = toRefs(prop);
const emits = defineEmits(['update:editVisible','update:editloading','getAll','close']);

const accept = import.meta.env.VITE_ACCEPT
let uploadSetting = reactive({
  headers: {
    'Authorization-admin': getToken(),
    tenant: 'MDAwMA=='
  },
  data: {
    folderId: 1,
  }
})
const zmfileList = ref([]) //主图路径存放
const fmfileList = ref([]) //副图路径存放

const ireStateOptions = ref([
  { id: null, label: '待补充资料' },
  { id: 1, label: '待审' },
  { id: 2, label: '作废' },
  { id: 3, label: '通过' },
  { id: 4, label: '否决' },
  { id: 11, label: '已补充资料' },
  { id: 12, label: '可上架' },
  { id: 5, label: 'INSIGNING1' },
  { id: 6, label: '待审诉' },
  { id: 7, label: '申诉中' },
  { id: 8, label: '作废申请' },
  { id: 9, label: '待批办' },
  { id: 10, label: '暂缓' }
]);

const endDeriveOptions = ref([
  {
    label: "未导",
    value: 0,
  },
  {
    label: "已导",
    value: 1,
  },
  {
    label: "取回中",
    value: 2,
  },
])

const isImageshootingOptions = ref([
  {
    label: "是",
    value: "1",
  },
  {
    label: "否",
    value: "0",
  }
])

const selectImage = ref()
const formItem = ref()
const skform = ref({
  itemdraftid:'',
  productId: '',
  brand: '',
  productName: '',
  supplierName: '',
  isExport: '',
  company: '',
  itemcode: '',
  orgin: '',
  bndId: '',
  year: '',
  quarter: '',
  yearquarter: '',
  sex: '',
  lcName: '',
  depName: '',
  scName: '',
  poitemclass: '',
  isAdult: '',
  priceName: '',
  isBase: '非基本',
  isCombo: '正常款',
  plansaledate: '',
  platformlist: [],
  salechannellist: '',
  diff: '否',
  picitemcode: '',
  picitemcode1: '',
  picitemcode2: '',
  picitemcode3: '',
  picitemcode4: '',
  imageList: [],
  devChannelList:[],
  imgnumberlist:'',
  shopname:'',
  keywordlist:'',
  remark:'',
  isshooting:'',
  masteritemcode:'',
  skmodified:'',
  specialApprovalId:'',
  isImageshooting:'',
  isReview:'',
  rejectreasonid:'',
  suspendreasonid:'',
  appealreasonid:'',
  ireState:'',
  endDerive:'',
  createTime:'',
  skcreater:'',
  skmodifier:'',
  sysfile:[],
  sysfilefu:[],
  zmfileid:[],//主图fileid存放
  fmfileid:[], //副图fileid存放
  isUpdate:false //true是更新资料，false是第一次补充资料
})
let lclist = ref([])
let deplist = ref([])
let sclist = ref([])
let pricelist = ref([])
let poItemClassList = ref([])
let platformList = ref([])
let devChannelList = ref([])
let orglist = ref([])
const alterFileList = ref([]) //存放fileid
// let imageSrc
const isDisabled = ref(false) //控制以及送批到品审中心后的补充资料字段状态
const formdisabled = ref(true) // 新增弹窗的form-item禁用状态
const previewlist = ref([]) //图片预览列表
const allPiclist = ref([]) //全部图片列表
const HandlePicVisible = ref(false)
const imgViewerVisible = ref(false)
const checkList = ref([])
const checkUrl = ref("")
const handledUrl = ref("")
const handledFileid = ref(0)
const previewPiclist = ref([]) //处理图片的预览列表

const dynamicProps = ref({
  multiple: true, // 初始状态
  // checkStrictly: true,
  // emitPath: false,
  expandTrigger: "hover",
  value: "value",
  label: "label",
  children: "children",
})

const history = ref([])
const SKHistroy = ref([])
const plansaledateVal = ref(true) //false表示销售季期验证失败

const addform = ref({
  productId: '',
  brand: '',
  bndId: '',
  productName: '',
  supplierName: '',
  isExport: '',
  company: '',
  itemcode: '',
  orgin: '',
  bndId: '',
  year: '',
  quarter: '',
  yearquarter: '',
  sex: '',
  lcName: '',
  depName: '',
  scName: '',
  poitemclass: '',
  isAdult: '',
  priceName: '',
  isBase: '',
  isCombo: '正常款',
  plansaledate: '',
  platformlist: [],
  salechannellist: '',
  diff: '否',
  picitemcode: '',
  picitemcode1: '',
  picitemcode2: '',
  picitemcode3: '',
  picitemcode4: '',
  imageList: [],
  devChannelList:[],
  imgnumberlist:'',
  shopname:'',
  keywordlist:'',
  remark:'',
  isshooting:'',
  masteritemcode:'',
  sysfile:[],
  sysfilefu:[],
  zmfileid:[],//主图fileid存放
  fmfileid:[], //副图fileid存放
  oriproductId: '',
  isUpdate:false //true是更新资料，false是第一次补充资料
})

const errorDialogVisable = ref(false)
const errorList = ref([])
const rotation = ref(0)

onMounted(() => {
    console.log('进入到组件了',editVisible.value);
})

let rejectReasons = ref([])
let specialApprovalIdReasons = ref([])
function queryRejectReasons(){
  getRejectReasons().then(res => {
    //特批原因和否决原因的列表一样
    rejectReasons.value = res.data
    specialApprovalIdReasons.value = res.data
  })
}

let suspendReasons = ref([])
function querySuspendReasons(){
  querySysDictData("biz.po.itemdraft.suspendReason").then(res => {
    suspendReasons.value = res.data
  })
}

let greenPlansaledate = ref([])
function handlePlansaledate(){
  // greenPlansaledate.value = []
  // if(picplansaledate.value!=""){
  //   // 1. 按逗号分割字符串
  //   let arr = picplansaledate.value.split(',');
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
  greenPlansaledate.value = getGreenPlansaledate(picplansaledate.value)
  console.log('编辑的绿色销售季期列表',greenPlansaledate.value,picplansaledate.value);
}

const getzmfileId = (val) => {
  skform.value.zmfileid.push(val);
  console.log("主图列表", zmfileList.value,skform.value.zmfileid)
}

const getfmfileId = (val) => {
  skform.value.fmfileid.push(val);
  console.log("副图列表", fmfileList.value,skform.value.fmfileid)
}

const delzmfileId = (val) => {
  skform.value.zmfileid = val
}

const delfmfileId = (val) => {
  skform.value.fmfileid = val
}

const openHandlePic = () =>{
  console.log('正面和反面图',zmfileList.value,fmfileList.value);
  zmfileList.value.forEach(zm=>{allPiclist.value.push({url:zm.url,fileid:zm.fileid})})
  fmfileList.value.forEach(fm=>{allPiclist.value.push({url:fm.url,fileid:fm.fileid})})
  HandlePicVisible.value= true
}

const HandlePicClose =() =>{
  console.log('关闭AI处理图片弹窗');
  checkUrl.value = ""
  checkList.value = []
  allPiclist.value = []
  handledUrl.value = ""
  handledFileid.value = 0
  HandlePicVisible.value= false
}

function turnLeftAndRight(angle) {
  rotation.value += angle;
  console.log('rotation.value',rotation.value);
}

function previewPic(url){
  imgViewerVisible.value = true
  previewPiclist.value = allPiclist.value.map(pic=>{return pic.url})
  let list = rotateArray(previewPiclist.value, url)
  console.log('预览图片列表',list,previewPiclist.value);
  previewPiclist.value = list
  console.log('预览图片的url和previewPiclist',url,previewPiclist.value);
}

function closeImgViewer(){
  console.log('关闭预览');
  imgViewerVisible.value = false
}

function rotateArray(arr, selected) {
    const index = arr.indexOf(selected);
    
    // 如果元素不存在，返回原数组
    if (index === -1) return [selected];
    
    // 截取从选中元素到末尾的部分 + 开头到选中元素之前的部分
    return arr.slice(index).concat(arr.slice(0, index));
}

const checked = (val) => {
  checkList.value = [val]
  checkUrl.value = allPiclist.value.find(ap => ap.fileid === val)?.url || '';
  handledUrl.value = ""
  handledFileid.value = 0
  rotation.value = 0
  console.log('修改后的checkList.value',checkList.value,val,checkUrl.value,allPiclist.value);
}

const handlePic = async () => {
  var loading = ElLoading.service({ fullscreen: true })
  let map = {
    fileId:checkList.value[0]
  }
  await handleImage(map).then(res => {
    console.log('AI处理图片结果',res);
    handledUrl.value = res.data.url
    handledFileid.value = res.data.fileId
  }).finally(() => {
    loading.close();
  })
}

const anglelePic = async () => {
  var loading = ElLoading.service({ fullscreen: true })
  let map = {
    fileId:checkList.value[0]
  }
  await angleImage(map).then(res => {
    console.log('AI处理图片结果',res);
    handledUrl.value = res.data.url
    handledFileid.value = res.data.fileId
  }).finally(() => {
    loading.close();
  })
}

const anglelePicByHand = async () => {
  var loading = ElLoading.service({ fullscreen: true })
  let map = {
    fileId:checkList.value[0],
    rotate:rotation.value
  }
  await angleImageByHand(map).then(res => {
    console.log('手动处理图片结果',res);
    handledUrl.value = res.data.url
    handledFileid.value = res.data.fileId
  }).finally(() => {
    loading.close();
  })
}

const confirmSwap = async () =>{
  if(rotation.value!=0){
    await anglelePicByHand()
  }
  const oldfileid = checkList.value[0]
  console.log('oldfileid',oldfileid);
  allPiclist.value = allPiclist.value.map(item => 
  item.fileid === oldfileid 
    ? { 
        ...item, 
        fileid: handledFileid.value, 
        url: handledUrl.value 
      }
    : item
);
  console.log('allPiclist',allPiclist.value);
  zmfileList.value = zmfileList.value.map(item => 
  item.fileid === oldfileid 
    ? { 
        ...item, 
        fileid: handledFileid.value, 
        url: handledUrl.value 
      }
    : item
);
  console.log('zmfileList',zmfileList.value);
  fmfileList.value = fmfileList.value.map(item => 
  item.fileid === oldfileid 
    ? { 
        ...item, 
        fileid: handledFileid.value, 
        url: handledUrl.value 
      }
    : item
);
  console.log('fmfileList',fmfileList.value);
  skform.value.zmfileid = skform.value.zmfileid.map(item => 
    item === oldfileid 
      ? handledFileid.value
      : item
  );
  console.log('skform.value.zmfileid',skform.value.zmfileid);
  skform.value.fmfileid = skform.value.fmfileid.map(item => 
    item === oldfileid 
      ? handledFileid.value
      : item
  );
  console.log('skform.value.fmfileid',skform.value.fmfileid);
  previewlist.value = []
  zmfileList.value.forEach(zm=>{previewlist.value.push(zm.url)})
  fmfileList.value.forEach(fm=>{previewlist.value.push(fm.url)})
  console.log('previewlist.value',previewlist.value);
  checkUrl.value = handledUrl.value 
  checkList.value = [handledFileid.value]
  console.log('checkList',checkList.value);
  rotation.value = 0
}

async function getDevChannelList(){
  // await getDictList("biz.bs.dev.channel").then((res) => {
  //   console.log('开发渠道的res',res);
  //   devChannelList.value = res.data
  // })
  await getDevChannel().then((res) => {
    console.log('开发渠道的res',res);
    devChannelList.value = res.data
  })
}

async function getPoItemClass(){
  await getPoItemClassList().then(res => {
    console.log('分类二列表',res);
    poItemClassList.value = res.data
}).finally(() => {
})
}

async function getPlatform(){
  await getPlatformList().then(res => {
    console.log('平台列表',res);
    platformList.value = res.data
  }).finally(() => {
  })
}

async function getOrginList(){
  await getOrglist().then(res => {
    console.log('组织列表',res);
    orglist.value = res.data
  })
}

async function getHistory(productId){
  const res = await getById({ productId })
  if (res.code === '') {
    console.log("审批历程有值", res.data);
    history.value = res.data[1]
    SKHistroy.value = res.data[2]
  }
}

async function Edit(){
  editloading.value = true
  console.log('editRow',editRow.value); //productid为0代表不是补充资料进来，而是搜图结果进来的
  isDisabled.value = false
  formdisabled.value = true
  if((editRow.value.ireState!=11&&editRow.value.ireState!=null) || type.value == 4){
    //说明已经送批到品审中心
    isDisabled.value = true
  }
  if(editRow.value.itemcode!=undefined&&editRow.value.itemcode!=""){
    await getEdit({ itemcode: editRow.value.itemcode, productId: editRow.value.productId}).then(res => {
      skform.value.itemdraftid = res.data.itemDraftId
      skform.value.productId = res.data.productId
      skform.value.brand = res.data.brandName
      // if (parseInt(res.data.brandId) != NaN) {
      //   skform.value.brand = parseInt(res.data.brandId)
      // }
      skform.value.productName = res.data.productName
      skform.value.supplierName = res.data.supplierName
      skform.value.isExport = ""
      skform.value.company = res.data.company
      skform.value.itemcode = res.data.itemcode
      skform.value.orgin = res.data.orgin
      skform.value.bndId = res.data.bndId
      skform.value.year = res.data.year
      skform.value.quarter = res.data.quarter
      skform.value.yearquarter = res.data.yearquarter
      skform.value.sex = res.data.sex
      skform.value.lcName = res.data.lcName
      skform.value.depName = res.data.depName
      skform.value.scName = res.data.scName
      skform.value.poitemclass = res.data.poitemclass
      skform.value.isAdult = res.data.isAdult
      skform.value.isBase = res.data.isBase  == "" ? '非基本' : res.data.isBase
      skform.value.priceName = res.data.priceName
      skform.value.plansaledate = res.data.plansaledate
      skform.value.platformlist = res.data.platformlist
      skform.value.salechannellist = res.data.salechannellist  == "" ? 'LYD' : res.data.salechannellist
      skform.value.isCombo = res.data.isCombo == "" ? '正常款' : res.data.isCombo
      // if(skform.value.isCombo!="正常款"){
      //   isDisabled.value = true
      // }
      skform.value.diff = res.data.diff
      skform.value.picitemcode = res.data.picitemcode
      skform.value.picitemcode1 = res.data.picitemcode1
      skform.value.picitemcode2 = res.data.picitemcode2
      skform.value.picitemcode3 = res.data.picitemcode3
      skform.value.picitemcode4 = res.data.picitemcode4
      skform.value.ifCredit = res.data.state,
      skform.value.devChannelList = res.data.devChannelList
      skform.value.imgnumberlist = res.data.imgnumberlist
      skform.value.shopname = res.data.shopname
      skform.value.keywordlist = res.data.keywordlist
      skform.value.remark = res.data.remark
      skform.value.isshooting = res.data.isshooting
      skform.value.masteritemcode = res.data.masteritemcode
      skform.value.skmodified = res.data.skmodified
      skform.value.specialApprovalId = res.data.specialApprovalId
      skform.value.isImageshooting = res.data.isImageshooting
      skform.value.isReview = res.data.isReview
      skform.value.rejectreasonid = res.data.rejectreasonid
      skform.value.suspendreasonid = res.data.suspendreasonid
      skform.value.appealreasonid = res.data.appealreasonid
      skform.value.ireState = res.data.ireState
      skform.value.endDerive = res.data.endDerive
      skform.value.createTime = res.data.createTime
      skform.value.skcreater = res.data.skcreater
      skform.value.skmodifier = res.data.skmodifier
      //主图
      skform.value.sysfile = res.data.sysfile
      for (let i = 0; i < skform.value.sysfile.length; i++) {
        let map = {}
        map.url = handleFscode(skform.value.sysfile[i].fscode);
        map.fileid = skform.value.sysfile[i].id;
        zmfileList.value.push(map)
        skform.value.zmfileid.push(skform.value.sysfile[i].id)
        previewlist.value.push(map.url)
      }
      //副图
      skform.value.sysfilefu = res.data.sysfilefu
      for (let i = 0; i < skform.value.sysfilefu.length; i++) {
        let map = {}
        map.url = handleFscode(skform.value.sysfilefu[i].fscode);
        map.fileid = skform.value.sysfilefu[i].id
        fmfileList.value.push(map)
        skform.value.fmfileid.push(skform.value.sysfilefu[i].id)
        previewlist.value.push(map.url)
      }
      console.log('点击编辑获得的res和skform', res, skform.value);
      console.log('主副图', zmfileList.value, fmfileList.value);
    }).finally(() => {
    })
    if(editRow.value.productId!=0){
      await getHistory(editRow.value.productId)
    }
    if(skform.value.itemcode!=null&&skform.value.itemcode!=""&&skform.value.bndId==""){
      validateInput()
    }else{
      editloading.value = false
      emits("update:editloading", false)
    }
    console.log('editloading',editloading.value);
  }else{
    skform.value.sysfile =  editRow.value.sysfile
    zmfileList.value = editRow.value.sysfile
    skform.value.zmfileid = editRow.value.sysfile.map((item)=>{return item.fileid==undefined?item.id:item.fileid})
    skform.value.sysfilefu =  editRow.value.sysfilefu
    fmfileList.value = editRow.value.sysfilefu
    skform.value.fmfileid = editRow.value.sysfilefu.map((item)=>{return item.fileid==undefined?item.id:item.fileid})
    skform.value.productName =  editRow.value.productName
    zmfileList.value.forEach(zm=>{previewlist.value.push(zm.url)})
    fmfileList.value.forEach(fm=>{previewlist.value.push(fm.url)})
    editloading.value = false
    emits("update:editloading", false)
  }
}

function handleFscode(fscode) {
  console.log('fscode',fscode);
  if(fscode!=undefined){
    if (typeof fscode === 'string' && fscode.includes("http")) {
        return fscode;
    } else {
        return "https://upload.gsitcloud.com/" + fscode.replace("$$", "/").replace("//", "/");
    }
  }
}

const validateInput = async () => {
  let pattern = /^[0-9a-zA-Z]{2,3}-[0-9][12349]-[0-9a-zA-Z]{6}$/;
  if (!pattern.test(skform.value.itemcode)) {
    ElMessage.error("款号不符合xx-yy-zzzzzz/xxx-yy-zzzzzz格式输入,xx/xxx=款字头,yy=年季,zzzzzz=流水号")
  }

  if (skform.value.itemcode.length >= 12) {
    formdisabled.value = true
    const str = skform.value.itemcode;  
    const parts = str.split('-'); // 使用横线分割字符串  
    const psd = parts[1]; // 获取第一个和第二个横线之间的部分
    console.log('款号里面的季期',psd); 
    if (psd == 99 || psd < 33) {
      formdisabled.value = false
    }
    let params = {
      itemcode:skform.value.itemcode,
      orgid: skform.value.orgin,
      platformlist: skform.value.platformlist
    }
    await queryitemcode(params).then((res) => {
      editloading.value = true
      if (res.data.hasOwnProperty("message")) {
        skform.value.bndId =
          "款号信息未找到对应的大类、品种、类别和性别...";
        // skform.value.orgin = "";
        skform.value.yearquarter = "";
        skform.value.lcName = "";
        skform.value.depName = "";
        skform.value.scName = "";
        skform.value.sex = "";
        skform.value.plansaledate = "";
        skform.value.isAdult = "";
      } else {
        let data = res.data.tableData[0];
        skform.value.bndId = data.bndId;                // 款字头
        // skform.value.orgin = data.orgname;              // 组织
        skform.value.yearquarter = data.season.name;    // 年份季度
        skform.value.lcName = data.lc.name              // 大类
        skform.value.depName = data.dep.name;           // 品种
        skform.value.scName = data.sc.name;             // 类别
        skform.value.sex = data.sexcode.id;             // 性别code
        skform.value.plansaledate = data.plansaledate;  // 默认销售季期
        skform.value.isAdult = data.Adult == '1' ? '成人' : data.Adult == '0' ? '童装' : data.Adult == '2' ? '不適用' : ''; // 成人/童装
        skform.value.sex = data.sexcode.id == 'M' ? '男' : (data.sexcode.id == 'L' ? '女' : '不适用');
        getPriceList() //获取品种细分列表
      }
    });
  } else if (skform.value.itemcode.length < 12) {
    formdisabled.value = true
    skform.value.bndId = "请选择款字头";
    //skform.value.rbndname = ""; // 公司
    skform.value.yearquarter = "";
    skform.value.lcName = "";
    skform.value.depName = "";
    skform.value.scName = "";
    skform.value.sex = "";
    skform.value.plansaledate = "";
    skform.value.isAdult = "";
  }
  editloading.value = false
  emits("update:editloading", false)
  console.log("queryitemcode-----", skform.value);

}

//   watch(() => skform.value.itemcode, (nVal, oVal) => {  
//   console.log('触发了款号的监听');  
//   if (nVal) {  
//     let pattern = /^[0-9a-zA-Z]{2}-[0-9][12349]-[0-9a-zA-Z]{6}$/;
//     if (!pattern.test(nVal)&&nVal.length!=12) {
//       ElMessage.error("款号不符合xx-yy-zzzzzz格式输入,xx=款字头,yy=年季,zzzzzz=流水号")
//     }
//   }  
// });

watch(() => editVisible.value, (nVal, oVal) => {
  console.log('触发了editVisible的监听', nVal);
  if (nVal) {
    console.log('skform---', skform.value);
    getPoItemClass();
    queryRejectReasons();
    querySuspendReasons();
    getPlatform();
    getDevChannelList();
    getOrginList();
    Edit();
  }
});

watch(() => skform.value.sex, (nVal, oVal) => {
  console.log('触发了性别的监听', nVal);
  if (nVal) {
    let param = {
      sex: nVal,
      lcName: '',
      depName: '',
      scName: '',
      isAdult: '',
      priceName: ''
    };
    getlcName(param).then(res => {
      console.log('选择性别获得的res', res);
      lclist.value = res.data
    }).catch(error => {
      console.error('在获取lcName时发生错误', error);
    }).finally(() => {
      // finally块中的代码无论成功还是失败都会执行  
      // 通常用于清理操作，比如取消订阅、清除加载状态等  
    });
  }
});
watch(() => skform.value.lcName, (nVal, oVal) => {
  console.log('触发了大类的监听');
  if (nVal) {
    let param = {
      sex: skform.value.sex,
      lcName: nVal,
      depName: '',
      scName: '',
      isAdult: '',
      priceName: ''
    };
    getdepName(param).then(res => {
      console.log('选择大类获得的res', res);
      deplist.value = res.data
    }).catch(error => {
      console.error('在获取depName时发生错误', error);
    }).finally(() => {
      // finally块中的代码无论成功还是失败都会执行  
      // 通常用于清理操作，比如取消订阅、清除加载状态等  
    });
  }
});

watch(() => skform.value.depName, (nVal, oVal) => {
  console.log('触发了品种的监听');
  if (nVal) {
    let param = {
      sex: skform.value.sex,
      lcName: skform.value.lcName,
      depName: nVal,
      scName: '',
      isAdult: '',
      priceName: ''
    };
    getscName(param).then(res => {
      console.log('选择品种获得的res', res);
      sclist.value = res.data
    }).catch(error => {
      console.error('在获取scName时发生错误', error);
    }).finally(() => {
      // finally块中的代码无论成功还是失败都会执行  
      // 通常用于清理操作，比如取消订阅、清除加载状态等  
    });
    if (nVal && skform.value.itemcode != '' && skform.value.depName != '') {
      getPriceList()
    }
  }
});

watch(() => skform.value.isAdult, (nVal, oVal) => {
  console.log('触发了成人童装的监听');
  // if (nVal && skform.value.itemcode != '' && skform.value.depName != '') {
  //   getPriceList()
  // }
});

watch(
() => picplansaledate.value, (newVal) => {
  console.log('触发了父款销售季期的监听');
  handlePlansaledate()
}, { immediate: true, deep: true },)

const getPriceList = () => {
  let param = {
      sex: skform.value.sex,
      lcName: skform.value.lcName,
      depName: skform.value.depName,
      scName: skform.value.scName,
      isAdult: skform.value.isAdult,
      priceName: '',
      itemcode: skform.value.itemcode
    };
    getpriceName(param).then(res => {
      console.log('选择成人童装获得的res', res);
      pricelist.value = res.data
      let ishave = false
      if(pricelist.value.some(item => item.priceName === skform.value.priceName)){
        ishave = true
      }
      // if(!ishave&&skform.ireState!=null&&skform.ireState==11){
      //   skform.value.priceName = ""
      // }
    }).catch(error => {
      console.error('在获取priceName时发生错误', error);
    }).finally(() => {
      // finally块中的代码无论成功还是失败都会执行  
      // 通常用于清理操作，比如取消订阅、清除加载状态等  
    });
}

const isAddSuccess = ref(false)

async function createNew(){
  if(skform.value.itemcode==''){
    ElMessage.error("请填写新增款款号")
    return
  }else if(skform.value.productName==''){
    ElMessage.error("请填写新增款商品名称")
    return
  }else if(skform.value.zmfileid.length==0){
    ElMessage.error("请补充商品主图")
    return
  }else if(skform.value.orgin==''||skform.value.orgin==null){
    ElMessage.error("请选择组织")
    return
  }
  
  // 补充资料前校验年季、销售季期是否与当前日期匹配
  var loading = ElLoading.service({ fullscreen: true })
  let matchParam = {
    itemcode: skform.value.itemcode,
    plansaledate: skform.value.plansaledate,
    orgid: skform.value.orgin,
    platformlist: skform.value.platformlist.join(',')
  }
  const matchRes = await matchCurDateApi(matchParam);
  console.log('补充资料前校验年季、销售季期是否与当前日期匹配的res', matchRes);
  if (matchRes.data.result.tableData) {
    try {
      await dialog.showDialog({
        message: '年季、销售季期与当前日期不匹配，是否继续保存?',
        title: '提示',
        ok: '确定',
        cancel: '取消',
        type: 'warning'
      });
    } catch (e) {
      ElMessage({
        type: 'info',
        message: '已取消'
      });
      loading.close();
      return;
    }
  }

  addform.value.sysfile = skform.value.sysfile
  addform.value.sysfilefu = skform.value.sysfilefu
  addform.value.itemcode = skform.value.itemcode
  addform.value.productName = skform.value.productName
  addform.value.isAddSuccess = isAddSuccess.value
  addform.value.oriproductId = 0
  let param = addform.value
  console.log('以图搜图新增商品的param', param);
  await searchResultAdd(param).then(res => {
    console.log('以图搜图新增商品的res', res);
    if(res.code =="200"){
      skform.value.productId = res.data.productId
      editSave()
    }else if(res.code == "test" && res.message!=""){
      ElMessage.error(res.message)
      loading.close();
    }
  })
}

async function editSaveWithMatchCheck() {
  let matchParam = {
    itemcode: skform.value.itemcode,
    plansaledate: skform.value.plansaledate,
    orgid: skform.value.orgin,
    platformlist: skform.value.platformlist.join(',')
  }
  const matchRes = await matchCurDateApi(matchParam);
  console.log('补充资料前校验年季、销售季期是否与当前日期匹配的res', matchRes);
  if (matchRes.data.result.tableData) {
    try {
      await dialog.showDialog({
        message: '年季、销售季期与当前日期不匹配，是否继续保存?',
        title: '提示',
        ok: '确定',
        cancel: '取消',
        type: 'warning'
      });
    } catch (e) {
      ElMessage({
        type: 'info',
        message: '已取消'
      });
      return;
    }
  }
  editSave()
}

async function addSave(){
  if(addform.value.itemcode==''){
    ElMessage.error("请填写新增款款号")
    return
  }else if(addform.value.productName==''){
    ElMessage.error("请填写新增款商品名称")
    return
  }else if(addform.value.itemcode.split('-')[2].slice(0, 3)!==skform.value.itemcode.split('-')[2].slice(0, 3)
  ||addform.value.itemcode.split('-')[0].slice(0, 2)!==skform.value.itemcode.split('-')[0].slice(0, 2)){
    ElMessage.error("新增款款号的款字头和大类品种类别必须与该款相同")
    return
  }

  var loading = ElLoading.service({ fullscreen: true })
  addform.value.sysfile = skform.value.sysfile
  addform.value.sysfilefu = skform.value.sysfilefu
  addform.value.isAddSuccess = isAddSuccess.value
  let param = addform.value
  await searchResultAdd(param).then(res => {
    console.log('新增商品的res', res);
    if(res.code =="200"){
      let productId = res.data.productId
      let itemcode = res.data.itemcode
      let productname = res.data.productName
      copySave(productId,itemcode,productname,addform.value.plansaledate)
    }else if(res.code == "test" && res.message!=""){
      ElMessage.error(res.message)
      loading.close();
    }
  })

}

async function copySave(productId,itemcode,productName,plansaledate) {
  console.log('复制保存的传参',productId,itemcode);
  var loading = ElLoading.service({ fullscreen: true })
  let param = {
    productId:productId,
    itemcode:itemcode,
    orgin:skform.value.orgin,
    year:skform.value.year,
    isExport:skform.value.isExport,
    diff:'否',
    productName:productName?productName:skform.value.productName,
    salechannellist:skform.value.salechannellist,
    isBase:skform.value.isBase,
    priceName:skform.value.priceName,
    platformlist:skform.value.platformlist,
    isCombo:'正常款',
    devChannelList:skform.value.devChannelList,
    poitemclass:skform.value.poitemclass,
    plansaledate:plansaledate?plansaledate:"",
    isCopy:true
  }
  console.log('复制保存的参数', param);
  await editProduct(param).then(res => {
    console.log('复制保存的res', res);
    if(res.code=="" && res.data[0].code == 0){
      isAddSuccess.value = true //新增成功，但是补充资料失败
      let base64 = res.data[0].base64;
      ElMessage.error("有错误数据产生")
      excel.excelExport("有错误数据产生", base64, '.xls')
    }else if(res.code=="" && res.data[0].code == "errorlist"){
        ElMessage.error("有错误数据产生")
        isAddSuccess.value = true //新增成功，但是补充资料失败
        errorDialogVisable.value = true
        errorList.value = res.data[0].data
    }else {
      isAddSuccess.value = false //设为false，下次addSave时会去检测款号
      ElMessage.success("成功")
      closeModalEdit()
      // getAll()
      emits('getAll');
    }
  }).finally(() => {
    loading.close();
  })
}

async function updateSave(){
  skform.value.isUpdate = true
  editSave()
}

async function editSave() {
  var loading = ElLoading.service({ fullscreen: true })
  skform.value.imageList = alterFileList.value
  if(skform.value.zmfileid.length==0){
    ElMessage.error("缺少主图")
    loading.close();
    return
  }
  let plansaledates = skform.value.plansaledate.split(",").map(item => item.trim());
  if(plansaledates.length>6){
    ElMessage.error("销售季期超过6个")
    loading.close();
    return
  }
  let imgnumber = skform.value.imgnumberlist;
  let imgnumberlist = [];
  if (imgnumber == undefined || imgnumber == "") {
    imgnumberlist = [];
  } else {
    imgnumberlist = imgnumber.split(/[, ]/);
  }
  if (imgnumberlist.length > 5) {
    ElMessage.error("最多填写5个图片编号");
    loading.close();
    return;
  }
  let param = skform.value
  console.log('编辑保存的参数', param);
  await editProduct(param).then(res => {
    console.log('编辑保存的res', res);
    if(res.code=="" && res.data[0].code == 0){
      isAddSuccess.value = true //新增成功，但是补充资料失败
      let base64 = res.data[0].base64;
      ElMessage.error("有错误数据产生")
      excel.excelExport("有错误数据产生", base64, '.xls')
    }else if(res.code=="" && res.data[0].code == "errorlist"){
      isAddSuccess.value = true //新增成功，但是补充资料失败
      ElMessage.error("有错误数据产生")
      errorDialogVisable.value = true
      errorList.value = res.data[0].data
    }else {
      isAddSuccess.value = false //补充成功
      ElMessage.success("成功")
      closeModalEdit()
      // getAll()
      emits('getAll');
      emits('close');
    }
  }).finally(() => {
    loading.close();
  })
}

async function editSaveAndConfirm() {
  var loading = ElLoading.service({ fullscreen: true })
  skform.value.imageList = alterFileList.value
  let param = skform.value
  console.log('编辑保存的参数', param,permission.value);
  await editProduct(param).then(res => {
    console.log('编辑保存的res', res);
    console.log('skform.value.ifCredit',skform.value);
    if(res.code=="" && res.data[0].code == 0){
      let base64 = res.data[0].base64;
      ElMessage.error("有错误数据产生")
      excel.excelExport("有错误数据产生", base64, '.xls')
    }else if(res.code=="" && res.data[0].code == "errorlist"){
        ElMessage.error("有错误数据产生")
        errorDialogVisable.value = true
        errorList.value = res.data[0].data
    }else if(res.data[0].code == 1 && skform.value.ifCredit!=1 && permission.value && !quickNeed){
      ElMessage.error('只能送批联营商审批为通过的数据')
    }else Singlesubmittals(skform.value.productId)
    // getAll()
  }).finally(() => {
    loading.close();
  })
}

// 送品牌方审批
function Singlesubmittals(id) {
  const ids = []
  ids.push(id)
  console.log('单条---送品牌方审批的ids', ids);
  if (ids.length > 0) {
    Submit({ ids }).then((res) => {
      console.log(res);
      ElMessage.success('送批成功')
      closeModalEdit()
      emits('getAll');
    })
      .catch((err) => {
        // 当异步操作失败时，可以在这里处理错误情况
        // alert(err.response.status)
        console.error(err)
      })
  } else ElMessage.error('无法获取到商品id')
}

function closeModalEdit() {
  // 不加这个条件的话点击关闭按钮它会莫名其妙触发两次这个方法，且第二次的editVisible.value为false
  if(editVisible.value){
    console.log("点x退出edit", skform.value)
    editVisible.value = false
    console.log('editVisible',editVisible.value);
    emits("update:editVisible", false)
    previewlist.value = []
    alterFileList.value = []
    // fileList.value = []
    skform.value = {
    itemdraftid:'',
    productId: '',
    brand: '',
    productName: '',
    supplierName: '',
    isExport: '',
    company: '',
    itemcode: '',
    orgin: '',
    bndId: '',
    year: '',
    quarter: '',
    yearquarter: '',
    sex: '',
    lcName: '',
    depName: '',
    scName: '',
    poitemclass: '',
    isAdult: '',
    priceName: '',
    isBase: '非基本',
    isCombo: '正常款',
    plansaledate: '',
    platformlist: [],
    salechannellist: '',
    diff: '否',
    picitemcode: '',
    picitemcode1: '',
    picitemcode2: '',
    picitemcode3: '',
    picitemcode4: '',
    shopname:'',
    keywordlist:'',
    remark:'',
    isshooting:'',
    masteritemcode:'',
    imageList: [],
    sysfile:[],
    sysfilefu:[],
    zmfileid:[],//主图fileid存放
    fmfileid:[], //副图fileid存放
    isUpdate:false //true是更新资料，false是第一次补充资料
    }
    addform.value = {
    productId: '',
    brand: '',
    productName: '',
    supplierName: '',
    isExport: '',
    company: '',
    itemcode: '',
    orgin: '',
    bndId: '',
    year: '',
    quarter: '',
    yearquarter: '',
    sex: '',
    lcName: '',
    depName: '',
    scName: '',
    poitemclass: '',
    isAdult: '',
    priceName: '',
    isBase: '非基本',
    isCombo: '正常款',
    plansaledate: '',
    platformlist: [],
    salechannellist: '',
    diff: '否',
    picitemcode: '',
    picitemcode1: '',
    picitemcode2: '',
    picitemcode3: '',
    picitemcode4: '',
    shopname:'',
    keywordlist:'',
    remark:'',
    isshooting:'',
    masteritemcode:'',
    imageList: [],
    sysfile:[],
    sysfilefu:[],
    zmfileid:[],//主图fileid存放
    fmfileid:[], //副图fileid存放
    isUpdate:false //true是更新资料，false是第一次补充资料
    }
    zmfileList.value = []
    fmfileList.value = []
  }
  history.value = []
  SKHistroy.value = []
}

const validateplansaledate = async (rule, value, callback) => {
  console.log('组织id和销售季期',skform.value.orgin,value);
  if(value==undefined) value = skform.value.plansaledate
  let params = {
    itemcode: skform.value.itemcode,
    orgid: skform.value.orgin,
    platformlist: skform.value.platformlist
  };
  let result;
  let target;
  let plansaledated;
  console.log('验证销售季期的参数',params);
  if(skform.value.itemcode!=""){
    await checkplansaledate(params).then((res) => {
      console.log('验证销售季期的res',res);
      //根据年季找到的销售季期
      target = res.data.result.result;
      //销售季期默认值
      plansaledated = res.data.result.plansaledate;
      console.log("RES----------", res, plansaledated);
    });
    plansaledateVal.value = true
    if (value.indexOf(",") != -1) {
      //多个销售季期
      let temp = value.split(",");
      var tmp = temp.sort();
      let inc = 0;
      tmp.forEach((item, index) => {
        if (item == tmp[index + 1]) {
          callback(new Error("存在重复季期"))
          plansaledateVal.value = false
          return;
        }
        if (target.includes(item)) {
          inc++;
        }
        //长度4
        if (isNaN(item) || item.length != 4) {
          callback(new Error("季期长度错误"))
          plansaledateVal.value = false
          return;
        } else {
          //12位区间23-30,34位01-12
          let year = parseInt(item.substring(0, 2)),
            moon = parseInt(item.substring(2, 4));
          if (!(20 <= year && year <= 30)) {
            callback(new Error("存在年份不在设定范围内(20-30)"))
            plansaledateVal.value = false
            return;
          }
          if (!(1 <= moon && moon <= 12)) {
            callback(new Error("存在月份错误(01-12)"))
            plansaledateVal.value = false
            return;
          }
        }
      });
      if (inc == 0) {
        callback(new Error("销售季期需在【" + target + "】中"))
        plansaledateVal.value = false
        inc = 0;
        return;
      }
    } else if (value.length != 0) {
      //长度4
      if (isNaN(value) || value.length != 4) {
        callback(new Error("季期长度错误"))
        plansaledateVal.value = false
        return;
      } else {
        //12位区间23-30,34位01-12
        let year = parseInt(value.substring(0, 2)),
          moon = parseInt(value.substring(2, 4));
        if (!(20 <= year && year <= 30)) {
          callback(new Error("当前年份不在设定范围内(20-30)"))
          plansaledateVal.value = false
          return;
        }
        if (!(1 <= moon && moon <= 12)) {
          callback(new Error("当前月份错误(01-12)"))
          plansaledateVal.value = false
          return;
        }
      }
    } else {
      if (target.length != 0) {
        const plansaledateArray = plansaledated.split(",");
        result = plansaledateArray.some((number) => target.includes(number));
        if (!result) {
          callback(new Error("销售季期需在【" + target + "】中"))
          plansaledateVal.value = false
          return;
        }
      }
    }
    if (target.length != 0) {
      const plansaledateArray = skform.value.plansaledate.split(",");
      result = plansaledateArray.some((number) => target.includes(number));
      if (!result) {
        callback(new Error("销售季期需在【" + target + "】中"))
        plansaledateVal.value = false
        return;
      }
    }
    if(editRow.value.isZhuangkuan==1){
      callback(new Error("撞款："+editRow.value.zkPlansaledate))
    }
  }
};

const validateplansaledateChange = (value) => {
  nextTick(() => {
    formItem.value.validateField('plansaledate')
  })
}

const validateplatformlist = async (rule, value, callback) => {
  console.log("平台校验",value)
  if(value.length==0){
    callback(new Error("平台不能为空"))
  }
  if(editRow.value.isZhuangkuan==1){
    callback(new Error("撞款："+editRow.value.zkPlatform))
  }
}

// 校验方法必须在rules前面
const rules = {
  orgin: [
    { required: true, message: '请选择组织', trigger: 'blur' },
  ],
  scName: [
    { required: true, message: '请选择类别', trigger: 'blur' },
  ],
  isAdult: [
    { required: true, message: '请选择成人童装', trigger: 'blur' },
  ],
  productName: [
    { required: true, message: '请填写商品名称', trigger: 'blur' },
  ],
  salechannellist: [
    { required: true, message: '请选择销售渠道', trigger: 'blur' },
  ],
  itemcode: [
    { required: true, message: '请填写款号', trigger: 'blur' },
  ],
  isBase: [
    { required: true, message: '请选择基本非基本', trigger: 'blur' },
  ],
  plansaledate: [
    { required: true, validator: validateplansaledate , trigger: 'change' },
  ],
  platformlist: [
    { required: true, validator: validateplatformlist, trigger: 'change' },
  ],
  isCombo: [
    { required: true, message: '请选择组合款/换款号', trigger: 'blur' },
  ],
  devChannelList: [
    { required: true, message: '请选择开发渠道', trigger: 'blur' },
  ],
  poitemclass: [
    { required: true, message: '请选择分类二', trigger: 'blur' },
  ]
}

</script>

<style scoped>

.custom-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  line-height: var(--el-dialog-font-line-height);
  font-size: var(--el-dialog-title-font-size);
}

.header-left .el-icon {
  font-size: 16px;
}

.header-center {
  color: #fff;
  text-align: center;
  line-height: var(--el-dialog-font-line-height);
  font-size: var(--el-dialog-title-font-size);
  flex: 1;
  /* 如果需要绝对居中，可以这样 */
  /* position: absolute;
  left: 50%;
  transform: translateX(-50%); */
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.handleimg{
  display: flex;
  justify-content: space-between;
}

.AIbutton{
  width:200px;
  height:250px;
  display:flex;
  flex-direction: column;
  justify-content:space-evenly;
  align-items:center;
  flex-wrap:wrap
}

.AIbutton .button{
  width: 100px;
  margin: 0;
}

.auditbuttonmain{
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 5px;
}

.size{
  width: 197px;
}

:deep(.el-form-item){
  width: 397px;
}

:deep(.el-form-item__error){
  width: 300px;
}
</style>