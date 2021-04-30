import { BaseModel } from "./BaseModel";
import { StateMachineFactory } from "./StateMachineFactory";
import { TemplatePageBuilder } from "./TemplatePageBuilder";
import { mintAndList} from "./IMethods";
import { ContractMethods } from "../../ethereum/contractMethods";

export class StateMachineManager {
    public static observeRenderer(model: BaseModel, setBuilder) {
        this.observe(model, (states) => {
            let newBuilder = TemplatePageBuilder
                .get()
                .addPrimaryComponent(model)
                .addTernaryComponent()
                
                const contractMethods = new ContractMethods();
            
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
                                .addActionButton("MAKE BID", () => contractMethods.bidNewVideo())
                                .addSecondaryComponent()
                        }
                        break;
                    case 'owned': break;
                    case 'unowned':
                        if (states.includes('listed')) {
                            newBuilder
                                .addTitle('This video is listed')
                                .addDescription('COST: 100$ | 0.4 ETH')
                                .addActionButton("BUY", () => contractMethods.buyListedTokup())
                        } else if (states.includes('unlisted')) {
                            newBuilder
                                .addSecondaryComponent()
                                .addActionButton("MAKE AN OFFER", () => contractMethods.makeOfferTokup())
                        }
                        break;
                    case 'listed':
                        // if onlySellTo != null && 
                        if (states.includes('owned')) {
                            newBuilder
                                //.addActionButton('VIEW', () => { /* REDIRECT ON SELLING PANEL */ })
                                .addDescription('LISTED FOR 0.4 ETH')
                        }
                        break;
                    case 'unlisted':
                        if (states.includes('owned') && states.includes('offered')) {
                            newBuilder
                                .addDescription('You\'ve been offered 0.4 ETH by 0x048959FHJSFHJ*&')
                                .addActionButton("SELL", () => contractMethods.sellByOffer())
                        }
                        break;
                    case 'bidded':
                        if (states.includes('unminted') && states.includes('owned')) {
                            newBuilder
                                .addTitle('The highest bid is from 0x048959FHJSFHJ*& for 0.4 ETH')
                                .addActionButton("SELL", () => contractMethods.sellByBid())
                        }
                        break
                    case 'unbidded':
                        if (states.includes('unminted') && states.includes('owned')) {
                            newBuilder
                                .addTitle('You can MINT and SELL this')
                                .addSecondaryComponent()
                                .addActionButton("MINT & LIST", () => mintAndList())
                        }
                        break;
                    case 'offered': break;
                    case 'unoffered':
                        if (states.includes('unlisted') && states.includes('owned')) {
                            newBuilder
                                .addSecondaryComponent()
                                .addActionButton("LIST", () => contractMethods.listTokup())
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