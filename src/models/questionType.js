export function question_objective(question,pageWidth,pageLayout){
  // 客观题
  let { rowGroup, titleH } = question.height
  //题型分组
  let RowArr = [],columnArr = [],widthSum = 0,
    max = pageWidth

      rowGroup.forEach(question => {
        let maxWidth = question.map(subtopic => subtopic.width)
          .reduce((a, b) => b > a ? b : a)
          widthSum += maxWidth
          if(widthSum < max){
              columnArr.push(question)
            }else{
              RowArr.push(columnArr)
              widthSum = maxWidth
              columnArr = []
              columnArr.push(question)
            }
      })

      if(columnArr.length > 0){
          RowArr.push(columnArr)
      }

  let lastHeight = RowArr[RowArr.length -1]
    .map(temp => temp.length * 21 + 10)
    .reduce((a, b) => b > a ? b : a)

  let less = lastHeight >= question.rowHeight ? 0 : question.rowHeight - lastHeight


      //计算内容高度
  let heights = titleH + RowArr.length * question.rowHeight - less
      return {...question,height:heights,showData:RowArr,content:{...question.content,pageLayout:pageLayout}}
}


export function question_language (question, latticeNum, latticeWidth) {
  // 作文（语文）
    const { totalWordCount,spacing} = question.content
    let rows = Math.ceil(totalWordCount / latticeNum) // .toFixed(2)

    let rowHeight = latticeWidth + spacing.value
        rowHeight = Number(rowHeight.toFixed(2))

    let height = rows * rowHeight + question.MarginHeight + question.heightTitle + question.rowTitle

      height = Number(height.toFixed(2))

    return {
      ...question,
      height: height,
      rowHeight: rowHeight,
      lattice:latticeNum,
      rowWidth: latticeWidth,
      totalRow:Math.ceil(totalWordCount/latticeNum)
    }
}