export interface SeedsResponse {
    royale: string[]
    daily: {
        production: string
        staging: string
        dev: string
    }
    hourly: {
        production: string
        staging: string
        dev: string
    }
}
