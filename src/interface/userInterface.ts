export interface ApiResponse {
  code: number
  data: {
    message: string
    data: any[]
  }
}