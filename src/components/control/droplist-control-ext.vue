<template>
  <div>
    <el-container>
      <el-aside v-if="props.title" width="100px" class="el-form-item__label">{{
        props.title
      }}</el-aside>
      <!-- <el-main class="el-form-item__label"> -->
        <el-select
          :filterable="this.props.filterable"
          v-model="items"
          collapse-tags
          :multiple="!this.props.radio"
          :placeholder="placeholder"
          style="width: 100%"
          @visible-change="deformation"
          :disabled="editDisabled"
          :remote="remote"
          value-key="id"
          reserve-keyword
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <div class="searchFix">
            <span v-if="!this.props.radio">
              <el-checkbox
                style="margin: 0px 0px 0px 20px"
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @click="handleCheckAllChange"
                :disabled="isView"
                >{{ $t(`Action.CheckAll`) }}</el-checkbox
              >
              <el-button
                style="margin: 0px 0px 0px 30px"
                size="small"
                @click="checkOpposite"
                :disabled="isView"
                >{{ $t(`Action.Invert`) }}</el-button
              >
            </span>
            <el-button
              style="margin: 0px 0px 0px 10px"
              size="small"
              @click="showBatchSelect = !showBatchSelect"
              >批量选中</el-button
            >
            <el-button
              style="margin: 0px 0px 0px 10px"
              size="small"
              @click="setValue([])"
              >清空</el-button
            >
          </div>
          <div class="placeholder"></div>
          <el-option
            v-for="item in tableData"
            :key="item.id"
            :label="props.showCode ? item.code + item.name : item.name"
            :value="item.id"
            :disabled="isView"
          ></el-option>
        </el-select>
      <!-- </el-main> -->
    </el-container>
    <el-dialog
      title="批量选中"
      :visible.sync="showBatchSelect"
      append-to-body
      width="40%"
    >
      <el-input
        v-model="batchInput"
        type="textarea"
        :autosize="{ minRows: 12, maxRows: 14 }"
        placeholder="批量导入，内容之间使用半角逗号或换行隔开！"
      ></el-input>

      <div class="button-container">
        <el-button type="danger" @click="batchInput = ''">清空</el-button>
        <el-button type="primary" @click="batchSelectAction">确认</el-button>
        <el-button @click="showBatchSelect = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
