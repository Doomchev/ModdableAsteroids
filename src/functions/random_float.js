import {getValue, randomFloat} from "../system.js"
import NumberFunction from "./number_function.js"

export default class RandomFloat extends NumberFunction {
    constructor(from, to) {
        super()
        this.from = from
        this.to = to
    }

    toNumber() {
        return randomFloat(getValue(this.from), getValue(this.to))
    }
}