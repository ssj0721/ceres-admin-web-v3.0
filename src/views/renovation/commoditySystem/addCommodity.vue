<template>
  <div>
    <!-- <div class="stepBox"> -->
    <div class="topBox sticky">
      <!-- <span v-if="!productId" class="addTitle">新增商品</span>
        <span v-else class="addTitle">编辑商品</span> -->
      <div>
        <!-- <el-button v-if="active" type="primary" class="btnList" @click="back">关闭</el-button> -->
        <!-- <el-button
            v-if="active"
            type="primary"
            class="btnList"
            @click="next"
          >下一步</el-button> -->
        <el-button type="primary" class="btnList" @click="save" :disabled="saveDisabled">保存</el-button>
        <!-- <el-button
            v-if="!active"
            class="btnList"
            @click="last"
          >上一步</el-button> -->
      </div>
    </div>
    <el-divider />
        <!--    20250930(張偉洪): 将步骤条改为tabs -->
<!--    <div class="stepBox">-->
<!--      &lt;!&ndash; 步骤条 &ndash;&gt;-->
<!--      <div class="stepsColor common">-->
<!--        <div class="stepsOne common" @click="last">-->
<!--          <div :class="active ? 'one_class common' : 't_class common'">1</div>-->
<!--          <div :class="active ? 'two_class' : 'w_class'">基本属性</div>-->
<!--        </div>-->
<!--        <div class="line"></div>-->
<!--        <div class="stepsTwo common" @click="next">-->
<!--          <div :class="active ? 't_class common' : 'one_class common'">2</div>-->
<!--          <div :class="active ? 'w_class' : 'two_class'">商品详情</div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <el-tabs
        v-model="currentTab"
        class="commodity-info-tabs"
        type="card"
        :before-leave="nextTab"
    >
      <div class="addCom common">
        <el-tab-pane label="基本属性" name="basicInfo">
          <template #label>
            <el-icon><InfoFilled /></el-icon>
            &nbsp;基本属性
          </template>
          <div v-show="active">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="130px">
              <el-card class="leftCom">
                <el-form-item label="商品名称" prop="productName">
                  <el-input v-model="form.productName" maxlength="50" show-word-limit :disabled="(form.ifCredit == 1 || form.ifCredit == 3)" />
                </el-form-item>
                <!-- <el-form-item label="商品编号" prop="productCode">
                  <el-input v-model="form.productCode" maxlength="50" show-word-limit disabled />
                </el-form-item> -->
                <el-form-item label="商品编码(外部码)" prop="productCode">
                  <el-input v-model="form.productCode" maxlength="50" show-word-limit :disabled="(form.ifCredit == 1 || form.ifCredit == 3)" />
                </el-form-item>
                <el-form-item label="供应商款号" prop="oldItemCode">
                  <el-input v-model="form.oldItemCode" maxlength="50" show-word-limit :disabled="(form.ifCredit == 1 || form.ifCredit == 3)" />
                </el-form-item>
                <el-form-item label="印花款" prop="printItemCode">
                  <el-radio-group v-model="form.printItemCode" :disabled="(form.ifCredit == 1 || form.ifCredit == 3)">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="组合款/换款号" required>
                  <el-select v-model="form.gylIscombo" placeholder="请选择" clearable :disabled="(form.ifCredit == 1 || form.ifCredit == 3)">
                    <el-option label="正常款" value='0'></el-option>
                    <el-option label="组合款" value='1' @click="opencombo(form)"></el-option>
                    <!-- <el-option label="换款号" value="换款号"></el-option> -->
                  </el-select>
                </el-form-item>
                <el-form-item label="子商品" v-if="form.gylIscombo=='1'" @click="opencombo(form)">
                  <el-table v-loading="tableLoading" :data="multipleSelection" height="100" class="table">
                    <el-table-column prop="productId" label="商品ID" width="70"></el-table-column>
                    <el-table-column prop="productName" label="商品名称"></el-table-column>
                    <el-table-column prop="productCode" label="商品编码"></el-table-column>
                    <el-table-column prop="oldItemCode" label="供应商编码"></el-table-column>
                    <el-table-column prop="ifCredit" label="联营商审批">
                      <template #default="scope">
                        <span v-if="scope.row.ifCredit == 0">草稿</span>
                        <span v-else-if="scope.row.ifCredit == 1">通过</span>
                        <span v-else-if="scope.row.ifCredit == 2">待审</span>
                        <span v-else-if="scope.row.ifCredit == 3">否决</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
                <el-form-item label="销售渠道" required>
                  <el-select v-model="form.salechannellist" placeholder="请选择" clearable
                             :disabled="(form.ifCredit == 1 || form.ifCredit == 3)">
                    <el-option label="联营店" value="LYD"></el-option>
                    <el-option label="联营款" value="ZYD" disabled></el-option>
                    <el-option label="联营专供" value="LYZG" disabled></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="商品属性(真)" prop="productAttr" required>
                  <div class="productAttr" style="display: flex;">
                    <el-cascader :options="productPro" :props="{ multiple: true}" clearable
                                 v-model="form.productAttr" @change="cascaderChange" @expand-change="expandchange" :disabled="(form.ifCredit == 1 || form.ifCredit == 3)"></el-cascader>
                    <div style="height: 100%; position: relative;"><el-button type="text" @click="cascaderClear" style="position: absolute; top: 50%;"
                                                                              :disabled="(form.ifCredit == 1 || form.ifCredit == 3)">清空</el-button></div>
                  </div>
                  <span style="color:gray; width: 30%; text-align:end">真维斯商品分类</span>
                </el-form-item>
                <el-form-item label="商品属性(淘)" prop="productAttr1" >
                  <div class="productAttr" style="display: flex;">
                    <el-cascader :options="productPro1" :props="{ multiple: true }" clearable
                                 v-model="productAttr1"
                                 popperClass="tao"
                                 :disabled="(form.ifCredit == 1 || form.ifCredit == 3)"></el-cascader>
                    <div style="height: 100%; position: relative;"><el-button type="text" @click="cascaderClear1" style="position: absolute; top: 50%;"
                                                                              :disabled="(form.ifCredit == 1 || form.ifCredit == 3)">清空</el-button></div>
                  </div>
                  <span style="color:gray; width: 30%; text-align:end">淘宝商品分类</span>
                </el-form-item>
                <el-form-item label="卖点简介">
                  <el-input v-model="form.productBrief" maxlength="50" show-word-limit :disabled="(form.ifCredit == 1 || form.ifCredit == 3)" />
                </el-form-item>

                <el-form-item label="备注">
                  <el-input v-model="form.remark" maxlength="50" show-word-limit :disabled="(form.ifCredit == 1 || form.ifCredit == 3)" />
                </el-form-item>

                <el-form-item>
                  <template #label>
                    <span style="font-weight: bold;text-align: end;">附件</span>
                  </template>
                  <div style="width: 100%;">
                    <Upload ref='uploadRef' :multiple="true" :action="uploadUrl" :limit="10" :maxSize="5" :accept="accept2"
                            :file-list="fujianList" :data="uploadSetting.data" :fileList="fujianList" @getfileId="getfjfileId"
                            @delfileId="delfjfileId" :limitSize="1" :isbutton="true" :list-type="listType"
                            :isSee="isSee">
                    </Upload>
                    <span style="font-size: small; text-align: end; color: gray">仅支持上传.xlsx、.xls、.doc、.docx、.pdf类型文件</span>
                  </div>
                </el-form-item>

                <el-form-item required>
                  <template #label>
                    <span>审款图片<br>主图选择</span>
                  </template>
                  <div class="vertical-buttons">
                    <el-radio-group v-model="mainPic" class="skupload" :disabled="(form.ifCredit == 1 || form.ifCredit == 3)">
                      <div class="imageupload">
                        <!-- <Upload ref='uploadRef' :multiple="true" :action="uploadUrl" :limit="10" :maxSize="5" :accept="accept"
                      :data="uploadSetting.data" :fileList="form.fileList" @getfileId="getfileId" @delfileId="delfileId"
                      :isSee="(form.ifCredit == 1 || form.ifCredit == 3)">
                      </Upload> -->
                        <el-text>正面图片(必填)：</el-text>
                        <div>
                          <el-radio value="zm">作为主图</el-radio>
                        </div>
                        <Upload ref='uploadRef' :multiple="true" :action="uploadUrl" :limit="10" :maxSize="5" :accept="accept"
                                :file-list="zmfileList" :data="uploadSetting.data" :fileList="zmfileList" @getfileId="getzmfileId"
                                @delfileId="delzmfileId" :type="['jpg', 'png', 'jpeg']" :imgtype=1 :previewlist="zmpreviewlist"
                                :isSee="(form.ifCredit == 1 || form.ifCredit == 3)">
                        </Upload>
                      </div>
                      <div class="imageupload">
                        <el-text>反面图片(必填)：</el-text>
                        <div>
                          <el-radio value="fm">作为主图</el-radio>
                        </div>
                        <Upload ref='uploadRef' :multiple="true" :action="uploadUrl" :limit="10" :maxSize="5" :accept="accept"
                                :file-list="fmfileList" :data="uploadSetting.data" :fileList="fmfileList" @getfileId="getfmfileId"
                                @delfileId="delfmfileId" :type="['jpg', 'png', 'jpeg']" :imgtype=2 :previewlist="fmpreviewlist"
                                :isSee="(form.ifCredit == 1 || form.ifCredit == 3)">
                        </Upload>
                      </div>
                      <div class="imageupload">
                        <el-text>侧面图片：</el-text>
                        <div>
                          <el-radio value="cm">作为主图</el-radio>
                        </div>
                        <Upload ref='uploadRef' :multiple="true" :action="uploadUrl" :limit="10" :maxSize="5" :accept="accept"
                                :file-list="cmfileList" :data="uploadSetting.data" :fileList="cmfileList" @getfileId="getcmfileId"
                                @delfileId="delcmfileId" :type="['jpg', 'png', 'jpeg']" :imgtype=3 :previewlist="cmpreviewlist"
                                :isSee="(form.ifCredit == 1 || form.ifCredit == 3)">
                        </Upload>
                      </div>
                      <div class="imageupload">
                        <el-text>细节图片：</el-text>
                        <div>
                          <el-radio value="xj">作为主图</el-radio>
                        </div>
                        <Upload ref='uploadRef' :multiple="true" :action="uploadUrl" :limit="10" :maxSize="5" :accept="accept"
                                :file-list="xjfileList" :data="uploadSetting.data" :fileList="xjfileList" @getfileId="getxjfileId"
                                @delfileId="delxjfileId" :type="['jpg', 'png', 'jpeg']" :imgtype=4 :previewlist="xjpreviewlist"
                                :isSee="(form.ifCredit == 1 || form.ifCredit == 3)">
                        </Upload>
                      </div>
                    </el-radio-group>
                    <!-- <span style="color: #999999;line-height: 1.2em;">
                      只能上传.jpeg,.jpg,.png图片文件,且图片分辨率最低800×800,最高2048×2048
                    </span> -->
                    <!-- <span style="color: #999999;line-height: 1.2em;">
                      图片名要求：在图片名后添加 " _正"、"_反"、"_细"、"_侧" 区分 </span> -->
                    <span style="color: #999999;line-height: 1.2em;">
                  只能上传.jpeg,.jpg,.png图片文件,且图片分辨率不能低于800×800
                </span>
                    <span style="color: #999999;line-height: 1.2em;">
                  正、反图片必选</span>
                  </div>
                </el-form-item>

                <!-- <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span style="font-size:18px;font-weight: bold;margin-bottom: 20px;">商品详情</span>
                  </div>

                  <div>
                    <div class="flex-container" style="margin-bottom: 20px;">
                      <span style="margin-right:35px;">尺寸描述:</span>
                      <Upload ref='uploadRef' :multiple="false" :action="uploadUrl" :limit="5" :maxSize="5" :accept="accept"
                        :file-list="fList1" :data="uploadSetting.data" :fileList="fileList1" :fileidlist="fileid1"
                        @getfileId="getfileId1" @delfileId="delfileId1"></Upload>
                    </div>
                    <div class="flex-container" style="margin-bottom: 20px;">
                      <span style="margin-right:20px;">商品详情01:</span>
                      <Upload ref='uploadRef' :multiple="false" :action="uploadUrl" :limit="5" :maxSize="5" :accept="accept"
                        :file-list="fList2" :data="uploadSetting.data" :fileList="fileList2" :fileidlist="fileid2"
                        @getfileId="getfileId2" @delfileId="delfileId2"></Upload>
                    </div>
                    <div class="flex-container" style="margin-bottom: auto;">
                      <span style="margin-right:20px;">商品详情02:</span>
                      <Upload ref='uploadRef' :multiple="false" :action="uploadUrl" :limit="5" :maxSize="5" :accept="accept"
                        :file-list="fList3" :data="uploadSetting.data" :fileList="fileList3" :fileidlist="fileid3"
                        @getfileId="getfileId3" @delfileId="delfileId3"></Upload>
                    </div>
                  </div>
                </el-card> -->


              </el-card>
              <el-card class="rightCom">
                <el-form-item label="平台分类" prop="classifyId">
                  <el-cascader v-model="form.classifyId" :options="classifyList" clearable :props="{
                checkStrictly: false,
                label: 'categoryName',
                value: 'id',
                children: 'childs',
              }" disabled />
                </el-form-item>
                <el-form-item label="联营商分类" prop="associateclassifyId" @mouseenter="acdetail=true" @mouseleave="acdetail=false">
                  <el-cascader v-model="form.associateclassifyId" :options="associateClassifyList" clearable :props="{
                checkStrictly: false,
                label: 'categoryName',
                value: 'id',
                children: 'childs',
              }" :disabled="(form.ifCredit == 1 || form.ifCredit == 3)" />
                </el-form-item>
                <el-form-item label="供应商分组" prop="shopGroupId" @mouseenter="sgdetail=true" @mouseleave="sgdetail=false">
                  <el-select v-model="form.shopGroupId" placeholder="请选择供应商分组" clearable :disabled="(form.ifCredit == 1 || form.ifCredit == 3)">
                    <el-option v-for="(item, index) in groupList" :key="index" :label="item.groupName"
                               :value="item.shopGroupId" />
                  </el-select>
                </el-form-item>
                <el-form-item label="品牌" prop="brandId" v-if="permission">
                  <!-- <el-select v-model="form.brandId" multiple collapse-tags clearable placeholder="请选择品牌">
                    <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id" />
                  </el-select> -->
                  <selectAll v-model="form.brandId" :multiple="true" :placeholder="'请选择品牌'" :options="brandList"/>
                </el-form-item>
                <el-form-item class="form-item-long" label="供应商" prop="shopId">
                  <el-select v-model="form.shopId" placeholder="请选择供应商名称" clearable :disabled="(form.ifCredit == 1 || form.ifCredit == 3)">
                    <el-option v-for="shop in shops" :key="shop.shopId" :label="shop.shopName" :value="shop.shopId" />
                  </el-select>
                </el-form-item>
                <el-form-item v-if="acdetail||sgdetail" style="position: absolute; color:gray; width: 30%; font-size: small;">
              <span v-if="acdetail">
                “联营商分类”是在“平台分类”基础上，联营商的自定义补充的分类，各联营商可自定义不同类型名称。
              </span>
                  <span v-if="sgdetail">
                “供应商分组”是在“平台分类”基础上，供应商的自定义补充的分类，各供应商可自定义不同类型名称。
              </span>
                </el-form-item>
                <!-- 需要物流和发货方式暂时不要 -->

                <!-- <el-form-item label="需要物流" prop="ifLogistics" v-if=false>
                  <el-radio-group v-model="form.ifLogistics">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item> -->
                <!--<el-form-item label="上架状态" prop="shelveState">
                  <el-radio-group v-model="form.shelveState">
                    <el-radio :label="1">上架</el-radio>
                    <el-radio :label="0">下架</el-radio>
                  </el-radio-group>
                </el-form-item>
              -->
                <!-- <el-form-item label="允许超卖" prop="ifOversold">
                  <el-radio-group v-model="form.ifOversold">
                    <el-radio :label="1">允许</el-radio>
                    <el-radio :label="0">不允许</el-radio>
                  </el-radio-group>
                </el-form-item> -->
                <el-form-item label="发货方式" prop="sendWay" v-if=false>
                  <el-radio-group v-model="form.sendWay">
                    <el-radio :label="1">供应商发货</el-radio>
                    <el-radio :label="0">联营商发货</el-radio>
                  </el-radio-group>
                </el-form-item>
                <!-- <el-form-item label="积分兑换" prop="ifCredit">
                  <el-radio-group v-model="form.ifCredit">
                    <el-radio :label="1">允许</el-radio>
                    <el-radio :label="0">不允许</el-radio>
                  </el-radio-group>
                  <p style="color: #cf0f0f">
                    开启积分兑换后，积分所抵扣的金额由商户承担
                  </p>
                </el-form-item> -->
                <!-- <el-form-item
                  v-if="form.ifCredit"
                  class="form-item-long"
                  label="单笔最大抵扣"
                  prop="creditLimit"
                >
                  <el-input-number
                    v-model="form.creditLimit"
                    :controls="false"
                    :max="999999999"
                    :min="0"
                    :precision="0"
                    placeholder="请输入单笔最大抵扣"
                  />
                  <p
                    style="
                      color: #cf0f0f;
                      line-height: 25px;
                      margin-top: 10px;
                    "
                  >
                    限制一笔订单中该商品最多抵扣多少积分
                  </p>
                  <p style="color: #cf0f0f;line-height: 25px">
                    ( 注：1积分 = {{ integralProportion }}元 请输入整数 )
                  </p>
                </el-form-item> -->
                <!--            <el-form-item label="花呗分期">-->
                <!--              <el-radio-group v-model="form.ifHuabei">-->
                <!--                <el-radio :label="1">支持</el-radio>-->
                <!--                <el-radio :label="0">不支持</el-radio>-->
                <!--              </el-radio-group>-->
                <!--            </el-form-item>-->
              </el-card>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品详情" name="detailInfo">
          <template #label>
            <el-icon><Tickets /></el-icon>
            &nbsp;商品详情
          </template>
          <div class="centerCom">
            <el-form ref="paramsRef" :model="params">
              <StyleInformation :form="params" @saveDisabled="disabledSaveButton"/>
            </el-form>
          </div>
        </el-tab-pane>
      </div>
    </el-tabs>
    <!-- 商品 -->
