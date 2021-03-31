<template>
  <div class="exam_wapper">

  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: []
      }
    },
    methods: {
      name() {

      }
    },
    mounted () {
      this.$fetch(this.URL.setLogin, {input:''})
      .then((res) => {
          console.log(res)
      })
    },
  }
</script>

<style lang="less">
  .exam_wapper{
    width: 1200px;
    position: relative;
    left: 50%;
    margin: 5px;
    transform: translateX(-50%);
    height: 100%;
  }
</style>