export class ApiClient {

    constructor() {}

    setItem = (key: string, data: string): void => {
        localStorage.setItem(key, data)
    }

    getItem = (key: string): string | null => {
        return localStorage.getItem(key)
    }

    removeItem = (key: string): void => {
        localStorage.removeItem(key)
    }
}