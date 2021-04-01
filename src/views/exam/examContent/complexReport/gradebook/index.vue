<template>
  <div class="complex_content">
    <hj-stretch
      v-for="(choose,i) in stretchBox"
      :key="i"
      :choose-list="choose">
    </hj-stretch>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        stretch: false,
        stretchBox:[
          {
            subject:'科目',
            type:'single',
            stretch:false,
            subjectList:[
              {
                name:'总分',
                id:1,
                check:true,
              },
              {
                name:'语文',
                id:2,
                check:false,
              },
              {
                name:'数学',
                id:3,
                check:false,
              },
              {
                name:'英语',
                id:4,
                check:false,
              }
            ]
          },
          {
            subject:'班级',
            type:'multiple',
            stretch:false,
            subjectList:[
              {
                name:'全部',
                id:1,
                check:true,
              },
              {
                name:'高中2020级01班',
                id:2,
                check:false,
              },
              {
                name:'高中2020级01班',
                id:3,
                check:false,
              },
              {
                name:'高中2020级01班',
                id:4,
                check:false,
              }
            ]
          }
        ]
      }
    },
    methods: {
      handleStretch() {
        this.stretch = !this.stretch
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .complex_content{
    width: 100%;
    background-color: @white;
    margin-top: 10px;
    padding: 5px 0;
  }
</style>