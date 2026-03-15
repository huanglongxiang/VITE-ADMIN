import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import type { CustomAxiosRequestConfig, ResultData } from './interface/indexInterface'
import { endFullLoading, showFullLoading } from "@/hooks/useFullLoading";
import { ResultCode } from "@/enum/httpEnum";
import { ElMessage } from "element-plus";
import { errorStart } from "./helper/errorStatus";
import axiosRetry from "axios-retry";

// HTTP 默认配置
const config = {
    baseURL: import.meta.env.VITE_BASE_URL,  // 基础 URL，从环境变量读取
    timeout: 1000 * 60 * 5,                   // 请求超时时间：5 分钟
    headers: {
        "Content-Type": "application/json",   // 默认请求头
    }
}

/**
 * HTTP 请求工具类
 * 封装 axios，提供统一的请求拦截、响应拦截、重试机制
 */
class HttpRequest {
    service: AxiosInstance;  // axios 实例
    
    /**
     * 构造函数
     * @param config - axios 配置项
     */
    public constructor(config: AxiosRequestConfig) {
        // 创建 axios 实例
        this.service = axios.create(config)
        
        /**
         * 配置 axios-retry 重试机制
         * 作用：在网络错误或服务器错误时自动重试，提高请求成功率
         */
        axiosRetry(this.service, {
            retries: 3,  // 最大重试次数：3 次
            /**
             * 重试延迟策略
             * @param retryCount - 当前重试次数（从 1 开始）
             * @returns 延迟毫秒数
             * 示例：第 1 次重试延迟 1s，第 2 次延迟 2s，第 3 次延迟 3s
             */
            retryDelay: (retryCount: number) => {
                return retryCount * 1000;  // 递增延迟
            },
            /**
             * 重试条件判断
             * @param error - 错误对象
             * @returns 是否满足重试条件
             * 规则：网络错误（无响应）或 5xx 服务器错误时重试
             */
            retryCondition: (error: AxiosError) => {
                return !error.response || (error.response?.status >= 500);
            }
        }); 

        /**
         * 请求拦截器
         * 在请求发送前执行
         */
        this.service.interceptors.request.use(
            /**
             * 成功回调
             * @param config - 请求配置
             * @returns 处理后的配置
             */
            (config: CustomAxiosRequestConfig) => {
                // 初始化默认配置
                config.cancel ??= true;    // 默认取消之前的相同请求
                config.loading ??= true;   // 默认显示加载动画
                
                // 如果需要显示加载动画
                config.loading && showFullLoading();
                
                return config;
            },
            /**
             * 失败回调
             * @param error - 错误对象
             * @returns 拒绝的 Promise
             */
            (error: AxiosError) => {
                return Promise.reject(error);
            }
        );

        /**
         * 响应拦截器
         * 在收到响应后执行
         */
        this.service.interceptors.response.use(
            /**
             * 成功回调
             * @param res - 响应对象
             * @returns 处理后的数据
             */
            (res: AxiosResponse & { config: CustomAxiosRequestConfig }) => {
                const { data, config } = res;
                
                // 关闭加载动画
                config.loading && endFullLoading();
                
                // 检查业务状态码
                if (data.code && data.code !== ResultCode.SUCCESS) {
                    // 业务错误，显示错误消息并拒绝 Promise
                    ElMessage.error(data.message);
                    return Promise.reject(data);
                }
                
                // 返回成功数据
                return data;
            },
            /**
             * 失败回调
             * @param error - 错误对象
             * @returns 拒绝的 Promise
             */
            async (error: AxiosError) => {
                const { config, response } = error;
                
                // 关闭加载动画
                endFullLoading();
                
                // 客户端错误处理
                if (error.code?.indexOf("timeout") !== -1) {
                    // 请求超时
                    ElMessage.error("请求超时，请重试");
                }
                
                if (error.code?.indexOf("Network Error") !== -1) {
                    // 网络连接错误
                    ElMessage.error("网络错误，请您稍后重试");
                }
                
                // 服务端错误处理（根据状态码显示对应提示）
                if (response) {
                    console.error(errorStart(response.status));
                }
                
                return Promise.reject(error);
            }
        );
    }
    
    /**
     * GET 请求方法
     * @template T - 响应数据的类型
     * @param url - 请求 URL
     * @param params - 查询参数
     * @param _obj - 其他配置项
     * @returns Promise<ResultData<T>>
     */
    get<T>(url: string, params?: object, _obj = {}): Promise<ResultData<T>> {
        return this.service.get(url, { params, ..._obj }) as Promise<ResultData<T>>;
    }
    
    /**
     * POST 请求方法
     * @template T - 响应数据的类型
     * @param url - 请求 URL
     * @param params - 请求体参数
     * @param _obj - 其他配置项
     * @returns Promise<ResultData<T>>
     */
    post<T>(url: string, params?: object, _obj = {}): Promise<ResultData<T>> {
        return this.service.post(url, params, _obj) as Promise<ResultData<T>>;
    }
}

// 创建 HTTP 实例并导出
const http = new HttpRequest(config);
export default http;