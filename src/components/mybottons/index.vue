<template>
     <div class="btn-wrap btn-list">
        <div>
        <!-- <div v-if="model==1"> -->
            <el-button
            class="custom-button"
            type="primary"
            @click="handleCheck"
            v-if="checkShow"
            :disabled="checkDisabled"
            >查询</el-button
            >
            <el-button
            class="custom-button"
            type="primary"
            @click="handleAdd"
            v-if="addShow"
            :disabled="addDisabled"
            >新增</el-button
            >
            <el-button
            class="custom-button"
            type="primary"
            @click="handleEdit"
            v-if="editShow"
            :disabled="editDisabled"
            >编辑</el-button
            >
            <el-button
            class="custom-button"
            type="primary"
            @click="handleDelete"
            v-if="deleteShow"
            :disabled="deleteDisabled"
            >删除</el-button
            >
            <el-button
            class="custom-button"
            type="primary"
            @click="handleSave"
            v-if="saveShow"
            :disabled="saveDisabled"
            >保存</el-button
            >
            <el-button
            class="custom-button"
            type="primary"
            @click="handleCancel"
            v-if="cancelShow"
            :disabled="cancelDisabled"
            >取消</el-button
            >
            <el-button
            class="custom-button"
            type="primary"
            @click="handleFlash"
            v-if="flashShow"
            :disabled="flashDisabled"
            >刷新</el-button
            >
        <!-- </div>
        <div v-if="model==2"> -->
            <el-button
            class="custom-button"
            type="primary"
            @click="handleAll"
            v-if="allShow"
            :disabled="allDisabled"
            >全选</el-button
            >
            <el-button
            class="custom-button"
            type="primary"
            @click="handleInvert"
            v-if="invertShow"
            :disabled="invertDisabled"
            >反选</el-button
            >
            <el-button
            class="custom-button"
            type="primary"
            @click="handleClear"
            v-if="clearShow"
            :disabled="clearDisabled"
            >清空</el-button
            >
        <!-- </div>
        <div v-if="model==3"> -->
            <el-button
            class="custom-button"
            type="primary"
            @click="handleImport"
            v-if="importShow"
            :disabled="importDisabled"
            >导入</el-button
            >
            <el-button
            class="custom-button"
            type="primary"
            @click="handleExport"
            v-if="exportShow"
            :disabled="exportDisabled"
            >导出</el-button
            >
        <!-- </div>
        <div v-if="model==4"> -->
            <el-button
            class="custom-button"
            type="primary"
            @click="handleAdopt"
            v-if="adoptShow"
            :disabled="adoptDisabled"
            >通过</el-button
            >
            <el-button
            class="custom-button"
            type="primary"
            @click="handleVeto"
            v-if="vetoShow"
            :disabled="vetoDisabled"
            >否决</el-button
            >
            <el-button
            class="custom-button"
            type="primary"
            @click="handleBack"
            v-if="backShow"
            :disabled="backDisabled"
            >取回</el-button
            >
        </div>
        <div>
            <slot></slot>
        </div>
     </div>
