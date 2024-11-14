import ApiService from './ApiService'

export async function getSummary(name: string) {
    return ApiService.fetchDataWithAxios({
        url: '/lookup',
        method: 'POST',
        data: {
            name,
        },
    })
}
