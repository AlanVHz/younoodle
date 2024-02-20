export class SessionStorageClient {
    
    constructor() {}

    setItem = (key: string, data: string): void => {
        sessionStorage.setItem(key, data)
    }

    getItem = (key: string): string | null => {
        return sessionStorage.getItem(key)
    }

    removeItem = (key: string): void => {
        sessionStorage.removeItem(key)
    }
}