<!--    <div class="addCom common">-->
<!--      <div v-show="active">-->
<!--        <el-form ref="formRef" :model="form" :rules="rules" label-width="130px">-->
<!--          <el-card class="leftCom">-->
<!--            <el-form-item label="商品名称" prop="productName">-->
<!--              <el-input v-model="form.productName" maxlength="50" show-word-limit :disabled="(form.ifCredit == 1 || form.ifCredit == 3)" />-->
<!--            </el-form-item>-->
<!--            &lt;!&ndash; <el-form-item label="商品编号" prop="productCode">-->
<!--              <el-input v-model="form.productCode" maxlength="50" show-word-limit disabled />-->
<!--            </el-form-item> &ndash;&gt;-->
<!--            <el-form-item label="商品编码(外部码)" prop="productCode">-->
<!--              <el-input v-model="form.productCode" maxlength="50" show-word-limit :disabled="(form.ifCredit == 1 || form.ifCredit == 3)" />-->
<!--            </el-form-item>-->
<!--            <el-form-item label="供应商款号" prop="oldItemCode">-->
<!--              <el-input v-model="form.oldItemCode" maxlength="50" show-word-limit :disabled="(form.ifCredit == 1 || form.ifCredit == 3)" />-->
<!--            </el-form-item>-->
<!--            <el-form-item label="印花款" prop="printItemCode">-->
<!--              <el-radio-group v-model="form.printItemCode" :disabled="(form.ifCredit == 1 || form.ifCredit == 3)">-->
<!--                <el-radio :label="1">是</el-radio>-->
<!--                <el-radio :label="0">否</el-radio>-->
<!--              </el-radio-group>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="组合款/换款号" required>-->
<!--                <el-select v-model="form.gylIscombo" placeholder="请选择" clearable :disabled="(form.ifCredit == 1 || form.ifCredit == 3)">-->
<!--                  <el-option label="正常款" value='0'></el-option>-->
<!--                  <el-option label="组合款" value='1' @click="opencombo(form)"></el-option>-->
<!--                  &lt;!&ndash; <el-option label="换款号" value="换款号"></el-option> &ndash;&gt;-->
<!--                </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="子商品" v-if="form.gylIscombo=='1'" @click="opencombo(form)">-->
<!--              <el-table v-loading="tableLoading" :data="multipleSelection" height="100" class="table">-->
<!--                <el-table-column prop="productId" label="商品ID" width="70"></el-table-column>-->
<!--                <el-table-column prop="productName" label="商品名称"></el-table-column>-->
<!--                <el-table-column prop="productCode" label="商品编码"></el-table-column>-->
<!--                <el-table-column prop="oldItemCode" label="供应商编码"></el-table-column>-->
<!--                <el-table-column prop="ifCredit" label="联营商审批">-->
<!--                  <template #default="scope">-->
<!--                    <span v-if="scope.row.ifCredit == 0">草稿</span>-->
<!--                    <span v-else-if="scope.row.ifCredit == 1">通过</span>-->
<!--                    <span v-else-if="scope.row.ifCredit == 2">待审</span>-->
<!--                    <span v-else-if="scope.row.ifCredit == 3">否决</span>-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--              </el-table>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="销售渠道" required>-->
<!--                <el-select v-model="form.salechannellist" placeholder="请选择" clearable-->
<!--                :disabled="(form.ifCredit == 1 || form.ifCredit == 3)">-->
<!--                  <el-option label="联营店" value="LYD"></el-option>-->
<!--                  <el-option label="联营款" value="ZYD" disabled></el-option>-->
<!--                  <el-option label="联营专供" value="LYZG" disabled></el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="商品属性(真)" prop="productAttr" required>-->
<!--              <div class="productAttr" style="display: flex;">-->
<!--                <el-cascader :options="productPro" :props="{ multiple: true}" clearable-->
<!--                  v-model="form.productAttr" @change="cascaderChange" @expand-change="expandchange" :disabled="(form.ifCredit == 1 || form.ifCredit == 3)"></el-cascader>-->
<!--                  <div style="height: 100%; position: relative;"><el-button type="text" @click="cascaderClear" style="position: absolute; top: 50%;"-->
<!--                    :disabled="(form.ifCredit == 1 || form.ifCredit == 3)">清空</el-button></div>-->
<!--                </div>-->
<!--              <span style="color:gray; width: 30%; text-align:end">真维斯商品分类</span>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="商品属性(淘)" prop="productAttr1" >-->
<!--              <div class="productAttr" style="display: flex;">-->
<!--                <el-cascader :options="productPro1" :props="{ multiple: true }" clearable-->
<!--                  v-model="productAttr1"-->
<!--                  popperClass="tao"-->
<!--                  :disabled="(form.ifCredit == 1 || form.ifCredit == 3)"></el-cascader>-->
<!--                  <div style="height: 100%; position: relative;"><el-button type="text" @click="cascaderClear1" style="position: absolute; top: 50%;"-->
<!--                    :disabled="(form.ifCredit == 1 || form.ifCredit == 3)">清空</el-button></div>-->
<!--              </div>-->
<!--              <span style="color:gray; width: 30%; text-align:end">淘宝商品分类</span>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="卖点简介">-->
<!--              <el-input v-model="form.productBrief" maxlength="50" show-word-limit :disabled="(form.ifCredit == 1 || form.ifCredit == 3)" />-->
<!--            </el-form-item>-->

