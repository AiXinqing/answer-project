<template>
  <div class="hj-button">
    <el-button v-bind="$attrs" v-on="$listeners">
      <slot></slot>
    </el-button>
  </div>
</template>

<script>
import { Button } from 'element-ui'
export default {
  name: 'hjButton',
  props: {},
  data() {
    return {}
  },
  methods: {},
  mounted() {},
  components: {
    elButton: Button,
  },
}
</script>

<style lang="less">
.hj-button {
  display: inline-block;
}
/* 功能按钮 */
.el-button {
  font-size: 12px;
}
.el-button--function {
  padding: 6px 8px;
  padding-left: 28px;
  background-size: 14px;
  background-repeat: no-repeat;
  background-position: 8px center;
  border: 1px solid #1ab394;
  color: #1ab394;
}
.el-button--function:focus,
.el-button--function:hover {
  color: #1ab394;
  border-color: #1ab394;
  background-color: #d1f0ea;
}

/* 搜索按钮 */
.el-button--search {
  padding: 6px 18px;
  padding-left: 34px;
  background-size: 14px;
  background-repeat: no-repeat;
  background-position: 14px center;
  border: 1px solid #1ab394;
  color: white;
  background-color: #1ab394;
}
.el-button--search:focus,
.el-button--search:hover {
  color: white;
  border-color: #16957b;
  background-color: #16957b;
}
/* 确定按钮 */
.el-button--confirm {
  padding: 0 0;
  height: 30px;
  width: 60px;
  border: 1px solid #1ab394;
  color: white;
  background-color: #1ab394;
}
.el-button--confirm:focus,
.el-button--confirm:hover {
  color: white;
  border-color: #16957b;
  background-color: #16957b;
}
/* 透明按钮 */
.el-button--transparent {
  padding: 6px 13px;
  border: 1px solid #e6e6e6;
  color: #333;
  background-color: #fff;
}
.el-button--transparent:focus,
.el-button--transparent:hover {
  color: #333;
  border-color: #e6e6e6;
  background-color: #fff;
}
/*删除按钮 */
.el-button--del {
  padding: 6px 13px;
  border: 1px solid #f56262;
  color: #f56262;
  background-color: #fff;
}
.el-button--del:focus,
.el-button--del:hover {
  color: #f56262;
  border-color: #f56262;
  background-color: #fff; //del
}
/* 取消按钮 */
.el-button--cancel {
  padding: 0 0;
  height: 30px;
  width: 60px;
  border: 1px solid transparent;
  color: #333;
  background-color: #f1f1f1;
}
.el-button--cancel:focus,
.el-button--cancel:hover {
  color: #333;
  border-color: #cccccc;
  background-color: #cccccc;
}
/* 返回按钮 */
.el-button--return {
  padding: 5px 6px;
  padding-left: 26px;
  background-size: 14px;
  background-repeat: no-repeat;
  background-position: 9px center;
  border: 1px solid #1ab394;
  color: #1ab394;
}
.el-button--return:focus,
.el-button--return:hover {
  color: #1ab394;
  border-color: #1ab394;
  background-color: #d1f0ea;
}
/* 删除按钮 */
.el-button--delete {
  padding: 6px 18px;
  border: 1px solid transparent;
  color: #ffffff;
  background-color: #fc6969;
}
.el-button--delete:focus,
.el-button--delete:hover {
  color: #ffffff;
  border-color: #d65555;
  background-color: #d65555;
}
</style>
