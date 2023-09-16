import {Value} from "../value.js"
import {num, setName} from "../system.js"

export default class NumericVariable extends Value {
    constructor(name, value, format) {
        super()
        setName(this, name)
        this.value = num(value)
        this.format = format
    }

    toNumber() {
        return this.value
    }

    toString() {
        return this.value
    }
}