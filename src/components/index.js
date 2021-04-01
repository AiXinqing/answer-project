import {
  Loading,
  MessageBox,
  Message
} from 'element-ui'
import HjDialog from './elementUi/dialog.vue'
import HjButton from './elementUi/button'
import HjSelect from './elementUi/select'
import HjTabs from './elementUi/tabs'
import stretch from './stretch'
import checkbox from './elementUi/checkbox'
import input from './elementUi/input'
import examButton from './elementUi/examButton'


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
    // Vue.component('quill-editor', quillEditor)

  }
}