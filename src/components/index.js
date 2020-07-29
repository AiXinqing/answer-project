import {
  Loading,
  MessageBox,
  Message
} from 'element-ui'
import HjDialog from './dialog'
import HjButton from './button'

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

  }
}