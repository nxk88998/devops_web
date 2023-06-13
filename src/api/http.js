import axios from "axios";
import {ElMessage} from 'element-plus'

const instance = axios.create({
    //baseURL: ' http://192.168.233.1:8000/api',
     baseURL: "http://192.168.43.197:9001/api",
    timeout: 5000
});

// 请求拦截器
instance.interceptors.request.use(config => {
    // 每次请求API携带Token
    // const token = window.sessionStorage.getItem('token');
    const token = window.localStorage.getItem('token');
    if(token) {
        config.headers = {
            'Authorization': 'Token ' + token
        }
    }
    return config
}, error => {
    return Promise.reject(error)
});

// 响应拦截器
instance.interceptors.response.use(response => {
    if(response.data.code !== 200) {
        ElMessage.error(response.data.msg);
    }
    return response
}, error => {
    // 处理响应错误（catch）
    ElMessage.error('连接服务器失败，请稍后再试！');
    return Promise.reject(error)
});//

export default instance