<!--            <el-form-item label="备注">-->
<!--              <el-input v-model="form.remark" maxlength="50" show-word-limit :disabled="(form.ifCredit == 1 || form.ifCredit == 3)" />-->
<!--            </el-form-item>-->

<!--            <el-form-item>-->
<!--              <template #label>-->
<!--                <span style="font-weight: bold;text-align: end;">附件</span>-->
<!--              </template>-->
<!--              <div style="width: 100%;">-->
<!--                <Upload ref='uploadRef' :multiple="true" :action="uploadUrl" :limit="10" :maxSize="5" :accept="accept2"-->
<!--                  :file-list="fujianList" :data="uploadSetting.data" :fileList="fujianList" @getfileId="getfjfileId"-->
<!--                  @delfileId="delfjfileId" :limitSize="1" :isbutton="true" :list-type="listType"-->
<!--                  :isSee="isSee">-->
<!--                </Upload>-->
<!--                <span style="font-size: small; text-align: end; color: gray">仅支持上传.xlsx、.xls、.doc、.docx、.pdf类型文件</span>-->
<!--              </div>-->
<!--            </el-form-item>-->

<!--            <el-form-item required>-->
<!--              <template #label>-->
<!--                <span>审款图片<br>主图选择</span>-->
<!--              </template>-->
<!--              <div class="vertical-buttons">-->
<!--                <el-radio-group v-model="mainPic" class="skupload" :disabled="(form.ifCredit == 1 || form.ifCredit == 3)">-->
<!--                  <div class="imageupload">-->
<!--                    &lt;!&ndash; <Upload ref='uploadRef' :multiple="true" :action="uploadUrl" :limit="10" :maxSize="5" :accept="accept"-->
<!--                  :data="uploadSetting.data" :fileList="form.fileList" @getfileId="getfileId" @delfileId="delfileId"-->
<!--                  :isSee="(form.ifCredit == 1 || form.ifCredit == 3)">-->
<!--                  </Upload> &ndash;&gt;-->
<!--                    <el-text>正面图片(必填)：</el-text>-->
<!--                    <div>-->
<!--                      <el-radio value="zm">作为主图</el-radio>-->
<!--                    </div>-->
<!--                    <Upload ref='uploadRef' :multiple="true" :action="uploadUrl" :limit="10" :maxSize="5" :accept="accept"-->
<!--                      :file-list="zmfileList" :data="uploadSetting.data" :fileList="zmfileList" @getfileId="getzmfileId"-->
<!--                      @delfileId="delzmfileId" :type="['jpg', 'png', 'jpeg']" :imgtype=1-->
<!--                      :isSee="(form.ifCredit == 1 || form.ifCredit == 3)">-->
<!--                    </Upload>-->
<!--                  </div>-->
<!--                  <div class="imageupload">-->
<!--                    <el-text>反面图片(必填)：</el-text>-->
<!--                    <div>-->
<!--                      <el-radio value="fm">作为主图</el-radio>-->
<!--                    </div>-->
<!--                    <Upload ref='uploadRef' :multiple="true" :action="uploadUrl" :limit="10" :maxSize="5" :accept="accept"-->
<!--                      :file-list="fmfileList" :data="uploadSetting.data" :fileList="fmfileList" @getfileId="getfmfileId"-->
<!--                      @delfileId="delfmfileId" :type="['jpg', 'png', 'jpeg']" :imgtype=2-->
<!--                      :isSee="(form.ifCredit == 1 || form.ifCredit == 3)">-->
<!--                    </Upload>-->
<!--                  </div>-->
<!--                  <div class="imageupload">-->
<!--                    <el-text>侧面图片：</el-text>-->
<!--                    <div>-->
<!--                      <el-radio value="cm">作为主图</el-radio>-->
<!--                    </div>-->
<!--                    <Upload ref='uploadRef' :multiple="true" :action="uploadUrl" :limit="10" :maxSize="5" :accept="accept"-->
<!--                      :file-list="cmfileList" :data="uploadSetting.data" :fileList="cmfileList" @getfileId="getcmfileId"-->
<!--                      @delfileId="delcmfileId" :type="['jpg', 'png', 'jpeg']" :imgtype=3-->
<!--                      :isSee="(form.ifCredit == 1 || form.ifCredit == 3)">-->
<!--                    </Upload>-->
<!--                  </div>-->
<!--                  <div class="imageupload">-->
<!--                    <el-text>细节图片：</el-text>-->
<!--                    <div>-->
<!--                      <el-radio value="xj">作为主图</el-radio>-->
<!--                    </div>-->
<!--                    <Upload ref='uploadRef' :multiple="true" :action="uploadUrl" :limit="10" :maxSize="5" :accept="accept"-->
<!--                      :file-list="xjfileList" :data="uploadSetting.data" :fileList="xjfileList" @getfileId="getxjfileId"-->
<!--                      @delfileId="delxjfileId" :type="['jpg', 'png', 'jpeg']" :imgtype=4-->
<!--                      :isSee="(form.ifCredit == 1 || form.ifCredit == 3)">-->
<!--                    </Upload>-->
<!--                  </div>-->
<!--                </el-radio-group>-->
<!--                &lt;!&ndash; <span style="color: #999999;line-height: 1.2em;">-->
<!--                  只能上传.jpeg,.jpg,.png图片文件,且图片分辨率最低800×800,最高2048×2048-->
<!--                </span> &ndash;&gt;-->
<!--                &lt;!&ndash; <span style="color: #999999;line-height: 1.2em;">-->
<!--                  图片名要求：在图片名后添加 " _正"、"_反"、"_细"、"_侧" 区分 </span> &ndash;&gt;-->
<!--                  <span style="color: #999999;line-height: 1.2em;">-->
<!--                  只能上传.jpeg,.jpg,.png图片文件,且图片分辨率不能低于800×800-->
<!--                </span>-->
<!--                <span style="color: #999999;line-height: 1.2em;">-->
<!--                  正、反图片必选</span>-->
<!--              </div>-->
<!--            </el-form-item>-->

<!--            &lt;!&ndash; <el-card class="box-card">-->
<!--              <div slot="header" class="clearfix">-->
<!--                <span style="font-size:18px;font-weight: bold;margin-bottom: 20px;">商品详情</span>-->
<!--              </div>-->

