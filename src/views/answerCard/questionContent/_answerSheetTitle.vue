<template>
  <div>
    <div :class="['textVal-style',{active:previewIs}]" v-if="previewIs" v-html="data.textVal == '' ? '请输入答题卡标题' : data.textVal" :style="{'height':heightTitle+'px'}">
    </div>
    <hj-textarea v-else  :textarea-data="data.textVal" :style="{'height':heightTitle+'px'}" />

    <student-info
      @hanldeStudent="hanldeStudent"
      :title-info= "data.titleInfo"
      :preview-is="previewIs"
    />
    <el-row class="precautions_box">
      <el-col
        :span="12"
        class="precautions_left"
        :style="{ width: titleWidthLeft + 'px' }"
      >
        <div class="precautions_title">注 意 事 项</div>
        <div :class="['precautions_content', { active: pageWidth == 480 }]">
            <div
              v-for="(item,index) in title_percautions"
              :key="index"
            >{{`${index + 1}. ${item}`}}</div>
        </div>
        <div class="precautions_mark">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            version="1.1"
          >
            <text x="10" y="30" :style="{fontSize: !svg ? 18 + 'px' : 16 + 'px'}">正确填涂</text>
            <rect
              :x="!svg ? 110:80"
              y="19"
              width="17"
              height="10"
              stroke="#000000"
              fill="#000000"
              style="fill-opacity: 1"
            />
            <text
              :x="!svg ? 175 : 120"
              y="30"
              :style="{fontSize: !svg ? 18 + 'px' : 16 + 'px'}">缺考标记</text>
            <rect
              :x="!svg ? 278 : 190"
              y="19"
              width="17"
              height="10"
              stroke="#000000"
              style="fill-opacity: 0"
            />
          </svg>
        </div>
      </el-col>
      <el-col
        :span="12"
        class="precautions_right"
        :style="{ width: titleWidthRight + 'px' }"
      >
        <div class="ticket_number">
          准考证号
          <span
            v-show="!previewIs"
            class="precautions_edit layui-btn layui-btn-xs"
            @click="editAdmissionNumber"
            >编辑</span
          >
        </div>
        <table class="table_box" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <th v-for="(item, i) in titleRows" :key="i" />
            </tr>
            <tr>
              <td v-for="(item, i) in titleRows" :key="i">
                <div
                  v-for="(row,i) in trDiv"
                  :key="row"
                  :style="{ minWidth: divWidth + 'px' }"
                >
                  [<span>{{ i }} </span>]
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import hjTextarea from './Precautions/_textarea'
import studentInfo from './Precautions/_studentInfo'
import { PRECAUTIONS } from '@/models/base'
import { mapGetters } from 'vuex'



