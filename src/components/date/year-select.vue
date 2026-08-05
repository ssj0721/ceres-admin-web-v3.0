<template>
  <div class="year-select-container">
    <el-button class="left-btn" @click="changeYear(-1)"><i class="el-icon-arrow-left"></i></el-button>
    <el-select id="year-selector"
               v-model="selectedYear"
               @visible-change = "handleVisibleChange"
               clearable
               placeholder="请选择年份">
      <el-button-group class="year-select-header-20251009">
        <el-button @click="rangeStart-=10;">&lt;&lt;</el-button>
        <el-button plain class="year-range">{{ rangeStart }}-{{ rangeEnd }}</el-button>
        <el-button @click="rangeStart+=10;">&gt;&gt;</el-button>
      </el-button-group>
      <div class="spacer"></div>
      <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item">
      </el-option>
    </el-select>
    <el-button class="right-btn" @click="changeYear(+1)"><i class="el-icon-arrow-right"></i></el-button>
  </div>
</template>

<script>
export default {
  name: "yearSelect",
  model: {
    prop: "value"
  },
  props: {
    value: {
      type: String,
    }
  },
  data() {
    return {
      selectedYear: "",  // 实际选中并展示的年份
      rangeStart: "",  // 选择列表的起始年份
      yearList: [],  // 选择列表，表示可选年份
    }
  },
  methods: {
    // 生成baseYear ±5年的范围
    setYearList(baseYear) {
      this.yearList = [];
      for (let i = -5; i <= 5; i++) {
        this.yearList.push(String(baseYear + i));
      }
    },
    // 增加，减少选中年份
    changeYear(diff) {
      if(this.selectedYear === ""){
        this.selectedYear = String(this.year);
      }else{
        this.year += diff;
      }
    },
    // 打开/关闭选择列表的回调，visible为true表示打开
    handleVisibleChange(visible) {
      if(visible) {
        this.rangeStart = this.year-5;
        this.setYearList(this.year);
      }
    }
  },
  computed: {
    // 计算属性year，将字符串类型的 selectedYear 转换为数字类型便于计算操作，会和 selectedYear 同步变化
    year: {
      get() {
        return parseInt(this.selectedYear) || new Date().getFullYear(); // 默认当前年
      },
      set(newValue) {
        this.selectedYear = String(newValue);
      }
    },

    rangeEnd() {
      return this.rangeStart + 10;
    }
  },
  watch: {
    // 监听年份变化，向上传递
    selectedYear(val) {
      this.$emit("input", val);
    },
    // 年份范围变化时，更新年份列表
    rangeStart: {
      handler(val) {
        this.setYearList(val+5);
      },
      immediate: true,
    }
  },
}
</script>

<style scoped lang="scss">
.year-select-container {
  display: flex;
  align-items: flex-end;
  width: 100%;

  .el-button {
    overflow: hidden;
    text-overflow: clip;
    white-space: nowrap;

    background-color: #f3f5f9;
    text-align: center;
    border-radius: 0;
    border-color: #dcdfe6;

    height: 32px;
    padding: 0;
    flex: 0 0 20%; /* 禁止伸缩，固定20% */

    &:first-child {
      border-right: 0;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    &:last-child {
      border-left: 0;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }

  .el-select ::v-deep {
    .el-input__inner{
      border-radius: 0 !important;
      padding-left: 12px;
      padding-right: 0;
    }
    .el-input__icon:not(.el-icon-circle-close) {
      display: none;
    }
  }
}

.spacer {
  width: 124.3px;
  height: 30px;
}

.year-select-header-20251009 {
  top: 0;
  left: 0;
  position: absolute;
  display: flex;
  z-index: 2;

  .el-button {
    padding-left: 6px;
    padding-right: 6px;
    &.year-range {
      cursor: text;
    }
  }
}
</style>

<style lang="scss">
.el-select-dropdown:has(.year-select-header-20251009) {
  ul {
    padding-top: 0;
  }
}
</style>