<!--              <div>-->
<!--                <div class="flex-container" style="margin-bottom: 20px;">-->
<!--                  <span style="margin-right:35px;">尺寸描述:</span>-->
<!--                  <Upload ref='uploadRef' :multiple="false" :action="uploadUrl" :limit="5" :maxSize="5" :accept="accept"-->
<!--                    :file-list="fList1" :data="uploadSetting.data" :fileList="fileList1" :fileidlist="fileid1"-->
<!--                    @getfileId="getfileId1" @delfileId="delfileId1"></Upload>-->
<!--                </div>-->
<!--                <div class="flex-container" style="margin-bottom: 20px;">-->
<!--                  <span style="margin-right:20px;">商品详情01:</span>-->
<!--                  <Upload ref='uploadRef' :multiple="false" :action="uploadUrl" :limit="5" :maxSize="5" :accept="accept"-->
<!--                    :file-list="fList2" :data="uploadSetting.data" :fileList="fileList2" :fileidlist="fileid2"-->
<!--                    @getfileId="getfileId2" @delfileId="delfileId2"></Upload>-->
<!--                </div>-->
<!--                <div class="flex-container" style="margin-bottom: auto;">-->
<!--                  <span style="margin-right:20px;">商品详情02:</span>-->
<!--                  <Upload ref='uploadRef' :multiple="false" :action="uploadUrl" :limit="5" :maxSize="5" :accept="accept"-->
<!--                    :file-list="fList3" :data="uploadSetting.data" :fileList="fileList3" :fileidlist="fileid3"-->
<!--                    @getfileId="getfileId3" @delfileId="delfileId3"></Upload>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-card> &ndash;&gt;-->


<!--          </el-card>-->
<!--          <el-card class="rightCom">-->
<!--            <el-form-item label="平台分类" prop="classifyId">-->
<!--              <el-cascader v-model="form.classifyId" :options="classifyList" clearable :props="{-->
<!--                checkStrictly: false,-->
<!--                label: 'categoryName',-->
<!--                value: 'id',-->
<!--                children: 'childs',-->
<!--              }" disabled />-->
<!--            </el-form-item>-->
<!--            <el-form-item label="联营商分类" prop="associateclassifyId" @mouseenter="acdetail=true" @mouseleave="acdetail=false">-->
<!--              <el-cascader v-model="form.associateclassifyId" :options="associateClassifyList" clearable :props="{-->
<!--                checkStrictly: false,-->
<!--                label: 'categoryName',-->
<!--                value: 'id',-->
<!--                children: 'childs',-->
<!--              }" :disabled="(form.ifCredit == 1 || form.ifCredit == 3)" />-->
<!--            </el-form-item>-->
<!--            <el-form-item label="供应商分组" prop="shopGroupId" @mouseenter="sgdetail=true" @mouseleave="sgdetail=false">-->
<!--              <el-select v-model="form.shopGroupId" placeholder="请选择供应商分组" clearable :disabled="(form.ifCredit == 1 || form.ifCredit == 3)">-->
<!--                <el-option v-for="(item, index) in groupList" :key="index" :label="item.groupName"-->
<!--                  :value="item.shopGroupId" />-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="品牌" prop="brandId" v-if="permission">-->
<!--              &lt;!&ndash; <el-select v-model="form.brandId" multiple collapse-tags clearable placeholder="请选择品牌">-->
<!--                <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id" />-->
<!--              </el-select> &ndash;&gt;-->
<!--              <selectAll v-model="form.brandId" :multiple="true" :placeholder="'请选择品牌'" :options="brandList"/>-->
<!--            </el-form-item>-->
<!--            <el-form-item class="form-item-long" label="供应商" prop="shopId">-->
<!--              <el-select v-model="form.shopId" placeholder="请选择供应商名称" clearable :disabled="(form.ifCredit == 1 || form.ifCredit == 3)">-->
<!--                <el-option v-for="shop in shops" :key="shop.shopId" :label="shop.shopName" :value="shop.shopId" />-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item v-if="acdetail||sgdetail" style="position: absolute; color:gray; width: 30%; font-size: small;">-->
<!--              <span v-if="acdetail">-->
<!--                “联营商分类”是在“平台分类”基础上，联营商的自定义补充的分类，各联营商可自定义不同类型名称。-->
<!--              </span>-->
<!--              <span v-if="sgdetail">-->
<!--                “供应商分组”是在“平台分类”基础上，供应商的自定义补充的分类，各供应商可自定义不同类型名称。-->
<!--              </span>-->
<!--            </el-form-item>-->
<!--            &lt;!&ndash; 需要物流和发货方式暂时不要 &ndash;&gt;-->

<!--            &lt;!&ndash; <el-form-item label="需要物流" prop="ifLogistics" v-if=false>-->
<!--              <el-radio-group v-model="form.ifLogistics">-->
<!--                <el-radio :label="1">是</el-radio>-->
<!--                <el-radio :label="0">否</el-radio>-->
<!--              </el-radio-group>-->
<!--            </el-form-item> &ndash;&gt;-->
<!--            &lt;!&ndash;<el-form-item label="上架状态" prop="shelveState">-->
<!--              <el-radio-group v-model="form.shelveState">-->
<!--                <el-radio :label="1">上架</el-radio>-->
<!--                <el-radio :label="0">下架</el-radio>-->
<!--              </el-radio-group>-->
<!--            </el-form-item>-->
<!--          &ndash;&gt;-->
<!--            &lt;!&ndash; <el-form-item label="允许超卖" prop="ifOversold">-->
<!--              <el-radio-group v-model="form.ifOversold">-->
<!--                <el-radio :label="1">允许</el-radio>-->
<!--                <el-radio :label="0">不允许</el-radio>-->
<!--              </el-radio-group>-->
<!--            </el-form-item> &ndash;&gt;-->
<!--            <el-form-item label="发货方式" prop="sendWay" v-if=false>-->
<!--              <el-radio-group v-model="form.sendWay">-->
<!--                <el-radio :label="1">供应商发货</el-radio>-->
<!--                <el-radio :label="0">联营商发货</el-radio>-->
<!--              </el-radio-group>-->
<!--            </el-form-item>-->
<!--            &lt;!&ndash; <el-form-item label="积分兑换" prop="ifCredit">-->
<!--              <el-radio-group v-model="form.ifCredit">-->
<!--                <el-radio :label="1">允许</el-radio>-->
<!--                <el-radio :label="0">不允许</el-radio>-->
<!--              </el-radio-group>-->
<!--              <p style="color: #cf0f0f">-->
<!--                开启积分兑换后，积分所抵扣的金额由商户承担-->
<!--              </p>-->
<!--            </el-form-item> &ndash;&gt;-->
<!--            &lt;!&ndash; <el-form-item-->
<!--              v-if="form.ifCredit"-->
<!--              class="form-item-long"-->
<!--              label="单笔最大抵扣"-->
<!--              prop="creditLimit"-->
<!--            >-->
<!--              <el-input-number-->
<!--                v-model="form.creditLimit"-->
<!--                :controls="false"-->
<!--                :max="999999999"-->
<!--                :min="0"-->
<!--                :precision="0"-->
<!--                placeholder="请输入单笔最大抵扣"-->
<!--              />-->
<!--              <p-->
<!--                style="-->
<!--                  color: #cf0f0f;-->
<!--                  line-height: 25px;-->
<!--                  margin-top: 10px;-->
<!--                "-->
<!--              >-->
<!--                限制一笔订单中该商品最多抵扣多少积分-->
<!--              </p>-->
<!--              <p style="color: #cf0f0f;line-height: 25px">-->
<!--                ( 注：1积分 = {{ integralProportion }}元 请输入整数 )-->
<!--              </p>-->
<!--            </el-form-item> &ndash;&gt;-->
<!--            &lt;!&ndash;            <el-form-item label="花呗分期">&ndash;&gt;-->
<!--            &lt;!&ndash;              <el-radio-group v-model="form.ifHuabei">&ndash;&gt;-->
<!--            &lt;!&ndash;                <el-radio :label="1">支持</el-radio>&ndash;&gt;-->
<!--            &lt;!&ndash;                <el-radio :label="0">不支持</el-radio>&ndash;&gt;-->
<!--            &lt;!&ndash;              </el-radio-group>&ndash;&gt;-->
<!--            &lt;!&ndash;            </el-form-item>&ndash;&gt;-->
<!--          </el-card>-->
<!--        </el-form>-->
<!--      </div>-->
<!--      <div v-show="!active" class="centerCom">-->
<!--        <el-form ref="paramsRef" :model="params">-->
<!--          <StyleInformation :form="params" @saveDisabled="disabledSaveButton"/>-->
<!--        </el-form>-->
<!--      </div>-->
<!--    </div>-->

    <!-- 弹窗 -->
    <el-dialog v-model="visible.image" class="check-image-dialog" title="查看图片" center="center">
      <img width="100%" :src="detailImg" alt />
    </el-dialog>

    <!-- 组合款的弹窗 -->
    <el-dialog v-model="visible.combo" title="请勾选子商品" center="center" style="height: 550px; overflow: auto;">
      <template style="display: flex; position: sticky; top: 0;">
        <el-form>
        <el-select v-model="query.label" placeholder="请选择筛选条件" size="large" style="width: 150px;" clearable>
          <el-option label="商品ID" value="productId" />
          <el-option label="商品名称" value="productName" />
          <el-option label="商品编码" value="productCode" />
          <el-option label="供应商编码" value="oldItemCode" />
          <el-option label="联营商审批" value="ifCredit" />
        </el-select>
        <el-input v-model="query.search" maxlength="10" placeholder="请输入" style="width: 250px; height: 100%;margin-right: 10px" clearable/>
        <el-button type="primary" @click="querycombo">查询</el-button>
        <el-button type="primary" @click="savepid">确 定</el-button>
      </el-form>
      </template>
      <el-table v-loading="tableLoading" :data="comboList" @select="handleSelectionChange" height="550" class="table" row-key="productId" ref="tableRef">
        <el-table-column type="selection" />
        <el-table-column prop="productId" label="商品ID" width="70"></el-table-column>
        <el-table-column prop="productName" label="商品名称"></el-table-column>
        <el-table-column prop="productCode" label="商品编码"></el-table-column>
        <el-table-column prop="oldItemCode" label="供应商编码"></el-table-column>
        <el-table-column prop="ifCredit" label="联营商审批">
          <template #default="scope">
            <span v-if="scope.row.ifCredit == 0">草稿</span>
            <span v-else-if="scope.row.ifCredit == 1">通过</span>
            <span v-else-if="scope.row.ifCredit == 2">待审</span>
            <span v-else-if="scope.row.ifCredit == 3">否决</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { getSelect } from '@/api/account'
