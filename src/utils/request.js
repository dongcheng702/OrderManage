import axios from 'axios';

// 创建一个 axios 实例
const instance = axios.create({
    baseURL: 'http://localhost:8888', // 你的 API 基础 URL
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
instance.interceptors.request.use(
    config => {
        // 在请求发送之前可以做一些处理，比如添加 token
        // config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

// 封装的 GET 请求
export const get = (url, params) => {
    return instance.get(url, {
        params
    });
};

// 封装的 POST 请求
export const post = (url, data) => {
    return instance.post(url, data);
};

const request = {
    get,
    post
};


// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
// request.interceptors.request.use(config => {
//     config.headers['Content-Type'] = 'application/json;charset=utf-8';
//     let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}//获取登录时存放的user对象信息
//     if (user) { 
//         config.headers['token'] = user.token;  // 设置请求头
//     }
//     return config
// }, error => {
//     return Promise.reject(error)
// });

// response 拦截器
// 可以在接口响应后统一处理结果
// request.interceptors.response.use(
//     response => {
//         let res = response.data;
//         // 如果是返回的文件
//         if (response.config.responseType === 'blob') {
//             return res
//         }
//         // 兼容服务端返回的字符串数据
//         if (typeof res === 'string') {
//             res = res ? JSON.parse(res) : res
//         }
//         if (res.code != '200') {
//             ElementUI.Message.error(res.msg);
//         }
//         return res;
//     },
//     error => {
//         console.log('err' + error) // for debug
//         return Promise.reject(error)
//     }
// )

// 将创建的 Axios 实例 request 导出，以便在其他文件中使用
// 其他文件只需导入 request，即可使用该实例发送请求，而无需重新配置默认的 baseURL 和 timeout
export default request;