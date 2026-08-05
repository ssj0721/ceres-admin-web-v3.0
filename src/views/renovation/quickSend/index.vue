<template>
    <basic-container class="container">
        <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm037</div>
        <div class="pending">
        <!-- 搜索 -->
        <!-- <div class="formSearch"> -->
          <mybottons>
            <div class="buttons">
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button type="primary" @click="serchPic(false)">以图搜图/新增</el-button>
                <el-button type="primary" :disabled="isSearchpic" @click="searchMore" >批量搜图</el-button>
                <el-button type="primary" @click="exportSearchPicRS">导出搜图结果</el-button>
                <el-button type="primary" @click="add">上传</el-button>
                <el-button type="primary" @click="exportTips2">导出初审资料/模板</el-button>
                <el-button type="primary" @click="sendsAudit">导入补充资料</el-button>
                <el-button type="primary" @click="oldimport" >批量导入</el-button>
                <el-button type="primary" :disabled="isSubmit" @click="Submittals">送批</el-button>
                <el-button type="primary" @click="showExportDialog()" :disabled="isExport">导出</el-button>
                <el-button type="primary" :disabled="isUpdateExport" @click="updateExport" >批量导出修改</el-button>
                <el-button type="primary" @click="updateImport" >批量修改导入</el-button>
                <el-button type="primary" @click="CancelApply()" :disabled="isCancelApply">作废申请</el-button>
                <el-popconfirm title="是否要取回这些商品？" placement="bottom-start" @confirm="singleRetrieval()">
                  <template #reference>
                      <el-button type="primary" :disabled="isretri">取回</el-button>
                  </template>
                </el-popconfirm>
                <el-popconfirm title="是否要删除这些商品？" placement="bottom-start" @confirm="del()">
                  <template #reference>
                      <el-button type="primary">删除</el-button>
                  </template>
                </el-popconfirm>
                <el-button type="primary" @click="imgReviewMode()">审图模式</el-button>
                <el-button type="primary" @click="downloadfirstinstance">款式送审资料填写指引</el-button>
                <!-- <el-button type="primary" @click="openPicAudit()">AI审核</el-button> -->
              </div>
            <el-form ref="searchRef" :inline="true" :model="query">
              <!-- <el-form-item label="供应商款号" >
                <el-input v-model="query.oldItemCode" maxlength="50" placeholder="多个供应商款号以 ; 分隔开" />
              </el-form-item> -->
              <el-form-item label="创建时间" style="font-weight: bold;">
                <datePickerGyl v-model="query.createTimeList" :defaultTimeType="'day'" :clearable="true"></datePickerGyl>
              </el-form-item>
              <el-form-item label="只看待补充资料的商品" class="unfill">
                <el-switch v-model="query.unfill" @change="queryByUnfill" />
              </el-form-item>
              <el-form-item label="品牌商审款状态">
                <el-select v-model="query.irestates" placeholder="请选择品牌商审款状态" clearable multiple
                collapse-tags collapse-tags-tooltip :max-collapse-tags="maxtag">
                  <el-option label="已补充资料待送批" value="DRAFT" />
                  <el-option label="待审" value="APPROVED" />
                  <el-option label="作废" value="CANCELED" />
                  <el-option label="通过" value="ACCECTED" />
                  <el-option label="否决" value="REJECTED" />
                  <!-- <el-option label="INSIGNING1" value="INSIGNING1" /> -->
                  <el-option label="待申诉" value="INSIGNING2" />
                  <el-option label="申诉中" value="INSIGNING3" />
                  <el-option label="作废申请" value="CANCELED00" />
                  <el-option label="待批办" value="APPROVED00" />
                  <el-option label="暂缓" value="SUSPEND" />
                </el-select>
              </el-form-item>

              <el-form-item label="组织">
                <easySelectTable v-model="query.orgid" :props="orgprop"></easySelectTable>
              </el-form-item>
              <el-form-item label="创建部门">
                <easySelectTable v-model="query.deptid" :props="deptprop"></easySelectTable>
              </el-form-item>
              <el-form-item label="款字头">
                <easySelectTable v-model="query.bndid" :props="bndprop"></easySelectTable>
              </el-form-item>

              <el-form-item label="性别">
                <el-select v-model="query.sexids" placeholder="请选择性别，只能从已补充资料商品中筛选" clearable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="maxtag">
                  <el-option v-for="sex in sexList" :key="sex.id" :label="sex.name" :value="sex.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="大类">
                <el-select v-model="query.lcs" placeholder="请选择大类" clearable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="maxtag">
                  <el-option v-for="lc in lcList" :key="lc.id" :label="lc.name" :value="lc.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="品种">
                <el-select v-model="query.deps" placeholder="请选择品种" clearable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="maxtag">
                  <el-option v-for="dep in depList" :key="dep.id" :label="dep.name" :value="dep.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="搜图状态">
                <el-select v-model="query.sps" placeholder="请选择搜图状态" clearable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="maxtag">
                  <el-option v-for="sp in sps" :key="sp.id" :label="sp.label" :value="sp.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="销售渠道">
                <el-select v-model="query.salechannellist" placeholder="请选择销售渠道" clearable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="maxtag">
                  <el-option v-for="item in salechannellist" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="销售季期">
                <el-select v-model="query.plansaledatelist" placeholder="请选择销售季期，只能从已补充资料商品中筛选" clearable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="maxtag">
                  <el-option v-for="item in plansaledateList" :key="item.id" :label="item.id" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="是否是组合款">
                <el-select v-model="query.isComboList" placeholder="请选择是否是组合款，只能从已补充资料商品中筛选" clearable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="maxtag">
                  <el-option v-for="item in isComboList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="款号与其他条件叠加搜索" class="unfill">
                <el-switch v-model="query.notOnlyItemcode"  @change="queryByNotOnlyItemcode"/>
              </el-form-item>
              <el-form-item label="商品名称">
                <el-input v-model="query.search" maxlength="20" placeholder="请输入商品名称" clearable/>
              </el-form-item>
              <el-form-item label="款号" style="width: 75%;">
                <el-input v-model="query.itemcode" placeholder="多款用空格、半角逗号或换行符分隔，单款时模糊查询" clearable/>
              </el-form-item>
              <el-form-item  style="width: 10%;margin-left: 10px">
                <el-button type="primary" @click="visible = !visible">拓展选项</el-button>
              </el-form-item>
            </el-form>
            <!-- <div style="color: red;">注:当前只提供T恤、长裤、短裤、牛仔裤、衬衫、毛衣、外套、裙子、套装、图案、家居服、袜子、内裤品种的【预审搜图】服务，其他品种后续开放。</div> -->
          </mybottons>
        </div>
        <!-- 表格 -->
         <div class="second-main-container">
          <el-table
            v-loading="tableLoading"
            :data="tableData"
            border
            stripe
            :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
            tooltip-effect="dark"
            style="width: 100%"
            max-height="500"
            class="dataTable"
            v-horizontal-scroll="'always'"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="productId" label="商品ID" width="70" show-overflow-tooltip />
            <el-table-column
              prop="mainPic"
              label="搜主图"
            >
            <template v-slot:header>
              搜主图
              <el-switch v-model="allMainPic" @change="chooseAllMainPic"/>
            </template>
            <template #default="scope">
              <el-switch v-model="scope.row.isMainPic" />
            </template>
            </el-table-column>
            <el-table-column
              prop="fuPic"
              label="搜附图"
            >
            <template v-slot:header>
              搜附图
              <el-switch v-model="allFuPic" @change="chooseAllFuPic"/>
            </template>
            <template #default="scope">
              <el-switch v-model="scope.row.isFuPic" />
            </template>
            </el-table-column>
            <el-table-column label="商品主图" width="150" align="center">
              <template #default="scope">
                <img height="80" width="80" :src="scope.row.productImage" alt srcset @click="previewPic(scope.row.productImage)" />
              </template>
            </el-table-column>
            <el-table-column prop="itemcode" label="款号" width="140">
              <template #default="scope">
                <span>{{scope.row.itemcode}}</span>
                <el-tooltip
                    class="box-item"
                    effect="light"
                    content="复制款号"
                    placement="bottom"
                  >
                  <el-icon class="copy" @click="copy(scope.row.itemcode)"></el-icon>
                </el-tooltip>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="oldItemCode"
              label="供应商款号"
              width="200"
            /> -->
            <el-table-column prop="productName" label="商品名称" width="130"/>
            <el-table-column prop="ireState" label="品牌商审款状态" width="130">
            <template #default="scope">
              <span v-if="scope.row.ireState == null">待补充资料</span>
              <span v-if="scope.row.ireState == 1">待审</span>
              <span v-if="scope.row.ireState == 2">作废</span>
              <!-- <span v-if="scope.row.ireState == 2">否决</span> -->
              <span v-if="scope.row.ireState == 3">通过</span>
              <span v-if="scope.row.ireState == 4">否决</span>
              <!-- <span v-if="scope.row.ireState == 12">否决</span>
              <span v-if="scope.row.ireState == 5">否决</span>
              <span v-if="scope.row.ireState == 6">否决</span>
              <span v-if="scope.row.ireState == 7">否决</span>
              <span v-if="scope.row.ireState == 8">否决</span>
              <span v-if="scope.row.ireState == 9">待批办</span>
              <span v-if="scope.row.ireState == 10">否决</span> -->
              <span v-if="scope.row.ireState == 11">已补充资料</span>
              <span v-if="scope.row.ireState == 12">可上架</span>
              <span v-if="scope.row.ireState == 5">INSIGNING1</span>
              <span v-if="scope.row.ireState == 6">待申诉</span>
              <span v-if="scope.row.ireState == 7">申诉中</span>
              <span v-if="scope.row.ireState == 8">作废申请</span>
              <span v-if="scope.row.ireState == 9">待批办</span>
              <span v-if="scope.row.ireState == 10">暂缓</span>
              <!-- <span v-if="scope.row.ireState == 11">草稿</span> -->
            </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              width="170"
            >
            <template #header>
              <span>创建时间&nbsp;<el-icon color="gray" style="cursor: pointer;" @click="sortByCreateTime"><Sort /></el-icon></span>
            </template>
            </el-table-column>
            <el-table-column
              prop="searchpicTime"
              width="170"
            >
            <template #header>
              <span>上次搜图时间&nbsp;<el-icon color="gray" style="cursor: pointer;" @click="sortBySearchPicTime"><Sort /></el-icon></span>
            </template>
            </el-table-column>
            <el-table-column label="AI审核结果" align="center" width="120">
              <template #default="{ row }">
                <el-popover
                    popper-class="aiaudit-popover"
                    placement="top"
                    width="180"
                    trigger="hover">
                  <template #default>
                    <div class="aiaudit-desc-wrapper">
                      <span :class="[getAuditDotColor(row, 1)]">
                        审款格式审核：{{getAuditDesc(row, 1)}}</span><br />
                      <span :class="[getAuditDotColor(row, 2)]">
                        内部同款审核：{{getAuditDesc(row, 2)}}</span><br />
                      <span :class="[getAuditDotColor(row, 3)]">
                        品牌风格审核：{{getAuditDesc(row, 3)}}</span><br />
                      <span :class="[getAuditDotColor(row, 4)]">
                        图案使用不当审核：{{getAuditDesc(row, 4)}}</span><br />
                    </div>
                  </template>
                  <template #reference>
                    <div class="aiaudit-dots-wrapper">
                      <el-tooltip effect="dark" content="审款格式审核" placement="bottom">
                        <div class="audit-dot"
                             :class="[getAuditDotColor(row, 1)]"></div>
                      </el-tooltip>
                      <el-tooltip effect="dark" content="内部同款审核" placement="bottom">
                        <div class="audit-dot"
                             :class="[getAuditDotColor(row, 2)]"></div>
                      </el-tooltip>
                      <el-tooltip effect="dark" content="品牌风格审核" placement="bottom">
                        <div class="audit-dot"
                             :class="[getAuditDotColor(row, 3)]"></div>
                      </el-tooltip>
                      <el-tooltip effect="dark" content="图案使用不当审核" placement="bottom">
                        <div class="audit-dot"
                             :class="[getAuditDotColor(row, 4)]"></div>
                      </el-tooltip>
                      <div class="audit-dot disabled"></div>
                      <div class="audit-dot disabled"></div>
                    </div>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
