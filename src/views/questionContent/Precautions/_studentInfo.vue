<template>
  <el-row class="TestTitle">
    <el-col
      v-for="(item, i) in checkedInfo"
      :key="i"
      :span="4"
      class="title-item"
    >
      <span>{{ item.name }}</span>
      <span v-if="i == checkedInfo.length - 1"
        ><span class="titke-edit">编辑</span></span
      >
      <span v-else />
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    studentData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    checkedInfo() {
      return this.studentData.filter((item) => item.checked)
    },
  },
}
</script>

<style lang="scss" scoped></style>
