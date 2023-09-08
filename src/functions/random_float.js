import {getValue, randomFloat} from "../system.js"
import FloatFunction from "./float.js"

export default class RandomFloat extends FloatFunction {
    constructor(from, to) {
        super()
        this.from = from
        this.to = to
    }

    toFloat() {
        return randomFloat(getValue(this.from), getValue(this.to))
    }
}