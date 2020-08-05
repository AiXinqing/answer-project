<template>
  <div class="question-info">
    <div class="question-title">
      <span>一.</span>
      <span>选择题</span>
      <span>(3分)</span>
    </div>
    <div class="question_array">
      <div class="question-groups">
        <div class="group_item">
          <span>1</span>
          <span class="sketch">
            <span>[<i>A</i>]</span>
            <span>[<i>B</i>]</span>
            <span>[<i>C</i>]</span>
            <span>[<i>D</i>]</span>
          </span>
        </div>
        <div class="group_item">
          <span>2</span>
          <span class="sketch">
            <span>[<i>A</i>]</span>
            <span>[<i>B</i>]</span>
            <span>[<i>C</i>]</span>
            <span>[<i>D</i>]</span>
          </span>
        </div>
        <div class="group_item">
          <span>3</span>
          <span class="sketch">
            <span>[<i>A</i>]</span>
            <span>[<i>B</i>]</span>
            <span>[<i>C</i>]</span>
            <span>[<i>D</i>]</span>
          </span>
        </div>
        <div class="group_item">
          <span>4</span>
          <span class="sketch">
            <span>[<i>A</i>]</span>
            <span>[<i>B</i>]</span>
            <span>[<i>C</i>]</span>
            <span>[<i>D</i>]</span>
          </span>
        </div>
        <div class="group_item">
          <span>5</span>
          <span class="sketch">
            <span>[<i>A</i>]</span>
            <span>[<i>B</i>]</span>
            <span>[<i>C</i>]</span>
            <span>[<i>D</i>]</span>
          </span>
        </div>
      </div>
      <div class="question-groups">
        <div class="group_item">
          <span>6</span>
          <span class="sketch">
            <span>[<i>A</i>]</span>
            <span>[<i>B</i>]</span>
            <span>[<i>C</i>]</span>
            <span>[<i>D</i>]</span>
          </span>
        </div>
        <div class="group_item">
          <span>7</span>
          <span class="sketch">
            <span>[<i>A</i>]</span>
            <span>[<i>B</i>]</span>
            <span>[<i>C</i>]</span>
            <span>[<i>D</i>]</span>
          </span>
        </div>
        <div class="group_item">
          <span>8</span>
          <span class="sketch">
            <span>[<i>A</i>]</span>
            <span>[<i>B</i>]</span>
            <span>[<i>C</i>]</span>
            <span>[<i>D</i>]</span>
          </span>
        </div>
        <div class="group_item">
          <span>9</span>
          <span class="sketch">
            <span>[<i>A</i>]</span>
            <span>[<i>B</i>]</span>
            <span>[<i>C</i>]</span>
            <span>[<i>D</i>]</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.question-title {
  margin-bottom: 10px;
  span {
    color: @font-333;
  }
}
.question_array {
  display: flex;
  .question-groups {
    margin-right: 10px;
  }
  .group_item {
    display: table-header-group;
    height: 20px;
    line-height: 20px;
    span {
      font-style: 12px;
    }
    span.sketch {
      i {
        font-style: normal;
        padding: 0 1px;
      }
      span {
        position: relative;
        top: -2px;
        font-size: 12px;
        margin-left: 5px;
      }
    }
  }
}
</style>
