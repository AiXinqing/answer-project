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
        <div class="nav_login">
          <exam-button class="marking_task" type="primary" @click="markingTask">回到旧版</exam-button>
        </div>
      </div>
    </div>
    <div class="content_router">
      <router-view/>
    </div>
  </div>
</template>

<script>
  // import { URL } from '@/utils/config' //'./config'
  // import request from '@/utils/http'
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
        ],

        isClassReport:[
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
        ],
        // 判断是否显示联考分析报告
        isJointExam:[
          {
            'calssname':'jointExam',
            'toUrl':'jointExam',
            'linkName':'联考分析报表'
          }
        ],
        prmTid:''
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          const query = route.query

          if (query.tid) {
            this.prmTid = query.tid
            let obj = {
              calssname:route.name,
              toUrl:route.name
            }
            this.active = route.name
            this.changeRouter(obj)
            this.isJointExamFunc()
          }
        },
        immediate: true
      },
    },

    methods: {
      handelChange(item) {
        if(this.active != item.calssname){
          this.active = item.calssname
          this.changeRouter(item)
        }

      },

      changeRouter(item){
        this.$router.push({name:item.toUrl,query:{tid:this.prmTid}})
      },

      markingTask(){
        //window.location.origin +
        var url =  "http://lzxxt.cn:60033/Manage/Home/AnalyzeReports/" + this.prmTid
        window.location.href = url
      },

      isJointExamFunc(){
        this.$store.dispatch('getExam/getIsShowJointExam', {
          tid: this.prmTid,url:this.URL.IsShowJointExam
        }).then(res => {
          if(res.ResponseContent.IsShowClassReport){
            const index = this.linkData.findIndex((itme) => itme.calssname === 'classAnalysis')
            if(index <= -1){
              this.linkData = [...this.linkData,...this.isClassReport]
            }
          }
          if(res.ResponseContent.IsShowJointExam){
            const index = this.linkData.findIndex((itme) => itme.calssname === 'jointExam')
            if(index <= -1){
              this.linkData = [...this.linkData,...this.isJointExam]
            }
          }

        })
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
  .marking_task{
    button.el-button.el-button--primary.el-button--medium {
      margin-left: 40px !important;
      border-radius: 14px;
      background: @white !important;
      color: @mainFont;
      &:hover{
        color: @mainFont !important;
      }
    }
  }

</style>