import {
  getAssociate,
  getBrandList,
  getClassify,
  getClassifyAdd,
  getClassifyGetById,
  getClassifyUpdate,
  getComboList,
  getGroupSelect,
  getProperty,
  selectClassifyId
} from '@/api/commodity'
import { getshop } from '@/api/shopSys'
import { uploadUrl } from '@/utils/request'
import { defineComponent, nextTick, onBeforeMount, reactive, ref, shallowRef, toRefs, watch } from 'vue'
import StyleInformation from './addComponent.vue'
// import { WangEditor } from "@/components/Wangeditor/index.js";
import { deletefile } from '@/api/file'
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import {InfoFilled, Tickets} from "@element-plus/icons-vue";


/**
 * @typedef {import('./types').ProductForm} ProductForm
 */


defineComponent({
  name: 'CommodityForm'
})

const uploadRef = ref(null);
// let isSave = ref(false);
const zmpreviewlist=ref([])
const fmpreviewlist=ref([])
const cmpreviewlist=ref([])
const xjpreviewlist=ref([])

const tableRef = ref();
let query = ref({
  label:"productId"
})
let comboList = ref([]) //组合款弹窗商品数据
let productids = ref([]) //组合款所选的子商品id列表
let multipleSelection = ref([]) //多选的数据
let acdetail = ref(false) //联营商分类提示
let sgdetail = ref(false) //供应商分组提示
const saveDisabled = ref(false) //控制保存按钮

const disabledSaveButton = (val) => {
  console.log('是否禁用保存按钮',val);
  saveDisabled.value = val
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val
  productids.value = multipleSelection.value.map(item => item.productId);
  console.log("复选框变化", multipleSelection)
}

// const handleSelectionChange = (e, row) => {
//   console.log("复选框变化", multipleSelection,row)
//   if(row!=undefined){
//     if (multipleSelection.value.includes(row.productId)) {
//       // 删除
//       multipleSelection.value.splice(multipleSelection.value.findIndex(item => item === row.productId), 1);
//     } else {
//       // 新增
//       multipleSelection.value.push(row)
//     }
//     console.log(multipleSelection.value, 'ids')
//   }
// }

async function queryComboList(form){
  let params = {
      shopId:form.shopId
    }
    console.log('params',params);
    await getComboList(params).then(res=>{
      console.log("组合款弹窗数据",res,productids.value)
      comboList.value = res.data.list
      // const ids = new Set(multipleSelection.value.map(item => item.productId));
      // 过滤数组comboList，只保留那些productId在ids中存在的对象
      // let result = comboList.value.filter(item => ids.has(item.productId));
      // console.log('123');
      // result.forEach(id=>{
      //   tableRef.value.toggleRowSelection(id, true);
      // })

      // for (let i = 0; i < comboList.value.length; i++) {
      //   if (productids.value.includes(comboList.value[i].productId)) {
      //     const row = comboList.value[i];
      //     console.log('row',row);
      //     tableRef.value.toggleRowSelection(row);
      //   }
      // }
      // multipleSelection.value = result

      // console.log('已选择的数据',multipleSelection.value);
    }).catch(error => {
      ElMessage.error("获取失败", error)
    })
    nextTick(() => {
      console.log('toggleRowSelection');
      for (let i = 0; i < comboList.value.length; i++) {
        if (productids.value.includes(comboList.value[i].productId)) {
          const row = comboList.value[i];
          //将勾选的数据放在最前面
          comboList.value.splice(i,1)
          comboList.value.unshift(row)
          console.log('row',row);
          //选择的数据显示勾选
          tableRef.value.toggleRowSelection(row);
        }
      }
    })
}

async function opencombo(form){
  if(form.ifCredit != 1 &&  form.ifCredit != 3){
    if(form.shopId == undefined || form.shopId == ""){
      ElMessage.warning('请先选择供应商')
    }else{
      visible.combo = true
      queryComboList(form)
    }
  }
}

async function querycombo() {
  console.log("子商品查询参数",query.value)
  console.log("子商品列表",comboList.value)
  if(query.value.search != "" && query.value.search != undefined)
  {
    let filterField = query.value.label;
    let filterValue = query.value.search;
    if(filterField == "ifCredit"){
      switch (filterValue) {
        case '草稿':
          filterValue = 0
          break;
        case '通过':
          filterValue = 1
          break;
        case '待审':
          filterValue = 2
          break;
        case '否决':
          filterValue = 3
          break;
      }
    }else if(filterField == "productId"){
      filterValue = +filterValue
    }
    console.log("筛选",filterField,filterValue,typeof filterValue)
    //将查询到的数据放在数组最前面
    let result = []
    result = comboList.value.filter(({ [filterField]: fieldValue }) => fieldValue === filterValue);
    comboList.value.forEach(i => {
      result.forEach(r => {
        comboList.value.splice(comboList.value.indexOf(r),1)
        comboList.value.unshift(r)
      })
    })
    console.log("筛选后的comboList.value",comboList.value);
  }else{
    queryComboList()
  }

}

function savepid() {
  console.log('多选的数据',multipleSelection.value);
  if(multipleSelection.value.length<=0){
    ElMessage.warning('请选择组合款的子商品')
  }else visible.combo = false
}


const accept = import.meta.env.VITE_ACCEPT


//附件
const accept2 = ".pdf,.docx,.xlsx,.doc,.xls"
const fujianList = ref([])
const fujianfileid = ref([])
const listType = ref("text")

const getfjfileId = (val) => {
  fujianfileid.value.push(val);
  console.log("附件列表", fujianList.value,fujianfileid.value)
}
const delfjfileId = (val) => {
  fujianfileid.value = val
  console.log('删除后的附件列表',fujianList.value,fujianfileid.value);
}


const fileList1 = ref([])
const fileList2 = ref([])
const fileList3 = ref([])

const fList1 = ref([])
const fList2 = ref([])
const fList3 = ref([])

const fileid1 = ref([])
const fileid2 = ref([])
const fileid3 = ref([])

const formafileList = ref([])


const fileid = ref([])
const fileid0 = ref([])

//审款图片
let mainPic = ref("zm") //主图
const zmfileid = ref([]) //正面图片fileid存放
const fmfileid = ref([]) //反面图片fileid存放
const cmfileid = ref([]) //侧面图片fileid存放
const xjfileid = ref([]) //细节图片fileid存放
const zmfileList = ref([]) //正面图片路径存放
const fmfileList = ref([]) //反面图片路径存放
const cmfileList = ref([]) //侧面图片路径存放
const xjfileList = ref([]) //细节图片路径存放

let uploadSetting = reactive({
  headers: {
    'Authorization-admin': getToken(),
    tenant: 'MDAwMA=='
  },
  data: {
    folderId: 1,
  }
})

const getzmfileId = (val) => {
  zmfileid.value.push(val);
  console.log("审款正面图片列表", zmfileList.value,zmfileid.value)
}

const getfmfileId = (val) => {
  fmfileid.value.push(val);
  console.log("审款反面图片列表", fmfileList.value,fmfileid.value)
}

const getcmfileId = (val) => {
  cmfileid.value.push(val);
  console.log("审款侧面图片列表", cmfileList.value,cmfileid.value)
}

const getxjfileId = (val) => {
  xjfileid.value.push(val);
  console.log("审款细节图片列表", xjfileList.value,xjfileid.value)
}

const delzmfileId = (val) => {
  zmfileid.value = val
}

const delfmfileId = (val) => {
  fmfileid.value = val
}

const delcmfileId = (val) => {
  cmfileid.value = val
}

const delxjfileId = (val) => {
  xjfileid.value = val
}


const getfileId1 = (val) => {
  // fileid1.value=[]
  // let i = fileid1.value.indexOf(val)
  // if(i == -1){
  fileid1.value.push(val)
  // fileList1.value[fileid1.value.length-1].fileid = val
  // fileList1.value[fileList1.value.length].fileid = val
  // }
  // else fileid1.value.splice(i,1)
  console.log("getfileId1", fileid1.value, fileList1.value)
}

const getfileId2 = (val) => {
  // fileid2.value=[]
  // let i = fileid2.value.indexOf(val)
  // if(i == -1){
  fileid2.value.push(val)
  // }
  // else fileid2.value.splice(i,1)
  console.log("getfileId2", fileid2.value)
}

const getfileId3 = (val) => {
  // fileid3.value=[]
  // let i = fileid3.value.indexOf(val)
  // if(i == -1){
  fileid3.value.push(val)
  // }
  // else fileid3.value.splice(i,1)
  console.log("getfileId3", fileid3.value)
}

// const delfileId = (val) => {
//   console.log("删除后", val)
//   form.value.fileId = val
//   console.log("删除后", form.value.fileId)
// }

const delfileId1 = (val) => {
  // fileid1.value=[]
  // fileid1.value.splice(fileid1.value.indexOf(val),1)
  fileid1.value = val
  console.log("delfileId1", fileid1.value)
}

const delfileId2 = (val) => {
  // fileid1.value=[]
  // fileid2.value.splice(fileid2.value.indexOf(val),1)
  fileid2.value = val
  console.log("delfileId2", fileid2.value)
}

const delfileId3 = (val) => {
  // fileid1.value=[]
  // fileid3.value.splice(fileid3.value.indexOf(val),1)
  fileid3.value = val
  console.log("delfileId3", fileid3.value)
}


for (let i = 0; i < fList1.value.length; i++) {
  console.log("循环来了")
  fList1.value[i].url = fList1.value[i].imgPath;
  fList1.value[i].fileid = fileid1.value[i]
  fileList1.value = fList1.value;
}

for (let i = 0; i < fList2.value.length; i++) {
  fList2.value[i].url = fList2.value[i].imgPath;
  fList2.value[i].fileid = fileid2.value[i]
  fileList2.value = fList2.value;
}

for (let i = 0; i < fList3.value.length; i++) {
  fList3.value[i].url = fList3.value[i].imgPath;
  fList3.value[i].fileid = fileid3.value[i]
  fileList3.value = fList3.value;
}

const props = defineProps({
  productId: {
    type: Number,
    default: 0
  },
  productCode: {
    type: String,
    default: ''
  },
  permission: {
    type: Boolean,
    default: true
  }
})

