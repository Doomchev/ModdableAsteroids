import {Function} from "../function.js"
import {num} from "../system.js"

export default class NumericVariable extends Function {
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