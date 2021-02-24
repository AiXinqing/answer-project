// 页面高度
export const PAGE_HEIGHT = 1000

//页面布局
export const LAYOUT_COLUMNS = [
  { id: 1, content: '一栏', pid: 'A4' },
  { id: 2, content: '两栏', pid: 'A3' },
  { id: 3, content: '三栏', pid: 'A3' },
]

export const LAYOUT_SIZE = [
  { id: 'A3', content: 'A3/B4/8K纸' },
  { id: 'A4', content: 'A4/B5纸' },
]

// 标题设置
export const TITLE_SUDENTINFO = [
    {
      // 学生信息
      name: '考号',
      checked: true
    },
    {
      name: '学校',
      checked: false
    },
    {
      name: '姓名',
      checked: false
    },
    {
      name: '班级',
      checked: true
    },
    {
      name: '学号',
      checked: false
    }
]

//注意事项
export const PRECAUTIONS = [
  '答题前请将姓名、班级、考场、座号和准考证号填写清楚。',
  '客观题答题,必须使用2B铅笔填涂,修改时用橡皮擦干净。',
  '主观题必须使用黑色签字笔书写。',
  '必须在题号对应的答题区域内作答,超出答题区域书写无效。',
  '保持答卷清洁完整。'
]


// 大题号
export const QUESTION_NUMBERS = [
  '一', '二', '三', '四', '五',
  '六', '七', '八', '九', '十',
  '十一', '十二', '十三', '十四', '十五',
  '十六', '十七', '十八', '十九', '二十',
  '二十一', '二十二', '二十三', '二十四'
]

// 客观题题型
export const OBJECTIVE_QUESTION = [
    { label: '单选框', name: 'singleChoice' },
    { label: '多选框', name: 'checkChoice' },
    { label: '判断题', name: 'judgmentChoice'},
]

// 客观题选项
export const LETTER_LIST = ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'J', 'K']