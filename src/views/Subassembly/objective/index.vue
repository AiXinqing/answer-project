<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="hanldeClick" class="card_top">
    <el-tab-pane
      v-for="(item, i) in tabPaneData"
      :key="i"
      :label="item.label"
      :name="item.name"
      :disabled="isdisabled"
    >
    <div class="big-question-box">
      <component
      :is="choice"
      />
    </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  export default {
    props: {
      tabPaneData: {
        type: Array,
        default: () => [],
      },
      groupData: {
        type: Object,
        default: () => { },
      },
      editId: {
        teyp: Number,
        default: null
      }
    },
    data() {
      return {
        activeName: {}
      }
    },
    computed: {
      choice() {
        return ''
      }
    },
    methods: {
      hanldeClick() {

      }
    },
  }
</script>

<style lang="scss" scoped>

</style>