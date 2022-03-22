import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { message } from 'ant-design-vue'
import { token } from '~/stores'
import showCodeMessage from '~/api/code'
import type { instanceObject } from '~/utils/format'
import { formatJsonToUrlParams } from '~/utils/format'

const BASE_PREFIX = `${import.meta.env.VITE_API_AUTH}`

// Create instance
export const http: AxiosInstance = axios.create({
  // prefix
  baseURL: BASE_PREFIX,
  // time out
  timeout: 1000 * 30,
  // request header
  headers: {
    'Content-Type': 'application/json',
  },
})

// request interceptor
http.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // TODO Here you can add the logic you want to process before the request is sent
    // TODO for example loading Wait
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// response interceptor
http.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200)
      return response

    message.info(JSON.stringify(response.status))
    return response
  },
  (error: AxiosError) => {
    const { response } = error
    if (response) {
      if (response.status === 401)
        token.value = null

      message.error(showCodeMessage(response.status))
      return Promise.reject(response.data)
    }
    message.warning('The network connection is abnormal, please try again later!')
    return Promise.reject(error)
  },
)
const service = {
  post: (url: string, data?: object) => http.post(url, data),
  patch: (url: string, data?: object) => http.patch(url, data),
}

watch(token, () => {
  http.interceptors.request.use((config: any) => {
    if (token.value && token.value.length)
      config.headers.token = token.value
    else
      delete config.headers.token

    return config
  }, (err) => {
    return Promise.reject(err)
  })
}, { immediate: true })

export default service