<!--            <el-table-column prop="searchpicStatus" label="搜图状态" width="100" class-name="status-column" >-->
<!--              <template #default="scope">-->
<!--                <div-->
<!--                  class="full-cell"-->
<!--                  :class="getStatusClass(scope.row)"-->
<!--                  :style="getStatusStyle(scope.row)"-->
<!--                >-->
<!--                  <span v-if="scope.row.searchpicStatus == 0">未搜图</span>-->
<!--                  <span v-if="scope.row.searchpicStatus == 1">进行中</span>-->
<!--                  <span v-if="scope.row.searchpicStatus == 2">已完成</span>-->
<!--                </div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="searchpicStatus" label="搜图状态" width="100" class-name="status-column" >-->
<!--              <template #default="scope">-->
<!--                <div-->
<!--                  class="full-cell"-->
<!--                  :class="getStatusClass(scope.row)"-->
<!--                  :style="getStatusStyle(scope.row)"-->
<!--                >-->
<!--                  <span v-if="scope.row.searchpicStatus == 0">未搜图</span>-->
<!--                  <span v-if="scope.row.searchpicStatus == 1">进行中</span>-->
<!--                  <span v-if="scope.row.searchpicStatus == 2">已完成</span>-->
<!--                </div>-->
<!--              </template>-->
<!--            </el-table-column>-->
            <el-table-column
              prop="searchpicResult"
              width="450"
            >
            <template #header>
              <span>上次主图搜图结果:</span>
              <br/>
              <span>(对应相似度99%~100%；95%~99%；90%~95%；90%以下)</span>
            </template>
            <template #default="scope">
              <div style="white-space: pre-wrap; word-break: break-word;">{{scope.row.searchpicResult}}</div>
            </template>
            </el-table-column>
            <el-table-column
              prop="searchpicResult1"
              width="300"
            >
            <template #header>
              <span>上次附图1搜图结果:</span>
            </template>
            <template #default="scope">
              <div style="white-space: pre-wrap; word-break: break-word;">{{scope.row.searchpicResult1}}</div>
            </template>
            </el-table-column>
            <el-table-column
              prop="searchpicResult2"
              width="300"

            >
            <template #header>
              <span>上次附图2搜图结果:</span>
            </template>
            <template #default="scope">
              <div style="white-space: pre-wrap; word-break: break-word;">{{scope.row.searchpicResult2}}</div>
            </template>
            </el-table-column>
            <el-table-column prop="platform" label="平台" width="130"/>
            <el-table-column prop="remark" label="备注" width="130"/>
            <el-table-column prop="rejectname" label="否决原因" width="130"/>
            <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <!-- <el-button link type="primary" @click="seeMore(scope.row)">查看</el-button> -->
              <!-- <el-button type="primary" link @click="edit(scope.row)"
                v-if="scope.row.ifCredit == 0 || scope.row.ifCredit == 1 || (scope.row.ifCredit == 2 && !permission)">编辑</el-button> -->
              <el-button type="primary" link :disabled="scope.row.searchpicStatus == 1" @click="serchPic(scope.row)">搜图</el-button>
              <el-button type="primary" link @click="editAudit(scope.row)" >{{scope.row.ireState==null||scope.row.ireState==11?"编辑":"查看"}}</el-button>
              <el-button type="primary" link @click="openCopyAdd(scope.row)">复制</el-button>
              <el-popconfirm title="是否确认送批？" @confirm="Singlesubmittals(scope.row.productId)" >
                <template #reference>
                  <el-button type="primary" link v-if="scope.row.ireState==11" :disabled="scope.row.searchpicStatus != 2 && auditScope.has(2)">送批</el-button>
                </template>
              </el-popconfirm>
              <!--
                供应链：待审状态且未导出，以及待审诉、否决状态可取回
              -->
            <!-- <el-popconfirm
              v-if="((scope.row.ireState == 1 && (scope.row.endDerive == 0 || scope.row.endDerive == 1)) || scope.row.ireState == 6 || scope.row.ireState == 4)"
              title="是否确认取回？"
              @confirm="singleRetrieval(scope.row)"
            >
              <template #reference>
                <el-button type="primary" link >取回</el-button>
              </template>
            </el-popconfirm> -->
            <el-button type="primary" link @click="singleRetrieval(scope.row)"
              v-if="((scope.row.ireState == 1 && (scope.row.endDerive == 0 || scope.row.endDerive == 1)) || scope.row.ireState == 6 || scope.row.ireState == 4)">
              取回</el-button>

            <el-button type="primary" link @click="CancelApply(scope.row)" v-if="scope.row.ireState == 3">作废申请</el-button>
            </template>
          </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
                :current-page="page.page"
                :page-sizes="[10, 20, 50, 100, 200, 300, 400, 500]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                background
                :total="page.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
          </div>
        </div>

        <!--上传图片-->
        <el-dialog
          v-model="uploadVisible"
          title="批量上传商品"
          center
          :fullscreen="false"
          :close-on-click-modal="false"
          @close="cancelDialog"
          >
        <div v-loading.lock="uploadloading">
          <el-radio-group v-model="uploadType">
            <el-radio-button label="二级目录上传" value="1" />
            <el-radio-button label="三级目录上传" value="2" />
            <el-button type="primary" @click="chooseMainPicVisible=true" v-if="uploadType==2&&uploadList.length>0" style="margin-left: 20px;" :disabled="!rechoose">重新选择主图</el-button>
          </el-radio-group>
          <!-- 分割线 -->
          <el-divider style="margin: 15px 0;"/>
            <div class="el-upload__tip" style="font-size:14px;display:flex;" v-if="uploadType==1">
                <div>
                    <span style="font-weight:bold; font-size: 18px;">使用说明：</span>
                    <br/>
                    <br/>
                    <span style="font-weight:bold">一. 文件夹内容以及文件命名要求：</span>
                    <br/>
                    <el-icon><CaretRight /></el-icon>文件夹命名无要求，上传的文件夹里存放以【款号】为名的图片；
                    <br/>
                    <el-icon><CaretRight /></el-icon>【款号】格式：xx-yy-zzzzzz/xxx-yy-zzzzzz格式输入,xx/xxx=款字头,yy=年季,zzzzzz=流水号；
                    <br/>
                    <!-- <el-icon><CaretRight /></el-icon>【款号】不可以是中文，长度不可超过20位。
                    <br/> -->
                    <br/>
                    <span style="font-weight:bold">二. 主副图片文件命名规则：</span>
                    <br/>
                    <el-icon><CaretRight /></el-icon>仅支持图片类型为{{FileUploadType}}其中一种；
                    <br/>
                    <el-icon><CaretRight /></el-icon>主图：【款号】无横线加数字后缀为主图，例如："AB-52-123456"；
                    <br/>
                    <el-icon><CaretRight /></el-icon>附图：【款号】后接【横线和数字】或【下划线和数字】为附图；
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    例如："AB-52-123456-1"、"AB-52-123456-2；AB-52-123456_1"、"AB-52-123456_2"等。
                    <br/>
                    <br/>
                    <span style="font-weight:bold">三. 操作：</span>
                    <br/>
                    <el-icon><CaretRight /></el-icon>点击【选择文件】按钮，选择需要上传的文件夹即可。
                    <br/>
                    <el-icon><CaretRight /></el-icon>注：如果上传的文件名是已经存在的【款号】，会弹出提示框提示，请按照提示框内容进行下一步操作。
                </div>
                <div v-if="percentage>0">
                    <el-progress type="circle" :percentage="percentage" />
                </div>
            </div>
            <div class="el-upload__tip" style="font-size:14px;display:flex;" v-if="uploadType==2">
                <div>
                    <span style="font-weight:bold; font-size: 18px;">使用说明：</span>
                    <br/>
                    <br/>
                    <span style="font-weight:bold">一. 文件夹内容以及文件命名要求：</span>
                    <br/>
                    <el-icon><CaretRight /></el-icon>仅支持图片类型为{{FileUploadType}}其中一种；
                    <br/>
                    <el-icon><CaretRight /></el-icon>一级文件夹命名无要求，二级文件夹以【款号】为名称，二级文件夹里存放的图片命名无要求；
                    <br/>
                    <el-icon><CaretRight /></el-icon>一级文件夹里存放以【款号】为名的二级文件夹，各二级文件夹里存放该【款号】的所有图片；
                    <br/>
                    <el-icon><CaretRight /></el-icon>【款号】格式：xx-yy-zzzzzz/xxx-yy-zzzzzz格式输入,xx/xxx=款字头,yy=年季,zzzzzz=流水号；
                    <br/>
                    <br/>
                    <span style="font-weight:bold">二. 定义主副图片文件：</span>
                    <br/>
                    <el-icon><CaretRight /></el-icon>在上传完文件夹后会弹出一个选择每个款主图的窗口，勾选完之后点击确定即可；
                    <br/>
                    <br/>
                    <span style="font-weight:bold">三. 操作：</span>
                    <br/>
                    <el-icon><CaretRight /></el-icon>点击【选择文件】按钮，选择需要上传的文件夹，上传完之后选择各款的主图，选择完之后点击确定即可。
                    <br/>
                    <el-icon><CaretRight /></el-icon>注：如果上传的文件名是已经存在的【款号】，会弹出提示框提示，请按照提示框内容进行下一步操作；
                    <br/>
                    <el-icon><CaretRight /></el-icon>注：一个款只能选择一张主图；
                </div>
                <div v-if="percentage>0">
                    <el-progress type="circle" :percentage="percentage" />
                </div>
            </div>
            <!-- 分割线 -->
            <el-divider style="margin: 15px 0;"/>
            <div class="select-files-btn" style="font-weight: bold;font-size: 18px; margin: 15px 0;" v-if="uploadType==1">
              <span>二级文件夹上传商品：</span>
              <input ref="filElem" type="file" multiple class="upload-file" webkitdirectory @change="getFile" />
            </div>
            <div class="select-files-btn" style="font-weight: bold;font-size: 18px; margin: 15px 0;" v-if="uploadType==2">
              <span>三级文件夹上传商品：</span>
              <input ref="filElem" type="file" multiple class="upload-file" webkitdirectory @change="getFile2" />
            </div>
        </div>
        </el-dialog>

        <!--补充资料-->
        <EditDialog v-model:editVisible="editVisible" v-model:editloading="editloading" :editRow="editRow"
        :permission="permission" :quickNeed="true" @getAll="getAll" :type="type"/>

        <!--预审搜图-->
        <el-dialog v-model="searchPicVisible" title="搜图" :close-on-click-modal="false" :fullscreen="true" center
            width="1000px" @close="closeSearchPic">
            <!-- <el-button @click="closeSearchPic" style="position: relative; right">关闭</el-button> -->
            <SearchPic :imagelist="imagelist" :isClose="isClose" :isSee="isSee" :productId="picproductid" :itemcode="picitemcode"
            :plansaledate="picplansaledate" :searchpicResult="searchpicResult" :searchpicTime="searchpicTime" :ireState="picireState"
            :platformlist="picplatform" :lcdep="piclcdep"  @close="closeSearchPic" @getAll="getAll">
            </SearchPic>
        </el-dialog>

        <!-- 提示是否覆盖或跳过 -->
        <el-dialog
          v-model="tipVisible"
          title="提示"
          width="500"
          @handleClose="cancelUpload"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          >
          <span style="line-height:22px">{{ message }}</span>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="cancelUpload">取消</el-button>
              <el-button type="primary" v-if="uploadType==1" @click="quickAdd(true)">确定</el-button>
              <el-button type="primary" v-if="uploadType==2" @click="quickAdd2(true)">确定</el-button>
            </div>
          </template>
        </el-dialog>

        <!-- 导入补充资料 -->
        <ImportDialog v-model:productImport="productImport" v-model:uploading="uploading" :batchFileList="batchFileList" @getAll="getAll"></ImportDialog>

        <!-- 批量修改导入 -->
        <UpdateImportDialog v-model:productUpdateImport="productUpdateImport" :batchFileList="batchFileList" @getAll="getAll"></UpdateImportDialog>

        <!-- 批量导入 -->
        <OldImportDialog v-model:oldimportVisible="oldimportVisible" :batchFileList="batchFileList" @getAll="getAll"></OldImportDialog>

        <!-- 作废申请 -->
        <CancelApplyDialog v-model:cancelApplyVisible="cancelApplyVisible" :selectList="selectList" @getAll="getAll"></CancelApplyDialog>

        <!-- 导出 -->
        <ExportDialog v-model:exportDialogVisable="exportDialogVisable" :multipleSelection="multipleSelection"></ExportDialog>

        <!-- 作废申请 -->
        <AppealBackDialog v-model:appealBackVisible="appealBackVisible" :selectList="selectList" @getAll="getAll"></AppealBackDialog>

        <!-- 复制新增 -->
        <el-dialog
          v-model="copyAddVisible"
          title="复制新增"
          width="500"
          @handleClose="cancelCopyAdd"
          :close-on-click-modal="false"
          >
          <div>
            <el-card  style="margin:10px 0 10px 0">
              <el-form :inline="true" :model="addform" label-width="150px">
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
            <div style="display: flex; justify-content: center">
              <el-button type="primary" @click="copyAdd">新增</el-button>
              <el-button type="primary" @click="cancelCopyAdd">关闭</el-button>
            </div>
          </div>
        </el-dialog>

        <!-- 审图模式 -->
        <el-dialog title="审图模式"
          v-model="imgReviewModeDialogVisible"
          :fullscreen="true"
          top="3vh"
          :before-close="reviewClose"
          :close-on-click-modal="false"
          >
          <el-row>
            <el-col :span="4" v-for="(item, index) in queryInfo.data" :key="index">
              <el-card class="box-card" :body-style="{ height: '300px' }">
                <el-image
                  :src="item.productImage"
                  :preview-src-list="[item.productImage]"
                  :z-index="3000"
                  style="height: 95%"
                  fit="contain"
                ></el-image>
                <div class="realtime-info-head" align="center">
                  <a href="#" @click="editAudit(item)" title="点击查看详情">
                    {{ item.itemcode }}
                  </a>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-row>
            <el-pagination
              @size-change="handleSizeChangeReview"
              @current-change="handleCurrentChangeReview"
              :current-page="queryInfo.page"
              :page-size="queryInfo.pageSize"
              :page-sizes="[10, 20, 50, 100, 200, 300, 400, 500]"
              layout="total, sizes, prev, pager, next ,jumper"
              :total="queryInfo.total"
            >
            </el-pagination>
          </el-row>
        </el-dialog>

        <!-- 拓展选项 -->
        <el-dialog v-model="visible">
          <avue-form class="queryform_ext" ref="queryFormExt"
            :option="queryFormOptionExt" v-model="query"
          ></avue-form>
        </el-dialog>

        <!-- 展示错误信息 -->
        <ShowErrorDialog v-model:errorDialogVisable="errorDialogVisable" :tableData="errorList"></ShowErrorDialog>

        <!-- 三级目录上传选择主副图 -->
        <el-dialog
          v-model="chooseMainPicVisible"
          title="选择主附图生成商品"
          width="880"
          @handleClose="chooseMainPicClose"
          :close-on-click-modal="false">
          <div v-if="uploadList.length>0" style="height: 500px;overflow: auto">
            <el-row
              v-for="(item, index) in uploadList"
              :key="index"
              :span="24/(viewportWidth/150)"
            >
              <el-card  style="margin:10px 0 10px 0; display:flex;justify-content: space-around;flex-wrap: wrap;">
                <el-row style="font-weight: bold;">款号：{{ item.itemcode }}</el-row>
                <el-row>
                  <el-checkbox-group v-model="checkList" v-for="(item2, index) in item.img" :key="index">
                    <el-row>
                      <el-checkbox :value="item2.fileid" label="作为主图" @change="checked(item2.fileid,item.img)"></el-checkbox>
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
                          :src="item2.path"
                          alt="小图加载"
                          @click="previewPic(item2.path,item.img)"
                        />
                      </el-tooltip>
                    </el-row>
                  </el-checkbox-group>
                </el-row>
              </el-card>
            </el-row>
          </div>
          <div style="display: flex; justify-content: center">
            <el-button type="primary" @click="quickAdd2(false)">确定</el-button>
            <el-button type="primary" @click="chooseMainPicClose">关闭</el-button>
          </div>
        </el-dialog>

        <!-- 图片预览 -->
        <el-image-viewer
          v-if="imgViewerVisible"
          @close="closeImgViewer"
          width="20%"
          :url-list="previewlist"
          alt="非图片不能预览"
        />

        <!-- 提示是否要继续送批 -->
        <el-dialog
          v-model="tip2Visible"
          title="提示"
          width="500"
          @close="cancelUpload2"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          >
          <template  v-if="auditInfos.gs">
            <div style="line-height:22px">
              {{ isSingleSubmit? '该款【审款格式审核】不通过，若继续送批，请录入特别送批原因。' : auditInfos.gs }}
            </div>
            <el-input
                v-model="gsSumbitReason"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                placeholder="请输入特别送批的原因"
            />
          </template>
          <template v-if="auditInfos.zk">
            <div style="line-height:22px">
              {{ isSingleSubmit? '该款【内部同款审核】不通过，若继续送批，请录入特别送批原因。' : auditInfos.zk }}
            </div>
            <el-input
                v-model="submitReason"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                placeholder="请输入特别送批的原因"
            />
          </template>
          <template  v-if="auditInfos.fg">
            <div style="line-height:22px">
              {{ isSingleSubmit? '该款【品牌风格审核】不通过，若继续送批，请录入特别送批原因。' : auditInfos.fg }}
            </div>
            <el-input
                v-model="fgsubmitReason"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                placeholder="请输入特别送批的原因"
            />
          </template>
          <template  v-if="auditInfos.ta">
            <div style="line-height:22px">
              {{ isSingleSubmit? '该款【图案使用不当审核】不通过，若继续送批，请录入特别送批原因。' : auditInfos.ta }}
            </div>
            <el-input
                v-model="taSubmitReason"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                placeholder="请输入特别送批的原因"
            />
          </template>
          <template #footer>
            <div class="dialog-footer" style="padding: 0 15px 15px 15px">
              <el-button @click="cancelUpload2">取消</el-button>
              <el-button type="primary" @click="Stillsubmittals(submitId)">继续</el-button>
            </div>
          </template>
        </el-dialog>

        <!-- AI审核 -->
        <!-- <el-dialog v-model="picAuditVisiable" title="AI审核" :close-on-click-modal="false" :fullscreen="true" center
          width="1000px" @close="closePicAudit">
          <picAudit @close="closePicAudit"></picAudit>
        </el-dialog> -->
    </basic-container>
