<template>
    <el-input v-bind="$attrs" v-on="$listeners" class="hj-input" v-bind:class="{'has-error':error}"><slot></slot></el-input>
</template>

<script>
    import { Input } from 'element-ui'
    export default {
        name: "hjInput",
        props: {
            error: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {

            }
        },
        methods: {
        },
        mounted () {

        },
        components: {
            elInput: Input
        }
    }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  /*输入框样式*/
  .hj-input.el-input {
      width: 180px;
      display: inline-block;
  }
  .hj-input.el-input input{
      width: 100%;
      padding: 0 8px;
      line-height: 26px;
      font-size: 14px;
  }
  .hj-input.el-input input:focus {
      border-color: @mainFont;
  }
  /*输入框placeholder样式*/
  .hj-input.el-input input::-webkit-input-placeholder{
      color: @font-909;
      font-size: 14px;
  }
  .hj-input.el-input input::-moz-placeholder{
      color: @font-909;
      font-size: 14px;
  }
  .hj-input.el-input input:-ms-input-placeholder{
      color: @font-909;
      font-size: 14px;
  }
  .hj-input.el-input.is-disabled .el-input__inner{
      color: @font-333;
  }
  .hj-input.has-error{
      input {
          border-color: @main;
      }
  }
</style>