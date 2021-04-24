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
        return this.hasPrice()
    }

    public isOffered(): boolean {
        return this.hasOffers()
    }

    public isBidded(): boolean {
        return this.hasBids()
    }

    public abstract getCurrentUserChannelId(): string

    public abstract getChannelId(): string

    public abstract getBlockchainOwnerId(): string

    public abstract getCurrentUserBlockchainId(): string

    public abstract hasOffers(): boolean

    public abstract hasPrice(): boolean

    public abstract hasBids(): boolean
}