let { productId, productCode, permission } = toRefs(props);
let pcode = ref();
const emit = defineEmits(['cancel']);
function initForm(data) {
  return {
    brandId: data && data.brandId || [],
    productName: data && data.productName || '',
    productCode: data && data.productCode || '',
    oldItemCode: data && data.oldItemCode || '',
    printItemCode: data && data.printItemCode || 0,
    productBrief: data && data.productBrief || '',
    remark: data && data.remark || '',
    shopGroupId: data && data.shopGroupId || '',
    classifyId: data && data.classifyId || '',
    associateclassifyId: data && data.associateclassifyId || '',
    supplierName: data && data.supplierName || '',
    shopId: data && data.shopId || '',
    ifLogistics: data && data.ifLogistics || 0,
    shelveState: data && data.shelveState || 0,
    ifOversold: data && data.ifOversold || 0,
    ifCredit: data && data.ifCredit || '',
    gylIscombo: data && data.gylIscombo || '0',
    salechannellist: data && data.salechannellist || '',
    productids : data && data.formafileId || [],
    sendWay: data && data.sendWay || 0,
    creditLimit: data && data.creditLimit || 0,
    ifHuabei: data && data.ifHuabei || 1,
    productText: data && data.productText || '',
    images: data && data.images || [],
    fimages: data && data.fimages || [],
    fileid1: data && data.fileid1 || [],
    fileid2: data && data.fileid2 || [],
    fileid3: data && data.fileid3 || [],
    fileId: data && data.fileId || [],
    formafileId: data && data.formafileId || [],
    fileList: data && data.fileList || [],
    fujianfileid: data && data.fujianfileid || [],
    deletes: data && data.images || [],
    productAttr: data && data.productAttr || [],
    names: data && data.names || [
      {
        code: '',
        skuName: '',
        values: [
          {
            valueCode: '',
            skuValue: '',
            image: '',
          },
        ],
      },
    ],
    skus: data && data.skus || [
      {
        skuName: '',
        skuValue: '',
        price: '',
        originalPrice: '',
        stockNumber: '',
        weight: '',
        skuImage: '',
        style: '',
      },
    ],
  }
}
function initParams(data) {
  return {
    applyPrice: data && data.applyPrice || 0,
    attrStyle: data && data.attrStyle || 1,
    categoryId: data && data.categoryId || '',
    oversold: data && data.oversold || 1,
    collects: data && data.collects || 0,
    groupId: data && data.groupId || '',
    imgs: data && data.imgs || [],
    formalimgs: data && data.formalimgs || [],
    fileList1: data && data.fileList1 || [],
    fileList2: data && data.fileList2 || [],
    fileList3: data && data.fileList3 || [],
    fileid1: data && data.fileid1 || [],
    fileid2: data && data.fileid2 || [],
    fileid3: data && data.fileid3 || [],
    fileId: data && data.fileId || [],
    formafileId: data && data.formafileId || [],
    fujianfileid: data && data.fujianfileid || [],
    deletes: data && data.deletes || [],
    isDelete: data && data.isDelete || 0,
    limitCount: data && data.limitCount || 0,
    minusStock: data && data.minusStock || '',
    needLogistics: data && data.needLogistics || 1,
    platform: data && data.platform || '',
    price: data && data.price || 0,
    productCode: data && data.productCode || '',
    oldItemCode: data && data.oldItemCode || '',
    printItemCode: data && data.printItemCode || 0,
    productName: data && data.productName || '',
    sellCount: data && data.sellCount || 0,
    sellDesc: data && data.sellDesc || '',
    sellType: data && data.sellType || '',
    shortName: data && data.shortName || '',
    gylIscombo: data && data.gylIscombo || '',
    salechannellist: data && data.salechannellist || '',
    skuAttrList: data && data.skuAttrList || [
      {
        code: '',
        skuName: '颜色',
        needImg: false,
        values: [
          {
            skuValue: '',
            valueCode: '',
            image: '',
          },
        ],
      },
      {
        code: '',
        skuName: '尺码',
        needImg: false,
        values: [
          {
            skuValue: '',
            valueCode: '',
            image: '',
          },
        ],
      },
      {
        code: '',
        skuName: '图案',
        needImg: false,
        values: [
        ],
      }
    ],
    initskuAttrList: data && data.initskuAttrList || [],
    skuList: data && data.skuList || [
      {
        isDelete: '',
        skuAttrCodeDTOList: [
          // {
          //   code: '',
          //   valueCode: '',
          // },
        ],
        skuAttrList: [],
        sku: '',
        skuImg: '',
        price: 0,
        originalPrice: 0,
        stockNumber: 0,
        weight: 0,
      },
    ],
    sortOrder: data && data.sortOrder || '',
    status: data && data.status || '',
    stock: data && data.stock || '',
    supplierName: data && data.supplierName || '',
    shopId: data && data.shopId || '',
    views: data && data.views || '',
    weight: data && data.weight || '',
    selectColors: data && data.selectColors || [],
  }
}

const formRef = ref()
const paramsRef = ref()
let supplierList = ref([])
/**
 * form
 * @type {ProductForm}
 */
let form = ref({})
form.value = initForm()

const rules = {
  productName: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
  ],
  oldItemCode: [
    { required: true, message: '请选择供应商款号', trigger: 'change' },
  ],
  salechannellist: [
    { required: true, message: '请选择销售渠道', trigger: 'change' },
  ],
  // shopGroupId: [
  //   { required: true, message: '请选择供应商分组', trigger: 'change' },
  // ],
  // brandId: [
  //   { required: true, message: '请选择商品品牌', trigger: 'change' },
  // ],
  shopId: [
    { required: true, message: '请选择供应商', trigger: 'change' },
  ],
  classifyId: [
    { required: true, message: '请至少选择一条‘真’的商品属性', trigger: 'change' },
  ],
  productAttr: [
    { required: true, message: '请选择商品属性', trigger: 'change' },
  ],
  // associateclassifyId: [
  //   { required: true, message: '请选择联营商分类', trigger: 'change' },
  // ],
  // ifLogistics: [
  //   { required: true, message: '请选择是否需要物流', trigger: 'change' },
  // ],
  // shelveState: [
  //   { required: true, message: '请选择是否上架', trigger: 'change' },
  // ],
  // ifOversold: [
  //   { required: true, message: '请选择是否允许超卖', trigger: 'change' },
  // ],
  //sendWay: [
  // { required: true, message: '请选择发货方式', trigger: 'change' },
  // ],
  // ifCredit: [
  //   {
  //     required: true,
  //     message: '请选择是否支持积分兑换',
  //     trigger: 'change',
  //   },
  // ],
  creditLimit: [
    { required: true, message: '请输入单笔最大抵扣', trigger: 'blur' },
  ]

}

let params = ref({})
params.value = initParams();

/** 页面总visible */
let visible = reactive({
  image: false,
  combo: false
})

let active = shallowRef(1);


//  获取内部商品编码
// function getProductCodeData() {
//   getProductCode().then(res => {
//     console.log("code值",res.data)
//     form.value.productCode = res.data
//     console.log("orrrr值",form.value.productCode)
//   })
// }

// let integralList = ref([]);
/** 积分兑换金额比例 */
let integralProportion = shallowRef('');
function getCredit() {
  getSelect({ dictName: 'CREDIT_CONFIG' }).then(res => {
    // integralList.value = res.data
    res.data.forEach((item) => {
      if (item.dictName === 'credit_exchange_rate') {
        integralProportion.value = item.dictDescribe
      }
    })
  })
}

let imgList = ref([]);
let detailImg = shallowRef('');
function handleImageSuccess(response) {
  const { url } = response.data
  imgList.value.push(url)
}
function handlePictureCardPreview(file) {
  detailImg.value = file.imgPath
  visible.image = true
  console.log("图片地址", file.imgPath)
}
// 移除图片
function handleRemove(file) {
  const { imgPath } = file
  form.value.imgs = form.value.imgs.filter((item) => {
    return item.imgPath !== imgPath
  })
}
// 下一步
// function next() {
//   formRef.value.validate((valid) => {
//     if (valid) {
//       if (active.value === 1) {
//         active.value = 0
//         sessionStorage.setItem(
//           'form', JSON.stringify(form.value.skus)
//         )
//       }
//     } else {
//       ElMessage.warning('请填写正确的信息!')
//       return false
//     }
//   })
// }
// 下一步 tab版
async function nextTab(toTab, fromTab) {
  if(toTab==='basicInfo') {
    return true;
  }
  let canPass = false;
  await formRef.value.validate((valid) => {
    if (valid) {
      sessionStorage.setItem(
          'form', JSON.stringify(form.value.skus)
      )
      canPass = true;
    } else {
      ElMessage.warning('请填写正确的信息!')
      return false
    }
  })
  return canPass;
}

async function deleteByFileid(fileids){
  console.log('进入从minio里删除');
  await deletefile(fileids).then((res) => {
    console.log('从minio里删除成功',res);
  })
}

