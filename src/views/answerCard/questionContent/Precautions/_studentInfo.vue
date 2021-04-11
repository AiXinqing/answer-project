<template>
  <el-row class="TestTitle">
    <el-col
      v-for="(item, i) in studentInfoArr"
      :key="i"
      :span="4"
      class="title-item"
    >
      <span>{{ item.name }}</span>
      <span v-if="i == studentInfoArr.length - 1">
        <span
          v-show="!previewIs"
          class="titke-edit"
          @click="editStudentInfoColumn"
          >编辑</span
        >
      </span>
      <span v-else />
    </el-col>
  </el-row>
</template>

<script>
export default {
  components: {},
  props: {
    previewIs: {
      type: Boolean,
      default: false,
    },
    titleInfo:{
      type:Array,
      default: () => []
    }
  },
  data() {
    return {
      studentInfoList: [],
    }
  },
  computed: {
    studentInfoArr() {
      return this.titleInfo.filter((item) => item.checked == true)
    },
  },
  watch: {
    titleInfo(val) {
      this.studentInfoList = JSON.parse(JSON.stringify(val))
    },
  },
  mounted() {
    this.studentInfoList = JSON.parse(JSON.stringify(this.titleInfo))
  },
  methods: {
    editStudentInfoColumn() {
      this.$emit('hanldeStudent', this.studentInfoList)
    },
  },
}
</script>

<style lang="scss" scoped></style>
