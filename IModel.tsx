export interface IModel {
    getBlockchainOwnerId(): string
    getCurrentUserBlockchainId(): string
    getCurrentUserChannelId(): string
    getChannelId(): string
    getTokenId(): number
    hasOffers(): boolean
    hasBids(): boolean
}