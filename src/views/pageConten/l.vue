<template>
  <div>

  </div>
</template>

<script>
  let curRect = this.preliminaryQuestion(rect, avalibleHeight)

  // 剩余高度是否进行分页
  if(!curRect.pagination){

    // 客观题 填空题
    if(rect.showData && rect.showData.length){
      backup = {
        showData:itemObj.showData.splice(0, curRect.availableRow),
        first:true
      }
    }

    // 选作题
    if(rect.questionType == 'optionalQuestion' || rect.questionType == 'answerQuestion'){
      backup = {
        rows:curRect.availableRow > rect.content.rows ? rect.content.rows : curRect.availableRow
      }
    }

    currentPage.rects.push({
      ...rect,
      castHeight:curRect.height,
      ...backup
    })
  }

  results.push(currentPage.rects) // 增加一页
  resetCurrentPage()



  // 判断当前rect高度能分几页----------------------------------------
  let height = rect.height - curRect.height


  //剩余高度超过一页高度
  while (height > this.page_height) {

    let avalibleHeight =  this.page_height - 20
    let curRects = this.preliminaryQuestion(rect, avalibleHeight,false)

    if(rect.showData && rect.showData.length){
      // 切割数组
      backup = {
        showData:itemObj.showData.splice(0, curRects.availableRow),
      }
    }

    // 选作题
    if(rect.questionType == 'optionalQuestion'){
      let {rows} = rect.content
      backup = {
        rows:rows - curRect.availableRow >= 0 ? rows - curRect.availableRow : 0
      }
    }

    results.push([{
      ...rect,
      castHeight: curRects.height,
      first:false,
      ...backup
    }]);

    // 减去一页内容高度
    height -= curRects.height - rect.MarginHeight
  }

  //最后剩余高度---------------------------------------------------
  if(rect.showData && rect.showData.length){
      backup = {
        showData: itemObj.showData,
      }
  }

  //剩余高度增加 rect.MarginHeight 高度
  currentPage.height = height + rect.MarginHeight

  // 选作题
  if(rect.questionType == 'optionalQuestion'){
    let {rows} = rect.content
    backup = {
      rows:curRect.availableRow < 0  ? rows :  rows - curRect.availableRow
    }
    currentPage.height = height
  }

  currentPage.rects.push({
    ...rect,
    castHeight: currentPage.height,
    first:curRect.pagination,
    ...backup
  })


  preliminaryQuestion(question,avalibleHeight,initial = true){
      // 变量
      const { MarginHeight,heightTitle,rowHeight } = question
      let increase = question.questionType == 'optionalQuestion' && question.first ? question.rowTitle : 0

      // 题型内容边框高度
      const questionRimHeight = initial ? MarginHeight + heightTitle :
            question.questionType == 'compositionLanguage' ? 0 : MarginHeight

      // 除去边框高度剩余可用高度
      const RemainingHeight = avalibleHeight - (questionRimHeight + increase)


      // 剩余高度可容纳内容高度行数
      let availableRow = Math.floor(RemainingHeight / rowHeight)
          availableRow = availableRow > 0 ? 0 : availableRow

      // 剩余高度可容纳内容高度
      const current_height = availableRow * rowHeight  + questionRimHeight + increase

      // 返回剩余值
      const parameter = {
        availableRow:availableRow,
        height:current_height >= (questionRimHeight + rowHeight) ? current_height : 0,
        pagination:current_height >= (questionRimHeight + rowHeight) ? false : true,
      }

      return parameter
    }
</script>

<style lang="scss" scoped>

</style>