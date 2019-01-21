import Vue from "vue"

import {
  Tooltip,
  Select,
  Option,
  Switch,
  DatePicker,
  Dialog,
  Button,
  Container,
  Aside,
  Header,
  Footer,
  Main,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
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
  Pagination,
  Loading,
  Notification,
  MessageBox,
  Collapse,
  CollapseItem,
  Tag,
  Tree,
  TimeSelect
} from "element-ui"

import lang from "element-ui/lib/locale/lang/en"
import locale from "element-ui/lib/locale"

locale.use(lang)

Vue.use(Tooltip)
Vue.use(Select)
Vue.use(Option)
Vue.use(Switch)
Vue.use(DatePicker)
Vue.use(Dialog)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Footer)
Vue.use(Main)
Vue.use(Button)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
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
Vue.use(Loading.directive)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(TimeSelect)

Vue.prototype.$loading = Loading.service
Vue.prototype.$notify = Notification
Vue.prototype.$confirm = MessageBox.confirm
