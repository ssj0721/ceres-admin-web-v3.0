<template>
  <div>
    <el-container>
      <el-aside v-if="props.title" width="100px" class="el-form-item__label">{{
        props.title
      }}</el-aside>
        <el-select
          :filterable="this.props.filterable"
          collapse-tags
          v-model="items"
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
          ref="select"
        >
          <span v-if="!this.props.radio">
            <el-checkbox
              style="margin: 0px 0px 0px 20px"
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
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
          <el-option
            v-for="item in tableData"
            :key="item.id"
            :label="props.showCode ? item.code + item.name : item.name"
            :value="item.id"
            :disabled="isView"
          ></el-option>
        </el-select>
    </el-container>
  </div>
</template>
<script>
import request from '@/utils/request'
export default {
  name: "iRetailDroplistControl",
  model: {
    prop: "value"
  },
  props: {
    props: {
      type: Object,
      default() {
        return {}
      }
    },
    isView: {
      type: Boolean,
      default() {
        return false
      }
    },
    value: {}
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
        name: undefined
      },
      loading: false,
      itemsName: "",
      list: []
    }
  },
  watch: {
    //数据更新
    isIndeterminate: {
      handler() {
        this.ValueChange()
      }
    },
    items: {
      handler() {
        this.ValueChange()
      }
    },
    checkAll: {
      handler() {
        this.ValueChange()
      }
    },
    required: {
      handler() {
        this.ValueChange()
      }
    },
    props: {
      handler() {
        //临时方法，该组件应该还有bug，监听导致触发有点乱
        if (this.props.watch === true) {
          this.initComponent()
        }
      },
        modelValue: [String, Number, Array], // 根据你字段类型定
      deep: true
    }
  },
  created() {
    this.initComponent()
  },
  methods: {
    handleScrollCenter(visible) {
      if (this.props.scrollCenter === undefined || this.props.scrollCenter === false) {
        return;
      }

      if (visible) {
        this.$nextTick(() => {
          const sel = this.$refs.select
          let index = sel.options.indexOf(sel.selected)

          if (index <= 3) {
            return;
          }
          index += 3

          const len = sel.options.length
          if (index + 1 > len ) {
            index = len - 1
          }
          sel.scrollToOption(sel.options[index])
        })
      }
    },
    initComponent() {
      console.log(898888888888);
      
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
      this.handleScrollCenter(value);
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
      console.log("==============");
      console.log(this.items);
      
      
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
      this.$emit("update:modelValue", this.selected.items)

      console.log(this.selected.items);
      
      
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
        //     params: this.props.params === undefined ? {} : this.props.params
        //   })
   try{ 
    console.log("data"+ this.props.params);
    

      console.log("start");
      
      const res = await request({
        url: '/rest/api/smc', // 或 '/', 注意不要写 this.props.api
        method: 'post',
        data: {
          method: this.props.api,    // 'queryOrgCmp@retail.sys.comSelect'
          params: this.props.params || {}
        }
      })
  
      console.log("zjf6666666");
      console.log(res);
            if (res.code === 0) {
              console.log(88888888);
              console.log(this.tableData);
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
   }
   catch{
     console.log("请求错误", error);
   }
      }
    },


    async RefreshList(api, params) {
      //数据刷新
      const res = await this.$api.fetch({
        method: api,
        params: params === undefined ? {} : params
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
    }
  }
}
</script>
<style>
.el-select-dropdown .el-scrollbar .el-scrollbar__wrap {
  overflow: scroll;
}
</style>
