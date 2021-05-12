<template>
  <section>
    <div class="classAnalysis_content">
      <!-- 标题 -->
      <div class="classAnalysis_title mar_T10">
        <div class="title_h2">20年秋期九年级半期考试</div>
        <div class="title_h5">班级对比分析报告</div>
      </div>
      <div class="title_info">
        <div class="title_p padding_10">老师您好：</div>
        <div class="title_p">本次考试（考试时间：2020-11-09)， 全校 初三 共 24 个班级，1334 名学生参加考试。 考试学科： 语文、数学、英语、物理化学(物理、化学)、物理、化学、生物、道法历史(道法、历史)、历史、地理、道法 11 门学科。</div>
      </div>
      <!-- 标题 -->

      <!-- 动态锚点 -->
      <!-- <keep-alive> -->
      <!--  缓存路由的name属性等于tabView的组件 -->
        <!-- <component v-bind:is="tabView" class="mar_T10"></component> -->
      <!-- </keep-alive> -->

      <Parking1 class="mar_T10" id="Parking1"></Parking1>
      <Parking2 class="mar_T10" id="Parking2"></Parking2>
      <!-- 动态锚点 -->
    </div>

    <!-- 浮动锚点点击处 -->
    <div class="Anchor_box">
      <div class="anchor_title">成绩分析</div>
      <div class="anchor_list">
        <p
          v-for="(tab ,index) in tabsAnchor"
          :key="index"
          :class="{cur:iscur==index}"
          @click="iscur=index,goAnchor('Parking' + (index + 1))"
        >
          {{tab.name}}
        </p>
      </div>
    </div>
    <!-- 浮动锚点点击处 -->

  </section>
</template>

<script>
  import Parking1 from './_averageRank'
  import Parking2 from './_gradesOverview'

  export default {
    components: {
      Parking1,
      Parking2
    },
    data() {
      return {
        tabView: 'Parking1',
        tabsAnchor: [
          {
            name:'学科平均分排名'
          },
          {
            name:'班级成绩概况'
          },
          {
            name:'学科等级占比'
          },
          {
            name:'分段人数分布'
          },
          {
            name:'学科试题得分率'
          },
        ],
        iscur:0
      }
    },
    methods: {

      goAnchor(selector) {
        var anchor = this.$el.querySelector(selector)
        document.documentElement.scrollTop = anchor.offsetTop
      },

      tabChange (tab) {
        this.tabView = tab
      }

    }
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .classAnalysis_content{
    width: 1200px;
    height: 100%;
    // background-color: @white;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    padding-bottom: 10px;

    .mar_T10{
      margin-top: 10px;
    }

    .classAnalysis_title{
      width: 100%;
      padding-top: 60px;
      background-color: @main;
      color: @white;

      .title_h2{
        width: 100%;
        text-align: center;
        font-size: 24px;
        font-weight: 600;
      }

      .title_h5{
        height: 40px;
        line-height: 40px;
        width: 100%;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
      }
    }

    .title_info{
      width: calc(100% - 70px);
      background-color: @white;
      padding: 0 34px;
      font-size: 14px;
      padding-top: 35px;

      .title_p{
        line-height: 24px;
        padding-bottom: 10px;
      }
    }

    .padding_10{
      padding-bottom: 15px;
    }

  }
  .Anchor_box{
    display: none;

    width: 180px;
    position: fixed;
    left: 100px;
    top: 35%;
    z-index: 999;
    background-color: @white;

    .anchor_title{
      height: 52px;
      line-height: 52px;
      background-color: @main_t;
      font-weight: 700;
      text-align: center;
    }

    .anchor_list{
      padding: 10px 0 20px 0;
      width: 100%;
      background-color: @white;

      p{
        width: 100%;
        text-align: center;
        cursor: pointer;

        &.cur{
          color: @main
        }
      }
    }
  }
</style>