import http from "../index";
import type { ResultData } from "../interface/indexInterface";

// 登录接口
export const login = (username: string, password: string) => {
    return http.post("/login", { username, password })    
}

// 获取用户列表
export const getUserList = (params?: any):Promise<ResultData> => {
    return http.get("/api/user/list", params || {}) as Promise<ResultData>
}

// 获取用户信息
export const getUserInfo = () => {
    return  http.get("/user/info", {})
}

// 获取仪表板统计
export const getDashboardStats = () => {
    return http.get("/dashboard/stats", {})
}