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
  </el-row>
</template>

<script>
import { mapState } from 'vuex'
export default {
  components: {},
  // props: {
  //   studentData: {
  //     type: Array,
  //     default: () => [],
  //   },
  // },
  data() {
    return {
      dataInfo: this.studentData,
    }
  },
  computed: {
    ...mapState('answerSheetTitle', ['precautions']),
    checkedInfo() {
      return this.precautions.studentInfo.filter((item) => item.checked)
    },
    studentData() {
      return this.precautions.studentInfo
    },
  },
  methods: {
    editStudentInfoColumn() {
      this.$emit('hanldeStudent', this.precautions.studentInfo)
    },
  },
}
</script>

<style lang="scss" scoped></style>
