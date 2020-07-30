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
        ><span class="titke-edit" @click="editStudentInfoColumn"
          >编辑</span
        ></span
      >
      <span v-else />
    </el-col>
    <column-dialog />
  </el-row>
</template>

<script>
import columnDialog from '../../dialog/_studentColumnDialog'
export default {
  components: {
    columnDialog,
  },
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
  methods: {
    editStudentInfoColumn() {},
  },
}
</script>

<style lang="scss" scoped></style>
