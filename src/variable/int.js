import {Value} from "../value.js"

export class IntVariable extends Value {
    constructor(value, format) {
        super()
        this._value = value
        this.format = format
    }

    equateTo(value) {
        this._value = value.toInt()
    }

    add(value) {
        this._value += value
    }

    toInt() {
        return this._value
    }

    toString() {
        if (this.format === undefined) {
        } else if (this.format.startsWith("Z")) {
            let string = this._value.toString()
            return "0".repeat(parseInt(this.format.substring(1)) - string.length) + string
        } else if (this.format.startsWith("R")) {
            return this.format.substring(1).repeat(this._value)
        }
        return this._value
    }
}