</template>
<!-- 模式显示不同按钮组-- 属性名:model -- 类型:String -- 值:1||2||3||4 -->
<!-- model=1 新增/修改/删除/查询/刷新/取消/保存 -->
<!-- model=2 全选/反选/清空 -->
<!-- model=3 导出/导入 -->
<!-- model=4 通过/否决/取回 -->
<!-- 显隐按钮组中的按钮-- 属性名:hideList -- 类型:Array -- 值:比如['add','edit']隐藏新增和编辑 -->
<!-- 禁用按钮组中的按钮-- 属性名:disabledList -- 类型:Array -- 值:比如['add','edit']禁用新增和编辑 -->
<!-- 数组里面的值 -->
<!-- 新增:add, 编辑:edit, 删除:delete, 查询:check, 刷新:flash, 取消:cancel, 保存:save-->
<!-- 全选:all, 反选:invert, 清空:clear-->
<!-- 导出:export, 导入:import-->
<!-- 通过:adopt, 否决:veto, 取回:back-->
<script>
export default {
    name: "mybottoons",
    data(){
        return {
            //新增按钮的显隐和禁用
            addShow:false,
            addDisabled:false,
            //编辑按钮的显隐和禁用
            editShow:false,
            editDisabled:false,
            //删除按钮的显隐和禁用
            deleteShow:false,
            deleteDisabled:false,
            //查询按钮的显隐和禁用
            checkShow:false,
            checkDisabled:false,
            //刷新按钮的显隐和禁用
            flashShow:false,
            flashDisabled:false,
            //取消按钮的显隐和禁用
            cancelShow:false,
            cancelDisabled:false,
            //保存按钮的显隐和禁用
            saveShow:false,
            saveDisabled:false,
            //全选按钮的显隐和禁用
            allShow:false,
            allDisabled:false,
            //反选按钮的显隐和禁用
            invertShow:false,
            invertDisabled:false,
            //清空按钮的显隐和禁用
            clearShow:false,
            clearDisabled:false,
            //导出按钮的显隐和禁用
            exportShow:false,
            exportDisabled:false,
            //导入按钮的显隐和禁用
            importShow:false,
            importDisabled:false,
            //通过按钮的显隐和禁用
            adoptShow:false,
            adoptDisabled:false,
            //否决按钮的显隐和禁用
            vetoShow:false,
            vetoDisabled:false,
            //取回按钮的显隐和禁用
            backShow:false,
            backDisabled:false,
        }
    },
    props:{
        //模式，显示不同的按钮组
        model:{
            type:Number,
            default:1,
        },
        //显隐按钮
        showList:{
            type:Array,
            default:() => [],
        },
        //禁用按钮
        disabledList:{
            type:Array,
            default:() => [],
        }
    },
    methods:{
        //新增
        handleAdd(){
            this.$emit("handleAdd")
        },
        //编辑
        handleEdit(){
            this.$emit("handleEdit")
        },
        //删除
        handleDelete(){
            this.$emit("handleDelete")
        },
        //查询
        handleCheck(){
            this.$emit("handleCheck")
        },
        //刷新
        handleFlash(){
            this.$emit("handleFlash")
        },
        //取消
        handleCancel(){
            this.$emit("handleCancel")
        },
        //保存
        handleSave(){
            this.$emit("handleSave")
        },
        //选择全部
        handleAll(){
            this.$emit("handleAll")
        },
        //反选
        handleInvert(){
            this.$emit("handleInvert")
        },
        //清空
        handleClear(){
            this.$emit("handleClear")
        },
        //导出
        handleExport(){
            this.$emit("handleExport")
        },
        //导入
        handleImport(){
            this.$emit("handleImport")
        },
        //通过
        handleAdopt(){
            this.$emit("handleAdopt")
        },
        //否决
        handleVeto(){
            this.$emit("handleVeto")
        },
        //取回
        handleBack(){
            this.$emit("handleBack")
        },
        //处理按钮
        initButtons(){
            for(var i in this.showList){
                switch(this.showList[i]){
                    case 'add' :
                        this.addShow = true
                    break
                    case 'edit' :
                        this.editShow = true
                    break
                    case 'delete' :
                        this.deleteShow = true
                    break
                    case 'check' :
                        this.checkShow = true
                    break
                    case 'flash' :
                        this.flashShow = true
                    break
                    case 'cancel' :
                        this.cancelShow = true
                    break
                    case 'save' :
                        this.saveShow = true
                    break
                    case 'all' :
                        this.allShow = true
                    break
                    case 'invert' :
                        this.invertShow = true
                    break
                    case 'clear' :
                        this.clearShow = true
                    break
                    case 'export' :
                        this.exportShow = true
                    break
                    case 'import' :
                        this.importShow = true
                    break
                    case 'adopt' :
                        this.adoptShow = true
                    break
                    case 'veto' :
                        this.vetoShow = true
                    break
                    case 'back' :
                        this.backShow = true
                    break
                }
            }
            for(var j in this.disabledList){
                switch(this.disabledList[j]){
                    case 'add' :
                        this.addDisabled = true
                    break
                    case 'edit' :
                        this.editDisabled = true
                    break
                    case 'delete' :
                        this.deleteDisabled = true
                    break
                    case 'check' :
                        this.checkDisabled = true
                    break
                    case 'flash' :
                        this.flashDisabled = true
                    break
                    case 'cancel' :
                        this.cancelDisabled = true
                    break
                    case 'save' :
                        this.saveDisabled = true
                    break
                    case 'all' :
                        this.allDisabled = true
                    break
                    case 'invert' :
                        this.invertDisabled = true
                    break
                    case 'clear' :
                        this.clearDisabled = true
                    break
                    case 'export' :
                        this.exportDisabled = true
                    break
                    case 'import' :
                        this.importDisabled = true
                    break
                    case 'adopt' :
                        this.adoptDisabled = true
                    break
                    case 'veto' :
                        this.vetoDisabled = true
                    break
                    case 'back' :
                        this.backDisabled = true
                    break
                }
            }
        }
    },
    mounted(){
        this.initButtons()
    }
}
</script>

<style scoped lang="scss">

@import '@/styles/variables.module.scss'; // 导入 SCSS 变量文件
/* .custom-button {
    margin-left: 8px !important;
    background-color: #6989F3;
    border-color: #6989F3;
} */

/* 覆盖hover状态下的颜色 */
/* .custom-button:hover {
  background-color: #335EEE;
  border-color: #335EEE;
} */
 
/* 覆盖disabled状态下的颜色 */
/* .custom-button.is-disabled {
  background-color: #BECCFA;
  border-color: #BECCFA;
} */
.btn-list{
  width: 95%;
  display: flex;
  align-items: center;
  padding: $container-base-padding-3 $container-base-padding-2;
  background-color: rgba($neutral-color-1, 0.5);
  border-radius: $border-radius-medium;
  backdrop-filter: $backdrop-filter-base;
  box-shadow: $shadow-2;
  margin-top:$container-margin;
}
</style>