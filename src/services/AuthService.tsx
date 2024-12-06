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

export async function signUp(email: string, password: string) {
    return ApiService.fetchDataWithAxios({
        url: '/users',
        method: 'POST',
        data: {
            email,
            password,
        },
    })
        .then((res) => res.data)
        .catch(() => null)
}
