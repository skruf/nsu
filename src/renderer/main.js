import Vue from "vue"
import axios from "axios"
import "ionicons/dist/css/ionicons.min.css"
import "./design/index.styl"
import {
  Button,
  Container,
  Aside,
  Header,
  Main,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  TabPane,
  Form,
  FormItem,
  Input,
  Table,
  TableColumn,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination
} from "element-ui"

import App from "./App"
import router from "./router"
import store from "./store"

Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)
Vue.use(Button)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Pagination)

if(!process.env.IS_WEB) {
  Vue.use(require("vue-electron"))
}

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: "<App/>"
}).$mount("#app")
