import {
  Loading,
  MessageBox,
  Message,
  // Table
} from 'element-ui'
import HjDialog from './elementUi/dialog.vue'
import HjButton from './elementUi/button'
import HjSelect from './elementUi/select'
import HjTabs from './elementUi/tabs'
import stretch from './stretch'
import checkbox from './elementUi/checkbox'
import input from './elementUi/input'
import examButton from './elementUi/examButton'
import table from './elementUi/table'
import examTable from './elementUi/table/index'
import UmyTable from './umyUiTable/index'

// 解决方案两个:1.直接让Vue.component...这段注册代码早于Vue.use(ElementUI) 2.执行 delete Table._Ctor后再注册
// delete Table._Ctor


export default {
  install: (Vue) => {
    Vue.use(Loading)
    Vue.prototype.$msgbox = MessageBox;
    Vue.prototype.$message = Message;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$prompt = MessageBox.prompt;
    // Vue.prototype.$notify = Notification;    //IE兼容
    Vue.component('hj-dialog', HjDialog)
    Vue.component('hj-button', HjButton)
    Vue.component('hj-select', HjSelect)
    Vue.component('hj-tabs', HjTabs)
    Vue.component('hj-stretch', stretch)
    Vue.component('hj-checkbox', checkbox)
    Vue.component('hj-input', input)
    Vue.component('exam-button', examButton)
    Vue.component('hj-table', table)
    Vue.component('exam-table', examTable)
    Vue.component('umy-table', UmyTable)
    // Vue.component('quill-editor', quillEditor)
    // Vue.component(
    //   Table.name,
    //   function(resolve){
    //     const bindEvents = Table.methods.bindEvents
    //     Object.assign(Table.methods,{
    //       bindEvents() {
    //         bindEvents.call(this)
    //         this.bodyWrapper.addEventListener('mousewheel', this.handleBodyMousewheel)
    //       },
    //       handleBodyMousewheel(event) {
    //         const fixedWrapper = this.$refs.fixedWrapper
    //         if (fixedWrapper) {
    //           const fixedBodyWrapper = fixedWrapper.querySelector('.el-table__fixed-body-wrapper')
    //           if (fixedBodyWrapper) {
    //             event.preventDefault()
    //             fixedBodyWrapper.scrollBy({ left: event.deltaX, top: event.deltaY })
    //             this.$refs.bodyWrapper.scrollBy({ left: event.deltaX, top: event.deltaY })
    //           }
    //         }
    //       }
    //     })
    //     resolve(Table)
    //   }
    // )

  }
}