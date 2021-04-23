import { IModel } from "./IModel";
import { IToken } from "./IToken";

export abstract class BaseModel implements IToken, IModel {
    public isMinted(): boolean {
        return this.getBlockchainOwnerId() != null
    }

    public isYours(): boolean {
        return (!this.isMinted() && this.getChannelId() == this.getCurrentUserChannelId()) ||
            this.getBlockchainOwnerId() == this.getCurrentUserBlockchainId()
    }

    public isListed(): boolean {
        return this.getTransactionsSize() > 0 //TODO condition is not correct (has price?)
    }

    public hasOffers(): boolean {
        return this.getOffersSize() > 0
    }

    public abstract getCurrentUserChannelId(): string

    public abstract getChannelId(): string

    public abstract getBlockchainOwnerId(): string

    public abstract getCurrentUserBlockchainId(): string

    public abstract getOffersSize(): number //TODO refactor to boolean

    public abstract getTransactionsSize(): number // probably redundant
}