export default {
  name: "DroplistControlExt",
  model: {
    prop: "value",
  },
  props: {
    props: {
      type: Object,
      default() {
        return {}
      },
    },
    isView: {
      type: Boolean,
      default() {
        return false
      },
    },
    value: {},
  },
  mounted() {
    if (
      this.props.items === undefined &&
      this.value !== undefined &&
      this.value !== ""
    ) {
      if (this.props.editDisabled !== undefined) {
        if (this.props.editDisabled) {
          this.editDisabled = true
        }
      }
      if (this.props.radio) {
        this.items = this.value
      } else {
        let val = this.value
        if (Array.prototype.isPrototypeOf(val)) {
          this.items = val
        } else {
          this.items = val.split(",")
        }
      }
    }
  },
  data() {
    return {
      showBatchSelect: false,
      batchInput: "",
      placeholder: "请选择",
      remote: false,
      editDisabled: false,
      required: true,
      checkAll: false,
      items: [],
      tableData: [],
      AllKey: [],
      isIndeterminate: false,
      selected: {
        checkState: undefined,
        checkall: undefined,
        items: undefined,
        name: undefined,
      },
      loading: false,
      itemsName: "",
      list: [],
    }
  },
  watch: {
    //数据更新
    isIndeterminate: {
      handler() {
        this.ValueChange()
      },
    },
    items: {
      handler() {
        this.ValueChange()
      },
    },
    checkAll: {
      handler() {
        this.ValueChange()
      },
    },
    required: {
      handler() {
        this.ValueChange()
      },
    },
    props: {
      handler() {
        //临时方法，该组件应该还有bug，监听导致触发有点乱
        if (this.props.watch === true) {
          this.initComponent()
        }
      },
      deep: true,
    },
  },
  created() {
    this.initComponent()
  },
  methods: {
    initComponent() {
      //初始化
      this.default()
      this.handleSelectList()
    },
    remoteMethod(query) {
      //远程搜索
      if (!this.props.query) return
      this.AllKey = []
      //let num = query.length;
      if (query !== "" && query !== undefined) {
        this.loading = true
        this.tableData = this.list.filter((item) => {
          if (
            item.name
              //.substr(0, num)
              .toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          ) {
            if (
              this.props.filterSize != undefined &&
              typeof this.props.filterSize === "number"
            ) {
              if (this.AllKey.length <= this.props.filterSize) {
                this.AllKey.push(item.id) //得到ID串
              } else {
                return
              }
            } else {
              this.AllKey.push(item.id) //得到ID串
            }

            return true
          }
        })
        this.handlecheckedIdChange(this.items)
        this.loading = false
      } else {
        this.tableData = []
      }
    },
    confValue() {
      //配置值的类型
      if (this.props.radio) this.items = ""
      else this.items = []
    },
    setValue(value) {
      //动态赋值
      this.items = value
    },
    setDisabled(value) {
      //动态禁用/启用
      this.editDisabled = value
    },
    pickRoleName() {
      //获取文本
      this.itemsName = ""
      if (!this.props.radio) {
        if (this.items.length > 5) {
          this.itemsName = "略"
          return
        }
        for (let i = 0; i < this.items.length; i++) {
          let obj = ""
          if (this.remote)
            obj = this.list.find((item) => {
              return item.id === this.items[i] //筛选出匹配数据
            })
          else
            obj = this.tableData.find((item) => {
              return item.id === this.items[i] //筛选出匹配数据
            })
          if (obj === undefined) return
          this.itemsName += obj.name + " "
        }
      } else {
        let obj = ""
        if (this.remote)
          obj = this.list.find((item) => {
            return item.id === this.items //筛选出匹配数据
          })
        else
          obj = this.tableData.find((item) => {
            return item.id === this.items //筛选出匹配数据
          })
        if (obj === undefined) return
        this.itemsName = obj.name
      }
    },
    deformation(value) {
      if (value) this.$emit("dadMethod")
    },
    default() {
      //LiuJY add 设置新增页面控件不可选 新增时写前面mounted不生效
      if (this.props.addDisabled !== undefined) {
        if (this.props.addDisabled) {
          this.editDisabled = true
        }
      }
      if (this.props.required === undefined || this.props.required === true)
        this.required = true
      else this.required = false
      if (this.props.radio) this.required = true
      //是否必填
    },
    ValueChange() {
      this.pickRoleName()
      this.handlecheckedIdChange(this.items)
      
      if (this.tableData.length == 0) this.checkAll = false
      if (!this.props.radio) {
        if (!this.checkAll && !this.isIndeterminate)
          this.selected.checkState = 0
        //全不选
        else if (this.checkAll && !this.isIndeterminate)
          this.selected.checkState = 1
        //全选
        else if (!this.checkAll && this.isIndeterminate)
          this.selected.checkState = 2 //半选
        if (this.required) this.selected.checkall = true
        //必选
        else this.selected.checkall = false //非必选
        this.selected.items = this.items //选择值
      } else {
        this.selected.checkState = 2 //半选
        this.selected.checkall = true //必选
        this.selected.items = this.items.toString() //选择值
      }
      this.selected.name = this.itemsName
      this.$emit("update:selected", this.selected) //更新值
      // this.$emit("input", this.selected.items)
      this.$emit("update:modelValue", this.selected.items)
    },
    handleCheckAllChange() {
      // 全选/全不选
      console.log("全选");
      console.log(this.checkAll);
      
      
      if (!this.checkAll) {
        this.items = this.AllKey
      } else {
        this.items = []
      }
      this.isIndeterminate = false
    },
    checkOpposite() {
      //反选
      this.items = this.items
        .concat(this.AllKey)
        .filter((v) => !this.items.includes(v))
      this.handlecheckedIdChange(this.items)
    },
    handlecheckedIdChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.tableData.length
      //全选按钮控制
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.tableData.length
    },
    checkRequirement() {
      //检查是否为空
      if (this.items == "" && this.required && !this.props.hide) return false
      else return true
    },
    async handleSelectList() {
      //数据获取
      this.confValue()
      if (this.props.api === undefined && this.props.dicData !== undefined) {
        // 数据字典
        this.tableData = this.props.dicData
        this.AllKey = []
        this.tableData.forEach((item) => {
          this.AllKey.push(item.id) //得到ID串
        })
        if (this.props.checkall && !this.props.radio) this.items = this.AllKey //全选
        if (this.props.items !== undefined) this.items = this.props.items //自定义赋值
        if (this.props.firstItems !== undefined)
          this.items = this.props.dicData[0].id //默认第一个值
        if (!this.props.radio) this.handlecheckedIdChange(this.items)
      }
      if (this.props.api !== undefined && this.props.dicData === undefined) {
        
        
        //后端取数
        // await this.$api
        //   .fetch({
        //     method: this.props.api,
        //     params: this.props.params === undefined ? {} : this.props.params,
        //   })
      const res = await request({
        url: '/rest/api/smc', // 或 '/', 注意不要写 this.props.api
        method: 'post',
        data: {
          method: this.props.api,    // 'queryOrgCmp@retail.sys.comSelect'
          params: this.props.params || {}
        }
      })
      console.log("DroplistControlExt");
      console.log(res);
      
      
          // .then((res) => {
            if (res.code === 0) {
              
              const data = res.result
              console.log(this.props.api, data)
              if (
                this.props.filterable &&
                data.tableData.length > 50 &&
                this.props.query
              ) {
                this.list = data.tableData
                this.placeholder = "请输入关键字搜索"
                this.remote = true
                if (
                  this.props.query &&
                  this.props.items === undefined &&
                  this.value !== undefined &&
                  this.value != ""
                ) {
                  this.AllKey = []
                  this.tableData = []
                  //let num = this.value.length;
                  this.tableData = this.list.filter((item) => {
                    if (
                      item.id
                        .toString()
                        //.substr(0, num)
                        .indexOf(this.value.toString()) > -1
                    ) {
                      this.AllKey.push(item.id) //得到ID串
                      return true
                    }
                  })
                  if (!this.props.radio) this.handlecheckedIdChange(this.items)
                }
              } else {
                this.list = data.tableData
                this.tableData = data.tableData
                this.tableData.forEach((item) => {
                  this.AllKey.push(item.id) //得到ID串
                })
                if (this.props.checkall && !this.props.radio)
                  this.items = this.AllKey //全选
                if (this.props.items !== undefined)
                  this.items = this.props.items //自定义赋值
                if (this.props.firstItems !== undefined)
                  this.items = data.tableData[0].id //默认第一个值
                if (!this.props.radio) this.handlecheckedIdChange(this.items)
              }
            } else {
              this.$dlg.showError("数据获取失败！")
            }
          // })
      }
    },
    async RefreshList(api, params) {
      //数据刷新
      const res = await this.$api.fetch({
        method: api,
        params: params === undefined ? {} : params,
      })

      this.confValue()
      this.tableData = []
      this.AllKey = []
      this.list = []
      this.loading = true
      if (res.data.code === 0) {
        const data = res.data.result
        if (
          this.props.filterable &&
          data.tableData.length > 50 &&
          this.props.query
        ) {
          this.list = data.tableData
          this.placeholder = "请输入关键字搜索"
          this.remote = true
        } else {
          this.tableData = data.tableData
          ;(this.placeholder = "请选择"), (this.remote = false)
          this.tableData.forEach((item) => {
            this.AllKey.push(item.id) //得到ID串
          })
          if (this.props.firstItems !== undefined)
            this.items = data.tableData[0].id //默认第一个值
          if (this.props.checkall && !this.props.radio) this.items = this.AllKey //全选
          if (!this.props.radio) this.handlecheckedIdChange(this.items)
        }
      } else {
        this.$dlg.showError("数据获取失败！")
      }
      this.loading = false

      return res
    },
    batchSelectAction() {
      if (!this.batchInput) {
        this.$dlg.showError("请输入数据")
        return false
      }
      const inputArray = this.batchInput.trim().split(/,|\n/)
      const setArr = Array.from(new Set(inputArray))
      const matchName =
        (this.props.batchConfig && this.props.batchConfig.matchAttr) || "name"

      const result = this.checkBatchInput(inputArray, setArr, matchName)
      if (result === true) {
        // 设置存储的选中id数据
        const selectArr = this.tableData
          .filter((data) => {
            return setArr.includes(data[matchName])
          })
          .map((data) => data.id)

        this.setValue(selectArr)
        this.showBatchSelect = false
      }
    },
    checkBatchInput(inputArray, setArr, matchName) {
      console.log(this.AllKey, this.tableData)
      console.log(this.props)
      const matchArr = this.tableData.map((data) => {
        return data[matchName]
      })
      const res = setArr.filter((item) => {
        return matchArr.includes(item) === false
      })
      if (res.length === 0) {
        this.$dlg.showSuccess("检测通过")
        return true
      } else {
        const h = this.$createElement
        this.$msgbox({
          title: "存在以下错误数据",
          showCancelButton: true,
          message: h(
            "div",
            { style: "font-size:14px;font-weight:500;white-space: pre-wrap" },
            res.join("\n")
          ),
          confirmButtonText: "清除错误数据",
          cancelButtonText: "取消",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              const filterInputArray = inputArray.filter((item) => {
                return res.includes(item) === false
              })

              this.batchInput = filterInputArray.join("\n").trim()
              this.$dlg.showSuccess("成功清除错误数据")
              done()
              return true
            } else {
              done()
              return false
            }
          },
        })
      }
    },
  },
}
</script>
<style scoped>
.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
  margin-left: auto;
}
.el-main {
  overflow: hidden;
}
.searchFix {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 999;
  background-color: #fff;
  width: 100%;
  height: 45px;
  line-height: 45px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

.placeholder {
  height: 45px;
}

.el-scrollbar {
  position: relative;
}

.el-select-dropdown__list {
  padding: 0;
}
</style>
<style>
.el-select-dropdown .el-scrollbar .el-scrollbar__wrap {
  overflow: scroll;
}
</style>
