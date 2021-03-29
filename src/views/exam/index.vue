<template>
  <div class="exam_content">
    <div class="dorm_head_nav">
      <div class="nav_logo"></div>
      <div class="nav_menu">
        <router-link
          v-for="(item, index) in linkData"
          :key="index"
          :to="{name: item.toUrl}"
          :class="item.calssname">
          <i></i>
          <span>{{item.linkName}} <em/></span>
        </router-link>
      </div>
      <div class="nav_login"></div>
    </div>
    <router-view/>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        linkData: [
          {
            'calssname':'examHome',
            'toUrl':'examHome',
            'linkName':'首页'
          }
        ]
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .dorm_head_nav{
    display: flex;
    height: 60px;
    line-height: 60px;
    background-color: #ddd;

    .nav_logo{
      flex-shrink:0;
      width: 120px;
    }

    .nav_menu{
      width: 100%;
      flex-shrink:1;

      a{

        &.router-link-active{
          span{
            color: @font-303;
          }
        }

        span{
          color: @font-909;
        }

        &:hover{
          span{
            color: @font-303;
          }
        }
      }

    }

    .nav_login{
      width: 160px;
      flex-shrink:0;
    }
  }
</style>