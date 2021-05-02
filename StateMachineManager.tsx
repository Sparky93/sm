import { BaseModel } from "./BaseModel";
import { StateMachineFactory } from "./StateMachineFactory";
import { TemplatePageBuilder } from "./TemplatePageBuilder";
import { ContractMethods } from "../../ethereum/contractMethods";

export class StateMachineManager {
    public static observeRenderer(model: BaseModel, setBuilder, input, setInput) {
        this.observe(model, async (states) => {
            let newBuilder = TemplatePageBuilder
                .get()
                .addPrimaryComponent(model)
                .addTernaryComponent()

            for (let state of states) {
                switch (state) {
                    case 'minted':
                        if (states.includes('owned')) {
                            newBuilder.addTitle('You are the owner of this NFT')
                        }
                        break;
                    case 'unminted':
                        if (states.includes('unowned')) {
                            newBuilder
                                .addActionButton("MAKE BID", () => ContractMethods.bidNewVideo(model.getVideoId(), input, model.getCurrentUserBlockchainId()))
                                .addSecondaryComponent(setInput)
                        }
                        break;
                    case 'owned': break;
                    case 'unowned':
                        if (states.includes('listed')) {
                            const { tokenId, seller, minValue, onlySellTo } = await ContractMethods.getListedToken(model.getTokenId())

                            newBuilder
                                .addTitle('This video is listed')
                                .addDescription(`COST: ${minValue}`)
                                .addActionButton("BUY", () => ContractMethods.buyListedTokup(model.getTokenId(), model.getCurrentUserBlockchainId(), input))
                        } else if (states.includes('unlisted')) {
                            newBuilder
                                .addSecondaryComponent(setInput)
                                .addActionButton("MAKE AN OFFER", () => ContractMethods.makeOfferTokup(model.getTokenId(), model.getCurrentUserBlockchainId(), input))
                        }
                        break;
                    case 'listed':
                        // if onlySellTo != null && 
                        if (states.includes('owned')) {
                            const { tokenId, seller, minValue, onlySellTo } = await ContractMethods.getListedToken(model.getTokenId())

                            newBuilder
                                //.addActionButton('VIEW', () => { /* REDIRECT ON SELLING PANEL */ })
                                .addDescription(`LISTED FOR ${minValue}`)
                        }
                        break;
                    case 'unlisted':
                        if (states.includes('owned') && states.includes('offered')) {
                            const { bidder, value } = await ContractMethods.getOffer(model.getTokenId())

                            newBuilder
                                .addDescription(`You\'ve been offered ${value} by ${bidder}`)
                                .addActionButton("SELL", () => ContractMethods.sellByOffer(model.getTokenId(),
                                    model.getBlockchainOwnerId(), input))
                        }
                        break;
                    case 'bidded':
                        if (states.includes('unminted') && states.includes('owned')) {
                            const { bidder, value } = await ContractMethods.getHighestBid(model.getVideoId())

                            newBuilder
                                .addTitle(`The highest bid is from ${bidder} for ${value}`)
                                .addActionButton("SELL", () => ContractMethods.sellByBid(model.getVideoId(),
                                    model.getCurrentUserBlockchainId(), model.getBlockchainOwnerId()))
                        }
                        break
                    case 'unbidded':
                        if (states.includes('unminted') && states.includes('owned')) {
                            newBuilder
                                .addTitle('You can MINT and SELL this')
                                .addSecondaryComponent(setInput)
                                .addActionButton("MINT & LIST", async () => {
                                    await ContractMethods.mint(model.getVideoId(), model.getCurrentUserBlockchainId())
                                    const tokenId = await ContractMethods.getTokenId(model.getVideoId())
                                    await ContractMethods.listTokup(model.getCurrentUserBlockchainId(), tokenId, input, null)
                                })
                        }
                        break;
                    case 'offered': break;
                    case 'unoffered':
                        if (states.includes('unlisted') && states.includes('owned')) {
                            newBuilder
                                .addSecondaryComponent(setInput)
                                .addActionButton("LIST", () => ContractMethods.listTokup(model.getCurrentUserBlockchainId(), model.getTokenId(), input, null))
                        }
                        break;
                }
            }
            setBuilder(newBuilder)
        })
    }

    private static observe(model, callback) {
        const sm = StateMachineFactory.makeStateMachine(model)
        sm.onTransition(state => {
            console.log(`GOT FULL STATE: {"${sm.id}":${JSON.stringify(state.value)}}`)
            let states = []
            states.push(sm.id.toString())
            this.getRecursiveFinalStates(state.value, (state) => states.push(state.toString()))
            this.getRecursiveCompoundStates(state.value, (state) => states.push(state.toString()))
            callback(states)
        })
        sm.start()
    }

    private static getRecursiveCompoundStates(obj, callback) {
        for (let k in obj) {
            if (typeof obj[k] === "object") {
                this.getRecursiveCompoundStates(obj[k], callback)
            } else {
                callback(obj[k]);
            }
        }
    }

    private static getRecursiveFinalStates(obj, callback) {
        for (let k in obj) {
            if (typeof obj[k] === "object") {
                callback(k);
                this.getRecursiveFinalStates(obj[k], callback)
            } else {
                callback(k);
            }
        }
    }
}