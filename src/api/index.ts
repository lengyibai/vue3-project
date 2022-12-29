// @ts-nocheck

import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import {
  showFullScreenLoading,
  tryHideFullScreenLoading,
} from "@/api/helper/serviceLoading";
import { AxiosCanceler } from "./helper/axiosCancel";
import { ResultData } from "@/api/interface";
import { checkStatus } from "./helper/checkStatus";
import { ElMessage } from "element-plus";
import router from "@/router";

const axiosCanceler = new AxiosCanceler();

const config = {
  // 默认地址请求地址，可在 .env 开头文件中修改
  baseURL: import.meta.env.VITE_API_URL as string,
  // 设置超时时间（10s）
  timeout: 10000,
};

class RequestHttp {
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.service = axios.create(config);

    this.service.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        //将当前请求添加到 pending 中
        axiosCanceler.addPending(config);
        //如果当前请求不需要显示 loading

        config!.headers!.noLoading && showFullScreenLoading();
        const token = "6555";
        return {
          ...config,
          headers: { ...config.headers, "x-access-token": token },
        }; //扩展追加token
      },
      async (error: AxiosError) => {
        return await Promise.reject(error);
      }
    );

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data, config } = response;
        // const globalStore = GlobalStore();
        //在请求结束后，移除本次请求，并关闭请求 loading
        axiosCanceler.removePending(config);
        tryHideFullScreenLoading();
        //登陆失效（code == 599）
        if (data.code == 559) {
          ElMessage.error(data.msg);
          // globalStore.setToken(""); //清除token
          router.replace("/login");
          return Promise.reject(data);
        }
        //全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
        if (data.code && data.code !== 200) {
          ElMessage.error(data.msg);
          return Promise.reject(data);
        }
        //成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
        return data;
      },
      async (error: AxiosError) => {
        const { response } = error;
        tryHideFullScreenLoading();
        // 请求超时单独判断，因为请求超时没有 response
        if (error.message.includes("timeout"))
          ElMessage.error("请求超时！请您 稍后重试");
        // 根据响应的错误状态码，做不同的处理
        if (response != null) checkStatus(response.status);
        // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
        if (!window.navigator.onLine) router.replace("/500");
        return await Promise.reject(error);
      }
    );
  }

  //常用请求方法封装
  async get<T>(
    url: string,
    params?: object,
    _object = {}
  ): Promise<ResultData<T>> {
    return await this.service.get(url, { params, ..._object });
  }

  async post<T>(
    url: string,
    params?: object,
    _object = {}
  ): Promise<ResultData<T>> {
    return await this.service.post(url, params, _object);
  }

  async put<T>(
    url: string,
    params?: object,
    _object = {}
  ): Promise<ResultData<T>> {
    return await this.service.put(url, params, _object);
  }

  async delete<T>(
    url: string,
    params?: any,
    _object = {}
  ): Promise<ResultData<T>> {
    return await this.service.delete(url, { params, ..._object });
  }
}

export default new RequestHttp(config);
