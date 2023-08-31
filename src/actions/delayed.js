import {fpsk, Value} from "../system.js"

export default class Delayed extends Value {
    constructor(condition, coolDown) {
        super()
        this.condition = condition
        this.coolDown = coolDown
        this.time = 0.0
    }

    toBoolean() {
        if(this.time >= 0.0) {
            this.time -= fpsk
            return false
        } else {
            if(!this.condition.toBoolean()) return false
            this.time = this.coolDown
            return true
        }
    }
}