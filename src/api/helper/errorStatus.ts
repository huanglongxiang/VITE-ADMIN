export function errorStart(code: string | number):string {
    let __msg__ = ''
    switch (code) {
        case 400:
            __msg__ = '请求失败！请您稍后重试'
            break;
        case 401:
            __msg__ = '登录失效！请您稍后重试'
            break;
        case 403:
            __msg__ = '当前账号无权限访问'
            break;
        case 404:
            __msg__ = '当前资源不存在'
            break;
        case 405:
            __msg__ = '请求方式错误！请您稍后重试'
            break;
        case 408:
            __msg__ = '接口超时！请您稍后重试'
            break;
        case 500:
            __msg__ = '服务异常'
            break;
        case 502:
            __msg__ = '网关错误'
            break;
        case 503:
            __msg__ = '服务不可用'
            break;
        case 504:
            __msg__ = '网关超时'
            break;
        default:
            __msg__ = '请求失败'
            break;
    }
    return __msg__
}