// 点击新增商品时表单数据重置
async function reset() {
  console.log("reset")
  //没点击保存就删除minio里的图片信息（失败）
  // if(!isSave.value){
  //   let all = zmfileid.value.concat(fmfileid.value, cmfileid.value, xjfileid.value,fujianfileid.value,params.value.formafileId,params.value.fileid1,params.value.fileid2,params.value.fileid3)
  //   console.log('全部的fileid',all,form.value);
  //   if(all.length > 0){
  //     await deleteByFileid(all)
  //   }
  // }
  // imgList.value = []
  // isSave.value = true
  saveDisabled.value = false
  multipleSelection.value = []
  productids.value = []
  detailImg.value = ''
  visible.image = false
  active.value = 1
  form.value = initForm()
  params.value = initParams()
  formRef.value?.resetFields()
  paramsRef.value?.resetFields()
}
// 返回
function back() {
  console.log("back")
  active.value = 1
  emit('cancel')
  fileList1.value = []
  fileList2.value = []
  fileList3.value = []
  fList1.value = []
  fList2.value = []
  fList3.value = []
}
// 上一步
function last() {
  if (active.value !== 1) {
    active.value = 1
  }
}
// 保存
function save() {
  if (params.value.attrStyle === 1) {
    for (let i = 0; i < params.value.skuAttrList.length; i++) {
      if (params.value.skuAttrList[i].skuName === '') {
        ElMessage.warning('规格名不能为空!')
        return false
      }
    }
  }
  //销售渠道不能为空
  if(form.value.salechannellist == ""){
    ElMessage.warning('销售渠道不能为空!')
    return false
  }
  // 将真和淘的数据加在一起
  form.value.productAttr.push(...productAttr1.value);
  console.log("加起来的数据是",form.value.productAttr);
  //组合款begin
  if(form.value.gylIscombo == '1'){
    console.log('多选的数据',multipleSelection.value);
    if(multipleSelection.value.length>0){
      productids.value = []
      multipleSelection.value.forEach(i => {
        productids.value.push(i.productId)
      })
    }
    console.log("组合款pids",productids.value)
    form.value.productids = productids.value
  }
//组合款end
//附件
  form.value.fujianfileid = fujianfileid.value
  console.log('附件的信息',fujianfileid.value);
  console.log("productCodeSave", form.value.productCode)
  // console.log("supplierList",supplierList);
  // let result = supplierList.filter(i => i.shopId === form.value.shopId)
  // 通过选中供应商id 获取选中供应商名称
  let result = shops.value.filter(i => i.shopId === form.value.shopId)
  console.log("result", result)
  if(result.length==0){
    ElMessage.warning('供应商不能为空!')
    return false
  }
  form.value.supplierName = result[0].shopName
  form.value.names = JSON.parse(JSON.stringify(params.value.skuAttrList));
  form.value.names.forEach(item => {
    if (item.skuName == '图案') {
      item.values = item.values.filter(item => item.skuValue !== undefined)
    }
  })
  form.value.skus = params.value.skuList
  form.value.skus.forEach((element) => {
    element.style = params.value.attrStyle
  })
  console.log("sku信息", form.value.skus, form.value.names)
  form.value.images = params.value.imgs
  console.log("图片信息2", params.value.imgs)
  form.value.fimages = params.value.formalimgs
  // form.value.fileId = params.value.fileId
  form.value.formafileId = params.value.formafileId
  console.log('选款图片',form.value.formafileId,form.value.fimages);
   //如果只补充了价格或者只补充了颜色尺码或者只补充了选款图就要求这些都要补充
  if((form.value.skus.length>0 && form.value.skus[0].originalPrice!=0) ||
  (form.value.names[0].values.length>0 && form.value.names[0].values[0].skuValue!="") ||
  (form.value.names[1].values.length>0 && form.value.names[1].values[0].skuValue!="") ||
  form.value.formafileId.length>0){
    console.log('进来第二页的校验');
    let colorsize = true //颜色尺码都不为空
    //颜色不能为空
    if(form.value.names[0].values.length==0 || form.value.names[0].values[0].skuValue== undefined || form.value.names[0].values[0].skuValue==""){
      colorsize = false
      ElMessage.warning('颜色不能为空!')
      return false
    }
    //尺码不能为空
    if(form.value.names[1].values.length==0 || form.value.names[1].values[0].skuValue== undefined || form.value.names[1].values[0].skuValue==""){
      colorsize = false
      ElMessage.warning('尺码不能为空!')
      return false
    }
    //颜色尺码都不为空的情况下工厂价不能为空
    if(form.value.skus.length>0 && colorsize){
      for (let i = 0; i < form.value.skus.length; i++) {
        if (form.value.skus[i].originalPrice == 0) {
          ElMessage.warning('工厂价不能为空!')
          return false
        }
      }
    }
    //选款图片不能为空
    if(form.value.formafileId.length==0){
      ElMessage.warning('选款图片不能为空!')
      return false
    }
  }
  form.value.fileid1 = params.value.fileid1
  form.value.fileid2 = params.value.fileid2
  form.value.fileid3 = params.value.fileid3
    // 使用 concat() 合并四个数组
  console.log('主图是：',mainPic.value);
  let mergedArray
  if(mainPic.value=='zm'){
    mergedArray = zmfileid.value.concat(fmfileid.value, cmfileid.value, xjfileid.value);
  }else if(mainPic.value=='fm'){
    mergedArray = fmfileid.value.concat(zmfileid.value, cmfileid.value, xjfileid.value);
  }else if(mainPic.value=='cm'){
    mergedArray = cmfileid.value.concat(zmfileid.value, fmfileid.value, xjfileid.value);
  }else if(mainPic.value=='xj'){
    mergedArray = xjfileid.value.concat(zmfileid.value, fmfileid.value, cmfileid.value);
  }else{
    mergedArray = zmfileid.value.concat(fmfileid.value, cmfileid.value, xjfileid.value);
  }
  form.value.fileId = mergedArray
  // form.value.fileid1 = fileid1.value
  // form.value.fileid2 = fileid2.value
  // form.value.fileid3 = fileid3.value
  console.log("图片fileId+formafileId", form.value.fileId, form.value.formafileId)
  console.log("图片信息3-formal", params.value.formalimgs)
  if(form.value.brandId.length>0){
    form.value.brandId = form.value.brandId.join(',')
    console.log("brandId", form.value.brandId)
  }else{
    form.value.brandId = null
  }
  form.value.deletes = params.value.deletes
  form.value.classifyId = Array.isArray(form.value.classifyId)  // 平台分类
    ? form.value.classifyId[form.value.classifyId.length - 1]
    : form.value.classifyId

  form.value.associateclassifyId = Array.isArray(form.value.associateclassifyId)  // 联营商分类
    ? form.value.associateclassifyId[form.value.associateclassifyId.length - 1]
    : form.value.associateclassifyId
  if (productId.value) {
    form.value.productId = productId.value
    console.log("编辑的参数", form.value)
    saveDisabled.value = true
    getClassifyUpdate(form.value).then(res => {
      if (res.code === '') {
        ElMessage.success('成功!')
        // isSave.value = true
        back()
        reset()
      }
    }).catch(err => {
      saveDisabled.value = false
      // form.value.brandId = brandIdFail.value;
    })
  } else {
    console.log("新增的参数", form.value)
    saveDisabled.value = true
    getClassifyAdd(form.value).then(res => {
      if (res.code === '') {
        ElMessage.success('成功!')
        // isSave.value = true
        back()
        reset()
      }
    }).catch(err => {
      saveDisabled.value = false
      // form.value.brandId = brandIdFail.value;
    })
  }
}

/**
 * *******************************************************
 * ************************ 商品详情  *********************
 * *******************************************************
 */
/** 供应商分组 */
let groupList = ref([]);
function groups(shopid) {
  let param = {
    shopId: shopid
  }
  console.log('供应商分组param', param);
  getGroupSelect(param).then(res => {
    groupList.value = res.data
  })
}

// 监听供应商，获取对应的供应商的供应商分组options
watch(() => form.value.shopId, (value) => {
  console.log('选择的供应商', value);
  groups(value)
}, { immediate: false, deep: true })

/** 官方分类 （更名为平台分类）*/
let classifyList = ref([]);
function selectList() {
  getClassify().then(res => {
    classifyList.value = filterList(res.data)
  })
}

// 联营商商品分类
const associateClassifyList = ref([])
// 监听平台分类，获取对应的联营商商品分类options
watch(() => form.value.classifyId, (value) => {
  if (value === '') {
    form.value.associateclassifyId = ''
    associateClassifyList.value = [];
  }
  if (typeof value === 'number') {
    value = [value]
  }
  if (Array.isArray(value) && value.length > 0) {
    getAssociate(value[value.length - 1]).then(res => {
      associateClassifyList.value = res.data
    }).catch(error => {
      ElMessage.error("系统错误")
    })
  }
})

// watch(() => form.value.gylIscombo, (value) => {
//   if (value === '0') {
//     //选择了正常款
//     multipleSelection.value = []
//     productids.value = []
//   }
// })

// watch(() => form.value.gylIscombo, (value) => {
//   if (value === '1') {
//     visible.combo = true
//     getComboList().then(res=>{
//       console.log("组合款弹窗数据",res)
//       comboList.value = res.data.list
//     }).catch(error => {
//       ElMessage.error("获取失败", error)
//     })
//   }
// })

// 获取详情
function details() {
  // isSave.value = true
  getClassifyGetById({ productId: productId.value }).then(res => {
    console.log("编辑查看res", res)
    //组合款begin
    productids.value = res.data.productsonids //组合款子商品id列表
    multipleSelection.value = res.data.productson //让点开编辑时，子商品那一栏能出现列表数据
    //组合款end
    fileid1.value = []
    fileid2.value = []
    fileid3.value = []
    form.value = res.data
    if(form.value.brandId.length>0){
      form.value.brandId = form.value.brandId.split(',').map(String);
    }
    console.log('点击编辑查看的品牌',form.value.brandId);
     // 使用filter方法筛选出第一个元素为"淘"的数组
     productAttr1.value = form.value.productAttr.filter(subArray => subArray[0] === '淘');
    // 使用filter方法筛选出第一个元素为"真"的数组
    form.value.productAttr = form.value.productAttr.filter(subArray => subArray[0] === '真');
    visible.combo = false
    form.value.productText = res.data.productText
    if (res.data.names.length !== 0) {
      params.value.skuAttrList = res.data.names
      params.value.selectColors = params.value.skuAttrList[0].values.map(item => Number(item.skuValue));
      console.log('编辑查看skuAttrList',params.value.skuAttrList,params.value.selectColors);
      params.value.initskuAttrList = JSON.parse(JSON.stringify(res.data.names)) // 记录skuAttrList的储时状态，仅用于后续规则图片的删除记录
    }
    params.value.skuList = form.value.skus
    console.log("初始skus", params.value.skuList)
    params.value.attrStyle = res.data.skus[0] ? res.data.skus[0]?.style : 1

    // params.value.imgs = res.data.images
    // params.value.formalimgs = res.data.fimages
    mainPic.value = res.data.mainPic //主图的设置
    params.value.formafileId = res.data.fileid0
    formafileList.value = res.data.fimages
    fileid.value = res.data.fileid
    fileid0.value = res.data.fileid0
    fList1.value = res.data.fileimg1
    fList2.value = res.data.fileimg2
    fList3.value = res.data.fileimg3
    fileid1.value = res.data.fileid1
    fileid2.value = res.data.fileid2
    fileid3.value = res.data.fileid3
    params.value.fileid1 = res.data.fileid1
    params.value.fileid2 = res.data.fileid2
    params.value.fileid3 = res.data.fileid3
    for (let i = 0; i < fList1.value.length; i++) {
      fList1.value[i].url = fList1.value[i].imgPath;
      fList1.value[i].fileid = fileid1.value[i]
      fileList1.value = fList1.value;
    }
    params.value.fileList1 = fileList1.value
    for (let i = 0; i < fList2.value.length; i++) {
      fList2.value[i].url = fList2.value[i].imgPath;
      fList2.value[i].fileid = fileid2.value[i]
      fileList2.value = fList2.value;
    }
    params.value.fileList2 = fileList2.value
    for (let i = 0; i < fList3.value.length; i++) {
      fList3.value[i].url = fList3.value[i].imgPath;
      fList3.value[i].fileid = fileid3.value[i]
      fileList3.value = fList3.value;
    }

    for (let i = 0; i < formafileList.value.length; i++) {
      formafileList.value[i].url = formafileList.value[i].imgPath;
      formafileList.value[i].fileid = fileid0.value[i]
    }
    params.value.fileList3 = fileList3.value

    form.value.fileId = res.data.fileid   // 审款图片id列表
    form.value.fileList = res.data.images // 审款图片对象列表
    console.log('form.value.fileList-----------------',form.value.fileList);
    for (let i = 0; i < form.value.fileList.length; i++) {
      form.value.fileList[i].url = form.value.fileList[i].imgPath;
      form.value.fileList[i].fileid = fileid.value[i]
    }

    params.value.imgs = form.value.fileList
    params.value.formalimgs = formafileList.value
    console.log("formafileList.value-------------",formafileList.value)
    //处理审款图片，将它根据正反侧细区分
    dealSkimage(form.value.fileList)
    //附件
    fujianList.value = res.data.fujianList
    fujianfileid.value = res.data.fujianfileid
    for (let i = 0; i < fujianList.value.length; i++) {
      fujianList.value[i].url = fujianList.value[i].imgPath;
      fujianList.value[i].fileid = fujianfileid.value[i]
      fujianList.value[i].name = fujianList.value[i].fileName;
    }
    console.log('附件',fujianList.value,fujianfileid.value);
  })
}

