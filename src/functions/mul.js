import FloatFunction from "./float.js"

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