<template>
  <div class="big-item">
    <span>几选几:</span>
    <el-input v-model.number="data.choices" size="mini" @blur="groupTopicHanlde"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span> 选 </span>
    <el-input v-model.number="data.select" size="mini" @blur="groupTopicHanlde" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span> ;每题 </span>
    <el-input v-model.number="data.score" size="mini" @blur="groupTopicHanlde" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span> 分;题号 </span>
    <el-input v-model.number="data.start" size="mini" @blur="groupTopicHanlde" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span> 到</span>
    <el-input v-model.number="data.end" size="mini" disabled @blur="groupTopicHanlde" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    formData: {
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
    ...mapState('questionType', [
      'subTopic_number',
    ]),
    tabStatusVal () {
      const { choices, select } = this.data

      return choices != '' && select != '' && choices <= select ? '应选题目数不能大于或等于题目可选数' : ''
    },
    tabStatus () {
      const { choices, select, score, start } = this.data
      return choices != '' && select != '' && choices <= select ? true :
        choices == '' || select == '' || score == '' || start == '' ? true : false
    }
  },
  watch: {
    formData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.formData
        }
        if (this.data.end == '' || this.data.end == null) {
          this.data.start = this.subTopic_number
        }
      }
    }
  },
  methods: {
    ...mapMutations('questionType', [
      'subTopic_already_add',
      'subTopic_already_clean',
      'subTopic_number_calculate',
    ]),
    groupTopicHanlde () {
      const { choices, start, id, score } = this.data
      // 报错信息
      this.$emit('hanlde-status', this.tabStatusVal)
      let topicList = []
      this.data.end = choices + start - 1
      let scoreTotal = 0

      for (let i = start; i <= this.data.end; i++) {
        let obj = {
          pid: id,
          id: `optional_${+new Date()}_${i}`,
          topic: i,
          score: score,
        }
        scoreTotal += score // 此题总分
        topicList.push(obj)
      }


      if (!this.tabStatus) {
        // console.log(this.data.childGroup)
        if (this.data.childGroup.length > 0) {
          console.log(this.data.childGroup)
          this.data.childGroup.forEach(item => {
            this.subTopic_already_clean(item.id)
          })
          //
        }
        let objL = JSON.parse(JSON.stringify({ ...this.data, childGroup: [] }))
        this.subTopic_already_add(topicList) // 存数组 scoreTotal
        this.$emit('pre-optional-data', { ...objL, childGroup: topicList, scoreTotal: scoreTotal })
        this.subTopic_number_calculate()
      }
    }
  },
}
</script>
