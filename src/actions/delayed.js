import {apsk} from "../system.js"
import {Action} from "./action.js"

export default class Delayed extends Action {
    constructor(key, coolDown) {
        super()
        this.key = key
        this.coolDown = coolDown
        this.time = 0.0
    }

    toBoolean() {
        if(this.time >= 0.0) {
            this.time -= apsk
            return false
        } else {
            if(!this.key.isDown) return false
            this.time = this.coolDown
            return true
        }
    }
}