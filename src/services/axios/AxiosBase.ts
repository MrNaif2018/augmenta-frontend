import axios from 'axios'
import appConfig from '@/config'
import AxiosRequestInterceptorConfigCallback from './AxiosRequestInterceptorConfigCallback'

const AxiosBase = axios.create({
    timeout: 300000,
    baseURL: appConfig.apiPrefix,
})

AxiosBase.interceptors.request.use(
    (config) => {
        return AxiosRequestInterceptorConfigCallback(config)
    },
    (error) => {
        return Promise.reject(error)
    },
)

export default AxiosBase
