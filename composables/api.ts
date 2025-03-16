import type { FetchResult, UseFetchOptions } from 'nuxt/app'
import type { ApiResponse, ErrorResponse } from '~/interfaces/api'

type HTTPMethod =
  | 'get'
  | 'head'
  | 'patch'
  | 'post'
  | 'put'
  | 'delete'
  | 'connect'
  | 'options'
  | 'trace'
type ApiParamsRequired<T> = {
  url: string
  options?: UseFetchOptions<T>
}

/**
 * Classe abstrata para realizar chamadas à API com autenticação opcional.
 */
export abstract class Api {
  /**
   * Método para realizar uma chamada à API.
   *
   * @param {string} url - A URL da API.
   * @param {HttpMethod} method - O método HTTP a ser utilizado.
   * @param {object} [options={}] - Opções adicionais para a requisição.
   * @param {boolean} =false] - Se deve ignorar o token de autenticação.
   * @returns {Promise<ApiResponse>} - A resposta da API.
   */
  protected static async fetchApi<Data>(
    url: string,
    method: HTTPMethod
    // params: UseFetchOptions<Data> = {}
  ): Promise<ApiResponse<Data>> {
    const headers: Record<string, string> = {}

    const options: UseFetchOptions<Data> = {
      method: method,
      baseURL: import.meta.env.VITE_BASE_URL,
      server: false,
      headers,
      watch: false,
    }

    const { data, status, error } = await useFetch(url, options)
    // tem que ajustar aqui pra funcionar certo se der erro na requisição, tipo um 404

    return { data, status, error }
  }

  /**
   * Realiza uma requisição GET à API.
   *
   * @param {ApiParamsRequired} params - Os parâmetros da requisição.
   * @returns {Promise<ApiResponse>} - A resposta da API.
   */
  public static async get<Data>({ url }: ApiParamsRequired<Data>) {
    return this.fetchApi<Data>(url, 'get')
  }

  // /**
  //  * Realiza uma requisição POST à API.
  //  *
  //  * @param {ApiParamsRequired} params - Os parâmetros da requisição.
  //  * @returns {Promise<ApiResponse>} - A resposta da API.
  //  */
  // public static async post<Data>({ url, options }: ApiParamsRequired<Data>) {
  //   return this.fetchApi<Data>(url, 'POST', options)
  // }

  // /**
  //  * Realiza uma requisição PATCH à API.
  //  *
  //  * @param {ApiParamsRequired} params - Os parâmetros da requisição.
  //  * @returns {Promise<ApiResponse>} - A resposta da API.
  //  */
  // public static async patch<Data>({ url, options }: ApiParamsRequired<Data>) {
  //   return this.fetchApi<Data>(url, 'PATCH', options)
  // }

  // /**
  //  * Realiza uma requisição PUT à API.
  //  *
  //  * @param {ApiParamsRequired} params - Os parâmetros da requisição.
  //  * @returns {Promise<ApiResponse>} - A resposta da API.
  //  */
  // public static async put<Data>({ url, options }: ApiParamsRequired<Data>) {
  //   return this.fetchApi<Data>(url, 'PUT', options)
  // }

  // /**
  //  * Realiza uma requisição DELETE à API.
  //  *
  //  * @param {ApiParamsRequired} params - Os parâmetros da requisição.
  //  * @returns {Promise<ApiResponse>} - A resposta da API.
  //  */
  // public static async delete<Data>({ url, options }: ApiParamsRequired<Data>) {
  //   return this.fetchApi<Data>(url, 'DELETE', options)
  // }
}

