import { StateMachineFactory } from "./StateMachineFactory";

export class StateMachineManager {
    public static observe(model, callback) {
        const sm = StateMachineFactory.makeStateMachine(model)
        sm.onTransition(state => {
            console.log(`GOT FULL STATE: {"${sm.id}":${JSON.stringify(state.value)}}`)
            let states = []
            states.push(sm.id.toString())
            //onNext(sm.id) // emit the type of machine as a state
            this.getRecursiveFinalStates(state.value, (state) => states.push(state.toString()))
            this.getRecursiveCompoundStates(state.value, (state) => states.push(state.toString()))
            callback(states)
        })
        sm.start()
    }

    public static getRecursiveCompoundStates(obj, callback) {
        for (let k in obj) {
            if (typeof obj[k] === "object") {
                this.getRecursiveCompoundStates(obj[k], callback)
            } else {
                callback(obj[k]);
            }
        }
    }

    public static getRecursiveFinalStates(obj, callback) {
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