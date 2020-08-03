<template>
  <div class="big-item">
    <template v-if="activeNameItem == 'singleBox'">
      <span>从</span>
      <el-input v-model="itemStart" size="mini" />
      <span>题到</span>
      <el-input v-model="itemEnd" size="mini" />
      <span>题,每题</span>
      <el-input v-model="itemScore" size="mini" />
      <span>分,每题</span>
      <el-input v-model="itemSelect" size="mini" />
      <span>个选项</span>
      <i class="el-icon-delete" @click="hanldeDel(itemData.id,activeNameItem)"></i>
    </template>
    <template v-if="activeNameItem == 'checkbox'">
      <span>从</span>
      <el-input v-model="itemStart" size="mini" />
      <span>题到</span>
      <el-input v-model="itemEnd" size="mini" />
      <span>题,每题</span>
      <el-input v-model="itemScore" size="mini" />
      <span>分,少选</span>
      <el-input v-model="itemLessScore" size="mini" />
      <span>得分,每题</span>
      <el-input v-model="itemSelect" size="mini" />
      <span>个选项</span>
      <i class="el-icon-delete"></i>
      <i class="el-icon-delete" @click="hanldeDel(itemData.id,activeNameItem)"></i>
    </template>
    <template v-if="activeNameItem == 'judgment'">
      <span>从</span>
      <el-input v-model="itemStart" size="mini" />
      <span>题到</span>
      <el-input v-model="itemEnd" size="mini" />
      <span>题,每题</span>
      <el-input v-model="itemScore" size="mini" />
      <span>分,每题</span>
      <el-input v-model="itemSelect" disabled size="mini" />
      <span>个选项</span>
      <i class="el-icon-delete" @click="hanldeDel(itemData.id,activeNameItem)"></i>
    </template>
  </div>
</template>

<script>
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
      itemStart: this.itemData.start,
      itemEnd: this.itemData.end,
      itemScore: this.itemData.score,
      itemLessScore: this.itemData.lessScore,
      itemSelect: this.itemData.select,
    }
  },
  methods: {
    hanldeDel (id, type) {
      console.log(type)
      console.log(id)
      const obj = { id: id, type: type }
      this.$emit('hanlde-del', obj)
    }
  },
}
</script>

<style lang="scss" scoped>
</style>