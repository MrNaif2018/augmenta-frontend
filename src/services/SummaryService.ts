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

type SummaryResult = {
    data: Record<string, any>
}

export async function getSummaryResult(name: string) {
    return ApiService.fetchDataWithAxios<SummaryResult>({
        url: `/requests/search/${name}`,
        method: 'GET',
    })
        .then((res) => res.data)
        .catch(() => null)
}

export async function getRequestByID(id: string) {
    return ApiService.fetchDataWithAxios<SummaryResult>({
        url: `/requests/${id}`,
        method: 'GET',
    })
}
