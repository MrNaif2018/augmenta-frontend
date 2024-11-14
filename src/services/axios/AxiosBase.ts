import axios from 'axios'
import appConfig from '@/config'

const AxiosBase = axios.create({
    timeout: 60000,
    baseURL: appConfig.apiPrefix,
})

export default AxiosBase
