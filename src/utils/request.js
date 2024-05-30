import axios from 'axios';
import ElementUI from 'element-ui';
// 这是 Axios 提供的一个方法，用于创建一个自定义配置的 Axios 实例。
// 通过这种方式，可以创建多个 Axios 实例，每个实例可以有自己的默认配置。
const request = axios.create({
    // 设置请求的基础 URL。在这里，设置为 /api，意味着所有的请求将以 /api 作为前缀发送。这样可以简化发送请求时的 URL，只需要提供相对路径即可。
    //baseURL: '/api',
    //设置请求超时时间，单位是毫秒。在这里设置为 5000，表示请求将在 5000 毫秒（即 5 秒）后超时。
    timeout: 10000
})


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