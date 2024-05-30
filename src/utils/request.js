// src/api.js
import axios from 'axios';

// 创建一个 axios 实例
const instance = axios.create({
    baseURL: 'http://localhost:8084', // 你的 API 基础 URL
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


// 其他方法如 PUT、DELETE 可以类似封装
export default request