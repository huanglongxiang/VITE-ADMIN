import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, } from "axios";
import axios from "axios";
import type { CustomAxiosRequestConfig, ResultData } from './interface/indexInterface'
import { endFullLoading, showFullLoading } from "@/hooks/useFullLoading";
import { ResultCode } from "@/enum/httpEnum";
import { ElMessage } from "element-plus";
import { errorStart } from "./helper/errorStatus";

const config = {
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 1000 * 60 * 5,
    headers: {
        "Content-Type": "application/json",
    }
}

class HttpRequest {
    service: AxiosInstance;
    public constructor(config: AxiosRequestConfig) {
        this.service = axios.create(config)
        
        this.service.interceptors.request.use(
            (config:CustomAxiosRequestConfig) => {
                config.cancel ??= true;
                config.loading ??= true;
                config.loading && showFullLoading()
                return config
            },
            (error:AxiosError) => {
                return Promise.reject(error)
            }
        )

        this.service.interceptors.response.use(
            (res:AxiosResponse & { config: CustomAxiosRequestConfig }) =>{
                let { data, config  } = res
                config.loading && endFullLoading()
                if(data.code && data.code !== ResultCode.SUCCESS){
                    ElMessage.error(data.message)
                    return Promise.reject(data)
                }
                return data;
            },
            async (error:AxiosError) => { 
                const { config, response } = error
                endFullLoading();
                // 请求浏览器错误
                if(error.code?.indexOf("timeout") !== -1) ElMessage.error("请求超时,请重试");
                if(error.code?.indexOf("Network Error") !== -1) ElMessage.error("网络错误，请您稍后重试")
                // 错误码处理
                if(response) console.error(errorStart(response.status)) 
                return Promise.reject(error)
            }
        )
    }
    get<T>(url:string, params?:object,_obj = {}):Promise<ResultData<T>>{
        return this.service.get(url, { params, ..._obj }) as Promise<ResultData<T>>;
    }
    post<T>(url:string, params?:object, _obj = {}):Promise<ResultData<T>>{
        return this.service.post(url, params, _obj) as Promise<ResultData<T>>;
    }
}
const http = new HttpRequest(config)
export default http