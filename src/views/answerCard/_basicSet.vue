<template>
  <div class="btn-content">
    <div class="basis-title">
      <span>设置答题卡基础信息</span>
    </div>
    <div class="basis_checkbox">
      <el-checkbox v-model="checked">分区答题卡</el-checkbox>
    </div>
    <div class="basis_checkbox basic_btn" style="padding-left:5px">
      <el-button @click="questionDialog">客观题</el-button>
      <el-button @click="fillInTheBlank">填空题</el-button>
      <el-button @click="answerQuestion">解答题</el-button>
      <el-button @click="optionalQuestion">选做题</el-button>
      <el-button @click="compositionEnglish">作文(英)</el-button>
      <el-button @click="compositionLanguage">作文(语)</el-button>
      <el-button @click="NonRresponseArea">非作答</el-button>
    </div>
    <div class="basis_checkbox basic_btn save-btn">
      <el-button type="primary" @click="previewLinkFunc">预览</el-button>
      <el-button type="primary" @click="saveBtn" >保存</el-button>
      <el-button type="primary" @click="downloadFunc">下载</el-button>
    </div>
    <public-dialog ref="publicDialog" />
  </div>
</template>

<script>
import { mapState,mapGetters} from 'vuex'
import publicDialog from './dialog/_publicDialog'
import qs from 'qs'