</template>

<script setup>
import {
  Retrieval,
  findPermission,
  getClassifyDelete,
  getClassifyGetAll,
  getQuickAdd,
  searchResultAdd
} from '@/api/commodity'
import { deletefile, getfileid } from '@/api/file'
import { editProduct, getPlanSaleDate, getSKimage, queryAssData01, queryDepData01, querySexData, querySysDictData, searchMorePic, updateSearchpicStatus,
  queryFormList, queryRejectReason, exportSearchPicResult, getMyAuditScope
 } from '@/api/itemaudit/ait001'
import { Submit, productExport2,batchUpdateExport } from '@/api/itemaudit/ait002'
import { connectSSE } from '@/hooks/useSse'
import { getUserId } from "@/utils/auth"
import { excel } from '@/utils/excelExport'
import imageCompressor from '@/utils/imageCompressor'
import checkWidthHeight from '@/utils/checkWidthHeight'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { h, onMounted, reactive, ref } from 'vue'
import { queryFormOptionExt } from './option'
import getGreenPlansaledate from '@/utils/getGreenPlansaledate'
import { querySelectTable,queryDept } from "@/views/po/pomnt116/index.js"
import clipboard3 from "vue-clipboard3";

const type = ref(1)
const userId = getUserId();
// const { eventSource } = useSSE(userId);
const FileUploadType = ref([".jpg",".jpeg",".png",".PNG",".JPG",".JPEG"]) //上传文件夹可接受的图片类型

