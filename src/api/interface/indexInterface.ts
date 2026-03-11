import type { InternalAxiosRequestConfig } from "axios";

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  /**
   * 是否显示加载中
   */
  loading?: boolean;
  cancel?: boolean;
}

export interface Result {
  code: string,
  msg: string
}
export interface ResultDataType<T = any>  {
    data: T,
    message: string
}

export interface ResultData<T = any> extends Result {
    data: ResultDataType<T>
}