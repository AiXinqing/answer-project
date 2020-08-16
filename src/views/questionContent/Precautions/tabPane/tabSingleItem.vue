<template>
  <div class="big-item">
    <span>从</span>
    <!-- @keyup.native.stop="isVerifi" -->
    <el-input v-model.number="data.start" size="mini" @blur="singleBoxHanlde" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span>题到</span>
    <el-input v-model.number="data.end" size="mini" @blur="singleBoxHanlde" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span>题,每题</span>
    <el-input v-model.number="data.score" size="mini" @blur="singleBoxHanlde" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span>分,每题</span>
    <el-input v-model.number="data.select" size="mini" @blur="singleBoxHanlde"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"/>
    <span>个选项</span>
    <i class="el-icon-delete" @click="hanldeDel(data.id,activeNameItem)" ></i>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  props: {
    itemData: {
      type: Object,
      default: () => { }
    },
    activeNameItem: {
      type: String,
      default: 'singleBox'
    }
  },
  data () {
    return {
      data: {}
    }
  },
  computed: {
    ...mapState('questionType', [
      'currentQuestion',
      'AlreadyTopics'
    ]),
    tabStatusVal () {
      let itemStart = this.data.start || 0
      let itemEnd = this.data.end || null
      let itemScore = this.data.score || 0
      let AlreadyTopics = this.AlreadyTopics
      let strStart = ''
      let strEnd = ''
      if (AlreadyTopics.length > 0) {
        let numStart = AlreadyTopics.findIndex(item => item.topic == itemStart)
        let numEnd = AlreadyTopics.findIndex(item => item.topic == itemEnd)


        if (numStart > -1 &&  AlreadyTopics[numStart].pid != this.data.id) {
          strStart = `${itemStart}题已经存在，请勿重复添加`
        }
        if (numEnd > -1 &&  AlreadyTopics[numEnd].pid != this.data.id) {
          strEnd = `${itemEnd}题已经存在，请勿重复添加`
        }
      }
      return itemStart == 0 ? '开始题号必须大于0' :
        itemEnd == 0 && itemEnd != null ? '结束题号必须大于0' :
          itemStart == 0 && itemEnd != null ? '开始题号不能大于结束题号' :
            itemStart > itemEnd && itemEnd != null ? '开始题号不能大于结束题号' :
              itemStart != 0 && itemEnd != null && itemScore == 0 ? '分数不能为空' :
                strStart != '' ? strStart :
                  strEnd != '' ? strStart : ''
    },
    tabStatus () {
      let itemStart = this.data.start || 0
      let itemEnd = this.data.end || null
      let itemScore = this.data.score || 0
      let AlreadyTopics = this.AlreadyTopics
      let strStart = ''
      let strEnd = ''

      if (AlreadyTopics.length > 0) {
        let numStart = AlreadyTopics.findIndex(item => item.topic == itemStart)
        let numEnd = AlreadyTopics.findIndex(item => item.topic == itemEnd)

       if (numStart > -1 &&  AlreadyTopics[numStart].pid != this.data.id) {
          strStart = `${itemStart}题已经存在，请勿重复添加`
        }
        if (numEnd > -1 &&  AlreadyTopics[numEnd].pid != this.data.id) {
          strEnd = `${itemEnd}题已经存在，请勿重复添加`
        }
      }
      return itemStart == 0 && itemEnd != null ? true :
        itemEnd < itemStart && itemEnd != null ? true :
          itemEnd != null && itemScore == 0 ? true :
            itemStart != 0 && itemEnd != null && itemScore == 0 ? true :
              strStart != '' ? true :
                strEnd != '' ? true : false;
    },
  },
  watch: {
    itemData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.itemData
        }
        if (this.data.end == '' || this.data.end == null) {
          this.data.start = this.currentQuestion
        }
      }
    }
  },
  mounted () {

  },
  methods: {
    ...mapMutations('questionType', [
      'set_currentQuestion',
      'Add_AlreadyTopics',
    ]),
    hanldeDel (id, type) {
      // 删除分段题组
      const obj = { id: id, type: type }
      this.$emit('hanlde-del', obj)
    },
    singleBoxHanlde () {

      // 新增题组-小题详情
      const StatusObj = {
        val: this.tabStatusVal,
        status: this.tabStatus
      }
      this.$emit('hanlde-status', StatusObj)

      if (!this.tabStatus) {
        let subtopicArr = []

        for (let index = this.data.start; index <= this.data.end; index++) {
          let subtopic = {
            ...this.data,
            pid: this.data.id,
            id: 'single_' + index,
            topic: index
          }
          subtopicArr.push(subtopic)
        }
        let itemObj = {
          type: 'singleBox',
          data: {
            ...this.data,
            start: parseInt(this.data.start),
            id: this.data.id,
            childGroup: subtopicArr
          }
        }

        // 弹框临时小题数
        const temporaryArr = subtopicArr.map(item => ({ ...item, subtopic: 1 }))
        this.Add_AlreadyTopics(temporaryArr)
        // temporaryArr
        this.$emit('hanlde-add-group-question', itemObj)
        this.set_currentQuestion()
      }
    },
    isVerifi (e) {
      let val = e.target.value
      val = val.replace(/[^\d.]/g, '');  //清除“数字”和“.”以外的字符
      val = val.replace(/^\./g, '');  //验证第一个字符是数字而不是.
      val = val.replace(/\.{2,}/g, '.'); //只保留第一个. 清除多余的.
      val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
      e.target.value = val
    }
  },
}
</script>

<style lang="less">
#pane-singleBox,
#pane-checkbox,
#pane-judgment {
  input {
    padding: 0 2px !important;
    text-align: center;
  }
}
</style>