import {apsk} from "../system.js"
import {Value} from "../value.js"

export default class Delayed extends Value {
    constructor(condition, coolDown) {
        super()
        this.condition = condition
        this.coolDown = coolDown
        this.time = 0.0
    }

    get boolean() {
        if(this.time >= 0.0) {
            this.time -= apsk
            return false
        } else {
            if(!this.condition.boolean) return false
            this.time = this.coolDown
            return true
        }
    }
}