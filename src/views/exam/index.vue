<template>
  <div class="exam_content">
    <div class="head_wapper">
      <div class="dorm_head_nav">
        <div class="nav_logo"></div>
        <div class="nav_menu">
          <a
            v-for="(item, index) in linkData"
            :key="index"
            :class="['calssname',{'router-link-active':item.calssname == active}]"
            @click="handelChange(item)">
            <i></i>
            <span>{{item.linkName}} <em/></span>
          </a>
        </div>
        <div class="nav_login"></div>
      </div>
    </div>
    <div class="content_router">
      <router-view/>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        active:'examHome',
        linkData: [
          {
            'calssname':'examHome',
            'toUrl':'examHome',
            'linkName':'常用综合报表'
          },
          {
            'calssname':'classAnalysis',
            'toUrl':'classAnalysis',
            'linkName':'班级分析报告'
          },
          {
            'calssname':'schoolAnalysis',
            'toUrl':'schoolAnalysis',
            'linkName':'校级分析报告'
          },
          {
            'calssname':'jointExam',
            'toUrl':'jointExam',
            'linkName':'联考分析报告'
          },
        ],
        prmTid:''
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          const query = route.query
          if (query.prmTid) {
            this.prmTid = query.prmTid
          }
        },
        immediate: true
      },
    },

    methods: {
      handelChange(item) {
        this.active = item.calssname
        this.$router.push({name:item.toUrl,query:{prmTid:this.prmTid}})
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .exam_content{

    height: 100%;

    .head_wapper{
      background-color: #fff;
      width: 100%;
      height: 59px;
      line-height: 59px;
      border-bottom: 1px solid #ebeef5;
    }
  }
  .dorm_head_nav{
    display: flex;
    width: 1200px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);

    .nav_logo{
      flex-shrink:0;
      width: 180px;
      background: url('~@/assets/nav_logo.png') no-repeat center;
    }

    .nav_menu{
      width: 100%;
      flex-shrink:1;
      display: flex;

      a{
        flex-shrink:1;
        margin: 0 10px;
        width: 100%;
        text-align: center;

        &.router-link-active{
          span{
            color: @mainFont;
          }
        }

        span{
          color: @font-909;
        }

        &:hover{
          span{
            color: @mainFont;
          }
        }
      }

    }

    .nav_login{
      width: 160px;
      flex-shrink:0;
    }
  }

  .exam_wapper{
    height: calc(100% - 10px);
    width: 1200px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
  .content_router{
    height: calc(100% - 65px);
  }
  .calssname{
    cursor: pointer;
  }
</style>