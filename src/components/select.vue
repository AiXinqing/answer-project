/* eslint-disable vue/no-unused-components */
<template>
  <div class="hj-select" v-bind:class="{'has-error':error}">
    <el-select
      v-model="selectVal"
      v-bind="$attrs"
      v-on="$listeners"
      popper-class="hj-select-dropdown"
    >
      <el-option v-for="item in items" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>
<script>
import { Select, Option } from 'element-ui'
export default {
  name: "hjSelect",
  props: {
    items: {
      default () {
        return []
      },
      type: Array
    },
    error: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      default: 1
    }
  },
  components: {
    elSelect: Select,
    elOption: Option
  },
  data () {
    return {
      selectVal: this.value
    }
  },
  watch: {
    value: {
      immediate: true,
      handler () {
        this.selectVal = this.value
      }
    }
  },
}
</script>

<style lang="less" >
.el-input--medium .el-input__inner {
  height: 28px !important;
  line-height: 28px !important;
  text-align: center;
}
</style>