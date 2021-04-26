<template>
  <div class="complex_content">
    <hj-stretch
      v-for="(choose,i) in subjectsArr"
      :key="i"
      :choose-list="choose">
    </hj-stretch>
    <div class="table_wapper">
      <div class="table_search">
        <div class="search_left">
          <span class="titile_18">分数详情</span>
          <i>(点击学科的分数，可查看学生的答题卡)</i>
        </div>
        <div class="search_right">
          <exam-button type="primary">下载表格</exam-button>
          <exam-button type="primary">查询</exam-button>
          <hj-input v-model="text" placeholder="请输入12345">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </hj-input>
        </div>
      </div>

      <div class="el_table_wapper">
        <exam-table :is-combination="true" :tablecols="tableColumn"></exam-table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      stretchBox: {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {
        stretch: false,
        stretchArr:[],
        text:'',
        tableColumn:[
          {
            prop:'date',
            label:'姓名',
            minWidth:'80',
            fixed:'left'
          },{
            prop:'name',
            label:'考号',
            minWidth:'80',
          },
          {
            prop:'province',
            label:'学号',
            width:'1',
            childen:[
              {
                prop:'city',
                label:'班级',
                width:'80',
              },
              {
                prop:'address',
                label:'总分',
                minWidth:'140',
              },
              {
                prop:'zip',
                label:'客观题',
                width:'120',
              },
              {
                prop:'address',
                label:'客观题',
                minWidth:'180',
              },
            ]
          },
          {
            label: "操作",
            type: "Text",
            align: "left",
            fixed: "right",
            minWidth: 55,
          },
        ],
        tableData: [
        ]
      }
    },

    computed: {
      subjectsArr() {
        return this.stretchArr.map(item =>{
          return item.subject == '科目' ? {
            ...item,
            subjectList:item.subjectList.filter(ele => ele.sid != 'totalScore').map((ele,index) => {
              return index == 0 ? {...ele,check:!ele.check} : ele
            })
          } : item
        })
      }
    },

    watch: {
      stretchBox: {
        immediate: true,
        handler () {
          this.stretchArr = this.stretchBox
        }
      },
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
</style>