const maxtag = ref(2)
const visible = ref(false)
const sps = ref([
  {
    label:"未搜图",
    id:0
  },
  {
    label:"进行中",
    id:1
  },
  {
    label:"已完成",
    id:2
  },
])
const searchRef = ref(null)
let query = reactive({
  search: '',
  itemcode:'',
  oldItemCode:'',
  ifCredit: '',
  // stock: '',
  classifyId: null,
  irestates:[],
  shopIds:[],
  unfill:false,
  sortBySearchPicTime:0, //是否根据搜图时间排序；0：不排序，1：反序（最新的在最前面），2：正序
  sortByCreateTime:0, //是否根据创建时间排序；0：不排序，1：反序（最新的在最前面），2：正序
  deps:[],
  sps:[],
  createTimeList:[],
  sexids:[],
  lcs:[],
  salechannellist:[],
  plansaledatelist:[],
  isComboList:[],
  daterangeAccect: [],
  datestateModified: [],
  daterangeModified: [],
  keyword: '',
  orderType: 'modified',
  endDerive: '',
  platformlist: '',
  itemStyleId: '',
  reviewComments: '',
  rejectReasonId: '',
  isReview: [],
  yeaid: '',
  isBase: '',
  seaid: [],
  itemDescr: '',
  bndid:[],
  deptid:[],
  orgid:[],
  notOnlyItemcode:false
})
let page = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})
const tableData = ref([])
const tableLoading = ref(false)
const multipleSelection = ref([]) //筛选
const uploadVisible = ref(false)
const uploadloading = ref(false)
const imglist = ref([])
const filElem = ref(null); // 绑定DOM元素
const batchFileList = ref([])
const fileids = ref([]) //存放上传图片返回的fileid
const permission = ref(true)  // 区分是供应连true还是智慧供销false
const editRow = ref({})
const editloading = ref(false)
const editVisible = ref(false)
const searchPicVisible = ref(false)
const imagelist = ref([])
const isClose = ref(false)
let picproductid = ref()
let picitemcode = ref()
let picireState = ref()
let picplansaledate = ref()
let picplatform = ref()
let piclcdep = ref()
let searchpicResult = ref("")
let searchpicTime = ref("")
const isTest = ref(false) //是否已经检测有相同款号
const message = ref("") //款号检测后的提示
// const submitMessage = ref("") //送批撞款检测后的提示
const isSingleSubmit = ref(false) // 是否非批量送批
const auditInfos = ref({})
const submitId = ref(0) //单款送批不为空，批量为0
const tipVisible = ref(false)
const tip2Visible = ref(false)
const productImport = ref(false)  //弹窗
const productUpdateImport = ref(false)  //修改导入弹窗
const uploading = ref(false)
const percentage = ref(0)
const isSee = ref(true)
const isretri = ref(false) //是否可以批量取回
const isCancelApply = ref(false) //是否可以批量作废申请
const isAppealBack = ref(false) //是否可以批量申请取回
const oldimportVisible = ref(false)
const allMainPic = ref(true)
const allFuPic = ref(false)
const submitReason = ref("")
const fgsubmitReason = ref("") // 风格审核不通过时的特别送批原因
const gsSumbitReason = ref("")
const taSubmitReason = ref("")
// const regex = /^[a-zA-Z0-9-]{1,20}$/; //不超过十位，且只能是大小写字母和数字以及横线-组合
const regex = /^[0-9a-zA-Z]{2,3}-[0-9][12349]-[0-9a-zA-Z]{6}$/
const auditScope = ref(new Set([1,2,3,4,5,6])) // 支持的审核功能类型列表(控制红灯时的送批行为)

const orgprop = ref({
   id: 1,
   api: querySelectTable,
   params: {
     dataSource: "orgdata",
   }
})

const initAuditScope = async () => {
  const {data} = await getMyAuditScope()
  auditScope.value = new Set(data)
}

const deptprop = ref({
  api: queryDept,
  radio: false,
  addTitle: false,
})

const bndprop = ref({
   id: 2,
   api: querySelectTable,
   params: {
    dataSource: "itemPrefix",
    justPr: true
   }
})

const isComboList = ref(
  [
    {
      label: "正常款",
      value: 0,
    },
    {
      label: "组合款",
      value: 1,
    },
    {
      label: "换款号",
      value: 2,
    },
  ]
)

const addform = ref({
  oriproductId: '',
  productName: '',
  itemcode: '',
  plansaledate: '',
})

const isAddSuccess = ref(false)
const copyAddVisible = ref(false)

const cancelApplyVisible = ref(false)
const selectList = ref([])
const isExport = ref(false)
const isSubmit = ref(false)
const isUpdateExport = ref(false)
const isSearchpic = ref(false)

const errorDialogVisable = ref(false)
const errorList = ref([])

const uploadType = ref("1")
const uploadList = ref([])
const chooseMainPicVisible = ref(false)
const checkList = ref([])
const rechoose = ref(true)

const appealBackVisible = ref(false)
const imgViewerVisible = ref(false)
const previewlist = ref([])

const isContinue = ref(false)
// const picAuditVisiable = ref(false)

onMounted(() => {
    findpermission()
    queryDep01()
    querySexList()
    queryLcList()
    queryformlist()
    queryrejectreason()
    querySalechannellist()
    getPlanSaleDateList()
    initAuditScope()
})

let depList = ref([]);
async function queryDep01() {
  await queryDepData01().then(res => {
    depList.value = res.data
  })
}

let sexList = ref([]);
async function querySexList() {
  await querySexData().then(res => {
    sexList.value = res.data
  })
}

let lcList = ref([]);
async function queryLcList() {
  await queryAssData01().then(res => {
    lcList.value = res.data
  })
}

function queryformlist() {
  queryFormList().then(res => {
    queryFormOptionExt.column.forEach(item => {
      if(item.prop === 'platformlist') {
        item.dicData = res.data;
      }
    })
  })
}

function queryrejectreason() {
  queryRejectReason().then(res => {
    queryFormOptionExt.column.forEach(item => {
      if(item.prop === 'rejectReasonId') {
        item.dicData = res.data;
      }
    })
  })
}

let salechannellist = ref([]);
async function querySalechannellist() {
  await querySysDictData("biz.bs.sale.channel").then(res => {
    salechannellist.value = res.data
  })
}

let plansaledateList = ref([])
function getPlanSaleDateList(){
  getPlanSaleDate().then((res) => {
    plansaledateList.value = res.data
  })
}

// AI审核
// function openPicAudit(){
//   picAuditVisiable.value = true
// }

// function closePicAudit(){
//   picAuditVisiable.value = false
// }

function previewPic(url,arr){
  imgViewerVisible.value = true
  if(arr == undefined){
    previewlist.value = [url]
  }else{
    previewlist.value = arr.map(pic=>{return pic.path})
  }
  let list = rotateArray(previewlist.value, url)
  console.log('预览图片列表',list,previewlist.value);
  previewlist.value = list
  console.log('预览图片的url和previewlist',url,previewlist.value,arr);
}

function rotateArray(arr, selected) {
    const index = arr.indexOf(selected);

    // 如果元素不存在，返回原数组
    if (index === -1) return [selected];

    // 截取从选中元素到末尾的部分 + 开头到选中元素之前的部分
    return arr.slice(index).concat(arr.slice(0, index));
}

function closeImgViewer(){
  console.log('关闭预览');
  imgViewerVisible.value = false
}

const copy = async (content) => {
  const { toClipboard } = clipboard3();
  try {
    await toClipboard(content);
    ElMessage({message: '复制成功',type: 'success'})
  } catch (error) {
    ElMessage({message: '复制失败',type: 'error'})
  }
};

function getStatusClass(row) {
    return {
      'status-completed': row.searchpicStatus == 2,
      'status-processing': row.searchpicStatus == 1,
      'status-pending': row.searchpicStatus == 0
    }
  }
 function getStatusStyle(row) {
    if (row.searchpicStatus == 2) {
      return {
        backgroundColor: row.isZhuangkuan == 0
          ? 'greenyellow'
          : 'rgba(255, 0, 0, 0.5)'
      }
    }
  }

//  查询
function handleSearch() {
  page.page = 1
  query.sortBySearchPicTime = 0
  query.sortByCreateTime = 0
  getAll()
}

function handleSizeChange(val) {
  page.pageSize = val
  getAll()
}
function handleCurrentChange(val) {
  page.page = val
  getAll()
}

// 初始化查询所有数据
function getAll() {
  console.log('查询的参数',query);
  tableLoading.value = true
  const classifyId = Array.isArray(query.classifyId)
    ? query.classifyId[query.classifyId.length - 1]
    : query.classifyId
  getClassifyGetAll(Object.assign(
    {},
    page,
    query,
    {
      classifyId
    }
  )).then(res => {
    tableData.value = res.data.list
    page.total = res.data.total
    allMainPic.value = true
    allFuPic.value = false
    tableLoading.value = false
    console.log("tableData", tableData)
  })
}

