import {Value} from "../value.js"

export class IntVariable extends Value {
    constructor(name, value, format) {
        super()
        if(name) this._name = name
        this.value = value
        this.format = format
    }

    equateTo(value) {
        this.value = value.toInt()
    }

    add(value) {
        this.value += value
    }

    toInt() {
        return this.value
    }

    toString() {
        if (this.format === undefined) {
        } else if (this.format.startsWith("Z")) {
            let string = this.value.toString()
            return "0".repeat(parseInt(this.format.substring(1)) - string.length) + string
        } else if (this.format.startsWith("R")) {
            return this.format.substring(1).repeat(this.value)
        }
        return this.value
    }
}