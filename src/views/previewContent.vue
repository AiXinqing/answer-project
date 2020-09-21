<template>
  <div class="page-content">
    <div class="main-info">
      <div class="page_card">
        <div class="page_info_itme"></div>
        <div class="page_info_itme"></div>
        <div class="card_footer">第 1 页 共 2 页</div>
      </div>
      <!-- <div class="page_card">
        <div class="page_info_itme"></div>
        <div class="card_footer">第 1 页 共 2 页</div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  components: {},
}
</script>

<style lang="less" scoped>
html {
  background: #ffffff;
}
#app,
.page-content,
.main-info {
  background: #ffffff;
}
.page-content {
  margin-top: 50px;
  .page_card {
    display: flex;
    flex-wrap: wrap;
    width: 1650px;
    position: relative;
    left: 50%;
    margin-left: -825px;
  }
}
.page_info_itme {
  width: 780px;
  height: 1170px;
  border: 1px solid #888;
  border-radius: 3px;
  margin-left: 40px;
  margin-top: 50px;
}
.card_footer {
  width: 100%;
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  text-indent: 35px;
}
</style>
