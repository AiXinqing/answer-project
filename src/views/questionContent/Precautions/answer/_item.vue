<template>
<el-collapse-item>
  <template slot="title">
  <div class="space_group_list">
      <span class="space_group_title">{{data.topic}}</span>
      <el-input v-model.number="data.score" size="mini" class="space_group_item"   onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
      <span> 分</span>
      <span class="add_groupTopic" @click.stop="addSubAnswerItem()">+ 添加小题</span>
      <i class="el-icon-del " @click.stop="delAnswerItem">-</i>
  </div>
  </template>

  <el-collapse class="sub_item" v-show="childGroup.length > 0">
    <answer-sub-item
      v-for="(item,i) in childGroup"
      :key="i"
      :sub-child-data="item"
      @pre-edit-last-answer-item="preEditLastAnswerItem"
      @pre-edit-points-answer-group="preEditPointsAnswerGroup"
      @pre-edit-points-item="preEditPointsItem"
    />
  </el-collapse>

</el-collapse-item>
</template>

<script>
import answerSubItem from './_subItem'
import { mapMutations } from 'vuex'
export default {
  props: {
    childData: {
      type: Object,
      default: () => { }
    },
  },
  components: {
    answerSubItem,
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
      'set_AlreadyTopics',
      'del_AlreadyTopics'
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
      this.set_AlreadyTopics([{ ...datas, childGroup: temporaryArr }]) // 更新此题数据
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
      this.del_AlreadyTopics([this.data])
    },
    preEditPointsItem (obj, isDel = false) {
      // 末尾题
      this.$emit('pre-edit-points-item', obj, isDel)
    }
  },
}
</script>

<style lang="less" scoped>
.sub_item {
  width: 96%;
  margin-left: 2%;
}
.space_group_item {
  margin-left: 38%;
}
.el-collapse {
  border-bottom: none;
}
</style>
