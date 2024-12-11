import ApiService from './ApiService'

export async function logIn(email: string, password: string) {
    return ApiService.fetchDataWithAxios({
        url: '/token',
        method: 'POST',
        data: {
            email,
            password,
            scopes: ['full_access'],
        },
    })
}

export async function signUp(name: string, email: string, password: string) {
    return ApiService.fetchDataWithAxios({
        url: '/users',
        method: 'POST',
        data: {
            name,
            email,
            password,
        },
    })
}

export async function getHistory() {
    return ApiService.fetchDataWithAxios({
        url: '/requests/list',
        method: 'GET',
    })
}
