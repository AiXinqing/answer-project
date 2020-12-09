"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _App = _interopRequireDefault(require("./App.vue"));

var _router = _interopRequireDefault(require("./router"));

var _store = _interopRequireDefault(require("./store"));

require("./plugins/element-up.js");

var _elementUi = _interopRequireDefault(require("element-ui"));

var _index = _interopRequireDefault(require("./components/index"));

var _vueUeditorWrap = _interopRequireDefault(require("vue-ueditor-wrap"));

require("./components/tinymce/skins/ui/oxide/skin.min.css");

require("./components/tinymce/skins/ui/oxide/content.min.css");

require("./components/tinymce/skins/ui/oxide/content.inline.min.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import VueQuillEditor from 'vue-quill-editor'
// import TinyVue from ''
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
//样式
// Vue.use(VueQuillEditor)
_vue["default"].component('vue-ueditor-wrap', _vueUeditorWrap["default"]);

_vue["default"].config.productionTip = false;

_vue["default"].use(_index["default"]);

_vue["default"].use(_elementUi["default"], {
  size: 'medium'
});

new _vue["default"]({
  router: _router["default"],
  store: _store["default"],
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount('#app');