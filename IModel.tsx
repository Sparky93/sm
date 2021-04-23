export interface IModel {
    getBlockchainOwnerId(): string
    getCurrentUserBlockchainId(): string
    getOffersSize(): number
    isListed(): boolean
    getCurrentUserChannelId(): string
    getChannelId(): string
}