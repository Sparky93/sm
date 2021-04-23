import { createMachine, interpret } from "xstate";
import { BaseModel } from "./BaseModel";

export class StateMachineFactory {
    static makeStateMachine(model: BaseModel) {
        let stateMachine = null
        if (model.isMinted()) {
            stateMachine = createMachine({
                id: 'minted',
                type: 'compound',
                initial: model.isYours() ? 'owned' : 'unowned',
                states: {
                    owned: {
                        initial: model.isListed() ? 'listed' : 'unlisted',
                        type: 'compound',
                        states: {
                            listed: { type: 'final' },
                            unlisted: {
                                type: 'compound',
                                initial: model.hasOffers() ? 'offered' : 'unoffered',
                                states: {
                                    offered: { type: 'final' },
                                    unoffered: { type: 'final' }
                                }
                            }
                        }
                    },
                    unowned: {
                        initial: model.isListed() ? 'listed' : 'unlisted',
                        states: {
                            listed: { type: 'final' },
                            unlisted: {
                                initial: model.hasOffers() ? 'offered' : 'unoffered',
                                states: {
                                    offered: { type: 'final' },
                                    unoffered: { type: 'final' }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            stateMachine = createMachine({
                id: 'unminted',
                initial: model.hasOffers() ? 'bidded' : 'unbidded',
                type: 'compound',
                states: {
                    bidded: {
                        initial: model.isYours() ? 'owned' : 'unowned',
                        states: {
                            owned: { type: 'final' },
                            unowned: { type: 'final' }
                        }
                    },
                    unbidded: {
                        initial: model.isYours() ? 'owned' : 'unowned',
                        states: {
                            owned: { type: 'final' },
                            unowned: { type: 'final' }
                        }
                    }
                }
            })
        }
        return interpret(stateMachine)
    }
}