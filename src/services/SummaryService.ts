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

export async function getSummaryResult(id: string) {
    return ApiService.fetchDataWithAxios<SummaryResult>({
        url: `/requests/${id}`,
        method: 'GET',
    }).then((res) => res.data)
}
