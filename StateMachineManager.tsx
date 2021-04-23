import { StateMachineFactory } from "./StateMachineFactory";

export class StateMachineManager {
    public static observe(model, callback) {
        const sm = StateMachineFactory.makeStateMachine(model)
        sm.onTransition(state => {
            console.log(`GOT FULL STATE: {"${sm.id}":${JSON.stringify(state.value)}}`)
            callback(JSON.stringify(sm.id)) // emit the type of machine as a state
            this.printRecursiveFinalStates(state.value, callback)
            this.printRecursiveCompoundStates(state.value, callback)
        })
        sm.start()
    }

    public static printRecursiveCompoundStates(obj, callback) {
        for (let k in obj) {
            if (typeof obj[k] === "object") {
                this.printRecursiveCompoundStates(obj[k], callback)
            } else {
                callback(JSON.stringify(obj[k]));
            }
        }
    }

    public static printRecursiveFinalStates(obj, callback) {
        for (let k in obj) {
            if (typeof obj[k] === "object") {
                callback(JSON.stringify(k));
                this.printRecursiveFinalStates(obj[k], callback)
            } else {
                callback(JSON.stringify(k));
            }
        }
    }
}