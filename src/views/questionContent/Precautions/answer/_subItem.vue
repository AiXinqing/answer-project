<template>
<el-collapse-item>
  <template slot="title">
  <div class="space_group_list">
      <span class="space_group_title">{{data.topic}}</span>
      <el-input v-model.number="data.score" size="mini" class="space_group_items"   onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
      <span> 分</span>
      <span class="add_groupTopic" @click.stop="addLastAnswerItem">+ 添加小题</span>
      <i class="el-icon-del " >-</i>
  </div>
  </template>
  <el-collapse class="sub_item" v-show="childGroup.length > 0">
    <answer-last-item
      v-for="(item,i) in childGroup"
      :key="i"
      :last-item-data="item"
    />
  </el-collapse>
</el-collapse-item>
</template>

<script>
import answerLastItem from './_lastItem'
export default {
  props: {
    subChildData: {
      type: Object,
      default: () => { }
    },
  },
  components: {
    answerLastItem,
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
    subChildData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.subChildData
        }
        if (this.data.childGroup.length > 0) {
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
    addLastAnswerItem () {
      let temporaryArr = JSON.parse(JSON.stringify(this.data.childGroup)) || []
      let datas = this.data
      let long = temporaryArr.length + 1
      let subObj = {
        ...datas,
        fid: datas.pid,
        sid: datas.fid,
        pid: datas.id,
        id: `answerLast_${+new Date()}_${datas.topic}_${long}`,
        topic: `${datas.topic}.${long}`,
        score: 1
      }
      temporaryArr.push({ ...subObj, childGroup: [] })

      this.$emit('add-last-answer-item', { ...datas, childGroup: temporaryArr })
      // this.set_AlreadyTopics([{ ...datas, childGroup: temporaryArr }]) // 更新此题数据
    }
  },
}
</script>

<style lang="less">
.space_group_items {
  margin-left: 36%;
}
.space_group_list {
  margin: 10px 0;
  width: 100%;
}
.el-collapse {
  border-bottom: none;
}
</style>



