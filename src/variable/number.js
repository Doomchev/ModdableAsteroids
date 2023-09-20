import {Value} from "../value.js"
import {num} from "../system.js"

export default class NumericVariable extends Value {
    constructor(value) {
        super()
        this.value = num(value)
    }

    toNumber() {
        return this.value
    }

    toString() {
        return this.value
    }
}