const queryByUnfill = (val) => {
  query.search = ''
  query.irestates = []
  query.classifyId = null
  query.ifCredit = ''
  query.shopIds = []
  query.unfill = val
  query.sortBySearchPicTime = 0
  query.sortByCreateTime = 0
  getAll()
}

const queryByNotOnlyItemcode = (val) => {
  query.notOnlyItemcode = val
  getAll()
}

const sortBySearchPicTime = () => {
  if(query.sortBySearchPicTime == 0 || query.sortBySearchPicTime == 2){
    query.sortBySearchPicTime = 1
  }else if(query.sortBySearchPicTime == 1){
    query.sortBySearchPicTime = 2
  }
  query.sortByCreateTime = 0 //把按创建时间排序重置
  getAll()
}

const sortByCreateTime = () => {
  if(query.sortByCreateTime == 0 || query.sortByCreateTime == 2){
    query.sortByCreateTime = 1
  }else if(query.sortByCreateTime == 1){
    query.sortByCreateTime = 2
  }
  query.sortBySearchPicTime = 0 //把按搜图时间排序重置
  getAll()
}

const exportDialogVisable = ref(false)
function showExportDialog() {
  if(multipleSelection.value.length==0){
    ElMessage.error("请选择导出的数据")
  }else{
    exportDialogVisable.value = true;
  }
}

const add = () => {
    uploadVisible.value = true
}

function removeAfterUnderscore(str) {
    let rstr = str
    const pointscoreIndex = rstr.indexOf('.');
    const middlescoreIndex = rstr.lastIndexOf('-');
    const underscoreIndex = rstr.indexOf('_');
    let ismain
    console.log('获取itemCode',rstr,pointscoreIndex,underscoreIndex);
    if(pointscoreIndex != -1){
        rstr = rstr.substring(0, pointscoreIndex)
        ismain = regex.test(rstr)
    }
    if(!ismain && middlescoreIndex != -1 && underscoreIndex == -1){
      //如果不符合款号说明是附图，那么如果没有下划线说明是用横线
        rstr = rstr.substring(0, middlescoreIndex)
    }
    else if(!ismain && underscoreIndex != -1){
        rstr = rstr.substring(0, underscoreIndex)
    }
    return rstr;
}

const getFile = async (e) => {
  let files = [...e.target.files];
  console.log("获取的文件夹", files, typeof files);
  if(files.length>0){
    // uploadloading.value = true
    let wrongname = []
    let wrongsize = []
    percentage.value = 1
    for (const file of files) {
        console.log("文件改变", file)
        let type = file.type
        let filename = file.name
        let match = filename.match(/\.[^\.]*$/); //获取文件名最后一个.以及后面的字符串，也就是图片类型
        let pictype = match[0];
        console.log('图片类型',pictype);
        const pointscoreIndex = filename.indexOf('.');
        // let ismain = filename.indexOf('_') != -1 ? false : true; //是否是主图
        let ismain = regex.test(filename.substring(0, pointscoreIndex)); //是否是主图
        let itemcode = removeAfterUnderscore(filename)
        let imgtype = ismain ? 1 : 2; //主图为正面，其他均为反面
        let newFile
        console.log('是否是图片和命名是否符合规则',itemcode,type.includes('image') , regex.test(itemcode), FileUploadType.value.includes(pictype));
        if(type.includes('image') && regex.test(itemcode) && FileUploadType.value.includes(pictype)){
            let check = await checkWidthHeight(file)
            console.log('check',check);
            if(!check){
              wrongsize.push(filename)
            }else{
              //压缩图片begin
              console.log('进到压缩图片了',file);
              const compressedFile = await imageCompressor(file)
              console.log('压缩后的compressedFile',compressedFile);
              let raw = compressedFile
              //压缩图片end
              //修改图片名begin
              switch (imgtype) {
                case 1:
                  if(raw.name!=undefined && raw.name!=null && raw.name!=""){
                    const extension = raw.name.split('.').pop().toLowerCase(); // 获取扩展名并转为小写
                    if (['jpg', 'jpeg', 'png'].includes(extension)) {
                      // 去除扩展名部分
                      const nameWithoutExtension = raw.name.replace(/\.[^/.]+$/, "");
                      // 创建新的文件名
                      let newFileName
                      if (!nameWithoutExtension.endsWith('_正')) {
                        newFileName = `${nameWithoutExtension}_正.${extension}`;
                      }else{
                        newFileName = raw.name
                      }
                      newFile = new File([raw], newFileName, { type: raw.type });
                      console.log("正面",newFile);
                    }
                  }
                  break;
                case 2:
                  if(raw.name!=undefined && raw.name!=null && raw.name!=""){
                    const extension = raw.name.split('.').pop().toLowerCase(); // 获取扩展名并转为小写
                    if (['jpg', 'jpeg', 'png'].includes(extension)) {
                      // 去除扩展名部分
                      const nameWithoutExtension = raw.name.replace(/\.[^/.]+$/, "");
                      // 创建新的文件名
                      let newFileName
                      if (!nameWithoutExtension.endsWith('_反')) {
                        newFileName = `${nameWithoutExtension}_反.${extension}`;
                      }else{
                        newFileName = raw.name
                      }
                      newFile = new File([raw], newFileName, { type: raw.type });
                      console.log("反面",newFile);
                    }
                  }
                  break;
                case 3:
                  if(raw.name!=undefined && raw.name!=null && raw.name!=""){
                    const extension = raw.name.split('.').pop().toLowerCase(); // 获取扩展名并转为小写
                    if (['jpg', 'jpeg', 'png'].includes(extension)) {
                      // 去除扩展名部分
                      const nameWithoutExtension = raw.name.replace(/\.[^/.]+$/, "");
                      // 创建新的文件名
                      let newFileName
                      if (!nameWithoutExtension.endsWith('_侧')) {
                        newFileName = `${nameWithoutExtension}_侧.${extension}`;
                      }else{
                        newFileName = raw.name
                      }
                      newFile = new File([raw], newFileName, { type: raw.type });
                      console.log("侧面",newFile);
                    }
                  }
                  break;
                case 4:
                  if(raw.name!=undefined && raw.name!=null && raw.name!=""){
                    const extension = raw.name.split('.').pop().toLowerCase(); // 获取扩展名并转为小写
                    if (['jpg', 'jpeg', 'png'].includes(extension)) {
                      // 去除扩展名部分
                      const nameWithoutExtension = raw.name.replace(/\.[^/.]+$/, "");
                      // 创建新的文件名
                      let newFileName
                      if (!nameWithoutExtension.endsWith('_细')) {
                        newFileName = `${nameWithoutExtension}_细.${extension}`;
                      }else{
                        newFileName = raw.name
                      }
                      newFile = new File([raw], newFileName, { type: raw.type });
                      console.log("细节",newFile);
                    }
                  }
                  break;
                default:
                  console.log("无");
                  break;
              }
              //修改图片名end
              imglist.value.push({ url: raw.url, fileid: 0 })
              batchFileList.value = []
              batchFileList.value.push(newFile)
              var date = new Date();
              let year = date.getFullYear();
              let month = (date.getMonth() + 1).toString().padStart(2, '0');
              let subPath = "img/itemDraft/" + year + month; //对nas上传无用，对minio上传有用，故保留
              console.log("subpath,batchFileList", subPath, batchFileList.value)
              const formData2 = new FormData();
              for (let i = 0; i < batchFileList.value.length; i++) {
                formData2.append('fileList', batchFileList.value[i])
              }
              formData2.append('subPath', subPath)
              console.log("formData2---", formData2.getAll("fileList"), batchFileList.value)
              await getfileid(formData2).then((res) => {
                if (res.code === '') {
                  console.log('获取fileid成功的res', res);
                  let map = {
                      itemcode:itemcode,
                      fileid:res.data.fileId,
                      ismain:ismain
                  }
                  fileids.value.push(map)
                  percentage.value = (fileids.value.length / files.length * 90).toFixed(1)
                }else{
                  ElMessage.error("有图片上传失败，请检查")
                }
              })
            }
        }else{
          wrongname.push(filename)
        }
    }
    console.log('图片fileid',fileids.value,fileids.value.length);
    if(fileids.value.length>0){
        await quickAdd(false)
    }else ElMessage.error("请检查文件夹有无图片以及文件夹内图片命名是否符合规则")
    if(wrongname.length>0){
      percentage.value = 0
      ElMessage.error(wrongname.join()+"；以上的图片命名有问题，请检查")
    }
    if(wrongsize.length>0){
      percentage.value = 0
      ElMessage.error(wrongsize.join()+"；以上的图片的像素有问题，请检查")
    }
  }else{
    ElMessage.error("文件夹里没有图片")
  }
}

