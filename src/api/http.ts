import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { message } from 'ant-design-vue'
import showCodeMessage from '~/api/code'
import type { instanceObject } from '~/utils/format'
import { formatJsonToUrlParams } from '~/utils/format'

const BASE_PREFIX = `${import.meta.env.VITE_API_BASEURL}`

// Create instance
const axiosInstance: AxiosInstance = axios.create({
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
axiosInstance.interceptors.request.use(
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
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200)
      return response

    message.info(JSON.stringify(response.status))
    return response
  },
  (error: AxiosError) => {
    const { response } = error
    if (response) {
      message.error(showCodeMessage(response.status))
      return Promise.reject(response.data)
    }
    message.warning('The network connection is abnormal, please try again later!')
    return Promise.reject(error)
  },
)
const service = {
  get: (url: string, data?: object) => axiosInstance.get(url, { params: data }),
  post: (url: string, data?: object) => axiosInstance.post(url, data),
  put: (url: string, data?: object) => axiosInstance.put(url, data),
  delete: (url: string, data?: object) => axiosInstance.delete(url, data),
  upload: (url: string, file: File) =>
    axiosInstance.post(url, file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  download: (url: string, data: instanceObject) => {
    const downloadUrl = `${BASE_PREFIX}/${url}?${formatJsonToUrlParams(data)}`
    window.location.href = downloadUrl
  },
}

export default service
