import {Value} from "../value.js"
import {num} from "../system.js"
import {project} from "../project.js"

export default class NumericVariable extends Value {
    constructor(name, value, format) {
        super()
        if(name) project._object[name] = this
        this.value = num(value)
        this.format = format
    }

    equateTo(value) {
        this.value = num(value)
    }

    add(value) {
        this.value += value
    }

    toNumber() {
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