function dealSkimage(filesArray){
  filesArray.forEach(file => {
    const fileName = file.fileName;
    console.log('file--------------',file);
    if (fileName.endsWith('_正')) {
      // 执行针对 '_正' 的操作
      zmfileList.value.push(file)
      zmfileid.value.push(file.fileid)
      zmpreviewlist.value = []
      zmfileList.value.forEach(zm=>{zmpreviewlist.value.push(zm.url)})
      console.log("正面",zmfileList.value,zmfileid.value);
    } else if (fileName.endsWith('_反')) {
      // 执行针对 '_反' 的操作
      fmfileList.value.push(file)
      fmfileid.value.push(file.fileid)
      fmpreviewlist.value = []
      fmfileList.value.forEach(fm=>{fmpreviewlist.value.push(fm.url)})
      console.log("反面",fmfileList.value,fmfileid.value);
    } else if (fileName.endsWith('_侧')) {
      // 执行针对 '_侧' 的操作
      cmfileList.value.push(file)
      cmfileid.value.push(file.fileid)
      console.log("侧面",cmfileList.value,cmfileid.value);
      cmpreviewlist.value = []
      cmfileList.value.forEach(cm=>{cmpreviewlist.value.push(cm.url)})
    } else if (fileName.endsWith('_细')) {
      // 执行针对 '_细' 的操作
      xjfileList.value.push(file)
      xjfileid.value.push(file.fileid)
      console.log("细节",xjfileList.value,xjfileid.value);
      xjpreviewlist.value = []
      xjfileList.value.forEach(xj=>{xjpreviewlist.value.push(xj.url)})
    }
  });
}

function filterList(data) {
  data.forEach((i) => {
    if (i.childs.length) {
      filterList(i.childs)
    } else {
      i.childs = null
    }
  })
  return data
}

defineExpose({
  last,
  reset,
  details
})

function getCode() {
  form.value.productCode = productCode
  console.log("code过得来吗")
}

/** 品牌数据 */
let brandList = ref([]);
function getBrandListData() {
  getBrandList().then(res => {
    brandList.value = res.data
  })
}


function getProductShop() {
  getshop().then(res => {
    supplierList.value = res.data
    console.log("获取供应商的res", supplierList.value)
  })
}
let shops = ref([]);
function getShopName() {
  getshop().then(res => {
    shops.value = res.data
    // form.value.shopId = shop.value.shopId
  })
}

function cascaderClear(value){
  console.log('cascaderClear',value);
  form.value.productAttr = []
}

function cascaderClear1(value){
  console.log('cascaderClear1',value);
  productAttr1.value = []
}

const thrid = ref(false)

function expandchange(value){
  console.log('expand-change',value,value.length);
  if(value.length>2){
    thrid.value = true
  }
}

function cascaderChange(value) {

  if(thrid.value){
    console.log("商品属性值", value)  //{0: '真', 1: '637_男童', 2: '667_T恤', 3: 680}

  var val = [];
  var assert = value.some(element => {
    if (element[0] == '真') {
      val = element
      return true;
    }
    return false;
  })
  if (!assert) {
    productPro.value = initoptions;// 重置options
    form.value.classifyId = '';    // 平台分类
    return;
  }

  // 带出平台分类
  let category = val[1].split("_")[1];
  let attribute = val[2].split("_")[1];
  console.log("category,attribute", category, attribute)
  selectClassifyId('-' + category + '-' + attribute).then(res => {
    form.value.classifyId = res.data;
  }).catch(err => {
    console.log(err)
  })

  // 限制商品属性级联下拉框,将其他‘真’，不是此大类的叶子设为disabled
  productPro.value = productPro.value.map(option => ({  // label: 真、淘，childs： []
    ...option,
    children: option.children.map(child => ({           // label: 男装、男童，childs: []
      ...child,
      children: child.children.map(grandchild => ({     // label: T恤、外套 ,childs: []
        ...grandchild,
        children: grandchild.children.map(greatgrandchild => ({   // label: 九分裤、六分库 ,childs:null, disabled:
          ...greatgrandchild,
          disabled: option.value == '真' && (child.value.split("_")[1] != category || grandchild.value.split("_")[1] != attribute)
        })),
      })),
    }))
  }))
  }
}

let productAttr1 = ref([])
let productPro = ref([])
let initoptions = []
let productPro1 = ref([])
let initoptions1 = []
onBeforeMount(() => {
  // groups()
  selectList()
  getBrandListData()
  // getCode()
  getShopName()  //获取供应商商户
  // getProductCodeData()
  // if (this.productId) {
  //   this.details()
  // }
  getProductShop()
  getCredit();
  getProperty().then(res => {
    productPro1.value = res.data.filter(item=>item.label==="淘")
    initoptions1 = productPro1.value;
    productPro.value = res.data.filter(item=>item.label==="真")
    initoptions = productPro.value    // 有需求会对级联的option进行更改，需要维护一个初始option
    cascaderChange(form.value.productAttr)
  })

})
// export default {
//   watch: {
//     productId: {
//       handler (nVal, oVal) {
//         if (nVal) {
//           // this.details()
//         }
//       },
//     },
//   },
// }

const currentTab = ref('basicInfo')
</script>

<style lang="scss" scoped>

.skupload{
  display: flex;
  font-weight: bold;
  color: grey;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  .imageupload{
    width: 23%;
    border: 2px #dcdfe6 solid;
    padding: 10px;
    padding-top: 0;
  }
}


.sticky {
  position: sticky;
  top: 0px;
}

.flex-container {
  display: flex;
  align-items: center;
  /* 确保垂直对齐 */
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
}

.topBox {
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  justify-content: space-between;
}

.stepBox {
  .topBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.btnList {
  width: 100px;
  height: 38px;
  margin-top: 15px;
  margin-right: 15px;
}

.addTitle {
  font-size: 20px;
  color: #333333;
  line-height: 50px;
}

.stepsColor {
  font-size: 20px;
  line-height: 40px;
  padding: 20px 0;
  margin-bottom: 20px;

  .one_class {
    width: 40px;
    background: #3a68f2;
    border-radius: 50%;
    color: #ffffff;
    margin: 0 10px;
  }

  .two_class {
    color: #3a68f2;
  }

  .line {
    width: 230px;
    height: 2px;
    background: #e0e5eb;
    margin: 0 20px;
  }

  .t_class {
    width: 40px;
    background: #dddddd;
    border-radius: 50%;
    color: #333333;
    margin: 0 10px;
  }

  .w_class {
    color: #666666;
  }
}

.common {
  display: flex;
  justify-content: center;
  align-items: center;
}

.addCom {
  justify-content: space-around;
  align-items: unset;

  &>div {
    width: 100%;
  }

  .el-form {
    display: flex;
  }

  .leftCom {
    width: 65%;
    background: #ffffff;
  }

  .rightCom {
    // width: 35%;
    flex: 1;
    background: #ffffff;
    margin-left: 20px;
  }
}

.table{
  :deep(.el-table__header-wrapper){
    height: 33px;
  }
}

// .centerCom {
//   width: 1660px;
//   background: #ffffff;
//   box-shadow: 0px 5px 20px 0px rgba(51, 51, 51, 0.15);
//   border-radius: 4px;
// }
</style>

<style scoped>
.form-item-long :deep(.el-input) {
  width: 100%;
}

.vertical-buttons {
  display: flex;
  flex-direction: column;
  /* 垂直方向排列 */
  align-items: flex-start;
  /* 按钮对齐到开始位置（通常是左侧） */
  /*gap: 10px; */
  /* 按钮之间的间距，可以根据需要调整 */
  width: 100%;
}
</style>

<style lang="scss" >
/* 级联选择器样式 因为淘变成了三层，所以加上这个*/
.tao{
  .el-cascader-menu:nth-child(4) {
    display: none !important;
  }
  .el-cascader-menu:nth-child(3) {
    .el-cascader-node__postfix{
      display: none;
    }
  }
}
</style>

<!-- tabs样式 -->
<style lang="scss" scoped>
.commodity-info-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 0;
    border-bottom: 0;
  }
  :deep(.el-tabs__content) {
    padding: 8px;
    border: 1px solid #e4e7ed;
  }
  :deep(.el-tabs__item) {
    font-weight: 600;
  }
}
</style>