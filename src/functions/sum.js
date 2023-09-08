import FloatFunction from "./float.js"

export default class Sum extends FloatFunction {
    constructor(value1, value2) {
        super()
        this.value1 = value1
        this.value2 = value2
    }

    toFloat() {
        return this.getVal(this.value1) + this.getVal(this.value2)
    }
}