const getFile2 = async (e) => {
  let files = [...e.target.files];
  console.log("获取的文件夹", files, typeof files);
  if(files.length>0){
    // uploadloading.value = true
    let wrongname = []
    let wrongsize = []
    percentage.value = 1
    for (const file of files) {
        console.log("文件改变", file,file.webkitRelativePath)
        let type = file.type
        let path = file.webkitRelativePath
        let filename = extractBetweenSlashes(path) //获取第二层文件夹名作为款号
        let match = file.name.match(/\.[^\.]*$/); //获取文件名最后一个.以及后面的字符串，也就是图片类型
        let pictype = match[0];
        console.log('图片类型',pictype);
        let itemcode = filename
        let newFile
        console.log('是否是图片和命名是否符合规则',itemcode,type.includes('image') , regex.test(itemcode), FileUploadType.value.includes(pictype));
        if(type.includes('image') && regex.test(itemcode) && FileUploadType.value.includes(pictype)){
          let check = await checkWidthHeight(file)
            console.log('check',check);
            if(!check){
              wrongsize.push(file.name)
            }else{
              //压缩图片begin
              console.log('进到压缩图片了',file);
              const compressedFile = await imageCompressor(file)
              console.log('压缩后的compressedFile',compressedFile);
              let raw = compressedFile
              newFile = new File([raw], raw.name, { type: raw.type });
              //压缩图片end
              imglist.value.push({ url: raw.url, fileid: 0 })
              batchFileList.value = []
              batchFileList.value.push(newFile)
              var date = new Date();
              let year = date.getFullYear();
              let month = (date.getMonth() + 1).toString().padStart(2, '0');
              let subPath = "img/itemDraft/" + year + month; //对nas上传无用，对minio上传有用，故保留
              console.log("subpath,batchFileList", subPath, batchFileList.value)
              const formData2 = new FormData();
              for (let i = 0; i < batchFileList.value.length; i++) {
                formData2.append('fileList', batchFileList.value[i])
              }
              formData2.append('subPath', subPath)
              console.log("formData2---", formData2.getAll("fileList"), batchFileList.value)
              await getfileid(formData2).then((res) => {
                if (res.code === '') {
                  console.log('获取fileid成功的res', res);
                  let map = {
                      itemcode:itemcode,
                      fileid:res.data.fileId,
                      img:res.data.img
                  }
                  fileids.value.push(map)
                  percentage.value = (fileids.value.length / files.length * 90).toFixed(1)
                }else{
                  ElMessage.error("路径为"+file.webkitRelativePath+"的图片上传失败，请检查")
                }
              })
            }
        }else{
          wrongname.push(filename)
        }
    }
    console.log('图片fileid款号map',fileids.value,fileids.value.length);
    if(fileids.value.length>0){
      //将这样的数组：[{itemcode:1,img:1},{itemcode:1,img:2},{itemcode:2,img:3},{itemcode:2,img:4}]，转换为[itemcode:1,img:[1,2],itemcode:2,img:[3,4]]
      uploadList.value = Object.values(fileids.value.reduce((acc, item) => {
        const key = item.itemcode;
        // 如果当前分组不存在，则初始化
        if (!acc[key]) {
          acc[key] = {
            itemcode: key,
            img: []  // 初始化path数组
          };
        }
        // 将当前path值添加到对应分组
        acc[key].img.push(item.img);
        return acc;
      }, {}));
      console.log('得到的uploadList.value',uploadList.value);
      chooseMainPicVisible.value = true
      rechoose.value = true
    }else ElMessage.error("请检查二级文件夹内有无图片以及二级文件夹命名是否符合规则")
    if(wrongname.length>0){
      percentage.value = 0
      ElMessage.error(wrongname.join()+"；以上的二级文件夹命名有问题，请检查")
    }
    if(wrongsize.length>0){
      percentage.value = 0
      ElMessage.error(wrongsize.join()+"；以上的图片的像素有问题，请检查")
    }
  }else{
    ElMessage.error("文件夹里没有图片")
  }
}

function extractBetweenSlashes(path) {
    const match = path.match(/\/([^\/]+)\//);
    return match ? match[1] : null;
}

const quickAdd = async (istest) => {
    // uploadloading.value = true
    tipVisible.value = false
    if(isTest.value) percentage.value = 93
    const res = await getQuickAdd({fileidMap:fileids.value,isTest:isTest.value,uploadType:uploadType.value})
    console.log('快速上传成功的res',res);
    if (res.code === '') {
        percentage.value = 100
        ElMessage.success("上传成功")
        tipVisible.value = false
        uploadloading.value = false
        uploadVisible.value = false
        isTest.value = true
        fileids.value = []
        getAll()
    }else if(res.code=="test" && res.message!=""){
        uploadloading.value = false
        message.value = res.message
        tipVisible.value = true
        isTest.value = true //表示已经检测过了
    }
}

const quickAdd2 = async (istest) => {
  if(checkList.value.length==uploadList.value.length){
    //说明每一个款都选了主图
    rechoose.value = false //都选了主图且点击确定就不允许重新选了
    chooseMainPicVisible.value = false
    tipVisible.value = false
    if(isTest.value) percentage.value = 93
    const res = await getQuickAdd({fileidMap:fileids.value,checkList:checkList.value,isTest:isTest.value,uploadType:uploadType.value})
    console.log('快速上传成功的res',res);
    if (res.code === '') {
      percentage.value = 100
      ElMessage.success("上传成功")
      tipVisible.value = false
      uploadloading.value = false
      uploadVisible.value = false
      isTest.value = true
      fileids.value = []
      uploadList.value = []
      checkList.value = []
      getAll()
    }else if(res.code=="test" && res.message!=""){
      uploadloading.value = false
      message.value = res.message
      tipVisible.value = true
      isTest.value = true //表示已经检测过了
    }
  }else{
    ElMessage.error("有款号还未选择主图")
  }
}

const chooseMainPicClose = () => {
  chooseMainPicVisible.value = false
}

const checked = (val,list) => {
  console.log('接收的val,list',val,list);
  if(checkList.value.length>0){
    console.log('checkList.value',checkList.value.length,checkList.value);
    checkList.value.forEach(fileid => {
      const hasfileid = list.some(item => item.fileid === fileid);
      console.log('fileid的hasfileid',hasfileid);
      if(hasfileid){
        //先剔除掉选择数组checkList里所有有该款号那一列list的fileid,保证单选
        let index = checkList.value.indexOf(fileid)
        checkList.value.splice(index,1)
      }
    })
    //因为勾选的时候会自动新增进数组，且自动新增的fileid不会进入上面的遍历，但是以防万一，如果没新增成功我们在剔除完手动把新选择的加进去
    if(checkList.value.indexOf(val)==-1){
      checkList.value.push(val)
    }
  }else{
    checkList.value = [val]
  }
  console.log('修改后的checkList.value',checkList.value,val);
}

const cancelDialog = async () => {
    console.log('取消上传',!isTest.value , fileids.value.length>0);
    percentage.value = 0
    if(!isTest.value && fileids.value.length>0){
        let fileIds = fileids.value.map(i => i.fileid)
        console.log('取消上传fileIds',fileIds);
        if(fileIds.length>0){
            //如果检测发现有相同款号，且用户点击了上传弹窗的关闭按钮，则删除刚刚上传到nas的图片
            //如果单纯上传成功后的自动关闭弹窗也会触发这个方法，但是上传成功后的isTest.value是true因此不会触发删除nas的图片操作。
            uploadloading.value = true
            await deletefile(fileIds).then((res) => {
                console.log('从nas里删除成功',res);
            })
        }
    }
    console.log('filElem.value',filElem.value);
    if (filElem.value) {
        filElem.value.value = ''; // 清空选择的文件
    }
    fileids.value = []
    uploadList.value = []
    checkList.value = []
    uploadloading.value = false
    isTest.value = false
}

function openCopyAdd(row) {
  console.log('复制新增的row',row);
  copyAddVisible.value = true
  editRow.value = row
}

async function copyAdd() {
  if(addform.value.itemcode==''){
    ElMessage.error("请填写新增款款号")
    return
  }else if(addform.value.productName==''){
    ElMessage.error("请填写新增款商品名称")
    return
  }else if(addform.value.itemcode.split('-')[2].slice(0, 3)!==editRow.value.itemcode.split('-')[2].slice(0, 3)
  ||addform.value.itemcode.split('-')[0].slice(0, 2)!==editRow.value.itemcode.split('-')[0].slice(0, 2)){
    ElMessage.error("新增款款号的款字头和大类品种类别必须与该款相同")
    return
  }
  var loading = ElLoading.service({ fullscreen: true })
  addform.value.oriproductId = editRow.value.productId
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
  if(editRow.value.ireState!=null){
    let param = {
      productId:productId,
      itemcode:itemcode,
      orgin:editRow.value.orgin,
      year:editRow.value.year,
      isExport:editRow.value.isExport?editRow.value.isExport:"",
      diff:'否',
      productName:productName?productName:editRow.value.productName,
      salechannellist:editRow.value.salechannellist,
      isBase:editRow.value.isBase,
      priceName:editRow.value.priceName,
      platformlist:editRow.value.platformlist,
      isCombo:'正常款',
      devChannelList:editRow.value.devchannellist.split(","),
      poitemclass:editRow.value.poitemclass,
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
        errorDialogVisable.value = true
        errorList.value = res.data[0].data
      }else {
        isAddSuccess.value = false //设为false，下次addSave时会去检测款号
        ElMessage.success("成功")
        cancelCopyAdd()
      }
    }).finally(() => {
      loading.close();
    })
  }else{
    loading.close();
    cancelCopyAdd()
  }
}

function cancelCopyAdd() {
  addform.value = {
    oriproductId: '',
    productName: '',
    itemcode: '',
    plansaledate: '',
  }
  isAddSuccess.value = false
  copyAddVisible.value = false
  getAll()
}

function reviewClose(done) {
  type.value = 1
  done()
}

function CancelApply(row){
  if(row){
    console.log('单条作废申请',row);
    selectList.value = [row]
    cancelApplyVisible.value = true
  }else if(multipleSelection.value.length>0){
    console.log('多条作废申请');
    cancelApplyVisible.value = true
    selectList.value = multipleSelection.value
  }else{
    console.log('0条作废申请');
    cancelApplyVisible.value = false
    ElMessage.error("未选择数据")
  }
}

function AppealBack(row){
  if(row){
    console.log('单条申请取回',row);
    selectList.value = [row]
    appealBackVisible.value = true
  }else if(multipleSelection.value.length>0){
    console.log('多条申请取回');
    appealBackVisible.value = true
    selectList.value = multipleSelection.value
  }else{
    console.log('0条申请取回');
    appealBackVisible.value = false
    ElMessage.error("未选择数据")
  }
}

function findpermission() {
  findPermission().then(res => {
    permission.value = (res.data == '1')
  })
}

const editAudit = (row) => {
  editVisible.value = true
  editloading.value = true
  editRow.value = row
}

// 单条送品牌方审批
async function Singlesubmittals(id) {
  tableLoading.value = true
  const ids = []
  ids.push(id)
  console.log('单条---送品牌方审批的ids', ids);
  if (ids.length > 0) {
    let param = {
      ids,
      isContinue:isContinue.value,
      submitReason:submitReason.value,
      fgsubmitReason:fgsubmitReason.value,
      gsSumbitReason:gsSumbitReason.value,
      taSubmitReason:taSubmitReason.value,
    }
    await Submit(param).then((res) => {
      console.log(res);
      console.log("送批的res",res);
      if(res.code==''&&res.message!=""&&res.message!=null&&res.message!=undefined){
        ElMessage.success('送批完成,但是'+res.message)
        getAll()
      }else if(res.code=='fail'){
        ElMessage.error('送批失败'+res.message)
      }else if(res.code=='auditfail'){
        console.log('进到单条送批确认');
        auditInfos.value = res.data
        stillSingleSubmit(id)
      }else{
        ElMessage.success('送批成功')
        isContinue.value = false
        getAll()
      }
      tableLoading.value = false
    })
      .catch((err) => {
        // 当异步操作失败时，可以在这里处理错误情况
        // alert(err.response.status)
        tableLoading.value = false
        console.error(err)
      })
  } else ElMessage.error('无法获取到商品id')
}

