import {randomFloat} from "../system.js"
import FloatFunction from "./float.js"

export default class RandomFloat extends FloatFunction {
    constructor(from, to) {
        super()
        this.from = from
        this.to = to
    }

    toFloat() {
        return randomFloat(this.from, this.to)
    }
}