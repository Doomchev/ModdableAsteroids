import NumberFunction from "./number_function.js"
import {num} from "../system.js"

export default class Sum extends NumberFunction {
    constructor(value1, value2) {
        super()
        this.value1 = value1
        this.value2 = value2
    }

    toNumber() {
        return num(this.value1) + num(this.value2)
    }
}