function stillSingleSubmit(id) {
  // ElMessageBox.confirm("该款存在撞款现象，是否忽略撞款继续送批", '提示', {
  //   confirmButtonText: '确定',
  //   cancelButtonText: '取消',
  //   type: 'warning',
  // })
  //   .then(() => {
  //     isContinue.value = true
  //     return Singlesubmittals(id)
  //   })
  //   .catch(() => { })
    tip2Visible.value = true
    isSingleSubmit.value = true
    submitId.value = id
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val
  console.log("复选框变化", multipleSelection)
  isretri.value = false //为true不可以取回
  isCancelApply.value = false
  isAppealBack.value = false
  isSubmit.value = false
  isSearchpic.value = false
  isUpdateExport.value = false
  let notAppealBack = false
  isExport.value = false
  multipleSelection.value.forEach(m => {
    if(!(m.ireState == 1 && (m.endDerive == 0 || m.endDerive == 1)) && m.ireState != 6 && m.ireState != 4){
        isretri.value = true
    }
    if(m.ireState!=3){
      //只有通过才能作废申请
      isCancelApply.value = true
    }
    if(m.ireState==1&&m.endDerive==1){
      console.log('待审且已导');
      //只有待审且已导才能申请取回
      isAppealBack.value = true
    }
    if(m.ireState==1&&m.endDerive==0){
      notAppealBack = true
    }
    if(notAppealBack&&isAppealBack.value){
      //如果用户同时勾选了待审已导和待审未导的商品，则不允许批量取回
      isretri.value = true
    }
    if(m.ireState==null||m.ireState==""||m.ireState==undefined){
      //只有已经补充了资料的才允许导出
      isExport.value = true
    }
    if(m.searchpicStatus != 2){
      //可搜图品种控制的是联营商搜图
      //未完成搜图的不允许送批
      isSubmit.value = true
    }

    if(m.searchpicStatus == 1){
      //搜图进行中的不允许搜图
      isSearchpic.value = true
    }
    if(m.ireState!=11){
      //只有草稿才能批量导出修改
      isUpdateExport.value = true
    }
  })
}

const Stillsubmittals = (id) => {
  if (auditInfos.value.zk && !submitReason.value) {
    ElMessage.error('请输入送批的原因')
    return
  }
  if (auditInfos.value.fg && !fgsubmitReason.value) {
    ElMessage.error('请输入送批的原因')
    return
  }
  if (auditInfos.value.gs && !gsSumbitReason.value) {
    ElMessage.error('请输入送批的原因')
    return
  }
  if (auditInfos.value.ta && !taSubmitReason.value) {
    ElMessage.error('请输入送批的原因')
    return
  }
  tip2Visible.value = false
  isContinue.value = true
  if(id!=null&&id!=0){
    //单条
    Singlesubmittals(id)
  }else{
    //批量
    Submittals()
  }
}

// 批量送品牌方审批
const Submittals = async () => {
  let nosend = false
  if (multipleSelection.value.length === 0) {
    ElMessage.error('请选择送批的数据')
    return
  }
  tableLoading.value = true
  const ids = []
  multipleSelection.value.forEach((item) => {
    if(item.ireState==null || item.ireState==""){
      ElMessage.error('不能送批未补充资料的商品')
      tableLoading.value = false
      nosend = true
    }
    if (!item.found) {
      ids.push(item.productId)
    } else {
      ElMessage.error(item.itemcode+'该商品已送批，无法再次送批')
      tableLoading.value = false
      nosend = true
    }
  })
  console.log("送真维斯审批的数据", multipleSelection.value)
  if (!nosend) {
    let param = {
      ids,
      isContinue:isContinue.value,
      submitReason:submitReason.value,
      fgsubmitReason:fgsubmitReason.value,
      gsSumbitReason:gsSumbitReason.value,
      taSubmitReason:taSubmitReason.value,
    }
    await Submit(param).then((res) => {
      console.log("送批的res",res);
      if(res.code==''&&res.message!=""&&res.message!=null&&res.message!=undefined){
        ElMessage.success('送批完成,但是'+res.message)
        isContinue.value = false
        getAll()
      }else if(res.code=='fail'){
        ElMessage.error('送批失败'+res.message)
      }else if(res.code=='auditfail'){
        tip2Visible.value = true
        isSingleSubmit.value = false
        auditInfos.value = res.data
      }else{
        ElMessage.success('送批成功')
        isContinue.value = false
        getAll()
      }
      tableLoading.value = false
    })
      .catch((err) => {
        // 当异步操作失败时，可以在这里处理错误情况
        // alert(err.response.status)
        tableLoading.value = false
        getAll()
        console.error(err)
      })
  }
}

//预审搜图
function serchPic(row) {
  isClose.value = false
  if (row) {
    isSee.value = true
    picproductid.value = 0
    console.log("预审搜图按钮点击1", row)
    searchPicVisible.value = true
    getSKimage({ productId: row.productId }).then((res) => {
      console.log('获取审款图片信息的res', res);
      imagelist.value = res.data
      picplansaledate.value = row.plansaledate
      picplatform.value = row.platformlist
      picitemcode.value = row.itemcode
      picireState.value = row.ireState
      searchpicResult.value = row.searchpicResult
      searchpicTime.value = row.searchpicTime
      picproductid.value = row.productId
      piclcdep.value = row.lcdep
    })
  } else {
    console.log("以图搜图")
    picproductid.value = 0
    isSee.value = false
    searchPicVisible.value = true
  }
}

function closeSearchPic() {
  console.log('关闭预审搜图弹窗');
  searchPicVisible.value = false
  isClose.value = true
  imagelist.value = []
}

const chooseAllMainPic = (val) => {
  console.log('全选选择主图',val);
  tableData.value.map(t =>t.isMainPic=val)
}

const chooseAllFuPic = (val) => {
  console.log('全选选择附图',val);
  tableData.value.map(t =>t.isFuPic=val)
}

const searchMore = async () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.error('请选择需要搜图的商品')
    return
  }
  // const productIds = multipleSelection.value.map(p=>p.productId)
  await updateProductSpStatus(multipleSelection.value,1) //更新搜图状态为进行中
  connectSSE(userId)//连接sse
  await searchMorePic({products:multipleSelection.value}).then((res) => {
    let needtime = multipleSelection.value.length * 25 //大概25秒一个
    let time = formatDuration(needtime);
    console.log('time',time);
    ElNotification({
      title: '提示',
      message:  h('span', { style: 'color: blue' }, "批量搜图开始，可在大概"+time+"后点击查询按钮查询结果。"),
      duration: 5000,
      offset: 50,
    })
    console.log('批量搜图的res', res);
    if(res.code==""){
      ElMessage.success("成功")
      // getAll()
    }
  })
}

const updateProductSpStatus = async (products,searchpicStatus) => {
  await updateSearchpicStatus({products,searchpicStatus}).then(
    getAll()
  )
}

function formatDuration(totalSeconds) {
  console.log('totalSeconds',totalSeconds);
  // 校验输入有效性
  if (typeof totalSeconds !== 'number' || totalSeconds < 0) {
    throw new Error('请输入非负数字');
  }

  // 核心计算逻辑
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  let result = ((minutes > 0 ? minutes + '分' : '') + (seconds > 0 ? seconds + '秒' : ''))
  console.log('时间计算',minutes,seconds,result);
  // 格式化输出（自动补零/智能单位）
  return result
}

//提示
const cancelUpload = async () => {
    console.log('关闭上传提示框');
    uploadVisible.value = false
    isTest.value = false //点击取消表示下次上传继续检测
    tipVisible.value = false
}

//提示
const cancelUpload2 = async () => {
    console.log('关闭送批提示框');
    isContinue.value = false
    tip2Visible.value = false
    submitId.value = 0
    submitReason.value = ""
    fgsubmitReason.value = ""
    gsSumbitReason.value = ""
    taSubmitReason.value = ""
    auditInfos.value = {}
}

// 导出初审资料
const exportTips2 = () => {
  // if (multipleSelection.value.length === 0) {
  //   ElMessage.error('请选择导出行')
  //   return
  // }
  let isexport = false
  const ids = []
  const rowlist = []
  multipleSelection.value.forEach((item) => {
    ids.push(item.productId)
    rowlist.push(item)
  })
  console.log("选择的数据", rowlist)
  rowlist.forEach(i => {
    if (i.ireState != null && i.ireState != 3) {
      isexport = true
    }
  })
  if (isexport) {
    isexport = false
    ElMessage.error('不能导出已补充且未通过的资料')
    return
  }
  tableLoading.value = true
  productExport2({ ids, rowlist }).then((res) => {
    const blob = new Blob([res])
    const fileName = '商品数据列表.xlsm'
    if ('download' in document.createElement('a')) {
      // 非IE下载
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else {
      // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
    tableLoading.value = false
  })
}

function sendsAudit() {
  productImport.value = true
  batchFileList.value = []
  console.log('打开导入弹窗',productImport.value);
}

function updateImport() {
  productUpdateImport.value = true
  batchFileList.value = []
  console.log('打开修改导入弹窗',productUpdateImport.value);
}

function oldimport() {
  oldimportVisible.value = true
  batchFileList.value = []
  console.log('打开批量导入弹窗',oldimportVisible.value);
}

// 删除商品
async function del(row) {
  tableLoading.value = true
  console.log('删除',row,row!=null);
  let productIds = []
  if(row!=null){
    productIds.push(row.productId)
  }else{
    if (multipleSelection.value.length === 0) {
        ElMessage.error('请选择删除的数据')
        tableLoading.value = false
        return
    }else{
        multipleSelection.value.forEach((item) => {
            if(item.ireState!=null){
                ElMessage.error('不能删除已补充资料的商品')
                tableLoading.value = false
                return
            }else productIds.push(item.productId)
        })
    }
  }
  if(productIds.length>0){
    await getClassifyDelete({
        productIds: productIds
      }).then((res) => {
        if (res.code === '') {
          ElMessage.success('删除成功')
          getAll()
        }
      })
    .catch(() => { })
  }else{
    tableLoading.value = false
  }
}

// 取回
function singleRetrieval(row) {
  if(row && row.ireState == 1 && row.endDerive == 1){
    console.log('单条判断要申请取回');
    isAppealBack.value = true
  }else if(row && (row.ireState != 1 || row.endDerive != 1)){
    isAppealBack.value = false
  }
  if(isAppealBack.value){
    //申请取回
    AppealBack(row)
  }else{
    console.log("取回的row", row)
    let params = []
    if(row){
      params = [{
          productId: row.productId,
          itemcode:row.itemcode,
          ifCredit:row.ifCredit,
          ireState:row.ireState,
          itemDraftId:row.itemDraftId
      }]
    }else{
      params = multipleSelection.value.map(i => {
          let detail = {
              productId: i.productId,
              itemcode:i.itemcode,
              ifCredit:i.ifCredit,
              ireState:i.ireState,
              itemDraftId:i.itemDraftId
          }
          return detail
      })
    }
    console.log('取回的参数',params);
    ElMessageBox.confirm('选中数据将被取回, 是否继续？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        Retrieval({
          params
        }).then((res) => {
          if (res.code === '') {
            if(res.message != ''){
              ElMessage.info('取回完成,但是'+res.message)
            }else{
              ElMessage.success('取回成功')
            }
            getAll()
          }
        })
      })
      .catch(() => { })
  }
}