export default {
  components: {
    hjTextarea,
    studentInfo,
  },
  props: {
    contentData: {
      type: Object,
      default() {
        return []
      },
    },
    previewIs: {
      type: Boolean,
      default: false,
    },
    questionData: {
      type: Object,
      default: () => { }
    },
    previewWidth:{
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      trDiv: 10,
      studentInfoList: [],
      data:{},
      titleRows:this.questionData.content.titleRows,
      title_percautions:PRECAUTIONS,
      heightTitle:40
    }
  },
  computed: {
    ...mapGetters('page', ['page_width']),

    pageWidth(){
      let width =this.$route.query.pageWidth
      return width !== undefined && parseInt(width) - 40 != this.page_width ? parseInt(width) - 40 : this.page_width
    },

    cardData() {
      return this.contentData[0]
    },

    Rows() {
      return this.data.titleRows == 9 && this.pageWidth == 480 ? 26 : 28
    },

    svg() {
      return this.pageWidth == 480 ? true : false
    },

    titleWidthLeft() {

      if (this.titleRows * this.Rows < 224) {
        return this.pageWidth - 224
      } else {
        return this.pageWidth - this.titleRows * this.Rows
      }
    },
    titleWidthRight() {
      if (this.titleRows * this.Rows < 224) {
        return 224
      } else {
        return this.pageWidth - this.titleWidthLeft
      }
    },
    divWidth() {
      return this.titleWidthRight == 224
        ? 224 / this.titleRows - 1
        : this.Rows - 1
    },
  },
  watch: {
    questionData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.questionData.content
        }

        this.titleRows = this.questionData.content.titleRows
        this.heightTitle = this.questionData.heightTitle
      }
    }
  },
  mounted() {

  },
  methods: {
    hanldeStudent(Arr) {
      this.$emit('hanldeStudent', Arr)
    },
    editAdmissionNumber() {
      this.$emit('edit-admission-number')
    },
    hanldeCloseEsitor(){
    }
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.title-item {
  height: 40px;
  line-height: 50px;
  min-width: 148px;
  position: relative;
  top: 8px;
  span {
    display: inline-block;
    font-size: 18px;
  }
  > span:last-child {
    width: 87px;
    position: relative;
    margin-left: 10px;
    margin-right: 15px;
    top: 3px;
    border-bottom: 2px solid @font-888;
  }
  span.titke-edit {
    position: absolute;
    top: -26px;
    right: 0;
    font-size: 12px !important;
    height: 20px;
    line-height: 20px;
    padding: 0 6px;
    border-radius: 3px;
    color: @white;
    cursor: pointer;
    background-color: @main;
  }
}

.precautions_box {
  margin-top: 15px;
  .precautions_title {
    height: 38px;
    line-height: 38px;
    border-bottom: 2px solid @font-888;
    text-align: center;
    width: 100%;
  }
  .precautions_left {
    border: 1px solid @font-888;
    height: 278px;
  }
  .precautions_right {
    border: 1px solid @font-888;
    min-width: 223px;
    border-left: none;
    height: 278px;
  }
  .precautions_content {
    padding-left: 10px;
    min-height: 127px;
    border-bottom: 1px solid @font-333;
    font-size: 14px;
    &.active {
      div {
        padding: 3px 0 4px 0;
      }
    }
  }
}
.precautions_left.columns .precautions_content {
  height: 141px;
  font-size: 12px;
  margin-top: 5px;
}
.precautions_title,
.ticket_number {
  height: 38px;
  line-height: 38px;
  border-bottom: 2px solid @font-888;
  text-align: center;
  width: 100%;
}
.layui-btn-xs {
  height: 22px;
  line-height: 22px;
  padding: 0 5px;
  font-size: 12px;
  display: inline-block;
  background-color: @main;
  color: @white;
  white-space: nowrap;
  text-align: center;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}
.precautions_content div {
  padding: 9px 0;
  margin: 0 0;
}
.precautions_edit {
  position: absolute;
  right: 15px;
  top: 8px;
}
.precautions_mark {
  font-size: 16px;
  height: 50px;
  line-height: 50px;
}
.el-textarea__inner {
  border-style: dashed;
  padding: 0 0;
  text-align: center;
  line-height: 31px;
  font-size: 23px;
  border-color: @font-888;
  color: @font-333;
}
table tr td div:last-child {
  margin-bottom: 6px;
}

.table_box th {
  height: 28px;
}

.table_box div {
  font-size: 12px;
  text-align: center;
  padding-top: 4px;
  min-width: 27px;
  height: 16px;
}

.table_box div span {
  position: relative;
  top: 1px;
  left: 1.8px;
}

.table_box tr th {
  border-bottom: 2px solid @font-888;
}

.table_box td,
.table_box th {
  border-left: 1px solid @font-333;
}

.table_box td:first-child,
.table_box th:first-child {
  border-left: none;
}
.el-input--medium {
  font-size: 23px !important;
}
.el-textarea__inner {
  padding: 0 0 !important;
  border-style: dashed !important;
  border-color: @font-888 !important;
}
.table_box td:first-child {
  height: 186px;
}
.textVal-style {
  text-align: center;
  font-size: 22px;
  font-weight: bold;

  &.active {
    line-height: 40px;
    height: auto;
  }
}
.el-textarea.el-input--medium{
  textarea.el-textarea__inner{
    height: 100% !important;
  }
}
</style>

