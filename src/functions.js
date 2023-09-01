import {randomFloat} from "./system.js"
import {Value} from "./value.js"

export class RandomFloat extends Value {
    constructor(from, to) {
        super()
        this.from = from
        this.to = to
    }

    toFloat() {
        return randomFloat(this.from, this.to)
    }
}