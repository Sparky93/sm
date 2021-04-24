export interface IModel {
    getBlockchainOwnerId(): string
    getCurrentUserBlockchainId(): string
    getCurrentUserChannelId(): string
    getChannelId(): string
    hasOffers(): boolean
    hasBids(): boolean
}