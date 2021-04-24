export interface IToken {
    isMinted(): boolean
    isYours(): boolean
    isListed(): boolean
    isOffered(): boolean
}