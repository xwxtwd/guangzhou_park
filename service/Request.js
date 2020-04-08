/**
 * Created by J.Son on 2020/4/8
 */
const axios = require('axios');

class Request {
  http = axios;

  constructor ({baseURL = '', timeout = 10000, headers = {}}) {
    // console.log(baseURL)
    this.http = axios.create({
      baseURL,
      timeout,
      headers,
    });
    // 添加请求拦截器
    this.http.interceptors.request.use((config) => {
      // 在发送请求之前做些什么
      let {headers, data = {}, params = {}} = config;
      Object.keys(data).forEach(key => data && (typeof data[key] === 'undefined' || data[key] === null || data[key] === '') && delete data[key]);
      Object.keys(params).forEach(key => params && (typeof params[key] === 'undefined' || params[key] === null || params[key] === '') && delete params[key]);
      return config;
    }, error => {
      // 对请求错误做些什么
      Promise.reject(error);
    });

    // 添加响应拦截器
    this.http.interceptors.response.use((response) => {
      // 对响应数据做点什么
      return response.data;
    }, error => {
      // 对响应错误做点什么
      console.error('网络异常:', error);
      return Promise.reject({detailMessage: '网络出现了异常，稍后再试试'});
    });
  }

  fetch ({
           method = 'get',
           headers = {},
           url = '',
           params,
           data,
         }) {
    return this.http({
      method,
      headers,
      url,
      params,
      data,
    });
  }

  get (url, params = {}, headers) {
    return this.fetch({
      url,
      params,
      headers,
    });
  }

  post (url, data = {}, headers) {
    return this.fetch({
      method: 'POST',
      url,
      data,
      headers,
    });
  }

  upload (url, data = {}, headers) {
    return this.fetch({
      method: 'POST',
      url,
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...headers,
      },
    });
  }
}

export default Request;
