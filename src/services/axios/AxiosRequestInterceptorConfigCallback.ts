import type { InternalAxiosRequestConfig } from 'axios'

const AxiosRequestInterceptorConfigCallback = async (
    config: InternalAxiosRequestConfig,
) => {
    const accessToken = localStorage.getItem('token') || ''
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
}

export default AxiosRequestInterceptorConfigCallback
