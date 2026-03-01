import { postAPI, getAPI } from "@/utils/fetch";
import type { ApiResponse } from "../interface/userInterface";

// 登录接口
export const login = (username: string, password: string) => {
    return postAPI("/login", { username, password })    
}

// 获取用户列表
export const getUserList = (params?: any) => {
    return getAPI("/api/user/list", params || {}) as Promise<ApiResponse>
}

// 获取用户信息
export const getUserInfo = () => {
    return getAPI("/user/info", {})
}

// 获取仪表板统计
export const getDashboardStats = () => {
    return getAPI("/dashboard/stats", {})
}