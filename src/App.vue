<template>
  <div id="app">
    <div class="group_heads" v-show="!down">
      <span>{{title}}</span>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  computed:{
    title() {
      return this.$route.name == 'preview' ? '答题卡预览' : '制作答题卡'
    },

    down() {
      return this.$route.query.down ? 1 :
        this.$route.name != '/' && this.$route.name != 'Home' && this.$route.name != 'preview' ? 1 : 0
    }
  },
}
</script>


<style lang="less">
@import '~@/assets/css/variables.less';
#app {
  height: 100%;
}
.group_heads {
  height: 50px;
  line-height: 50px;
  width: 100%;
  background-color: @main;
  position: fixed;
  z-index: 10;
  text-align: center;
  color: @white;
  font-size: 16px;
  top: 0;
}

</style>

