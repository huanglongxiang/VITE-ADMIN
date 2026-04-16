export interface ApiResponse {
  code: number
  data: {
    message: string
    data: any[]
  }
}
export interface RuleForm {
    username: string
    password: string
    captcha: string
}