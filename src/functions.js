import {randomFloat, randomSign} from "./system.js"
import {Value} from "./value.js"

export class FloatFunction extends Value {
    getValue(fieldName) {
        return this.toFloat()
    }
}

export class RandomFloat extends FloatFunction {
    constructor(from, to) {
        super()
        this.from = from
        this.to = to
    }

    toFloat() {
        return randomFloat(this.from, this.to)
    }
}

export class RandomSign extends FloatFunction {
    toFloat() {
        return randomSign()
    }
}

export class Mul extends FloatFunction {
    constructor(value1, value2) {
        super()
        this.value1 = value1
        this.value2 = value2
    }

    toFloat() {
        return this.value1.toFloat() * this.value2.toFloat()
    }
}