export default {
  components: {
    publicDialog,
  },
  data() {
    return {
      checked: false,
      openedFrame: true,
      saveBtnStuta:false,
      acid:''
    }
  },
  computed: {
    ...mapState('page', ['pageLayout', 'pageData','IsNew']),
    ...mapState('pageContent', ['scoreTotal']),
    ...mapState('questionType',['subTopic_number_determine']),
    ...mapGetters('page',['page_width','compile_pageData']),

    pageWidth() {
      const {column,size} = this.pageLayout
      return column === 3 && size == 'A3'
        ? 520
        : 785
    },

    textVal(){
      const {content} = this.compile_pageData[0]
      return content.textVal
    },

    pageNum() {
      const {column,size} = this.pageLayout
      return column === 3 && size == 'A3' ? 3 :
      column === 1 && size == 'A4' ? 1 :2
    },

    questionLsit () {
      // 重新结构数据
      let sorted = this.$lodash.groupBy(this.compile_pageData, function(item){
        return item.questionType == 'answerQuestion' && item.objId

      })

      let Arr = []
      Object.values(sorted).forEach(element => {
        if(element[0].questionType == 'answerQuestion'){
          let obj = {
            ...element[0],
            showData:element
          }
          Arr.push(obj)
        }else{
          Arr = [...Arr,...element]
        }
      })
      return Arr
    },

    answerSheetData() {
      let obj = {}
      let questionArr = []

      this.questionLsit.forEach(question => {
        if(question.questionType == 'AnswerSheetTitle'){
          let {content} = question

          let edit = {}
          if(this.acid){
            edit = {
              'acid':this.acid
            }
          }
          obj = {
            'IsNew':this.IsNew,// 新增
            'name': content.textVal,
            'tscore': this.scoreTotal,
            'exnum': content.titleRows,
            'studentInfos': content.titleInfo.filter(item => item.checked).map(item => item.name).toString(),
            'content': JSON.stringify(this.pageData),
            'QBAnswCardPartition':[
              {
                'seq': 1,
                'describe': "第1卷选择题",
                'tscore': this.scoreTotal,
                'QBAnswCardTopic':[]
              }
            ],
            'remark':JSON.stringify(this.subTopic_number_determine),
            'psize':this.pageLayout.size,
            'layout':this.pageLayout.column,
            ...edit
          }
        }else {
          switch(question.questionType){
            case 'ObjectiveQuestion':
              questionArr.push(this.objectiveTopic(question))
              break;
            case 'FillInTheBlank':
              questionArr.push(this.FillInTheBlankTopic(question))
              break;
            case 'optionalQuestion':
              questionArr.push(this.optionalTopic(question))
              break;
            case 'compositionEnglish':
              questionArr.push(this.compositionTopic(question))
              break;
            case 'compositionLanguage':
              questionArr.push(this.languageTopic(question))
              break;
            default:
              questionArr.push(this.answerTopic(question))
          }
        }
      })
      obj = {
        ...obj,
        QBAnswCardPartition:[
          {
            ...obj.QBAnswCardPartition[0],
          QBAnswCardTopic:questionArr
          }
        ]
      }
      return obj
    },

  },

  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.acid = query.acid
        }
      },
      immediate: true
    }
  },

  mounted() {
      document.cookie = 'ExamEmpSessionID=519d5085b94e4b1c8bcfffa56f0f566b'
  },

  methods: {
    questionDialog() {
      this.$refs.publicDialog.opened('questionDialogs')
    },
    fillInTheBlank() {
      this.$refs.publicDialog.opened('fillInTheBlanks')
    },
    answerQuestion() {
      this.$refs.publicDialog.opened('answerQuestion')
    },
    optionalQuestion() {
      this.$refs.publicDialog.opened('optionalQuestion')
    },
    compositionEnglish() {
      this.$refs.publicDialog.opened('compositionEnglish')
    },
    compositionLanguage() {
      this.$refs.publicDialog.opened('compositionLanguage')
    },
    NonRresponseArea() {
      this.$refs.publicDialog.opened('NonRresponseArea')
    },
    previewLinkFunc() {
      // 跳转至预览页面
      let routeTwo = this.$router.resolve(
        {
          name: 'preview',
          query: {pageWidth: this.pageWidth,pageNum:this.pageNum}
        }
      )
      window.open(routeTwo.href, '_blank')
    },

    downloadFunc(){
      // 下载
      this.saveBtnStuta = true
      this.saveBtn()
    },

    saveBtn(){
      // 保存

      if(this.textVal !=''){
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let params = {
          prmQBAnswCard:JSON.stringify(this.answerSheetData)
        }
        this.$http.post('/Api/Assembly/QBAnswCardBLL/SaveQBAnswCardNew',
          qs.stringify(params)
        ).then((res) => {

          if(res.data.ResponseCode == 'Success'){
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            if(this.saveBtnStuta){
              // 下载
              let routeTwo = this.$router.resolve(
                {
                  name: 'preview',
                  query: {pageWidth: this.pageWidth,pageNum:this.pageNum,down:1}
                }
              )
              window.open(routeTwo.href, '_blank')
              this.saveBtnStuta = false
            }
            loading.close()
          }
        })
        .catch(() => { // 请求失败处理
          this.saveBtnStuta = false
          loading.close()
        })
      }else{
        this.$message({
          message: '答题卡标题不能为空!',
          type: 'warning'
        });
      }
    },

    objectiveTopic(question){
      // 客观题
      let {content,showData} = question
      let obj = {
        'num':content.number,
        'name':content.topicName,
        'type':"客观题",
        'tscore':content.scoreTotal,
      }
      let topicList = showData.flat().flat()
      obj = {
        ...obj,
        QBAnswCardQuestions:topicList.map(item => {
            let type = '单选题'
            if(item.id.indexOf('check') != -1){
              type = '多选题'
            }else if(item.id.indexOf('judgment') != -1){
              type = '判断题'
            }else{
              type = '单选题'
            }

            return {
              'qnum':item.topic,
              'type':type,
              'score': item.score,
              'optionnum':item.select
            }
        })
      }
      return obj
    },

    FillInTheBlankTopic(question){
      // 客观题
      let {content,showData} = question
      let obj = {
        'num':content.number,
        'name':content.topicName,
        'type':'主观题',
        'tscore':content.scoreTotal,
      }
      let topicList = showData.flat().flat()
      obj = {
        ...obj,
        QBAnswCardQuestions:topicList.map(item => {
            return {
              'qnum':item.lid !=undefined ? `${item.topic}.${item.spaceNum}.${item.smallTopic}` : item.Multistage != undefined ? `${item.topic}` : `${item.topic}.${item.spaceNum}`,
              'type':'填空题',
              'score': item.score,
            }
        })
      }

      return obj
    },

    optionalTopic(question){
      // 选作题
      let {content} = question
      let obj = {
        'num':content.number,
        'name':content.topicName,
        'type':'主观题',
        'tscore':content.scoreTotal,
      }
      let topicList = content.group.map(question => question.childGroup).flat().map(item => item.topic)

      obj = {
        ...obj,
        QBAnswCardQuestions:[{
          'qnum':`${topicList[0]}-${topicList[topicList.length - 1]}`,
          'type':'选作题',
          'score': content.scoreTotal,
        }]
      }

      return obj
    },

    compositionTopic(question){
      // 作文（英）
      let {content} = question
      let obj = {
        'num':content.number,
        'name':content.topicName,
        'type':'主观题',
        'tscore':content.scoreTotal,
      }

      obj = {
        ...obj,
        QBAnswCardQuestions:[{
          'qnum':content.topic,
          'type':'作文(英)',
          'score': content.scoreTotal,
        }]
      }

      return obj
    },

    languageTopic(question){
      // 作文（语）
      let {content} = question
      let obj = {
        'num':content.number,
        'name':content.topicName,
        'type':'主观题',
        'tscore':content.scoreTotal,
      }

      obj = {
        ...obj,
        QBAnswCardQuestions:[{
          'qnum':content.topic,
          'type':'作文(语)',
          'score': content.scoreTotal,
        }]
      }
      return obj
    },

    answerTopic(question) {
      let {content,showData} = question
      let obj = {
        'num':content.number,
        'name':content.topicName,
        'type':'主观题',
        'tscore':question.scoreTotal,
      }

      obj = {
        ...obj,
        QBAnswCardQuestions:showData.map(ele => {
          return {
            'qnum':ele.topic,
            'type':'解答题',
            'score': ele.score,
          }
        })
      }
      return obj
    }
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.btn-content {
  width: 320px;
  float: right;
  border-left: 1px solid @shadow;
  height: 100%;
  background: @white;
}
.basis-title {
  border-left: none;
  border-right: none;
  background-color: @bf-f7;
  height: 40px;
  line-height: 40px;
  text-align: left;
  font-size: 16px;
  font-weight: 700;
  padding: 0 30px;
  border-bottom: 1px solid @bs-e3;
}
.basis_checkbox {
  padding: 20px 0;
  border-bottom: 1px solid @shadow;
  padding-left: 15px;
}
.el-button--medium {
  padding: 0 0;
  width: 90px;
  padding: 0;
  height: 38px;
  line-height: 36px;
}
.basis_checkbox.basic_btn {
  padding: 15px 0;
  padding-left: 15px;
}
.el-button--primary {
  background-color: @main !important;
  border-color: @main !important;
}
.el-button:focus,
.el-button:hover {
  color: @main !important;
  border-color: @bc_hover !important;
  background-color: @mainHover !important;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: @main !important;
  border-color: @main !important;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: @main !important;
}
.el-button + .el-button {
  margin-left: 0;
}
button.el-button.el-button--default.el-button--medium {
  margin-top: 10px;
  margin-left: 10px;
}
.basis_checkbox.basic_btn.save-btn {
  .el-button + .el-button {
    margin-left: 10px;
  }
}
</style>
