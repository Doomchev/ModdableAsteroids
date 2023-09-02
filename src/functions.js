import {randomFloat, randomSign} from "./system.js"
import {Value} from "./value.js"

export class NumberFunction extends Value {
    getValue(fieldName) {
        return this.float
    }
}

export class RandomFloat extends NumberFunction {
    constructor(from, to) {
        super()
        this.from = from
        this.to = to
    }

    get float() {
        return randomFloat(this.from, this.to)
    }
}

export class RandomSign extends NumberFunction {
    get float() {
        return randomSign()
    }
}

export class Mul extends NumberFunction {
    constructor(value1, value2) {
        super()
        this.value1 = value1
        this.value2 = value2
    }

    get float() {
        return this.value1.float * this.value2.float
    }
}