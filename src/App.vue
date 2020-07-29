<template>
  <div id="app">
    <div class="group_heads">
      <span>制作答题卡</span>
    </div>
    <router-view />
  </div>
</template>

<style lang="less">
@import '~@/assets/css/variables.less';
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
