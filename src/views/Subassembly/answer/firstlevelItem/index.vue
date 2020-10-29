<template>
<div class="answer_group">
  <div class="space_group_list">
      <span class="space_group_title">{{data.topic}}</span>
      <el-input v-model.number="data.score" size="mini" class="space_group_item"   onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
      <span> 分</span>
      <span class="add_groupTopic" @click.stop="addSubAnswerItem()">+ 添加小题</span>
      <i class="el-icon-del " @click.stop="delAnswerItem">-</i>
  </div>
  <div class="sub_item" v-show="childGroup.length > 0">
    <level-two-item
      v-for="(item,i) in childGroup"
      :key="i"
      :sub-child-data="item"
      @pre-edit-last-answer-item="preEditLastAnswerItem"
      @pre-edit-points-answer-group="preEditPointsAnswerGroup"
      @pre-edit-points-item="preEditPointsItem"
    />
  </div>
</div>
</template>

<script>
import levelTwoItem from '../levelTwoItem'
import { mapMutations } from 'vuex'
export default {
  components: {
    levelTwoItem,
  },
  props: {
    childData: {
      type: Object,
      default: () => { }
    },
  },
  data () {
    return {
      data: {}
    }
  },
  computed: {
    childGroup () {
      return this.data.childGroup
    }
  },
  watch: {
    childData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.childData
        }
        if (this.data.childGroup.length > 0) {
          console.log(this.data)
          let sum = 0
          this.data.childGroup.forEach(item => {
            sum += item.score
          })
          this.data.score = sum
        }
      }
    }
  },
  methods: {
    ...mapMutations('questionType', [
      'subTopic_number_calculate_already',
      'subTopic_already_del'
    ]),
    addSubAnswerItem () {
      let temporaryArr = JSON.parse(JSON.stringify(this.data.childGroup)) || []
      let datas = this.data
      let long = temporaryArr.length + 1
      let subObj = {
        ...datas,
        fid: datas.pid,
        pid: datas.id,
        id: `answerSub_${+new Date()}_${datas.topic}_${long}`,
        topic: `${datas.topic}.${long}`,
        score: 1
      }
      temporaryArr.push({ ...subObj, childGroup: [] })


      this.$emit('pre-edit-sub-answer-item', { ...datas, childGroup: temporaryArr })
      this.subTopic_number_calculate_already([{ ...datas, childGroup: temporaryArr }]) // 更新此题数据
    },
    preEditLastAnswerItem (obj, isDel) {
      // 新增小题下小题
      this.$emit('pre-edit-last-answer-item', obj, isDel)
    },
    preEditPointsAnswerGroup (obj, isDel = false) {
      // 添加小题下的小题
      this.$emit('pre-edit-points-answer-group', obj, isDel)
    },
    delAnswerItem () {
      this.$emit('pre-edit-sub-answer-item', this.data, true)
      this.subTopic_already_del([this.data])
    },
    preEditPointsItem (obj, isDel = false) {
      // 末尾题
      this.$emit('pre-edit-points-item', obj, isDel)
    }
  },
}
</script>

<style lang="less">
  .question-group{
    .answer_group{
      align-items: center;
      line-height: 48px;
      background-color: #FFF;
      color: #303133;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: border-bottom-color .3s;
      outline: 0;
      .space_group_list{
        border-bottom: 1px solid #ddd;
        position: relative;
      }

      .points_list{
        border-bottom: 1px solid #ddd;
      }
    }
  }
</style>


<style lang="less" scoped>

.space_group_item {
  margin-left: 38%;
}
.el-collapse {
  border-bottom: none;
}

.sub_item{

  .answer-sub-group{
    text-indent:2%;
    background-color: #e4e5e7; // rgba(238, 238, 238, 0.8)
    .add_groupTopic{
      right: 50px;
    }
  }
}
</style>
