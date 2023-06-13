import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus' // 导入ElementUI和CSS
import 'element-plus/dist/index.css'
// 统一导入el-icon图标
import * as ElIconModules from '@element-plus/icons-vue'
import axios from "./api/http"; // 重新封装的axios

const app = createApp(App);
// 统一注册el-icon图标
for(let iconName in ElIconModules){
    app.component(iconName,ElIconModules[iconName])
}

//解决部分代码英文问题
import locale from 'element-plus/lib/locale/lang/zh-cn'
app.use(ElementPlus,{locale});


app.use(ElementPlus); // 注册ElmenetUI
app.config.globalProperties.$http = axios;  // 注册axios为全局范围可使用
app.use(router).mount('#app');
