export interface ApiResponse<T = any> {
  // tem que ajustar aqui
  data?: any
  error?: any
  status?: any
}

export interface ErrorResponse {
  url: string
  statusCode: number
  statusMessage: string
  message: string
  stack: string
}

export type CreateResponse = {
  message: string
}

export type UpdateResponse = CreateResponse