async function exportSearchPicRS(){
  if(multipleSelection.value.length==0){
    ElMessage.error("请选择导出的数据")
  }else{
    var loading = ElLoading.service({ fullscreen: true })
    let products = multipleSelection.value.map(i => {
      let detail = {
        productId: i.productId,
        greenPlansaledate:getGreenPlansaledate(i.plansaledate)
      }
      return detail
    })
    await exportSearchPicResult({products}).then((res) => {
        console.log('搜图结果的res',res);
        if (res.code === '') {
          let base64 = res.data;
          excel.excelExport(res.name, base64, '.xls')
        }
      })
    .catch(() => {
      ElMessage.warning("导出错误");
      loading.close();
    })
    .finally(() => {
      loading.close();
    })
  }
}

// 款式送审资料指引
function downloadfirstinstance() {
  let array = [
    "http://upload.gsitcloud.com/image/iretail/esp/help/ESPhelp.pdf",
    "http://upload.gsitcloud.com/image/iretail/esp/help/ESPstyle.xls",
  ];
  array.forEach(url => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    // 必须加入 DOM 再点击，兼容部分浏览器
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}

const imgReviewModeDialogVisible = ref(false)
const queryInfo = reactive({
  data: [],
  total: 0,
  query: "",
  page: 1,
  pageSize: 10,
})
function imgReviewMode() {
  queryInfo.pageNumber = 1;
  queryImgReviewMode();
  type.value = 4
  imgReviewModeDialogVisible.value = true;
}
const queryImgReviewMode = (() => {

  const classifyId = Array.isArray(query.classifyId)
    ? query.classifyId[query.classifyId.length - 1]
    : query.classifyId

  let params = {
    ...query,
    ...queryInfo,
    classifyId
  }

  getClassifyGetAll(params).then(res => {
    queryInfo.data = res.data.list
    queryInfo.total = res.data.total
    console.log("tableData", queryInfo.data)
  })
})
function handleSizeChangeReview(newsize) {
  queryInfo.pageSize = newsize;
  queryImgReviewMode();
}
function handleCurrentChangeReview(newPage) {
  queryInfo.page = newPage;
  queryImgReviewMode();
}
const getAuditDotColor = (row, i) => {
  if (!auditScope.value.has(i)) {
    return ''
  }
  // 格式审核
  if (i === 1) {
    if (row.a1status === 0) return 'is-pending'
    if (row.a1status !== 1) return ''
    switch (row.a1level) {
      case 1: return 'red';
      case 2: return 'yellow';
      case 3: return 'green';
      default: return '';
    }
  }
  // 同款审核
  if (i === 2) {
    if(row.searchpicStatus === 0) return ''
    if(row.searchpicStatus === 1) return 'is-pending'
    return row.isZhuangkuan === 0? 'green': 'red';
  }
  // 风格审核
  if (i === 3) {
    if (row.a3status === 0) return 'is-pending'
    if (row.a3status !== 1) return ''
    switch (row.a3level) {
      case 1: return 'red';
      case 2: return 'yellow';
      case 3: return 'green';
      default: return '';
    }
  }

  if (i === 4) {
    if (row.a4status === 0) return 'is-pending'
    if (row.a4status !== 1) return ''
    switch (row.a4level) {
      case 1: return 'red';
      case 2: return 'yellow';
      case 3: return 'green';
      default: return '';
    }
  }
  return 'disabled';
}

const getAuditDesc = (row, i) => {
  if (!auditScope.value.has(i)) {
    return '未审'
  }
  // 格式审核
  if (i === 1) {
    if (row.a1status === 0) return '审核中'
    if (row.a1status !== 1) return '未审'
    switch (row.a1level) {
      case 1: return '不符合';
      case 2: return '中度符合';
      case 3: return '非常符合';
      default: return '未审';
    }
  }
  // 同款审核
  if (i === 2) {
    if(row.searchpicStatus === 0) return '未搜图'
    if(row.searchpicStatus === 1) return '搜图中'
    return row.isZhuangkuan === 0? '通过': '不通过';
  }
  // 风格审核
  if (i === 3) {
    if (row.a3status === 0) return '审核中'
    if (row.a3status !== 1) return ''
    switch (row.a3level) {
      case 1: return '不符合';
      case 2: return '中度符合';
      case 3: return '非常符合';
      default: return '未审';
    }
  }
  // 图案使用不当审核
  if (i === 4) {
    if (row.a4status === 0) return '审核中'
    if (row.a4status !== 1) return ''
    switch (row.a4level) {
      case 1: return '不通过';
      case 2: return '不通过';
      case 3: return '通过';
      default: return '未审';
    }
  }
  return '不支持该功能';
}

const updateExport = async () =>{
  if(multipleSelection.value.length==0){
    ElMessage.error("请选择导出修改的数据")
    return
  }else{
    var loading = ElLoading.service({ fullscreen: true })
    const ids = multipleSelection.value
    .map(item => item.itemDraftId)
    .filter(id => id != null);
    await batchUpdateExport(ids).then((res) => {
      const blob = new Blob([res])
      const fileName = '导出修改商品列表.xlsm'
      if ('download' in document.createElement('a')) {
        // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
    }).catch(() => {
      ElMessage.warning("导出错误");
      loading.close();
    })
    .finally(() => {
      loading.close();
    })
  }
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
  // margin:24px;
  // margin-left:24px;
  :deep(.el-form-item){
    width: 33%;
    margin-bottom: 10px;
    margin-right: 0;
  }
  :deep(.el-form-item__label){
    width: 120px;
  }
  .unfill {
    :deep(.el-form-item__label){
      width: 66%;
    }
  }
}

.buttons{
  display: flex;
  flex-wrap: wrap;
  button{
    margin-bottom: 5px;
  }
}

.status-pending { background-color: #f5f7fa; }
.status-processing { background-color: #e6f7ff; }
.status-completed {
  background-color: greenyellow;
  /* 或根据条件动态设置 */
}

/* 覆盖 el-table 的 cell 内边距 */
::v-deep .el-table .status-column .cell {
  padding: 0 !important;  /* 清除默认内边距 */
  height: 90px;          /* 确保高度继承 */
  line-height: 90px;
}

/* 让 div 撑满整个单元格 */
.full-cell {
  display: flex; /* 使用 flex 布局确保内容居中 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  width: 100%; /* 撑满宽度 */
  height: 100%; /* 撑满高度 */
  min-height: 32px; /* 确保最小高度（可调整） */
  box-sizing: border-box; /* 防止 padding 影响尺寸 */
  padding: 0 8px; /* 可选：如果仍然需要内边距 */
}


.queryform_ext ::v-deep .avue-form__group > * {
  height: 35px;
}
.queryform_ext ::v-deep .el-form > .el-row > .el-col {
  display: none;
}

/* AI审核弹出框 */
.aiaudit-popover {
  border: 1px solid #DCDFE6 !important;
  border-radius: 4px !important;
  padding: 8px 12px !important;
  background-color: #ffffff !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1) !important;
}
/* AI审核弹出框内容区 */
.aiaudit-desc-wrapper {
  color: #9CA3AF;
  .yellow {
    color: #FBBF24;
  }
  .green {
    color: #34D399;
  }
  .red {
    color: #F87171;
  }
}
/* AI审核红绿灯区 */
.aiaudit-dots-wrapper {
  display: flex;
  justify-content: center;
  gap: 4px;
  padding: 6px 0;
  .audit-dot {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: #9CA3AF; /* default: grey */
    position: relative;
    transition: transform 0.2s ease, opacity 0.2s ease;
    box-sizing: border-box;

    &.yellow {
      background-color: #FBBF24;
    }

    &.green {
      background-color: #34D399;
    }

    &.red {
      background-color: #F87171;
    }

    /* 禁用/禁止 - 灰色斜线 */
    &.disabled {
      background: #D1D5DB url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g stroke='%239CA3AF' stroke-width='10' fill='none'><circle cx='50' cy='50' r='40'/><path d='M21.7 78.3 l56.6-56.6'/></g></svg>") no-repeat center / 100%;
    }

    /* 错误/删除 - 红色叉号 */
    &.error {
      background: #FECACA url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none' stroke='%23EF4444' stroke-width='10' stroke-linecap='round'><circle cx='50' cy='50' r='40'/><path d='M35 35l30 30M65 35L35 65'/></g></svg>") no-repeat center / 100%;
    }

    /* 等待/进行中 - 蓝色时钟 */
    &.is-pending {
      background: #DBEAFE url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none' stroke='%233B82F6' stroke-width='8'><circle cx='50' cy='50' r='40'/><path d='M50 25v25h20' stroke-linecap='round' stroke-linejoin='round'/></g></svg>") no-repeat center / 100%;
    }

    &:not(.disabled):hover {
      transform: scale(1.2);
      opacity: 0.9;
    }
  }
}
</style>