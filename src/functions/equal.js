import {BooleanFunction} from "./boolean.js"
import {Value} from "../value.js"

export default class IntIsEqual extends BooleanFunction {
    constructor(value1, value2) {
        super()
        this.value1 = value1
        this.value2 = value2
    }

    toBoolean() {
        return this.value1.toInt() === (this.value2 instanceof Value ? this.value2.toInt() : this.value2)
    }
}
