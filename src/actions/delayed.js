import {Action, apsk} from "../system.js"

export default class Delayed extends Action {
    constructor(condition, coolDown) {
        super()
        this.condition = condition
        this.coolDown = coolDown
        this.time = 0.0
    }

    toBoolean() {
        if(this.time >= 0.0) {
            this.time -= apsk
            return false
        } else {
            if(!this.condition.toBoolean()) return false
            this.time = this.coolDown
            return true
        }
    }
}